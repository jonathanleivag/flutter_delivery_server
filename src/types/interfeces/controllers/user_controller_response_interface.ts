import { ICategoryModel, IProductModel, IRoleModel, IRoleUserModel, IUserModel } from '../'
import { ITokenData } from '../../../utils/jwt_util'
import IShoppModel from '../models/shopp_model_interface'

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
  data: IUserModel | IUserModel[] | IUserResponse | IRoleModel | IRoleModel[] | IRoleUserModel | IRoleUserModel[] | ITokenData | ICategoryModel | ICategoryModel[] | IProductModel | IProductModel[] | IShoppModel | IShoppModel[] | null,
  token: string | null
}
