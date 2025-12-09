import { ChainId } from "@dcl/schemas/dist/dapps/chain-id"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { WALLET_LOADING_STATES } from "./constants"
import { config } from "../../config"

// Match dcl-dapps Wallet type shape for compatibility with dcl-dapps selectors
type WalletData = {
  address: `0x${string}`
  chainId: ChainId
  // These are optional but included for compatibility
  networks?: Record<string, unknown>
  providerType?: string
}

// Match dcl-dapps WalletState shape exactly for compatibility with dcl-dapps containers
type WalletState = {
  data: WalletData | null
  loading: string[] // dcl-dapps uses LoadingState which is string[]
  error: string | null
  appChainId: ChainId
}

const initialState: WalletState = {
  data: null,
  loading: [],
  error: null,
  appChainId: Number(config.get("CHAIN_ID")) as ChainId,
}

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletConnecting: (state) => {
      if (!state.loading.includes(WALLET_LOADING_STATES.CONNECT)) {
        state.loading.push(WALLET_LOADING_STATES.CONNECT)
      }
      state.error = null
    },
    setWalletConnected: (
      state,
      action: PayloadAction<{ address: `0x${string}`; chainId: number }>
    ) => {
      state.data = {
        address: action.payload.address,
        chainId: action.payload.chainId as ChainId,
      }
      state.loading = state.loading.filter(
        (l) => l !== WALLET_LOADING_STATES.CONNECT
      )
      state.error = null
    },
    setWalletDisconnected: (state) => {
      state.data = null
      state.loading = []
      state.error = null
    },
    setWalletError: (state, action: PayloadAction<string>) => {
      state.loading = []
      state.error = action.payload
    },
    updateChainId: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.chainId = action.payload as ChainId
      }
    },
    setSwitchingNetwork: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        if (!state.loading.includes(WALLET_LOADING_STATES.SWITCH_NETWORK)) {
          state.loading.push(WALLET_LOADING_STATES.SWITCH_NETWORK)
        }
      } else {
        state.loading = state.loading.filter(
          (l) => l !== WALLET_LOADING_STATES.SWITCH_NETWORK
        )
      }
    },
    setDisconnecting: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        if (!state.loading.includes(WALLET_LOADING_STATES.DISCONNECT)) {
          state.loading.push(WALLET_LOADING_STATES.DISCONNECT)
        }
      } else {
        state.loading = state.loading.filter(
          (l) => l !== WALLET_LOADING_STATES.DISCONNECT
        )
      }
    },
  },
})

export const {
  setWalletConnecting,
  setWalletConnected,
  setWalletDisconnected,
  setWalletError,
  updateChainId,
  setSwitchingNetwork,
  setDisconnecting,
} = walletSlice.actions

export type { WalletData, WalletState }
// eslint-disable-next-line import/no-default-export
export default walletSlice.reducer
