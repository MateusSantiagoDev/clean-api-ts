import { Router } from 'express'
import { AdapterMiddleware } from '../adapters/express-middleware-adapter'
import { AdapterRoute } from '../adapters/express-route-adapter'
import { MakeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { MakeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = AdapterMiddleware(MakeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, AdapterRoute(MakeAddSurveyController()))
}