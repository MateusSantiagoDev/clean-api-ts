import { Request, Response, NextFunction } from 'express'

export const ContentType = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  next()
}