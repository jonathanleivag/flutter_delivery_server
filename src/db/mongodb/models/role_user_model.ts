import { IRoleUserModel } from '../../../types/interfeces'
import { Schema, model } from 'mongoose'

const RoleUserModel = new Schema<IRoleUserModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

RoleUserModel.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IRoleUserModel>('RoleUser', RoleUserModel)
