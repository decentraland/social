import * as React from 'react'
import { TextDecoder, TextEncoder } from 'util'
import { flatten } from 'flat'
import * as locales from '../modules/translation/locales'

// Create a flat translation map from our JSON files
const translations: Record<string, string> = {
  ...flatten(locales.en)
}

jest.mock('decentraland-dapps/dist/modules/translation/utils', () => ({
  t: (key: string) => translations[key] || key,
  setCurrentLocale: jest.fn(),
  mergeTranslations: <T extends Record<string, unknown>>(target: T = {} as T, ...sources: (T | undefined)[]): T =>
    Object.assign({}, target, ...sources.filter(Boolean))
}))

// Mock lottie-react to avoid canvas issues
jest.mock('lottie-react', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(null)
}))

jest.mock('decentraland-ui2', () => ({
  ...jest.requireActual('decentraland-ui2'),
  Navbar: jest.fn().mockReturnValue(null),
  JumpIn: ({ buttonText, buttonProps }: { buttonText?: string; buttonProps?: Record<string, unknown> }) =>
    React.createElement('button', { ...buttonProps, 'data-testid': 'jump-in-button' }, buttonText || 'JUMP IN')
}))

// Store the matchMedia state - can be controlled by tests
let matchMediaMatches = false

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => {
    // Check if this is a tablet/mobile query (typically contains max-width for smaller screens)
    const isTabletMobileQuery = query.includes('max-width') || query.includes('768') || query.includes('tablet') || query.includes('mobile')

    // For tablet/mobile queries, return matches based on our mode
    // For other queries (like min-width for desktop), return the opposite
    const matches = isTabletMobileQuery ? matchMediaMatches : !matchMediaMatches

    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => undefined
    }
  }
})

// Export function to control matchMedia from tests
;(global as { setMatchMedia?: (isTabletOrMobile: boolean) => void }).setMatchMedia = (isTabletOrMobile: boolean) => {
  matchMediaMatches = isTabletOrMobile
}

global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder
