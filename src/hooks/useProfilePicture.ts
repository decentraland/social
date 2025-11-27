import { useGetProfilePictureQuery } from "../features/profile/profile.client"

// TODO: useProfilesPictures hook to fetch multiple profile pictures at once

/**
 * Hook to fetch profile picture URL for a given address
 * Uses RTK Query for caching and consistent API patterns
 * @param address - Ethereum address of the user
 * @returns Profile picture URL or empty string if not available
 */
export function useProfilePicture(address: string): string {
  const normalizedAddress = address.toLowerCase()
  const { data } = useGetProfilePictureQuery(normalizedAddress, {
    skip: !normalizedAddress,
  })

  return data || ""
}
