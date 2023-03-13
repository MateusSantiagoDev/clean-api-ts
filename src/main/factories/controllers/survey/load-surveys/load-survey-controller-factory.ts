import { Controller } from '../../../../../presentations/protocols/controller'
import { makeLogControllerDecorator } from '../../../decorators/login-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentations/controller/methods/survey/load-surveys/load-surveys-controller'
import { MakeDbLoadSurveys } from '../../../usecase/survey/load-surveys/db-load-surveys'

export const MakeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(MakeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}