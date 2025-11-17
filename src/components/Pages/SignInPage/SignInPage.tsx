import { useEffect } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { default as SignIn } from "decentraland-dapps/dist/containers/SignInPage"
import {
  isConnected,
  isConnecting,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { useAppSelector } from "../../../app/hooks"
import { config } from "../../../config"
import { PageLayout } from "../../PageLayout"

const SignInPage = () => {
  const isConnectedState = useAppSelector(isConnected)
  const isConnectingState = useAppSelector(isConnecting)
  const [searchParams] = useSearchParams()
  const { pathname } = useLocation()
  const redirectTo = searchParams.get("redirectTo")
  const navigate = useNavigate()

  useEffect(() => {
    if (!isConnectedState && !isConnectingState) {
      const basename = /^decentraland.(zone|org|today)$/.test(
        window.location.host
      )
        ? "/social"
        : ""
      const fallbackRedirect = redirectTo || pathname
      window.location.replace(
        `${config.get("AUTH_URL")}/login?redirectTo=${encodeURIComponent(`${basename}${fallbackRedirect}`)}`
      )
      return
    }

    if (redirectTo && isConnectedState) {
      const decodedRedirect = decodeURIComponent(redirectTo)
      if (decodedRedirect !== pathname) {
        navigate(decodedRedirect)
      }
    }
  }, [redirectTo, isConnectedState, isConnectingState, navigate, pathname])

  return (
    <PageLayout>
      <SignIn isConnected={isConnectedState} />
    </PageLayout>
  )
}

export { SignInPage }
