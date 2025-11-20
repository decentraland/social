import { Avatar, Box, Button, Typography, styled } from "decentraland-ui2"

const InfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "60px",
  alignItems: "center",
  paddingTop: "80px",
  paddingBottom: "60px",
  paddingLeft: "120px",
  paddingRight: "120px",
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
  borderRadius: "23.712px",
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

const CommunityDetails = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: "48px",
  minWidth: 0,
}))

const PrivacyBadgeContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "5.272px",
  height: "22.992px",
}))

const PrivacyIcon = styled(Box)(() => ({
  width: "13.18px",
  height: "13.18px",
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
  fontSize: "15.82px",
  fontWeight: 400,
  lineHeight: 1,
  color: "#a09ba8",
  fontFamily: theme.typography.fontFamily,
  textTransform: "capitalize",
}))

const OwnerRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}))

const OwnerAvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  border: `2.286px solid ${theme.palette.divider}`,
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
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: 1.5,
  color: theme.palette.common.white,
  fontFamily: theme.typography.fontFamily,
  "& .owner-name": {
    color: theme.palette.secondary.main,
    marginLeft: theme.spacing(0.5), // 4px
  },
}))

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2), // 16px
  paddingTop: theme.spacing(1.5), // 12px
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

const CTAButton = styled(Button)({
  width: "184px",
  height: "40px",
})

const TitleSubtitleContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5), // 12px
}))

const TitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2), // 16px
}))

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "48px",
  fontWeight: 600,
  lineHeight: 1.167,
  color: theme.palette.common.white,
  fontFamily: theme.typography.fontFamily,
}))

const PrivacyMembersRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5), // 4px
  flexWrap: "wrap",
}))

const PrivacyDivider = styled(Box)(({ theme }) => ({
  width: "1px",
  height: "13.18px",
  backgroundColor: theme.palette.divider,
  flexShrink: 0,
}))

const PrivacyMembersText = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: 1.75,
  color: theme.palette.common.white,
  fontFamily: theme.typography.fontFamily,
}))

const Description = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: 1.6,
  color: "#ecebed",
  whiteSpace: "pre-wrap",
  marginTop: "0px",
  fontFamily: theme.typography.fontFamily,
}))

export {
  ActionButtons,
  CommunityDetails,
  CommunityImage,
  CommunityImageContent,
  Description,
  InfoSection,
  CTAButton,
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
