import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@sealtix/common'

import { stripe } from '../stripe'
import { Order } from '../models/order'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage('A Stripe token must be provided!'),
    body('orderId')
      .not()
      .isEmpty()
      .withMessage('orderId value must be provided!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(
        'You cannot pay for an order that has been cancelled'
      )
    }

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100, // price in cents
      source: token,
      description: `Purchase of ticket from ticketing.dev`,
    })

    res.status(201).send({ success: true })
  }
)

export { router as createPaymentRouter }
