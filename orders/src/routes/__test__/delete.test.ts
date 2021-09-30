import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

it('should mark an order as cancelled when user cancels an order', async () => {
  // Create ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'testTicket',
    price: 20,
  })
  await ticket.save()

  const user = global.getAuthCookie()
  // Make request to create order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make request to cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // Verify order is cancelled
  const cancelledOrder = await Order.findById(order.id)

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should emit an order cancelled event when an order is cancelled', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'testTicket',
    price: 20,
  })
  await ticket.save()

  const user = global.getAuthCookie()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
