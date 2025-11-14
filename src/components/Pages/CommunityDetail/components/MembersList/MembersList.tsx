import { Box, CircularProgress, Typography } from "decentraland-ui2"
import { useInfiniteScroll } from "../../../../../hooks/useInfiniteScroll"
import {
  EmptyState,
  LoadMoreSentinel,
  MemberAvatar,
  MemberAvatarContainer,
  MemberInfo,
  MemberItem,
  MemberList as MemberListContainer,
  MemberMutualFriends,
  MemberName,
  MemberRole,
  MembersSection,
  SectionTitle,
} from "./MembersList.styled"

type Member = {
  name: string
  role: string
  mutualFriends: number
}

type MembersListProps = {
  members: Member[]
  isLoading?: boolean
  isFetchingMore?: boolean
  hasMore?: boolean
  onLoadMore: () => void
}

export const MembersList = ({
  members,
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
}: MembersListProps) => {
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore,
  })

  if (isLoading) {
    return (
      <MembersSection>
        <SectionTitle>MEMBERS</SectionTitle>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </MembersSection>
    )
  }

  return (
    <MembersSection>
      <SectionTitle>MEMBERS</SectionTitle>
      {members.length === 0 ? (
        <EmptyState>
          <Typography variant="body2" color="textSecondary">
            No members found
          </Typography>
        </EmptyState>
      ) : (
        <MemberListContainer>
          {members.map((memberItem, index) => (
            <MemberItem key={`${memberItem.name}-${index}`}>
              <MemberAvatarContainer>
                <MemberAvatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberItem.name}-${index}`}
                />
              </MemberAvatarContainer>
              <MemberInfo>
                <Box display="flex" alignItems="center" gap={1}>
                  <MemberName>{memberItem.name}</MemberName>
                </Box>
                <MemberRole>{memberItem.role}</MemberRole>
                {memberItem.mutualFriends > 0 && (
                  <MemberMutualFriends>
                    {memberItem.mutualFriends} Mutual Friends
                  </MemberMutualFriends>
                )}
              </MemberInfo>
            </MemberItem>
          ))}
          {hasMore && (
            <LoadMoreSentinel ref={sentinelRef}>
              {isFetchingMore && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  padding={2}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </LoadMoreSentinel>
          )}
        </MemberListContainer>
      )}
    </MembersSection>
  )
}
