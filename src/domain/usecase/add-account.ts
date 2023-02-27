import { AccountModel } from '../model/account'

export interface AccountDto {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add (account: AccountDto): Promise<AccountModel>
}