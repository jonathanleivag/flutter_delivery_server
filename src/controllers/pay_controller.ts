import { Request, Response } from 'express'
import { AxiosMercadoPagoUtil, DataJsonResUtil, IsAuth } from '../utils'
import mercadopago from 'mercadopago'
import Environments from '../config/env'
import {
  CreatePreferencePayload,
  PreferenceItem,
  PreferencePayer
} from 'mercadopago/models/preferences/create-payload.model'
import { ShoppModel } from '../db/mongodb/models'
import PayValidation from '../validations/pay_validation'
import { PaymentCreateResponse } from 'mercadopago/resources/payment'

export interface IExicute {
  payments: (req: Request, res: Response) => Promise<void>
  publicKey: (req: Request, res: Response) => Promise<void>
  installments: (req: Request, res: Response) => Promise<void>
  paymentCreditCard: (req: Request, res: Response) => Promise<void>
}

export interface IPayload {
  id: string
  publicKey: string
}

export default class PayController {
  async payments (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      const user = await isAuth.isAuth('client')

      mercadopago.configure({
        access_token: new Environments().ACCESS_TOKEN
      })

      const items: PreferenceItem[] = []

      const shopps = await ShoppModel.find({ user, status: 'shopp' }).populate({
        path: 'product',
        populate: 'category'
      })

      if (shopps.length === 0) {
        throw new Error('No hay productos en la bolsa')
      }

      for await (const shopp of shopps) {
        items.push({
          id: shopp.product.id,
          title: shopp.product.name,
          description: shopp.product.description,
          picture_url: shopp.product.image1,
          category_id: shopp.product.category.id,
          quantity: shopp.count,
          currency_id: 'CLP',
          unit_price: shopp.product.price
        })
      }

      const payer: PreferencePayer = {
        name: user.name,
        surname: user.lastName,
        email: user.email
      }

      const preference: CreatePreferencePayload = {
        items,
        payer,
        statement_descriptor: 'Pago delivery'
      }

      const data = await mercadopago.preferences.create(preference)
      res
        .status(200)
        .json(
          new DataJsonResUtil(
            '',
            true,
            { id: data.body.id, publicKey: new Environments().PUBLIC_KEY },
            null
          )
        )
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async publicKey (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      await isAuth.isAuth('client')
      res
        .status(200)
        .json(
          new DataJsonResUtil(null, true, new Environments().PUBLIC_KEY, null)
        )
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async installments (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      await isAuth.isAuth('client')

      const body = req.body as { bin: string; amount: number }

      const payValidation = new PayValidation()
      await payValidation.installments().validate(body)

      const axios = new AxiosMercadoPagoUtil()
      const data = await axios.installments(body.bin, body.amount)
      res.status(200).json(new DataJsonResUtil(null, true, data, null))
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async paymentCreditCard (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      const user = await isAuth.isAuth('client')
      const body = req.body as {
        token: string
        transactionAmount: number
        installments: number
        paymentMethodId: string
      }

      const payValidation = new PayValidation()
      await payValidation.paymentCreditCard().validate(body)

      mercadopago.configurations.setAccessToken(new Environments().ACCESS_TOKEN)
      const data: PaymentCreateResponse = await mercadopago.payment.save({
        token: body.token,
        transaction_amount: body.transactionAmount,
        installments: body.installments,
        payment_method_id: body.paymentMethodId,
        payer: {
          email: user.email
        }
      })

      if (data.status === 201) {
        const shopps = await ShoppModel.find({ user, state: 'shopp' })
        if (shopps.length === 0) {
          throw new Error('No existen productos en la bolsa')
        }
        const date = new Date().getTime()
        for await (const shopp of shopps) {
          await ShoppModel.findByIdAndUpdate(shopp.id, {
            state: 'pending',
            purchaseId: data.idempotency,
            norder: date
          })
        }
      }

      res
        .status(data.status)
        .json(
          new DataJsonResUtil(
            'Su orden fue procesada exitosamente',
            true,
            data,
            null
          )
        )
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  execute (): IExicute {
    return {
      payments: this.payments,
      publicKey: this.publicKey,
      installments: this.installments,
      paymentCreditCard: this.paymentCreditCard
    }
  }
}
