import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const UTM_PARAM_KEYS = ['utm_org', 'utm_source', 'utm_medium', 'utm_campaign'] as const

type UtmParamKey = (typeof UTM_PARAM_KEYS)[number]
type UtmParams = Partial<Record<UtmParamKey, string>>

const useUtmParams = (): UtmParams => {
  const { search } = useLocation()

  const utmParams = useMemo(() => {
    const searchParams = new URLSearchParams(search)
    const params: UtmParams = {}

    for (const key of UTM_PARAM_KEYS) {
      const value = searchParams.get(key)
      if (value) {
        params[key] = value
      }
    }

    return params
  }, [search])

  return utmParams
}

export type { UtmParams }
export { useUtmParams }
