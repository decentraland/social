import { useTheme } from 'decentraland-ui2'
import { getRandomRarityColor } from '../utils/getRandomRarityColor'
import { AttendeeAvatar } from './EventsList.styled'

type EventAttendeeProps = {
  src?: string
}

export const EventAttendee = ({ src }: EventAttendeeProps) => {
  const theme = useTheme()
  const backgroundColor = getRandomRarityColor(theme)

  return <AttendeeAvatar src={src} backgroundColor={backgroundColor} />
}
