import { Profile } from 'dcl-catalyst-client/dist/client/specs/lambdas-client'
import { client } from '../../services/client'
import { fetchProfile, getLambdasClient, getProfileSnapshot } from './profile.helpers'

const profileApi = client.injectEndpoints({
  endpoints: builder => ({
    /**
     * Get full profile for Navbar avatar.
     * Uses queryFn because we need to call Catalyst lambdas (different server than social service).
     */
    getProfile: builder.query<Profile | null, string | undefined>({
      queryFn: async address => {
        if (!address) {
          return { data: null }
        }
        try {
          const profile = await fetchProfile(address)
          return { data: profile }
        } catch {
          return { data: null }
        }
      },
      keepUnusedDataFor: 300
    }),

    /**
     * Get profile picture URL for a single address.
     * Uses queryFn to call Catalyst lambdas and extract just the snapshot URL.
     */
    getProfilePicture: builder.query<string | null, string>({
      queryFn: async address => {
        try {
          const lambdasClient = getLambdasClient()
          const profile = await lambdasClient.getAvatarDetails(address.toLowerCase())
          const snapshot = getProfileSnapshot(profile)
          return { data: snapshot ?? null }
        } catch {
          return { data: null }
        }
      },
      keepUnusedDataFor: 300
    }),

    /**
     * Get profile pictures for multiple addresses in a batch.
     * Uses queryFn with batch endpoint for efficiency.
     */
    getProfilePicturesBatch: builder.query<Record<string, string>, string[]>({
      queryFn: async addresses => {
        if (!addresses.length) {
          return { data: {} }
        }

        const normalizedAddresses = [...new Set(addresses.map(a => a.toLowerCase()))]

        try {
          const lambdasClient = getLambdasClient()
          const profiles = await lambdasClient.getAvatarsDetailsByPost({
            ids: normalizedAddresses
          })

          const result = profiles.reduce<Record<string, string>>((acc, profile, index) => {
            const address = normalizedAddresses[index]
            const snapshot = getProfileSnapshot(profile)

            if (address && snapshot) {
              acc[address] = snapshot
            }

            return acc
          }, {})

          return { data: result }
        } catch {
          return { data: {} }
        }
      },
      keepUnusedDataFor: 300
    })
  })
})

const useGetProfileQuery = profileApi.useGetProfileQuery
const useGetProfilePictureQuery = profileApi.useGetProfilePictureQuery
const useGetProfilePicturesBatchQuery = profileApi.useGetProfilePicturesBatchQuery

export { profileApi, useGetProfilePictureQuery, useGetProfilePicturesBatchQuery, useGetProfileQuery }
