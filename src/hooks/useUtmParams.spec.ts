import * as React from "react"
import type { ReactNode } from "react"
import { MemoryRouter } from "react-router-dom"
import { renderHook } from "@testing-library/react"
import { useUtmParams } from "./useUtmParams"

function createWrapper(initialEntries: string[] = ["/"]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(
      MemoryRouter,
      {
        initialEntries,
        future: {
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        },
      },
      children
    )
  }
}

describe("useUtmParams", () => {
  describe("when there are no UTM params in the URL", () => {
    it("should return an empty object", () => {
      const { result } = renderHook(() => useUtmParams(), {
        wrapper: createWrapper(["/"]),
      })

      expect(result.current).toEqual({})
    })
  })

  describe("when utm_org is present", () => {
    it("should return the utm_org value", () => {
      const { result } = renderHook(() => useUtmParams(), {
        wrapper: createWrapper(["/?utm_org=dcl"]),
      })

      expect(result.current).toEqual({ utm_org: "dcl" })
    })
  })

  describe("when utm_source is present", () => {
    it("should return the utm_source value", () => {
      const { result } = renderHook(() => useUtmParams(), {
        wrapper: createWrapper(["/?utm_source=explorer"]),
      })

      expect(result.current).toEqual({ utm_source: "explorer" })
    })
  })

  describe("when utm_medium is present", () => {
    it("should return the utm_medium value", () => {
      const { result } = renderHook(() => useUtmParams(), {
        wrapper: createWrapper(["/?utm_medium=organic"]),
      })

      expect(result.current).toEqual({ utm_medium: "organic" })
    })
  })

  describe("when utm_campaign is present", () => {
    it("should return the utm_campaign value", () => {
      const { result } = renderHook(() => useUtmParams(), {
        wrapper: createWrapper(["/?utm_campaign=communities"]),
      })

      expect(result.current).toEqual({ utm_campaign: "communities" })
    })
  })

  describe("when all UTM params are present", () => {
    it("should return all UTM values", () => {
      const { result } = renderHook(() => useUtmParams(), {
        wrapper: createWrapper([
          "/?utm_org=dcl&utm_source=explorer&utm_medium=organic&utm_campaign=communities",
        ]),
      })

      expect(result.current).toEqual({
        utm_org: "dcl",
        utm_source: "explorer",
        utm_medium: "organic",
        utm_campaign: "communities",
      })
    })
  })

  describe("when some UTM params are present", () => {
    it("should only return the present values", () => {
      const { result } = renderHook(() => useUtmParams(), {
        wrapper: createWrapper(["/?utm_org=dcl&utm_campaign=communities"]),
      })

      expect(result.current).toEqual({
        utm_org: "dcl",
        utm_campaign: "communities",
      })
    })
  })

  describe("when there are other query params mixed with UTM params", () => {
    it("should only return the UTM params", () => {
      const { result } = renderHook(() => useUtmParams(), {
        wrapper: createWrapper([
          "/?utm_org=dcl&foo=bar&utm_source=explorer&baz=qux",
        ]),
      })

      expect(result.current).toEqual({
        utm_org: "dcl",
        utm_source: "explorer",
      })
    })
  })
})
