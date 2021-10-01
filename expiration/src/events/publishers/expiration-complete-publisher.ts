import { Subjects, Publisher, ExpirationCompleteEvent } from '@sealtix/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
