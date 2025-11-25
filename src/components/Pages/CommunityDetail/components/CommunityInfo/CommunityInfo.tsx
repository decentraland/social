import { useCallback } from "react"
import { t } from "decentraland-dapps/dist/modules/translation/utils"
import {
  Icon,
  JumpIn,
  muiIcons,
  useTabletAndBelowMediaQuery,
} from "decentraland-ui2"
import { PrivacyIcon } from "./PrivacyIcon"
import { Privacy } from "../../../../../features/communities/types"
import { redirectToAuth } from "../../../../../utils/authRedirect"
import { AllowedAction } from "../../CommunityDetail.types"
import { getThumbnailUrl } from "../../utils/communityUtils"
import {
  ActionButtons,
  CTAButton,
  CommunityDetails,
  CommunityImage,
  CommunityImageContent,
  CommunityLabel,
  Description,
  InfoSection,
  OwnerAvatar,
  OwnerAvatarContainer,
  OwnerRow,
  OwnerText,
  PrivacyBadgeContainer,
  PrivacyBadgeText,
  PrivacyDivider,
  PrivacyIconContainer,
  PrivacyMembersRow,
  PrivacyMembersText,
  Title,
  TitleContainer,
} from "./CommunityInfo.styled"
import type { Community } from "../../../../../features/communities/types"

type CommunityInfoProps = {
  community: Community
  isLoggedIn: boolean
  address?: string
  isPerformingCommunityAction: boolean
  isMember: boolean
  canViewContent: boolean
  onJoin: (communityId: string) => Promise<void>
  hasPendingRequest?: boolean
  isLoadingMemberRequests?: boolean
  onRequestToJoin?: (communityId: string) => Promise<void>
  onCancelRequest?: (communityId: string) => Promise<void>
}

export const CommunityInfo = ({
  community,
  isLoggedIn,
  address,
  isPerformingCommunityAction,
  isMember,
  canViewContent,
  onJoin,
  hasPendingRequest = false,
  isLoadingMemberRequests = false,
  onRequestToJoin,
  onCancelRequest,
}: CommunityInfoProps) => {
  const thumbnailUrl = getThumbnailUrl(community.id)
  const isPrivate = community.privacy === Privacy.PRIVATE
  const isTabletOrMobile = useTabletAndBelowMediaQuery()

  const handleJoinClick = useCallback(() => {
    if (!isLoggedIn || !address) {
      redirectToAuth(`/communities/${community.id}`, {
        action: AllowedAction.JOIN,
      })
      return
    }

    onJoin(community.id)
  }, [isLoggedIn, address, community.id, onJoin])

  const handleRequestToJoinClick = useCallback(() => {
    if (!isLoggedIn || !address) {
      redirectToAuth(`/communities/${community.id}`, {
        action: AllowedAction.REQUEST_TO_JOIN,
      })
      return
    }

    if (onRequestToJoin) {
      onRequestToJoin(community.id)
    }
  }, [isLoggedIn, address, community.id, onRequestToJoin])

  const handleCancelRequestClick = useCallback(() => {
    if (!isLoggedIn || !address) {
      return
    }

    if (onCancelRequest) {
      onCancelRequest(community.id)
    }
  }, [isLoggedIn, address, community.id, onCancelRequest])

  return (
    <InfoSection>
      <CommunityImage>
        <CommunityImageContent src={thumbnailUrl || ""} alt={community.name} />
      </CommunityImage>
      <CommunityDetails>
        <TitleContainer>
          <span>
            <CommunityLabel>
              {t("community_info.decentraland_community")}
            </CommunityLabel>
            <Title>{community.name}</Title>
          </span>
          <PrivacyMembersRow>
            <PrivacyBadgeContainer>
              <PrivacyIconContainer>
                <PrivacyIcon />
              </PrivacyIconContainer>
              <PrivacyBadgeText>{community.privacy}</PrivacyBadgeText>
            </PrivacyBadgeContainer>
            <PrivacyDivider />
            <PrivacyMembersText>
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(community.membersCount)}{" "}
              {t("community_info.members")}
            </PrivacyMembersText>
          </PrivacyMembersRow>
          <OwnerRow>
            <OwnerAvatarContainer>
              <OwnerAvatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${community.ownerAddress}`}
              />
            </OwnerAvatarContainer>
            <OwnerText>
              {t("community_info.by")}{" "}
              <span className="owner-name">
                {community.ownerName || t("community_info.unknown")}
              </span>
            </OwnerText>
          </OwnerRow>
          <ActionButtons>
            {isMember ? (
              <CTAButton variant="outlined" disabled>
                <Icon component={muiIcons.Check} fontSize="small" />
                {t("community_info.joined")}
              </CTAButton>
            ) : !isLoggedIn ? (
              <CTAButton
                variant="contained"
                color="secondary"
                onClick={() => {
                  const action = isPrivate
                    ? AllowedAction.REQUEST_TO_JOIN
                    : AllowedAction.JOIN
                  redirectToAuth(`/communities/${community.id}`, { action })
                }}
              >
                {t("community_info.sign_in_to_join")}
              </CTAButton>
            ) : isPrivate ? (
              <>
                {isLoadingMemberRequests ? (
                  <CTAButton color="secondary" variant="contained" disabled>
                    {t("global.loading")}
                  </CTAButton>
                ) : hasPendingRequest ? (
                  <CTAButton
                    color="secondary"
                    variant="contained"
                    onClick={handleCancelRequestClick}
                    disabled={isPerformingCommunityAction}
                  >
                    {isPerformingCommunityAction
                      ? t("global.loading")
                      : t("community_info.cancel_request")}
                  </CTAButton>
                ) : (
                  <CTAButton
                    color="secondary"
                    variant="contained"
                    onClick={handleRequestToJoinClick}
                    disabled={isPerformingCommunityAction}
                  >
                    {isPerformingCommunityAction
                      ? t("global.loading")
                      : t("community_info.request_to_join")}
                  </CTAButton>
                )}
                {isLoggedIn && !isTabletOrMobile && (
                  <JumpIn
                    variant="button"
                    buttonText={t("community_info.jump_in")}
                    modalProps={{
                      title: t("community_info.jump_in_modal.title"),
                      description: t(
                        "community_info.jump_in_modal.description"
                      ),
                      buttonLabel: t(
                        "community_info.jump_in_modal.button_label"
                      ),
                    }}
                    buttonProps={{
                      variant: "contained",
                      sx: {
                        maxWidth: "175px",
                        minWidth: "auto",
                        height: "40px",
                      },
                    }}
                  />
                )}
              </>
            ) : (
              <CTAButton
                color="secondary"
                variant="contained"
                onClick={handleJoinClick}
                disabled={isPerformingCommunityAction}
              >
                {isPerformingCommunityAction
                  ? t("global.loading")
                  : t("community_info.join")}
              </CTAButton>
            )}
          </ActionButtons>
        </TitleContainer>
        {canViewContent && <Description>{community.description}</Description>}
      </CommunityDetails>
    </InfoSection>
  )
}
