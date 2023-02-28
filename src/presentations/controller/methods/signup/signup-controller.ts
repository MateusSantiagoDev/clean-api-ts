import { AddAccount } from '../../../../domain/usecase/add-account'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {  
    
    const { name, email, password } = httpRequest.body
    await this.addAccount.add({
      name,
      email,
      password
    })    
    
    return new Promise(resolve => resolve(null))
  }
}