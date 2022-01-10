import express, { Express } from 'express'
import http from 'http'
import Environments from '../config/env'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import MongoDB from '../db/mongodb'
import { UserRoute } from '../routers'

export default class Server {
  private app: Express
  private port: number | string
  private server: http.Server

  constructor () {
    this.app = express()
    this.port = new Environments().PORT
    this.server = http.createServer(this.app)
  }

  middlewares (): void {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(morgan('dev'))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.static(path.resolve(__dirname, '../public')))
  }

  config (): void {
    this.app.disable('x-powered-by')
  }

  routes () {
    this.app.use('/api/user', new UserRoute().execute())
  }

  serverHttp (): void {
    this.server.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server is running on port ${this.port}`)
    })
  }

  database (): void {
    const db = new MongoDB()
    db.execute()
  }

  execute (): void {
    this.database()
    this.config()
    this.middlewares()
    this.routes()
    this.serverHttp()
  }
}
