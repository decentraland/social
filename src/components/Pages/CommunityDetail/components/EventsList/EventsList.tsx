import { useMemo } from "react"
import { t } from "decentraland-dapps/dist/modules/translation/utils"
import { Box, CircularProgress } from "decentraland-ui2"
import { EmptyEventsIcon } from "./EmptyEventsIcon"
import { EventItem } from "./EventItem"
import { useInfiniteScroll } from "../../../../../hooks/useInfiniteScroll"
import { useProfilePictures } from "../../../../../hooks/useProfilePictures"
import type { EventsListProps } from "./EventsList.types"
import {
  EmptyState,
  EmptyStateText,
  EventsGrid,
  EventsSection,
  LoadMoreSentinel,
  SectionTitle,
} from "./EventsList.styled"

export const EventsList = ({
  events,
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
  hideTitle = false,
}: EventsListProps) => {
  const attendeeAddresses = useMemo(
    () =>
      Array.from(
        new Set(
          events.flatMap((event) =>
            event.latestAttendees
              .slice(0, 3)
              .filter(Boolean)
              .map((address) => address.toLowerCase())
          )
        )
      ),
    [events]
  )

  const attendeePictures = useProfilePictures(attendeeAddresses)

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
            <EventItem
              key={event.id}
              event={event}
              attendeePictures={attendeePictures}
            />
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
