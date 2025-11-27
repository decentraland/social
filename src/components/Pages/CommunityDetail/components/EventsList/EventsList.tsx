import { t } from "decentraland-dapps/dist/modules/translation/utils"
import { Box, CircularProgress } from "decentraland-ui2"
import { EmptyEventsIcon } from "./EmptyEventsIcon"
import { useInfiniteScroll } from "../../../../../hooks/useInfiniteScroll"
import { formatEventTime } from "../../../../../utils/dateFormat"
import {
  EmptyState,
  EmptyStateText,
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
  hideTitle?: boolean
}

export const EventsList = ({
  events,
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
  hideTitle = false,
}: EventsListProps) => {
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore,
  })

  if (isLoading) {
    return (
      <EventsSection>
        {!hideTitle && (
          <SectionTitle>{t("events.upcoming_events")}</SectionTitle>
        )}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          width="100%"
        >
          <CircularProgress />
        </Box>
      </EventsSection>
    )
  }

  return (
    <EventsSection>
      {!hideTitle && <SectionTitle>{t("events.upcoming_events")}</SectionTitle>}
      {events.length === 0 ? (
        <EmptyState>
          <EmptyEventsIcon />
          <EmptyStateText color="textPrimary">
            {t("events.no_upcoming_events")}
          </EmptyStateText>
        </EmptyState>
      ) : (
        <EventsGrid>
          {events.map((event) => (
            <EventCard key={event.id}>
              <EventImageContainer>
                <EventImage src={event.image} alt={event.name} />
                {event.isLive && (
                  <LiveBadgeContainer>
                    <LiveBadgeText>{t("events.live")}</LiveBadgeText>
                  </LiveBadgeContainer>
                )}
              </EventImageContainer>
              <EventContent>
                <EventTime data-testid={`event-time-${event.id}`}>
                  {formatEventTime(event.startTime)}
                </EventTime>
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
