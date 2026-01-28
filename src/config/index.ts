import { Env, createConfig } from '@dcl/ui-env'
import dev from './env/dev.json'
import prod from './env/prd.json'
import stg from './env/stg.json'

const reactAppDclDefaultEnvKey = 'REACT_APP_DCL_DEFAULT_ENV'

export const config = createConfig(
  {
    [Env.DEVELOPMENT as string]: {
      ...dev,
      ['SEGMENT_API_KEY']: process.env.VITE_SEGMENT_DEV_API_KEY
    },
    [Env.STAGING as string]: {
      ...stg,
      ['SEGMENT_API_KEY']: process.env.VITE_SEGMENT_STG_API_KEY
    },
    [Env.PRODUCTION as string]: {
      ...prod,
      ['SEGMENT_API_KEY']: process.env.VITE_SEGMENT_PRD_API_KEY
    }
  },
  {
    systemEnvVariables: {
      [reactAppDclDefaultEnvKey]: process.env.VITE_REACT_APP_DCL_DEFAULT_ENV ?? 'dev'
    }
  }
)
