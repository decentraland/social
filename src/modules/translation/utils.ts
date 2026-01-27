import { IntlShape, createIntl, createIntlCache } from 'react-intl'

// react-intl cache for better performance
const cache = createIntlCache()
let currentLocale: IntlShape

/**
 * Set the current locale and translations.
 * This must be called before using t().
 */
function setCurrentLocale(locale: string, translations: Record<string, string>): void {
  currentLocale = createIntl(
    {
      locale,
      messages: translations
    },
    cache
  )
}

/**
 * Get the current IntlShape instance.
 */
function getCurrentLocale(): IntlShape {
  return currentLocale
}

/**
 * Translate a message by its ID.
 * @param id - The message ID
 * @param values - Optional values for interpolation
 * @returns The translated message
 */
function t(id: string, values?: Record<string, string | number>): string {
  if (!currentLocale) {
    console.warn(`[t] Translation not initialized, returning key: ${id}`)
    return id
  }
  return currentLocale.formatMessage({ id }, values)
}

/**
 * Merge multiple translation objects, with later sources overriding earlier ones.
 */
function mergeTranslations<T extends Record<string, unknown>>(target: T = {} as T, ...sources: (T | undefined)[]): T {
  return Object.assign({}, target, ...sources.filter(Boolean))
}

export { mergeTranslations, setCurrentLocale, getCurrentLocale, t }
