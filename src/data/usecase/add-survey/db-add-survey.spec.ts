import { AddSurveyRepository, AddSurveyDto } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'


const makeFakeSurveyData = (): AddSurveyDto => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyDto): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

interface sutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): sutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {

  // integração
  test('Deve chamar AddSurveyRepositóry com valores corretos', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  // excessão
  test('Deve falhar se AddSurveyRepository falhar', async ()=> {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})