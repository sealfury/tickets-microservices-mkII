import axios from 'axios'

const buildClient = ({ req }) => {
  const BASE_URL = 'http://www.sealtix.xyz/'

  if (typeof window === 'undefined') {
    // on the server - requests to ingress-nginx namespace
    // configure axios with service URL and headers
    return axios.create({
      baseURL: BASE_URL,
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
