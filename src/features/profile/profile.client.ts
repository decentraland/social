import { Profile } from "dcl-catalyst-client/dist/client/specs/lambdas-client"
import { config } from "../../config"
import { client } from "../../services/client"

const catalystLambdasUrl = config.get("CATALYST_LAMBDAS_URL")

const getProfileSnapshot = (profile?: Profile): string | undefined =>
  profile?.avatars?.[0]?.avatar?.snapshots?.face256

// Fetch profile directly using native fetch to avoid "Illegal invocation" with createFetchComponent
async function fetchProfile(address: string): Promise<Profile | null> {
  try {
    const response = await fetch(
      `${catalystLambdasUrl}/profiles/${address.toLowerCase()}`
    )
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data as Profile
  } catch {
    return null
  }
}

async function fetchProfilesBatch(
  addresses: string[]
): Promise<Record<string, Profile>> {
  try {
    const response = await fetch(`${catalystLambdasUrl}/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: addresses }),
    })
    if (!response.ok) {
      return {}
    }
    const profiles: Profile[] = await response.json()
    return profiles.reduce<Record<string, Profile>>((acc, profile, index) => {
      const address = addresses[index]
      if (address) {
        acc[address] = profile
      }
      return acc
    }, {})
  } catch {
    return {}
  }
}

const profileApi = client.injectEndpoints({
  endpoints: (builder) => ({
    // Get full profile for Navbar avatar
    getProfile: builder.query<Profile | null, string | undefined>({
      queryFn: async (address) => {
        if (!address) {
          return { data: null }
        }
        try {
          const profile = await fetchProfile(address)
          return { data: profile }
        } catch (error) {
          console.error("Failed to fetch profile:", error)
          return { data: null }
        }
      },
      keepUnusedDataFor: 300,
    }),
    getProfilePicture: builder.query<string | null, string>({
      queryFn: async (address: string) => {
        try {
          const profile = await fetchProfile(address)
          const snapshot = getProfileSnapshot(profile ?? undefined)

          if (snapshot) {
            return { data: snapshot }
          }

          return { data: null }
        } catch (error) {
          console.error("Failed to fetch profile picture:", error)
          return { data: null }
        }
      },
      // Cache profile pictures for 5 minutes
      keepUnusedDataFor: 300,
    }),
    getProfilePicturesBatch: builder.query<Record<string, string>, string[]>({
      queryFn: async (addresses: string[]) => {
        if (!addresses.length) {
          return { data: {} }
        }

        const normalizedAddresses = Array.from(
          new Set(addresses.map((address) => address.toLowerCase()))
        )

        if (!normalizedAddresses.length) {
          return { data: {} }
        }

        try {
          const profilesMap = await fetchProfilesBatch(normalizedAddresses)

          const result = Object.entries(profilesMap).reduce<
            Record<string, string>
          >((acc, [address, profile]) => {
            const snapshot = getProfileSnapshot(profile)
            if (snapshot) {
              acc[address] = snapshot
            }
            return acc
          }, {})

          return { data: result }
        } catch (error) {
          console.error("Failed to fetch profile pictures batch:", error)
          return { data: {} }
        }
      },
      keepUnusedDataFor: 300,
    }),
  }),
})

const useGetProfileQuery = profileApi.useGetProfileQuery
const useGetProfilePictureQuery = profileApi.useGetProfilePictureQuery
const useGetProfilePicturesBatchQuery =
  profileApi.useGetProfilePicturesBatchQuery

export {
  profileApi,
  useGetProfileQuery,
  useGetProfilePictureQuery,
  useGetProfilePicturesBatchQuery,
}
