import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  // interação
  test('Deve chamar o validador com o e-mail correto', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})