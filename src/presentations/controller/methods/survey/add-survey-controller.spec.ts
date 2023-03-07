import { AddSurveyController } from './add-survey-controller'
import { Validation, HttpRequest } from '../../../protocols'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answers: 'any_answer'
    }]
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

interface sutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddSyrvey Controller', () => {
  // integração
  test('deve chamar o Validation com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})