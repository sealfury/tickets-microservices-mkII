import request from 'supertest'
import { app } from '../../app'

it('should fail when a non-existent email is provided', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'mall@mall.com',
      password: 'wordpass',
    })
    .expect(400)
})

it('should fail when an incorrect password is provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'mail@mail.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'mail@mail.com',
      password: 'incorrect',
    })
    .expect(400)
})

it('should respond with a cookie when valid credentials are provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'mail@mail.com',
      password: 'password',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'mail@mail.com',
      password: 'password',
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
