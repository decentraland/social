import { Box, CircularProgress, Typography } from "decentraland-ui2"
import { useInfiniteScroll } from "../../../../../hooks/useInfiniteScroll"
import {
  EmptyState,
  EventCard,
  EventContent,
  EventImage,
  EventImageContainer,
  EventName,
  EventTime,
  EventsGrid,
  EventsSection,
  LiveBadgeContainer,
  LiveBadgeText,
  LoadMoreSentinel,
  SectionTitle,
} from "./EventsList.styled"

type Event = {
  id: string
  name: string
  image: string
  isLive: boolean
  startTime: string
}

type EventsListProps = {
  events: Event[]
  isLoading?: boolean
  isFetchingMore?: boolean
  hasMore?: boolean
  onLoadMore: () => void
}

export const EventsList = ({
  events,
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
}: EventsListProps) => {
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore,
  })

  if (isLoading) {
    return (
      <EventsSection>
        <SectionTitle>UPCOMING EVENTS</SectionTitle>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </EventsSection>
    )
  }

  return (
    <EventsSection>
      <SectionTitle>UPCOMING EVENTS</SectionTitle>
      {events.length === 0 ? (
        <EmptyState>
          <Typography variant="body2" color="textSecondary">
            No events found
          </Typography>
        </EmptyState>
      ) : (
        <EventsGrid>
          {events.map((event) => (
            <EventCard key={event.id}>
              <EventImageContainer>
                <EventImage src={event.image} alt={event.name} />
                {event.isLive && (
                  <LiveBadgeContainer>
                    <LiveBadgeText>live</LiveBadgeText>
                  </LiveBadgeContainer>
                )}
              </EventImageContainer>
              <EventContent>
                <EventTime>{event.startTime}</EventTime>
                <EventName>{event.name}</EventName>
              </EventContent>
            </EventCard>
          ))}
          {hasMore && (
            <LoadMoreSentinel ref={sentinelRef}>
              {isFetchingMore && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  padding={2}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </LoadMoreSentinel>
          )}
        </EventsGrid>
      )}
    </EventsSection>
  )
}
