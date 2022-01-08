import { Request, Response } from 'express'

export default class UserController {
  newUser (req: Request, res: Response): void {
    res.json({
      ok: true,
      user: 'abc',
      body: req.body
    })
  }

  execute () {
    return { newUser: this.newUser }
  }
}
