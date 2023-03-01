import { AccountModel } from '../../../../domain/model/account'
import { AccountDto, AddAccount } from '../../../../domain/usecase/add-account'
import { Hasher } from '../../criptography/hasher'
import { AddAccountRepository } from '../../db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../db/account/load-account-by-email-repository'

export class DbAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository, private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}
  async add (accountData: AccountDto): Promise<AccountModel> {
    // se o email não existir ele cria uma conta, se ja existir ele retorna null
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      return await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    }
    return null
  }
}