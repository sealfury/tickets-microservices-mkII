import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from '@sealtix/common'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '..'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'notUsingThis',
    userId: 'randomId',
    status: OrderStatus.Created,
    ticket: {
      id: 'randomTicketId',
      price: 10,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('should correctly replicate the order information', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  // If price data is correct everything else will be too
  expect(order!.price).toEqual(data.ticket.price)
})

it('should ack the message upon order creation', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
