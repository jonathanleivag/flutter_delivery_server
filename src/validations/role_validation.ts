import { object, string } from 'yup'

export default class RoleValidation {
  getRoleUser () {
    return object().shape({
      id: string().required('El id de usuario es requerido')
    })
  }
}
