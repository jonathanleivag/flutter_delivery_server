import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios'
import Environments from '../config/env'
import { IInstallments } from '../types/interfeces'

export default class AxiosMercadoPagoUtil {
  private url: string
  private headers: AxiosRequestHeaders

  constructor () {
    this.url = 'https://api.mercadopago.com/v1'
    this.headers = {
      'Content-Type': 'application/json'
    }
  }

  private createAxios (): AxiosInstance {
    return axios.create({
      baseURL: this.url,
      headers: this.headers
    })
  }

  async installments (bin: string, amount: Number): Promise<IInstallments> {
    const data = await this.createAxios().get('/payment_methods/installments', {
      params: {
        access_token: new Environments().ACCESS_TOKEN,
        bin,
        amount
      }
    })

    return data.data[0]
  }
}
