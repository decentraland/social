import { format, formatDistanceToNow } from 'date-fns'

export const formatEventTime = (dateString: string): string => {
  const eventDate = new Date(dateString)
  const now = new Date()

  if (eventDate < now) {
    const distance = formatDistanceToNow(eventDate, { addSuffix: true })
    return `Started ${distance}`
  }

  const dayOfWeek = format(eventDate, 'EEE')
  const month = format(eventDate, 'MMM').toUpperCase()
  const day = format(eventDate, 'd')
  const time = format(eventDate, 'h:mmaaa')
  return `${dayOfWeek}, ${month} ${day} @ ${time}`
}
