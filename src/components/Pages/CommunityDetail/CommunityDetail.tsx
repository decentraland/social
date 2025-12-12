import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import {
  Box,
  CircularProgress,
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
import { useAppSelector } from "../../../app/hooks"
import {
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
import { usePaginatedCommunityEvents } from "../../../hooks/usePaginatedCommunityEvents"
import { usePaginatedCommunityMembers } from "../../../hooks/usePaginatedCommunityMembers"
import { t } from "../../../modules/translation"
import { useWallet } from "../../../modules/wallet/hooks"
import { getAddress as getReduxAddress } from "../../../modules/wallet/selectors"
import { PageLayout } from "../../PageLayout"
import { NotFound } from "../NotFound"
import { AllowedAction } from "./CommunityDetail.types"
import {
  BottomSection,
  ContentContainer,
  EventsColumn,
  MembersColumn,
  PageContainer,
} from "./CommunityDetail.styled"

function CommunityDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { address, isConnecting, hasValidIdentity } = useWallet()
  const [error, setError] = useState<string | null>(null)
  const executedActionRef = useRef<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("members")
  const isTabletOrMobile = useTabletAndBelowMediaQuery()

  // Redux address is needed to ensure the store is synchronized before making signed requests.
  // baseQuery.ts uses getAddress(state) from Redux to sign requests, so we must wait for
  // Redux to have the address before running queries that need authentication.
  const reduxAddress = useAppSelector(getReduxAddress)

  const isLoggedIn = hasValidIdentity

  // Detect if Redux store is still syncing with wagmi.
  // This happens when wagmi has connected (hasValidIdentity is true) but the Redux store
  // hasn't been updated yet (useEffect in useWalletSync hasn't run).
  // Without this check, queries may run unsigned and fail for private communities.
  const isReduxSyncing = hasValidIdentity && !!address && !reduxAddress

  // Skip query only when:
  // 1. No community id provided
  // 2. Wallet is connecting (to avoid race conditions)
  // 3. Redux store is still syncing with wagmi (to ensure signed requests work)
  // Note: We include isSigned in query arg so RTK Query treats signed/unsigned as different queries
  //       This prevents using cached signed data for unsigned requests and vice versa.
  //       RTK Query will automatically refetch when isSigned changes (e.g., when identity becomes available)
  //       isSigned should be false when wallet is connecting, even if identity exists, because connection isn't complete
  const shouldSkipQuery = !id || isConnecting || isReduxSyncing
  const isSigned = isLoggedIn && !isConnecting && !isReduxSyncing

  const {
    data,
    isLoading,
    error: queryError,
    isError,
  } = useGetCommunityByIdQuery(
    { id: id || "", isSigned },
    { skip: shouldSkipQuery }
  )
  const [joinCommunity, { isLoading: isJoining, error: joinError }] =
    useJoinCommunityMutation()
  const [
    createCommunityRequest,
    { isLoading: isCreatingRequest, error: createRequestError },
  ] = useCreateCommunityRequestMutation()
  const [
    cancelCommunityRequest,
    { isLoading: isCancellingRequest, error: cancelRequestError },
  ] = useCancelCommunityRequestMutation()

  const community = data?.data

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
    total: totalMembers,
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
        !isConnecting &&
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
    isConnecting,
    isPerformingCommunityAction,
    member,
    hasPendingRequest,
    handleJoinCommunity,
    handleRequestToJoin,
  ])

  if (isLoading || isConnecting || isReduxSyncing) {
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

  if (displayError || !community) {
    return (
      <NotFound
        title={t("community_detail.not_found")}
        description={t("community_detail.not_found_description")}
      />
    )
  }

  return (
    <PageLayout>
      <PageContainer>
        <ContentContainer>
          <CommunityInfo
            community={community}
            isLoggedIn={isLoggedIn}
            address={address ?? undefined}
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
                          memberAddress: member.memberAddress,
                          name: member.name || member.memberAddress,
                          role: member.role,
                          profilePictureUrl: member.profilePictureUrl || "",
                          hasClaimedName: member.hasClaimedName ?? false,
                        }))}
                        isLoading={isLoadingMembers}
                        isFetchingMore={isFetchingMoreMembers}
                        hasMore={hasMoreMembers}
                        onLoadMore={loadMoreMembers}
                        hideTitle={true}
                        showCount={false}
                        total={totalMembers}
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
                          totalAttendees: event.totalAttendees,
                          latestAttendees: event.latestAttendees,
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
                        memberAddress: member.memberAddress,
                        profilePictureUrl: member.profilePictureUrl || "",
                        name: member.name || member.memberAddress,
                        role: member.role,
                        hasClaimedName: member.hasClaimedName ?? false,
                      }))}
                      isLoading={isLoadingMembers}
                      isFetchingMore={isFetchingMoreMembers}
                      hasMore={hasMoreMembers}
                      onLoadMore={loadMoreMembers}
                      total={totalMembers}
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
                        totalAttendees: event.totalAttendees,
                        latestAttendees: event.latestAttendees,
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
