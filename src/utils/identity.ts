import { localStorageGetIdentity } from "@dcl/single-sign-on-client"

export const hasValidIdentity = (
  address: string | null | undefined
): boolean => {
  if (!address) {
    return false
  }

  const identity = localStorageGetIdentity(address.toLowerCase())
  return !!identity
}
