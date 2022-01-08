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

  login (): Router {
    return this.router.post('/login', (_, res) => {
      res.json({
        ok: true,
        user: 'login'
      })
    })
  }

  execute (): Router {
    this.newUser()
    this.login()
    return this.router
  }
}
