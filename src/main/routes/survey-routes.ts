import { Router } from 'express'
import { AdapterMiddleware } from '../adapters/express-middleware-adapter'
import { AdapterRoute } from '../adapters/express-route-adapter'
import { MakeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { MakeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-survey-controller-factory'
import { MakeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = AdapterMiddleware(MakeAuthMiddleware('admin'))
  const auth = AdapterMiddleware(MakeAuthMiddleware())
  router.post('/surveys', adminAuth, AdapterRoute(MakeAddSurveyController()))
  router.get('/surveys', auth, AdapterRoute(MakeLoadSurveysController()))
}