import { renderHook } from '@testing-library/react'
import { useGetCommunityMembersQuery } from '../features/communities/communities.client'
import { CommunityMembersResponse, Role } from '../features/communities/types'
import { usePaginatedCommunityMembers } from './usePaginatedCommunityMembers'

jest.mock('../features/communities/communities.client', () => ({
  useGetCommunityMembersQuery: jest.fn()
}))

const mockUseGetCommunityMembersQuery = useGetCommunityMembersQuery as jest.MockedFunction<typeof useGetCommunityMembersQuery>

describe('when using the paginated community members hook', () => {
  let mockMembersResponse: CommunityMembersResponse

  beforeEach(() => {
    mockMembersResponse = {
      data: {
        results: [],
        total: 0,
        page: 1,
        pages: 1,
        limit: 10
      }
    }

    mockUseGetCommunityMembersQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      refetch: jest.fn()
    } as ReturnType<typeof useGetCommunityMembersQuery>)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('and the query is disabled', () => {
    it('should skip the query when enabled is false', () => {
      renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id',
          enabled: false
        })
      )

      expect(mockUseGetCommunityMembersQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-community-id',
          limit: 10,
          offset: 0
        }),
        { skip: true }
      )
    })

    it('should skip the query when communityId is empty', () => {
      renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: '',
          enabled: true
        })
      )

      expect(mockUseGetCommunityMembersQuery).toHaveBeenCalledWith(expect.any(Object), { skip: true })
    })
  })

  describe('and the query is enabled', () => {
    it('should call the query hook with id and default limit', () => {
      renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id',
          enabled: true
        })
      )

      expect(mockUseGetCommunityMembersQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-community-id',
          limit: 10,
          offset: 0
        }),
        { skip: false }
      )
    })
  })

  describe('and the query returns data', () => {
    it('should return members from the response', () => {
      mockMembersResponse = {
        data: {
          results: [
            {
              communityId: 'test-community-id',
              memberAddress: '0x123',
              role: Role.MEMBER,
              joinedAt: '2024-01-01'
            },
            {
              communityId: 'test-community-id',
              memberAddress: '0x456',
              role: Role.MODERATOR,
              joinedAt: '2024-01-02'
            }
          ],
          total: 10,
          page: 1,
          pages: 2,
          limit: 10
        }
      }

      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: mockMembersResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.members).toEqual(mockMembersResponse.data.results)
      expect(result.current.total).toBe(10)
    })

    it('should return empty array when results are undefined', () => {
      mockMembersResponse = {
        data: {
          results: undefined as unknown as [],
          total: 0,
          page: 1,
          pages: 1,
          limit: 10
        }
      }

      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: mockMembersResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.members).toEqual([])
    })

    it('should return 0 total when total is undefined', () => {
      mockMembersResponse = {
        data: {
          results: [],
          total: undefined as unknown as number,
          page: 1,
          pages: 1,
          limit: 10
        }
      }

      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: mockMembersResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.total).toBe(0)
    })
  })

  describe('and checking if there is more data', () => {
    it('should return hasMore as true when current page is less than total pages', () => {
      mockMembersResponse = {
        data: {
          results: [
            {
              communityId: 'test-community-id',
              memberAddress: '0x123',
              role: Role.MEMBER,
              joinedAt: '2024-01-01'
            }
          ],
          total: 10,
          page: 1,
          pages: 2,
          limit: 10
        }
      }

      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: mockMembersResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.hasMore).toBe(true)
    })

    it('should return hasMore as false when current page equals total pages', () => {
      mockMembersResponse = {
        data: {
          results: [
            {
              communityId: 'test-community-id',
              memberAddress: '0x123',
              role: Role.MEMBER,
              joinedAt: '2024-01-01'
            }
          ],
          total: 10,
          page: 2,
          pages: 2,
          limit: 10
        }
      }

      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: mockMembersResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.hasMore).toBe(false)
    })

    it('should return hasMore as true when page is undefined but pages is greater than default page', () => {
      mockMembersResponse = {
        data: {
          results: [],
          total: 10,
          page: undefined as unknown as number,
          pages: 2,
          limit: 10
        }
      }

      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: mockMembersResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.hasMore).toBe(true)
    })

    it('should return hasMore as false when pages is undefined', () => {
      mockMembersResponse = {
        data: {
          results: [],
          total: 10,
          page: 1,
          pages: undefined as unknown as number,
          limit: 10
        }
      }

      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: mockMembersResponse,
        isLoading: false,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.hasMore).toBe(false)
    })
  })

  describe('and the query is loading', () => {
    it('should return isLoading as true when offset is 0', () => {
      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
          communityId: 'test-community-id'
        })
      )

      expect(result.current.isLoading).toBe(true)
      expect(result.current.isFetchingMore).toBe(false)
    })

    it('should return isFetchingMore as true when fetching more data', () => {
      mockMembersResponse = {
        data: {
          results: [
            {
              communityId: 'test-community-id',
              memberAddress: '0x123',
              role: Role.MEMBER,
              joinedAt: '2024-01-01'
            }
          ],
          total: 10,
          page: 1,
          pages: 2,
          limit: 10
        }
      }

      mockUseGetCommunityMembersQuery.mockReturnValue({
        data: mockMembersResponse,
        isLoading: false,
        isFetching: true,
        refetch: jest.fn()
      } as ReturnType<typeof useGetCommunityMembersQuery>)

      const { result } = renderHook(() =>
        usePaginatedCommunityMembers({
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
          usePaginatedCommunityMembers({
            communityId
          }),
        {
          initialProps: { communityId: 'community-1' }
        }
      )

      expect(mockUseGetCommunityMembersQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'community-1',
          offset: 0
        }),
        expect.any(Object)
      )

      rerender({ communityId: 'community-2' })

      expect(mockUseGetCommunityMembersQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'community-2',
          offset: 0
        }),
        expect.any(Object)
      )
    })
  })
})
