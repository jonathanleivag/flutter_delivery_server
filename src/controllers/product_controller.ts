import { Request, Response } from 'express'
import {
  RoleModel,
  RoleUserModel,
  UserModel,
  ProductModel,
  CategoryModel
} from '../db/mongodb/models'
import { IProductModel } from '../types/interfeces'
import { DataJsonResUtil, JwtUtil } from '../utils'
import { ITokenData } from '../utils/jwt_util'
import ProductValidation from '../validations/product_validation'

interface IExicute {
  createProduct: (req: Request, res: Response) => Promise<void>
}

export default class ProductController {
  async createProduct (req: Request, res: Response): Promise<void> {
    try {
      const token: string = req.headers.authorization ?? ''
      const jwt = new JwtUtil()
      const userToken: ITokenData = jwt.verify(token)

      const user = await UserModel.findById(userToken.id)
      if (!user) {
        throw new Error('No existe el usuario')
      }

      const role = await RoleModel.findOne({ name: 'local' })

      if (!role) {
        throw new Error('Rol no existe')
      }

      const roleUser = await RoleUserModel.findOne({
        user: user.id,
        role: role.id
      })

      if (!roleUser) {
        throw new Error('Usuario no tiene permisos')
      }

      const body: IProductModel = req.body
      const validateProduct = new ProductValidation()
      await validateProduct.createProduct().validate(body)

      const category = await CategoryModel.findById(body.category)
      if (!category) {
        throw new Error('Categoria no existe')
      }

      const productExist = await ProductModel.findOne({ name: body.name })
      if (productExist) {
        throw new Error('Producto ya existe')
      }

      const newProduct = new ProductModel({ ...body, category: category })
      await newProduct.save()
      res
        .status(201)
        .json(
          new DataJsonResUtil(
            'Producto creado con exito',
            true,
            newProduct,
            null
          )
        )
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  execute (): IExicute {
    return {
      createProduct: this.createProduct
    }
  }
}
