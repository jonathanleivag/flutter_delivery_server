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

  execute (): Router {
    this.newUser()
    this.getAllUsers()
    return this.router
  }
}
