import { Publisher, OrderCancelledEvent, Subjects } from '@sealtix/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
