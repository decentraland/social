import { useCallback } from "react"
import { t } from "decentraland-dapps/dist/modules/translation/utils"
import { Icon, JumpIn, muiIcons } from "decentraland-ui2"
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
  Description,
  InfoSection,
  OwnerAvatar,
  OwnerAvatarContainer,
  OwnerRow,
  OwnerText,
  PrivacyBadgeContainer,
  PrivacyBadgeText,
  PrivacyDivider,
  PrivacyIcon,
  PrivacyMembersRow,
  PrivacyMembersText,
  Title,
  TitleRow,
  TitleSubtitleContainer,
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
        <TitleSubtitleContainer>
          <TitleRow>
            <Title>{community.name}</Title>
            <PrivacyMembersRow>
              <PrivacyBadgeContainer>
                <PrivacyIcon>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.59004 0C2.95629 0 0 2.95629 0 6.59004C0 10.2238 2.95629 13.1801 6.59004 13.1801C10.2238 13.1801 13.1801 10.2238 13.1801 6.59004C13.1801 2.95629 10.2238 0 6.59004 0ZM1.31801 6.59004C1.31801 5.99759 1.42081 5.42887 1.60204 4.89706L2.63602 5.93104L3.95402 7.24904V8.56705L5.27203 9.88506L5.93104 10.5441V11.8166C3.33522 11.4904 1.31801 9.2735 1.31801 6.59004ZM10.7615 9.80136C10.3312 9.45473 9.67879 9.22606 9.22606 9.22606V8.56705C9.22606 8.21749 9.08719 7.88225 8.84002 7.63508C8.59284 7.3879 8.2576 7.24904 7.90805 7.24904H5.27203V5.27203C5.62159 5.27203 5.95683 5.13317 6.204 4.886C6.45118 4.63882 6.59004 4.30358 6.59004 3.95402V3.29502H7.24904C7.5986 3.29502 7.93384 3.15616 8.18102 2.90898C8.42819 2.66181 8.56705 2.32657 8.56705 1.97701V1.70616C10.4966 2.48972 11.8621 4.38238 11.8621 6.59004C11.862 7.75298 11.4748 8.8828 10.7615 9.80136Z"
                      fill="#CFCDD4"
                    />
                  </svg>
                </PrivacyIcon>
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
          </TitleRow>
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
                {isLoggedIn && (
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
        </TitleSubtitleContainer>
        {canViewContent && <Description>{community.description}</Description>}
      </CommunityDetails>
    </InfoSection>
  )
}
