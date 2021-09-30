import mongoose from 'mongoose'
import { updateIfCurrentPlugin as updateIfCurrent } from 'mongoose-update-if-current'
import { Order, OrderStatus } from './order'

interface TicketAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc

  // abstract find by ID and previous version method
  // see concurrency notes for implementation w/o plugin
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

// normalize '__v' property to 'version'
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrent)

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}
// Ensure that ticket is not already reserved
ticketSchema.methods.isReserved = async function () {
  // this === ticket doc 'isReserved' will be called on
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created ||
          OrderStatus.AwaitingPayment ||
          OrderStatus.Complete,
      ],
    },
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
