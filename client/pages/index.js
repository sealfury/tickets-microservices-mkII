import axios from 'axios'

const LandingPage = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>Landing Page</h1>
}

LandingPage.getInitialProps = async ({ req }) => {
  const INGRESS_SRV_CLUSTER_URL =
    'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'

  if (typeof window === 'undefined') {
    // on the server - requests to ingress-nginx namespace
    const { data } = await axios.get(
      `${INGRESS_SRV_CLUSTER_URL}/api/users/currentuser`,
      {
        headers: req.headers,
      }
    )

    return data
  } else {
    // in the browser - requests made w/ baseURL of ''
    const { data } = await axios.get('/api/users/currentuser')

    return data
  }
  return {}
}

export default LandingPage
