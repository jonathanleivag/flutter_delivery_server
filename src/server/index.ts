import express, { Express } from 'express'
import http from 'http'
import Environments from '../config/env'

export default class Server {
  private app: Express
  private port: number | string
  private server: http.Server

  constructor () {
    this.app = express()
    this.port = Environments.PORT
    this.server = http.createServer(this.app)
  }

  execute (): void {
    this.server.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${this.port}`)
    })
  }
}
