import { Request, Response } from 'express'
import { AddressModel, ShoppModel } from '../db/mongodb/models'
import { IAddressModel, IShoppModel } from '../types/interfeces'
import { DataJsonResUtil, IsAuth } from '../utils'
import { AddressValidation } from '../validations'

export interface IExicute {
  addAddress: (req: Request, res: Response) => Promise<void>
  getAddress: (req: Request, res: Response) => Promise<void>
  addAddressShopp: (req: Request, res: Response) => Promise<void>
}

export default class AddressController {
  async addAddress (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      const user = await isAuth.isAuth('client')

      const body: IAddressModel = req.body
      const validationCateogry = new AddressValidation()
      await validationCateogry.addAddress().validate(body)

      const newAddress = new AddressModel({ ...body, user })
      const address = await (await newAddress.save()).populate({
        path: 'user',
        select: '-password'
      })
      res
        .status(200)
        .json(
          new DataJsonResUtil(
            'Dirección agregada correctamente',
            true,
            address,
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

  async getAddress (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      const user = await isAuth.isAuth('client')

      const address = await AddressModel.find({ user }).populate({
        path: 'user',
        select: '-password'
      })

      res
        .status(200)
        .json(
          new DataJsonResUtil(
            'Direcciones obtenidas correctamente',
            true,
            address,
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

  async addAddressShopp (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      const user = await isAuth.isAuth('client')

      const addressId: String = req.body.address as String

      const shopps: IShoppModel[] = await ShoppModel.find({
        user,
        state: 'shopp'
      }).populate([
        { path: 'product', populate: 'category' },
        { path: 'user', select: '-password' }
      ])

      if (shopps.length === 0) {
        throw new Error('No hay productos en la bolsa')
      }

      const addressExist = await AddressModel.findOne({ id: addressId, user })

      if (!addressExist) {
        throw new Error('La dirección no existe')
      }

      for await (const shopp of shopps) {
        await ShoppModel.findByIdAndUpdate(shopp.id, { address: addressExist })
      }

      res
        .status(200)
        .json(
          new DataJsonResUtil(
            'Dirección agregada correctamente',
            true,
            null,
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
      addAddress: this.addAddress,
      getAddress: this.getAddress,
      addAddressShopp: this.addAddressShopp
    }
  }
}
