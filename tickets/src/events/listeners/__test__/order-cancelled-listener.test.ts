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

it('should update the ticket, publish an event, and ack the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
