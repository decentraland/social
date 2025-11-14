import { useCallback, useState } from "react"
import { useParams } from "react-router-dom"
import { LocalStorageUtils } from "@dcl/single-sign-on-client"
import { getData as getWallet } from "decentraland-dapps/dist/modules/wallet/selectors"
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "decentraland-ui2"
import { CommunityInfo } from "./components/CommunityInfo"
import { EventsList } from "./components/EventsList"
import { MembersList } from "./components/MembersList"
import { PrivateMessage } from "./components/PrivateMessage"
import { isMember } from "./utils/communityUtils"
import { getErrorMessage } from "./utils/errorUtils"
import { useAppSelector } from "../../../app/hooks"
import {
  useGetCommunityByIdQuery,
  useGetCommunityMembersQuery,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from "../../../features/communities/communities.client"
import { useGetCommunityEventsQuery } from "../../../features/events/events.client"
import { PageLayout } from "../../PageLayout"
import {
  BottomSection,
  ContentContainer,
  EventsColumn,
  MembersColumn,
  PageContainer,
} from "./CommunityDetail.styled"

function CommunityDetail() {
  const { id } = useParams<{ id: string }>()
  const wallet = useAppSelector(getWallet)
  const [error, setError] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState<string | null>(null)

  const {
    data,
    isLoading,
    error: queryError,
    isError,
  } = useGetCommunityByIdQuery(id || "", { skip: !id })
  const [joinCommunity] = useJoinCommunityMutation()
  const [leaveCommunity] = useLeaveCommunityMutation()

  const isConnected = !!wallet
  const address = wallet?.address
  const community = data?.data

  const member = community ? isMember(community) : false
  const isPrivate = community?.privacy === "private"
  const canViewContent = member || !isPrivate

  const { data: membersData } = useGetCommunityMembersQuery(
    { id: id || "" },
    { skip: !id || !canViewContent }
  )
  const { data: eventsData } = useGetCommunityEventsQuery(
    { communityId: id || "" },
    { skip: !id || !canViewContent }
  )

  const displayError = error || (isError ? getErrorMessage(queryError) : null)

  const handleJoinCommunity = useCallback(
    async (communityId: string) => {
      if (!isConnected || !address) {
        return
      }

      const identity = LocalStorageUtils.getIdentity(address.toLowerCase())
      if (!identity) {
        return
      }

      try {
        setIsJoining(communityId)
        await joinCommunity({ id: communityId, identity }).unwrap()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to join community"
        )
      } finally {
        setIsJoining(null)
      }
    },
    [isConnected, address, joinCommunity]
  )

  const handleLeaveCommunity = useCallback(
    async (communityId: string) => {
      if (!isConnected || !address) {
        return
      }

      const identity = LocalStorageUtils.getIdentity(address.toLowerCase())
      if (!identity) {
        return
      }

      try {
        setIsJoining(communityId)
        await leaveCommunity({ id: communityId, identity }).unwrap()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to leave community"
        )
      } finally {
        setIsJoining(null)
      }
    },
    [isConnected, address, leaveCommunity]
  )

  if (isLoading) {
    return (
      <ContentContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </ContentContainer>
    )
  }

  if (displayError) {
    return (
      <ContentContainer>
        <Snackbar
          open={!!displayError}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error">{displayError}</Alert>
        </Snackbar>
      </ContentContainer>
    )
  }

  if (!community) {
    return (
      <ContentContainer>
        <Typography variant="body1" color="textSecondary">
          Community not found
        </Typography>
      </ContentContainer>
    )
  }

  return (
    <PageLayout>
      <PageContainer>
        <ContentContainer>
          <CommunityInfo
            community={community}
            isConnected={isConnected}
            address={address}
            isJoining={isJoining}
            isMember={member}
            canViewContent={canViewContent}
            onJoin={handleJoinCommunity}
            onLeave={handleLeaveCommunity}
          />

          {!canViewContent && <PrivateMessage />}

          {canViewContent && (
            <BottomSection>
              <MembersColumn>
                <MembersList
                  members={
                    membersData?.data.members.map((member) => ({
                      name: member.name || member.address,
                      role: member.role,
                      mutualFriends: 0,
                    })) || []
                  }
                />
              </MembersColumn>

              <EventsColumn>
                <EventsList
                  events={
                    eventsData?.data.map((event) => ({
                      id: event.id,
                      name: event.name,
                      image: event.image || "",
                      isLive: event.live || false,
                      startTime: event.startAt,
                    })) || []
                  }
                />
              </EventsColumn>
            </BottomSection>
          )}
        </ContentContainer>
      </PageContainer>
    </PageLayout>
  )
}

export { CommunityDetail }
