import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { t } from "decentraland-dapps/dist/modules/translation/utils"

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    ("data" in error || "error" in error)
  )
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  )
}

const getErrorMessage = (err: unknown): string | null => {
  if (!err) return null
  if (typeof err === "string") return err
  if (isFetchBaseQueryError(err)) {
    if ("data" in err && err.data) {
      if (typeof err.data === "string") return err.data
      if (typeof err.data === "object" && err.data && "message" in err.data) {
        return String(err.data.message)
      }
      return JSON.stringify(err.data)
    }
    if ("error" in err && err.error) {
      return String(err.error)
    }
    return t("errors.network_request_failed")
  }
  if (isErrorWithMessage(err)) {
    return err.message
  }
  return t("errors.unknown_error")
}

export { getErrorMessage, isErrorWithMessage, isFetchBaseQueryError }
