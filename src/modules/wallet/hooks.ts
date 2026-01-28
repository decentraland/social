import { useCallback, useMemo } from 'react'
import { useWallet as useCoreWallet, useNetwork } from '@dcl/core-web3'
import { AuthIdentity } from '@dcl/crypto'
import { localStorageGetIdentity } from '@dcl/single-sign-on-client'

/**
 * Hook to get wallet state and actions.
 * Wraps core-web3 hooks and preserves the local app shape.
 */
function useWallet() {
  const { address, isConnected, isConnecting, isDisconnecting, connectors, connect, disconnect } = useCoreWallet()
  const { chainId, isSwitching } = useNetwork()

  const walletAddress = address ? (address as `0x${string}`) : undefined

  const identity = useMemo<AuthIdentity | undefined>(() => {
    if (!walletAddress) return undefined
    return localStorageGetIdentity(walletAddress.toLowerCase()) as AuthIdentity | undefined
  }, [walletAddress])

  const hasValidIdentity = useMemo(() => !!identity, [identity])

  const connectWallet = useCallback(
    (connectorId?: string) => {
      const connector = connectorId ? connectors.find(c => c.id === connectorId || c.uid === connectorId) : connectors[0]
      if (connector) {
        connect(connector)
      }
    },
    [connect, connectors]
  )

  const disconnectWallet = useCallback(() => {
    disconnect()
  }, [disconnect])

  return {
    address: walletAddress,
    chainId: chainId ?? undefined,
    isConnected,
    isConnecting,
    isDisconnecting,
    isSwitchingNetwork: isSwitching,
    identity,
    hasValidIdentity,
    connectors,
    connect: connectWallet,
    disconnect: disconnectWallet
  }
}

/**
 * Hook to check if the user has a valid identity (for authenticated requests)
 */
function useIdentity() {
  const { address } = useCoreWallet()
  const walletAddress = address ? (address as `0x${string}`) : undefined

  const identity = useMemo<AuthIdentity | undefined>(() => {
    if (!walletAddress) return undefined
    return localStorageGetIdentity(walletAddress.toLowerCase()) as AuthIdentity | undefined
  }, [walletAddress])

  return {
    identity,
    hasValidIdentity: !!identity,
    address: walletAddress
  }
}

export { useWallet, useIdentity }
