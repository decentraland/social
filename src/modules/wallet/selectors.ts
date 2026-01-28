import {
  getIsConnected,
  getIsConnecting,
  getIsDisconnecting,
  getIsNetworkSwitching,
  getChainId as getNetworkChainId,
  getAddress as getWalletAddress,
  getWalletError
} from '@dcl/core-web3'
import type { RootState } from '../../app/store'

const getAddress = (state: RootState) => getWalletAddress(state)

const getChainId = (state: RootState) => getNetworkChainId(state)

const isConnected = (state: RootState) => getIsConnected(state)

const isConnecting = (state: RootState) => getIsConnecting(state)

const isDisconnecting = (state: RootState) => getIsDisconnecting(state)

const isSwitchingNetwork = (state: RootState) => getIsNetworkSwitching(state)

export { getAddress, getChainId, getWalletError, isConnected, isConnecting, isDisconnecting, isSwitchingNetwork }
