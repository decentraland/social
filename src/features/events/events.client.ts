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
      transformResponse: (response: {
        ok: boolean
        data: {
          events: Array<{
            id: string
            name: string
            start_at: string
            finish_at: string
            scene_name?: string
            approved: boolean
            rejected: boolean
            total_attendees: number
            latest_attendees: string[]
            [key: string]: unknown
          }>
          total: number
        }
      }): EventsResponse => {
        return {
          ...response,
          data: {
            ...response.data,
            events: response.data.events.map((event) => {
              const {
                start_at,
                finish_at,
                scene_name,
                total_attendees,
                latest_attendees,
                ...rest
              } = event
              return {
                ...rest,
                startAt: start_at,
                finishAt: finish_at,
                sceneName: scene_name,
                totalAttendees: total_attendees,
                latestAttendees: latest_attendees,
              }
            }),
          },
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
      providesTags: (
        result: EventsResponse | undefined,
        _error: unknown,
        { communityId }: { communityId: string }
      ) =>
        result
          ? [
              ...result.data.events.map((event) => ({
                type: "Events" as const,
                id: event.id,
              })),
              { type: "Events" as const, id: `community-${communityId}` },
              "Events",
            ]
          : ["Events"],
    }),
  }),
})

const { useGetCommunityEventsQuery } = eventsApi

export { eventsApi, useGetCommunityEventsQuery }
