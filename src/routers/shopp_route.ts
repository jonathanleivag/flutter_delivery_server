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

  execute (): Router {
    this.addShoppingCart()
    this.getShoppingCartByUser()
    return this.router
  }
}
