import { AddAccount, Authentication, Controller, HttpRequest, HttpResponse, Validation } from './signup-controller-protocols'
import { badRequest, forbidden, serverError, ok } from '../../../helpers/http/http-helper'
import { EmailinUseError } from '../../../errors'


export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount, 
    private readonly validation: Validation,
    private readonly authentication: Authentication, 
  ) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {  
    try {

      const error = this.validation.validate(httpRequest.body)
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