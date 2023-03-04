import { LogControllerDecorator } from './log-controller-decorator'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentations/protocols'
import { AccountModel } from '../../domain/model/account'
import { ok, serverError } from '../../presentations/helpers/http/http-helper'

describe('LogController Decorator', () => {

  const makeFakeRequest = (): HttpRequest => ({
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

  const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError) 
  }

  const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
      async logError (stack: string): Promise<void> {
        return new Promise(resolve => resolve())   
      }
    }
    return new LogErrorRepositoryStub()
  }

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
    logErrorRepositoryStub: LogErrorRepository
  }
  
  const makeSut = (): sutTypes => {
    const logErrorRepositoryStub = makeLogErrorRepository()
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
      sut,
      controllerStub,
      logErrorRepositoryStub
    }
  }

  // integração
  test('Deve chamar o método do controller', async () => {
    const { sut, controllerStub } = makeSut()
    const controllerSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(controllerSpy).toHaveBeenCalledWith(makeFakeRequest())
  }) 

  // integração
  test('Deve chamar LogErrorRepository com erro correto se o controlador retornar um erro de servidor', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
    await sut.handle(makeFakeRequest())
    expect(logErrorSpy).toHaveBeenCalledWith('any_stack')
  })

  // sucesso
  test('Deve retornar o mesmo resultado do controlador', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})