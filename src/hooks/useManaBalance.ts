import { useMemo } from "react"
import { ChainId } from "@dcl/schemas/dist/dapps/chain-id"
import { Network } from "@dcl/schemas/dist/dapps/network"
import { Abi, formatEther } from "viem"
import { useReadContracts } from "wagmi"
import { ContractName, getContract } from "decentraland-transactions"
import { config } from "../config"

type UseManaBalanceOptions = {
  address?: `0x${string}`
  enabled?: boolean
}

type UseManaBalanceResult = {
  manaBalances: Partial<Record<Network, number>> | undefined
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to fetch MANA balance for a given address using wagmi.
 * Fetches balances from both Ethereum and Polygon networks.
 * Uses contract addresses and ABIs from decentraland-transactions.
 */
export function useManaBalance({
  address,
  enabled = true,
}: UseManaBalanceOptions): UseManaBalanceResult {
  const chainId = Number(config.get("CHAIN_ID")) as ChainId

  // Determine which chains to query based on environment
  const ethereumChainId =
    chainId === ChainId.ETHEREUM_MAINNET
      ? ChainId.ETHEREUM_MAINNET
      : ChainId.ETHEREUM_SEPOLIA

  // Use Amoy for testnet, Polygon mainnet for prod
  const maticChainId =
    chainId === ChainId.ETHEREUM_MAINNET
      ? ChainId.MATIC_MAINNET
      : ChainId.MATIC_AMOY

  // Get MANA contracts from decentraland-transactions
  let ethereumContract: ReturnType<typeof getContract> | undefined
  let maticContract: ReturnType<typeof getContract> | undefined

  try {
    ethereumContract = getContract(ContractName.MANAToken, ethereumChainId)
  } catch {
    // Contract not available for this chain
  }

  try {
    maticContract = getContract(ContractName.MANAToken, maticChainId)
  } catch {
    // Contract not available for this chain
  }

  const queryEnabled = enabled && !!address

  const contracts: {
    address: `0x${string}`
    abi: Abi
    functionName: string
    args: readonly [`0x${string}`]
    chainId: number
  }[] = []

  if (ethereumContract && address) {
    contracts.push({
      address: ethereumContract.address as `0x${string}`,
      abi: ethereumContract.abi as Abi,
      functionName: "balanceOf",
      args: [address] as const,
      chainId: ethereumChainId,
    })
  }

  if (maticContract && address) {
    contracts.push({
      address: maticContract.address as `0x${string}`,
      abi: maticContract.abi as Abi,
      functionName: "balanceOf",
      args: [address] as const,
      chainId: maticChainId,
    })
  }

  const { data, isLoading, error } = useReadContracts({
    contracts,
    query: {
      enabled: queryEnabled && contracts.length > 0,
      staleTime: 30_000, // 30 seconds
    },
  })

  const manaBalances = useMemo<
    Partial<Record<Network, number>> | undefined
  >(() => {
    if (!data || !queryEnabled) {
      return undefined
    }

    const balances: Partial<Record<Network, number>> = {}
    let dataIndex = 0

    // Process Ethereum balance
    if (ethereumContract && data[dataIndex]) {
      const result = data[dataIndex]
      if (result.status === "success" && result.result !== undefined) {
        balances[Network.ETHEREUM] = Number(
          formatEther(result.result as bigint)
        )
      } else {
        balances[Network.ETHEREUM] = 0
      }
      dataIndex++
    }

    // Process Matic balance
    if (maticContract && data[dataIndex]) {
      const result = data[dataIndex]
      if (result.status === "success" && result.result !== undefined) {
        balances[Network.MATIC] = Number(formatEther(result.result as bigint))
      } else {
        balances[Network.MATIC] = 0
      }
    }

    return Object.keys(balances).length > 0 ? balances : undefined
  }, [data, queryEnabled, ethereumContract, maticContract])

  return {
    manaBalances,
    isLoading,
    error: error ?? null,
  }
}
