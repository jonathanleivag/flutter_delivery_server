import Role from './roles_model_interface'
import User from './user_model_interface'

export default interface IRoleUser {
  user: User
  role: Role
  craeteAt: Date
  updateAt: Date
}
