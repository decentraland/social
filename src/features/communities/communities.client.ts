import {
  CommunityMembersResponse,
  CommunityResponse,
  JoinCommunityResponse,
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
  }),
})

const {
  useGetCommunityByIdQuery,
  useGetCommunityMembersQuery,
  useJoinCommunityMutation,
} = communitiesApi

export {
  communitiesApi,
  useGetCommunityByIdQuery,
  useGetCommunityMembersQuery,
  useJoinCommunityMutation,
}
