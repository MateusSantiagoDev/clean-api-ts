import { AddAccount } from '../../../../domain/usecase/add-account'
import { Authentication } from '../../../../domain/usecase/authentication'
import { EmailinUseError } from '../../../errors'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly authentication: Authentication) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {  
    try {

      const { name, email, password } = httpRequest.body
      
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailinUseError())
      } 
      
      await this.authentication.auth({ email, password })
      
      return null
    } catch (err) {
      return serverError(err)
    }
  }
}