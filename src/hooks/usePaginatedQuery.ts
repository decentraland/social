import { useCallback, useEffect, useRef, useState } from 'react'

type PaginationState = {
  total: number
  count: number
}

type UsePaginatedQueryOptions<TQueryArg, TData, TItems extends unknown[]> = {
  queryHook: (
    arg: TQueryArg,
    options?: { skip?: boolean }
  ) => {
    data?: TData
    isLoading: boolean
    isFetching: boolean
  }
  queryArg: TQueryArg
  enabled?: boolean
  defaultLimit?: number
  extractItems: (data: TData) => TItems
  extractTotal: (data: TData) => number
  getHasMore: (data: TData, currentOffset?: number, limit?: number) => boolean
  resetDependency?: unknown
}

export const usePaginatedQuery = <TQueryArg extends { limit?: number; offset?: number }, TData, TItems extends unknown[]>({
  queryHook,
  queryArg,
  enabled = true,
  defaultLimit = 10,
  extractItems,
  extractTotal,
  getHasMore,
  resetDependency
}: UsePaginatedQueryOptions<TQueryArg, TData, TItems>) => {
  const [limit] = useState(defaultLimit)
  const [currentOffset, setCurrentOffset] = useState(0)
  const paginationRef = useRef<PaginationState | null>(null)
  const dataRef = useRef<TData | null>(null)
  const isFetchingRef = useRef<boolean>(false)
  const extractItemsRef = useRef(extractItems)
  const extractTotalRef = useRef(extractTotal)
  const getHasMoreRef = useRef(getHasMore)

  useEffect(() => {
    extractItemsRef.current = extractItems
    extractTotalRef.current = extractTotal
    getHasMoreRef.current = getHasMore
  })

  useEffect(() => {
    setCurrentOffset(0)
    paginationRef.current = null
    dataRef.current = null
  }, [resetDependency])

  const { data, isLoading, isFetching } = queryHook(
    {
      ...queryArg,
      limit,
      offset: currentOffset
    } as TQueryArg,
    {
      skip: !enabled
    }
  )

  useEffect(() => {
    if (data) {
      const total = extractTotalRef.current(data)
      const items = extractItemsRef.current(data)
      paginationRef.current = {
        total,
        count: items.length
      }
      dataRef.current = data
    }
    isFetchingRef.current = isFetching
  }, [data, isFetching])

  const total = data ? extractTotalRef.current(data) : 0
  const items = data ? extractItemsRef.current(data) : ([] as unknown as TItems)
  const hasMore = data ? getHasMoreRef.current(data, currentOffset, limit) : false

  const loadMore = useCallback(() => {
    const currentData = dataRef.current
    const pagination = paginationRef.current
    if (!currentData || isFetchingRef.current) {
      return
    }
    const canLoadMore = getHasMoreRef.current(currentData, currentOffset, limit)
    if (!canLoadMore) {
      return
    }
    setCurrentOffset(prev => {
      const nextOffset = prev + limit
      if (pagination && nextOffset >= pagination.total) {
        return prev
      }
      return nextOffset
    })
  }, [limit, currentOffset])

  return {
    items,
    isLoading: isLoading && currentOffset === 0,
    isFetchingMore: isFetching && currentOffset > 0,
    hasMore,
    loadMore,
    total
  }
}
