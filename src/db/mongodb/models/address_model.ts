import { IAddressModel } from '../../../types/interfeces'
import { Schema, model } from 'mongoose'

const AddressModel = new Schema<IAddressModel>(
  {
    address: {
      type: String,
      required: false
    },
    street: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    country: {
      type: String,
      required: false
    },
    department: {
      type: String,
      required: false
    },
    direction: {
      type: String,
      required: false
    },
    directionForm: {
      type: String,
      required: true
    },
    barrioForm: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)
AddressModel.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IAddressModel>('Address', AddressModel)
