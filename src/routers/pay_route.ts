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

  installments (): Router {
    return this.router.post(
      '/installments',
      new PayController().execute().installments
    )
  }

  paymentCreditCard (): Router {
    return this.router.post(
      '/payment-credit-card',
      new PayController().execute().paymentCreditCard
    )
  }

  execute (): Router {
    this.publicKey()
    this.payments()
    this.installments()
    this.paymentCreditCard()
    return this.router
  }
}
