import { Box, Typography, styled } from "decentraland-ui2"

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  width: "100%",
  minHeight: "100%",
  flex: 1,
  gap: theme.spacing(2),
}))

const EmptyStateText = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  fontSize: "18px",
  lineHeight: "100%",
  letterSpacing: "0%",
  textAlign: "center",
  verticalAlign: "middle",
}))

const EmptyStateDescription = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "140%",
  letterSpacing: "0%",
  textAlign: "center",
  verticalAlign: "middle",
}))

export { EmptyState, EmptyStateText, EmptyStateDescription }
