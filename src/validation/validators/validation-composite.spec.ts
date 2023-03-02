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

  // nesse caso se as duas dependencias retornarem erro
  // o teste vai garantir que o erro retornado é o da primeira
  test('Deve retornar o primeiro erro se mais de uma validação falhar', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  // não retorna nada
  test('Não deve retornar se a validação for bem-sucedida', () => {
    const { sut } = makeSut()
    const value = sut.validate({ field: 'any_value' })
    expect(value).toBeFalsy()
  })
})