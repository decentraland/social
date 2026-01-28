import { renderHook } from '@testing-library/react'
import { useGetCommunityEventsQuery } from '../features/events/events.client'
import type { Event, EventsResponse } from '../features/events/types'
import { usePaginatedCommunityEvents } from './usePaginatedCommunityEvents'

jest.mock('../features/events/events.client', () => ({
  useGetCommunityEventsQuery: jest.fn()
}))

const mockUseGetCommunityEventsQuery = useGetCommunityEventsQuery as jest.MockedFunction<typeof useGetCommunityEventsQuery>

const createEvent = (overrides: Partial<Event> = {}): Event => ({
  id: 'event-1',
  name: 'Event 1',
  startAt: '2024-01-01',
  finishAt: '2024-01-02',
  approved: true,
  rejected: false,
  totalAttendees: 0,
  latestAttendees: [],
  ...overrides
})

describe('when using the paginated community events hook', () => {
  let mockEventsResponse: EventsResponse

  beforeEach(() => {
    mockEventsResponse = {
      ok: true,
      data: {
        events: [],
        total: 0
      }
    }

    mockUseGetCommunityEventsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      refetch: jest.fn()
    } as ReturnType<typeof useGetCommunityEventsQuery>)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('and the query is disabled', () => {
    it('should skip the query when enabled is false', () => {
      renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id',
          enabled: false
        })
      )

      expect(mockUseGetCommunityEventsQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          communityId: 'test-community-id',
          limit: 12,
          offset: 0
        }),
        { skip: true }
      )
    })

    it('should skip the query when communityId is empty', () => {
      renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: '',
          enabled: true
        })
      )

      expect(mockUseGetCommunityEventsQuery).toHaveBeenCalledWith(expect.any(Object), { skip: true })
    })
  })

  describe('and the query is enabled', () => {
    it('should call the query hook with communityId and default limit', () => {
      renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id',
          enabled: true
        })
      )

      expect(mockUseGetCommunityEventsQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          communityId: 'test-community-id',
          limit: 12,
          offset: 0
        }),
        { skip: false }
      )
    })
  })

  describe('and the query returns data', () => {
    it('should return events from the response', () => {
      mockEventsResponse = {
        ok: true,
        data: {
          events: [
            createEvent({ id: 'event-1', name: 'Event 1' }),
            createEvent({
              id: 'event-2',
              name: 'Event 2',
              startAt: '2024-01-03',
              finishAt: '2024-01-04'
            })
          ],
          total: 10
        }
      }

      mockUseGetCommunityEventsQuery.mockReturnValue({
        data: mockEventsResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityEventsQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.events).toEqual(mockEventsResponse.data.events)
      expect(result.current.total).toBe(10)
    })

    it('should return empty array when events are undefined', () => {
      mockEventsResponse = {
        ok: true,
        data: {
          events: undefined as unknown as [],
          total: 0
        }
      }

      mockUseGetCommunityEventsQuery.mockReturnValue({
        data: mockEventsResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityEventsQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.events).toEqual([])
    })

    it('should return 0 total when total is undefined', () => {
      mockEventsResponse = {
        ok: true,
        data: {
          events: [],
          total: undefined as unknown as number
        }
      }

      mockUseGetCommunityEventsQuery.mockReturnValue({
        data: mockEventsResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityEventsQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.total).toBe(0)
    })
  })

  describe('and checking if there is more data', () => {
    it('should return hasMore as true when current count is less than total', () => {
      mockEventsResponse = {
        ok: true,
        data: {
          events: [createEvent({ id: 'event-1', name: 'Event 1' })],
          total: 10
        }
      }

      mockUseGetCommunityEventsQuery.mockReturnValue({
        data: mockEventsResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityEventsQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.hasMore).toBe(true)
    })

    it('should return hasMore as false when current count equals total', () => {
      mockEventsResponse = {
        ok: true,
        data: {
          events: [
            createEvent({ id: 'event-1', name: 'Event 1' }),
            createEvent({
              id: 'event-2',
              name: 'Event 2',
              startAt: '2024-01-03',
              finishAt: '2024-01-04'
            })
          ],
          total: 2
        }
      }

      mockUseGetCommunityEventsQuery.mockReturnValue({
        data: mockEventsResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityEventsQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.hasMore).toBe(false)
    })

    it('should return hasMore as true when events are undefined but total is greater than 0', () => {
      mockEventsResponse = {
        ok: true,
        data: {
          events: undefined as unknown as [],
          total: 10
        }
      }

      mockUseGetCommunityEventsQuery.mockReturnValue({
        data: mockEventsResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityEventsQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.hasMore).toBe(true)
    })
  })

  describe('and the query is loading', () => {
    it('should return isLoading as true when offset is 0', () => {
      mockUseGetCommunityEventsQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityEventsQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.isLoading).toBe(true)
      expect(result.current.isFetchingMore).toBe(false)
    })

    it('should return isFetchingMore as true when fetching more data', () => {
      mockEventsResponse = {
        ok: true,
        data: {
          events: [createEvent({ id: 'event-1', name: 'Event 1' })],
          total: 10
        }
      }

      mockUseGetCommunityEventsQuery.mockReturnValue({
        data: mockEventsResponse,
        isLoading: false,
        isFetching: true,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityEventsQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityEvents({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('and reset dependency changes', () => {
    it('should reset offset when communityId changes', () => {
      const { rerender } = renderHook(
        ({ communityId }: { communityId: string }) =>
          usePaginatedCommunityEvents({
            communityId
          }),
        {
          initialProps: { communityId: 'community-1' }
        }
      )

      expect(mockUseGetCommunityEventsQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          communityId: 'community-1',
          offset: 0
        }),
        expect.any(Object)
      )

      rerender({ communityId: 'community-2' })

      expect(mockUseGetCommunityEventsQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          communityId: 'community-2',
          offset: 0
        }),
        expect.any(Object)
      )
    })
  })
})
