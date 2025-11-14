export const getErrorMessage = (err: unknown): string | null => {
  if (!err) return null
  if (typeof err === "string") return err
  if (err && typeof err === "object") {
    if ("data" in err && err.data) {
      if (typeof err.data === "string") return err.data
      if (err.data && typeof err.data === "object" && "message" in err.data) {
        return String(err.data.message)
      }
      return JSON.stringify(err.data)
    }
    if ("error" in err && err.error) {
      return String(err.error)
    }
    if ("message" in err) {
      return String(err.message)
    }
  }
  return "An unknown error occurred"
}
