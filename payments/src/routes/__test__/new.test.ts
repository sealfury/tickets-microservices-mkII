import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Order } from '../../models'
import { OrderStatus } from '@sealtix/common'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

const randomId = new mongoose.Types.ObjectId().toHexString()

it('should return a 404 if a user attempts to purchaase that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie())
    .send({
      token: 'tempToken',
      orderId: randomId,
    })
    .expect(404)
})

it('should return a 401 when a user attempts to purchase an order that does not belong to them', async () => {
  const order = Order.build({
    id: randomId,
    userId: randomId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie())
    .send({
      token: 'tempToken',
      orderId: order.id,
    })
    .expect(401)
})

it('should return a 400 when user attempts to purchase a cancelled order', async () => {
  const userId = randomId
  const order = Order.build({
    id: randomId,
    userId: randomId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie(userId))
    .send({
      orderId: order.id,
      token: 'tempToken',
    })
    .expect(400)
})

it('should return a 204 with valid inputs to charge event', async () => {
  const userId = randomId
  const order = Order.build({
    id: randomId,
    userId: randomId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(20 * 100)
  expect(chargeOptions.currency).toEqual('usd')
})
