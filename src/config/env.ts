import dotenv from 'dotenv'

dotenv.config()

export default class Environments {
  static PORT: string | number = process.env.PORT || 3000
}
