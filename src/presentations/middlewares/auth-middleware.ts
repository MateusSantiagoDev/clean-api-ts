import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecase/load-account-by-token'


export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)
    }
    return forbidden(new AccessDeniedError())
  }
}