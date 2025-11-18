type CommunityThumbnails = {
  [key: string]: string
}

type VoiceChatStatus = {
  isActive: boolean
  participantCount: number
  moderatorCount: number
}

type Community = {
  id: string
  name: string
  description: string
  ownerAddress: string
  ownerName?: string
  privacy: "public" | "private"
  visibility: "all" | "unlisted"
  active: boolean
  membersCount: number
  thumbnails?: CommunityThumbnails
  role?: "owner" | "moderator" | "member"
  voiceChatStatus?: VoiceChatStatus
}

type CommunityResponse = {
  data: Community
}

type JoinCommunityResponse = {
  success: boolean
  message?: string
}

type LeaveCommunityResponse = {
  success: boolean
  message?: string
}

type CommunityMember = {
  communityId: string
  memberAddress: string
  role: "owner" | "moderator" | "member"
  joinedAt: string
  profilePictureUrl?: string
  hasClaimedName?: boolean
  name?: string
  friendshipStatus?: number
}

type CommunityMembersResponse = {
  data: {
    results: CommunityMember[]
    total: number
    page: number
    pages: number
    limit: number
  }
}

export type {
  Community,
  CommunityResponse,
  CommunityMember,
  CommunityMembersResponse,
  JoinCommunityResponse,
  LeaveCommunityResponse,
}
