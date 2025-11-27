import { Avatar, Box, Typography, styled } from "decentraland-ui2"

const MembersSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(1.5),
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
  paddingBottom: theme.spacing(3),
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  lineHeight: 1,
  width: "100%",
}))

const MemberList = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(1.25),
  width: "100%",
  alignItems: "stretch",
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
    borderRadius: theme.spacing(0.5),
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: theme.spacing(0.5),
    "&:hover": {
      background: "rgba(255, 255, 255, 0.4)",
    },
  },
  [theme.breakpoints.between("xs", "sm")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
}))

const MemberItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.25),
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  borderRadius: theme.spacing(1.5),
  width: "100%",
  boxSizing: "border-box",
}))

const MemberAvatarContainer = styled(Box)(() => ({
  position: "relative",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  backgroundColor: "#caff73",
  border: "3px solid rgba(255, 255, 255, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  overflow: "hidden",
  padding: "0",
}))

const MemberAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "backgroundColor",
})<{ backgroundColor?: string }>(({ backgroundColor, theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  backgroundColor: backgroundColor ?? theme.palette.secondary.main,
}))

const MemberInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: theme.spacing(0.25),
  minWidth: 0,
  width: "100%",
}))

const MemberName = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "normal",
  color: "#caff73",
  textTransform: "capitalize",
  fontFamily: theme.typography.fontFamily,
}))

const MemberRole = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: theme.spacing(0.75),
  padding: theme.spacing(0.625, 0.5),
  gap: theme.spacing(0.5),
  width: "fit-content",
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "normal",
  color: theme.palette.common.white,
  fontFamily: theme.typography.fontFamily,
  textTransform: "capitalize",
}))

const LoadMoreSentinel = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: theme.spacing(2.5),
}))

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  width: "100%",
}))

export {
  EmptyState,
  LoadMoreSentinel,
  MemberAvatar,
  MemberAvatarContainer,
  MemberInfo,
  MemberItem,
  MemberList,
  MemberName,
  MemberRole,
  MembersSection,
  SectionTitle,
}
