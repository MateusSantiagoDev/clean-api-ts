import { AccountModel } from '../../../../domain/model/account'
import { AccountDto, AddAccount } from '../../../../domain/usecase/add-account'
import { Hasher } from '../../criptography/hasher'
import { AddAccountRepository } from '../../db/account/add-account-repository'

export class DbAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {}
  async add (accountData: AccountDto): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    return await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
  }
}