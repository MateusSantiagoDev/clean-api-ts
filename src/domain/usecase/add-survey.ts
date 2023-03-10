export interface AddSurveyDto {
  question: string
  answers: SurveyAnswers[]
  date: Date
}

export interface SurveyAnswers {
  image?: string
  answer: string
}

export interface AddSurvey {
  add (data: AddSurveyDto): Promise<void>
}