import { Publisher, OrderCreatedEvent, Subjects } from '@sealtix/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
