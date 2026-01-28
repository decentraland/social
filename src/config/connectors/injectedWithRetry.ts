import { CreateConnectorFn, createConnector } from 'wagmi'
import { injected } from 'wagmi/connectors'

/**
 * Creates an injected connector with retry logic for isAuthorized().
 *
 * The problem: On page load, wagmi calls isAuthorized() immediately.
 * For MetaMask, this calls eth_accounts. If MetaMask hasn't fully
 * initialized yet, it returns empty accounts, and wagmi concludes
 * the user is not authorized.
 *
 * The solution: Retry the authorization check after a delay if the
 * first attempt fails. This gives the wallet extension time to initialize.
 *
 * @param retryDelay - Delay in ms before retrying (default: 500ms)
 * @param maxRetries - Maximum number of retries (default: 2)
 */
export function injectedWithRetry({
  retryDelay = 500,
  maxRetries = 2
}: {
  retryDelay?: number
  maxRetries?: number
} = {}): CreateConnectorFn {
  return createConnector(config => {
    // Create the base injected connector
    const baseConnector = injected()(config)

    return {
      ...baseConnector,

      async isAuthorized(): Promise<boolean> {
        // Try immediately
        let authorized = await baseConnector.isAuthorized()

        console.log('[injectedWithRetry] Initial isAuthorized:', authorized)

        if (authorized) return true

        // Retry with delay
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          console.log(`[injectedWithRetry] Retry ${attempt}/${maxRetries} after ${retryDelay}ms...`)

          await new Promise(resolve => setTimeout(resolve, retryDelay))
          authorized = await baseConnector.isAuthorized()

          console.log(`[injectedWithRetry] Retry ${attempt} result:`, authorized)

          if (authorized) return true
        }

        console.log('[injectedWithRetry] All retries exhausted, not authorized')

        return false
      }
    }
  })
}
