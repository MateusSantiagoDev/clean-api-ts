import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../login/login-controller-protocols'
import { Validation } from '../../../protocols/validation'
import { badRequest } from '../../../helpers/http/http-helper'
import { AddSurvey } from '../../../../domain/usecase/add-survey'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }

    const { question, answers } = httpRequest.body
    await this.addSurvey.add({
      question,
      answers
    })
    
    return new Promise(resolve => resolve(null))
  }  
}