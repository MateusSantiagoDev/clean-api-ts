import MockDate from 'mockdate'
import { noContent, ok, serverError } from '../../../../helpers/http/http-helper'
import { LoadSurvey, SurveyModel } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      answer: 'any_answer',
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }, {
      answer: 'other_answer',
    }],
    date: new Date()
  }]
}

const makeLoadSurveys = (): LoadSurvey => {
  class LoadSurveysStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysStub()
}

interface sutTypes {
  loadSurveysStub: LoadSurvey
  sut: LoadSurveysController
}

const makeSut = (): sutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  // integração
  test('Deve chamar LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()    
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled() // somente espero q ele seja chamado
  })

  // se não houver conteúdo retorna 204
  test('deve retornar 204 se LoadSurvey retornar empyt', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpRequest = await sut.handle({})
    expect(httpRequest).toEqual(noContent())
  })

  // sucesso
  test('deve retornar 200 em caso de sucesso', async () => {
    const { sut } = makeSut()
    const httpRequest = await sut.handle({})
    expect(httpRequest).toEqual(ok(makeFakeSurveys()))
  })

  // excessão
  test('deve retornar 500 se LoadSurveys falhar', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})