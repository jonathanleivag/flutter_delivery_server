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

  getProductByCategory (): Router {
    return this.router.get(
      '/category/:id',
      new ProductController().execute().getProductByCategory
    )
  }

  execute (): Router {
    this.createProduct()
    this.getProductByCategory()
    return this.router
  }
}
