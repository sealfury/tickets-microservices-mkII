import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@sealtix/common'

import { createPaymentRouter } from './routes/new'

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

app.use(createPaymentRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
