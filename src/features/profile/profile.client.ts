import { createFetchComponent } from "@well-known-components/fetch-component"
import { createLambdasClient } from "dcl-catalyst-client"
import { config } from "../../config"
import { client } from "../../services/client"

const profileApi = client.injectEndpoints({
  endpoints: (builder) => ({
    getProfilePicture: builder.query<string, string>({
      queryFn: async (address: string) => {
        try {
          const catalystLambdasUrl = config.get("CATALYST_LAMBDAS_URL")
          const lambdasClient = createLambdasClient({
            url: catalystLambdasUrl,
            fetcher: createFetchComponent(),
          })

          const profile = await lambdasClient.getAvatarDetails(address)

          if (
            profile?.avatars &&
            profile.avatars.length > 0 &&
            profile.avatars[0]?.avatar?.snapshots?.face
          ) {
            return { data: profile.avatars[0].avatar.snapshots.face }
          }

          return { data: "" }
        } catch (error) {
          console.error("Failed to fetch profile picture:", error)
          return { data: "" }
        }
      },
      // Cache profile pictures for 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
})

const { useGetProfilePictureQuery } = profileApi

export { profileApi, useGetProfilePictureQuery }
