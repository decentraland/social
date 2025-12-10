import { ChainId } from "@dcl/schemas/dist/dapps/chain-id"
import { type Chain, type EIP1193Provider } from "viem"
import { createConnector } from "wagmi"

// Magic SDK types (dynamic import)
type MagicInstance = {
  user: {
    isLoggedIn: () => Promise<boolean>
    logout: () => Promise<boolean>
    getInfo: () => Promise<{ email?: string; publicAddress?: string }>
  }
  wallet: {
    getProvider: () => Promise<EIP1193Provider>
  }
}

// DCL Magic configuration - matches decentraland-connect
const MAGIC_CONFIG = {
  apiKey: "pk_live_212568025B158355",
  testApiKey: "pk_live_CE856A4938B36648",
  rpcUrls: {
    [ChainId.ETHEREUM_MAINNET]:
      "https://rpc.decentraland.org/mainnet?project=magic",
    [ChainId.ETHEREUM_SEPOLIA]:
      "https://rpc.decentraland.org/sepolia?project=magic",
    [ChainId.MATIC_MAINNET]:
      "https://rpc.decentraland.org/polygon?project=magic",
    [ChainId.MATIC_AMOY]: "https://rpc.decentraland.org/amoy?project=magic",
  } as Record<number, string>,
} as const

export type MagicParameters = {
  /** Use test API key (for development) */
  isTest?: boolean
}

/**
 * Magic connector for wagmi.
 *
 * This connector integrates Magic Link authentication with wagmi,
 * allowing users to sign in with social logins (Google, Discord, etc.)
 * or email-based authentication.
 *
 * Important: The user must already be logged in via Magic (typically through
 * the auth dapp redirect flow). This connector only maintains the session,
 * it does not initiate the Magic login flow.
 *
 * Flow:
 * 1. User goes to auth.decentraland.org and logs in with Magic (social login)
 * 2. Auth dapp redirects back to social dapp with Magic session
 * 3. This connector detects the Magic session and connects
 */
export function magic(parameters: MagicParameters = {}) {
  const { isTest = false } = parameters

  type StorageItem = { magicChainId?: number }

  let magicInstance: MagicInstance | null = null
  let provider: EIP1193Provider | null = null

  async function getMagicInstance(chainId: number): Promise<MagicInstance> {
    // Dynamic import to avoid loading Magic SDK if not needed
    const { Magic } = await import("magic-sdk")
    const { OAuthExtension } = await import("@magic-ext/oauth2")

    const apiKey = isTest ? MAGIC_CONFIG.testApiKey : MAGIC_CONFIG.apiKey
    const rpcUrl =
      MAGIC_CONFIG.rpcUrls[chainId] ||
      MAGIC_CONFIG.rpcUrls[ChainId.ETHEREUM_MAINNET]

    return new Magic(apiKey, {
      extensions: [new OAuthExtension()],
      network: {
        rpcUrl,
        chainId,
      },
    }) as unknown as MagicInstance
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createConnector<EIP1193Provider, any, StorageItem>((config) => ({
    id: "magic",
    name: "Magic",
    type: "magic",

    async setup() {
      // Check if user is already logged in via Magic
      // Magic stores sessions in its own domain (auth.magic.link) via iframe,
      // so we can detect sessions even when the user logged in from a different
      // subdomain (e.g., auth.decentraland.org)
      const savedChainId = await config.storage?.getItem("magicChainId")
      const chainId = savedChainId ?? config.chains[0]?.id

      if (chainId) {
        try {
          magicInstance = await getMagicInstance(chainId)
          const isLoggedIn = await magicInstance.user.isLoggedIn()

          if (isLoggedIn) {
            provider = await magicInstance.wallet.getProvider()

            // Get accounts and notify wagmi about the existing session
            const accounts = (await provider.request({
              method: "eth_accounts",
            })) as string[]

            if (accounts.length > 0) {
              // Emit connect event so wagmi knows we're connected
              // This is the key difference from other connectors - we detect
              // an existing session and notify wagmi proactively
              config.emitter.emit("connect", {
                accounts: accounts as readonly `0x${string}`[],
                chainId,
              })

              // Save chainId for future sessions
              await config.storage?.setItem("magicChainId", chainId)
            }
          }
        } catch {
          // User not logged in or Magic not available
        }
      }
    },

    async connect({ chainId: requestedChainId }: { chainId?: number } = {}) {
      const targetChainId = requestedChainId ?? config.chains[0].id

      if (!magicInstance) {
        magicInstance = await getMagicInstance(targetChainId)
      }

      const isLoggedIn = await magicInstance.user.isLoggedIn()

      if (!isLoggedIn) {
        throw new Error(
          "Magic: User is not logged in. Please authenticate via the auth dapp first."
        )
      }

      provider = await magicInstance.wallet.getProvider()

      const accounts = (await provider.request({
        method: "eth_accounts",
      })) as string[]

      if (!accounts.length) {
        throw new Error("Magic: No accounts found")
      }

      // Save chainId for reconnection
      await config.storage?.setItem("magicChainId", targetChainId)

      return {
        accounts: accounts as readonly `0x${string}`[],
        chainId: targetChainId,
      }
    },

    async disconnect() {
      if (magicInstance) {
        await magicInstance.user.logout()
      }
      magicInstance = null
      provider = null
      await config.storage?.removeItem("magicChainId")
    },

    async getAccounts() {
      if (!provider) {
        return []
      }
      const accounts = (await provider.request({
        method: "eth_accounts",
      })) as string[]
      return accounts as readonly `0x${string}`[]
    },

    async getChainId() {
      if (!provider) {
        return config.chains[0].id
      }
      const chainId = await provider.request({ method: "eth_chainId" })
      return Number(chainId)
    },

    async getProvider() {
      if (!provider && magicInstance) {
        provider = await magicInstance.wallet.getProvider()
      }
      return provider!
    },

    async isAuthorized() {
      try {
        if (!magicInstance) {
          // Try saved chain first, otherwise use default chain
          // This is important for cross-domain sessions: Magic stores sessions
          // in its own domain (auth.magic.link) via iframe, so we can check
          // if user is logged in even without a saved chainId
          const savedChainId = await config.storage?.getItem("magicChainId")
          const chainId = savedChainId ?? config.chains[0]?.id
          if (!chainId) {
            return false
          }
          magicInstance = await getMagicInstance(chainId)
        }
        return await magicInstance.user.isLoggedIn()
      } catch {
        return false
      }
    },

    async switchChain({
      chainId: newChainId,
    }: {
      chainId: number
    }): Promise<Chain> {
      // Magic doesn't support wallet_switchEthereumChain natively
      // We need to recreate the Magic instance with the new chain
      // This is the same approach decentraland-connect uses
      magicInstance = await getMagicInstance(newChainId)

      const isLoggedIn = await magicInstance.user.isLoggedIn()
      if (!isLoggedIn) {
        throw new Error("Magic: User is not logged in")
      }

      provider = await magicInstance.wallet.getProvider()
      await config.storage?.setItem("magicChainId", newChainId)

      config.emitter.emit("change", { chainId: newChainId })

      const chain = config.chains.find((c) => c.id === newChainId)
      if (!chain) {
        throw new Error(`Chain ${newChainId} not configured`)
      }
      return chain
    },

    onAccountsChanged(accounts: string[]) {
      if (accounts.length === 0) {
        this.onDisconnect()
      } else {
        config.emitter.emit("change", {
          accounts: accounts as readonly `0x${string}`[],
        })
      }
    },

    onChainChanged(chain: string) {
      const chainId = Number(chain)
      config.emitter.emit("change", { chainId })
    },

    onDisconnect() {
      config.emitter.emit("disconnect")
      magicInstance = null
      provider = null
    },
  }))
}
