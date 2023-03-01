import { AccountModel } from '../../../../domain/model/account'

// verifica se o email já existe no banco de dados
export interface LoadAccountByEmailRepository {
  loadByEmail (email: string): Promise<AccountModel>
}