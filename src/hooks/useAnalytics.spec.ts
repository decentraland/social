import type { ReactNode } from "react"
import * as React from "react"
import { renderHook } from "@testing-library/react"
import { Events, useAnalytics } from "./useAnalytics"
import { AnalyticsContext } from "../contexts/analytics/AnalyticsProvider"
import type { AnalyticsContextType } from "../contexts/analytics/types"

describe("useAnalytics", () => {
  describe("when analytics is not initialized", () => {
    const wrapper = ({ children }: { children: ReactNode }) =>
      React.createElement(
        AnalyticsContext.Provider,
        { value: { isInitialized: false } },
        children
      )

    it("should return no-op functions", () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper })

      expect(result.current.isInitialized).toBe(false)
      expect(typeof result.current.track).toBe("function")
      expect(typeof result.current.identify).toBe("function")
      expect(typeof result.current.page).toBe("function")
    })

    it("should not throw when calling track", () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper })

      expect(() => {
        result.current.track("test-event", { prop: "value" })
      }).not.toThrow()
    })
  })

  describe("when analytics is initialized", () => {
    const mockTrack = jest.fn()
    const mockIdentify = jest.fn()
    const mockPage = jest.fn()

    const initializedContext: AnalyticsContextType = {
      isInitialized: true,
      track: mockTrack,
      identify: mockIdentify,
      page: mockPage,
    }

    const wrapper = ({ children }: { children: ReactNode }) =>
      React.createElement(
        AnalyticsContext.Provider,
        { value: initializedContext },
        children
      )

    beforeEach(() => {
      mockTrack.mockClear()
      mockIdentify.mockClear()
      mockPage.mockClear()
    })

    it("should return isInitialized as true", () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper })

      expect(result.current.isInitialized).toBe(true)
    })

    it("should return the track function from context", () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper })

      result.current.track("test-event", { prop: "value" })

      expect(mockTrack).toHaveBeenCalledWith("test-event", { prop: "value" })
    })

    it("should return the identify function from context", () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper })

      result.current.identify("user-123", { name: "Test User" })

      expect(mockIdentify).toHaveBeenCalledWith("user-123", {
        name: "Test User",
      })
    })

    it("should return the page function from context", () => {
      const { result } = renderHook(() => useAnalytics(), { wrapper })

      result.current.page("Home", { section: "main" })

      expect(mockPage).toHaveBeenCalledWith("Home", { section: "main" })
    })
  })
})

describe("Events enum", () => {
  it("should have CLICK_JOIN event", () => {
    expect(Events.CLICK_JOIN).toBe("Click on Join")
  })

  it("should have CLICK_REQUEST_TO_JOIN event", () => {
    expect(Events.CLICK_REQUEST_TO_JOIN).toBe("Click on Request to Join")
  })

  it("should have CLICK_CANCEL_REQUEST event", () => {
    expect(Events.CLICK_CANCEL_REQUEST).toBe("Click on Cancel Request")
  })

  it("should have CLICK_JUMP_IN event", () => {
    expect(Events.CLICK_JUMP_IN).toBe("Click on Jump In")
  })

  it("should have CLICK_SIGN_IN_TO_JOIN event", () => {
    expect(Events.CLICK_SIGN_IN_TO_JOIN).toBe("Click on Sign In to Join")
  })
})
