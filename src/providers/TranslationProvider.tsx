import { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { useAppSelector } from '../app/hooks'

type Props = {
  children: ReactNode
  locales: string[]
}

/**
 * Simple TranslationProvider that doesn't depend on dcl-dapps storage.
 * Translations are pre-loaded in the store's initial state.
 */
export function TranslationProvider({ children }: Props) {
  const locale = useAppSelector(state => state.translation.locale)
  const translations = useAppSelector(state => state.translation.data[state.translation.locale])

  // Translations are pre-loaded, so we can render immediately
  return (
    <IntlProvider key={locale} locale={locale} messages={translations}>
      {children}
    </IntlProvider>
  )
}
