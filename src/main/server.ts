import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

// só vai conectar com o servidor se conectar primeiro com o mongoHelper
MongoHelper.connect(env.mongoUrl).then(async () => {

  const app = (await import('./config/app')).default
  app.listen(env.port, () => console.log(`Servidor rodando em http://localhost:${env.port}`))

})
