import { ReactNode } from 'react'
import { Web3SyncProvider } from '@dcl/core-web3'

type Props = {
  children: ReactNode
}

/**
 * Provider that syncs wagmi wallet state with Redux store.
 * Must be placed inside both Redux Provider and WagmiProvider.
 */
export function WalletSyncProvider({ children }: Props) {
  return <Web3SyncProvider>{children}</Web3SyncProvider>
}
