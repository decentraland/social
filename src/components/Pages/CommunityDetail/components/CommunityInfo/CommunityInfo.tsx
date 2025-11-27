import { useCallback } from "react"
import { t } from "decentraland-dapps/dist/modules/translation/utils"
import {
  Icon,
  JumpIn,
  Theme,
  muiIcons,
  useTabletAndBelowMediaQuery,
  useTabletMediaQuery,
  useTheme,
} from "decentraland-ui2"
import { PrivacyIcon } from "./PrivacyIcon"
import { Privacy } from "../../../../../features/communities/types"
import { useProfilePicture } from "../../../../../hooks/useProfilePicture"
import { redirectToAuth } from "../../../../../utils/authRedirect"
import { AllowedAction } from "../../CommunityDetail.types"
import { getThumbnailUrl } from "../../utils/communityUtils"
import { getRandomRarityColor } from "../utils/getRandomRarityColor"
import {
  ActionButtons,
  CTAButton,
  CommunityDetails,
  CommunityImage,
  CommunityImageContent,
  CommunityLabel,
  Description,
  DescriptionRow,
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
  TopRow,
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
  const isTablet = useTabletMediaQuery()
  const ownerProfilePicture = useProfilePicture(community.ownerAddress)
  const theme = useTheme<Theme>()
  const ownerAvatarBackgroundColor = getRandomRarityColor(theme)

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

  const renderJoinedButton = () => (
    <CTAButton variant="outlined" color="secondary" disabled>
      <Icon component={muiIcons.Check} fontSize="small" />
      {t("community_info.joined")}
    </CTAButton>
  )

  const renderSignInButton = () => {
    const action = isPrivate
      ? AllowedAction.REQUEST_TO_JOIN
      : AllowedAction.JOIN
    return (
      <CTAButton
        color="primary"
        variant="contained"
        onClick={() =>
          redirectToAuth(`/communities/${community.id}`, { action })
        }
      >
        {t("community_info.sign_in_to_join")}
      </CTAButton>
    )
  }

  const renderJoinButton = () => (
    <CTAButton
      color="primary"
      variant="contained"
      onClick={handleJoinClick}
      disabled={isPerformingCommunityAction}
    >
      {isPerformingCommunityAction
        ? t("global.loading")
        : t("community_info.join")}
    </CTAButton>
  )

  const renderPrivateActionButton = () => {
    if (isLoadingMemberRequests) {
      return (
        <CTAButton color="secondary" variant="contained" disabled>
          {t("global.loading")}
        </CTAButton>
      )
    }

    const isPerformingRequest = isPerformingCommunityAction
    const buttonLabel = isPerformingRequest
      ? t("global.loading")
      : hasPendingRequest
        ? t("community_info.cancel_request")
        : t("community_info.request_to_join")

    const onClickAction = hasPendingRequest
      ? handleCancelRequestClick
      : handleRequestToJoinClick

    return (
      <CTAButton
        color="secondary"
        variant="contained"
        onClick={onClickAction}
        disabled={isPerformingRequest}
      >
        {buttonLabel}
      </CTAButton>
    )
  }

  const renderActionButton = () => {
    if (isMember) {
      return renderJoinedButton()
    }

    if (!isLoggedIn) {
      return renderSignInButton()
    }

    if (isPrivate) {
      return renderPrivateActionButton()
    }

    return renderJoinButton()
  }

  const shouldShowJumpIn = isPrivate && isLoggedIn && !isTabletOrMobile

  return (
    <InfoSection>
      <TopRow>
        <CommunityImage>
          <CommunityImageContent
            src={thumbnailUrl || ""}
            alt={community.name}
          />
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
                  src={ownerProfilePicture}
                  backgroundColor={ownerAvatarBackgroundColor}
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
              {renderActionButton()}
              {shouldShowJumpIn && (
                <JumpIn
                  variant="button"
                  buttonText={t("community_info.jump_in")}
                  modalProps={{
                    title: t("community_info.jump_in_modal.title"),
                    description: t("community_info.jump_in_modal.description"),
                    buttonLabel: t("community_info.jump_in_modal.button_label"),
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
            </ActionButtons>
          </TitleContainer>
          {canViewContent && !isTablet && (
            <Description>{community.description}</Description>
          )}
        </CommunityDetails>
      </TopRow>
      {!canViewContent && isTablet && (
        <DescriptionRow data-testid="community-description-row">
          <Description>{community.description}</Description>
        </DescriptionRow>
      )}
    </InfoSection>
  )
}
