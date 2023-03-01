import { CompareFieldsValidation } from './compare-field-validation'
import { InvalidParamError } from '../../presentations/errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareField Validation', () => {
  test('Deve retornar um InvalidParamError se o validation falhar', () => {
    const sut = makeSut()
    // se o password e o confirm password forem 
    // diferentes esse teste vai ser chamado
    const error = sut.validate({field: 'any_value', fieldToCompare: 'wrong_value'})
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  // teste vai garantir que em caso de não houver erro
  // não sera retornado nada
  test('Não deve retornar se a validação for bem-sucedida', () => {
    const sut = makeSut()
    const error = sut.validate({field: 'any_value', fieldToCompare: 'any_value'})
    expect(error).toBeFalsy()
  })
})