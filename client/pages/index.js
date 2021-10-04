const LandingPage = ({ currentUser }) => {
  return (
    <h1>
      {currentUser
        ? `You are signed in as ${currentUser.email}`
        : 'You are not signed in!'}
    </h1>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {}
}

export default LandingPage
