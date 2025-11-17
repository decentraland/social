import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "./baseQuery"

export const client = createApi({
  reducerPath: "client",
  baseQuery,
  tagTypes: ["Communities", "Events", "Members"],
  keepUnusedDataFor: 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 30,
  endpoints: () => ({}),
})
