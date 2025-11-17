import { usePaginatedQuery } from "./usePaginatedQuery"
import { useGetCommunityMembersQuery } from "../features/communities/communities.client"
import type { CommunityMembersResponse } from "../features/communities/types"

const DEFAULT_LIMIT = 10

type UsePaginatedCommunityMembersOptions = {
  communityId: string
  enabled?: boolean
}

export const usePaginatedCommunityMembers = ({
  communityId,
  enabled = true,
}: UsePaginatedCommunityMembersOptions) => {
  const result = usePaginatedQuery<
    { id: string; limit?: number; offset?: number },
    CommunityMembersResponse,
    CommunityMembersResponse["data"]["results"]
  >({
    queryHook: useGetCommunityMembersQuery,
    queryArg: { id: communityId },
    enabled: enabled && !!communityId,
    defaultLimit: DEFAULT_LIMIT,
    extractItems: (data) => data.data.results || [],
    extractTotal: (data) => data.data.total || 0,
    getHasMore: (data) => {
      const currentPage = data.data.page || 1
      const totalPages = data.data.pages || 1
      return currentPage < totalPages
    },
    resetDependency: communityId,
  })

  return {
    members: result.items,
    isLoading: result.isLoading,
    isFetchingMore: result.isFetchingMore,
    hasMore: result.hasMore,
    loadMore: result.loadMore,
    total: result.total,
  }
}
