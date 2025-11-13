import { useWallet } from 'decentraland-dapps/dist/hooks'
import SignInPage from './SignInPage'

const SignInPageContainer = () => {
  const { isConnected, isConnecting, connect } = useWallet()

  return (
    <SignInPage
      isConnected={isConnected}
      isConnecting={isConnecting}
      onConnect={connect}
    />
  )
}

export default SignInPageContainer

