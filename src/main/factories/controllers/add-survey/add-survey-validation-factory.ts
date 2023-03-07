import { ValidationComposite, RequiredFieldValidation } from '../../../../validation/validators'
import { Validation } from '../../../../presentations/protocols/validation'

export const MakeAddSurveyValidation = (): ValidationComposite => {
  
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}