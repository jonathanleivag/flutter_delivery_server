import { Request, Response } from 'express'
import { RoleModel, RoleUserModel, UserModel } from '../db/mongodb/models'
import { UserValidation } from '../validations'
import { DataJsonResUtil, JwtUtil } from '../utils'
import { genSaltSync, hashSync, compareSync } from 'bcryptjs'
import { IUserModel } from '../types/interfeces'

export interface IUserLogin {
  email: string
  password: string
  token?: string
}

interface IExicute {
  newUser: (req: Request, res: Response) => Promise<void>
  getAllUsers: (req: Request, res: Response) => Promise<void>
  login: (req: Request, res: Response) => Promise<void>
  verifyToken: (req: Request, res: Response) => void
}

export default class UserController {
  async newUser (req: Request, res: Response): Promise<void> {
    const body: IUserModel = req.body
    try {
      const userValidation = new UserValidation()
      await userValidation.newUserValidation().validate(body)

      const userExist = await UserModel.findOne({ email: body.email })
      if (userExist) {
        res
          .status(400)
          .json(
            new DataJsonResUtil(
              'El usuario ya existe',
              false,
              null,
              null
            ).json()
          )
      } else {
        const user = new UserModel(body)

        const salt = genSaltSync(10)
        user.password = hashSync(body.password, salt)

        const userSave = await user.save()

        const role = await RoleModel.findOne({ name: 'client' })

        if (!role) {
          throw new Error('No existe el rol')
        }

        const newRoleUser = new RoleUserModel({ user, role })
        await newRoleUser.save()

        const { password, ...rest } = userSave.toJSON()
        const jwt = new JwtUtil()

        res.status(201).json(
          new DataJsonResUtil(
            'Usuario creado',
            true,
            rest,
            jwt.sign({
              id: user.id,
              email: user.email,
              name: user.name,
              lastName: user.lastName
            })
          ).json()
        )
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message, success: false })
      }
    }
  }

  async getAllUsers (req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find().select('-password')
      res.status(201).json(new DataJsonResUtil(null, true, users, null).json())
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(501)
          .json(new DataJsonResUtil(error.message, false, null, null).json())
      }
    }
  }

  async login (req: Request, res: Response): Promise<void> {
    try {
      const body: IUserLogin = req.body
      const user = await UserModel.findOne({ email: body.email })

      if (!user) {
        throw new Error('Error de credenciales')
      }

      if (!compareSync(body.password, user.password)) {
        throw new Error('error de credenciales')
      }

      const { password, ...rest } = user.toJSON()

      const jwt = new JwtUtil()
      res.status(201).json(
        new DataJsonResUtil(
          null,
          true,
          rest,
          jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            lastName: user.lastName
          })
        ).json()
      )
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json(new DataJsonResUtil(error.message, false, null, null).json())
      }
    }
  }

  verifyToken (req: Request, res: Response): void {
    const token = req.headers.authorization
    if (!token) {
      res
        .status(401)
        .json(
          new DataJsonResUtil('No token provided', false, null, null).json()
        )
    } else {
      const jwt = new JwtUtil()
      try {
        const decoded = jwt.verify(token)
        res
          .status(201)
          .json(new DataJsonResUtil(null, true, decoded, null).json())
      } catch (error) {
        if (error instanceof Error) {
          res
            .status(401)
            .json(new DataJsonResUtil(error.message, false, null, null).json())
        }
      }
    }
  }

  execute (): IExicute {
    return {
      newUser: this.newUser,
      getAllUsers: this.getAllUsers,
      login: this.login,
      verifyToken: this.verifyToken
    }
  }
}
