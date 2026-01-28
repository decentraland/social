import { config } from '../../config'
import { client } from '../../services/client'
import { EventsResponse } from './types'

type EventsApiEvent = {
  id: string
  name: string
  approved: boolean
  rejected: boolean
  [key: string]: unknown
}

type EventsApiResponse = {
  ok: boolean
  data: {
    events: EventsApiEvent[]
    total: number
  }
}

const eventsApi = client.injectEndpoints({
  endpoints: builder => ({
    getCommunityEvents: builder.query<EventsResponse, { communityId: string; limit?: number; offset?: number }>({
      query: ({ communityId, limit, offset }) => {
        const params = new URLSearchParams()
        params.append('community_id', communityId)
        if (limit) params.append('limit', limit.toString())
        if (offset) params.append('offset', offset.toString())
        const queryString = params.toString()
        return {
          url: `/events?${queryString}`,
          baseUrl: config.get('EVENTS_API_URL')
        }
      },
      transformResponse: (response: EventsApiResponse): EventsResponse => {
        return {
          ...response,
          data: {
            ...response.data,
            events: response.data.events.map(event => {
              const {
                ['start_at']: startAt,
                ['finish_at']: finishAt,
                ['scene_name']: sceneName,
                ['total_attendees']: totalAttendees,
                ['latest_attendees']: latestAttendees,
                ...rest
              } = event
              return {
                ...rest,
                startAt: startAt as string,
                finishAt: finishAt as string,
                sceneName: sceneName as string | undefined,
                totalAttendees: totalAttendees as number,
                latestAttendees: latestAttendees as string[]
              }
            })
          }
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
            events: [...(currentCache?.data?.events || []), ...newItems.data.events],
            total: newItems.data.total
          }
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.offset !== previousArg?.offset || currentArg?.limit !== previousArg?.limit
      },
      providesTags: (result: EventsResponse | undefined, _error: unknown, { communityId }: { communityId: string }) =>
        result
          ? [
              ...result.data.events.map(event => ({
                type: 'Events' as const,
                id: event.id
              })),
              { type: 'Events' as const, id: `community-${communityId}` },
              'Events'
            ]
          : ['Events']
    })
  })
})

const { useGetCommunityEventsQuery } = eventsApi

export { eventsApi, useGetCommunityEventsQuery }
