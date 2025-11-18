import { createTranslationSaga } from "decentraland-dapps/dist/modules/translation/sagas"
import * as translations from "./locales"

export const translationSaga = createTranslationSaga({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations: translations as any,
})
