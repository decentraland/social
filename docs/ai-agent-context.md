# AI Agent Context

**Service Purpose:**

The Social site is a Vite+React SPA served at social.decentraland.org that surfaces Decentraland community pages. Its primary purpose is to render a public-facing detail page for a community — showing its name, description, member count, member list, associated events, and associated places — and to allow authenticated users to join or leave the community. It also handles a sign-in redirect flow for wallet authentication.

**Key Capabilities:**

- Community detail page: displays community metadata, members, events, and places for a given community ID at `/communities/:id`
- Join/leave community: authenticated users can join public communities or request membership in private ones
- Member list: paginated list of community members with roles (owner, moderator, member), profile pictures, and names
- Member requests: support for request-to-join and invite flows with accept/cancel/reject operations
- Events list: community-associated events fetched from the Events API
- Sign-in redirect: `/sign-in` page that initiates wallet authentication and returns the user to their intended destination
- Wallet sync: wallet state kept in sync via `WalletSyncProvider`
- Analytics: Segment event tracking
- Internationalization: react-intl
- Feature flags: via `src/modules/ff.ts` (not yet exposed as a full module, imported directly)
- Error monitoring: Sentry

**Communication Pattern:**

- HTTP REST to the Social Service API (`SOCIAL_SERVICE_URL`) for community data, member lists, and join/request mutations
- RTK Query (`@reduxjs/toolkit/query/react`) via a central `client` in `src/services/client.ts` — all API endpoints are defined as RTK Query endpoints injected into this base client
- Optimistic updates for join, leave, and request operations via `onQueryStarted` in RTK Query mutations
- HTTP REST to the Events API (`EVENTS_API_URL`) for community-associated events
- No WebSocket, no GraphQL
- Redux + redux-saga for wallet and global state; RTK Query for server state (communities, members, events)

**Technology Stack:**

- Runtime: Node.js 20.x, npm 10.x
- Language: TypeScript 5.5
- Frontend Framework: React 18 + Vite 5
- State Management: Redux 5 + Redux Toolkit 2 (RTK Query for server state) + redux-saga
- Wallet: decentraland-connect, `@dcl/single-sign-on-client`, Magic SDK (`magic-sdk`, `@magic-ext/oauth2`), Wagmi 2, viem 2, thirdweb
- UI Libraries: decentraland-ui, decentraland-ui2, decentraland-dapps
- Testing: Jest 29 + @testing-library/react
- Code Quality: ESLint 9 + Prettier, Husky pre-commit hooks

**External Dependencies:**

- Social Service API (`SOCIAL_SERVICE_URL`): REST API for community CRUD, member management, and request flows. Base path `/v1/communities/` and `/v1/members/`.
- Events API (`EVENTS_API_URL`): REST API for fetching events associated with a community
- Catalyst Lambdas (`CATALYST_LAMBDAS_URL`) / Peer (`PEER_URL`): profile resolution for member display names and avatars
- Auth service (`AUTH_URL`): Decentraland SSO for wallet authentication
- Magic SDK: email/social OAuth sign-in via Magic Link
- Sentry: error tracking
- Segment (`SEGMENT_API_KEY`): analytics

**Key Concepts:**

- **Community**: Core domain type defined in `src/features/communities/types.ts` and `src/modules/communities/types.ts`. Has `id`, `name`, `description`, `ownerAddress`, `privacy` (public/private), `visibility` (all/unlisted), `membersCount`, `thumbnails`, `role` (the signed-in user's role), and `voiceChatStatus`.
- **Role**: Enum — `OWNER`, `MODERATOR`, `MEMBER`. Drives UI affordances (e.g., only non-members see a Join button; owners see admin controls).
- **Privacy**: Enum — `PUBLIC` (anyone can join) vs `PRIVATE` (requires a request-to-join or invite). Determines whether join calls `POST /members` directly or `POST /requests`.
- **RequestType**: Enum — `REQUEST_TO_JOIN` or `INVITE`. Used in `MemberRequest` and `MemberCommunityRequest` types.
- **RequestStatus**: Enum — `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`. Tracks state of join requests.
- **RTK Query client** (`src/services/client.ts`): Created with `createApi`, `reducerPath: 'client'`, and tag types `Communities`, `Events`, `Members`, `MemberRequests`, `Profile`. All feature-level API modules inject endpoints into this shared client.
- **communitiesApi** (`src/features/communities/communities.client.ts`): Injects `getCommunityById`, `getCommunityMembers`, `joinCommunity`, `createCommunityRequest`, `cancelCommunityRequest`, `getMemberRequests` endpoints. Uses optimistic updates for join and request mutations.
- **Signed vs unsigned queries**: `getCommunityById` accepts `{ id, isSigned }`. The `isSigned` flag is included in the cache key so authenticated and unauthenticated requests do not share cache entries.
- **WalletSyncProvider** (`src/providers/WalletSyncProvider.tsx`): Keeps the Redux wallet slice in sync with the connected wallet from Wagmi/Magic.
- **WagmiProvider** (`src/providers/WagmiProvider.tsx`): Configures Wagmi with supported chains and connectors.
- **baseQuery** (`src/services/baseQuery.ts`): Custom RTK Query base query that injects Decentraland auth headers for signed requests.

**Out of Scope:**

- Community creation and moderation tools — creation may be handled elsewhere; moderation is not exposed in this app's current routes
- In-world voice chat — `voiceChatStatus` is displayed but voice chat itself runs in the Decentraland Explorer
- Profile pages — handled by profile.decentraland.org
- Event creation and management — handled by events.decentraland.org
- Reward and campaign management — handled by rewards.decentraland.org
- Marketplace — handled by the Marketplace app
- Direct messaging between users — the Social RPC service handles this; it is not exposed in this app's UI

**Project Structure:**

```
src/
  Routes.tsx               # Route definitions: /communities/:id, /sign-in, * (NotFound)
  main.tsx                 # App entry point, Redux store, providers, router
  app/
    store.ts               # Redux store setup combining RTK Query client and wallet reducers
    hooks.ts               # Typed useAppDispatch and useAppSelector hooks
  features/
    communities/
      communities.client.ts  # RTK Query endpoints for community and member operations
      types.ts               # Community, CommunityMember, MemberRequest types and enums
    events/
      events.client.ts       # RTK Query endpoints for community events
      types.ts               # Event types
    profile/               # Profile data fetching for member display
  components/
    Pages/
      CommunityDetail/       # Community detail page (CommunityDetail.tsx, types, spec)
        components/
          CommunityInfo/     # Header with name, description, member count, join button
          MembersList/       # Paginated member list with roles
          EventsList/        # Community-associated events
          PrivateMessage/    # Shown to non-members of private communities
          Tabs/              # Tab navigation (Members, Events, Places)
          utils/             # Page utility helpers
      NotFound/              # 404 page
      SignInRedirect/        # Sign-in redirect handler
    Navbar/                # Top navigation bar
    Footer/                # Page footer
    PageLayout/            # Shared page wrapper
  modules/
    analytics/
      events.ts            # Segment event definitions
    communities/
      types.ts             # Lightweight Community type used in Redux module
    translation/           # react-intl locale provider
    wallet/
      walletSlice.ts       # Redux slice for wallet connection state
      hooks.ts             # Wallet-related hooks
      constants.ts         # Chain/network constants
  services/
    client.ts              # RTK Query createApi base client
    baseQuery.ts           # Auth-aware fetchBaseQuery wrapper
  providers/
    TranslationProvider.tsx  # react-intl provider
    WagmiProvider.tsx        # Wagmi provider with chain/connector config
    WalletSyncProvider.tsx   # Syncs Wagmi wallet state into Redux
  config/
    index.ts               # @dcl/ui-env config setup
    env/
      dev.json             # Development environment variables
      stg.json             # Staging environment variables
      prd.json             # Production environment variables
  hooks/                   # Custom React hooks
  utils/                   # Shared utility functions
  tests/                   # Jest setup and test utilities
```

**Configuration:**

Key environment variables (set per-env in `src/config/env/`):

| Variable | Purpose |
|---|---|
| `SOCIAL_SERVICE_URL` | Social Service REST API base URL |
| `EVENTS_API_URL` | Events API base URL |
| `AUTH_URL` | Decentraland SSO endpoint |
| `CATALYST_LAMBDAS_URL` | Catalyst lambdas for profile resolution |
| `PEER_URL` | Catalyst peer base URL |
| `NETWORK` | Ethereum network name (e.g., `sepolia`) |
| `CHAIN_ID` | Ethereum chain ID |
| `MAGIC_API_KEY` | Magic Link API key for email/social sign-in |
| `THIRDWEB_CLIENT_ID` | Thirdweb client ID for wallet connectors |
| `SEGMENT_API_KEY` | Segment analytics write key |
| `ASSETS_CDN_URL` | CDN base URL for static assets |

**Testing:**

- Test runner: Jest 29 with `jest-environment-jsdom`
- Component tests co-located with source (e.g., `src/components/Pages/CommunityDetail/CommunityDetail.spec.tsx`)
- Global setup in `src/tests/beforeSetupTests.ts` and `src/tests/afterSetupTest.ts`
- Test utilities in `src/tests/testUtils.tsx`
- Run with `npm test`; coverage with `npm run test:coverage`
