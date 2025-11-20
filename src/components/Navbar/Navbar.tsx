import { memo, useCallback } from "react"
import { useLocation } from "react-router-dom"
import { Navbar2 as BaseNavbar2 } from "decentraland-dapps/dist/containers"
import { getPendingTransactions } from "decentraland-dapps/dist/modules/transaction/selectors"
import {
  getAddress,
  isConnected,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { NavbarErrorBoundary } from "./NavbarErrorBoundary"
import { useAppSelector } from "../../app/hooks"
import { redirectToAuth } from "../../utils/authRedirect"

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

const Navbar = memo(() => {
  const { pathname, search } = useLocation()
  const isConnectedState = useAppSelector(safeSelector(isConnected, false))
  const address = useAppSelector(safeSelector(getAddress, null))
  const hasActivity = useAppSelector((state) => {
    if (!address) return false
    try {
      return getPendingTransactions(state, address).length > 0
    } catch {
      return false
    }
  })

  const handleSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get("redirectTo")

    const redirectPath = currentRedirectTo || `${pathname}${search}`
    redirectToAuth(redirectPath)
  }, [pathname, search])

  return (
    <NavbarErrorBoundary>
      <BaseNavbar2
        isConnected={isConnectedState}
        hasActivity={hasActivity}
        withNotifications
        onSignIn={handleSignIn}
      />
    </NavbarErrorBoundary>
  )
})

export { Navbar }
