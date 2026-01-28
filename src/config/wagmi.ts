import { http } from 'viem'
import { createWeb3CoreConfig, magic, productionChains, testChains } from '@dcl/core-web3'
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { config as appConfig } from './index'

const WALLET_CONNECT_PROJECT_ID = '61570c542c2d66c659492e5b24a41522'
const MAGIC_API_KEYS = {
  mainnet: 'pk_live_212568025B158355',
  testnet: 'pk_live_CE856A4938B36648'
} as const

const chainId = Number(appConfig.get('CHAIN_ID')) as ChainId
const isMainnet = chainId === ChainId.ETHEREUM_MAINNET
const chains = isMainnet ? productionChains : testChains
const magicApiKey = isMainnet ? MAGIC_API_KEYS.mainnet : MAGIC_API_KEYS.testnet

const wagmiConfig = createWeb3CoreConfig({
  walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  appMetadata: {
    name: 'Decentraland Social',
    description: 'Decentraland Social Communities',
    url: 'https://decentraland.org/social',
    icons: ['https://decentraland.org/favicon.ico']
  },
  chains,
  connectors: {
    injected: true,
    walletConnect: true,
    coinbaseWallet: false
  },
  transports: {
    [ChainId.ETHEREUM_MAINNET]: http('https://rpc.decentraland.org/mainnet'),
    [ChainId.ETHEREUM_SEPOLIA]: http('https://rpc.decentraland.org/sepolia'),
    [ChainId.MATIC_MAINNET]: http('https://rpc.decentraland.org/polygon'),
    [ChainId.MATIC_AMOY]: http('https://rpc.decentraland.org/amoy')
  },
  additionalConnectors: [magic({ apiKey: magicApiKey })]
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}

export { wagmiConfig }
