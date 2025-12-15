import { BackToTopButton as BackToTopButtonBase } from "decentraland-dapps/dist/containers/BackToTopButton/BackToTopButton"
import { Box, styled } from "decentraland-ui2"

const PageContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "100vh",
}))

const PageContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  width: "100%",
  paddingTop: "66px", // Account for the fixed UI2 Navbar height
}))

const BackToTopButton = styled(BackToTopButtonBase)(() => ({
  width: "170px",
}))

export { PageContainer, PageContent, BackToTopButton }
