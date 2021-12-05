import { Request, Response } from 'express'
import knex from '../../database/connection'
import * as uniqid from 'uniqid'
import { Category } from './types'
import BadRequest from '../../errors/BadRequest'
import { PopulatedRequest } from '../../helpers/generalTypes'

const category = {
  create: async function (context: PopulatedRequest) {
    const { name } = context.body
    if(!name) throw new BadRequest('username or id or or email is missing')

    const duplicatedCategory = await knex.from('categories').where({ name }).select('name').first()
    if (duplicatedCategory) throw new BadRequest('This name is already in use')

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

    return { id }
  },
  list: async function (context: PopulatedRequest) {
    const list = await knex.from('categories').select('name', 'id').where({ active: true })
    return list
  },
  getOne: async function (context: PopulatedRequest) {
    const { categoryId } = context.params
    const category = await knex.from('categories').where({ id: categoryId }).first()
    if (!category) throw new BadRequest('category was not found')

    return category
  },
  delete: async function (context: PopulatedRequest) {
    const { categoryId } = context.params

    await knex.from('categories').update({ active: false }).where({ id: categoryId })
    return {
      message: 'Category was deleted successfully!'
    }
  }
}
export default category