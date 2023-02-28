import { SignUpController } from './signup-controller'
import { AddAccount, AccountDto} from '../../../../domain/usecase/add-account'
import { AccountModel } from '../../../../domain/model/account'
import { HttpRequest } from '../login/login-controller-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    confirmPassword: 'any_password'
  }
})

const makeAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AccountDto): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

interface sutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
}

const makeSut = (): sutTypes => {
  const addAccountStub = makeAccount()
  const sut = new SignUpController(addAccountStub)
  return {
    sut,
    addAccountStub
  }
}

describe('Signup Controller', () => {
  // teste de integração
  test('Deve chamar AddAccount com valores corretos', async () => {
    const { sut, addAccountStub } = makeSut()
    const accounSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(accounSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})