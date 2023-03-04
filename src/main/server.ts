import app from './config/app'
import env from './config/env'

app.listen(env.port, () => console.log(`Servidor rodando em http://localhost:${env.port}`))