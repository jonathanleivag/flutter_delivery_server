import { Request, Response } from 'express'
import { UserModel } from '../db/mongodb/models'
import { UserValidation } from '../validations'
import { genSaltSync, hashSync } from 'bcryptjs'

export default class UserController {
  async newUser (req: Request, res: Response): Promise<void> {
    try {
      const userValidation = new UserValidation()
      await userValidation.newUserValidation().validate(req.body)

      const userExist = await UserModel.findOne({ email: req.body.email })
      if (userExist) {
        res.status(400).json({
          message: 'El usuario ya existe',
          success: false
        })
      } else {
        const user = new UserModel(req.body)

        const salt = genSaltSync(10)
        user.password = hashSync(user.password, salt)

        await user.save()
        res.status(201).json({
          user,
          success: true,
          message: 'Se creo con exito el usuario ' + user.name
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message, success: false })
      }
    }
  }

  async getAllUsers (req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find()
      res.status(201).json({ users, success: true })
    } catch (error) {
      if (error instanceof Error) {
        res.status(501).json({ message: error.message, success: false })
      }
    }
  }

  execute () {
    return { newUser: this.newUser, getAllUsers: this.getAllUsers }
  }
}
