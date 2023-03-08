import { AddSurvey, AddSurveyDto, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository,
  ) {}

  async add (data: AddSurveyDto): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}