import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "./baseQuery"

export const client = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Community"],
  endpoints: () => ({}),
})
