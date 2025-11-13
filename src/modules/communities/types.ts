type Community = {
  id: string
  name: string
  description: string
  memberCount: number
  imageUrl?: string
  bannerUrl?: string
  createdAt: number
  isMember?: boolean
}

type JoinCommunityResponse = {
  success: boolean
  message?: string
}

type LeaveCommunityResponse = {
  success: boolean
  message?: string
}

export type { Community, JoinCommunityResponse, LeaveCommunityResponse }
