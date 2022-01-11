import { IRoleModel } from '../../../types/interfeces'
import { Schema, model } from 'mongoose'

const RoleModel = new Schema<IRoleModel>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String },
    route: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

RoleModel.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IRoleModel>('Role', RoleModel)
