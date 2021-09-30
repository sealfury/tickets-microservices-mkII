import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCancelledEvent } from '@sealtix/common'

import { OrderCancelledListener } from '..'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'testTicket',
    price: 17,
    userId: 'randomId',
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, orderId, ticket, data, msg }
}

it('should update ticket being cancelled', async () => {
  const { listener, orderId, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
})

it('should publish a ticket updated event when order is cancelled', async () => {
  const { listener, orderId, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const publishedTicketData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(data.id).toEqual(publishedTicketData.orderId)

  const publishedEvent = (natsWrapper.client.publish as jest.Mock).mock
    .calls[0][0]

  expect(publishedEvent).toEqual('ticket:updated')
})

it('should ack the message upon successful cancellation', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
