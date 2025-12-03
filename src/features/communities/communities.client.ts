import {
  CommunityMembersResponse,
  CommunityResponse,
  CreateCommunityRequestResponse,
  JoinCommunityResponse,
  MemberRequestsResponse,
  RequestIntention,
  RequestStatus,
  RequestType,
  Role,
} from "./types"
import { client } from "../../services/client"

const communitiesApi = client.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityById: builder.query<
      CommunityResponse,
      { id: string; isSigned: boolean }
    >({
      query: ({ id }) => `/v1/communities/${id}`,
      serializeQueryArgs: ({ queryArgs }) => {
        const { id, isSigned } = queryArgs
        // Include auth state in cache key so signed/unsigned requests don't share cache
        return { id, isSigned }
      },
      providesTags: (
        result: CommunityResponse | undefined,
        _error: unknown,
        { id }: { id: string; isSigned: boolean }
      ) =>
        result
          ? [{ type: "Communities" as const, id }, "Communities"]
          : ["Communities"],
    }),
    getCommunityMembers: builder.query<
      CommunityMembersResponse,
      { id: string; limit?: number; offset?: number }
    >({
      query: ({ id, limit, offset }) => {
        const params = new URLSearchParams()
        if (limit) params.append("limit", limit.toString())
        if (offset) params.append("offset", offset.toString())
        const queryString = params.toString()
        return `/v1/communities/${id}/members${queryString ? `?${queryString}` : ""}`
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { id } = queryArgs
        return { id }
      },
      merge: (currentCache, newItems) => {
        if (newItems.data.results.length === 0) {
          return currentCache
        }
        return {
          ...newItems,
          data: {
            ...newItems.data,
            results: [
              ...(currentCache?.data?.results || []),
              ...newItems.data.results,
            ],
          },
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.offset !== previousArg?.offset ||
          currentArg?.limit !== previousArg?.limit
        )
      },
      providesTags: (
        result: CommunityMembersResponse | undefined,
        _error: unknown,
        { id }: { id: string }
      ) =>
        result
          ? [{ type: "Members" as const, id: `${id}-members` }, "Members"]
          : ["Members"],
    }),
    joinCommunity: builder.mutation<JoinCommunityResponse, string>({
      query: (id: string) => ({
        url: `/v1/communities/${id}/members`,
        method: "POST",
      }),
      async onQueryStarted(communityId, { dispatch, queryFulfilled }) {
        // Optimistically update the community to show user as member
        const patchResult = dispatch(
          communitiesApi.util.updateQueryData(
            "getCommunityById",
            communityId,
            (draft) => {
              if (draft?.data) {
                draft.data.role = Role.MEMBER
              }
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          // Revert the optimistic update on error
          patchResult.undo()
        }
      },
      invalidatesTags: (
        _result: JoinCommunityResponse | undefined,
        _error: unknown,
        id: string
      ) => [{ type: "Communities" as const, id }, "Communities"],
    }),
    createCommunityRequest: builder.mutation<
      CreateCommunityRequestResponse,
      { communityId: string; targetedAddress: string }
    >({
      query: ({ communityId, targetedAddress }) => ({
        url: `/v1/communities/${communityId}/requests`,
        method: "POST",
        body: {
          targetedAddress,
          type: RequestType.REQUEST_TO_JOIN,
        },
      }),
      async onQueryStarted(
        { communityId, targetedAddress },
        { dispatch, queryFulfilled, getState }
      ) {
        // Get community data from cache to create proper optimistic request
        const state = getState() as {
          client?: {
            queries?: Record<string, { data?: CommunityResponse }>
          }
        }
        const queryKey =
          communitiesApi.endpoints.getCommunityById.select(communityId)
        const queryState = queryKey(state as never)
        const community = queryState?.data?.data

        // Optimistically add a pending request to the member requests cache
        const patchResult = dispatch(
          communitiesApi.util.updateQueryData(
            "getMemberRequests",
            { address: targetedAddress, type: RequestType.REQUEST_TO_JOIN },
            (draft) => {
              if (draft?.data) {
                // Create an optimistic request with community data
                // MemberCommunityRequest extends Community (minus id) and adds id, communityId, type, status
                const optimisticRequest = {
                  ...(community || {}),
                  id: `temp-${Date.now()}`,
                  communityId,
                  type: RequestType.REQUEST_TO_JOIN,
                  status: RequestStatus.PENDING,
                } as (typeof draft.data.results)[0]
                draft.data.results = [optimisticRequest, ...draft.data.results]
                draft.data.total = (draft.data.total || 0) + 1
              }
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          // Revert the optimistic update on error
          patchResult.undo()
        }
      },
      invalidatesTags: (
        _result: CreateCommunityRequestResponse | undefined,
        _error: unknown,
        { communityId }: { communityId: string }
      ) => [
        { type: "Communities" as const, id: communityId },
        "Communities",
        "MemberRequests",
      ],
    }),
    cancelCommunityRequest: builder.mutation<
      void,
      { communityId: string; requestId: string; address?: string }
    >({
      query: ({ communityId, requestId }) => ({
        url: `/v1/communities/${communityId}/requests/${requestId}`,
        method: "PATCH",
        body: {
          intention: RequestIntention.CANCELLED,
        },
      }),
      async onQueryStarted(
        { requestId, address },
        { dispatch, queryFulfilled }
      ) {
        let patchResult: { undo: () => void } | null = null

        // Optimistically remove the request from cache if address is provided
        if (address) {
          patchResult = dispatch(
            communitiesApi.util.updateQueryData(
              "getMemberRequests",
              { address, type: RequestType.REQUEST_TO_JOIN },
              (draft) => {
                if (draft?.data) {
                  draft.data.results = draft.data.results.filter(
                    (request) => request.id !== requestId
                  )
                  draft.data.total = Math.max((draft.data.total || 0) - 1, 0)
                }
              }
            )
          )
        }

        try {
          await queryFulfilled
        } catch {
          // Revert the optimistic update on error
          if (patchResult) {
            patchResult.undo()
          }
        }
      },
      invalidatesTags: (
        _result: void | undefined,
        _error: unknown,
        { communityId }: { communityId: string }
      ) => [
        { type: "Communities" as const, id: communityId },
        "Communities",
        "MemberRequests",
      ],
    }),
    getMemberRequests: builder.query<
      MemberRequestsResponse,
      { address: string; type?: RequestType }
    >({
      query: ({ address, type }) => {
        const params = new URLSearchParams()
        if (type) params.append("type", type)
        const queryString = params.toString()
        return `/v1/members/${address}/requests${queryString ? `?${queryString}` : ""}`
      },
      providesTags: (
        result: MemberRequestsResponse | undefined,
        _error: unknown,
        { address }: { address: string }
      ) =>
        result
          ? [{ type: "MemberRequests" as const, id: address }, "MemberRequests"]
          : ["MemberRequests"],
    }),
  }),
})

const {
  useGetCommunityByIdQuery,
  useGetCommunityMembersQuery,
  useJoinCommunityMutation,
  useCreateCommunityRequestMutation,
  useCancelCommunityRequestMutation,
  useGetMemberRequestsQuery,
} = communitiesApi

export {
  communitiesApi,
  useGetCommunityByIdQuery,
  useGetCommunityMembersQuery,
  useJoinCommunityMutation,
  useCreateCommunityRequestMutation,
  useCancelCommunityRequestMutation,
  useGetMemberRequestsQuery,
}
