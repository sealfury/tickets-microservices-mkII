import request from 'supertest'
import { app } from '../../app'

it('should have a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({})

  expect(response.status).not.toEqual(404)
})

it('should only give access to routes if user is signed it', async () => {})

it('should return an error if an invalid title is provided', async () => {})

it('should return an error if an invalid price is provided', async () => {})

it('should create a ticket with provided with valid inputs', async () => {})
