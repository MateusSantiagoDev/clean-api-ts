import env from '../../../../config/env'
import { LoadAccountByToken } from '../../../../../domain/usecase/load-account-by-token'
import { DbLoadAccountByToken } from '../../../../../data/usecase/load-account-by-token/db-load-account-by-token'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'


export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}