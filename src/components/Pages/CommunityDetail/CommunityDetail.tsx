import { useCallback, useState } from "react"
import { useParams } from "react-router-dom"
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
import {
  getErrorMessage,
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "./utils/errorUtils"
import { useAppSelector } from "../../../app/hooks"
import {
  useGetCommunityByIdQuery,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from "../../../features/communities/communities.client"
import { usePaginatedCommunityEvents } from "../../../hooks/usePaginatedCommunityEvents"
import { usePaginatedCommunityMembers } from "../../../hooks/usePaginatedCommunityMembers"
import { hasValidIdentity } from "../../../utils/identity"
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

  const {
    data,
    isLoading,
    error: queryError,
    isError,
  } = useGetCommunityByIdQuery(id || "", { skip: !id })
  const [
    joinCommunity,
    { isLoading: isJoining, error: joinError, reset: resetJoinMutation },
  ] = useJoinCommunityMutation()
  const [
    leaveCommunity,
    { isLoading: isLeaving, error: leaveError, reset: resetLeaveMutation },
  ] = useLeaveCommunityMutation()

  const isPerformingCommunityAction = isJoining || isLeaving
  const mutationError = joinError || leaveError

  const isLoggedIn = hasValidIdentity(wallet)
  const address = wallet?.address
  const community = data?.data

  const member = community ? isMember(community) : false
  const isPrivate = community?.privacy === "private"
  const canViewContent = member || !isPrivate
  const shouldFetchMembersAndEvents =
    !!id && !!community && (!isPrivate || member)

  const {
    members,
    isLoading: isLoadingMembers,
    isFetchingMore: isFetchingMoreMembers,
    hasMore: hasMoreMembers,
    loadMore: loadMoreMembers,
  } = usePaginatedCommunityMembers({
    communityId: id || "",
    enabled: shouldFetchMembersAndEvents,
  })

  const {
    events,
    isLoading: isLoadingEvents,
    isFetchingMore: isFetchingMoreEvents,
    hasMore: hasMoreEvents,
    loadMore: loadMoreEvents,
  } = usePaginatedCommunityEvents({
    communityId: id || "",
    enabled: shouldFetchMembersAndEvents,
  })

  const displayError =
    error ||
    (mutationError ? getErrorMessage(mutationError) : null) ||
    (isError ? getErrorMessage(queryError) : null)

  const handleJoinCommunity = useCallback(
    async (communityId: string) => {
      if (!isLoggedIn || !address) {
        return
      }

      try {
        await joinCommunity(communityId).unwrap()
      } catch (err) {
        if (isFetchBaseQueryError(err)) {
          const errMsg = "error" in err ? err.error : JSON.stringify(err.data)
          setError(errMsg || "Failed to join community")
        } else if (isErrorWithMessage(err)) {
          setError(err.message)
        } else {
          setError("Failed to join community")
        }
      }
    },
    [isLoggedIn, address, joinCommunity]
  )

  const handleLeaveCommunity = useCallback(
    async (communityId: string) => {
      if (!isLoggedIn || !address) {
        return
      }

      try {
        await leaveCommunity(communityId).unwrap()
      } catch (err) {
        if (isFetchBaseQueryError(err)) {
          const errMsg = "error" in err ? err.error : JSON.stringify(err.data)
          setError(errMsg || "Failed to leave community")
        } else if (isErrorWithMessage(err)) {
          setError(err.message)
        } else {
          setError("Failed to leave community")
        }
      }
    },
    [isLoggedIn, address, leaveCommunity]
  )

  const handleErrorClose = useCallback(() => {
    setError(null)
    resetJoinMutation()
    resetLeaveMutation()
  }, [resetJoinMutation, resetLeaveMutation])

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
          onClose={handleErrorClose}
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
            isLoggedIn={isLoggedIn}
            address={address}
            isPerformingCommunityAction={isPerformingCommunityAction}
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
                  members={members.map((member) => ({
                    name: member.name || member.memberAddress,
                    role: member.role,
                    mutualFriends: 0,
                  }))}
                  isLoading={isLoadingMembers}
                  isFetchingMore={isFetchingMoreMembers}
                  hasMore={hasMoreMembers}
                  onLoadMore={loadMoreMembers}
                />
              </MembersColumn>

              <EventsColumn>
                <EventsList
                  events={events.map((event) => ({
                    id: event.id,
                    name: event.name,
                    image: event.image || "",
                    isLive: event.live || false,
                    startTime: event.startAt,
                  }))}
                  isLoading={isLoadingEvents}
                  isFetchingMore={isFetchingMoreEvents}
                  hasMore={hasMoreEvents}
                  onLoadMore={loadMoreEvents}
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
