import { AccountModel } from '../../../../domain/model/account'
import { AccountDto } from '../../../../domain/usecase/add-account'

// cria uma conta para o usuário
export interface AddAccountRepository {
  add (account: AccountDto): Promise<AccountModel>
} 