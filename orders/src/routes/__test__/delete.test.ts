import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'

it('should mark an order as cancelled when user cancels an order', async () => {
  // Create ticket
  const ticket = Ticket.build({
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

it.todo('should emit an order cancelled event when an order is cancelled')
