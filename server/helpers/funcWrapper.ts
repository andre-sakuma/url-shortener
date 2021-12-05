import { Response, NextFunction } from 'express'
import { PopulatedRequest } from './generalTypes'

type ApiFunc = (context: Context) => any

export interface Context {
  user: {
    id: string
    email: string
    username: string
    isAdmin: boolean
  }
}

export default (func: ApiFunc) => {
  return async (req: PopulatedRequest, res: Response, next: NextFunction) => {
    const context = req

    try {
      const result = await func(context)

      if (result && result.shouldRedirect) {
        return res.redirect(result.url)
      }

      res.send(result)
    } catch (e) {
      next(e)
    }
  }
}
