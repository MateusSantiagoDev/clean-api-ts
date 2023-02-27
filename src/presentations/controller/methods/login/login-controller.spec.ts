import { LoginController } from './login-controller'
import { Authentication, AuthenticationDto } from '../../../../domain/usecase/authentication'
import { HttpRequest } from '../../../protocols/http'
import { unauthorized } from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationDto): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

interface sutTypes {
  authenticationStub: Authentication
  sut: LoginController
} 

const makesut = (): sutTypes => {
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(authenticationStub)
  return {
    sut,
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
})
