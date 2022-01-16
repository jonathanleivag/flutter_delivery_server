import { IProductModel } from '../../../types/interfeces'
import { Schema, model } from 'mongoose'

const ProductModel = new Schema<IProductModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: false
    },
    image1: {
      type: String,
      required: false
    },
    image2: {
      type: String,
      required: false
    },
    image3: {
      type: String,
      required: false
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

ProductModel.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<IProductModel>('Product', ProductModel)
