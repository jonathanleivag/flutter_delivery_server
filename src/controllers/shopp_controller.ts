import { Request, Response } from 'express'
import { IProductModel, IShoppModel, IUserModel } from '../types/interfeces'
import { DataJsonResUtil, IsAuth, IsExist } from '../utils'
import { ShoppValidation } from '../validations'
import { ProductModel, ShoppModel } from '../db/mongodb/models'

export interface IExicute {
  addShoppingCart: (req: Request, res: Response) => Promise<void>
  getShoppingCartByUser: (req: Request, res: Response) => Promise<void>
  getOneShoppingCartByUser: (req: Request, res: Response) => Promise<void>
  updateShoppingCart: (req: Request, res: Response) => Promise<void>
  deleteShoppingCart: (req: Request, res: Response) => Promise<void>
  updateAllShoppingCart: (req: Request, res: Response) => Promise<void>
  updateAllCountoAndTotal: (req: Request, res: Response) => Promise<void>
  getPurchaseIdByState: (req: Request, res: Response) => Promise<void>
  getNumberOrder: (req: Request, res: Response) => Promise<void>
  getUserShopp: (req: Request, res: Response) => Promise<void>
}

export interface IShoppingCart {
  id: string
  count: number
  total: number
  product: IProductModel
}
export interface IShoppingCartAll {
  products: string
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
        state: 'shopp'
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
        state: 'shopp',
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

      const body: IShoppingCart = req.body
      const product = await ShoppModel.findOne({
        product: body.id,
        user,
        state: 'shopp'
      })
      if (!product) throw new Error('No existe el producto')

      await ShoppModel.findOneAndUpdate(
        { product: body.id, user, state: 'shopp' },
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

  async updateAllShoppingCart (req: Request, res: Response): Promise<void> {
    try {
      const isAuth: IsAuth = new IsAuth(req.headers.authorization ?? '')
      const user: IUserModel = await isAuth.isAuth('client')

      const body: IShoppingCartAll = req.body

      for await (const productJson of body.products) {
        const product = JSON.parse(productJson) as IShoppingCart

        const productExist = await ShoppModel.findOne({
          product: product.product._id,
          user,
          state: 'shopp'
        })

        if (!productExist) throw new Error('No existe el producto')

        await ShoppModel.findOneAndUpdate(
          { product: productExist.product._id, user, state: 'shopp' },
          { count: product.count, total: product.total, state: 'pending' },
          { new: true }
        )
      }

      res
        .status(201)
        .json(
          new DataJsonResUtil(
            'Se envio tu pedido a la tienda',
            true,
            null,
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

  async deleteShoppingCart (req: Request, res: Response): Promise<void> {
    try {
      const isAuth: IsAuth = new IsAuth(req.headers.authorization ?? '')
      const user: IUserModel = await isAuth.isAuth('client')

      const body: { id: string } = req.body
      const product = await ShoppModel.findOne({ product: body.id, user })

      if (!product) throw new Error('No existe el producto')

      await ShoppModel.findOneAndDelete({
        product: body.id,
        user,
        state: 'shopp'
      })

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

  async updateAllCountoAndTotal (req: Request, res: Response): Promise<void> {
    try {
      const isAuth: IsAuth = new IsAuth(req.headers.authorization ?? '')
      const user: IUserModel = await isAuth.isAuth('client')

      const body: IShoppingCartAll = req.body

      for await (const productJson of body.products) {
        const product = JSON.parse(productJson) as IShoppingCart

        const productExist = await ShoppModel.findOne({
          product: product.product._id,
          user,
          state: 'shopp'
        })

        if (!productExist) throw new Error('No existe el producto')

        await ShoppModel.findOneAndUpdate(
          { product: productExist.product._id, user, state: 'shopp' },
          { count: product.count, total: product.total }
        )
      }

      res
        .status(201)
        .json(
          new DataJsonResUtil(
            'Se actualizo la cantidad y el total de los productos',
            true,
            null,
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

  async getPurchaseIdByState (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      await isAuth.isAuth('local')

      const params = req.params
      const validateShopp = new ShoppValidation()
      await validateShopp.getProductByState().validate(params)

      const shopps = await ShoppModel.find({ state: params.state })
        .select('purchaseId -_id')
        .distinct('purchaseId')

      res
        .status(200)
        .json(new DataJsonResUtil('Productos por estado', true, shopps, null))
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async getNumberOrder (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      await isAuth.isAuth('local')

      const params = req.params as { purchaseId: string }
      const validateShopp = new ShoppValidation()
      await validateShopp.getNumberOrder().validate(params)

      const order = await ShoppModel.find({ purchaseId: params.purchaseId })
        .select('norder -_id')
        .distinct('norder')

      res
        .status(200)
        .json(new DataJsonResUtil('Productos por estado', true, order, null))
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async getUserShopp (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      await isAuth.isAuth('local')

      const params = req.params as { purchaseId: string }
      const validateShopp = new ShoppValidation()
      await validateShopp.getNumberOrder().validate(params)

      const userShopp = await ShoppModel.findOne({
        purchaseId: params.purchaseId
      }).populate([{ path: 'user', select: '-password' }, 'address'])

      res
        .status(200)
        .json(
          new DataJsonResUtil('Productos por estado', true, userShopp, null)
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
      deleteShoppingCart: this.deleteShoppingCart,
      updateAllShoppingCart: this.updateAllShoppingCart,
      updateAllCountoAndTotal: this.updateAllCountoAndTotal,
      getPurchaseIdByState: this.getPurchaseIdByState,
      getNumberOrder: this.getNumberOrder,
      getUserShopp: this.getUserShopp
    }
  }
}
