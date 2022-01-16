import { Router } from 'express'
import { CategoryController } from '../controllers'

export default class RoleRoute {
  router: Router

  constructor () {
    this.router = Router()
  }

  createCategory (): Router {
    return this.router.post(
      '/create',
      new CategoryController().execute().createCategory
    )
  }

  getCategory (): Router {
    return this.router.get(
      '/get',
      new CategoryController().execute().getCategory
    )
  }

  getAllCategory (): Router {
    return this.router.get(
      '/getAll',
      new CategoryController().execute().getAllCategory
    )
  }

  execute (): Router {
    this.createCategory()
    this.getCategory()
    this.getAllCategory()
    return this.router
  }
}
