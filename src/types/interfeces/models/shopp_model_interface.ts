import { IProductModel } from '..'
import IAddressModel from './address_model_interface'
import IUserModel from './user_model_interface'

export default interface IShoppModel {
  id?: string
  state?: 'shopp' |'pending' | 'accepted' | 'rejected' | 'dispatched' | 'received'
  count: number
  total: number
  product: IProductModel
  user: IUserModel
  address?: IAddressModel
  purchaseId?: string
  delivery?: IUserModel
}
