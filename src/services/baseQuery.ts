import { AuthIdentity } from "@dcl/crypto"
import { localStorageGetIdentity } from "@dcl/single-sign-on-client"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getData as getWallet } from "decentraland-dapps/dist/modules/wallet/selectors"
import { signedFetchFactory } from "decentraland-crypto-fetch"
import { store } from "../app/store"
import { config } from "../config"
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query"

const createSignedFetch = () => {
  const signedFetch = signedFetchFactory()

  return async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const state = store.getState()
    const wallet = getWallet(state)

    if (wallet?.address) {
      const identity = localStorageGetIdentity(wallet.address.toLowerCase())

      if (identity) {
        return signedFetch(input, {
          ...init,
          identity: identity as AuthIdentity,
        })
      }
    }

    return signedFetch(input, init)
  }
}

const customFetch = createSignedFetch()

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  try {
    const fetchArgs = typeof args === "string" ? { url: args } : args
    const customBaseUrl = (fetchArgs as { baseUrl?: string }).baseUrl
    const baseUrl = customBaseUrl || config.get("SOCIAL_SERVICE_URL")

    const result = await fetchBaseQuery({
      baseUrl,
      fetchFn: customFetch,
      prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json")
        return headers
      },
    })(args, api, extraOptions)

    return result
  } catch (error) {
    return {
      error: {
        status: "FETCH_ERROR",
        error:
          error instanceof Error ? error.message : "Network request failed",
      },
    } as { error: FetchBaseQueryError }
  }
}

export const baseQuery = baseQueryWithErrorHandling
