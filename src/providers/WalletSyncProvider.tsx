import { ReactNode } from "react"
import { useWalletSync } from "../modules/wallet/hooks"

type Props = {
  children: ReactNode
}

/**
 * Provider that syncs wagmi wallet state with Redux store.
 * Must be placed inside both Redux Provider and WagmiProvider.
 */
export function WalletSyncProvider({ children }: Props) {
  useWalletSync()
  return <>{children}</>
}
