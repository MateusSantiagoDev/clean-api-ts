import { AdapterMiddleware } from '../adapters/express-middleware-adapter'
import { MakeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export const auth = AdapterMiddleware(MakeAuthMiddleware())