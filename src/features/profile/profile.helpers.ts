import { IFetchComponent } from '@well-known-components/interfaces'
import { LambdasClient, createLambdasClient } from 'dcl-catalyst-client'
import { Profile } from 'dcl-catalyst-client/dist/client/specs/lambdas-client'
import { config } from '../../config'

const catalystLambdasUrl = config.get('CATALYST_LAMBDAS_URL')

// Create a singleton lambdas client
let lambdasClient: LambdasClient | null = null

/**
 * Custom fetch component that properly binds window.fetch
 *
 */
function createBrowserFetchComponent(): IFetchComponent {
  return {
    fetch: ((url: RequestInfo | URL, init?: RequestInit) => window.fetch(url, init)) as unknown as IFetchComponent['fetch']
  }
}

function getLambdasClient(): LambdasClient {
  if (!lambdasClient) {
    const fetcher = createBrowserFetchComponent()
    lambdasClient = createLambdasClient({
      url: catalystLambdasUrl,
      fetcher
    })
  }
  return lambdasClient
}

/**
 * Extract the face256 snapshot URL from a profile
 */
function getProfileSnapshot(profile?: Profile): string | undefined {
  return profile?.avatars?.[0]?.avatar?.snapshots?.face256
}

/**
 * Fetch a single profile from Catalyst lambdas
 */
async function fetchProfile(address: string): Promise<Profile | null> {
  try {
    const client = getLambdasClient()
    return await client.getAvatarDetails(address.toLowerCase())
  } catch {
    return null
  }
}

/**
 * Fetch multiple profiles from Catalyst lambdas in a single request
 */
async function fetchProfilesBatch(addresses: string[]): Promise<Record<string, Profile>> {
  if (!addresses.length) {
    return {}
  }

  try {
    const client = getLambdasClient()
    const normalizedAddresses = addresses.map(a => a.toLowerCase())

    const profiles = await client.getAvatarsDetailsByPost({
      ids: normalizedAddresses
    })

    // Map profiles by their userId (address)
    return profiles.reduce<Record<string, Profile>>((acc, profile) => {
      const userId = profile.avatars?.[0]?.userId
      if (userId) {
        acc[userId.toLowerCase()] = profile
      }
      return acc
    }, {})
  } catch {
    return {}
  }
}

export { fetchProfile, fetchProfilesBatch, getLambdasClient, getProfileSnapshot }
