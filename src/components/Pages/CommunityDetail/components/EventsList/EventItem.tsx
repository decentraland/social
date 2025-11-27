import { t } from "decentraland-dapps/dist/modules/translation/utils"
import { Icon, muiIcons } from "decentraland-ui2"
import { EventAttendees } from "./EventAttendees"
import { formatEventTime } from "../../../../../utils/dateFormat"
import type { Event } from "./EventsList.types"
import {
  EventCard,
  EventContent,
  EventImage,
  EventImageContainer,
  EventImageOverlay,
  EventInfoRow,
  EventName,
  EventTime,
  LiveBadgeContainer,
  TimeWithIcon,
} from "./EventsList.styled"

type EventItemProps = {
  event: Event
  attendeePictures: Record<string, string>
}

export const EventItem = ({ event, attendeePictures }: EventItemProps) => {
  const hasVisibleAvatars = event.totalAttendees > 0

  return (
    <EventCard>
      <EventImageContainer>
        <EventImage src={event.image} alt={event.name} />
        <EventImageOverlay />
        {event.isLive && (
          <LiveBadgeContainer>{t("events.live")}</LiveBadgeContainer>
        )}
      </EventImageContainer>
      <EventContent>
        <EventInfoRow>
          <TimeWithIcon>
            <Icon component={muiIcons.AccessTime} fontSize="small" />
            <EventTime data-testid={`event-time-${event.id}`}>
              {formatEventTime(event.startTime)}
            </EventTime>
          </TimeWithIcon>
          {hasVisibleAvatars && (
            <EventAttendees
              eventId={event.id}
              latestAttendees={event.latestAttendees}
              totalAttendees={event.totalAttendees}
              attendeePictures={attendeePictures}
            />
          )}
        </EventInfoRow>
        <EventName>{event.name}</EventName>
      </EventContent>
    </EventCard>
  )
}
