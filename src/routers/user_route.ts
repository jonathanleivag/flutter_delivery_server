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

  updateUser (): Router {
    return this.router.put('/update', new UserController().execute().updateUser)
  }

  login (): Router {
    return this.router.post('/login', new UserController().execute().login)
  }

  verifyToken (): Router {
    return this.router.get(
      '/verify',
      new UserController().execute().verifyToken
    )
  }

  execute (): Router {
    this.newUser()
    this.getAllUsers()
    this.login()
    this.verifyToken()
    this.updateUser()
    return this.router
  }
}
