import { Authentication, AuthenticationDto } from '../../../../domain/usecase/authentication'
import { LoadAccountByEmailRepository } from '../../db/account/load-account-by-email-repository'
import { HashCompare } from '../../criptography/hash-compare'
import { Encrypter } from '../../criptography/encrypter'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, 
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter) {}

  async auth (authentication: AuthenticationDto): Promise<string> {
    // se o email informado pelo usuário na existir ele cria se existir retorna null
    const accessToken = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (accessToken) {
      // comparando o password informado pelo usuário com a hashed_password salva no banco 
      await this.hashCompare.compare(authentication.password, accessToken.password)
      await this.encrypter.encrypt(accessToken.id)
    } 
    return null 
  }
}