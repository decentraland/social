import { Box } from "decentraland-ui2"
import {
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
}

export const MembersList = ({ members }: MembersListProps) => {
  return (
    <MembersSection>
      <SectionTitle>MEMBERS</SectionTitle>
      <MemberListContainer>
        {members.map((memberItem, index) => (
          <MemberItem key={index}>
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
              <MemberMutualFriends>
                {memberItem.mutualFriends} Mutual Friends
              </MemberMutualFriends>
            </MemberInfo>
          </MemberItem>
        ))}
      </MemberListContainer>
    </MembersSection>
  )
}
