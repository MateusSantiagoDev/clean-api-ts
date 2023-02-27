export class UnauthorizedError extends Error {
  constructor () {
    super ('não autorizado')
    this.name = 'UnauthorizedError'
  }
}