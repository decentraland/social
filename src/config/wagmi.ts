import { createWeb3CoreConfig, magic, productionChains, testChains, thirdweb } from '@dcl/core-web3'
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { config as appConfig } from './index'

const WALLET_CONNECT_PROJECT_ID = '61570c542c2d66c659492e5b24a41522'

const chainId = Number(appConfig.get('CHAIN_ID')) as ChainId
const isMainnet = chainId === ChainId.ETHEREUM_MAINNET
const chains = isMainnet ? productionChains : testChains
const magicApiKey = appConfig.get('MAGIC_API_KEY')
const thirdwebClientId = appConfig.get('THIRDWEB_CLIENT_ID')

const wagmiConfig = createWeb3CoreConfig({
  walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  appMetadata: {
    name: 'Decentraland Social',
    description: 'Decentraland Social Communities',
    url: 'https://decentraland.org/social'
  },
  chains,
  connectors: {
    injected: true,
    walletConnect: true,
    coinbaseWallet: false
  },
  additionalConnectors: [magic({ apiKey: magicApiKey }), thirdweb({ clientId: thirdwebClientId })]
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}

export { wagmiConfig }
