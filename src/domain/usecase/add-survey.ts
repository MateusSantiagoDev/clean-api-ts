import { SurveyAnswersModel } from '../model/survey'

export interface AddSurveyDto {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}

export interface AddSurvey {
  add (data: AddSurveyDto): Promise<void>
}