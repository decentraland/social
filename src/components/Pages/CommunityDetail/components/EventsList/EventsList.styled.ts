import { Avatar, Box, Typography, styled } from 'decentraland-ui2'

const EventsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'uppercase',
  color: theme.palette.common.white,
  paddingBottom: theme.spacing(3), // 24px
  borderBottom: `1px solid ${theme.palette.divider}`,
  lineHeight: 1,
  width: '100%'
}))

const EventsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(289px, 1fr))',
  gap: theme.spacing(1.5),
  width: '100%',
  maxHeight: '350px',
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollBehavior: 'smooth',
  paddingRight: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.action.hover,
    borderRadius: theme.spacing(0.5)
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: theme.spacing(0.5),
    '&:hover': {
      background: theme.palette.action.selected
    }
  },
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: '1fr',
    rowGap: theme.spacing(2.5)
  }
}))

const EventCard = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(2), // 16px
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.35)',
  padding: theme.spacing(1.5, 2, 3), // 12px 16px 24px
  [theme.breakpoints.down('xs')]: {
    width: '100%'
  }
}))

const EventImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
})

const EventImageContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '195px',
  borderRadius: '16px 16px 0 0',
  overflow: 'hidden',
  flexShrink: 0
}))

const EventImageOverlay = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.6) 100%)',
  zIndex: 1,
  pointerEvents: 'none'
}))

const EventInfoRow = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const TimeWithIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary
}))

const AttendeesRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  paddingRight: theme.spacing(0.75)
}))

const LiveBadgeContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.25),
  left: theme.spacing(1.25),
  zIndex: 2,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'uppercase'
}))

const EventContent = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '102px',
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.spacing(1)
}))

const EventTime = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.43,
  color: '#A09BA8',
  letterSpacing: '0px',
  fontFamily: theme.typography.fontFamily,
  'leading-trim': 'none'
}))

const EventName = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '1.6',
  color: '#FCFCFC',
  fontFamily: theme.typography.fontFamily
}))

const AttendeeAvatar = styled(Avatar, {
  shouldForwardProp: prop => prop !== 'backgroundColor'
})<{ backgroundColor?: string }>(({ backgroundColor, theme }) => ({
  width: '24.38px',
  height: '24.38px',
  borderRadius: '25.64px',
  border: '1.74px solid rgba(255, 255, 255, 0.5)',
  boxSizing: 'border-box',
  flexShrink: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: backgroundColor ?? theme.palette.secondary.main,
  '&:not(:first-of-type)': {
    marginLeft: '-8px'
  }
}))

const ParticipantsExtra = styled(Typography)(({ theme }) => ({
  width: '35px',
  height: '24px',
  fontSize: '13px',
  fontWeight: 700,
  lineHeight: 1.38,
  color: '#16141A',
  background: '#FCFCFC',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: theme.spacing(-0.75),
  position: 'relative',
  zIndex: 2
}))

const LoadMoreSentinel = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: theme.spacing(2.5),
  flex: '0 0 100%'
}))

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  width: '100%',
  gridColumn: '1 / -1',
  gap: theme.spacing(2)
}))

const EmptyStateText = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  fontStyle: 'normal',
  fontSize: '18px',
  lineHeight: '100%',
  letterSpacing: '0%',
  textAlign: 'center',
  verticalAlign: 'middle',
  color: theme.palette.text.primary,
  'leading-trim': 'none'
}))

export {
  EmptyState,
  EmptyStateText,
  EventCard,
  EventContent,
  EventImage,
  EventImageContainer,
  EventName,
  EventsGrid,
  EventsSection,
  EventTime,
  LoadMoreSentinel,
  LiveBadgeContainer,
  SectionTitle,
  EventImageOverlay,
  EventInfoRow,
  TimeWithIcon,
  AttendeesRow,
  AttendeeAvatar,
  ParticipantsExtra
}
