export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}

export interface SurveyAnswersModel {
  image?: string
  answer: string
}
