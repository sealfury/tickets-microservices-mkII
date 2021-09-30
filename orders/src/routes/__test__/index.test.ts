import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'testTicket',
    price: 20,
  })
  await ticket.save()

  return ticket
}

it('should fetch the orders for the user making the request', async () => {
  // Create 3 tix
  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()

  const user1 = global.getAuthCookie()
  const user2 = global.getAuthCookie()
  // Create 1 order as user1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201)

  // Create 2 orders as user2
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201)

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201)

  // Make request to get orders for user2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200)

  // Expect to only get orders for user2
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(order1.id)
  expect(response.body[1].id).toEqual(order2.id)

  expect(response.body[0].ticket.id).toEqual(ticket2.id)
  expect(response.body[1].ticket.id).toEqual(ticket3.id)
})
