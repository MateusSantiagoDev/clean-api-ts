import { EmailValidation, RequiredFieldValidation, ValidationComposite} from '../../../../../validation/validators'
import { Validation } from '../../../../../presentations/protocols/validation'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'

export const MakeLoginValidation = (): ValidationComposite => {
  
  const validations: Validation[] = []

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}