import type { RootState } from '../../app/store'
import { WALLET_LOADING_STATES } from './constants'

const getState = (state: RootState) => state.wallet

const getData = (state: RootState) => getState(state).data

const getLoading = (state: RootState) => getState(state).loading

const getError = (state: RootState) => getState(state).error

const isConnected = (state: RootState): boolean => getData(state) !== null

const isConnecting = (state: RootState): boolean => getLoading(state).includes(WALLET_LOADING_STATES.CONNECT)

const isDisconnecting = (state: RootState): boolean => getLoading(state).includes(WALLET_LOADING_STATES.DISCONNECT)

const isSwitchingNetwork = (state: RootState): boolean => getLoading(state).includes(WALLET_LOADING_STATES.SWITCH_NETWORK)

const getAddress = (state: RootState): `0x${string}` | undefined => (isConnected(state) ? getData(state)!.address : undefined)

const getChainId = (state: RootState): number | undefined => (isConnected(state) ? getData(state)!.chainId : undefined)

const getAppChainId = (state: RootState) => getState(state).appChainId

const getWalletError = (state: RootState): string | null => getState(state).error

export {
  getAddress,
  getAppChainId,
  getChainId,
  getData,
  getError,
  getLoading,
  getState,
  getWalletError,
  isConnected,
  isConnecting,
  isDisconnecting,
  isSwitchingNetwork
}
