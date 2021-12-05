import { NextFunction, Request, Response } from 'express'
import BaseError from '../errors'

export default function errorMiddleware(
  error: BaseError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500
  const message = error.message || 'Internal server error'
  response.status(status).send({
    status,
    message,
  })
}
