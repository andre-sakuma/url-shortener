import * as express from 'express'
import { Request, Response } from 'express'
import url from './controllers/url'
import user from './controllers/user'
import category from './controllers/category'
import validation from './middlewares/validateJWT'

const routes = express.Router()

routes.get('/status', (req: Request, res: Response) => {
  return res.json('alive')
})

//URL
routes.get('/:code', validation, url.redirect)
routes.post('/url', validation, url.create)
routes.get('/url/list', validation, url.list)
routes.get('/private/url/list', validation, url.adminList)
routes.get('/url/:identifier', validation, url.getOne)
routes.delete('/url/:urlId', validation, url.delete)
routes.get('/user/urls', validation, url.getUserUrls)

//USER
routes.get('/user/list', user.list)
routes.post('/user/login', user.login)
routes.post('/user', user.create)
routes.get('/user/:username', user.getOne)
// routes.put('/user/:userId', user.update)
routes.delete('/user/:userId', user.delete)

// CATEGORY
routes.get('/category/list', validation, category.list)
routes.post('/category', validation, category.create)
routes.get('/category/:categoryId', validation, category.getOne)
routes.delete('/category/:categoryId', validation, category.delete)

export default routes