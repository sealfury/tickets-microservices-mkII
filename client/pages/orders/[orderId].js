import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'

const OrderShow = ({ order, currentUser }) => {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const { makeRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  })

  useEffect(() => {
    const findTimeRemaining = () => {
      const msRemaining = new Date(order.expiresAt) - new Date()
      setTimeRemaining(Math.round(msRemaining / 1000))
    }

    findTimeRemaining()
    const timerId = setInterval(findTimeRemaining, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  if (timeRemaining < 0) {
    return <div>Order Expired!</div>
  }

  return (
    <div>
      Time to pay: {timeRemaining} seconds
      <StripeCheckout
        token={({ id }) => makeRequest({ token: id })}
        stripeKey={process.env.STRIPE_PUBLIC_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
