import { RoleModel, RoleUserModel, UserModel } from '../db/mongodb/models'
import { IUserModel } from '../types/interfeces'
import JwtUtil, { ITokenData } from './jwt_util'

export default class IsAuth {
  private token: string

  constructor (token: string) {
    this.token = token
  }

  private async userToken (token: string): Promise<IUserModel> {
    const jwt = new JwtUtil()
    const userToken: ITokenData = jwt.verify(token)

    const user = await UserModel.findById(userToken.id)
    if (!user) {
      throw new Error('No existe el usuario')
    }
    return user
  }

  private async role (user: IUserModel, name: string): Promise<void> {
    const role = await RoleModel.findOne({ name })

    if (!role) {
      throw new Error('Rol no existe')
    }

    const roleUser = await RoleUserModel.findOne({
      user: user.id,
      role: role.id
    })
    if (!roleUser) {
      throw new Error('Usuario no tiene permisos')
    }
  }

  async isAuth (role: string): Promise<void> {
    const user = await this.userToken(this.token)
    await this.role(user, role)
  }
}
