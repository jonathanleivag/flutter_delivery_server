export default interface IUserModel {
  id: string
  email: string
  name: string
  lastName: string
  phone: string
  image?: string
  password: string
  isAviabile: boolean
  sessionToken: string
  createdAt: Date
  updatedAt: Date
}
