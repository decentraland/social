import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { default as SignIn } from 'decentraland-dapps/dist/containers/SignInPage'
import { config } from '../../../config'
import { Box } from 'decentraland-ui2'
import { Props } from './SignInPage.types'

const SignInPage = (props: Props) => {
  const { isConnected, isConnecting, onConnect } = props
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isConnected && !isConnecting) {
      const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/social' : ''
      window.location.replace(
        `${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(`${basename}${redirectTo || '/'}`)}`
      )
      return
    }

    if (redirectTo && isConnected) {
      navigate(decodeURIComponent(redirectTo))
    }
  }, [redirectTo, isConnected, isConnecting, navigate])

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <SignIn isConnected={isConnected} handleLoginConnect={onConnect} />
    </Box>
  )
}

export default SignInPage

