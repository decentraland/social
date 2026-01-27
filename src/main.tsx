import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AnalyticsProvider } from '@dcl/hooks'
import ModalProvider from 'decentraland-dapps/dist/providers/ModalProvider'
import { DclThemeProvider, darkTheme } from 'decentraland-ui2'
import { store } from './app/store'
import { config } from './config'
import * as locales from './modules/translation/locales'
import { TranslationProvider } from './providers/TranslationProvider'
import { WagmiProvider } from './providers/WagmiProvider'
import { WalletSyncProvider } from './providers/WalletSyncProvider'
import { AppRoutes } from './Routes'
import './index.css'

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/social' : '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <WagmiProvider>
          <WalletSyncProvider>
            <TranslationProvider locales={Object.keys(locales)}>
              <DclThemeProvider theme={darkTheme}>
                <AnalyticsProvider writeKey={config.get('SEGMENT_API_KEY')}>
                  <ModalProvider components={{}}>
                    <AppRoutes />
                  </ModalProvider>
                </AnalyticsProvider>
              </DclThemeProvider>
            </TranslationProvider>
          </WalletSyncProvider>
        </WagmiProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
