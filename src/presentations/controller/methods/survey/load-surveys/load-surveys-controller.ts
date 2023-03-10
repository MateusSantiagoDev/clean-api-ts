import { ok, serverError } from './../../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurvey } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return ok(surveys)
    } catch(error) {
      return serverError(error)
    }
  }
}