import { IRoleUserModel } from '../../../types/interfeces'
import { Schema, model } from 'mongoose'

const RoleUserModel = new Schema<IRoleUserModel>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rol: { type: Schema.Types.ObjectId, ref: 'Rol', required: true }
})

export default model<IRoleUserModel>('RolUser', RoleUserModel)
