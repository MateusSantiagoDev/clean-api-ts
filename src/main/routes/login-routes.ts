import { Router } from 'express'
import { AdapterRoute } from '../adapters/express-route-adapter'
import { MakeSignupController } from '../factories/controllers/login-methods/signup/signup-controller-factory'
import { MakeLoginController } from '../factories/controllers/login-methods/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', AdapterRoute(MakeSignupController()))
  router.post('/login', AdapterRoute(MakeLoginController()))
}