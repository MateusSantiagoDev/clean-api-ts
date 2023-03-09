import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentations/protocols/validation'
import { MakeAddSurveyValidation } from './add-survey-validation-factory'

// mocando o módulo
jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {  

  // integração 
  test('Deve chamar validaçãoComposite com todas as validações', () => {
    MakeAddSurveyValidation()

    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})