export class ServerError extends Error {
  constructor (stack: string) {
    super ('Erro no Servidor')
    this.name = 'ServerError'
    this.stack = stack
  }
}