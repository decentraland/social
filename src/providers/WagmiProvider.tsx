import { ReactNode, useEffect } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { Web3CoreProvider } from '@dcl/core-web3'
import { wagmiConfig } from '../config/wagmi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1
    }
  }
})

type Props = {
  children: ReactNode
}

/**
 * Debug component to log wagmi state changes
 */
function WagmiDebugger() {
  const { address, isConnected, isConnecting, isReconnecting, connector, status } = useAccount()

  useEffect(() => {
    console.log('[WagmiDebugger] Account state changed:', {
      address,
      isConnected,
      isConnecting,
      isReconnecting,
      connectorName: connector?.name,
      status
    })
  }, [address, isConnected, isConnecting, isReconnecting, connector, status])

  return null
}

export function WagmiProvider({ children }: Props) {
  return (
    <Web3CoreProvider config={wagmiConfig} queryClient={queryClient}>
      <WagmiDebugger />
      {children}
    </Web3CoreProvider>
  )
}
