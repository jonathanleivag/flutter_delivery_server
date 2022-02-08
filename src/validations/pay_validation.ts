import { number, object, string } from 'yup'

export default class PayValidation {
  installments () {
    return object().shape({
      bin: string().required('El bin es requerido'),
      amount: number().required('El monto es requerido')
    })
  }
}
