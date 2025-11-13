import { AuthIdentity } from "@dcl/crypto"
import {
  Community,
  JoinCommunityResponse,
  LeaveCommunityResponse,
} from "./types"
import { config } from "../../config"

interface ICommunitiesClient {
  getCommunityById(id: string): Promise<Community>
  joinCommunity(
    id: string,
    identity: AuthIdentity
  ): Promise<JoinCommunityResponse>
  leaveCommunity(
    id: string,
    identity: AuthIdentity
  ): Promise<LeaveCommunityResponse>
}

class SocialServiceClient implements ICommunitiesClient {
  private url: string

  constructor(url: string) {
    this.url = url
  }

  async getCommunityById(id: string): Promise<Community> {
    const url = new URL(this.url)
    url.pathname = `/v1/communities/${id}`

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch community: ${response.statusText}`)
    }
    return response.json()
  }

  async joinCommunity(
    id: string,
    identity: AuthIdentity
  ): Promise<JoinCommunityResponse> {
    const url = new URL(this.url)
    url.pathname = `/v1/communities/${id}/join`

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: identity,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to join community: ${response.statusText}`)
    }
    return response.json()
  }

  async leaveCommunity(
    id: string,
    identity: AuthIdentity
  ): Promise<LeaveCommunityResponse> {
    const url = new URL(this.url)
    url.pathname = `/v1/communities/${id}/leave`

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: identity,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to leave community: ${response.statusText}`)
    }
    return response.json()
  }
}

const createSocialServiceClient = (): SocialServiceClient => {
  const serviceUrl = config.get("SOCIAL_SERVICE_URL")
  return new SocialServiceClient(serviceUrl)
}

export type { ICommunitiesClient }
export { SocialServiceClient, createSocialServiceClient }
