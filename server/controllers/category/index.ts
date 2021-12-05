import { Request, Response } from 'express'
import knex from '../../database/connection'
import * as uniqid from 'uniqid'
import { Category } from './types'

const category = {
  create: async function (req: Request, res: Response) {
    const { name } = req.body
    if(!name) return res.status(400).send('username or id or or email is missing')

    const duplicatedCategory = await knex.from('categories').where({ name }).select('name').first()
    if (duplicatedCategory) return res.status(400).send('This name is already in use')

    const id = uniqid()
    const createdAt = new Date()
    const active = true

    const category: Category = {
      id,
      createdAt,
      active,
      name
    }

    const trx = await knex.transaction()
    await trx('categories').insert(category)
    await trx.commit()

    return res.json(id)
  },
  list: async function (req: Request, res: Response) {
    const list = await knex.from('categories').select('name').where({ active: true })
    return res.status(200).send(list)
  },
  getOne: async function (req: Request, res: Response) {
    const { categoryId } = req.params
    const category = await knex.from('categories').where({ id: categoryId }).first()
    if (!category) return res.status(400).send('category was not found')

    return res.status(200).send(category)
  },
  delete: async function (req: Request, res: Response) {
    const { categoryId } = req.params

    await knex.from('categories').update({ active: false }).where({ id: categoryId })
    return res.status(200).send('Category was deleted successfully!')
  }
}
export default category