import { Authentication, AuthenticationDto } from '../../../../domain/usecase/authentication'
import { LoadAccountByEmailRepository } from '../../db/account/load-account-by-email-repository'
import { HashCompare } from '../../criptography/hash-compare'
import { Encrypter } from '../../criptography/encrypter'
import { UpdateAccessTokenRepository } from '../../db/account/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, 
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository) {}

  async auth (authentication: AuthenticationDto): Promise<string> {
    // se o email informado pelo usuário na existir ele cria se existir retorna null
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      // comparando o password informado pelo usuário com a hashed_password salva no banco 
      const isValid = await this.hashCompare.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        // armazenando o id e o token no bandco de dados
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    } 
    return null 
  }
}