import { Validation } from '../../presentations/protocols'
import { MissingParamError } from '../../presentations/errors'

// class que vai verificar se determinado parâmetro existe
export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  
  // se o parâmetro não existir retorna o erro
  validate (input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}