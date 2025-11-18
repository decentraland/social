import { TextDecoder, TextEncoder } from "util"
import { flatten } from "flat"
import intlEn from "../intl/en.json"
import * as locales from "../modules/translation/locales"

// Create a flat translation map from our JSON files
const translations: Record<string, string> = {
  ...flatten(locales.en),
  ...flatten(intlEn),
}

jest.mock("decentraland-dapps/dist/modules/translation/utils", () => ({
  t: (key: string) => translations[key] || key,
}))

jest.mock("decentraland-ui2", () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...jest.requireActual("decentraland-ui2"),
    Navbar2: () => jest.fn().mockReturnValue(null),
  }
})

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => undefined,
  }),
})

global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder
