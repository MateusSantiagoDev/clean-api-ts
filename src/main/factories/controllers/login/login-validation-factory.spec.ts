import { EmailValidation, RequiredFieldValidation, ValidationComposite} from '../../../../validation/validators'
import { Validation } from '../../../../presentations/protocols/validation'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { MakeLoginValidation } from './login-validation-factory'

// mocando o moódulo
jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidator Factory', () => {
  // integração
  test('Deve chamar validaçãoComposite com todas as validações', () => {
    // factory de produção
    MakeLoginValidation()

    // garantir que o validationComposite vai injetar
    // todos os métodos devalidação

    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})