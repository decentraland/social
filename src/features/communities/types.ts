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

type MemberRequest = {
  id: string
  communityId: string
  memberAddress: string
  type: "invite" | "request_to_join"
  status: "pending" | "accepted" | "rejected" | "cancelled"
}

type MemberCommunityRequest = Omit<Community, "id"> & {
  id: string
  communityId: string
  type: "invite" | "request_to_join"
  status: "pending" | "accepted" | "rejected" | "cancelled"
}

type CreateCommunityRequestResponse = {
  data: MemberRequest
}

type PaginatedResponse<T> = {
  data: {
    results: T[]
    total: number
    page: number
    pages: number
    limit: number
  }
}

type MemberRequestsResponse = PaginatedResponse<MemberCommunityRequest>

export type {
  Community,
  CommunityResponse,
  CommunityMember,
  CommunityMembersResponse,
  JoinCommunityResponse,
  MemberRequest,
  MemberCommunityRequest,
  CreateCommunityRequestResponse,
  MemberRequestsResponse,
}
