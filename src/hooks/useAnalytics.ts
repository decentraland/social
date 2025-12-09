import { useContext } from "react"
import { AnalyticsContext } from "../contexts/analytics/AnalyticsProvider"

enum Events {
  CLICK_JOIN = "Click on Join",
  CLICK_REQUEST_TO_JOIN = "Click on Request to Join",
  CLICK_CANCEL_REQUEST = "Click on Cancel Request",
  CLICK_JUMP_IN = "Click on Jump In",
  CLICK_SIGN_IN_TO_JOIN = "Click on Sign In to Join",
}

const useAnalytics = () => {
  const analyticsContext = useContext(AnalyticsContext)
  if (!analyticsContext) {
    throw new Error("useAnalytics must be used within AnalyticsProvider")
  }

  // Return no-op functions if analytics is not initialized
  if (!analyticsContext.isInitialized) {
    return {
      track: () => {},
      identify: () => {},
      page: () => {},
      isInitialized: false,
    }
  }

  return {
    track: analyticsContext.track,
    identify: analyticsContext.identify,
    page: analyticsContext.page,
    isInitialized: true,
  }
}

export { Events, useAnalytics }
