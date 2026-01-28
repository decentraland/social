import { Footer } from '../Footer/Footer'
import { Navbar } from '../Navbar/Navbar'
import { BackToTopButton, PageContainer, PageContent } from './PageLayout.styled'

type PageLayoutProps = {
  children: React.ReactNode
  className?: string
}

const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <PageContainer className={className}>
      <Navbar />
      <PageContent>{children}</PageContent>
      <Footer />
      <BackToTopButton />
    </PageContainer>
  )
}

export { PageLayout }
