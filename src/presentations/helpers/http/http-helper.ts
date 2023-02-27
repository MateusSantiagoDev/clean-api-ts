import { HttpResponse } from '../http'

export const badRequest = (err: Error): HttpResponse => ({
  statusCode: 400,
  body: err
})

export const forbidden = (err: Error): HttpResponse => ({
  statusCode: 403,
  body: err
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})