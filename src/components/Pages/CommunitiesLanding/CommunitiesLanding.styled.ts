import { Box, Button, styled, Typography } from "decentraland-ui2"

const CommunitiesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}))

const CommunityCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[2],
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "1264px",
  margin: "0 auto",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}))

const JoinButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}))

const Title = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
}))

export {
  CommunitiesGrid,
  CommunityCard,
  ContentContainer,
  JoinButton,
  Title,
}

