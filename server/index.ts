import * as express from 'express'
import * as cors from 'cors'
import routes from './routes'

const app = express()
const port = 9090

// app.use(bp.urlencoded({extended: true}))
app.use(cors())
app.use(express.json())
app.use(routes)
app.listen(port)
console.log(`server started at http://localhost:${port}`)