import { Request, Response } from 'express'
import { ProductModel } from '../db/mongodb/models'
import { IProductModel } from '../types/interfeces'
import { DataJsonResUtil, IsAuth, IsExist } from '../utils'
import ProductValidation from '../validations/product_validation'

interface IExicute {
  createProduct: (req: Request, res: Response) => Promise<void>
}

export default class ProductController {
  async createProduct (req: Request, res: Response): Promise<void> {
    try {
      const isAuth = new IsAuth(req.headers.authorization ?? '')
      await isAuth.isAuth('local')

      const body: IProductModel = req.body
      const validateProduct = new ProductValidation()
      await validateProduct.createProduct().validate(body)

      const isExist = new IsExist()
      const category = await isExist.isExistCategoryByid(body.category)
      await isExist.isNotExistProductByName(body.name)

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
