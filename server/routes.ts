import * as express from 'express'
import { Request, Response } from 'express'
import url from './controllers/url'
import user from './controllers/user'

const routes = express.Router()

routes.get('/status', (req: Request, res: Response) => {
  return res.json('alive')
})

//URL
routes.get('/:urlId', url.redirect)
routes.post('/url', url.create)
routes.get('/url/list', url.list)
routes.get('/url/:urlId', url.getOne)
routes.delete('/url/:urlId', url.delete)

//USER
routes.get('/user/list', user.list)
routes.post('/user', user.create)
routes.get('/user/:username', user.getOne)
// routes.put('/user/:userId', user.update)
routes.delete('/user/:userId', user.delete)

export default routes