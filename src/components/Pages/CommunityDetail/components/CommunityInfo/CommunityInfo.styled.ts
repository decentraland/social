import { Avatar, Box, Button, Typography, styled } from "decentraland-ui2"

const InfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(7.5), // 60px
  alignItems: "start",
  paddingTop: theme.spacing(6), // 48px
  paddingBottom: theme.spacing(4), // 32px
  paddingLeft: theme.spacing(30), // 240px
  paddingRight: theme.spacing(30), // 240px
  backgroundColor: "rgba(0, 0, 0, 0.3)",
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
    gap: theme.spacing(3),
  },
  [theme.breakpoints.down("xs")]: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    gap: theme.spacing(4),
  },
}))

const TopRow = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  gap: theme.spacing(7.5),
  alignItems: "start",
  [theme.breakpoints.between("lg", "xl")]: {
    gap: theme.spacing(5),
  },
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(3),
  },
  [theme.breakpoints.down("xs")]: {
    flexDirection: "column",
  },
}))

const DescriptionRow = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}))

const CommunityImage = styled(Box)(({ theme }) => ({
  width: "320px",
  height: "320px",
  borderRadius: "23.712px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down("sm")]: {
    width: "210px",
    height: "210px",
  },
  [theme.breakpoints.down(391)]: {
    width: "100%",
    height: "300px",
    borderRadius: "0",
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
  gap: theme.spacing(3), // 24px
  minWidth: 0,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(2), // 16px
    paddingRight: theme.spacing(2), // 16px
  },
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

const OwnerRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25), // 10px
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

const OwnerAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "backgroundColor",
})<{ backgroundColor?: string }>(({ backgroundColor, theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  backgroundColor: backgroundColor ?? theme.palette.secondary.main,
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

const CTAButton = styled(Button)(({ theme }) => ({
  width: "184px",
  height: "40px",
  [theme.breakpoints.down("xs")]: {
    width: "100%",
  },
}))

const TitleContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5), // 12px
}))

const TitleHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25), // 2px
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
}))

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
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
  TitleHeader,
  TopRow,
  DescriptionRow,
}
