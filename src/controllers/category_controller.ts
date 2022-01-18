import { Request, Response } from 'express'
import { CategoryModel } from '../db/mongodb/models'
import { ICategoryModel } from '../types/interfeces'
import { DataJsonResUtil, IsAuth, IsExist } from '../utils'
import { CategoryValidation } from '../validations'

export interface IExicute {
  createCategory: (req: Request, res: Response) => Promise<void>
  getCategory: (req: Request, res: Response) => Promise<void>
  getAllCategory: (req: Request, res: Response) => Promise<void>
}

export default class CategoryController {
  async createCategory (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      isAuth.isAuth('local')

      const body: ICategoryModel = req.body
      const validationCateogry = new CategoryValidation()
      await validationCateogry.createCategory().validate(body)

      const isExist = new IsExist()
      isExist.isExistCategoryByName(body.category)

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

  async getAllCategory (req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryModel.find()
      res
        .status(200)
        .json(
          new DataJsonResUtil('Lista de categorias', true, categories, null)
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

  execute (): IExicute {
    return {
      createCategory: this.createCategory,
      getCategory: this.getCategory,
      getAllCategory: this.getAllCategory
    }
  }
}
