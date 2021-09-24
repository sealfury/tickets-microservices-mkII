import { useEffect } from 'react'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'

const Signout = () => {
  const { makeRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  })

  useEffect(() => {
    makeRequest()
  }, [])

  return <div>Signing out...</div>
}

export default Signout
