import { Navigate } from "react-router-dom"
import {
  getAddress,
  isConnected,
  isConnecting,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { Box, CircularProgress, Typography } from "decentraland-ui2"
import { useAppSelector } from "../../../app/hooks"
import { locations } from "../../../modules/locations"

const ConnectAndRedirect = () => {
  const isUserLoggedIn = useAppSelector(isConnected)
  const isUserLoggingIn = useAppSelector(isConnecting)
  const userAddress = useAppSelector(getAddress)

  if (isUserLoggingIn) {
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

  return <Navigate to={locations.signIn(locations.root())} replace />
}

export { ConnectAndRedirect }
