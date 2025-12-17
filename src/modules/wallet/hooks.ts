import { useCallback, useEffect, useMemo } from "react"
import { AuthIdentity } from "@dcl/crypto"
import { localStorageGetIdentity } from "@dcl/single-sign-on-client"
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi"
import {
  getAddress,
  isConnected as selectIsConnected,
  isConnecting as selectIsConnecting,
  isDisconnecting as selectIsDisconnecting,
  isSwitchingNetwork as selectIsSwitchingNetwork,
} from "./selectors"
import {
  setDisconnecting,
  setSwitchingNetwork,
  setWalletConnected,
  setWalletConnecting,
  setWalletDisconnected,
  setWalletError,
  updateChainId,
} from "./walletSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

/**
 * Hook that syncs wagmi state with Redux store and provides wallet utilities
 */
function useWalletSync() {
  const dispatch = useAppDispatch()
  const {
    address,
    isConnecting: wagmiConnecting,
    isConnected: wagmiConnected,
    isReconnecting: wagmiReconnecting,
  } = useAccount()
  const chainId = useChainId()
  const { isPending: isSwitching } = useSwitchChain()
  const { isPending: isDisconnectingWagmi } = useDisconnect()

  // Sync wagmi connection state to Redux
  // IMPORTANT: We must check isReconnecting to avoid race condition during page load
  // Wagmi sets isReconnecting=true while checking localStorage for saved connections.
  // If we dispatch setWalletDisconnected during reconnect, it causes a "flash" of Sign In button.
  useEffect(() => {
    if (wagmiConnecting || wagmiReconnecting) {
      dispatch(setWalletConnecting())
    } else if (wagmiConnected && address) {
      dispatch(setWalletConnected({ address, chainId }))
    } else {
      dispatch(setWalletDisconnected())
    }
  }, [
    dispatch,
    wagmiConnecting,
    wagmiReconnecting,
    wagmiConnected,
    address,
    chainId,
  ])

  // Update chain ID when it changes
  useEffect(() => {
    if (wagmiConnected && chainId) {
      dispatch(updateChainId(chainId))
    }
  }, [dispatch, wagmiConnected, chainId])

  // Sync switch network state
  useEffect(() => {
    dispatch(setSwitchingNetwork(isSwitching))
  }, [dispatch, isSwitching])

  // Sync disconnect state
  useEffect(() => {
    dispatch(setDisconnecting(isDisconnectingWagmi))
  }, [dispatch, isDisconnectingWagmi])
}

/**
 * Hook to get wallet state and actions
 */
function useWallet() {
  const dispatch = useAppDispatch()
  const {
    address,
    isConnecting: wagmiConnecting,
    isConnected: wagmiConnected,
    isReconnecting: wagmiReconnecting,
  } = useAccount()
  const chainId = useChainId()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Get Redux state for consistency
  const reduxAddress = useAppSelector(getAddress)
  const reduxIsConnected = useAppSelector(selectIsConnected)
  const reduxIsConnecting = useAppSelector(selectIsConnecting)
  const reduxIsDisconnecting = useAppSelector(selectIsDisconnecting)
  const reduxIsSwitchingNetwork = useAppSelector(selectIsSwitchingNetwork)

  // Prefer wagmi state but fall back to Redux for SSR consistency
  const isConnected = wagmiConnected || reduxIsConnected
  const walletAddress = address || reduxAddress

  const identity = useMemo<AuthIdentity | undefined>(() => {
    if (!walletAddress) return undefined
    return localStorageGetIdentity(walletAddress.toLowerCase()) as
      | AuthIdentity
      | undefined
  }, [walletAddress])

  const hasValidIdentity = useMemo(() => !!identity, [identity])

  const connectWallet = useCallback(
    (connectorId?: string) => {
      const connector = connectorId
        ? connectors.find((c) => c.id === connectorId)
        : connectors[0]
      if (connector) {
        connect(
          { connector },
          {
            onError: (error) => {
              dispatch(setWalletError(error.message))
            },
          }
        )
      }
    },
    [connect, connectors, dispatch]
  )

  const disconnectWallet = useCallback(() => {
    disconnect()
  }, [disconnect])

  return {
    address: walletAddress,
    chainId,
    isConnected,
    isConnecting: wagmiConnecting || wagmiReconnecting || reduxIsConnecting,
    isDisconnecting: reduxIsDisconnecting,
    isSwitchingNetwork: reduxIsSwitchingNetwork,
    identity,
    hasValidIdentity,
    connectors,
    connect: connectWallet,
    disconnect: disconnectWallet,
  }
}

/**
 * Hook to check if the user has a valid identity (for authenticated requests)
 */
function useIdentity() {
  const { address } = useAccount()

  const identity = useMemo<AuthIdentity | undefined>(() => {
    if (!address) return undefined
    return localStorageGetIdentity(address.toLowerCase()) as
      | AuthIdentity
      | undefined
  }, [address])

  return {
    identity,
    hasValidIdentity: !!identity,
    address,
  }
}

export { useWalletSync, useWallet, useIdentity }
