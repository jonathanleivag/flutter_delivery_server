import { number, object } from 'yup'

export default class ShoppValidation {
  addShoppingCart () {
    return object().shape({
      count: number().required('La cantidad es requerida de productos'),
      total: number().required('El total es requerido')
    })
  }
}
