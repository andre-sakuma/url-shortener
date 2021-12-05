import { config } from 'dotenv'
config()

import * as express from 'express'
import * as cors from 'cors'
import routes from './routes'
import * as morgan from 'morgan'
import initializeCronJobs from './helpers/initializeCronJobs'

const app = express()
const port = 9090

initializeCronJobs()

// app.use(bp.urlencoded({extended: true}))
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(routes)
app.listen(port)
console.log(`server started at http://localhost:${port}`)