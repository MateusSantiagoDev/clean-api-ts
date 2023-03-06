import { MakeSignupValidation } from './signup-validation-factory'
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite} from '../../../../validation/validators'
import { Validation } from '../../../../presentations/protocols/validation'
import { EmailValidator } from '../../../../validation/protocols/email-validator'

// mocando o modulo do validationCompose
// qunado eu moco o modulo ele perde o comportamento default
jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true  
    }
  }
  return new EmailValidatorStub()
}

describe('SignupValidator Factory', () => {
  // integração
  test('Deve chamar o validationComposite com todas as validações', () => {
    MakeSignupValidation()

    // garantindo que o composite não vai deixar
    // de injetar nenhuma validação
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'confirmPassword']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})