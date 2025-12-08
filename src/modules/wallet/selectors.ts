import type { RootState } from "../../app/store"

const getState = (state: RootState) => state.wallet

const getData = (state: RootState) => getState(state).data

const getLoading = (state: RootState) => getState(state).loading

const getError = (state: RootState) => getState(state).error

const isConnected = (state: RootState): boolean => getData(state) !== null

const isConnecting = (state: RootState): boolean =>
  getLoading(state).includes("[Request] Connect Wallet")

const isDisconnecting = (state: RootState): boolean =>
  getLoading(state).includes("[Request] Disconnect Wallet")

const isSwitchingNetwork = (state: RootState): boolean =>
  getLoading(state).includes("[Request] Switch Network")

const getAddress = (state: RootState): `0x${string}` | undefined =>
  isConnected(state) ? getData(state)!.address : undefined

const getChainId = (state: RootState): number | undefined =>
  isConnected(state) ? getData(state)!.chainId : undefined

const getAppChainId = (state: RootState) => getState(state).appChainId

const getWalletError = (state: RootState): string | null =>
  getState(state).error

export {
  getState,
  getData,
  getLoading,
  getError,
  isConnected,
  isConnecting,
  isDisconnecting,
  isSwitchingNetwork,
  getAddress,
  getChainId,
  getAppChainId,
  getWalletError,
}
