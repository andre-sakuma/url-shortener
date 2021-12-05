import { Request } from 'express'

export interface PopulatedRequest extends Request {
  user: {
    id: string
    email: string
    username: string
  }
}