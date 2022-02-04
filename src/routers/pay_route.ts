import { Router } from 'express'
import { PayController } from '../controllers'

export default class PayRoute {
  router: Router

  constructor () {
    this.router = Router()
  }

  payments (): Router {
    return this.router.post('/payments', new PayController().execute().payments)
  }

  execute (): Router {
    this.payments()
    return this.router
  }
}
