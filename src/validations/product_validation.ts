import { object, string, number } from 'yup'

export default class ProductValidation {
  createProduct () {
    return object().shape({
      name: string().required('Nombre es requerido'),
      description: string().required('Descripción es requerida'),
      price: number().required('Precio es requerido'),
      image1: string().required('Al menos una imagen es requerida'),
      category: string().required('Categoría es requerida')
    })
  }
}
