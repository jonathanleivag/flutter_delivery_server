import { Schema, model } from 'mongoose'
import { IShoppModel } from '../../../types/interfeces'

const ShoppModel = new Schema<IShoppModel>(
  {
    state: {
      type: String,
      default: 'shopp',
      enum: [
        'shopp',
        'pending',
        'accepted',
        'rejected',
        'dispatched',
        'received'
      ]
    },
    count: { type: Number, required: true },
    total: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: Schema.Types.ObjectId, ref: 'Address', required: false },
    purchaseId: { type: String, required: false },
    delivery: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    norder: { type: Number, required: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

ShoppModel.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IShoppModel>('Shopp', ShoppModel)
