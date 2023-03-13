import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurvey } from '../../../../../domain/usecase/load-surveys'
import { DbLoadSurveys } from '../../../../../data/usecase/load-surveys/db-load-surveys'

export const MakeDbLoadSurveys = (): LoadSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}