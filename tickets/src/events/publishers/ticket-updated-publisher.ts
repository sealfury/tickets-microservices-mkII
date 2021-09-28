import { Publisher, Subjects, TicketUpdatedEvent } from '@sealtix/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
