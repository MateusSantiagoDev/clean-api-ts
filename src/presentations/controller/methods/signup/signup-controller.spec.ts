import { SignUpController } from './signup-controller'
import { AddAccount, AccountDto} from '../../../../domain/usecase/add-account'
import { AccountModel } from '../../../../domain/model/account'
import { HttpRequest } from '../login/login-controller-protocols'
import { forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { EmailinUseError, ServerError } from '../../../errors'
import { Authentication, AuthenticationDto} from '../../../../domain/usecase/authentication'
import { Validation } from '../../../protocols/validation'

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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationDto): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

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
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const addAccountStub = makeAccount()
  const sut = new SignUpController(addAccountStub, authenticationStub, validationStub)
  return {
    sut,
    addAccountStub,
    authenticationStub,
    validationStub
  }
}

describe('Signup Controller', () => {
  // teste de integração
  test('Deve chamar o AddAccount com valores corretos', async () => {
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
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailinUseError()))
  })

  // integração
  test('Deve chamar o Authentication com valores corretos', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  // excessão
  test('Deve retornar 500 se a autenticação falhar', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  // integração
  test('Deve chamar o Validation com valores corretos', async () => {
    const { sut, validationStub } = makeSut()
    const valideteSpy = jest.spyOn(validationStub, 'validate')
    const httpResponse = makeFakeRequest()
    await sut.handle(httpResponse)
    expect(valideteSpy).toHaveBeenCalledWith(httpResponse.body)
  })
})