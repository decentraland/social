import { Avatar, Box, Typography, styled } from "decentraland-ui2"

const MembersSection = styled(Box)(({ theme }) => ({
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

const MemberList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  width: "100%",
  alignItems: "stretch",
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
}))

const MemberItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2.5),
  padding: theme.spacing(2.5),
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  boxSizing: "border-box",
}))

const MemberAvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: theme.spacing(15),
  height: theme.spacing(15),
  borderRadius: "50%",
  backgroundColor: "#caff73",
  border: `${theme.spacing(0.75)} solid rgba(255, 255, 255, 0.5)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  overflow: "hidden",
  padding: "0",
}))

const MemberAvatar = styled(Avatar)(() => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
}))

const MemberInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: theme.spacing(0.5),
  minWidth: 0,
  width: "100%",
}))

const MemberName = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: 600,
  lineHeight: "normal",
  color: theme.palette.success.main,
  textTransform: "capitalize",
}))

const MemberRole = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(1.25)} ${theme.spacing(1)}`,
  gap: theme.spacing(1),
  width: "fit-content",
  ...theme.typography.caption,
  lineHeight: "normal",
  color: theme.palette.common.white,
  textTransform: "capitalize",
}))

const MemberMutualFriends = styled(Typography)(({ theme }) => ({
  alignSelf: "stretch",
  ...theme.typography.caption,
  lineHeight: "normal",
  color: theme.palette.text.secondary,
  textTransform: "capitalize",
}))

const LoadMoreSentinel = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: theme.spacing(5),
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
  MemberMutualFriends,
  MemberName,
  MemberRole,
  MembersSection,
  SectionTitle,
}
