import { IProductModel } from '..'
import IUserModel from './user_model_interface'

export default interface IShoppModel {
  id?: string
  state?: 'pending' | 'accepted' | 'rejected' | 'shopp'
  count: number
  total: number
  product: IProductModel
  user: IUserModel
}
