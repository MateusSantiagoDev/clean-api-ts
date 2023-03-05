import { SignUpController } from '../../../../presentations/controller/methods/signup/signup-controller'
import { Controller } from '../../../../presentations/protocols'
import { makeDbAuthentication } from '../../usecase/authentication/db-authentication-factory'
import { makeDbAddAccount } from '../../usecase/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/login-controller-decorator-factory'
import { MakeSignupValidation } from './signup-validation-factory'

export const MakeSignupController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), MakeSignupValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}