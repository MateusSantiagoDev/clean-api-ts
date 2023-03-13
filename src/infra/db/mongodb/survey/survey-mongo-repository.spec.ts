import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'


const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}


describe('Survey Mongo Repository', () => {

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

  describe('add()', () => {

    // integração
    test('Deve adicionar o Survey com sucesso', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer',
        }, {
          answer: 'any_answer',
        }],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {

    // integração
    test('Deve adicionar todos os Surveys com sucesso', async () => {
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer',
        }, {
          answer: 'any_answer',
        }],
        date: new Date()
      }, {
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer',
        }, {
          answer: 'other_answer',
        }],
        date: new Date()
      }])
      const sut = makeSut()
      const surveys = await sut.loadAll()       
      expect(surveys).toHaveLength(2) // inserindo dois objetos no teste
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
  })
})