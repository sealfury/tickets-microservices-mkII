import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@sealtix/common'
import { queueGroupName } from './queue-group-name'

export class OrderCreated extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {}
}
