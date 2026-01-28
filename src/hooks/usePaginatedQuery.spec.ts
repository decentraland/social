import { act, renderHook, waitFor } from '@testing-library/react'
import { usePaginatedQuery } from './usePaginatedQuery'

type MockQueryArg = {
  limit?: number
  offset?: number
  testParam?: string
}

type MockData = {
  items: string[]
  total: number
}

type MockQueryHookResult = {
  data?: MockData
  isLoading: boolean
  isFetching: boolean
}

describe('when using the paginated query hook', () => {
  let mockQueryHook: jest.Mock<MockQueryHookResult, [MockQueryArg, { skip?: boolean }?]>
  let extractItems: jest.Mock<string[], [MockData]>
  let extractTotal: jest.Mock<number, [MockData]>
  let getHasMore: jest.Mock<boolean, [MockData, number?, number?]>

  beforeEach(() => {
    extractItems = jest.fn(data => data.items)
    extractTotal = jest.fn(data => data.total)
    getHasMore = jest.fn(data => {
      const currentCount = data.items.length
      return currentCount < data.total
    })

    mockQueryHook = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('and the query is disabled', () => {
    it('should skip the query', () => {
      mockQueryHook.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false
      })

      renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          enabled: false,
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(mockQueryHook).toHaveBeenCalledWith(
        expect.objectContaining({
          testParam: 'test',
          limit: 10,
          offset: 0
        }),
        { skip: true }
      )
    })
  })

  describe('and the query is enabled', () => {
    it('should call the query hook with default limit and offset', () => {
      mockQueryHook.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false
      })

      renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          enabled: true,
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(mockQueryHook).toHaveBeenCalledWith(
        expect.objectContaining({
          testParam: 'test',
          limit: 10,
          offset: 0
        }),
        { skip: false }
      )
    })

    it('should call the query hook with custom default limit', () => {
      mockQueryHook.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false
      })

      renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          enabled: true,
          defaultLimit: 20,
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(mockQueryHook).toHaveBeenCalledWith(
        expect.objectContaining({
          testParam: 'test',
          limit: 20,
          offset: 0
        }),
        { skip: false }
      )
    })
  })

  describe('and the query is loading', () => {
    it('should return isLoading as true when offset is 0', () => {
      mockQueryHook.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(result.current.isLoading).toBe(true)
      expect(result.current.isFetchingMore).toBe(false)
    })

    it('should return isFetchingMore as true when offset is greater than 0', () => {
      mockQueryHook.mockReturnValue({
        data: {
          items: ['item1', 'item2'],
          total: 5
        },
        isLoading: false,
        isFetching: true
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      mockQueryHook.mockReturnValue({
        data: {
          items: ['item1', 'item2', 'item3', 'item4'],
          total: 5
        },
        isLoading: false,
        isFetching: true
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('and the query returns data', () => {
    it('should extract items and total from the data', () => {
      const mockData: MockData = {
        items: ['item1', 'item2', 'item3'],
        total: 10
      }

      mockQueryHook.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: false
      })

      renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(extractItems).toHaveBeenCalledWith(mockData)
      expect(extractTotal).toHaveBeenCalledWith(mockData)
    })

    it('should return extracted items and total', () => {
      const mockData: MockData = {
        items: ['item1', 'item2', 'item3'],
        total: 10
      }

      mockQueryHook.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: false
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(result.current.items).toEqual(['item1', 'item2', 'item3'])
      expect(result.current.total).toBe(10)
    })

    it('should return empty array when data is undefined', () => {
      mockQueryHook.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(result.current.items).toEqual([])
      expect(result.current.total).toBe(0)
    })
  })

  describe('and checking if there is more data', () => {
    it('should call getHasMore with data, currentOffset, and limit', () => {
      const mockData: MockData = {
        items: ['item1', 'item2'],
        total: 10
      }

      mockQueryHook.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: false
      })

      renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          defaultLimit: 5,
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(getHasMore).toHaveBeenCalledWith(mockData, 0, 5)
    })

    it('should return hasMore as false when data is undefined', () => {
      mockQueryHook.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(result.current.hasMore).toBe(false)
    })
  })

  describe('and loading more data', () => {
    it('should not load more when data is undefined', () => {
      mockQueryHook.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      const initialOffset = mockQueryHook.mock.calls[0]?.[0]?.offset || 0

      act(() => {
        result.current.loadMore()
      })

      expect(mockQueryHook).toHaveBeenCalledTimes(1)
      const lastCall = mockQueryHook.mock.calls[mockQueryHook.mock.calls.length - 1]
      expect(lastCall[0]?.offset).toBe(initialOffset)
    })

    it('should not load more when isFetching is true', () => {
      const mockData: MockData = {
        items: ['item1', 'item2'],
        total: 10
      }

      mockQueryHook.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: true
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      const initialCallCount = mockQueryHook.mock.calls.length

      act(() => {
        result.current.loadMore()
      })

      expect(mockQueryHook.mock.calls.length).toBe(initialCallCount)
    })

    it('should not load more when hasMore is false', () => {
      getHasMore.mockReturnValue(false)

      const mockData: MockData = {
        items: ['item1', 'item2', 'item3', 'item4', 'item5'],
        total: 5
      }

      mockQueryHook.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: false
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      const initialCallCount = mockQueryHook.mock.calls.length

      act(() => {
        result.current.loadMore()
      })

      expect(mockQueryHook.mock.calls.length).toBe(initialCallCount)
    })

    it('should increment offset when loading more', async () => {
      const mockData: MockData = {
        items: ['item1', 'item2'],
        total: 10
      }

      mockQueryHook.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: false
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          defaultLimit: 2,
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      expect(mockQueryHook).toHaveBeenCalledWith(expect.objectContaining({ offset: 0 }), expect.any(Object))

      act(() => {
        result.current.loadMore()
      })

      await waitFor(() => {
        expect(mockQueryHook).toHaveBeenCalledWith(expect.objectContaining({ offset: 2 }), expect.any(Object))
      })
    })

    it('should not increment offset beyond total', async () => {
      const mockData: MockData = {
        items: ['item1', 'item2'],
        total: 3
      }

      mockQueryHook.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: false
      })

      const { result } = renderHook(() =>
        usePaginatedQuery({
          queryHook: mockQueryHook,
          queryArg: { testParam: 'test' },
          defaultLimit: 2,
          extractItems,
          extractTotal,
          getHasMore
        })
      )

      act(() => {
        result.current.loadMore()
      })

      await waitFor(() => {
        const lastCall = mockQueryHook.mock.calls[mockQueryHook.mock.calls.length - 1]
        expect(lastCall[0]?.offset).toBeLessThanOrEqual(3)
      })
    })
  })

  describe('and reset dependency changes', () => {
    it('should reset offset to 0 when resetDependency changes', () => {
      const mockData: MockData = {
        items: ['item1', 'item2'],
        total: 10
      }

      mockQueryHook.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: false
      })

      const { result, rerender } = renderHook(
        ({ resetDep }) =>
          usePaginatedQuery({
            queryHook: mockQueryHook,
            queryArg: { testParam: 'test' },
            extractItems,
            extractTotal,
            getHasMore,
            resetDependency: resetDep
          }),
        {
          initialProps: { resetDep: 'initial' }
        }
      )

      act(() => {
        result.current.loadMore()
      })

      rerender({ resetDep: 'changed' })

      expect(mockQueryHook).toHaveBeenCalledWith(expect.objectContaining({ offset: 0 }), expect.any(Object))
    })
  })
})
