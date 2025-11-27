import { EventAttendee } from "./EventAttendee"
import { AttendeesRow, ParticipantsExtra } from "./EventsList.styled"

type EventAttendeesProps = {
  eventId: string
  latestAttendees: string[]
  totalAttendees: number
  attendeePictures: Record<string, string>
}

export const EventAttendees = ({
  eventId,
  latestAttendees,
  totalAttendees,
  attendeePictures,
}: EventAttendeesProps) => {
  const visibleAttendees = latestAttendees.slice(0, 3)
  const remainingAttendees = Math.max(
    totalAttendees - visibleAttendees.length,
    0
  )

  if (visibleAttendees.length === 0 && remainingAttendees === 0) {
    return null
  }

  return (
    <AttendeesRow>
      {visibleAttendees.map((address, index) => {
        const normalizedAddress = address?.toLowerCase()
        const avatarUrl =
          normalizedAddress && attendeePictures[normalizedAddress]

        return <EventAttendee key={`${eventId}-${index}`} src={avatarUrl} />
      })}
      {remainingAttendees > 0 && (
        <ParticipantsExtra>+{remainingAttendees}</ParticipantsExtra>
      )}
    </AttendeesRow>
  )
}
