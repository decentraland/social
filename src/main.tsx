import { StrictMode } from "react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import ModalProvider from "decentraland-dapps/dist/providers/ModalProvider"
import TranslationProvider from "decentraland-dapps/dist/providers/TranslationProvider"
import WalletProvider from "decentraland-dapps/dist/providers/WalletProvider"
import { createRoot } from "react-dom/client"
import { DclThemeProvider, darkTheme } from "decentraland-ui2"
import { store } from "./app/store"
import * as locales from "./modules/translation/locales"
import { AppRoutes } from "./Routes"
import "./index.css"

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host)
  ? "/social"
  : "/"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <WalletProvider>
          <TranslationProvider locales={Object.keys(locales)}>
            <DclThemeProvider theme={darkTheme}>
              <ModalProvider components={{}}>
                <AppRoutes />
              </ModalProvider>
            </DclThemeProvider>
          </TranslationProvider>
        </WalletProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
