import { Response } from 'express'
import { PopulatedRequest } from '../../helpers/generalTypes'
import knex from '../../database/connection'
import { generate } from 'shortid'
import * as dayjs from 'dayjs'
import { Url } from './types'
import BadRequest from '../../errors/BadRequest'
import NotFound from '../../errors/NotFound'

const url = {
  create: async function (context: PopulatedRequest) {
    const { shareable, redirectUrl, categoryId, expectedCode, description, lifetime = 300 } = context.body
    if (!shareable) throw new BadRequest('shareable is missing')
    if (!redirectUrl) throw new BadRequest('redirectUrl is missing')
    if (!categoryId) throw new BadRequest('categoryId is missing')
    if (!expectedCode) throw new BadRequest('expectedCode is missing')
    if (!description) throw new BadRequest('description is missing')

    const category = await knex.from('categories').select('name').first()
    if (!category) throw new NotFound('This category does not exists')

    const code = expectedCode || generate()

    const duplicatedUrl = await knex.from('urls')
      .select('code')
      .where({ code, active: true })
      .first()

    if (duplicatedUrl) throw new BadRequest('This code is already in use')

    const urlId = generate()
    const shortUrl = `${process.env.API_URL}/${code}`
    const clicks = 0
    const createdAt = dayjs().toDate()
    const expiresAt = dayjs(createdAt).add(lifetime, 'second').toDate()
    const userId = context.user.id
    const active = true

    const url: Url = {
      id: urlId,
      code,
      redirectUrl,
      categoryId,
      shortUrl,
      userId,
      description,
      clicks,
      createdAt,
      active,
      shareable,
      expiresAt
    }

    const trx = await knex.transaction()
    await trx('urls').insert(url)
    await trx.commit()

    return { shortUrl }
  },
  list: async function (context: PopulatedRequest) {
    const list = await knex.from('urls')
      .where({ active: true, shareable: true })
      .orWhere({ userId: context.user.id })
    return list
  },
  search: async (context: PopulatedRequest) => {
    const { categories = [], q } = context.query
    let query = knex.from('urls').where({ active: true, shareable: true })

    if (q && categories.length) {
      query = query.whereIn('categoryId', categories as string[])
        .andWhere(function() {
          this.where('code', 'like', `%${q}%`)
          .orWhere('redirectUrl', 'like', `%${q}%`)
        })
    } else {
      if (categories.length) {
        query = query.whereIn('categoryId', categories as string[])
      }
  
      if (q) {
        query = query.andWhere(function() {
          this.where('code', 'like', `%${q}%`)
          .orWhere('redirectUrl', 'like', `%${q}%`)
        })
      }
    }

    const result = await query
    return result
  },
  adminList: async (context: PopulatedRequest) => {
    const list = await knex.from('urls')
    return list
  },
  redirect: async function (context: PopulatedRequest) {
    const { code } = context.params
    const url = await knex.from('urls')
      .where({ code, active: true, shareable: true })
      .first()
    if (!url) throw new BadRequest('This name was not found')

    await knex.from('urls').update({ clicks: Number(url.clicks) + 1 }).where({ code })
    return {
      shouldRedirect: true,
      url: url.redirectUrl
    }
  },
  getOne: async function (context: PopulatedRequest) {
    const { identifier } = context.params

    const url = await knex.from('urls')
      .where({ code: identifier, userId: context.user.id })
      .orWhere({ id: identifier, userId: context.user.id })
      .first()

    if (!url) throw new BadRequest('This code does not exist or you do not own it')

    return url
  },
  getUserUrls: async (context: PopulatedRequest) => {
    const urls = await knex.from('urls')
      .where({ userId: context.user.id, active: true })

    return urls
  },
  delete: async function (context: PopulatedRequest) {
    const { urlId } = context.params
    const userId = context.user.id
    const url = await knex.from('urls').where({ id: urlId, active: true, userId }).first()

    if (!url) throw new NotFound('Url was not found')

    await knex.from('urls').update({ active: false }).where({ id: urlId })
    return {
      message: 'Url was deleted successfully!'
    }
  }
}
export default url