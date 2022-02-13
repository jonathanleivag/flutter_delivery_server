import { number, object, string } from 'yup'

export default class ShoppValidation {
  addShoppingCart () {
    return object().shape({
      count: number().required('La cantidad es requerida de productos'),
      total: number().required('El total es requerido')
    })
  }

  getProductByState () {
    return object().shape({
      state: string().required('El estado es requerido')
    })
  }

  getNumberOrder () {
    return object().shape({
      purchaseId: string().required('Codigo del pedido es requerido')
    })
  }
}
