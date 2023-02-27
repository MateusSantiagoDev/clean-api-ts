import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Authentication } from '../../../../domain/usecase/authentication'

export class LoginController implements Controller {
  constructor (private readonly autentication: Authentication) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    this.autentication.auth({ email, password })
    return new Promise(resolve => resolve(null))
  }
}