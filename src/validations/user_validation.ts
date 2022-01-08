import { object, string, ref } from 'yup'

export default class UserValidation {
  newUserValidation () {
    return object().shape({
      email: string()
        .required('El email es requerido')
        .email(),
      name: string().required('El nombre es requerido'),
      lastName: string().required('El apellido es requerido'),
      phone: string().required('El teléfono es requerido'),
      // image: string().required(),
      password: string().required('La contraseña es requerida'),
      confirmPassword: string()
        .required('La verificación de la contraseña es requerida')
        .oneOf([ref('password'), null], 'Las contraseñas deben coincidir')
      // isAviabile: number().required(),
      // sessionToken: string().required()
    })
  }
}
