import { Router } from 'express'
import { UserController } from '../controllers'

export default class UserRoute {
  router: Router

  constructor () {
    this.router = Router()
  }

  newUser (): Router {
    return this.router.post('/new', new UserController().execute().newUser)
  }

  getAllUsers (): Router {
    return this.router.get('/all', new UserController().execute().getAllUsers)
  }

  login (): Router {
    return this.router.post('/login', new UserController().execute().login)
  }

  execute (): Router {
    this.newUser()
    this.getAllUsers()
    this.login()
    return this.router
  }
}
