import { SignUpController } from '../../../../../presentations/controller/methods/signup/signup-controller'
import { Controller } from '../../../../../presentations/protocols'
import { makeDbAddAccount } from '../../../usecase/account/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../../decorators/login-controller-decorator-factory'
import { MakeSignupValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../../usecase/account/authentication/db-authentication-factory'

export const MakeSignupController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), MakeSignupValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}