import { useCallback } from 'react'
import { Footer as BaseFooter, SupportedLanguage } from 'decentraland-ui2'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Locale, fetchTranslations } from '../../modules/translation'
import { FooterWrapper } from './Footer.styled'

// Map SupportedLanguage to our locale type
const LANGUAGE_TO_LOCALE: Record<SupportedLanguage, Locale> = {
  [SupportedLanguage.EN]: 'en',
  [SupportedLanguage.ES]: 'es',
  [SupportedLanguage.ZH]: 'zh',
  // Map unsupported languages to English
  [SupportedLanguage.FR]: 'en',
  [SupportedLanguage.JA]: 'en',
  [SupportedLanguage.KO]: 'en'
}

const LOCALE_TO_LANGUAGE: Record<Locale, SupportedLanguage> = {
  en: SupportedLanguage.EN,
  es: SupportedLanguage.ES,
  zh: SupportedLanguage.ZH
}

const Footer = () => {
  const dispatch = useAppDispatch()
  const locale = useAppSelector(state => state.translation.locale)

  const handleLanguageChange = useCallback(
    (language: SupportedLanguage) => {
      const newLocale = LANGUAGE_TO_LOCALE[language]
      if (newLocale && newLocale !== locale) {
        dispatch(fetchTranslations(newLocale))
      }
    },
    [dispatch, locale]
  )

  return (
    <FooterWrapper>
      <BaseFooter selectedLanguage={LOCALE_TO_LANGUAGE[locale] || SupportedLanguage.EN} onLanguageChange={handleLanguageChange} />
    </FooterWrapper>
  )
}

export { Footer }
