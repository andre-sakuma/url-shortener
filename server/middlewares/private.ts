import { NextFunction, Response } from 'express'
import { PopulatedRequest } from '../helpers/generalTypes'
import Unauthorized from '../errors/Unauthorized'

export default async function(req: PopulatedRequest, res: Response, next: NextFunction) {
  if (!req.user.isAdmin) {
    return next(new Unauthorized('should be admin'))
  }

  return next()
}