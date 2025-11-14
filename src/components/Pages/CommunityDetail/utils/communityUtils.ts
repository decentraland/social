import { config } from "../../../../config"

const getThumbnailUrl = (communityId?: string): string | undefined => {
  if (!communityId) return undefined
  const assetsCdnUrl = config.get("ASSETS_CDN_URL")
  return `${assetsCdnUrl}/social/communities/${communityId}/raw-thumbnail.png`
}

const isMember = (community?: { role?: string | undefined }): boolean => {
  return !!community?.role && community.role !== "none"
}

export { getThumbnailUrl, isMember }
