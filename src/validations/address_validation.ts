import { object, string } from 'yup'

export default class AddressValidation {
  addAddress () {
    return object().shape({
      directionForm: string().required('La dirección es requerida'),
      barrioForm: string().required('El barrio es requerido')
    })
  }
}
