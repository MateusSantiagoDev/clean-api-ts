import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  // integração
  test('Deve chamar o validador com o e-mail correto', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('Deve retornar falso se o validador retornar falso', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isEmail = sut.isValid('any_email@mail.com')
    expect(isEmail).toBe(false)
  })

  // sucesso
  test('Deve retornar true se o validador retornar true', () => {
    const sut = makeSut()
    const isEmail = sut.isValid('any_email@mail.com')
    expect(isEmail).toBe(true)
  })
})