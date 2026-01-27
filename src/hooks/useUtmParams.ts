import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

type UtmParams = {
  utm_org?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

const UTM_PARAM_KEYS = ['utm_org', 'utm_source', 'utm_medium', 'utm_campaign'] as const

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
