import * as express from 'express'
import { Request, Response } from 'express'
import url from './controllers/url'
import user from './controllers/user'
import category from './controllers/category'
import validation from './middlewares/validateJWT'
import funcWrapper from './helpers/funcWrapper'
import errorMiddleware from './helpers/errorHandler'
import adminMiddleware from './middlewares/private'

const routes = express.Router()

routes.get('/status', (req: Request, res: Response) => {
  return res.json('alive')
})

//URL
routes.get('/:code', funcWrapper(url.redirect))
routes.post('/url', validation, funcWrapper(url.create))
routes.get('/url/search', validation, funcWrapper(url.search))
routes.get('/url/list', validation, funcWrapper(url.list))
routes.get('/url/:identifier', validation, funcWrapper(url.getOne))
routes.delete('/url/:urlId', validation, funcWrapper(url.delete))
routes.get('/user/urls', validation, funcWrapper(url.getUserUrls))

//USER
routes.get('/user/list', funcWrapper(user.list))
routes.post('/user/login', funcWrapper(user.login))
routes.post('/user', funcWrapper(user.create))
routes.get('/user/:username', funcWrapper(user.getOne))
// routes.put('/user/:userId', funcWrapper(user.update))

// CATEGORY
routes.get('/category/list', validation, funcWrapper(category.list))
routes.post('/category', validation, funcWrapper(category.create))
routes.get('/category/:categoryId', validation, funcWrapper(category.getOne))

// PRIVATE
routes.get('/private/url/list', validation, adminMiddleware, funcWrapper(url.adminList))
routes.delete('/private/user/:userId', validation, adminMiddleware, funcWrapper(user.delete))
routes.delete('/private/category/:categoryId', validation, adminMiddleware, funcWrapper(category.delete))

routes.use(errorMiddleware)

export default routes