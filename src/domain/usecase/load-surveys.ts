import { SurveyModel } from '../model/survey'

export interface LoadSurvey {
  load (): Promise<SurveyModel[]>
}