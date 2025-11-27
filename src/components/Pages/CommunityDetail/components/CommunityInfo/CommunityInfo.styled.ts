import { Avatar, Box, Button, Typography, styled } from "decentraland-ui2"

const InfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(7.5), // 60px
  alignItems: "center",
  paddingTop: theme.spacing(10), // 80px
  paddingBottom: theme.spacing(7.5), // 60px
  paddingLeft: theme.spacing(30), // 240px
  paddingRight: theme.spacing(30), // 240px
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: theme.spacing(4),
    gap: theme.spacing(4),
  },
}))

const CommunityImage = styled(Box)(({ theme }) => ({
  width: "320px",
  height: "320px",
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

const PrivacyIconContainer = styled(Box)(() => ({
  width: "13.18px",
  height: "13.18px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const TitleContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5), // 12px
}))

const CommunityLabel = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "100%",
  letterSpacing: "1px",
  verticalAlign: "middle",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
  marginBottom: "12px",
}))

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  fontWeight: 500,
  fontSize: "32px",
  lineHeight: "124%",
  letterSpacing: 0,
  color: theme.palette.common.white,
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
  fontFamily: theme.typography.fontFamily,
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "175%",
  letterSpacing: 0,
  color: theme.palette.text.primary,
  whiteSpace: "pre-wrap",
  marginTop: "0px",
}))

export {
  ActionButtons,
  CommunityDetails,
  CommunityImage,
  CommunityImageContent,
  CommunityLabel,
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
  PrivacyIconContainer,
  PrivacyMembersRow,
  PrivacyMembersText,
  Title,
  TitleContainer,
}
