import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { creditsReducer as credits } from "decentraland-dapps/dist/modules/credits/reducer"
import { featuresReducer as features } from "decentraland-dapps/dist/modules/features/reducer"
import { modalReducer as modal } from "decentraland-dapps/dist/modules/modal/reducer"
import { profileReducer as profile } from "decentraland-dapps/dist/modules/profile/reducer"
import { createStorageMiddleware } from "decentraland-dapps/dist/modules/storage/middleware"
import {
  storageReducer as storage,
  storageReducerWrapper,
} from "decentraland-dapps/dist/modules/storage/reducer"
import { transactionReducer as transaction } from "decentraland-dapps/dist/modules/transaction/reducer"
import { en as dappsEn } from "decentraland-dapps/dist/modules/translation/defaults"
import {
  TranslationState,
  translationReducer as translation,
} from "decentraland-dapps/dist/modules/translation/reducer"
import {
  mergeTranslations,
  setCurrentLocale,
} from "decentraland-dapps/dist/modules/translation/utils"
import {
  walletReducer as wallet,
  INITIAL_STATE as walletInitialState,
} from "decentraland-dapps/dist/modules/wallet/reducer"
import { createWalletSaga } from "decentraland-dapps/dist/modules/wallet/sagas"
import { flatten } from "flat"
import createSagasMiddleware from "redux-saga"
import { all } from "redux-saga/effects"
import { config } from "../config"
import * as locales from "../modules/translation/locales"
import { translationSaga } from "../modules/translation/sagas"
import { client } from "../services/client"

function* rootSaga() {
  yield all([
    createWalletSaga({
      CHAIN_ID: Number(config.get("CHAIN_ID")),
      POLL_INTERVAL: 0,
      TRANSACTIONS_API_URL: "https://transactions-api.decentraland.org/v1",
    })(),
    translationSaga(),
  ])
}

function initStore() {
  const sagasMiddleware = createSagasMiddleware()
  const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
    storageKey: "social",
    paths: [], // Empty paths means nothing is persisted
    // Note: If adding persistence paths, ensure RTK Query cache (client reducer) is excluded
    // Never persist RTK Query cache as it can cause stale data issues
    actions: [],
    migrations: {},
  })

  const mergedTranslations = mergeTranslations(
    flatten(dappsEn) as Record<string, string>,
    flatten(locales.en) as Record<string, string>
  )

  const store = configureStore({
    reducer: storageReducerWrapper(
      combineReducers({
        [client.reducerPath]: client.reducer,
        wallet,
        translation,
        modal,
        storage,
        features,
        profile,
        credits,
        transaction,
      })
    ),
    preloadedState: {
      wallet: walletInitialState,
      translation: {
        data: {
          en: mergedTranslations,
        } as unknown as TranslationState["data"],
        locale: "en",
        loading: [],
        error: null,
      } as TranslationState,
    },
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware({
        thunk: {
          extraArgument: {},
        },
        serializableCheck: false,
      })
      return middleware
        .concat(client.middleware)
        .concat(sagasMiddleware)
        .concat(storageMiddleware)
    },
    devTools: process.env.NODE_ENV !== "production",
  })

  loadStorageMiddleware(store)
  sagasMiddleware.run(rootSaga)

  setCurrentLocale("en", mergedTranslations)

  return store
}

const store = initStore()

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export type { RootState, AppDispatch }
export { initStore, store }
