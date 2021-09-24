import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'

// Alert TS to global signin property
// @types/node wants this syntax now for some reason
declare global {
  var getAuthCookie: () => Promise<string[]>
}

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

// Global auth helper function
global.getAuthCookie = async () => {
  const email = 'mail@mail.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}
