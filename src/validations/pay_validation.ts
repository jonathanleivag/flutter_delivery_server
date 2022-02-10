import { number, object, string } from 'yup'

export default class PayValidation {
  installments () {
    return object().shape({
      bin: string().required('El bin es requerido'),
      amount: number().required('El monto es requerido')
    })
  }

  paymentCreditCard () {
    return object().shape({
      token: string().required('El token es requerido'),
      transactionAmount: number().required('El monto es requerido'),
      installments: number().required('El número de cuotas es requerido'),
      paymentMethodId: string().required(
        'El id del método de pago es requerido'
      )
    })
  }
}
