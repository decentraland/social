enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

enum RequestType {
  INVITE = 'invite',
  REQUEST_TO_JOIN = 'request_to_join'
}

enum Privacy {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

enum Visibility {
  ALL = 'all',
  UNLISTED = 'unlisted'
}

enum Role {
  OWNER = 'owner',
  MODERATOR = 'moderator',
  MEMBER = 'member'
}

enum RequestIntention {
  CANCELLED = 'cancelled'
}

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
  privacy: Privacy
  visibility: Visibility
  active: boolean
  membersCount: number
  thumbnails?: CommunityThumbnails
  role?: Role
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
  role: Role
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
  type: RequestType
  status: RequestStatus
}

type MemberCommunityRequest = Omit<Community, 'id'> & {
  id: string
  communityId: string
  type: RequestType
  status: RequestStatus
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
  MemberRequestsResponse
}

export { Privacy, RequestIntention, RequestStatus, RequestType, Role, Visibility }
