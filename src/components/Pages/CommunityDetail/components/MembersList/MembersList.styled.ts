import { Avatar, Box, Typography, styled } from "decentraland-ui2"

const MembersSection = styled(Box)(({ theme }) => ({
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

const MemberList = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
  alignItems: "stretch",
}))

const MemberItem = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  borderRadius: "12px",
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

const MemberAvatar = styled(Avatar)(() => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
}))

const MemberInfo = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: "2px",
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
  borderRadius: "6px",
  padding: "5px 4px",
  gap: "4px",
  width: "fit-content",
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "normal",
  color: theme.palette.common.white,
  fontFamily: theme.typography.fontFamily,
  textTransform: "capitalize",
}))

const MemberMutualFriends = styled(Typography)(({ theme }) => ({
  alignSelf: "stretch",
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "normal",
  color: "rgba(255, 255, 255, 0.7)",
  textTransform: "capitalize",
  fontFamily: theme.typography.fontFamily,
}))

export {
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
