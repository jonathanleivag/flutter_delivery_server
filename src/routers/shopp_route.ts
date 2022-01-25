import { Router } from 'express'
import { ShoppController } from '../controllers'

export default class ShoppRoute {
  router: Router

  constructor () {
    this.router = Router()
  }

  addShoppingCart (): Router {
    return this.router.post(
      '/create',
      new ShoppController().execute().addShoppingCart
    )
  }

  getShoppingCartByUser (): Router {
    return this.router.get(
      '/all',
      new ShoppController().execute().getShoppingCartByUser
    )
  }

  getOneShoppingCartByUser (): Router {
    return this.router.get(
      '/:product',
      new ShoppController().execute().getOneShoppingCartByUser
    )
  }

  updateShoppingCart (): Router {
    return this.router.put(
      '/update',
      new ShoppController().execute().updateShoppingCart
    )
  }

  deleteShoppingCart (): Router {
    return this.router.delete(
      '/delete',
      new ShoppController().execute().deleteShoppingCart
    )
  }

  execute (): Router {
    this.addShoppingCart()
    this.getShoppingCartByUser()
    this.getOneShoppingCartByUser()
    this.updateShoppingCart()
    this.deleteShoppingCart()
    return this.router
  }
}
