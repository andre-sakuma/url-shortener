import { Response } from 'express'
import { PopulatedRequest } from '../../helpers/generalTypes'
import knex from '../../database/connection'
import { generate } from 'shortid'
import * as dayjs from 'dayjs'
import { Url } from './types'

const url = {
  create: async function (req: PopulatedRequest, res: Response) {
    const { shareable, redirectUrl, categoryId, expectedCode, description, lifetime = 300 } = req.body
    if (!shareable) return res.status(400).send('shareable is missing')
    if (!redirectUrl) return res.status(400).send('redirectUrl is missing')
    if (!categoryId) return res.status(400).send('categoryId is missing')
    if (!expectedCode) return res.status(400).send('expectedCode is missing')
    if (!description) return res.status(400).send('description is missing')

    const category = await knex.from('categories').select('name').first()
    if (!category) return res.status(404).send('This category does not exists')

    const code = expectedCode || generate()

    const duplicatedUrl = await knex.from('urls')
      .select('code')
      .where({ code, active: true })
      .first()

    if (duplicatedUrl) return res.status(400).send('This code is already in use')

    const urlId = generate()
    const shortUrl = `${process.env.API_URL}/${code}`
    const clicks = 0
    const createdAt = dayjs().toDate()
    const expiresAt = dayjs(createdAt).add(lifetime, 'second').toDate()
    const userId = req.user.id
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

    return res.json(shortUrl)
  },
  list: async function (req: PopulatedRequest, res: Response) {
    const list = await knex.from('urls').where({ active: true, shareable: true })
    return res.status(200).send(list)
  },
  adminList: async (req: PopulatedRequest, res: Response) => {
    const list = await knex.from('urls')
    return res.status(200).send(list)
  },
  redirect: async function (req: PopulatedRequest, res: Response) {
    const { code } = req.params
    const url = await knex.from('urls').where({ code }).first()
    console.log(url)
    if (!url) return res.status(400).send('This name was not found')

    await knex.from('urls').update({ clicks: Number(url.clicks) + 1 }).where({ code })
    return res.redirect(url.redirectUrl)
  },
  getOne: async function (req: PopulatedRequest, res: Response) {
    const { identifier } = req.params

    const url = await knex.from('urls')
      .where({ code: identifier, userId: req.user.id })
      .orWhere({ id: identifier, userId: req.user.id })
      .first()

    if (!url) return res.status(400).send('This code does not exist or you do not own it')

    return res.status(200).send(url)
  },
  getUserUrls: async (req: PopulatedRequest, res: Response) => {
    const urls = await knex.from('urls')
      .where({ userId: req.user.id, active: true })

    return res.json(urls)
  },
  delete: async function (req: PopulatedRequest, res: Response) {
    const { urlId } = req.params
    const userId = req.user.id
    console.log(req.user.id)
    const url = await knex.from('urls').where({ id: urlId, active: true, userId }).first()

    if (!url) return res.status(404).send('Url was not found')

    await knex.from('urls').update({ active: false }).where({ id: urlId })
    return res.status(200).send('Url deleted successfully!')
  }
}
export default url