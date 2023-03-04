import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { AccountModel } from '../../../../domain/model/account'
import { AccountDto } from '../../../../domain/usecase/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AccountDto): Promise<AccountModel> {
    const getCollection = await MongoHelper.getCollection('account')
    const result = await getCollection.insertOne(accountData)
    return MongoHelper.mapper(result.insertedId)
  }
}