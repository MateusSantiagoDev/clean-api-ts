import { SurveyModel } from '../../../domain/model/survey'
import { LoadSurvey } from '../../../domain/usecase/load-surveys'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'

export class DbLoadSurveys implements LoadSurvey {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository,
  ) {}

  async load (): Promise<SurveyModel[]> {
    const surveys= await this.loadSurveysRepository.loadAll()
    return surveys 
  }
}