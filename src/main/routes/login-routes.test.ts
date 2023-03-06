import env from '../config/env'
import app from '../config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'

describe('Login Router', () => {

  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /signup', () => {
    test('Deve retornar 200 na rota signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Mateus Santiago',
          email: 'mateus_santiago2.3@outlook.com',
          password: '1234',
          confirmPassword: '1234'
        })
        
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Deve retornar 200 na rota login', async () => {

      // simulando um registro do banco de dados
      const password = await hash('1234', 12)
      await accountCollection.insertOne({
        name: 'Mateus Santiago',
        email: 'mateus_santiago2.3@outlook.com',
        password
      })
      // simulando a busca do registro valido no banco de dados
      await request(app)
        .post('/api/login')
        .send({
          email: 'mateus_santiago2.3@outlook.com',
          password: '1234'
        })

        .expect(200)
    })
  })
})