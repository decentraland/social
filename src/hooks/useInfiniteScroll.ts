import { useEffect, useRef } from 'react'

type UseInfiniteScrollOptions = {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  threshold?: number
  rootMargin?: string
}

export const useInfiniteScroll = ({ hasMore, isLoading, onLoadMore, threshold = 0.1, rootMargin = '100px' }: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isLoading) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(sentinel)

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin])

  return sentinelRef
}
