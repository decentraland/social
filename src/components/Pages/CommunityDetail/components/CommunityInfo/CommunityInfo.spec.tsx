/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react'
import type { Theme } from '@mui/material/styles'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Privacy, Visibility } from '../../../../../features/communities/types'
import type { Community } from '../../../../../features/communities/types'
import { renderWithProviders } from '../../../../../tests/testUtils'
import { AllowedAction } from '../../CommunityDetail.types'
import { CommunityInfo } from './CommunityInfo'

const mockRedirectToAuth = jest.fn()
jest.mock('../../../../../utils/authRedirect', () => ({
  redirectToAuth: (...args: unknown[]) => mockRedirectToAuth(...args)
}))

const mockTrack = jest.fn()
jest.mock('@dcl/hooks', () => ({
  useAnalytics: () => ({
    track: (...args: unknown[]) => mockTrack(...args)
  })
}))

jest.mock('../../../../../hooks/useUtmParams', () => ({
  useUtmParams: () => ({})
}))

// Create mock functions for the hooks that we can control
const mockUseTabletAndBelowMediaQuery = jest.fn()
const mockUseTabletMediaQuery = jest.fn()
const mockUseTheme = jest.fn()

jest.mock('decentraland-ui2', () => {
  const actual = jest.requireActual('decentraland-ui2')
  return {
    ...actual,
    Navbar: jest.fn().mockReturnValue(null),
    JumpIn: jest.fn(({ buttonText, buttonProps }: { buttonText?: string; buttonProps?: Record<string, unknown> }) => {
      return React.createElement('button', { ...buttonProps, 'data-testid': 'jump-in-button' }, buttonText || 'JUMP IN')
    }),
    useTabletAndBelowMediaQuery: (...args: unknown[]) => mockUseTabletAndBelowMediaQuery(...args),
    useTabletMediaQuery: (...args: unknown[]) => mockUseTabletMediaQuery(...args),
    useTheme: (...args: unknown[]) => mockUseTheme(...args)
  }
})

jest.mock('../../utils/communityUtils', () => ({
  getThumbnailUrl: jest.fn((id: string) => `https://example.com/thumbnails/${id}.jpg`)
}))

const mockUseProfilePicture = jest.fn()
jest.mock('../../../../../hooks/useProfilePicture', () => ({
  useProfilePicture: (...args: unknown[]) => mockUseProfilePicture(...args)
}))

const DESCRIPTION_ROW_TEST_ID = 'community-description-row'

function renderCommunityInfo(props: Partial<React.ComponentProps<typeof CommunityInfo>> = {}) {
  const defaultCommunity: Community = {
    id: 'community-1',
    name: 'Test Community',
    description: 'Test Description',
    privacy: Privacy.PUBLIC,
    visibility: Visibility.ALL,
    active: true,
    membersCount: 100,
    ownerAddress: '0x123',
    ownerName: 'Test Owner'
  }

  return renderWithProviders(
    <CommunityInfo
      community={defaultCommunity}
      isLoggedIn={false}
      address={undefined}
      isPerformingCommunityAction={false}
      isMember={false}
      canViewContent={true}
      onJoin={jest.fn()}
      {...props}
    />
  )
}

// Export the mock functions so we can control them in tests
const useTabletAndBelowMediaQuerySpy = mockUseTabletAndBelowMediaQuery
const useTabletMediaQuerySpy = mockUseTabletMediaQuery
const useThemeSpy = mockUseTheme

const mockTheme = {
  palette: {
    secondary: { main: '#FFFFFF' },
    raritiesText: {
      rare: '#34CE76'
    }
  }
} as unknown as Theme

describe('when rendering the community info', () => {
  let mockOnJoin: jest.Mock
  let defaultCommunity: Community

  beforeEach(() => {
    mockOnJoin = jest.fn()
    mockRedirectToAuth.mockClear()
    mockTrack.mockClear()
    mockUseProfilePicture.mockReset()
    mockUseProfilePicture.mockReturnValue('')
    defaultCommunity = {
      id: 'community-1',
      name: 'Test Community',
      description: 'Test Description',
      privacy: Privacy.PUBLIC,
      visibility: Visibility.ALL,
      active: true,
      membersCount: 100,
      ownerAddress: '0x123',
      ownerName: 'Test Owner'
    }
    // Default to desktop (not tablet/mobile)
    useTabletAndBelowMediaQuerySpy.mockReturnValue(false)
    useTabletMediaQuerySpy.mockReturnValue(false)
    useThemeSpy.mockReturnValue(mockTheme)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should display the community name', () => {
    renderCommunityInfo({ community: defaultCommunity })

    expect(screen.getByText('Test Community')).toBeInTheDocument()
  })

  describe('and the community is private', () => {
    let privateCommunity: Community

    beforeEach(() => {
      privateCommunity = {
        ...defaultCommunity,
        privacy: Privacy.PRIVATE
      }
    })

    it('should display the privacy badge with private text', () => {
      renderCommunityInfo({ community: privateCommunity })

      expect(screen.getByText('private')).toBeInTheDocument()
    })
  })

  describe('and the community has many members', () => {
    let largeCommunity: Community

    beforeEach(() => {
      largeCommunity = {
        ...defaultCommunity,
        membersCount: 1500
      }
    })

    it('should display the formatted members count', () => {
      renderCommunityInfo({ community: largeCommunity })

      expect(screen.getByText(/1.5K Members/)).toBeInTheDocument()
    })
  })

  it('should display the owner name with By prefix', () => {
    renderCommunityInfo({ community: defaultCommunity })

    expect(screen.getByText(/By/)).toBeInTheDocument()
    expect(screen.getByText('Test Owner')).toBeInTheDocument()
  })

  describe('and fetching the owner profile picture', () => {
    it('should call useProfilePicture with the owner address', () => {
      renderCommunityInfo({ community: defaultCommunity })

      expect(mockUseProfilePicture).toHaveBeenCalledWith('0x123')
    })

    describe('and the profile picture is available', () => {
      const profilePictureUrl = 'https://example.com/profile.jpg'

      beforeEach(() => {
        mockUseProfilePicture.mockImplementation(() => profilePictureUrl)
      })

      it('should pass the profile picture URL to the avatar', () => {
        renderCommunityInfo({
          community: defaultCommunity
        })

        // Verify the mock was called
        expect(mockUseProfilePicture).toHaveBeenCalledWith('0x123')

        // Find the owner avatar specifically (not the community thumbnail)
        // The owner avatar is inside the OwnerRow, which contains the "By" text
        const ownerRow = screen.getByText(/By/)
        const ownerAvatar = ownerRow.parentElement?.querySelector('img')
        expect(ownerAvatar).toHaveAttribute('src', profilePictureUrl)
      })
    })

    describe('and the profile picture is not available', () => {
      beforeEach(() => {
        mockUseProfilePicture.mockReturnValue('')
      })

      it('should pass empty string to the avatar', () => {
        renderCommunityInfo({
          community: defaultCommunity
        })

        // Find the owner avatar specifically
        const ownerRow = screen.getByText(/By/)
        const ownerAvatar =
          ownerRow.parentElement?.querySelector('img') ||
          ownerRow.parentElement?.querySelector('[data-testid="PersonIcon"]')?.closest('div')
        expect(ownerAvatar).toBeInTheDocument()
      })
    })
  })

  describe('and content viewing is enabled', () => {
    describe('and the device is not tablet', () => {
      beforeEach(() => {
        useTabletAndBelowMediaQuerySpy.mockReturnValue(false)
        useTabletMediaQuerySpy.mockReturnValue(false)
      })

      it('should display the community description', () => {
        renderCommunityInfo({
          community: defaultCommunity,
          canViewContent: true
        })

        expect(screen.getByText('Test Description')).toBeInTheDocument()
      })
    })

    describe('and the device is tablet', () => {
      beforeEach(() => {
        useTabletAndBelowMediaQuerySpy.mockReturnValue(true)
        useTabletMediaQuerySpy.mockReturnValue(true)
      })

      it('should render the description row', () => {
        renderCommunityInfo({
          community: defaultCommunity,
          canViewContent: true
        })

        expect(screen.getByTestId(DESCRIPTION_ROW_TEST_ID)).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
      })
    })
  })

  describe('and content viewing is disabled', () => {
    it('should not display the community description', () => {
      renderCommunityInfo({
        community: defaultCommunity,
        canViewContent: false
      })

      expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
      expect(screen.queryByTestId(DESCRIPTION_ROW_TEST_ID)).not.toBeInTheDocument()
    })
  })

  describe('and the user is not logged in', () => {
    let community: Community

    beforeEach(() => {
      community = {
        id: 'community-1',
        name: 'Test Community',
        description: 'Test Description',
        privacy: Privacy.PUBLIC,
        visibility: Visibility.ALL,
        active: true,
        membersCount: 100,
        ownerAddress: '0x123',
        ownerName: 'Test Owner'
      }
    })

    it('should display sign in to join button', () => {
      renderCommunityInfo({ community, isLoggedIn: false })

      expect(screen.getByText('SIGN IN TO JOIN')).toBeInTheDocument()
    })

    describe('and the community is public', () => {
      describe('and the sign in button is clicked', () => {
        it('should redirect to auth URL with action=join', async () => {
          const user = userEvent.setup()
          renderCommunityInfo({ community, isLoggedIn: false })

          const signInButton = screen.getByText('SIGN IN TO JOIN')
          await user.click(signInButton)

          expect(mockRedirectToAuth).toHaveBeenCalledWith(`/communities/${community.id}`, { action: AllowedAction.JOIN })
        })
      })
    })

    describe('and the community is private', () => {
      let privateCommunity: Community

      beforeEach(() => {
        privateCommunity = {
          ...community,
          privacy: Privacy.PRIVATE
        }
      })

      describe('and the sign in button is clicked', () => {
        it('should redirect to auth URL with action=requestToJoin', async () => {
          const user = userEvent.setup()
          renderCommunityInfo({
            community: privateCommunity,
            isLoggedIn: false
          })

          const signInButton = screen.getByText('SIGN IN TO JOIN')
          await user.click(signInButton)

          expect(mockRedirectToAuth).toHaveBeenCalledWith(`/communities/${privateCommunity.id}`, { action: AllowedAction.REQUEST_TO_JOIN })
        })
      })
    })
  })

  describe('and the user is logged in', () => {
    let community: Community
    let address: string

    beforeEach(() => {
      community = {
        id: 'community-1',
        name: 'Test Community',
        description: 'Test Description',
        privacy: Privacy.PUBLIC,
        visibility: Visibility.ALL,
        active: true,
        membersCount: 100,
        ownerAddress: '0x123',
        ownerName: 'Test Owner'
      }
      address = '0x456'
    })

    describe('and the user is not a member', () => {
      describe('and the community is public', () => {
        beforeEach(() => {
          community = {
            id: 'community-1',
            name: 'Test Community',
            description: 'Test Description',
            privacy: Privacy.PUBLIC,
            visibility: Visibility.ALL,
            active: true,
            membersCount: 100,
            ownerAddress: '0x123',
            ownerName: 'Test Owner'
          }
        })

        it('should display join button', () => {
          renderCommunityInfo({
            community,
            isLoggedIn: true,
            address,
            isMember: false
          })

          expect(screen.getByText('JOIN')).toBeInTheDocument()
        })

        describe('and the join button is clicked', () => {
          it('should call onJoin with the community id', async () => {
            const user = userEvent.setup()
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              onJoin: mockOnJoin
            })

            const joinButton = screen.getByText('JOIN')
            await user.click(joinButton)

            expect(mockOnJoin).toHaveBeenCalledWith('community-1')
          })
        })

        describe('and a community action is being performed', () => {
          it('should disable the join button', () => {
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              isPerformingCommunityAction: true
            })

            const joinButton = screen.getByText('Loading...')
            expect(joinButton).toBeDisabled()
          })
        })
      })

      describe('and the community is private', () => {
        let mockOnRequestToJoin: jest.Mock
        let mockOnCancelRequest: jest.Mock

        beforeEach(() => {
          community = {
            id: 'community-1',
            name: 'Test Community',
            description: 'Test Description',
            privacy: Privacy.PRIVATE,
            visibility: Visibility.ALL,
            active: true,
            membersCount: 100,
            ownerAddress: '0x123',
            ownerName: 'Test Owner'
          }
          mockOnRequestToJoin = jest.fn()
          mockOnCancelRequest = jest.fn()
        })

        describe('and the user has no pending request', () => {
          beforeEach(() => {
            mockOnRequestToJoin = jest.fn()
          })

          it('should display request to join button', () => {
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: false,
              onRequestToJoin: mockOnRequestToJoin
            })

            expect(screen.getByText('REQUEST TO JOIN')).toBeInTheDocument()
          })

          describe('and the request to join button is clicked', () => {
            it('should call onRequestToJoin with the community id', async () => {
              const user = userEvent.setup()
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: false,
                onRequestToJoin: mockOnRequestToJoin
              })

              const requestButton = screen.getByText('REQUEST TO JOIN')
              await user.click(requestButton)

              expect(mockOnRequestToJoin).toHaveBeenCalledWith('community-1')
            })
          })

          describe('and a community action is being performed', () => {
            it('should disable the request to join button', () => {
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: false,
                isPerformingCommunityAction: true
              })

              const requestButton = screen.getByText('Loading...')
              expect(requestButton).toBeDisabled()
            })
          })

          it('should not display jump in button', () => {
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: false
            })

            expect(screen.queryByText('JUMP IN')).not.toBeInTheDocument()
          })
        })

        describe('and the user has a pending request', () => {
          beforeEach(() => {
            mockOnCancelRequest = jest.fn()
          })

          it('should display cancel request button', () => {
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: true,
              onCancelRequest: mockOnCancelRequest
            })

            expect(screen.getByText('CANCEL REQUEST')).toBeInTheDocument()
          })

          describe('and the cancel request button is clicked', () => {
            it('should call onCancelRequest with the community id', async () => {
              const user = userEvent.setup()
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: true,
                onCancelRequest: mockOnCancelRequest
              })

              const cancelButton = screen.getByText('CANCEL REQUEST')
              await user.click(cancelButton)

              expect(mockOnCancelRequest).toHaveBeenCalledWith('community-1')
            })
          })

          describe('and the device is not tablet', () => {
            beforeEach(() => {
              useTabletAndBelowMediaQuerySpy.mockReturnValue(false)
            })

            it('should display jump in button', () => {
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: true
              })

              expect(screen.getByText('JUMP IN')).toBeInTheDocument()
            })
          })

          describe('and the device is tablet/mobile', () => {
            beforeEach(() => {
              useTabletAndBelowMediaQuerySpy.mockReturnValue(true)
            })

            it('should not display jump in button', () => {
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: true
              })

              expect(screen.queryByText('JUMP IN')).not.toBeInTheDocument()
            })
          })

          describe('and a community action is being performed', () => {
            it('should disable the cancel request button', () => {
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: true,
                isPerformingCommunityAction: true
              })

              const cancelButton = screen.getByText('Loading...')
              expect(cancelButton).toBeDisabled()
            })
          })
        })
      })
    })

    describe('and the user is a member', () => {
      let memberCommunity: Community

      beforeEach(() => {
        memberCommunity = {
          id: 'community-1',
          name: 'Test Community',
          description: 'Test Description',
          privacy: Privacy.PUBLIC,
          visibility: Visibility.ALL,
          active: true,
          membersCount: 100,
          ownerAddress: '0x123',
          ownerName: 'Test Owner'
        }
      })

      it('should display joined button with check icon', () => {
        renderCommunityInfo({
          community: memberCommunity,
          isLoggedIn: true,
          address,
          isMember: true
        })

        expect(screen.getByText('JOINED')).toBeInTheDocument()
        expect(screen.getByTestId('CheckIcon')).toBeInTheDocument()
      })

      it('should have joined button disabled', () => {
        renderCommunityInfo({
          community: memberCommunity,
          isLoggedIn: true,
          address,
          isMember: true
        })

        const joinedButton = screen.getByText('JOINED')
        expect(joinedButton).toBeDisabled()
      })

      describe('and the device is not tablet', () => {
        it('should display the jump in button', () => {
          useTabletAndBelowMediaQuerySpy.mockReturnValue(false)
          renderCommunityInfo({
            community: memberCommunity,
            isLoggedIn: true,
            address,
            isMember: true
          })

          expect(screen.getByText('JUMP IN')).toBeInTheDocument()
        })
      })

      describe('and the device is tablet', () => {
        it('should not display the jump in button', () => {
          useTabletAndBelowMediaQuerySpy.mockReturnValue(true)
          renderCommunityInfo({
            community: memberCommunity,
            isLoggedIn: true,
            address,
            isMember: true
          })

          expect(screen.queryByText('JUMP IN')).not.toBeInTheDocument()
        })
      })
    })
  })
})
