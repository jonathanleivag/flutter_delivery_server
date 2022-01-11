import { IRoleModel, IRoleUserModel, IUserControllerResponse, IUserModel } from '../types/interfeces'
import { IUserResponse } from '../types/interfeces/controllers/user_controller_response_interface'

export default class DataJsonResUtil {
  private message: string | null
  private success: boolean
  private data: IUserModel | IUserModel[] | IUserResponse | IRoleModel | IRoleModel[] | IRoleUserModel | IRoleUserModel[] | null
  private token: string | null

  constructor (
    message: string | null,
    success: boolean,
    data: IUserModel | IUserModel[] | IUserResponse | IRoleModel | IRoleModel[] | IRoleUserModel | IRoleUserModel[] | null,
    token: string | null
  ) {
    this.message = message
    this.success = success
    this.data = data
    this.token = token
  }

  json (): IUserControllerResponse {
    return {
      message: this.message,
      success: this.success,
      data: this.data,
      token: this.token
    }
  }
}
