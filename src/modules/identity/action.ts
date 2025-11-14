import { ProviderType } from "@dcl/schemas"
import { createAction } from "@reduxjs/toolkit"

export const loginRequest = createAction<ProviderType>("[Request] Login")

export type LoginRequestAction = ReturnType<typeof loginRequest>
