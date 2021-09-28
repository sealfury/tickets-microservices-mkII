import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@sealtix/common'

const router = express.Router()

router.post(
  '/api/orders',
  requireAuth,
  [
    /*
    * OBS! If Tickets DB changes or if Orders Service subscribes
    * to other non-mongo DBs remove or adjust custom check
    */
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({})
  }
)

export { router as createOrderRouter }