import { useCallback, useEffect, useRef, useState } from "react"
import { useGetCommunityMembersQuery } from "../features/communities/communities.client"

const DEFAULT_LIMIT = 10

type UsePaginatedCommunityMembersOptions = {
  communityId: string
  enabled?: boolean
}

export const usePaginatedCommunityMembers = ({
  communityId,
  enabled = true,
}: UsePaginatedCommunityMembersOptions) => {
  const [limit] = useState(DEFAULT_LIMIT)
  const [currentOffset, setCurrentOffset] = useState(0)
  const paginationRef = useRef<{ page: number; pages: number } | null>(null)
  const isFetchingRef = useRef<boolean>(false)

  useEffect(() => {
    setCurrentOffset(0)
    paginationRef.current = null
  }, [communityId])

  const { data, isLoading, isFetching } = useGetCommunityMembersQuery(
    {
      id: communityId,
      limit,
      offset: currentOffset,
    },
    {
      skip: !enabled || !communityId,
    }
  )

  useEffect(() => {
    if (data?.data) {
      paginationRef.current = {
        page: data.data.page || 1,
        pages: data.data.pages || 1,
      }
    }
    isFetchingRef.current = isFetching
  }, [data, isFetching])

  const total = data?.data?.total || 0
  const currentPage = data?.data?.page || 1
  const totalPages = data?.data?.pages || 1
  const hasMore = currentPage < totalPages

  const loadMore = useCallback(() => {
    const pagination = paginationRef.current
    if (
      !pagination ||
      pagination.page >= pagination.pages ||
      isFetchingRef.current
    ) {
      return
    }
    setCurrentOffset((prev) => prev + limit)
  }, [limit])

  return {
    members: data?.data?.results || [],
    isLoading: isLoading && currentOffset === 0,
    isFetchingMore: isFetching && currentOffset > 0,
    hasMore,
    loadMore,
    total,
  }
}
