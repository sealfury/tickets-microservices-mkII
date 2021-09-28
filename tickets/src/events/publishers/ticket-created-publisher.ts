import { Publisher, Subjects, TicketCreatedEvent } from '@sealtix/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
