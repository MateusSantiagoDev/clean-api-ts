import env from '../config/env'
import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'


let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  // inserindo um usuário
  const res = await accountCollection.insertOne({
    name: 'Mateus',
    email: 'mateus@teste.com.br',
    password: '1234',
    role: 'admin' // permissão de administrator
  })
  const result = res.insertedId
  // gerando um token para o usuário a partir do id
  const accessToken = sign({ result }, env.jwtSecret)
  // atualizando o usuário com o accesstoken
  await accountCollection.updateOne({
    _id: result// atualizando a chave accessToken        
  }, { $set: { accessToken } 
  })
  return accessToken
}

describe('Survey Router', () => {
  
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('deve retornar 403 ao adicionar pesquisa sem accesstoken', async () => {      
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image.com.br',
            answer: 'answer 1',
          }, {
            answer: 'answer 2',
          }]
        })
        .expect(403)
    })

    test('deve retornar 204 ao adicionar pesquisa com accesstoken valido', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken) // setando um header na rota
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image.com.br',
            answer: 'answer 1',
          }, {
            answer: 'answer 2',
          }]
        })                                
        
        .expect(204)
    }) 
  })

  describe('GET/surveys', () => {
    test('deve retornar 403 nas pesquisas sem accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('deve retornar 204 nas pesquisas com acceddToken válido', async () => {     
      const accessToken = await makeAccessToken()     
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)        
        .expect(204)
    }) 
  })
})