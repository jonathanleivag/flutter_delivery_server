import { Schema, model } from 'mongoose'
import { IUserModel } from '../../../types/interfeces'

const schema = new Schema<IUserModel>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String, required: false },
    password: { type: String, required: true },
    isAviabile: { type: Boolean, required: true },
    sessionToken: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<IUserModel>('User', schema)
