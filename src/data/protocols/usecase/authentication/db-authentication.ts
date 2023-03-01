import { Authentication, AuthenticationDto } from '../../../../domain/usecase/authentication'
import { LoadAccountByEmailRepository } from '../../db/account/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}
  async auth (authentication: AuthenticationDto): Promise<string> {
    await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    return new Promise(resolve => resolve(null))  
  }
}