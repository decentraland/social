import { Avatar, Box, Button, Typography, styled } from "decentraland-ui2"

const InfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(15),
  alignItems: "center",
  paddingTop: theme.spacing(20),
  paddingBottom: theme.spacing(15),
  paddingLeft: theme.spacing(30),
  paddingRight: theme.spacing(30),
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: theme.spacing(4),
    gap: theme.spacing(4),
  },
}))

const CommunityImage = styled(Box)(({ theme }) => ({
  width: "412px",
  height: "412px",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "300px",
  },
}))

const CommunityImageContent = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
})

const CommunityDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: theme.spacing(12),
  minWidth: 0,
}))

const PrivacyBadgeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.318),
  height: theme.spacing(5.748),
}))

const PrivacyIcon = styled(Box)(({ theme }) => ({
  width: theme.spacing(3.295),
  height: theme.spacing(3.295),
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    width: "100%",
    height: "100%",
  },
}))

const PrivacyBadgeText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  fontSize: "15.82px",
  lineHeight: 1,
  color: theme.palette.text.secondary,
  textTransform: "capitalize",
}))

const OwnerRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2.5),
}))

const OwnerAvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: theme.spacing(7),
  height: theme.spacing(7),
  borderRadius: "50%",
  backgroundColor: "#31C11A",
  border: `${theme.spacing(0.5715)} solid rgba(255, 255, 255, 0.5)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  overflow: "hidden",
  padding: "0",
}))

const OwnerAvatar = styled(Avatar)(() => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
}))

const OwnerText = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  ...theme.typography.body2,
  color: theme.palette.common.white,
  "& .owner-name": {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(1),
  },
}))

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(4),
  paddingTop: theme.spacing(3),
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "& > *": {
      width: "100%",
    },
  },
}))

const JoinButton = styled(Button)(({ theme }) => ({
  minWidth: "184px",
  width: "184px",
  height: "40px",
  border: `2px solid ${theme.palette.common.white}`,
  borderRadius: theme.shape.borderRadius,
  textTransform: "uppercase",
  ...theme.typography.caption,
  fontWeight: 600,
  lineHeight: 1,
  color: theme.palette.common.white,
  backgroundColor: "transparent",
  "&:hover": {
    border: `2px solid ${theme.palette.common.white}`,
    backgroundColor: theme.palette.action.hover,
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  "&:active": {
    transform: "scale(0.98)",
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    cursor: "not-allowed",
  },
}))

const TitleSubtitleContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}))

const TitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
}))

const Title = styled(Typography)(({ theme }) => ({
  ...theme.typography.h1,
  fontWeight: 600,
  color: theme.palette.common.white,
}))

const PrivacyMembersRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}))

const PrivacyDivider = styled(Box)(({ theme }) => ({
  width: "1px",
  height: theme.spacing(3.295),
  backgroundColor: theme.palette.divider,
  flexShrink: 0,
}))

const PrivacyMembersText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.common.white,
}))

const Description = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  whiteSpace: "pre-wrap",
  marginTop: "0px",
}))

export {
  ActionButtons,
  CommunityDetails,
  CommunityImage,
  CommunityImageContent,
  Description,
  InfoSection,
  JoinButton,
  OwnerAvatar,
  OwnerAvatarContainer,
  OwnerRow,
  OwnerText,
  PrivacyBadgeContainer,
  PrivacyBadgeText,
  PrivacyDivider,
  PrivacyIcon,
  PrivacyMembersRow,
  PrivacyMembersText,
  Title,
  TitleRow,
  TitleSubtitleContainer,
}
