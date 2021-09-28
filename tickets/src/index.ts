import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
  // Type check for JWT_KEY in all routes
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!')
  }
  // Type check for DB URI
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!')
  }

  try {
    await natsWrapper.connect(
      'ticketing',
      'randomString',
      'http://nats-srv:4222'
    )
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Tickets Service listening on port 3000...')
  })
}

start()
