import { memo, useCallback, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { Avatar } from "@dcl/schemas"
import { ChainId } from "@dcl/schemas/dist/dapps/chain-id"
import { useDisconnect, useSwitchChain } from "wagmi"
import { Navbar as NavbarComponent, NavbarProps } from "decentraland-ui2"
import { NavbarErrorBoundary } from "./NavbarErrorBoundary"
import { config } from "../../config"
import { useGetProfileQuery } from "../../features/profile/profile.client"
import { useCreditsBalance } from "../../hooks/useCreditsBalance"
import { useManaBalance } from "../../hooks/useManaBalance"
import { useWallet } from "../../modules/wallet/hooks"
import { redirectToAuth } from "../../utils/authRedirect"

const appChainId = Number(config.get("CHAIN_ID")) as ChainId

const Navbar = memo(() => {
  const { pathname, search } = useLocation()
  const { address, chainId, isConnected, isConnecting } = useWallet()
  const { switchChain, isPending: isSwitchingNetwork } = useSwitchChain()
  const { disconnect, isPending: isDisconnecting } = useDisconnect()

  // Load user profile for avatar display
  const { data: profile } = useGetProfileQuery(address ?? undefined, {
    skip: !address,
  })
  const avatar = profile?.avatars?.[0] as Avatar | undefined

  // Load MANA balance (both Ethereum and Polygon)
  const { manaBalances } = useManaBalance({
    address: address as `0x${string}` | undefined,
    enabled: isConnected,
  })

  // Load credits balance
  const { creditsBalance } = useCreditsBalance({
    address: address ?? undefined,
    enabled: isConnected,
  })

  const handleSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get("redirectTo")
    const redirectPath = currentRedirectTo || `${pathname}${search}`
    redirectToAuth(redirectPath)
  }, [pathname, search])

  const handleSignOut = useCallback(() => {
    disconnect()
  }, [disconnect])

  const handleSwitchNetwork = useCallback(
    (targetChainId: number) => {
      switchChain({ chainId: targetChainId })
    },
    [switchChain]
  )

  // Memoize navbar props - cast to NavbarProps to avoid @dcl/schemas version conflicts
  const navbarProps = useMemo(
    () =>
      ({
        // Auth state
        isSignedIn: isConnected,
        isSigningIn: isConnecting,
        isDisconnecting,
        address: address ?? undefined,

        // User profile & balances
        avatar,
        manaBalances,
        creditsBalance,
        hasActivity: false, // Not implemented - social dapp doesn't do on-chain transactions

        // Chain state
        chainId: chainId as ChainId | undefined,
        appChainId,
        isSwitchingNetwork,

        // UI config
        activePage: "social",

        // Event handlers
        onClickSignIn: handleSignIn,
        onClickSignOut: handleSignOut,
        onSelectChain: handleSwitchNetwork,
      }) as NavbarProps,
    [
      isConnected,
      isConnecting,
      isDisconnecting,
      address,
      avatar,
      manaBalances,
      creditsBalance,
      chainId,
      isSwitchingNetwork,
      handleSignIn,
      handleSignOut,
      handleSwitchNetwork,
    ]
  )

  return (
    <NavbarErrorBoundary>
      <NavbarComponent {...navbarProps} />
    </NavbarErrorBoundary>
  )
})

export { Navbar }
