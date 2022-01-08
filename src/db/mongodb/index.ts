import mongoose from 'mongoose'
import Environments from '../../config/env'

export default class MongoDB {
  private uri: string

  constructor () {
    this.uri = Environments.URI
  }

  async connect (): Promise<typeof mongoose> {
    return await mongoose.connect(this.uri)
  }

  execute (): void {
    const db = this.connect()

    db.then(() => {
      // eslint-disable-next-line no-console
      console.log('MongoDB connected 👌')
    }).catch(error => {
      console.error('MongoDB not connected ❎', error)
    })
  }
}
