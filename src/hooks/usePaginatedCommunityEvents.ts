import { useCallback, useEffect, useRef, useState } from "react"
import { useGetCommunityEventsQuery } from "../features/events/events.client"

const DEFAULT_LIMIT = 12

type UsePaginatedCommunityEventsOptions = {
  communityId: string
  enabled?: boolean
}

export const usePaginatedCommunityEvents = ({
  communityId,
  enabled = true,
}: UsePaginatedCommunityEventsOptions) => {
  const [limit] = useState(DEFAULT_LIMIT)
  const [currentOffset, setCurrentOffset] = useState(0)
  const dataRef = useRef<{ total: number; count: number } | null>(null)
  const isFetchingRef = useRef<boolean>(false)

  useEffect(() => {
    setCurrentOffset(0)
    dataRef.current = null
  }, [communityId])

  const { data, isLoading, isFetching } = useGetCommunityEventsQuery(
    {
      communityId,
      limit,
      offset: currentOffset,
    },
    {
      skip: !enabled || !communityId,
    }
  )

  useEffect(() => {
    if (data?.data) {
      dataRef.current = {
        total: data.data.total || 0,
        count: data.data.events?.length || 0,
      }
    }
    isFetchingRef.current = isFetching
  }, [data, isFetching])

  const total = data?.data?.total || 0
  const currentCount = data?.data?.events?.length || 0
  const hasMore = currentCount < total

  const loadMore = useCallback(() => {
    const currentData = dataRef.current
    if (
      !currentData ||
      currentData.count >= currentData.total ||
      isFetchingRef.current
    ) {
      return
    }
    setCurrentOffset((prev) => {
      const nextOffset = prev + limit
      if (nextOffset >= currentData.total) {
        return prev
      }
      return nextOffset
    })
  }, [limit])

  return {
    events: data?.data?.events || [],
    isLoading: isLoading && currentOffset === 0,
    isFetchingMore: isFetching && currentOffset > 0,
    hasMore,
    loadMore,
    total,
  }
}
