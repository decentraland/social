import { Box, Typography, styled } from "decentraland-ui2"

const EventsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(3),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: 600,
  textTransform: "uppercase",
  color: theme.palette.common.white,
  paddingBottom: theme.spacing(6),
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  lineHeight: 1,
  width: "100%",
}))

const EventsGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2.25),
  alignItems: "stretch",
  flexWrap: "wrap",
  rowGap: theme.spacing(5),
  width: "100%",
  maxHeight: "600px",
  overflowY: "auto",
  overflowX: "hidden",
  scrollBehavior: "smooth",
  paddingRight: theme.spacing(1),
  "&::-webkit-scrollbar": {
    width: theme.spacing(2),
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: theme.spacing(1),
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: theme.spacing(1),
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
  gap: theme.spacing(3.5),
  flex: "0 0 calc((100% - 18px) / 3)",
  minWidth: "424px",
  height: "126px",
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  position: "relative",
  overflow: "visible",
  transition: theme.transitions.create(["transform", "opacity"]),
  "&:hover": {
    transform: "translateY(-2px)",
    opacity: 0.9,
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  "&:active": {
    transform: "translateY(0)",
  },
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
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  flexShrink: 0,
}))

const EventImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "180px",
  height: "126px",
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
}))

const LiveBadgeContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2.5),
  left: theme.spacing(2.5),
  zIndex: 1,
}))

const LiveBadgeText = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  height: theme.spacing(7),
  backgroundColor: theme.palette.error.dark,
  color: theme.palette.common.white,
  padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(1.5)}`,
  borderRadius: theme.shape.borderRadius,
  ...theme.typography.caption,
  fontWeight: 600,
  textTransform: "uppercase",
  lineHeight: "normal",
}))

const EventContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
  width: "230px",
  minWidth: "230px",
  height: "126px",
  flexShrink: 0,
}))

const EventTime = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: 600,
  lineHeight: "normal",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
}))

const EventName = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: 600,
  lineHeight: "normal",
  color: theme.palette.common.white,
  whiteSpace: "pre-wrap",
}))

const LoadMoreSentinel = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: theme.spacing(5),
  flex: "0 0 100%",
}))

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  width: "100%",
  gridColumn: "1 / -1",
}))

export {
  EmptyState,
  EventCard,
  EventContent,
  EventImage,
  EventImageContainer,
  EventName,
  EventsGrid,
  EventsSection,
  EventTime,
  LiveBadgeContainer,
  LiveBadgeText,
  LoadMoreSentinel,
  SectionTitle,
}
