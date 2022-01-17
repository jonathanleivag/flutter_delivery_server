import { ICategoryModel } from '..'

export default interface ProductModelInterface {
  id: string
  name: string
  description: string
  price: number
  image1: string
  image2?: string
  image3?: string
  category: ICategoryModel
  createdAt: Date
  updatedAt: Date
}
