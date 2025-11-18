import { Box, Typography } from "decentraland-ui2"
import { PageLayout } from "../../PageLayout"

const NotFound = () => {
  return (
    <PageLayout>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
      >
        <Typography variant="h4">Page not found</Typography>
        <Typography variant="body1" color="textSecondary">
          The page you are looking for does not exist.
        </Typography>
      </Box>
    </PageLayout>
  )
}

export { NotFound }
