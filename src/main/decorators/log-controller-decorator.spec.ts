import { LogControllerDecorator } from './log-controller-decorator'
import { Controller, HttpRequest, HttpResponse } from '../../presentations/protocols'
import { AccountModel } from '../../domain/model/account'
import { ok } from '../../presentations/helpers/http/http-helper'

describe('LogController Decorator', () => {

  const makeFakeReuest = (): HttpRequest => ({
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      confirmPassword: 'any_password'
    }
  })

  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  })

  const makeController = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise(resolve => resolve(ok(makeFakeAccount()))) 
      }
    }
    return new ControllerStub()
  }

  interface sutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
  }
  
  const makeSut = (): sutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)
    return {
      sut,
      controllerStub
    }
  }

  // integração
  test('Deve chamar o método do controller', async () => {
    const { sut, controllerStub } = makeSut()
    const controllerSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeReuest())
    expect(controllerSpy).toHaveBeenCalledWith(makeFakeReuest())
  })
})