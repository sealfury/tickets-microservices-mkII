import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent } from '@sealtix/common'

import { Ticket } from '../../../models/ticket'
import { TicketUpdatedListener } from '..'
import { natsWrapper } from '../../../nats-wrapper'

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // create & save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'testTicket',
    price: 17,
  })
  await ticket.save()

  // create fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new ticket',
    price: 21,
    userId: 'userId',
  }

  // create fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, ticket, msg }
}

it('should successfully find, update, and save a ticket', async () => {
  const { listener, data, ticket, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('should successfully ack the message when event is processed', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
