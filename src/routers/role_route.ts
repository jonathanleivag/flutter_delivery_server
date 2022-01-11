import { Router } from 'express'
import RoleController from '../controllers/role_controller'

export default class RoleRoute {
  router: Router

  constructor () {
    this.router = Router()
  }

  createRole (): Router {
    return this.router.get('/create', new RoleController().execute().createRole)
  }

  getRoleUser (): Router {
    return this.router.post(
      '/get/user',
      new RoleController().execute().getRoleUser
    )
  }

  execute (): Router {
    this.createRole()
    this.getRoleUser()
    return this.router
  }
}
