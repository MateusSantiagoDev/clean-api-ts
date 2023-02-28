import { AddAccount } from '../../../../domain/usecase/add-account'
import { serverError } from '../../../helpers/http/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {  
    try {
      const { name, email, password } = httpRequest.body
      await this.addAccount.add({
        name,
        email,
        password
      })    
      
      return null
    } catch (err) {
      return serverError(err)
    }
  }
}