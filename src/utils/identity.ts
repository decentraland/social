import { localStorageGetIdentity } from "@dcl/single-sign-on-client"
import type { Wallet } from "decentraland-dapps/dist/modules/wallet/types"

export const hasValidIdentity = (wallet: Wallet | null): boolean => {
  if (!wallet?.address) {
    return false
  }

  const identity = localStorageGetIdentity(wallet.address.toLowerCase())
  return !!identity
}
