import { Express } from 'express'
import { BodyParser, Cors, ContentType } from '../middlewares'

export default (app: Express): void => {
  app.use(BodyParser)
  app.use(Cors)
  app.use(ContentType)
}