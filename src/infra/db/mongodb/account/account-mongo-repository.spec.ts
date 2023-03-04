import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'

let accountCollection = Collection.prototype

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})

  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Deve retornar a conta e adicionar sucesso', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const userCreated = await accountCollection.findOne({ id: account.id })
    expect(userCreated).toBeTruthy()
    expect(userCreated.name).toBe('any_name')
    expect(userCreated.email).toBe('any_email@mail.com')
    expect(userCreated.password).toBe('any_password')
  })
})
