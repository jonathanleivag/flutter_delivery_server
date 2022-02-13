export interface IGetProductByState {
  id?: string
  state?: string
  count?: number
  total?: number
  product?: Product
  user?: User
  createdAt?: Date
  updatedAt?: Date
  address?: Address
  purchaseId?: string
}

export interface Address {
  _id?: string
  address?: string
  street?: string
  city?: string
  country?: string
  department?: string
  direction?: string
  directionForm?: string
  barrioForm?: string
  latitude?: number
  longitude?: number
  user?: User
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  _id?: string
  email?: string
  name?: string
  lastName?: string
  phone?: string
  image?: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Product {
  _id?: string
  name?: string
  description?: string
  price?: number
  image1?: string
  image2?: null
  image3?: null
  category?: Category
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  _id?: string
  category?: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}
