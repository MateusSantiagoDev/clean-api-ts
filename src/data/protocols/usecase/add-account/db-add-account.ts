import { AccountModel } from '../../../../domain/model/account'
import { AccountDto, AddAccount } from '../../../../domain/usecase/add-account'
import { Hasher } from '../../criptography/hasher'

export class DbAccount implements AddAccount {
  constructor (private readonly hasher: Hasher) {}
  async add (account: AccountDto): Promise<AccountModel> {
    await this.hasher.hash(account.password)
    return new Promise(resolve => resolve(null))  
  }
}