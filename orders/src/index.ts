import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import {
  ExpirationCompleteListener,
  TicketCreatedListener,
  TicketUpdatedListener,
  PaymentCreatedListener,
} from './events/listeners'

const start = async () => {
  console.log('Starting...')
  // Type check for JWT_KEY in all routes
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!')
  }
  // Type check for DB URI
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!')
  }
  // Type checks for NATS env variables
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined!')
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    // Graceful shutdown
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    // initialize listeners
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Orders Service listening on port 3000...')
  })
}

start()
