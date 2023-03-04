import { Controller, HttpRequest, HttpResponse } from '../../presentations/protocols'

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.controller.handle(httpRequest)
    return new Promise(resolve => resolve(null))      
  }
}