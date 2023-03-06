import env from '../../../../main/config/env'
import { LogMongoRepository } from './log-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

describe('Log Mongo Repository', () => {

  let erroCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    erroCollection = await MongoHelper.getCollection('errors')
    await erroCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  test('Deve criar um log de erro com sucesso', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await erroCollection.countDocuments()
    expect(count).toBe(1)
  })
})