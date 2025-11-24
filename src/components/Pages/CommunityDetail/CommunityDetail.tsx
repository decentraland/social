import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { t } from "decentraland-dapps/dist/modules/translation/utils"
import {
  getData as getWallet,
  isConnecting,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
  useTabletAndBelowMediaQuery,
} from "decentraland-ui2"
import { CommunityInfo } from "./components/CommunityInfo"
import { EventsList } from "./components/EventsList"
import { MembersList } from "./components/MembersList"
import { PrivateMessage } from "./components/PrivateMessage"
import { type TabType, Tabs } from "./components/Tabs"
import { isMember } from "./utils/communityUtils"
import {
  getErrorMessage,
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "./utils/errorUtils"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  communitiesApi,
  useCancelCommunityRequestMutation,
  useCreateCommunityRequestMutation,
  useGetCommunityByIdQuery,
  useGetMemberRequestsQuery,
  useJoinCommunityMutation,
} from "../../../features/communities/communities.client"
import {
  Privacy,
  RequestStatus,
  RequestType,
} from "../../../features/communities/types"
import { eventsApi } from "../../../features/events/events.client"
import { usePaginatedCommunityEvents } from "../../../hooks/usePaginatedCommunityEvents"
import { usePaginatedCommunityMembers } from "../../../hooks/usePaginatedCommunityMembers"
import { hasValidIdentity } from "../../../utils/identity"
import { PageLayout } from "../../PageLayout"
import { AllowedAction } from "./CommunityDetail.types"
import {
  BottomSection,
  CenteredContainer,
  ContentContainer,
  EventsColumn,
  MembersColumn,
  PageContainer,
} from "./CommunityDetail.styled"

function CommunityDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const wallet = useAppSelector(getWallet)
  const isWalletConnecting = useAppSelector(isConnecting)
  const [error, setError] = useState<string | null>(null)
  const executedActionRef = useRef<string | null>(null)
  const previousAddressRef = useRef<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("members")
  const isTabletOrMobile = useTabletAndBelowMediaQuery()

  // Skip query if wallet is still connecting to ensure state is ready for signing
  const shouldSkipQuery = !id || isWalletConnecting

  const {
    data,
    isLoading,
    error: queryError,
    isError,
  } = useGetCommunityByIdQuery(id || "", { skip: shouldSkipQuery })
  const [
    joinCommunity,
    { isLoading: isJoining, error: joinError, reset: resetJoinMutation },
  ] = useJoinCommunityMutation()
  const [
    createCommunityRequest,
    {
      isLoading: isCreatingRequest,
      error: createRequestError,
      reset: resetCreateRequestMutation,
    },
  ] = useCreateCommunityRequestMutation()
  const [
    cancelCommunityRequest,
    {
      isLoading: isCancellingRequest,
      error: cancelRequestError,
      reset: resetCancelRequestMutation,
    },
  ] = useCancelCommunityRequestMutation()

  const isLoggedIn = hasValidIdentity(wallet)
  const address = wallet?.address
  const community = data?.data

  // Refresh data when user signs out
  // RTK Query automatically refetches active queries when their tags are invalidated
  useEffect(() => {
    const previousAddress = previousAddressRef.current
    const currentAddress = address

    // Detect sign out: address changed from non-null to null
    if (previousAddress && !currentAddress && id) {
      // Invalidate cache tags - RTK Query will automatically refetch active queries
      dispatch(
        communitiesApi.util.invalidateTags([
          { type: "Communities", id },
          "Communities",
          "Members",
          "MemberRequests",
        ])
      )
      dispatch(eventsApi.util.invalidateTags(["Events"]))
    }

    // Update the ref for next comparison
    previousAddressRef.current = currentAddress || null
  }, [address, id, dispatch])

  const member = community ? isMember(community) : false
  const isPrivate = community?.privacy === Privacy.PRIVATE
  const canViewContent = member || !isPrivate
  const shouldFetchMembersAndEvents =
    !!id && !!community && (!isPrivate || member)

  // Fetch member requests if user is logged in and viewing a private community
  const shouldFetchRequests = isLoggedIn && !!address && !!isPrivate && !member
  const { data: memberRequestsData, isLoading: isLoadingMemberRequests } =
    useGetMemberRequestsQuery(
      {
        address: address || "",
        type: RequestType.REQUEST_TO_JOIN,
      },
      { skip: !shouldFetchRequests }
    )

  // Find pending request for current community
  const pendingRequest = memberRequestsData?.data.results.find(
    (request) =>
      request.communityId === id &&
      request.status === RequestStatus.PENDING &&
      request.type === RequestType.REQUEST_TO_JOIN
  )
  const hasPendingRequest = !!pendingRequest
  const pendingRequestId = pendingRequest?.id

  const isPerformingCommunityAction =
    isJoining || isCreatingRequest || isCancellingRequest
  const mutationError = joinError || createRequestError || cancelRequestError

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
          setError(errMsg || t("community_detail.failed_to_join"))
        } else if (isErrorWithMessage(err)) {
          setError(err.message)
        } else {
          setError(t("community_detail.failed_to_join"))
        }
      }
    },
    [isLoggedIn, address, joinCommunity]
  )

  const handleRequestToJoin = useCallback(
    async (communityId: string) => {
      if (!isLoggedIn || !address) {
        return
      }

      try {
        await createCommunityRequest({
          communityId,
          targetedAddress: address,
        }).unwrap()
      } catch (err) {
        if (isFetchBaseQueryError(err)) {
          const errMsg = "error" in err ? err.error : JSON.stringify(err.data)
          setError(errMsg || t("community_detail.failed_to_join"))
        } else if (isErrorWithMessage(err)) {
          setError(err.message)
        } else {
          setError(t("community_detail.failed_to_join"))
        }
      }
    },
    [isLoggedIn, address, createCommunityRequest]
  )

  const handleCancelRequest = useCallback(
    async (communityId: string, requestId: string) => {
      if (!isLoggedIn || !address) {
        return
      }

      try {
        await cancelCommunityRequest({
          communityId,
          requestId,
          address,
        }).unwrap()
      } catch (err) {
        if (isFetchBaseQueryError(err)) {
          const errMsg = "error" in err ? err.error : JSON.stringify(err.data)
          setError(errMsg || t("community_detail.failed_to_join"))
        } else if (isErrorWithMessage(err)) {
          setError(err.message)
        } else {
          setError(t("community_detail.failed_to_join"))
        }
      }
    },
    [isLoggedIn, address, cancelCommunityRequest]
  )

  const handleErrorClose = useCallback(() => {
    setError(null)
    resetJoinMutation()
    resetCreateRequestMutation()
    resetCancelRequestMutation()
  }, [
    resetJoinMutation,
    resetCreateRequestMutation,
    resetCancelRequestMutation,
  ])

  // Auto-execute action after authentication redirect
  useEffect(() => {
    const action = searchParams.get("action") as AllowedAction | null

    const removeActionParam = () => {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete("action")
      setSearchParams(newSearchParams, { replace: true })
    }

    const canExecuteAction = (): boolean => {
      return !!(
        action &&
        executedActionRef.current !== action &&
        isLoggedIn &&
        address &&
        community &&
        !isLoading &&
        !isWalletConnecting &&
        !isPerformingCommunityAction
      )
    }

    const isValidAction = (
      actionValue: string | null
    ): actionValue is AllowedAction => {
      return !!(
        actionValue &&
        Object.values(AllowedAction).includes(actionValue as AllowedAction)
      )
    }

    if (action && executedActionRef.current !== action) {
      executedActionRef.current = null
    }

    if (!canExecuteAction()) {
      return
    }

    if (!isValidAction(action)) {
      console.warn(`Invalid action parameter: ${action}`)
      removeActionParam()
      return
    }

    // At this point, community is guaranteed to be defined (checked in canExecuteAction)
    const actionHandlers: Record<
      AllowedAction,
      {
        shouldSkip: () => boolean
        execute: () => Promise<void>
      }
    > = {
      [AllowedAction.JOIN]: {
        shouldSkip: () => member,
        execute: () => handleJoinCommunity(community!.id),
      },
      [AllowedAction.REQUEST_TO_JOIN]: {
        shouldSkip: () => hasPendingRequest,
        execute: () => handleRequestToJoin(community!.id),
      },
    }

    const handler = actionHandlers[action]

    if (handler.shouldSkip()) {
      removeActionParam()
      return
    }

    executedActionRef.current = action
    handler.execute().finally(() => {
      removeActionParam()
    })
  }, [
    searchParams,
    setSearchParams,
    isLoggedIn,
    address,
    community,
    isLoading,
    isWalletConnecting,
    isPerformingCommunityAction,
    member,
    hasPendingRequest,
    handleJoinCommunity,
    handleRequestToJoin,
  ])

  if (isLoading || isWalletConnecting) {
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
        <CenteredContainer>
          <Typography variant="h4">
            {t("community_detail.not_found")}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t("community_detail.not_found_description")}
          </Typography>
        </CenteredContainer>
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
            hasPendingRequest={hasPendingRequest}
            isLoadingMemberRequests={isLoadingMemberRequests}
            onRequestToJoin={handleRequestToJoin}
            onCancelRequest={
              pendingRequestId
                ? (communityId: string) =>
                    handleCancelRequest(communityId, pendingRequestId)
                : undefined
            }
          />

          {!canViewContent && <PrivateMessage />}

          {canViewContent && (
            <BottomSection>
              {isTabletOrMobile ? (
                <>
                  <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
                  {activeTab === "members" ? (
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
                        hideTitle={true}
                      />
                    </MembersColumn>
                  ) : (
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
                        hideTitle={true}
                      />
                    </EventsColumn>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </BottomSection>
          )}
        </ContentContainer>
      </PageContainer>
    </PageLayout>
  )
}

export { CommunityDetail }
