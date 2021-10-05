import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a>View This Ticket</a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <h3>
        {currentUser
          ? `You are signed in as ${currentUser.email}`
          : 'You are not signed in!'}
      </h3>
      <br />
      <div>
        <h2>~Tickets~</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </div>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // client.get() returns axios res object
  const { data } = await client.get('/api/tickets')

  return { tickets: data }
}

export default LandingPage
