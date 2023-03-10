import { Controller, HttpRequest, HttpResponse, LoadSurvey } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurvey.load()
    return null 
  }
}