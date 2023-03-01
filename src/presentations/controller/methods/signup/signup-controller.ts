import { AddAccount } from '../../../../domain/usecase/add-account'
import { Authentication } from '../../../../domain/usecase/authentication'
import { EmailinUseError } from '../../../errors'
import { badRequest, forbidden, serverError, ok } from '../../../helpers/http/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly authentication: Authentication, private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {  
    try {

      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailinUseError())
      } 
      
      const accessToken = await this.authentication.auth({ email, password })    
      return ok({ accessToken })

    } catch (err) {
      return serverError(err)
    }
  }
}