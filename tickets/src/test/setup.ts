import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken'

// Alert TS to global signin property
// @types/node wants this syntax now for some reason
declare global {
  var getAuthCookie: () => string[]
}

// mock natsWrapper client in all tests
jest.mock('../nats-wrapper')

let mongo: any
// mock mongo db
beforeAll(async () => {
  process.env.JWT_KEY = 'test-key'
  /*
   * This was the previous syntax:
   *   mongo = new MongoMemoryServer()
   *   const mongoUri = await mongo.getUri()
   * MongoMemoryServer v7.0.0 requires changes made below
   * if changes cause any issues in future, downgrade MMS to v6.9.6
   * and replace with previous syntax
   */
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri)
})

// reset data in DB before each new test
beforeEach(async () => {
  jest.clearAllMocks()
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

// Global auth helper function w/o reaching out to auth service
global.getAuthCookie = () => {
  // Build a JWT payload w/ new id each time function is called
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'mail@mail.com',
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build the session object { jwt: TEST_JWT }
  const session = { jwt: token }

  // Turn session object into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return string = cookie w/ encoded data
  return [`express:sess=${base64}`]
}
