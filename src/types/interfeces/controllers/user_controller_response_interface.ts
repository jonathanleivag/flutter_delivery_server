import { PaymentCreateResponse } from 'mercadopago/resources/payment'
import { ICategoryModel, IGetProductByState, IProductModel, IRoleModel, IRoleUserModel, IUserModel } from '../'
import { IPayload } from '../../../controllers/pay_controller'
import { ITokenData } from '../../../utils/jwt_util'
import IAddressModel from '../models/address_model_interface'
import IShoppModel from '../models/shopp_model_interface'
import { IInstallments } from './IInstallments'

export interface IUserResponse {
  id: string
  email: string
  name: string
  lastName: string
  phone: string
  image?: string
  isAviabile: boolean
  sessionToken: string
  createdAt: Date
  updatedAt: Date
}

export default interface IUserControllerResponse {
  message: string | null
  success: boolean
  data: IUserModel | IUserModel[] | IUserResponse | IRoleModel | IRoleModel[] | IRoleUserModel | IRoleUserModel[] | ITokenData | ICategoryModel | ICategoryModel[] | IProductModel | IProductModel[] | IShoppModel | IShoppModel[] | IAddressModel | IAddressModel[] | IPayload | IInstallments | string | string[] | PaymentCreateResponse | IGetProductByState | number | null,
  token: string | null
}
