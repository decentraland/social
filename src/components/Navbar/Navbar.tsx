import { useCallback } from "react"
import { useLocation } from "react-router-dom"
import { Navbar2 as BaseNavbar2 } from "decentraland-dapps/dist/containers"
import { getPendingTransactions } from "decentraland-dapps/dist/modules/transaction/selectors"
import {
  getAddress,
  isConnected,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { useAppSelector } from "../../app/hooks"
import { config } from "../../config"

const Navbar = () => {
  const { pathname, search } = useLocation()
  const isConnectedState = useAppSelector(isConnected)
  const address = useAppSelector(getAddress)
  const hasActivity = useAppSelector((state) =>
    address ? getPendingTransactions(state, address).length > 0 : false
  )

  const handleSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get("redirectTo")
    const basename = /^decentraland.(zone|org|today)$/.test(
      window.location.host
    )
      ? "/social"
      : ""
    const redirectTo = !currentRedirectTo
      ? `${basename}${pathname}${search}`
      : `${basename}${currentRedirectTo}`

    window.location.replace(
      `${config.get("AUTH_URL")}/login?redirectTo=${redirectTo}`
    )
  }, [pathname, search])

  return (
    <BaseNavbar2
      isConnected={isConnectedState}
      hasActivity={hasActivity}
      withNotifications
      onSignIn={handleSignIn}
    />
  )
}

export { Navbar }
