import { Request, Response } from 'express'
import knex from '../../database/connection'
import * as uniqid from 'uniqid'
import { sign } from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcrypt'
import { User } from './type'

const user = {
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).send('username or password is missing')

    const user: User = await knex.from('users')
      .where({ active: true, username })
      .orWhere({ active: true, email: username })
      .first()
  
    if (!user) return res.status(404).send('user not found')
    
    const isValid = await compare(password, user.password)
    if (!isValid) return res.status(401).send('invalid credentials')

    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
    }
    const token = sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1d' })

    return res.json(token)
  },
  create: async function (req: Request, res: Response) {
    const { username, password, email } = req.body
    if(!username || !password || !email) return res.status(400).send('username or id or or email is missing')
    const queryName = await knex.from('users').where({ username }).orWhere({ email }).select('username', 'email')
    if (queryName.length > 0) return res.status(400).send('This username or email is already in use')

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
      active
    }

    const trx = await knex.transaction()
    await trx('users').insert(user)
    await trx.commit()

    return res.json(id)
  },
  list: async function (req: Request, res: Response) {
    const list = await knex.from('users').select('username', 'email').where({active: true})
    return res.status(200).send(list)
  },
  getOne: async function (req: Request, res: Response) {
    const { username } = req.params
    const user = await knex.from('users').where({ username }).first()
    if (!user) return res.status(400).send('user was not found')

    return res.status(200).send(user)
  },
  delete: async function (req: Request, res: Response) {
    const { userId } = req.params

    await knex.from('users').update({ active: false }).where({ id: userId })
    return res.status(200).send('User deleted successfully!')
  }
}
export default user