import { ReactNode, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider as WagmiProviderBase, useAccount } from "wagmi"
import { wagmiConfig } from "../config/wagmi"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

type Props = {
  children: ReactNode
}

/**
 * Debug component to log wagmi state changes
 */
function WagmiDebugger() {
  const {
    address,
    isConnected,
    isConnecting,
    isReconnecting,
    connector,
    status,
  } = useAccount()

  useEffect(() => {
    console.log("[WagmiDebugger] Account state changed:", {
      address,
      isConnected,
      isConnecting,
      isReconnecting,
      connectorName: connector?.name,
      status,
    })
  }, [address, isConnected, isConnecting, isReconnecting, connector, status])

  return null
}

export function WagmiProvider({ children }: Props) {
  return (
    <WagmiProviderBase config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiDebugger />
        {children}
      </QueryClientProvider>
    </WagmiProviderBase>
  )
}
