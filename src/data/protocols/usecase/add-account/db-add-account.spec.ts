import { Hasher, AccountDto, AddAccountRepository, AccountModel, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAccount } from './db-add-account'

const makeFakeAccountDto = (): AccountDto => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AccountDto): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}
const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

interface sutTypes {
  sut: DbAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): sutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const hasherStub = makeHasher()
  const sut = new DbAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAccount Usecase', () => {
  // integração
  test('Deve conectar o Hasher com a senha correta', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAccountDto())
    expect(hashSpy).toHaveBeenCalledWith('hashed_password')
  })

  // excessão
  test('Deve falhar se o Hasher falhar', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountDto())
    await expect(promise).rejects.toThrow()
  })

  // integração
  test('Deve chamar AddAccountRepository com valores corretos', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountDto())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  // excessão
  test('Deve falhar se AddAccountRepository falhar', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountDto())
    await expect(promise).rejects.toThrow()
  })

  // integração
  test('Deve chamar LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAccountDto())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Deve retornar nulo se loadAccountByEmailRepository não retornar nulo', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn<any, string>(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
    const response = await sut.add(makeFakeAccountDto())
    expect(response).toBeNull()
  })

  test('Deve retornar uma conta com sucesso', async () => {
    const { sut } = makeSut()
    const response = await sut.add(makeFakeAccountDto())
    expect(response).toEqual(makeFakeAccount())
  })
})