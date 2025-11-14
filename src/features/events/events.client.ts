import { EventsResponse } from "./types"
import { config } from "../../config"
import { client } from "../../services/client"

const eventsApi = client.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityEvents: builder.query<
      EventsResponse,
      { communityId: string; limit?: number; offset?: number }
    >({
      query: ({ communityId, limit, offset }) => {
        const params = new URLSearchParams()
        params.append("community_id", communityId)
        if (limit) params.append("limit", limit.toString())
        if (offset) params.append("offset", offset.toString())
        const queryString = params.toString()
        return {
          url: `/events?${queryString}`,
          baseUrl: config.get("EVENTS_API_URL"),
        }
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { communityId } = queryArgs
        return { communityId }
      },
      merge: (currentCache, newItems) => {
        if (newItems.data.events.length === 0) {
          return currentCache
        }
        return {
          ...newItems,
          data: {
            ...newItems.data,
            events: [
              ...(currentCache?.data?.events || []),
              ...newItems.data.events,
            ],
            total: newItems.data.total,
          },
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.offset !== previousArg?.offset ||
          currentArg?.limit !== previousArg?.limit
        )
      },
    }),
  }),
})

const { useGetCommunityEventsQuery } = eventsApi

export { eventsApi, useGetCommunityEventsQuery }
