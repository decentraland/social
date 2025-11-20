import { t } from "decentraland-dapps/dist/modules/translation/utils"
import { NotFoundIcon } from "./NotFoundIcon"
import { PageLayout } from "../../PageLayout"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateText,
} from "./NotFound.styled"

const NotFound = () => {
  return (
    <PageLayout>
      <EmptyState>
        <NotFoundIcon />
        <EmptyStateText color="textPrimary">
          {t("not_found.title")}
        </EmptyStateText>
        <EmptyStateDescription color="textSecondary">
          {t("not_found.description")}
        </EmptyStateDescription>
      </EmptyState>
    </PageLayout>
  )
}

export { NotFound }
