import { Box, styled } from "decentraland-ui2"

const PageContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "100vh",
  alignItems: "flex-start",
  background:
    "radial-gradient(103.89% 95.21% at 95.21% 9.85%, #7434B1 0%, #481C6C 37.11%, #2B1040 100%)",
}))

const ContentContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
}))

const BottomSection = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "60px",
  paddingTop: "48px",
  paddingBottom: "10px",
  paddingLeft: "120px",
  paddingRight: "120px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: theme.spacing(4),
    gap: theme.spacing(6),
    paddingBottom: theme.spacing(4),
  },
}))

const BottomSectionColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  minWidth: 0,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    flex: "none",
  },
}))

const MembersColumn = styled(BottomSectionColumn)(() => ({
  flex: "1 0 0",
}))

const EventsColumn = styled(BottomSectionColumn)(() => ({
  flex: "2 0 0",
}))

export {
  BottomSection,
  BottomSectionColumn,
  ContentContainer,
  EventsColumn,
  MembersColumn,
  PageContainer,
}
