export class InvalidParamError extends Error {
  constructor (param: string) {
    super (`parâmetro inválido: ${param}`)
    this.name = 'InvalidParamError'
  }
}