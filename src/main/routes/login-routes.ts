import { Router } from 'express'
import { AdapterRoute } from '../adapters/express/express-route-adapter'
import { MakeSignupController } from '../factories/controllers/signup/signup-controller-factory'
import { MakeLoginController } from '../factories/controllers/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', AdapterRoute(MakeSignupController()))
  router.post('/login', AdapterRoute(MakeLoginController()))
}