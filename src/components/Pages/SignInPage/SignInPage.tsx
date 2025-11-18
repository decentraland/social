import { memo, useCallback } from "react"
import { useLocation } from "react-router-dom"
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

const SignInPage = memo(() => {
  const isConnectedState = useAppSelector(safeSelector(isConnected, false))
  const isConnectingState = useAppSelector(safeSelector(isConnecting, false))
  const { pathname } = useLocation()

  const handleConnect = useCallback(() => {
    if (!isConnectedState && !isConnectingState) {
      const params = new URLSearchParams(window.location.search)
      const basename = /^decentraland.(zone|org|today)$/.test(
        window.location.host
      )
        ? "/social"
        : ""
      window.location.replace(
        `${config.get("AUTH_URL")}/login?redirectTo=${encodeURIComponent(
          `${basename}${params.get("redirectTo") || pathname}`
        )}`
      )
    }
  }, [isConnectedState, isConnectingState, pathname])

  return (
    <PageLayout>
      <SignIn isConnected={isConnectedState} onConnect={handleConnect} />
    </PageLayout>
  )
})

export { SignInPage }
