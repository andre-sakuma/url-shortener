import { Request, Response } from 'express'
import knex from '../../database/connection'
import shortid from 'shortid'
const hostUrl = 'http://localhost:9090'

const url = {
  create: async function (req: Request, res: Response) {
    const { originalUrl, userId, description } = req.body
    let { name } = req.body
    if (!name) name = shortid.generate()

    const queryName = await knex.from('urls').select('name').where({ name: name })
    if (queryName.length > 0) return res.status(400).send('This name is already in use')

    const shortUrl = `${hostUrl}/${name}`
    const clicks = 0
    const createdAt = new Date()
    const isVisible = true

    const url = { name, originalUrl, shortUrl, userId, description, clicks, createdAt, isVisible }

    const user = await knex.from('users').select('urls').where({ id: userId })
    if(user.length === 0) return res.status(400).send('You need a user to create a new url')
    const urls = JSON.parse(user[0].urls)
    urls.push(url)
    await knex.from('users').update({ urls: JSON.stringify(urls) }).where({ id: userId })

    const trx = await knex.transaction()
    await trx('urls').insert(url)
    await trx.commit()

    return res.json(shortUrl)
  },
  list: async function (req: Request, res: Response) {
    const list = await knex.from('urls').select('*').where({ isVisible: true })
    return res.status(200).send(list)
  },
  redirect: async function (req: Request, res: Response) {
    const name = req.params.urlId
    const url = await knex.from('urls').select('*').where({ name: name })
    if (url.length === 0) return res.status(400).send('This name was not found')

    await knex.from('urls').update({ clicks: Number(url[0].clicks) + 1 }).where({ name: name })
    return res.redirect(url[0].originalUrl)
  },
  getOne: async function (req: Request, res: Response) {
    const name = req.params.urlId
    const url = await knex.from('urls').select('*').where({ name: name })
    if (url.length === 0) return res.status(400).send('This name was not found')

    return res.status(200).send(url)
  },
  delete: async function (req: Request, res: Response) {
    const name = req.params.urlId
    const { userId } = req.query
    const url = await knex.from('urls').select('*').where({ name: name })

    if (userId !== url[0].userId) return res.status(401).send('Not authorized to delete this url')
    if (url.length === 0) return res.status(400).send('This name was not found')

    await knex.from('urls').update({ isVisible: false }).where({ name: name })
    return res.status(200).send('Url deleted successfully!')
  }
}
export default url