/**
 * Loading state identifiers for wallet operations.
 * Used to track which operations are in progress.
 */
export const WALLET_LOADING_STATES = {
  CONNECT: "[Request] Connect Wallet",
  DISCONNECT: "[Request] Disconnect Wallet",
  SWITCH_NETWORK: "[Request] Switch Network",
} as const

export type WalletLoadingState =
  (typeof WALLET_LOADING_STATES)[keyof typeof WALLET_LOADING_STATES]
