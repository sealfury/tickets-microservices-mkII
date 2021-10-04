import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'

const OrderShow = ({ order, currentUser }) => {
  const [timeRemaining, setTimeRemaining] = useState(0)

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
        token={token => console.log(token)}
        stripeKey={process.env.STRIPE_PUBLIC_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
