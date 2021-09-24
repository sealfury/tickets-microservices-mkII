import axios from 'axios'

const buildClient = ({ req }) => {
  const INGRESS_SRV_CLUSTER_URL =
    'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'

  if (typeof window === 'undefined') {
    // on the server - requests to ingress-nginx namespace
    // configure axios with service URL and headers
    return axios.create({
      baseURL: INGRESS_SRV_CLUSTER_URL,
      headers: req.headers,
    })
  } else {
    // in the browser
    return axios.create({
      baseURL: '/',
    })
  }
}

export default buildClient
