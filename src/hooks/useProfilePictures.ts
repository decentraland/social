import { useMemo } from "react"
import { useGetProfilePicturesBatchQuery } from "../features/profile/profile.client"

/**
 * Hook to fetch profile pictures for multiple addresses at once.
 * Returns a map of normalized addresses to avatar URLs.
 */
export function useProfilePictures(
  addresses: string[]
): Record<string, string> {
  const normalizedAddresses = useMemo(() => {
    return Array.from(
      new Set(addresses.map((address) => address.toLowerCase()))
    )
  }, [addresses])

  const skipFetch = normalizedAddresses.length === 0
  const { data = {} } = useGetProfilePicturesBatchQuery(normalizedAddresses, {
    skip: skipFetch,
  })

  return data
}
