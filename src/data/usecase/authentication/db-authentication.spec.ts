import { LoadAccountByEmailRepository,UpdateAccessTokenRepository, HashCompare, Encrypter, AuthenticationDto, AccountModel } from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'

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

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    updateAccessToken (id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class Encrypterstub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('any_token')) 
    }
  }
  return new Encrypterstub()
}

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
  encrypterstub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): sutTypes => {
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const encrypterstub = makeEncrypter()
  const hashCompareStub = makeHashCompare()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, encrypterstub, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterstub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  // integra????o
  test('Deve chamar LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthenticationDto())
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  // excess??o
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

  //integra????o
  test('Deve chamar o HashComparer com valores corretos', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthenticationDto())
    expect(compareSpy).toHaveBeenLastCalledWith('any_password', 'hashed_password')
  })

  // excess??o
  test('Deve falhar se o HashComparer falhar', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationDto())
    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar null se o HashCompare retornar false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthenticationDto())
    expect(accessToken).toBeNull()
  })

  // integra????o
  test('Deve chamar o Encrypter com id correto', async () => {
    const { sut, encrypterstub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterstub, 'encrypt')
    await sut.auth(makeFakeAuthenticationDto())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  // excess??o
  test('Deve falhar se o Encrypter falhar', async () => {
    const { sut, encrypterstub } = makeSut()
    jest.spyOn(encrypterstub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationDto())
    await expect(promise).rejects.toThrow()
  })

  // integra????o
  test('Deve chamar UpdateAccessTokenRepository com valores corretos', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthenticationDto())
    expect(updateAccessTokenSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  // excess??o
  test('Deve falhar se UpdateAccessTokenRepository falhar', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationDto())
    await expect(promise).rejects.toThrow()
  })

  // sucesso
  test('Deve retornar um token em caso de sucesso', async () => {
    const { sut } = makeSut()
    const accesstoken = await sut.auth(makeFakeAuthenticationDto())
    expect(accesstoken).toBe('any_token')
  })
})