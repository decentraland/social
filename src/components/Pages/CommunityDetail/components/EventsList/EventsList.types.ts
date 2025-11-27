type Event = {
  id: string
  name: string
  image: string
  isLive: boolean
  startTime: string
  totalAttendees: number
  latestAttendees: string[]
}

type EventsListProps = {
  events: Event[]
  isLoading?: boolean
  isFetchingMore?: boolean
  hasMore?: boolean
  onLoadMore: () => void
  hideTitle?: boolean
}

export type { Event, EventsListProps }
