import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { config } from "../config"
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query"

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
