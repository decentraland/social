import { Theme, useTheme } from '@mui/material/styles'
import { getRandomRarityColor } from '../utils/getRandomRarityColor'
import { AttendeeAvatar } from './EventsList.styled'

type EventAttendeeProps = {
  src?: string
}

export const EventAttendee = ({ src }: EventAttendeeProps) => {
  const theme = useTheme<Theme>()
  const backgroundColor = getRandomRarityColor(theme)

  return <AttendeeAvatar src={src} backgroundColor={backgroundColor} />
}
