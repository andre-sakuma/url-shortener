import { NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import knex from '../database/connection'


export default async function validation(
  request: any,
  response: any,
  next: NextFunction
) {
  const token: string = request.headers['x-access-token']
  if (!token) return next(new Error('token was not provided'))

  try {
    const decoded: any = verify(token, process.env.TOKEN_SECRET)
    const { id, email, username } = decoded
    const user = await knex.from('users')
      .where({ id, email, username, active: true })
      .select('id', 'email', 'username')
      .first()
    if (!user) throw new Error('invalid token')

    request.user = user
    return next()
  } catch (error) {
    return next(error)
  }
}
