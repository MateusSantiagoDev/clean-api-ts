import { Express, Router } from 'express'
import { readdirSync} from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  // a partir do diretorio ../routes vai ser feito build em todos os 
  // arquivos que não incluirem .test.
  readdirSync(join(__dirname, '../routes')).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}