import { Subjects, Publisher, PaymentCreatedEvent } from '@sealtix/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
