import { Request, Response } from 'express'
import { DataJsonResUtil, IsAuth } from '../utils'
import mercadopago from 'mercadopago'
import Environments from '../config/env'
import {
  CreatePreferencePayload,
  PreferenceItem,
  PreferencePayer
} from 'mercadopago/models/preferences/create-payload.model'
import { ShoppModel } from '../db/mongodb/models'

export interface IExicute {
  payments: (req: Request, res: Response) => Promise<void>
  publicKey: (req: Request, res: Response) => Promise<void>
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

  execute (): IExicute {
    return {
      payments: this.payments,
      publicKey: this.publicKey
    }
  }
}
