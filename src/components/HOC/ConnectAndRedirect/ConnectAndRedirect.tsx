import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import {
  getAddress,
  isConnected,
  isConnecting,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { Box, CircularProgress, Typography } from "decentraland-ui2"
import { useAppSelector } from "../../../app/hooks"

const ConnectAndRedirect = () => {
  const isUserLoggedIn = useAppSelector(isConnected)
  const isUserLoggingIn = useAppSelector(isConnecting)
  const userAddress = useAppSelector(getAddress)

  if (!isUserLoggedIn && !isUserLoggingIn) {
    return <Navigate to="/sign-in" replace />
  }

  if (isUserLoggedIn && userAddress) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h5" color="text.secondary">
          Page not found
        </Typography>
      </Box>
    )
  }

  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRedirect(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (shouldRedirect) {
    return <Navigate to="/sign-in" replace />
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  )
}

export { ConnectAndRedirect }
