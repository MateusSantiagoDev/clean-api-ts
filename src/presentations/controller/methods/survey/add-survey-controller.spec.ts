import MockDate from 'mockdate'
import { AddSurveyController } from './add-survey-controller'
import { Validation, HttpRequest, AddSurvey, AddSurveyDto } from './add-survey-controller-protocols'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      answer: 'any_answer',
    }],
    date: new Date()
  }
})

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add (data: AddSurveyDto): Promise<void> {
      return new Promise(resolve => resolve())   
    }
  }
  return new AddSurveyStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null   
    }
  }
  return new ValidationStub()
}

interface sutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): sutTypes => {
  const addSurveyStub = makeAddSurvey()
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSyrvey Controller', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  // integração
  test('deve chamar o Validation com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Deve retornar 400 se a validação falhar', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  // integração
  test('deve chamar o AddSurvey com os valores corretos', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  // excessão
  test('Deve retornar 500 se AddSurvey falhar', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  // sucesso
  test('Deve retornar 204 em caso de sucesso', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})