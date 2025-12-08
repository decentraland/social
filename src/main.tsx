import { StrictMode } from "react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import ModalProvider from "decentraland-dapps/dist/providers/ModalProvider"
import { createRoot } from "react-dom/client"
import { DclThemeProvider, darkTheme } from "decentraland-ui2"
import { store } from "./app/store"
import * as locales from "./modules/translation/locales"
import { TranslationProvider } from "./providers/TranslationProvider"
import { WagmiProvider } from "./providers/WagmiProvider"
import { WalletSyncProvider } from "./providers/WalletSyncProvider"
import { AppRoutes } from "./Routes"
import "./index.css"

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host)
  ? "/social"
  : "/"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <WagmiProvider>
          <WalletSyncProvider>
            <TranslationProvider locales={Object.keys(locales)}>
              <DclThemeProvider theme={darkTheme}>
                <ModalProvider components={{}}>
                  <AppRoutes />
                </ModalProvider>
              </DclThemeProvider>
            </TranslationProvider>
          </WalletSyncProvider>
        </WagmiProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
