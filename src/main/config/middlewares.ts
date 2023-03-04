import { Express } from 'express'
import { BodyParser } from '../middlewares/body-parser'
import { Cors } from '../middlewares/cors'

export default (app: Express): void => {
  app.use(BodyParser)
  app.use(Cors)
}