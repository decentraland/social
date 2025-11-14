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
    }),
  }),
})

const { useGetCommunityEventsQuery } = eventsApi

export { eventsApi, useGetCommunityEventsQuery }
