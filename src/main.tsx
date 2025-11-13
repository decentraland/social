import "semantic-ui-css/semantic.min.css"
import * as React from "react"
import { BrowserRouter } from "react-router-dom"
import ModalProvider from "decentraland-dapps/dist/providers/ModalProvider"
import TranslationProvider from "decentraland-dapps/dist/providers/TranslationProvider"
import WalletProvider from "decentraland-dapps/dist/providers/WalletProvider"
import { createRoot } from "react-dom/client"
import { DclThemeProvider, darkTheme } from "decentraland-ui2"
import AppRoutes from "./Routes"
import "./index.css"

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host)
  ? "/social"
  : "/"

const container = document.getElementById("root") as HTMLElement
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <WalletProvider>
        <TranslationProvider locales={["en"]}>
          <DclThemeProvider theme={darkTheme}>
            <ModalProvider components={{}}>
              <AppRoutes />
            </ModalProvider>
          </DclThemeProvider>
        </TranslationProvider>
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>
)
