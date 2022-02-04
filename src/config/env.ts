import dotenv from 'dotenv'

dotenv.config()

export default class Environments {
  private _PORT?: string | number = process.env.PORT
  private _URI?: string = process.env.URI
  private _SECRET_KEY_JWT?: string = process.env.SECRET_KEY_JWT
  private _PUBLIC_KEY?: string = process.env.PUBLIC_KEY
  private _ACCESS_TOKEN?: string = process.env.ACCESS_TOKEN

  get PORT (): string | number {
    return this._PORT || 3000
  }

  get URI (): string {
    return this._URI || ''
  }

  get SECRET_KEY_JWT (): string {
    return this._SECRET_KEY_JWT || ''
  }

  get PUBLIC_KEY (): string {
    return this._PUBLIC_KEY || ''
  }

  get ACCESS_TOKEN (): string {
    return this._ACCESS_TOKEN || ''
  }
}
