import env from '../config/env'
import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

describe('Survey Router', () => {
  
  let surveyCollection: Collection
  
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('Deve retornar 204 ao adicionar sucesso na pesquisa', async () => {
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
        .expect(204)
    })
  })
})