import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccount } from '../../../../domain/usecase/add-account'
import { DbAccount } from '../../../../data/usecase/add-account/db-add-account'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}