import { Request, Response } from 'express'
import knex from '../../database/connection'
import * as uniqid from 'uniqid'
const hostUrl = 'http://localhost:9090'

const user = {
  create: async function (req: Request, res: Response) {
    const { name, password } = req.body
    if(!name || !password) return res.status(400).send('username or id is missing')
    const queryName = await knex.from('users').select('name').where({ name: name })
    if (queryName.length > 0) return res.status(400).send('This username is already in use')

    const id = uniqid()
    const urls = JSON.stringify([])
    const createdAt = new Date()
    const isVisible = true

    const user = { id, name, password, urls, createdAt, isVisible }
    const trx = await knex.transaction()
    await trx('users').insert(user)
    await trx.commit()

    return res.json(id)
  },
  list: async function (req: Request, res: Response) {
    const list = await knex.from('users').select('*').where({isVisible: true})
    return res.status(200).send(list)
  },
  getOne: async function (req: Request, res: Response) {
    const name = req.params.username
    const user = await knex.from('users').select('*').where({ name: name })
    if (user.length === 0) return res.status(400).send('This name was not found')

    return res.status(200).send(user)
  },
  delete: async function (req: Request, res: Response) {
    const { userId } = req.params

    await knex.from('users').update({ isVisible: false }).where({ id: userId })
    return res.status(200).send('User deleted successfully!')
  }
}
export default user