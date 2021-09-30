import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@sealtix/common'

import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found!')
    }

    // Mark ticket as reserved by setting orderId
    ticket.set({ orderId: data.id })

    // Inform related services of versioning
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    })

    await ticket.save()

    msg.ack()
  }
}
