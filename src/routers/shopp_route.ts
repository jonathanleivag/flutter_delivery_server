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

  updateAllShoppingCart (): Router {
    return this.router.put(
      '/updateAll',
      new ShoppController().execute().updateAllShoppingCart
    )
  }

  updateAllCountoAndTotal (): Router {
    return this.router.put(
      '/updateAllCountoAndTotal',
      new ShoppController().execute().updateAllCountoAndTotal
    )
  }

  getPurchaseIdByState (): Router {
    return this.router.get(
      '/purchaseIdByState/:state',
      new ShoppController().execute().getPurchaseIdByState
    )
  }

  getNumberOrder (): Router {
    return this.router.get(
      '/numberOrder/:purchaseId',
      new ShoppController().execute().getNumberOrder
    )
  }

  getUserShopp (): Router {
    return this.router.get(
      '/userShopp/:purchaseId',
      new ShoppController().execute().getUserShopp
    )
  }

  execute (): Router {
    this.addShoppingCart()
    this.getShoppingCartByUser()
    this.getOneShoppingCartByUser()
    this.updateShoppingCart()
    this.deleteShoppingCart()
    this.updateAllShoppingCart()
    this.updateAllCountoAndTotal()
    this.getPurchaseIdByState()
    this.getNumberOrder()
    this.getUserShopp()
    return this.router
  }
}
