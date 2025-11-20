import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { config } from "../../../config"

export const SignInRedirect = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get("redirectTo")
    const basename = /^decentraland.(zone|org|today)$/.test(
      window.location.host
    )
      ? "/social"
      : ""
    const redirectTo = !currentRedirectTo
      ? `${basename}${pathname}${search}`
      : `${basename}${currentRedirectTo}`

    window.location.replace(
      `${config.get("AUTH_URL")}/login?redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }, [pathname, search])

  return null
}
