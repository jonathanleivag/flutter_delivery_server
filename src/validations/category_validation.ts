import { object, string } from 'yup'

export default class CategoryValidation {
  createCategory () {
    return object().shape({
      category: string().required('La categoria es requerida')
    })
  }
}
