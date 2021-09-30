import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCreatedEvent, OrderStatus } from '@sealtix/common'

import { OrderCreatedListener } from '..'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // Instantiate listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  // Create & save ticket
  const ticket = Ticket.build({
    title: 'testTicket',
    price: 17,
    userId: 'randomId',
  })
  await ticket.save()

  // Fake a data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'randomId',
    expiresAt: 'not in test',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // Fake a message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, data, msg }
}

it('set the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('should ack the message upon event completion', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
