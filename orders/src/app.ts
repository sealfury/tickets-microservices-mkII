import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@sealtix/common'

import { deleteOrderRouter } from './routes/delete'
import { indexOrderRouter } from './routes/index'
import { createOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'

const app = express()
app.set('trust proxy', true) // trust ingress-nginx
app.use(json())
app.use(
  cookieSession({
    signed: false, // will encrypt w/ JWT instead
    secure: false,
  })
)
app.use(currentUser)

app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(createOrderRouter)
app.use(showOrderRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
