import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { networkReducer, transactionsReducer, walletReducer } from '@dcl/core-web3'
import { modalReducer as modal } from 'decentraland-dapps/dist/modules/modal/reducer'
import { translationReducer as translation } from '../modules/translation'
import { client } from '../services/client'

const rootReducer = combineReducers({
  [client.reducerPath]: client.reducer,
  wallet: walletReducer,
  network: networkReducer,
  transactions: transactionsReducer,
  translation,
  modal
})

function initStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({
        serializableCheck: false
      }).concat(client.middleware)
    },
    devTools: process.env.NODE_ENV !== 'production'
  })

  // Enable refetchOnFocus/refetchOnReconnect behaviors
  setupListeners(store.dispatch)

  return store
}

const store = initStore()

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export type { RootState, AppDispatch }
export { initStore, store }
