import { Box, Typography, styled } from "decentraland-ui2"

const EventsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "uppercase",
  color: theme.palette.common.white,
  paddingBottom: theme.spacing(3), // 24px
  borderBottom: `1px solid ${theme.palette.divider}`,
  lineHeight: 1,
  width: "100%",
}))

const EventsGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.125), // 9px
  alignItems: "stretch",
  flexWrap: "wrap",
  rowGap: theme.spacing(2.5), // 20px
  width: "100%",
  maxHeight: "600px",
  overflowY: "auto",
  overflowX: "hidden",
  scrollBehavior: "smooth",
  paddingRight: theme.spacing(1),
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.action.hover,
    borderRadius: theme.spacing(0.5),
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.divider,
    borderRadius: theme.spacing(0.5),
    "&:hover": {
      background: theme.palette.action.selected,
    },
  },
  [theme.breakpoints.down("xs")]: {
    flexDirection: "column",
    flexWrap: "nowrap",
    rowGap: theme.spacing(2.5),
  },
}))

const EventCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1.75), // 14px
  flex: "0 0 calc((100% - 9px) / 2)",
  minWidth: "424px",
  height: "126px",
  borderRadius: theme.spacing(1.5), // 12px
  cursor: "pointer",
  position: "relative",
  overflow: "visible",
  [theme.breakpoints.down("xs")]: {
    width: "100%",
    flex: "none",
    minWidth: "100%",
  },
}))

const EventImage = styled("img")(({ theme }) => ({
  width: "180px",
  height: "126px",
  objectFit: "cover",
  borderRadius: theme.spacing(1.25), // 10px
  backgroundColor: theme.palette.background.default,
  flexShrink: 0,
}))

const EventImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "180px",
  height: "126px",
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: theme.spacing(1.25), // 10px
}))

const LiveBadgeContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1.25), // 10px
  left: theme.spacing(1.25), // 10px
  zIndex: 1,
}))

const LiveBadgeText = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75), // 6px
  height: "28px",
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 1, 0.5, 0.75), // 4px 8px 4px 6px
  borderRadius: theme.spacing(1), // 8px
  fontSize: "14px",
  fontWeight: 600,
  textTransform: "uppercase",
  lineHeight: "normal",
  fontFamily: theme.typography.fontFamily,
}))

const EventContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "2px",
  width: "230px",
  minWidth: "230px",
  height: "126px",
  flexShrink: 0,
}))

const EventTime = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "normal",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  fontFamily: theme.typography.fontFamily,
}))

const EventName = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "normal",
  color: theme.palette.common.white,
  whiteSpace: "pre-wrap",
  fontFamily: theme.typography.fontFamily,
}))

const LoadMoreSentinel = styled(Box)(() => ({
  width: "100%",
  minHeight: "20px",
  flex: "0 0 100%",
}))

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  width: "100%",
  gridColumn: "1 / -1",
  gap: theme.spacing(2),
}))

const EmptyStateText = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  fontStyle: "normal",
  fontSize: "18px",
  lineHeight: "100%",
  letterSpacing: "0%",
  textAlign: "center",
  verticalAlign: "middle",
  color: theme.palette.text.primary,
  "leading-trim": "none",
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
  LiveBadgeText,
  SectionTitle,
}
