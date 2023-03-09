import { MakeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../../../presentations/protocols/controller'
import { LoginController } from '../../../../../presentations/controller/methods/login/login-controller'
import { makeDbAuthentication } from '../../../usecase/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../../decorators/login-controller-decorator-factory'

export const MakeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), MakeLoginValidation())
  return makeLogControllerDecorator(controller)
}