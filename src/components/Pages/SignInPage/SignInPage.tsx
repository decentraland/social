import { useCallback, useEffect, useRef } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { default as SignIn } from "decentraland-dapps/dist/containers/SignInPage"
import {
  isConnected,
  isConnecting,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { useAppSelector } from "../../../app/hooks"
import { config } from "../../../config"
import { PageLayout } from "../../PageLayout"

const safeSelector = <T,>(selector: (state: unknown) => T, fallback: T) => {
  return (state: unknown): T => {
    try {
      const result = selector(state)
      return result ?? fallback
    } catch {
      return fallback
    }
  }
}

const SignInPage = () => {
  const isConnectedState = useAppSelector(safeSelector(isConnected, false))
  const isConnectingState = useAppSelector(safeSelector(isConnecting, false))
  const [searchParams] = useSearchParams()
  const { pathname } = useLocation()
  const redirectTo = searchParams.get("redirectTo")
  const navigate = useNavigate()
  const hasNavigatedRef = useRef(false)
  const hasRedirectedRef = useRef(false)

  const handleConnect = useCallback(() => {
    if (hasRedirectedRef.current) {
      return
    }
    hasRedirectedRef.current = true
    const basename = /^decentraland.(zone|org|today)$/.test(
      window.location.host
    )
      ? "/social"
      : ""
    const fallbackRedirect = redirectTo || pathname
    window.location.replace(
      `${config.get("AUTH_URL")}/login?redirectTo=${encodeURIComponent(`${basename}${fallbackRedirect}`)}`
    )
  }, [redirectTo, pathname])

  useEffect(() => {
    if (hasNavigatedRef.current || hasRedirectedRef.current) {
      return
    }

    if (!isConnectedState && !isConnectingState) {
      handleConnect()
      return
    }

    if (isConnectedState && redirectTo) {
      hasNavigatedRef.current = true
      const decodedRedirect = decodeURIComponent(redirectTo)
      if (decodedRedirect !== pathname) {
        navigate(decodedRedirect, { replace: true })
      }
    }
  }, [
    redirectTo,
    isConnectedState,
    isConnectingState,
    navigate,
    pathname,
    handleConnect,
  ])

  if (!isConnectedState && !isConnectingState) {
    return null
  }

  if (isConnectedState && redirectTo) {
    return null
  }

  return (
    <PageLayout>
      <SignIn isConnected={isConnectedState} />
    </PageLayout>
  )
}

export { SignInPage }
