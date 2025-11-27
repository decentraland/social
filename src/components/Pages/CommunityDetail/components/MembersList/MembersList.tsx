import { t } from "decentraland-dapps/dist/modules/translation/utils"
import {
  Box,
  CircularProgress,
  Theme,
  Typography,
  useTheme,
} from "decentraland-ui2"
import { ClaimedNameIcon } from "./components/ClaimedNameIcon"
import { useInfiniteScroll } from "../../../../../hooks/useInfiniteScroll"
import { getRandomRarityColor } from "../utils/getRandomRarityColor"
import {
  EmptyState,
  LoadMoreSentinel,
  MemberAvatar,
  MemberAvatarContainer,
  MemberInfo,
  MemberItem,
  MemberList as MemberListContainer,
  MemberName,
  MemberRole,
  MembersSection,
  SectionTitle,
} from "./MembersList.styled"

type Member = {
  memberAddress: string
  name: string
  role: string
  profilePictureUrl: string
  hasClaimedName?: boolean
}

type MembersListProps = {
  members: Member[]
  isLoading?: boolean
  isFetchingMore?: boolean
  hasMore?: boolean
  onLoadMore: () => void
  hideTitle?: boolean
  total?: number
  showCount?: boolean
}

export const MembersList = ({
  members,
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
  hideTitle = false,
  total,
  showCount = true,
}: MembersListProps) => {
  const membersCount = typeof total === "number" ? total : members.length
  const baseTitle = t("members_list.title")
  const membersTitle = showCount ? `${baseTitle} (${membersCount})` : baseTitle
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore,
  })
  const theme = useTheme<Theme>()

  if (isLoading) {
    return (
      <MembersSection>
        {!hideTitle && <SectionTitle>{membersTitle}</SectionTitle>}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          width="100%"
        >
          <CircularProgress />
        </Box>
      </MembersSection>
    )
  }

  return (
    <MembersSection>
      {!hideTitle && <SectionTitle>{membersTitle}</SectionTitle>}
      {members.length === 0 ? (
        <EmptyState>
          <Typography variant="body2" color="textSecondary">
            {t("members_list.no_members_found")}
          </Typography>
        </EmptyState>
      ) : (
        <MemberListContainer>
          {members.map((memberItem) => (
            <MemberItem key={memberItem.memberAddress}>
              <MemberAvatarContainer>
                <MemberAvatar
                  src={memberItem.profilePictureUrl}
                  backgroundColor={getRandomRarityColor(theme)}
                />
              </MemberAvatarContainer>
              <MemberInfo>
                <Box display="flex" alignItems="center">
                  <MemberName>{memberItem.name}</MemberName>
                  {memberItem.hasClaimedName && (
                    <ClaimedNameIcon
                      data-testid="claimed-name-icon"
                      aria-label="Claimed name badge"
                    />
                  )}
                </Box>
                <MemberRole>{memberItem.role}</MemberRole>
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
