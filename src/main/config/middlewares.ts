import { Express } from 'express'
import { BodyParser } from '../middlewares/body-parser'
import { Cors } from '../middlewares/cors'
import { ContentType } from '../middlewares/content-type'

export default (app: Express): void => {
  app.use(BodyParser)
  app.use(Cors)
  app.use(ContentType)
}