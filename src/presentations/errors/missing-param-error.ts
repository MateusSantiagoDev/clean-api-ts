export class MissingParamError extends Error {
  constructor (param: string) {
    super (`parâmetro ausente: ${param}`)
    this.name = 'MissingParamError'
  }
}