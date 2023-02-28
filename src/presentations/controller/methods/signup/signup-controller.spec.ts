import { SignUpController } from './signup-controller'
import { AddAccount, AccountDto} from '../../../../domain/usecase/add-account'
import { AccountModel } from '../../../../domain/model/account'
import { HttpRequest } from '../login/login-controller-protocols'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { EmailinUseError, ServerError } from '../../../errors'

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

  // excessão
  test('Deve retornar 500 se AddAccount falhar', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Deve retornar 403 se AddAccount retornar nulo', async () => {
    const {sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailinUseError()))
  })
})