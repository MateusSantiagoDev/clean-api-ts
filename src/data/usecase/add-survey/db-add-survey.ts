import { AddSurvey, AddSurveyDto } from '../../../domain/usecase/add-survey'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository,
  ) {}

  async add (data: AddSurveyDto): Promise<void> {
    await this.addSurveyRepository.add(data)
    return new Promise(resolve => resolve())
  }
}