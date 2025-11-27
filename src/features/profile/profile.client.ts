import { createFetchComponent } from "@well-known-components/fetch-component"
import { createLambdasClient } from "dcl-catalyst-client"
import { Profile } from "dcl-catalyst-client/dist/client/specs/lambdas-client"
import { config } from "../../config"
import { client } from "../../services/client"

const catalystLambdasUrl = config.get("CATALYST_LAMBDAS_URL")
const lambdasClient = createLambdasClient({
  url: catalystLambdasUrl,
  fetcher: createFetchComponent(),
})

const getProfileSnapshot = (profile?: Profile): string | undefined =>
  profile?.avatars?.[0]?.avatar?.snapshots?.face256

const profileApi = client.injectEndpoints({
  endpoints: (builder) => ({
    getProfilePicture: builder.query<string | null, string>({
      queryFn: async (address: string) => {
        try {
          const profile = await lambdasClient.getAvatarDetails(address)
          const snapshot = getProfileSnapshot(profile)

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
          const profiles = await lambdasClient.getAvatarsDetailsByPost({
            ids: normalizedAddresses,
          })

          const result = profiles.reduce<Record<string, string>>(
            (acc, profile, index) => {
              const address = normalizedAddresses[index]
              const snapshot = getProfileSnapshot(profile)

              if (address && snapshot) {
                acc[address] = snapshot
              }

              return acc
            },
            {}
          )

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

const useGetProfilePictureQuery = profileApi.useGetProfilePictureQuery
const useGetProfilePicturesBatchQuery =
  profileApi.useGetProfilePicturesBatchQuery

export {
  profileApi,
  useGetProfilePictureQuery,
  useGetProfilePicturesBatchQuery,
}
