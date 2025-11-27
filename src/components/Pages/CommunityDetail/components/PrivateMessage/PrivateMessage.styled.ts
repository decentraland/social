import { Box, Typography, styled } from "decentraland-ui2"

const PrivateMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  width: "1920px",
  maxWidth: "100%",
  height: "571px",
  padding: theme.spacing(6, 15, 0, 15),
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
  gap: theme.spacing(3),
}))

const PrivateMessageTitle = styled(Typography)(({ theme }) => ({
  color: "#FCFCFC",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "normal",
  fontFamily: theme.typography.fontFamily,
}))

const PrivateMessageText = styled(Typography)(({ theme }) => ({
  color: "#FCFCFC",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "normal",
  fontFamily: theme.typography.fontFamily,
}))

const LockIcon = styled(Box)(() => ({
  width: "100px",
  height: "100px",
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
