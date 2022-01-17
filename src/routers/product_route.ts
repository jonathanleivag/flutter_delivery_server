import { Router } from 'express'
import { ProductController } from '../controllers'

export default class RoleRoute {
  router: Router

  constructor () {
    this.router = Router()
  }

  createProduct (): Router {
    return this.router.post(
      '/create',
      new ProductController().execute().createProduct
    )
  }

  execute (): Router {
    this.createProduct()
    return this.router
  }
}
