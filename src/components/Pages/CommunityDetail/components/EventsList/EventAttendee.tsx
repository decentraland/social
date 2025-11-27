import { AttendeeAvatar } from "./EventsList.styled"

type EventAttendeeProps = {
  src?: string
}

export const EventAttendee = ({ src }: EventAttendeeProps) => {
  return <AttendeeAvatar src={src} />
}
