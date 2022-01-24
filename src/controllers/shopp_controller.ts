import { Request, Response } from 'express'
import { IShoppModel, IUserModel } from '../types/interfeces'
import { DataJsonResUtil, IsAuth, IsExist } from '../utils'
import { ShoppValidation } from '../validations'
import { ProductModel, ShoppModel } from '../db/mongodb/models'

export interface IExicute {
  addShoppingCart: (req: Request, res: Response) => Promise<void>
  getShoppingCartByUser: (req: Request, res: Response) => Promise<void>
}

export default class ShoppController {
  async addShoppingCart (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      const user = await isAuth.isAuth('client')

      const body: IShoppModel = req.body as IShoppModel
      const validateShopp = new ShoppValidation()
      await validateShopp.addShoppingCart().validate(body)

      const product = await ProductModel.findById(body.product)
      if (!product) {
        throw new Error('Producto no existe')
      }

      const isExist = new IsExist()
      await isExist.isNotExistShoppingCartProduct(body.product, user)

      body.user = user
      body.product = product

      const newShoppingCart = new ShoppModel(body)
      const { id } = await newShoppingCart.save()
      const shopp = await ShoppModel.findById(id).populate([
        { path: 'product', populate: 'category' },
        { path: 'user', select: '-password' }
      ])
      if (!shopp) {
        throw new Error('No se pudo crear el carrito')
      }

      res
        .status(201)
        .json(
          new DataJsonResUtil(
            `Se agrego el producto ${product.name} al carrito de compras`,
            true,
            shopp,
            null
          )
        )
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async getShoppingCartByUser (req: Request, res: Response): Promise<void> {
    try {
      const isAuth: IsAuth = new IsAuth(req.headers.authorization ?? '')
      const user: IUserModel = await isAuth.isAuth('client')
      const shopp: IShoppModel[] = await ShoppModel.find({
        user,
        state: 'pending'
      }).populate([
        { path: 'product', populate: 'category' },
        { path: 'user', select: '-password' }
      ])

      res.status(201).json(new DataJsonResUtil(null, true, shopp, null))
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  execute (): IExicute {
    return {
      addShoppingCart: this.addShoppingCart,
      getShoppingCartByUser: this.getShoppingCartByUser
    }
  }
}
