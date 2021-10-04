import mongoose from 'mongoose'
import { OrderCancelledEvent, OrderStatus } from '@sealtix/common'
import { OrderCancelledListener } from '..'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'randomId',
    price: 17,
    status: OrderStatus.Created,
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 'ticketId',
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, order }
}

it('should update the status of the order to cancelled', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should ack the message after processing the event', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
