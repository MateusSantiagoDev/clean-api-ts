import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../presentations/errors'
import { Validation } from '../../presentations/protocols'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null  
    }
  }
  return new ValidationStub()
}

interface sutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): sutTypes => {
  const validationStubs = [ makeValidation(), makeValidation() ]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Vaidation Composite', () => {
    
  // se algum metodo que implementa validation compose
  // falhar esse teste vai retornar o erro  
  test('Deve retornar um erro se alguma validação falhar', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value'})
    expect(error).toEqual(new MissingParamError('field'))
  })
})