import Environments from '../config/env'
import { sign, verify } from 'jsonwebtoken'

export interface ITokenData {
  id: string
  name: string
  email: string
  lastName: string
}

export default class JwtUtil {
  sign (data: ITokenData): string {
    return sign(data, new Environments().SECRET_KEY_JWT, { expiresIn: '30d' })
  }

  verify (token: string): ITokenData {
    return verify(token, new Environments().SECRET_KEY_JWT) as ITokenData
  }
}
