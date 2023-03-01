import { Validation } from '../../presentations/protocols'
import { EmailValidator } from '../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}
  validate (input: any): Error {
    this.emailValidator.isValid(input[this.fieldName])
    return null
  }
}