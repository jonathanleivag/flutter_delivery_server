import { Request, Response } from 'express'
import { IShoppModel, IUserModel } from '../types/interfeces'
import { DataJsonResUtil, IsAuth, IsExist } from '../utils'
import { ShoppValidation } from '../validations'
import { ProductModel, ShoppModel } from '../db/mongodb/models'

export interface IExicute {
  addShoppingCart: (req: Request, res: Response) => Promise<void>
  getShoppingCartByUser: (req: Request, res: Response) => Promise<void>
  getOneShoppingCartByUser: (req: Request, res: Response) => Promise<void>
  updateShoppingCart: (req: Request, res: Response) => Promise<void>
  deleteShoppingCart: (req: Request, res: Response) => Promise<void>
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
            `Se agrego el producto ${product.name} a la bolsa de compras`,
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

  async getOneShoppingCartByUser (req: Request, res: Response): Promise<void> {
    try {
      const isAuth: IsAuth = new IsAuth(req.headers.authorization ?? '')
      const user: IUserModel = await isAuth.isAuth('client')

      const product: string = req.params.product

      if (!product) {
        throw new Error('No existe el producto')
      }

      const shopp: IShoppModel = await ShoppModel.findOne({
        user,
        state: 'pending',
        product
      }).populate([
        { path: 'product', populate: 'category' },
        { path: 'user', select: '-password' }
      ])

      if (!shopp) {
        throw new Error('No se encontro el producto en la bolsa')
      }

      res.status(201).json(new DataJsonResUtil(null, true, shopp, null))
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async updateShoppingCart (req: Request, res: Response): Promise<void> {
    try {
      const isAuth: IsAuth = new IsAuth(req.headers.authorization ?? '')
      const user: IUserModel = await isAuth.isAuth('client')

      const body: { id: string; count: number; total: number } = req.body
      const product = await ShoppModel.findOne({ product: body.id, user })
      if (!product) throw new Error('No existe el producto')

      await ShoppModel.findOneAndUpdate(
        { product: body.id, user },
        { count: body.count, total: body.total }
      )
      res
        .status(201)
        .json(new DataJsonResUtil('Se actualizo el bolsa', true, null, null))
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async deleteShoppingCart (req: Request, res: Response): Promise<void> {
    try {
      const isAuth: IsAuth = new IsAuth(req.headers.authorization ?? '')
      const user: IUserModel = await isAuth.isAuth('client')

      const body: { id: string } = req.body
      const product = await ShoppModel.findOne({ product: body.id, user })

      if (!product) throw new Error('No existe el producto')

      await ShoppModel.findOneAndDelete({ product: body.id, user })

      res
        .status(201)
        .json(
          new DataJsonResUtil('Se quito producto de la bolsa', true, null, null)
        )
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
      getShoppingCartByUser: this.getShoppingCartByUser,
      getOneShoppingCartByUser: this.getOneShoppingCartByUser,
      updateShoppingCart: this.updateShoppingCart,
      deleteShoppingCart: this.deleteShoppingCart
    }
  }
}
