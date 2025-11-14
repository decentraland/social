import {
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
}

export const EventsList = ({ events }: EventsListProps) => {
  return (
    <EventsSection>
      <SectionTitle>UPCOMING EVENTS</SectionTitle>
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
      </EventsGrid>
    </EventsSection>
  )
}
