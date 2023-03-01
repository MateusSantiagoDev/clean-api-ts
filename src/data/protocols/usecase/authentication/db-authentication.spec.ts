import { DbAuthentication } from './db-authentication'
import { LoadAccountByEmailRepository } from '../../db/account/load-account-by-email-repository'
import { AuthenticationDto } from '../../../../domain/usecase/authentication'
import { AccountModel } from '../../../../domain/model/account'
import { HashCompare } from '../../criptography/hash-compare'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthenticationDto = (): AuthenticationDto => ({
  email: 'valid_email@mail.com',
  password: 'any_password' 
})

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashCompareStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccountModel()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface sutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
}

const makeSut = (): sutTypes => {
  const hashCompareStub = makeHashCompare()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub
  }
}

describe('DbAuthentication Usecase', () => {
  // integração
  test('Deve chamar LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthenticationDto())
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  // excessão
  test('Deve falhar se LoadAccountByEmailRepository falhar', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationDto())
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar nulo se LoadAccountByEmailRepository retornar nulo', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthenticationDto())
    expect(accessToken).toBeNull()
  })

  //integração
  test('Deve chamar HashComparer com valores corretos', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthenticationDto())
    expect(compareSpy).toHaveBeenLastCalledWith('any_password', 'hashed_password')
  })
})