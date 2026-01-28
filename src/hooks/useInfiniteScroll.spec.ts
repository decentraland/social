/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react'
import { act, render, renderHook } from '@testing-library/react'
import { useInfiniteScroll } from './useInfiniteScroll'

const createMockIntersectionObserverEntry = (isIntersecting: boolean, target: Element): IntersectionObserverEntry => ({
  boundingClientRect: {} as DOMRectReadOnly,
  intersectionRatio: isIntersecting ? 1 : 0,
  intersectionRect: {} as DOMRectReadOnly,
  isIntersecting,
  rootBounds: {} as DOMRectReadOnly,
  target,
  time: Date.now()
})

describe('when using the infinite scroll hook', () => {
  let mockObserver: jest.Mock
  let mockObserve: jest.Mock
  let mockUnobserve: jest.Mock
  let mockDisconnect: jest.Mock
  let onLoadMore: jest.Mock

  beforeEach(() => {
    onLoadMore = jest.fn()
    mockObserve = jest.fn()
    mockUnobserve = jest.fn()
    mockDisconnect = jest.fn()

    mockObserver = jest.fn(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect
    })) as unknown as jest.Mock

    global.IntersectionObserver = mockObserver as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('and the sentinel element is not available', () => {
    it('should not create an observer', () => {
      const { result } = renderHook(() =>
        useInfiniteScroll({
          hasMore: true,
          isLoading: false,
          onLoadMore
        })
      )

      expect(mockObserver).not.toHaveBeenCalled()
      expect(result.current.current).toBeNull()
    })
  })

  describe('and hasMore is false', () => {
    it('should not observe the sentinel element', () => {
      renderHook(() =>
        useInfiniteScroll({
          hasMore: false,
          isLoading: false,
          onLoadMore
        })
      )

      expect(mockObserver).not.toHaveBeenCalled()
    })
  })

  describe('and isLoading is true', () => {
    it('should not observe the sentinel element', () => {
      renderHook(() =>
        useInfiniteScroll({
          hasMore: true,
          isLoading: true,
          onLoadMore
        })
      )

      expect(mockObserver).not.toHaveBeenCalled()
    })
  })

  describe('and all conditions are met', () => {
    let sentinelElement: HTMLDivElement

    beforeEach(() => {
      sentinelElement = document.createElement('div')
      document.body.appendChild(sentinelElement)
      jest.clearAllMocks()
    })

    afterEach(() => {
      document.body.removeChild(sentinelElement)
    })

    it('should create an observer with default threshold and rootMargin', () => {
      const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
        const sentinelRef = useInfiniteScroll({
          hasMore,
          isLoading,
          onLoadMore
        })
        return React.createElement('div', {
          ref: sentinelRef,
          'data-testid': 'sentinel'
        })
      }

      render(React.createElement(TestComponent, { hasMore: true, isLoading: false }))

      expect(mockObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.1,
        rootMargin: '100px'
      })
    })

    it('should create an observer with custom threshold and rootMargin', () => {
      const customThreshold = 0.5
      const customRootMargin = '200px'

      const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
        const sentinelRef = useInfiniteScroll({
          hasMore,
          isLoading,
          onLoadMore,
          threshold: customThreshold,
          rootMargin: customRootMargin
        })
        return React.createElement('div', {
          ref: sentinelRef,
          'data-testid': 'sentinel'
        })
      }

      render(React.createElement(TestComponent, { hasMore: true, isLoading: false }))

      expect(mockObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: customThreshold,
        rootMargin: customRootMargin
      })
    })

    it('should observe the sentinel element', () => {
      const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
        const sentinelRef = useInfiniteScroll({
          hasMore,
          isLoading,
          onLoadMore
        })
        return React.createElement('div', {
          ref: sentinelRef,
          'data-testid': 'sentinel'
        })
      }

      const { container } = render(React.createElement(TestComponent, { hasMore: true, isLoading: false }))
      const sentinel = container.querySelector('[data-testid="sentinel"]')

      expect(mockObserve).toHaveBeenCalledWith(sentinel)
    })

    describe('and the sentinel element intersects', () => {
      it('should call onLoadMore when element is intersecting and hasMore is true and isLoading is false', () => {
        let observerCallback: (entries: IntersectionObserverEntry[]) => void

        mockObserver.mockImplementation(callback => {
          observerCallback = callback
          return {
            observe: mockObserve,
            unobserve: mockUnobserve,
            disconnect: mockDisconnect
          }
        })

        const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
          const sentinelRef = useInfiniteScroll({
            hasMore,
            isLoading,
            onLoadMore
          })
          return React.createElement('div', {
            ref: sentinelRef,
            'data-testid': 'sentinel'
          })
        }

        const { container } = render(
          React.createElement(TestComponent, {
            hasMore: true,
            isLoading: false
          })
        )
        const sentinel = container.querySelector('[data-testid="sentinel"]')

        const mockEntry = createMockIntersectionObserverEntry(true, sentinel!)

        act(() => {
          observerCallback!([mockEntry])
        })

        expect(onLoadMore).toHaveBeenCalledTimes(1)
      })

      it('should not call onLoadMore when element is intersecting but hasMore is false', () => {
        const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
          const sentinelRef = useInfiniteScroll({
            hasMore,
            isLoading,
            onLoadMore
          })
          return React.createElement('div', {
            ref: sentinelRef,
            'data-testid': 'sentinel'
          })
        }

        render(
          React.createElement(TestComponent, {
            hasMore: false,
            isLoading: false
          })
        )

        expect(mockObserver).not.toHaveBeenCalled()
        expect(onLoadMore).not.toHaveBeenCalled()
      })

      it('should not call onLoadMore when element is intersecting but isLoading is true', () => {
        const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
          const sentinelRef = useInfiniteScroll({
            hasMore,
            isLoading,
            onLoadMore
          })
          return React.createElement('div', {
            ref: sentinelRef,
            'data-testid': 'sentinel'
          })
        }

        render(React.createElement(TestComponent, { hasMore: true, isLoading: true }))

        expect(mockObserver).not.toHaveBeenCalled()
        expect(onLoadMore).not.toHaveBeenCalled()
      })

      it('should not call onLoadMore when element is not intersecting', () => {
        let observerCallback: (entries: IntersectionObserverEntry[]) => void

        mockObserver.mockImplementation(callback => {
          observerCallback = callback
          return {
            observe: mockObserve,
            unobserve: mockUnobserve,
            disconnect: mockDisconnect
          }
        })

        const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
          const sentinelRef = useInfiniteScroll({
            hasMore,
            isLoading,
            onLoadMore
          })
          return React.createElement('div', {
            ref: sentinelRef,
            'data-testid': 'sentinel'
          })
        }

        const { container } = render(
          React.createElement(TestComponent, {
            hasMore: true,
            isLoading: false
          })
        )
        const sentinel = container.querySelector('[data-testid="sentinel"]')

        const mockEntry = createMockIntersectionObserverEntry(false, sentinel!)

        act(() => {
          observerCallback!([mockEntry])
        })

        expect(onLoadMore).not.toHaveBeenCalled()
      })
    })
  })

  describe('and the hook is unmounted', () => {
    let sentinelElement: HTMLDivElement

    beforeEach(() => {
      sentinelElement = document.createElement('div')
      document.body.appendChild(sentinelElement)
    })

    afterEach(() => {
      document.body.removeChild(sentinelElement)
    })

    it('should unobserve the sentinel element', () => {
      const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
        const sentinelRef = useInfiniteScroll({
          hasMore,
          isLoading,
          onLoadMore
        })
        return React.createElement('div', {
          ref: sentinelRef,
          'data-testid': 'sentinel'
        })
      }

      const { container, unmount } = render(React.createElement(TestComponent, { hasMore: true, isLoading: false }))
      const sentinel = container.querySelector('[data-testid="sentinel"]')

      act(() => {
        unmount()
      })

      expect(mockUnobserve).toHaveBeenCalledWith(sentinel)
    })
  })

  describe('and dependencies change', () => {
    let sentinelElement: HTMLDivElement

    beforeEach(() => {
      sentinelElement = document.createElement('div')
      document.body.appendChild(sentinelElement)
    })

    afterEach(() => {
      document.body.removeChild(sentinelElement)
    })

    it('should recreate the observer when hasMore changes', () => {
      jest.clearAllMocks()

      const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
        const sentinelRef = useInfiniteScroll({
          hasMore,
          isLoading,
          onLoadMore
        })
        return React.createElement('div', {
          ref: sentinelRef,
          'data-testid': 'sentinel'
        })
      }

      const { rerender } = render(React.createElement(TestComponent, { hasMore: true, isLoading: false }))

      const initialObserveCalls = mockObserve.mock.calls.length
      expect(initialObserveCalls).toBeGreaterThan(0)

      act(() => {
        rerender(
          React.createElement(TestComponent, {
            hasMore: false,
            isLoading: false
          })
        )
      })

      act(() => {
        rerender(
          React.createElement(TestComponent, {
            hasMore: true,
            isLoading: false
          })
        )
      })

      expect(mockObserve.mock.calls.length).toBeGreaterThan(initialObserveCalls)
    })

    it('should recreate the observer when isLoading changes', () => {
      jest.clearAllMocks()

      const TestComponent = ({ hasMore, isLoading }: { hasMore: boolean; isLoading: boolean }) => {
        const sentinelRef = useInfiniteScroll({
          hasMore,
          isLoading,
          onLoadMore
        })
        return React.createElement('div', {
          ref: sentinelRef,
          'data-testid': 'sentinel'
        })
      }

      const { rerender } = render(React.createElement(TestComponent, { hasMore: true, isLoading: false }))

      const initialObserveCalls = mockObserve.mock.calls.length
      expect(initialObserveCalls).toBeGreaterThan(0)

      act(() => {
        rerender(React.createElement(TestComponent, { hasMore: true, isLoading: true }))
      })

      act(() => {
        rerender(
          React.createElement(TestComponent, {
            hasMore: true,
            isLoading: false
          })
        )
      })

      expect(mockObserve.mock.calls.length).toBeGreaterThan(initialObserveCalls)
    })
  })
})
