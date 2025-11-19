import {
  CommunityMembersResponse,
  CommunityResponse,
  CreateCommunityRequestResponse,
  JoinCommunityResponse,
  MemberRequestsResponse,
  RequestIntention,
  RequestType,
} from "./types"
import { client } from "../../services/client"

const communitiesApi = client.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityById: builder.query<CommunityResponse, string>({
      query: (id: string) => `/v1/communities/${id}`,
      providesTags: (
        result: CommunityResponse | undefined,
        _error: unknown,
        id: string
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
        url: `/v1/communities/${id}/join`,
        method: "POST",
      }),
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
      { communityId: string; requestId: string }
    >({
      query: ({ communityId, requestId }) => ({
        url: `/v1/communities/${communityId}/requests/${requestId}`,
        method: "PATCH",
        body: {
          intention: RequestIntention.CANCELLED,
        },
      }),
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
