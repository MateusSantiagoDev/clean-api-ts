import { Controller, Validation, HttpRequest, HttpResponse, Authentication } from './login-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly autentication: Authentication,
    private readonly validation: Validation,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {

      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.autentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })

    } catch (err) {
      return serverError(err)
    }
  }
}