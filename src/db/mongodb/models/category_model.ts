import { ICategoryModel } from '../../../types/interfeces'
import { Schema, model } from 'mongoose'

const CategoryModel = new Schema<ICategoryModel>(
  {
    category: { type: String, required: true, unique: true },
    description: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
)
CategoryModel.method('toJSON', function () {
  const { _id, ...rest } = this.toObject()

  return { id: _id, ...rest }
})

export default model<ICategoryModel>('Category', CategoryModel)
