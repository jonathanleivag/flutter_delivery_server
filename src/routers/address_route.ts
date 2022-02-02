import { Router } from 'express'
import { AddressController } from '../controllers'

export default class AddressRoute {
  router: Router

  constructor () {
    this.router = Router()
  }

  addAddress (): Router {
    return this.router.post(
      '/add',
      new AddressController().execute().addAddress
    )
  }

  getAddress (): Router {
    return this.router.get('/', new AddressController().execute().getAddress)
  }

  addAddressShopp (): Router {
    return this.router.post(
      '/add/shopp',
      new AddressController().execute().addAddressShopp
    )
  }

  execute (): Router {
    this.addAddress()
    this.getAddress()
    this.addAddressShopp()
    return this.router
  }
}
