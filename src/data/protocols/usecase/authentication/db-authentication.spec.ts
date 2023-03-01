import { DbAuthentication } from './db-authentication'
import { LoadAccountByEmailRepository } from '../../db/account/load-account-by-email-repository'
import { AuthenticationDto } from '../../../../domain/usecase/authentication'
import { AccountModel } from '../../../../domain/model/account'

const makeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'valid_email@mail.com',
  password: 'any_password'
})

const makeAuthenticationDto = (): AuthenticationDto => ({
  email: 'valid_email@mail.com',
  password: 'any_password' 
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeAccountModel()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface sutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): sutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  // integração
  test('Deve chamar LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeAuthenticationDto())
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')

  })
})