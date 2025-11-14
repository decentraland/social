import { useCallback, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { default as SignIn } from "decentraland-dapps/dist/containers/SignInPage"
import {
  isConnected,
  isConnecting,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { config } from "../../../config"
import { loginRequest } from "../../../modules/identity/action"
import { PageLayout } from "../../PageLayout"

const SignInPage = () => {
  const dispatch = useAppDispatch()
  const isConnectedState = useAppSelector(isConnected)
  const isConnectingState = useAppSelector(isConnecting)
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")
  const navigate = useNavigate()

  const onConnect = useCallback(
    (providerType: Parameters<typeof loginRequest>[0]) => {
      dispatch(loginRequest(providerType))
    },
    [dispatch]
  )

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
    <PageLayout>
      <SignIn isConnected={isConnectedState} handleLoginConnect={onConnect} />
    </PageLayout>
  )
}

export { SignInPage }
