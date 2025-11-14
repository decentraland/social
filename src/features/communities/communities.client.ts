import { AuthIdentity } from "@dcl/crypto"
import {
  CommunityMembersResponse,
  CommunityResponse,
  JoinCommunityResponse,
  LeaveCommunityResponse,
} from "./types"
import { client } from "../../services/client"

type JoinCommunityRequest = {
  id: string
  identity: AuthIdentity
}

type LeaveCommunityRequest = {
  id: string
  identity: AuthIdentity
}

const communitiesApi = client.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityById: builder.query<CommunityResponse, string>({
      query: (id: string) => `/v1/communities/${id}`,
      providesTags: (
        _result: CommunityResponse | undefined,
        _error: unknown,
        id: string
      ) => [{ type: "Community", id }],
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
        _result: CommunityMembersResponse | undefined,
        _error: unknown,
        { id }: { id: string }
      ) => [{ type: "Community", id: `${id}-members` }],
    }),
    joinCommunity: builder.mutation<
      JoinCommunityResponse,
      JoinCommunityRequest
    >({
      query: ({ id, identity }: JoinCommunityRequest) => ({
        url: `/v1/communities/${id}/join`,
        method: "POST",
        body: { identity },
      }),
      invalidatesTags: (
        _result: JoinCommunityResponse | undefined,
        _error: unknown,
        { id }: JoinCommunityRequest
      ) => [{ type: "Community", id }],
    }),
    leaveCommunity: builder.mutation<
      LeaveCommunityResponse,
      LeaveCommunityRequest
    >({
      query: ({ id, identity }: LeaveCommunityRequest) => ({
        url: `/v1/communities/${id}/leave`,
        method: "POST",
        body: { identity },
      }),
      invalidatesTags: (
        _result: LeaveCommunityResponse | undefined,
        _error: unknown,
        { id }: LeaveCommunityRequest
      ) => [{ type: "Community", id }],
    }),
  }),
})

const {
  useGetCommunityByIdQuery,
  useGetCommunityMembersQuery,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} = communitiesApi

export {
  communitiesApi,
  useGetCommunityByIdQuery,
  useGetCommunityMembersQuery,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
}
