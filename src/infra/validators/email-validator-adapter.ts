import validator from 'validator'
import { EmailValidator } from '../../validation/protocols/email-validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    validator.isEmail(email)
    return null
  }
}