import { t } from "decentraland-dapps/dist/modules/translation/utils"
import { Icon, muiIcons, useTheme } from "decentraland-ui2"
import { PageLayout } from "../../PageLayout"
import { NotFoundProps } from "./NotFound.types"
import {
  NotFoundContainer,
  NotFoundDescription,
  NotFoundTitle,
} from "./NotFound.styled"

const NotFound = (props: NotFoundProps) => {
  const { title, description } = props
  const theme = useTheme()

  return (
    <PageLayout>
      <NotFoundContainer>
        <Icon
          component={muiIcons.ErrorOutline}
          sx={{ fontSize: theme.spacing(9) }}
        />
        <NotFoundTitle color="textPrimary">
          {title || t("not_found.title")}
        </NotFoundTitle>
        <NotFoundDescription color="textSecondary">
          {description || t("not_found.description")}
        </NotFoundDescription>
      </NotFoundContainer>
    </PageLayout>
  )
}

export { NotFound }
