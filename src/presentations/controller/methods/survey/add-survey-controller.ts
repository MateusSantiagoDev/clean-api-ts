import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../login/login-controller-protocols'
import { Validation } from '../../../protocols/validation'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}
  handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return new Promise(resolve => resolve(null))
  }  
}