import * as express from 'express'
import { Request, Response } from 'express'
import url from './controllers/url'
import user from './controllers/user'
import validation from './middlewares/validateJWT'

const routes = express.Router()

routes.get('/status', (req: Request, res: Response) => {
  return res.json('alive')
})

//URL
routes.get('/:urlId', validation, url.redirect)
routes.post('/url', validation, url.create)
routes.get('/url/list', validation, url.list)
routes.get('/url/:urlId', validation, url.getOne)
routes.delete('/url/:urlId', validation, url.delete)

//USER
routes.get('/user/list', user.list)
routes.post('/user/login', user.login)
routes.post('/user', user.create)
routes.get('/user/:username', user.getOne)
// routes.put('/user/:userId', user.update)
routes.delete('/user/:userId', user.delete)

export default routes