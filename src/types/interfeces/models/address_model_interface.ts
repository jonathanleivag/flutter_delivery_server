import { IUserModel } from '..'

export default interface IAddressModel {
  id?: string
  address?: string
  street?: string
  city?: string
  country?: string
  department?: string
  direction?: string
  directionForm: string
  barrioForm: string
  latitude: number
  longitude: number
  user: IUserModel
  createdAt?: Date
  updatedAt?: Date
}
