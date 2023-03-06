import { LoginController } from './login-controller'
import { Authentication, AuthenticationDto, Validation, HttpRequest } from './login-controller-protocols'
import { serverError, unauthorized, ok, badRequest } from '../../../helpers/http/http-helper'
import { MissingParamError } from '../../../errors'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
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

interface sutTypes {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
} 

const makesut = (): sutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    validationStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  // integração
  test('O teste deve chamar Autenticação com valores corretos', async () => {
    const { sut, authenticationStub } = makesut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Deve retornar 401 se forem fornecidas credenciais inválidas', async () => {
    const { sut, authenticationStub } = makesut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Deve retornar 500 se a autenticação falhar', async () => {
    const { sut, authenticationStub } = makesut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })  

  test('Deve retornar 200 se credenciais válidas forem fornecidas', async () => {
    const { sut } = makesut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  // integração
  test('Deve chamar Validação com valores corretos', async () => {
    const { sut, validationStub } = makesut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Deve retornar 400 se a validação retornar um erro', async () => {
    const { sut, validationStub } = makesut()
    jest.spyOn<any, string>(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_fild'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_fild')))
  })
})
