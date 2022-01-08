import { Schema, model } from 'mongoose'
import { IUserModel } from '../../../types/interfeces'

const UserModel = new Schema<IUserModel>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String, required: false },
    password: { type: String, required: true },
    isAviabile: { type: Boolean },
    sessionToken: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<IUserModel>('User', UserModel)
