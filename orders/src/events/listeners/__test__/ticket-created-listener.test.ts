import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent } from '@sealtix/common'

import { TicketCreatedListener } from '..'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // instantiate the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'testTicket',
    price: 17,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('should successfully create and save a ticket', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage fn with data obj + message obj
  await listener.onMessage(data, msg)

  // assert that ticket was created
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('should ack the message when event is processed', async () => {
  const { listener, data, msg } = await setup()

  // assert that ticket was created
  await listener.onMessage(data, msg)

  // assert that ack function was called
  expect(msg.ack).toHaveBeenCalled()
})
