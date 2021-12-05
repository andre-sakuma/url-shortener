import { Request, Response } from 'express'
import knex from '../../database/connection'
import * as uniqid from 'uniqid'
import { sign } from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcrypt'
import { User } from './types'
import { PopulatedRequest } from '../../helpers/generalTypes'
import BadRequest from '../../errors/BadRequest'
import NotFound from '../../errors/NotFound'
import Unauthorized from '../../errors/Unauthorized'

const user = {
  login: async (context: PopulatedRequest) => {
    const { username, password } = context.body
    if (!username || !password) throw new BadRequest('username or password is missing')

    const user: User = await knex.from('users').first()
      .where({ active: true, username })
      .orWhere({ active: true, email: username })
      .first()
  
    if (!user) throw new NotFound('user not found')
    
    const isValid = await compare(password, user.password)
    if (!isValid) throw new Unauthorized('invalid credentials')

    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
    }
    const token = sign(payload, process.env.TOKEN_SECRET, { expiresIn: 60*20 }) // expires in 20 minutes

    return { token }
  },
  create: async function (context: PopulatedRequest) {
    const { username, password, email, isAdmin = false } = context.body
 
    const secret = context.headers['secret']
    if (isAdmin && secret !== process.env.SECRET) {
      throw new Unauthorized('you are not allowed to create an admin')
    }

    if(!username || !password || !email) throw new BadRequest('username or id or or email is missing')
    const duplicatedUser = await knex.from('users')
      .where({ username })
      .orWhere({ email })
      .select('username', 'email')
      .first()

    if (duplicatedUser) throw new BadRequest('This username or email is already in use')

    const id = uniqid()
    const createdAt = new Date()
    const active = true

    const salt = await genSalt(10)
    const hashPassword = await hash(password, salt)
    
    const user: User = {
      id,
      username,
      email,
      password: hashPassword,
      createdAt,
      active,
      isAdmin,
    }

    const trx = await knex.transaction()
    await trx('users').insert(user)
    await trx.commit()

    return { id }
  },
  list: async function (context: PopulatedRequest) {
    const list = await knex.from('users').select('username', 'email').where({active: true})
    return list
  },
  getOne: async function (context: PopulatedRequest) {
    const { username } = context.params
    const user = await knex.from('users').where({ username }).first()
    if (!user) throw new BadRequest('user was not found')

    return user
  },
  delete: async function (context: PopulatedRequest) {
    const { userId } = context.params

    await knex.from('users').update({ active: false }).where({ id: userId })
    return {
      message: 'User was deleted successfully!'
    }
  }
}
export default user