import { CategoryModel, ProductModel, ShoppModel } from '../db/mongodb/models'
import { ICategoryModel, IProductModel, IUserModel } from '../types/interfeces'

export default class IsExist {
  async isExistCategoryByid (
    id: ICategoryModel | string
  ): Promise<ICategoryModel> {
    const category = await CategoryModel.findById(id)
    if (!category) {
      throw new Error('Categoria no existe')
    }
    return category
  }

  async isExistCategoryByName (name: string): Promise<ICategoryModel> {
    const category = await CategoryModel.findOne({ category: name })
    if (!category) {
      throw new Error('Categoria no existe')
    }
    return category
  }

  async isNotExistCategoryByName (name: string): Promise<void> {
    const category = await CategoryModel.findOne({ category: name })
    if (category) {
      throw new Error('Categoria ya existe')
    }
  }

  async isExistProductByName (name: string): Promise<IProductModel> {
    const product = await ProductModel.findOne({ name })
    if (!product) {
      throw new Error('Producto no existe')
    }
    return product
  }

  async isNotExistProductByName (name: string): Promise<void> {
    const product = await ProductModel.findOne({ name })
    if (product) {
      throw new Error('Producto ya existe')
    }
  }

  async isExistShoppingCartProduct (id: IProductModel) {
    const shopp = await ShoppModel.find({ product: id })
    if (shopp.length === 0) {
      throw new Error('Producto no existe')
    }
  }

  async isNotExistShoppingCartProduct (id: IProductModel, user: IUserModel) {
    const shopp = await ShoppModel.find({ product: id, user })
    if (shopp.length > 0) {
      throw new Error('El producto ya existe')
    }
  }
}
