import { Router } from 'express'
import RoleController from '../controllers/role_controller'

export default class RoleRoute {
  router: Router

  constructor () {
    this.router = Router()
  }

  createRole (): Router {
    return this.router.get(
      '/create',
      new RoleController().execute().createRole
    )
  }

  execute (): Router {
    this.createRole()
    return this.router
  }
}
