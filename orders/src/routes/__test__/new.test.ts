import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('should return an error if the ticket being ordered does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getAuthCookie())
    .send({ ticketId })
    .expect(404)
})

it('should return an error if the ticket being ordered is already reserved', async () => {
  // create ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'testTicket',
    price: 20,
  })
  await ticket.save()

  // build order using ticket created above
  const order = Order.build({
    ticket,
    userId: 'randomUserId',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('should successfully reserves a ticket when conditions are met', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'testTicket',
    price: 20,
  })
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('should emit an order created event upon order creation', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'testTicket',
    price: 20,
  })
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
