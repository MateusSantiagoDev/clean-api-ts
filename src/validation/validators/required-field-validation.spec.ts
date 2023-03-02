import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../presentations/errors/missing-param-error'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Deve retornar um MissingParamError se o Validation falhar', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'invalid_param' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Não deve retornar se a validação for bem-sucedida', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_param' })
    expect(error).toBeFalsy()
  })
})