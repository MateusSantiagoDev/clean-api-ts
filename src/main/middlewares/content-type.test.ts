import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Deve retornar o tipo de conteúdo padrão como json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('Content-Type', /json/)
  })
})