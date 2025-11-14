import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { default as SignIn } from "decentraland-dapps/dist/containers/SignInPage"
import {
  isConnected,
  isConnecting,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { Box } from "decentraland-ui2"
import { useAppSelector } from "../../../app/hooks"
import { config } from "../../../config"

const SignInPage = () => {
  const isConnectedState = useAppSelector(isConnected)
  const isConnectingState = useAppSelector(isConnecting)
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")
  const navigate = useNavigate()
  const onConnect = () => {}

  useEffect(() => {
    if (!isConnectedState && !isConnectingState) {
      const basename = /^decentraland.(zone|org|today)$/.test(
        window.location.host
      )
        ? "/social"
        : ""
      window.location.replace(
        `${config.get("AUTH_URL")}/login?redirectTo=${encodeURIComponent(`${basename}${redirectTo || "/"}`)}`
      )
      return
    }

    if (redirectTo && isConnectedState) {
      navigate(decodeURIComponent(redirectTo))
    }
  }, [redirectTo, isConnectedState, isConnectingState, navigate])

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <SignIn isConnected={isConnectedState} handleLoginConnect={onConnect} />
    </Box>
  )
}

export { SignInPage }
