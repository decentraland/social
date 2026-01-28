import { BackToTopButton as BackToTopButtonBase } from 'decentraland-dapps/dist/containers/BackToTopButton/BackToTopButton'
import { Box, styled } from 'decentraland-ui2'

const PageContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '100vh',
  position: 'relative'
}))

const PageContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  height: '100%',
  paddingTop: '66px', // Account for the fixed UI2 Navbar height,
  background: 'radial-gradient(103.89% 95.21% at 95.21% 9.85%, #7434B1 0%, #481C6C 37.11%, #2B1040 100%)'
}))

const BackToTopButton = styled(BackToTopButtonBase)(() => ({
  width: '170px'
}))

export { PageContainer, PageContent, BackToTopButton }
