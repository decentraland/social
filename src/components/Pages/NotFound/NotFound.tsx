import { t } from "decentraland-dapps/dist/modules/translation/utils"
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
        <Typography variant="h4">{t("not_found.title")}</Typography>
        <Typography variant="body1" color="textSecondary">
          {t("not_found.description")}
        </Typography>
      </Box>
    </PageLayout>
  )
}

export { NotFound }
