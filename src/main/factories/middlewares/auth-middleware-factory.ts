import { Middleware } from '../../../presentations/protocols'
import { AuthMiddleware } from '../../../presentations/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '../usecase/account/load-account-by-token/db-load-account-by-token-factory'

export const MakeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}