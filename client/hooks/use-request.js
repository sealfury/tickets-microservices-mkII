import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body }) => {
  const [errors, setErrors] = useState(null)

  // method === 'get' | 'post' | 'put' | etc.
  const makeRequest = async () => {
    try {
      const response = await axios[method](url, body)
      return response.data
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <h4>Something went wrong!</h4>
          <ul className='my-0'>
            {err.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { makeRequest, errors }
}
