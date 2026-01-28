import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { flatten } from 'flat'
import { en as dappsEn } from 'decentraland-dapps/dist/modules/translation/defaults'
import { setCurrentLocale as setDappsCurrentLocale } from 'decentraland-dapps/dist/modules/translation/utils'
import { en, es, zh } from './locales'
import { mergeTranslations, setCurrentLocale } from './utils'

type Locale = 'en' | 'es' | 'zh'

type TranslationState = {
  locale: Locale
  data: Record<Locale, Record<string, string>>
  loading: boolean
  error: string | null
}

// Map of available locales
const localeMap: Record<Locale, Record<string, unknown>> = {
  en,
  es,
  zh
}

// Get initial translations merged with dapps defaults
const getInitialTranslations = (locale: Locale): Record<string, string> => {
  const appTranslations = localeMap[locale]
  return mergeTranslations(flatten(dappsEn), flatten(appTranslations))
}

const initialTranslations = getInitialTranslations('en')

// Set initial locale for both our t() and dcl-dapps t()
// This is needed because BackToTopButton and other dcl-dapps components use their own t()
setCurrentLocale('en', initialTranslations)
setDappsCurrentLocale('en', initialTranslations)

const initialState: TranslationState = {
  locale: 'en',
  data: {
    en: initialTranslations,
    es: {},
    zh: {}
  },
  loading: false,
  error: null
}

// Async thunk to fetch/change translations
const fetchTranslations = createAsyncThunk('translation/fetchTranslations', async (locale: Locale, { rejectWithValue }) => {
  try {
    const appTranslations = localeMap[locale]
    if (!appTranslations) {
      throw new Error(`Locale "${locale}" not found`)
    }

    const dappsDefaults = dappsEn // TODO: support other dapps locales if needed
    const mergedTranslations = mergeTranslations(flatten(dappsDefaults), flatten(appTranslations))

    // Update the global locale used by both our t() and dcl-dapps t()
    setCurrentLocale(locale, mergedTranslations)
    setDappsCurrentLocale(locale, mergedTranslations)

    return { locale, translations: mergedTranslations }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to load translations')
  }
})

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTranslations.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTranslations.fulfilled, (state, action) => {
        state.loading = false
        state.locale = action.payload.locale
        state.data[action.payload.locale] = action.payload.translations
      })
      .addCase(fetchTranslations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

const { setLocale } = translationSlice.actions
const translationReducer = translationSlice.reducer

export { fetchTranslations, setLocale, translationReducer }
export type { Locale, TranslationState }
