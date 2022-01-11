import { Request, Response } from 'express'
import { IRoleModel } from '../types/interfeces'
import RoleModel from '../db/mongodb/models/role_model'
import { DataJsonResUtil } from '../utils'

interface IExicute {
  createRole: (req: Request, res: Response) => Promise<void>
}

export default class RoleController {
  async createRole (req: Request, res: Response): Promise<void> {
    const data: IRoleModel[] = [
      { name: 'admin', image: null, route: null },
      { name: 'client', image: null, route: null },
      { name: 'local', image: null, route: null },
      { name: 'delivery', image: null, route: null }
    ]
    try {
      for await (const role of data) {
        const roleExist = await RoleModel.findOne({ name: role.name })
        if (!roleExist) {
          const newRoles = new RoleModel(role)
          await newRoles.save()
        }
      }

      res
        .status(201)
        .json(new DataJsonResUtil('Roles creado con exito', true, null, null))
        .json()
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json(new DataJsonResUtil(error.message, false, null, null))
      }
    }
  }

  execute (): IExicute {
    return {
      createRole: this.createRole
    }
  }
}
