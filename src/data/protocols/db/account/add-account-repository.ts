import { AccountModel } from '../../../../domain/model/account'
import { AccountDto } from '../../../../domain/usecase/add-account'

export interface AddAccountRepository {
  add (account: AccountDto): Promise<AccountModel>
} 