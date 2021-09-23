import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

let mongo: any
// mock mongo db
beforeAll(async () => {
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri)
})

// reset data in DB before each new test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

// stop MMS and disconnect mongoose
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})
