import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/model/account'
import { AccountDto } from '../../../../domain/usecase/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AccountDto): Promise<AccountModel> {
    const getCollection = await MongoHelper.getCollection('accounts')
    const result = await getCollection.insertOne(accountData)
    return await MongoHelper.mapper(result.insertedId)
   
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const getCollection = await MongoHelper.getCollection('accounts')
    const account = await getCollection.findOne({ email })
    return account && MongoHelper.mapper(account)
  }
}