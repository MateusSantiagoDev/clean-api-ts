import { Validation } from '../../presentations/protocols'
import { InvalidParamError } from '../../presentations/errors'

// compara dois campos
export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string, 
    private readonly fieldTocampareName: string) {}

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldTocampareName]) {
      return new InvalidParamError(this.fieldTocampareName)
    }
  }
}