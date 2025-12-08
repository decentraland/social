import { Config, createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import { config as appConfig } from "./index"

const chainId = Number(appConfig.get("CHAIN_ID"))

// Determine which chain to use based on config
const chain = chainId === 1 ? mainnet : sepolia

const wagmiConfig: Config = createConfig({
  chains: [chain],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig
  }
}

export { wagmiConfig }
