import Queue from 'bull'

interface JobPayload {
  orderId: string
}

const expirationQueue = new Queue<JobPayload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
})

expirationQueue.process(async (job) => {
  console.log(`publish an event for order id ${job.data.orderId}`)
  // publish expiration:complete event
})

export { expirationQueue }