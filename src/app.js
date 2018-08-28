import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import rotas from './rotas'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use(rotas)

export default app
