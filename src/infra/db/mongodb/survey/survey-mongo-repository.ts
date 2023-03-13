import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../../domain/model/survey'
import { AddSurveyDto } from '../../../../domain/usecase/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyDto): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData) 
  }
  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys') 
    const surveys = await surveyCollection.find().toArray() // trazer a lista de surveys
    return surveys.map(survey => ({
      id: survey._id.toString(),
      question: survey.question,
      answers: survey.answers,
      date: survey.date,
    }))
  }
}