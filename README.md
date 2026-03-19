# Decentraland Social UI

[![Coverage Status](https://coveralls.io/repos/github/decentraland/social/badge.svg?branch=main)](https://coveralls.io/github/decentraland/social?branch=main)

Social UI for Decentraland at social.decentraland.org. Focused on community discovery and detail pages, powered by the social-service-ea backend.

## Table of Contents

- [Features](#features)
- [Dependencies & Related Services](#dependencies--related-services)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [AI Agent Context](#ai-agent-context)

## Features

- **Community Detail Page**: View a community's info, members, posts, and places (`/communities/:id`)
- **Sign-In Redirect**: Handles auth redirects for social actions requiring a wallet

## Dependencies & Related Services

- **Social Service EA** ([github.com/decentraland/social-service-ea](https://github.com/decentraland/social-service-ea)): all community data (members, posts, places, metadata)
- **Catalyst / Peer API** (`dcl-catalyst-client`): profile and avatar data for community members
- **Auth UI**: sign-in redirect for actions requiring authentication

### What This UI Does NOT Handle

- Friendship management (handled by the in-Explorer social panel and social-service-ea API directly)
- Community administration (social-service-ea API)
- Private voice chat (comms-gatekeeper)
- Notifications (notifications-workers)

## Getting Started

### Prerequisites

- Node 20.x
- npm

### Installation

```bash
npm install
```

### Configuration

Create a copy of `.env.example` and name it `.env.development`:

```bash
cp .env.example .env.development
```

### Running the UI

```bash
npm run start
```

## Testing

### Running Tests

```bash
npm test
```

### Test Structure

Test files are located in `src/tests/`, using the `*.test.ts` naming convention.

## AI Agent Context

For detailed AI Agent context, see [docs/ai-agent-context.md](docs/ai-agent-context.md).

---
