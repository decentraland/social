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
  paddingBottom: "24px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  lineHeight: 1,
  width: "100%",
}))

const EventsGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "9px",
  alignItems: "stretch",
  flexWrap: "wrap",
  rowGap: "20px",
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
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: "4px",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.4)",
    },
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    flexWrap: "nowrap",
  },
}))

const EventCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  flex: "0 0 calc((100% - 18px) / 3)",
  minWidth: "424px",
  height: "126px",
  borderRadius: "12px",
  cursor: "pointer",
  position: "relative",
  overflow: "visible",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    flex: "none",
    minWidth: "100%",
  },
}))

const EventImage = styled("img")(({ theme }) => ({
  width: "180px",
  height: "126px",
  objectFit: "cover",
  borderRadius: "10px",
  backgroundColor: theme.palette.background.default,
  flexShrink: 0,
}))

const EventImageContainer = styled(Box)(() => ({
  position: "relative",
  width: "180px",
  height: "126px",
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: "10px",
}))

const LiveBadgeContainer = styled(Box)(() => ({
  position: "absolute",
  top: "10px",
  left: "10px",
  zIndex: 1,
}))

const LiveBadgeText = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  height: "28px",
  backgroundColor: "#e00000",
  color: "#fcfcfc",
  padding: "4px 8px 4px 6px",
  borderRadius: "8px",
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
  color: "rgba(255, 255, 255, 0.7)",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  fontFamily: theme.typography.fontFamily,
}))

const EventName = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "normal",
  color: "#fcfcfc",
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

const EmptyStateText = styled(Typography)(() => ({
  fontFamily: "Inter",
  fontWeight: 600,
  fontSize: "18px",
  lineHeight: "100%",
  letterSpacing: "0%",
  textAlign: "center",
  verticalAlign: "middle",
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
