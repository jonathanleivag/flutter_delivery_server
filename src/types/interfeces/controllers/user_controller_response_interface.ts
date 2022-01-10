import { IUserModel } from '../'

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
  data: IUserModel | IUserModel[] | IUserResponse | IUserResponse[] | null
  token: string | null
}
