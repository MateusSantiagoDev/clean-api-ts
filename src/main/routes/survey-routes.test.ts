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
  })
})