import request from 'supertest'
import { app } from '../../app'
import { fakeId } from '../../test/utils'
import { Ticket } from '../../models/ticket'

it('should return a 404 if the ticket is not found', async () => {
  await request(app).get(`/api/tickets/${fakeId}`).send().expect(404)
})

it('should return a ticket if the ticket is found', async () => {
  const title = 'testTicket'
  const price = 20

  // alternatively use Ticket model directly to build ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({
      title,
      price,
    })
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})
