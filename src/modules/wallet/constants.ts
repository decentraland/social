/**
 * Loading state identifiers for wallet operations.
 * Used to track which operations are in progress.
 */
export const WALLET_LOADING_STATES = {
  connect: '[Request] Connect Wallet',
  disconnect: '[Request] Disconnect Wallet',
  switchNetwork: '[Request] Switch Network'
} as const

export type WalletLoadingState = (typeof WALLET_LOADING_STATES)[keyof typeof WALLET_LOADING_STATES]
