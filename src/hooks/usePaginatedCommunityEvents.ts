import { useGetCommunityEventsQuery } from '../features/events/events.client'
import type { EventsResponse } from '../features/events/types'
import { usePaginatedQuery } from './usePaginatedQuery'

const DEFAULT_LIMIT = 12

type UsePaginatedCommunityEventsOptions = {
  communityId: string
  enabled?: boolean
}

export const usePaginatedCommunityEvents = ({ communityId, enabled = true }: UsePaginatedCommunityEventsOptions) => {
  const result = usePaginatedQuery<
    { communityId: string; limit?: number; offset?: number },
    EventsResponse,
    EventsResponse['data']['events']
  >({
    queryHook: useGetCommunityEventsQuery,
    queryArg: { communityId },
    enabled: enabled && !!communityId,
    defaultLimit: DEFAULT_LIMIT,
    extractItems: data => data.data.events || [],
    extractTotal: data => data.data.total || 0,
    getHasMore: data => {
      const currentCount = data.data.events?.length || 0
      const total = data.data.total || 0
      return currentCount < total
    },
    resetDependency: communityId
  })

  return {
    events: result.items,
    isLoading: result.isLoading,
    isFetchingMore: result.isFetchingMore,
    hasMore: result.hasMore,
    loadMore: result.loadMore,
    total: result.total
  }
}
