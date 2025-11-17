import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { t } from "decentraland-dapps/dist/modules/translation/utils"
import { JumpIn } from "decentraland-ui2"
import { getThumbnailUrl } from "../../utils/communityUtils"
import {
  ActionButtons,
  CommunityDetails,
  CommunityImage,
  CommunityImageContent,
  Description,
  InfoSection,
  JoinButton,
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
  onLeave: (communityId: string) => Promise<void>
}

export const CommunityInfo = ({
  community,
  isLoggedIn,
  address,
  isPerformingCommunityAction,
  isMember,
  canViewContent,
  onJoin,
  onLeave,
}: CommunityInfoProps) => {
  const navigate = useNavigate()
  const thumbnailUrl = getThumbnailUrl(community.id)
  const isPrivate = community.privacy === "private"

  const handleJoinClick = useCallback(() => {
    if (!isLoggedIn || !address) {
      const currentPath = `/communities/${community.id}`
      navigate(`/sign-in?redirectTo=${encodeURIComponent(currentPath)}`)
      return
    }

    onJoin(community.id)
  }, [isLoggedIn, address, navigate, community.id, onJoin])

  const handleButtonClick = useCallback(() => {
    if (isMember) {
      onLeave(community.id)
    } else {
      handleJoinClick()
    }
  }, [isMember, onLeave, community.id, handleJoinClick])

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
                Members
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
              By{" "}
              <span className="owner-name">
                {community.ownerName || "Unknown"}
              </span>
            </OwnerText>
          </OwnerRow>
          <ActionButtons>
            {isMember ? (
              <JoinButton
                variant="outlined"
                onClick={handleButtonClick}
                disabled={isPerformingCommunityAction}
              >
                {isPerformingCommunityAction ? "Loading..." : "Leave"}
              </JoinButton>
            ) : !isLoggedIn ? (
              <JoinButton
                variant="outlined"
                onClick={() => {
                  const currentPath = `/communities/${community.id}`
                  navigate(
                    `/sign-in?redirectTo=${encodeURIComponent(currentPath)}`
                  )
                }}
              >
                SIGN IN TO JOIN
              </JoinButton>
            ) : isPrivate ? (
              <>
                <JoinButton
                  variant="outlined"
                  onClick={handleJoinClick}
                  disabled={isPerformingCommunityAction}
                >
                  {isPerformingCommunityAction
                    ? "Loading..."
                    : "REQUEST TO JOIN"}
                </JoinButton>
                {isLoggedIn && (
                  <JumpIn
                    variant="button"
                    buttonText="JUMP IN"
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
              <JoinButton
                variant="outlined"
                onClick={handleButtonClick}
                disabled={isPerformingCommunityAction}
              >
                {isPerformingCommunityAction ? "Loading..." : "JOIN"}
              </JoinButton>
            )}
          </ActionButtons>
        </TitleSubtitleContainer>
        {canViewContent && <Description>{community.description}</Description>}
      </CommunityDetails>
    </InfoSection>
  )
}
