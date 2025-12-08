import { Config, createConfig, http } from "wagmi"
import { mainnet, polygon, sepolia } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"
import { config as appConfig } from "./index"

const WALLET_CONNECT_PROJECT_ID = "61570c542c2d66c659492e5b24a41522"

const chainId = Number(appConfig.get("CHAIN_ID"))

// Determine which chains to use based on environment
const isMainnet = chainId === 1
const primaryChain = isMainnet ? mainnet : sepolia

// Include Polygon for MANA balance queries
const wagmiConfig: Config = createConfig({
  chains: [primaryChain, polygon],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: "Decentraland Social",
        description: "Decentraland Social Communities",
        url: "https://decentraland.org/social",
        icons: ["https://decentraland.org/favicon.ico"],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http("https://rpc.decentraland.org/mainnet"),
    [sepolia.id]: http("https://rpc.decentraland.org/sepolia"),
    [polygon.id]: http("https://rpc.decentraland.org/polygon"),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig
  }
}

export { wagmiConfig }
