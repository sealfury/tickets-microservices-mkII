import axios from 'axios'
import { useState } from 'react'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const makeRequest = async (props = {}) => {
    try {
      setErrors(null)
      // method === 'get' | 'post' | 'put' | etc. (i.e. lowercase)
      // merge fn input props with body props
      const response = await axios[method](url, { ...body, ...props })

      if (onSuccess) {
        onSuccess(response.data)
      }
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <h4>Something went wrong...</h4>
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

export default useRequest
