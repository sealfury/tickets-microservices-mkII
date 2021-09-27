import request from 'supertest'
import { app } from '../../app'
import { fakeId } from '../../test/utils'

it('should return a 404 if the provided id does not exist', async () => {
  await request(app)
    .put(`/api/tickets/${fakeId}`)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'testTicket',
      price: 20,
    })
    .expect(404)
})

it('should return a 401 if the user is not authenticated', async () => {
  await request(app)
    .put(`/api/tickets/${fakeId}`)
    .send({
      title: 'testTicket',
      price: 20,
    })
    .expect(401)
})

it('should return a 401 if the user does not own the ticket', async () => {
  // Create ticket as one user
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'testTicket',
      price: 20,
    })

  // reset cookie to mock trying to edit cookie as another user
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'newTicket',
      price: 15,
    })
    .expect(401)

  // make sure ticket wasn't changed
  const ticketRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketRes.body.title).toEqual('testTicket')
  expect(ticketRes.body.price).toEqual(20)
})

it('should return a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.getAuthCookie()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'testTicket',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'testTicket',
      price: -20,
    })
    .expect(400)
})

it('should update the ticket when the user provides valid inputs', async () => {
  const cookie = global.getAuthCookie()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'testTicket',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new ticket',
      price: 50,
    })
    .expect(200)

  const ticketRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketRes.body.title).toEqual('new title')
  expect(ticketRes.body.price).toEqual(50)
})
