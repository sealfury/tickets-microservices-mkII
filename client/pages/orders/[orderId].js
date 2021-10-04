import { useEffect, useState } from 'react'

const OrderShow = ({ order }) => {
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

  return <div>Time to pay: {timeRemaining} seconds</div>
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
