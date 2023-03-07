import { Controller } from '../../../../presentations/protocols/controller'
import { AddSurveyController } from '../../../../presentations/controller/methods/survey/add-survey-controller'
import { makeLogControllerDecorator } from '../../decorators/login-controller-decorator-factory'
import { MakeDbAddSurvey } from '../../usecase/add-survey/db-add-survey-factory'
import { MakeAddSurveyValidation } from './add-survey-validation-factory'

export const MakeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(MakeAddSurveyValidation(), MakeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}