import { AddSurveyDto } from '../../../../domain/usecase/add-survey'

export interface AddSurveyRepository {
  add (surveyData: AddSurveyDto): Promise<void>
}