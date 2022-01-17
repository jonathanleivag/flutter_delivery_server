import { Request, Response } from 'express'
import {
  CategoryModel,
  RoleModel,
  RoleUserModel,
  UserModel
} from '../db/mongodb/models'
import { ICategoryModel, IUserModel } from '../types/interfeces'
import { DataJsonResUtil, JwtUtil } from '../utils'
import { CategoryValidation } from '../validations'

export interface IExicute {
  createCategory: (req: Request, res: Response) => Promise<void>
  getCategory: (req: Request, res: Response) => Promise<void>
  getAllCategory: (req: Request, res: Response) => Promise<void>
}

export default class CategoryController {
  async createCategory (req: Request, res: Response): Promise<void> {
    try {
      const body: ICategoryModel = req.body
      const validationCateogry = new CategoryValidation()
      await validationCateogry.createCategory().validate(body)

      const token: string = req.headers.authorization ?? ''
      const jwt = new JwtUtil()
      const userToken: IUserModel = jwt.verify(token) as IUserModel

      const user = await UserModel.findById(userToken.id)
      if (!user) {
        throw new Error('Usuario no existe')
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

      const categoryExist = await CategoryModel.findOne({
        category: body.category
      })

      if (categoryExist) {
        throw new Error('Categoria ya existe')
      }

      const newCategory = new CategoryModel(body)
      const category = await newCategory.save()
      res
        .status(201)
        .json(
          new DataJsonResUtil(
            'Se creo con exito la categoría',
            true,
            category,
            null
          )
        )
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  async getCategory (req: Request, res: Response): Promise<void> {}

  async getAllCategory (req: Request, res: Response): Promise<void> {}

  execute (): IExicute {
    return {
      createCategory: this.createCategory,
      getCategory: this.getCategory,
      getAllCategory: this.getAllCategory
    }
  }
}
