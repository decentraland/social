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
  gap: theme.spacing(7.5), // 60px
  paddingTop: theme.spacing(6), // 48px
  paddingBottom: theme.spacing(1.25), // 10px
  paddingLeft: theme.spacing(30), // 240px
  paddingRight: theme.spacing(30), // 240px
  [theme.breakpoints.between("lg", "xl")]: {
    paddingLeft: theme.spacing(10), // 80px
    paddingRight: theme.spacing(10), // 80px
  },
  [theme.breakpoints.between("md", "lg")]: {
    paddingLeft: theme.spacing(3), // 24px
    paddingRight: theme.spacing(3), // 24px
  },
  [theme.breakpoints.down("md")]: {
    paddingLeft: theme.spacing(3), // 24px
    paddingRight: theme.spacing(3), // 24px
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(6),
  },
  [theme.breakpoints.down("xs")]: {
    paddingLeft: theme.spacing(2), // 16px
    paddingRight: theme.spacing(2), // 16px
    gap: theme.spacing(4), // 32px
  },
}))

const BottomSectionColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5), // 12px
  minWidth: 0,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    flex: "none",
  },
}))

const MembersColumn = styled(BottomSectionColumn)(({ theme }) => ({
  flex: "0 0 320px",
  maxWidth: "320px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}))

const EventsColumn = styled(BottomSectionColumn)(() => ({
  flex: "2 0 0",
}))

const CenteredContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "400px",
}))

export {
  BottomSection,
  BottomSectionColumn,
  ContentContainer,
  EventsColumn,
  MembersColumn,
  PageContainer,
  CenteredContainer,
}
