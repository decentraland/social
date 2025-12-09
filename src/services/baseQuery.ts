import { AuthIdentity } from "@dcl/crypto"
import { localStorageGetIdentity } from "@dcl/single-sign-on-client"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import signedFetch from "decentraland-crypto-fetch"
import { config } from "../config"
import { getAddress } from "../modules/wallet/selectors"
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query"

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  try {
    const fetchArgs = typeof args === "string" ? { url: args } : args
    const customBaseUrl = (fetchArgs as { baseUrl?: string }).baseUrl
    const baseUrl = customBaseUrl || config.get("SOCIAL_SERVICE_URL")

    const signedFetchWrapper = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      const state = api.getState()
      const address = getAddress(state as Parameters<typeof getAddress>[0])

      if (address) {
        const identity = localStorageGetIdentity(address.toLowerCase())

        if (identity) {
          return signedFetch(input, {
            ...init,
            identity: identity as AuthIdentity,
          })
        }
      }

      return signedFetch(input, init)
    }

    const result = await fetchBaseQuery({
      baseUrl,
      fetchFn: signedFetchWrapper,
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

export { baseQuery }
