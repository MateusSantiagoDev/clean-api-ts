import { Router } from 'express'
import { AdapterRoute } from '../adapters/express/express-route-adapter'
import { MakeSignupController } from '../factories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', AdapterRoute(MakeSignupController()))
}