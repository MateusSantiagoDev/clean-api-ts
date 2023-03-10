import { Validation } from '../../presentations/protocols/validation'

// class que recebe um array de validations
export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (input: any): Error {
    // lup em todos os métodos que implementam o validation
    for (const field of this.validations) {
      const error = field.validate(input)
      if(error) {
        return error
      }
    }
  }
}