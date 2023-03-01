
// armazena id e token em uma collection do banco de dados
export interface UpdateAccessTokenRepository {
  updateAccessToken (id: string, token: string): Promise<void>
}