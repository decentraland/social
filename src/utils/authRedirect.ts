import { clearWagmiState } from '@dcl/core-web3'
import { config } from '../config'

/**
 * Gets the basename based on the current host.
 * Returns "/social" for decentraland domains, empty string otherwise.
 */
function getBasename(): string {
  return /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/social' : ''
}

/**
 * Builds a redirect URL for authentication.
 * @param path - The path to redirect to after authentication (may include query params)
 * @param queryParams - Optional query parameters to append to the path
 * @returns The full redirect URL with basename
 */
function buildAuthRedirectUrl(path: string, queryParams?: Record<string, string>): string {
  const basename = getBasename()
  // Parse the path, handling cases where it already includes query params
  const url = new URL(path, window.location.origin)

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  // Remove the origin, keep only pathname + search
  const pathWithQuery = url.pathname + url.search
  return `${basename}${pathWithQuery}`
}

/**
 * Redirects to the authentication URL with the specified redirect path.
 * @param path - The path to redirect to after authentication
 * @param queryParams - Optional query parameters to append to the path
 */
function redirectToAuth(path: string, queryParams?: Record<string, string>): void {
  const redirectTo = buildAuthRedirectUrl(path, queryParams)
  const authUrl = config.get('AUTH_URL')

  // Clear stale wagmi state to ensure fresh reconnection on return
  clearWagmiState()

  window.location.replace(`${authUrl}/login?redirectTo=${encodeURIComponent(redirectTo)}`)
}

export { buildAuthRedirectUrl, redirectToAuth }
