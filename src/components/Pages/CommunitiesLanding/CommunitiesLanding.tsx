import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { localStorageGetIdentity } from "@dcl/single-sign-on-client"
import { useWallet } from "decentraland-dapps/dist/hooks"
import { Box, CircularProgress, Typography } from "decentraland-ui2"
import { createSocialServiceClient } from "../../../modules/communities/client"
import { Community } from "../../../modules/communities/types"
import {
  CommunitiesGrid,
  CommunityCard,
  ContentContainer,
  JoinButton,
  Title,
} from "./CommunitiesLanding.styled"
import { Props } from "./CommunitiesLanding.types"

function CommunitiesLanding(props: Props) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState<string | null>(null)
  const { isConnected, address } = useWallet()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // TODO: Replace with actual data fetching method
        // Since getCommunities was removed, determine the correct way to fetch communities list
        // This could be from a different endpoint, props, or context
        setCommunities([])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load communities")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunities()
  }, [])

  const handleJoinCommunity = useCallback(
    async (communityId: string) => {
      if (!isConnected || !address) {
        navigate("/sign-in?redirectTo=/")
        return
      }

      const identity = localStorageGetIdentity(address.toLowerCase())
      if (!identity) {
        navigate("/sign-in?redirectTo=/")
        return
      }

      try {
        setIsJoining(communityId)
        const client = createSocialServiceClient()
        await client.joinCommunity(communityId, identity)
        const updatedCommunity = await client.getCommunityById(communityId)
        setCommunities((prev) =>
          prev.map((c) => (c.id === communityId ? updatedCommunity : c))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to join community")
      } finally {
        setIsJoining(null)
      }
    },
    [isConnected, address, navigate]
  )

  const handleLeaveCommunity = useCallback(
    async (communityId: string) => {
      if (!isConnected || !address) {
        navigate("/sign-in?redirectTo=/")
        return
      }

      const identity = localStorageGetIdentity(address.toLowerCase())
      if (!identity) {
        navigate("/sign-in?redirectTo=/")
        return
      }

      try {
        setIsJoining(communityId)
        const client = createSocialServiceClient()
        await client.leaveCommunity(communityId, identity)
        const updatedCommunity = await client.getCommunityById(communityId)
        setCommunities((prev) =>
          prev.map((c) => (c.id === communityId ? updatedCommunity : c))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to leave community")
      } finally {
        setIsJoining(null)
      }
    },
    [isConnected, address, navigate]
  )

  if (isLoading) {
    return (
      <ContentContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </ContentContainer>
    )
  }

  if (error) {
    return (
      <ContentContainer>
        <Typography color="error">{error}</Typography>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <Title>Communities</Title>
      {communities.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No communities found
        </Typography>
      ) : (
        <CommunitiesGrid>
          {communities.map((community) => (
            <CommunityCard key={community.id}>
              {community.imageUrl && (
                <Box
                  component="img"
                  src={community.imageUrl}
                  alt={community.name}
                  sx={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                />
              )}
              <Typography variant="h5">{community.name}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ marginY: 1 }}>
                {community.description}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {community.memberCount} members
              </Typography>
              <JoinButton
                variant="contained"
                onClick={() =>
                  community.isMember
                    ? handleLeaveCommunity(community.id)
                    : handleJoinCommunity(community.id)
                }
                disabled={isJoining === community.id}
              >
                {isJoining === community.id
                  ? "Loading..."
                  : community.isMember
                  ? "Leave"
                  : "Join"}
              </JoinButton>
            </CommunityCard>
          ))}
        </CommunitiesGrid>
      )}
    </ContentContainer>
  )
}

export default CommunitiesLanding

