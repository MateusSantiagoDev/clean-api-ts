import { Router } from 'express'
import { AdapterRoute } from '../adapters/express/express-route-adapter'
import { MakeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', AdapterRoute(MakeAddSurveyController()))
}