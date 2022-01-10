import dotenv from 'dotenv'

dotenv.config()

export default class Environments {
  private _PORT?: string | number = process.env.PORT
  private _URI?: string = process.env.URI
  private _SECRET_KEY_JWT?: string = process.env.SECRET_KEY_JWT

  get PORT (): string | number {
    return this._PORT || 3000
  }

  get URI (): string {
    return this._URI || ''
  }

  get SECRET_KEY_JWT (): string {
    return this._SECRET_KEY_JWT || ''
  }
}
