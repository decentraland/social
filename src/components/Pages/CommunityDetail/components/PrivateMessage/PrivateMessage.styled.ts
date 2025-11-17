import { Box, Typography, styled } from "decentraland-ui2"

const PrivateMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(6),
  width: "1920px",
  maxWidth: "100%",
  height: "571px",
  padding: `${theme.spacing(12)} ${theme.spacing(30)} 0 ${theme.spacing(30)}`,
  borderTop: "1px solid rgba(255, 255, 255, 0.3)",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "auto",
    padding: theme.spacing(4),
    gap: theme.spacing(3),
  },
}))

const PrivateMessageContent = styled(Box)(({ theme }) => ({
  width: "550px",
  height: "159px",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(6),
}))

const PrivateMessageTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  textAlign: "center",
  ...theme.typography.body1,
  fontWeight: 600,
  lineHeight: "normal",
}))

const PrivateMessageText = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  textAlign: "center",
  ...theme.typography.caption,
  lineHeight: "normal",
}))

const LockIcon = styled(Box)(({ theme }) => ({
  width: theme.spacing(25),
  height: theme.spacing(25),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    width: "100%",
    height: "100%",
  },
}))

export {
  LockIcon,
  PrivateMessage,
  PrivateMessageContent,
  PrivateMessageText,
  PrivateMessageTitle,
}
