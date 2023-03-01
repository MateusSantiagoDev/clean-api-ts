import { DbAccount } from './db-add-account'
import { Hasher } from '../../criptography/hasher'
import { AccountDto } from '../../../../domain/usecase/add-account'

const makeFakeAccountDto = (): AccountDto => ({
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password'
})

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
}

const makeSut = (): sutTypes => {
  const hasherStub = makeHasher()
  const sut = new DbAccount(hasherStub)
  return {
    sut,
    hasherStub
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
  test('Deve falhar se Hasher falhar', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountDto())
    await expect(promise).rejects.toThrow()
  })
})