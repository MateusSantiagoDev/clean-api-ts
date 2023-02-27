import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Authentication } from '../../../../domain/usecase/authentication'
import { unauthorized } from '../../../helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (private readonly autentication: Authentication) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    const accessToken = this.autentication.auth({ email, password })
    if (!accessToken) {
      return unauthorized()
    }
    return new Promise(resolve => resolve(null))
  }
}