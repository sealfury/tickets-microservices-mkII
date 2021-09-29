import { Ticket } from '../ticket'

it('effectivley implements optimistic concurrency control functionality', async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'testTicket',
    price: 7,
    userId: 'abc123',
  })

  // Save the ticket to the db
  await ticket.save()

  // Fetch the ticket *twice*
  const instance1 = await Ticket.findById(ticket.id)
  const instance2 = await Ticket.findById(ticket.id)

  // Make a change to each fetched ticket
  instance1!.set({ price: 17 })
  instance2!.set({ price: 21 })

  // Save first fetched ticket
  await instance1!.save()

  // Save second fetched ticket - expect version error
  try {
    await instance2!.save()
  } catch (err) {
    return
  }

  throw new Error('You best done not come up in here boi')
})

it('should increment the version number upon multipe saves', async () => {
  const ticket = Ticket.build({
    title: 'testTicket',
    price: 17,
    userId: 'abc123',
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)

  await ticket.save()
  expect(ticket.version).toEqual(1)

  await ticket.save()
  expect(ticket.version).toEqual(2)
})
