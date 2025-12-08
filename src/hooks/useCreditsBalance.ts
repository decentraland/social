import { useQuery } from "@tanstack/react-query"
import { formatEther } from "viem"
import { config } from "../config"

type Credit = {
  id: string
  userId: string
  balance: string
  expiresAt: number
  createdAt: number
  updatedAt: number
}

type CreditsResponse = {
  totalCredits: number
  credits: Credit[]
}

type CreditsBalance = {
  balance: number
  expiresAt: number
}

type UseCreditsBalanceOptions = {
  address?: string
  enabled?: boolean
}

type UseCreditsBalanceResult = {
  creditsBalance: CreditsBalance | undefined
  isLoading: boolean
  error: Error | null
}

async function fetchCredits(address: string): Promise<CreditsResponse | null> {
  const creditsUrl = config.get("CREDITS_SERVER_URL")

  if (!creditsUrl) {
    return null
  }

  try {
    const url = `${creditsUrl}/users/${address.toLowerCase()}/credits`
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch credits: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("[useCreditsBalance] Failed to fetch credits:", error)
    return null
  }
}

/**
 * Hook to fetch credits balance for a given address
 */
export function useCreditsBalance({
  address,
  enabled = true,
}: UseCreditsBalanceOptions): UseCreditsBalanceResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["credits", address],
    queryFn: () => fetchCredits(address!),
    enabled: enabled && !!address,
    staleTime: 60_000, // 1 minute
    retry: 1,
  })

  let creditsBalance: CreditsBalance | undefined

  if (data?.totalCredits) {
    // totalCredits is already a number (in wei), convert to ether
    const balance = Number(formatEther(BigInt(data.totalCredits)))

    // Get the earliest expiring credit
    const earliestExpiry =
      data.credits.length > 0
        ? Math.min(...data.credits.map((c) => c.expiresAt))
        : 0

    creditsBalance = {
      balance,
      expiresAt: earliestExpiry * 1000, // Convert to milliseconds
    }
  }

  return {
    creditsBalance,
    isLoading,
    error: error ?? null,
  }
}
