import { Router } from 'express'
import { AdapterRoute } from '../adapters/express-route-adapter'
import { MakeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { MakeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-survey-controller-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, AdapterRoute(MakeAddSurveyController()))
  router.get('/surveys', auth, AdapterRoute(MakeLoadSurveysController()))
}