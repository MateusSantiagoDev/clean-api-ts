import { Router } from 'express'
import { AdapterRoute } from '../adapters/express-route-adapter'
import { MakeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', AdapterRoute(MakeAddSurveyController()))
}