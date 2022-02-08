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

  publicKey (): Router {
    return this.router.get(
      '/public-key',
      new PayController().execute().publicKey
    )
  }

  execute (): Router {
    this.publicKey()
    this.payments()
    return this.router
  }
}
