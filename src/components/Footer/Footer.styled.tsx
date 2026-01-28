/* eslint-disable @typescript-eslint/naming-convention */
import { Box, styled } from 'decentraland-ui2'

const FooterWrapper = styled(Box)(() => ({
  '& > *': {
    padding: '0 !important'
  }
}))

export { FooterWrapper }
