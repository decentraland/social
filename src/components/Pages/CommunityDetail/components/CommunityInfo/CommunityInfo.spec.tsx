import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { CommunityInfo } from "./CommunityInfo"
import { Privacy, Visibility } from "../../../../../features/communities/types"
import { AllowedAction } from "../../CommunityDetail.types"
import type { Community } from "../../../../../features/communities/types"

const mockRedirectToAuth = jest.fn()
jest.mock("../../../../../utils/authRedirect", () => ({
  redirectToAuth: (...args: unknown[]) => mockRedirectToAuth(...args),
}))

const mockUseTabletAndBelowMediaQuery = jest.fn()
jest.mock("decentraland-ui2", () => {
  type StyleObject = Record<string, unknown>
  type StyleFunction = (props: { theme: unknown }) => StyleObject
  type Styles = StyleObject | StyleFunction

  const mockStyled = <T extends React.ComponentType<React.ComponentProps<T>>>(
    component: T
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_styles: Styles) => {
      return component
    }
  }

  const filterStyleProps = (props: Record<string, unknown>) => {
    const {
      display: _display,
      justifyContent: _justifyContent,
      alignItems: _alignItems,
      minHeight: _minHeight,
      padding: _padding,
      modalProps: _modalProps,
      buttonProps: _buttonProps,
      sx: _sx,
      ...rest
    } = props
    void _display
    void _justifyContent
    void _alignItems
    void _minHeight
    void _padding
    void _modalProps
    void _buttonProps
    void _sx
    return rest
  }

  const CheckIcon = () => (
    <svg data-testid="check-icon">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  )

  return {
    Avatar: ({
      src,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { src?: string }) => (
      <img {...props} src={src || ""} alt="" />
    ),
    Box: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => (
      <div {...filterStyleProps(props)}>{children}</div>
    ),
    Button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    Icon: ({
      component: Component,
      ...props
    }: {
      component?: React.ComponentType<Record<string, unknown>>
    } & React.HTMLAttributes<HTMLElement>) =>
      Component ? <Component {...props} /> : <span {...props} />,
    JumpIn: ({
      buttonText,
      ...props
    }: {
      buttonText: string
    } & React.ButtonHTMLAttributes<HTMLButtonElement> &
      Record<string, unknown>) => (
      <button {...filterStyleProps(props)}>{buttonText}</button>
    ),
    Typography: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
    muiIcons: {
      Check: CheckIcon,
    },
    useTabletAndBelowMediaQuery: (...args: unknown[]) =>
      mockUseTabletAndBelowMediaQuery(...args),
    styled: mockStyled,
  }
})

jest.mock("../../utils/communityUtils", () => ({
  getThumbnailUrl: jest.fn(
    (id: string) => `https://example.com/thumbnails/${id}.jpg`
  ),
}))

const mockUseProfilePicture = jest.fn()
jest.mock("../../../../../hooks/useProfilePicture", () => ({
  useProfilePicture: (...args: unknown[]) => mockUseProfilePicture(...args),
}))

function renderCommunityInfo(
  props: Partial<React.ComponentProps<typeof CommunityInfo>> = {}
) {
  const defaultCommunity: Community = {
    id: "community-1",
    name: "Test Community",
    description: "Test Description",
    privacy: Privacy.PUBLIC,
    visibility: Visibility.ALL,
    active: true,
    membersCount: 100,
    ownerAddress: "0x123",
    ownerName: "Test Owner",
  }

  return render(
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

describe("when rendering the community info", () => {
  let mockOnJoin: jest.Mock
  let defaultCommunity: Community

  beforeEach(() => {
    mockOnJoin = jest.fn()
    mockRedirectToAuth.mockClear()
    mockUseProfilePicture.mockReset()
    mockUseProfilePicture.mockReturnValue("")
    defaultCommunity = {
      id: "community-1",
      name: "Test Community",
      description: "Test Description",
      privacy: Privacy.PUBLIC,
      visibility: Visibility.ALL,
      active: true,
      membersCount: 100,
      ownerAddress: "0x123",
      ownerName: "Test Owner",
    }
    // Default to desktop (not tablet/mobile)
    mockUseTabletAndBelowMediaQuery.mockReturnValue(false)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should display the community name", () => {
    renderCommunityInfo({ community: defaultCommunity })

    expect(screen.getByText("Test Community")).toBeInTheDocument()
  })

  describe("and the community is private", () => {
    let privateCommunity: Community

    beforeEach(() => {
      privateCommunity = {
        ...defaultCommunity,
        privacy: Privacy.PRIVATE,
      }
    })

    it("should display the privacy badge with private text", () => {
      renderCommunityInfo({ community: privateCommunity })

      expect(screen.getByText("private")).toBeInTheDocument()
    })
  })

  describe("and the community has many members", () => {
    let largeCommunity: Community

    beforeEach(() => {
      largeCommunity = {
        ...defaultCommunity,
        membersCount: 1500,
      }
    })

    it("should display the formatted members count", () => {
      renderCommunityInfo({ community: largeCommunity })

      expect(screen.getByText(/1.5K Members/)).toBeInTheDocument()
    })
  })

  it("should display the owner name with By prefix", () => {
    renderCommunityInfo({ community: defaultCommunity })

    expect(screen.getByText(/By/)).toBeInTheDocument()
    expect(screen.getByText("Test Owner")).toBeInTheDocument()
  })

  describe("and fetching the owner profile picture", () => {
    it("should call useProfilePicture with the owner address", () => {
      renderCommunityInfo({ community: defaultCommunity })

      expect(mockUseProfilePicture).toHaveBeenCalledWith("0x123")
    })

    describe("and the profile picture is available", () => {
      const profilePictureUrl = "https://example.com/profile.jpg"

      beforeEach(() => {
        mockUseProfilePicture.mockImplementation(() => profilePictureUrl)
      })

      it("should pass the profile picture URL to the avatar", () => {
        renderCommunityInfo({
          community: defaultCommunity,
        })

        // Verify the mock was called
        expect(mockUseProfilePicture).toHaveBeenCalledWith("0x123")

        // Find the owner avatar specifically (not the community thumbnail)
        // The owner avatar is inside the OwnerRow, which contains the "By" text
        const ownerRow = screen.getByText(/By/)
        const ownerAvatar = ownerRow.parentElement?.querySelector("img")
        expect(ownerAvatar).toHaveAttribute("src", profilePictureUrl)
      })
    })

    describe("and the profile picture is not available", () => {
      beforeEach(() => {
        mockUseProfilePicture.mockReturnValue("")
      })

      it("should pass empty string to the avatar", () => {
        renderCommunityInfo({
          community: defaultCommunity,
        })

        // Find the owner avatar specifically
        const ownerRow = screen.getByText(/By/)
        const ownerAvatar = ownerRow.parentElement?.querySelector("img")
        expect(ownerAvatar).toHaveAttribute("src", "")
      })
    })
  })

  describe("and content viewing is enabled", () => {
    it("should display the community description", () => {
      renderCommunityInfo({
        community: defaultCommunity,
        canViewContent: true,
      })

      expect(screen.getByText("Test Description")).toBeInTheDocument()
    })
  })

  describe("and content viewing is disabled", () => {
    it("should not display the community description", () => {
      renderCommunityInfo({
        community: defaultCommunity,
        canViewContent: false,
      })

      expect(screen.queryByText("Test Description")).not.toBeInTheDocument()
    })
  })

  describe("and the user is not logged in", () => {
    let community: Community

    beforeEach(() => {
      community = {
        id: "community-1",
        name: "Test Community",
        description: "Test Description",
        privacy: Privacy.PUBLIC,
        visibility: Visibility.ALL,
        active: true,
        membersCount: 100,
        ownerAddress: "0x123",
        ownerName: "Test Owner",
      }
    })

    it("should display sign in to join button", () => {
      renderCommunityInfo({ community, isLoggedIn: false })

      expect(screen.getByText("SIGN IN TO JOIN")).toBeInTheDocument()
    })

    describe("and the community is public", () => {
      describe("and the sign in button is clicked", () => {
        it("should redirect to auth URL with action=join", async () => {
          const user = userEvent.setup()
          renderCommunityInfo({ community, isLoggedIn: false })

          const signInButton = screen.getByText("SIGN IN TO JOIN")
          await user.click(signInButton)

          expect(mockRedirectToAuth).toHaveBeenCalledWith(
            `/communities/${community.id}`,
            { action: AllowedAction.JOIN }
          )
        })
      })
    })

    describe("and the community is private", () => {
      let privateCommunity: Community

      beforeEach(() => {
        privateCommunity = {
          ...community,
          privacy: Privacy.PRIVATE,
        }
      })

      describe("and the sign in button is clicked", () => {
        it("should redirect to auth URL with action=requestToJoin", async () => {
          const user = userEvent.setup()
          renderCommunityInfo({
            community: privateCommunity,
            isLoggedIn: false,
          })

          const signInButton = screen.getByText("SIGN IN TO JOIN")
          await user.click(signInButton)

          expect(mockRedirectToAuth).toHaveBeenCalledWith(
            `/communities/${privateCommunity.id}`,
            { action: AllowedAction.REQUEST_TO_JOIN }
          )
        })
      })
    })
  })

  describe("and the user is logged in", () => {
    let community: Community
    let address: string

    beforeEach(() => {
      community = {
        id: "community-1",
        name: "Test Community",
        description: "Test Description",
        privacy: Privacy.PUBLIC,
        visibility: Visibility.ALL,
        active: true,
        membersCount: 100,
        ownerAddress: "0x123",
        ownerName: "Test Owner",
      }
      address = "0x456"
    })

    describe("and the user is not a member", () => {
      describe("and the community is public", () => {
        beforeEach(() => {
          community = {
            id: "community-1",
            name: "Test Community",
            description: "Test Description",
            privacy: Privacy.PUBLIC,
            visibility: Visibility.ALL,
            active: true,
            membersCount: 100,
            ownerAddress: "0x123",
            ownerName: "Test Owner",
          }
        })

        it("should display join button", () => {
          renderCommunityInfo({
            community,
            isLoggedIn: true,
            address,
            isMember: false,
          })

          expect(screen.getByText("JOIN")).toBeInTheDocument()
        })

        describe("and the join button is clicked", () => {
          it("should call onJoin with the community id", async () => {
            const user = userEvent.setup()
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              onJoin: mockOnJoin,
            })

            const joinButton = screen.getByText("JOIN")
            await user.click(joinButton)

            expect(mockOnJoin).toHaveBeenCalledWith("community-1")
          })
        })

        describe("and a community action is being performed", () => {
          it("should disable the join button", () => {
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              isPerformingCommunityAction: true,
            })

            const joinButton = screen.getByText("Loading...")
            expect(joinButton).toBeDisabled()
          })
        })
      })

      describe("and the community is private", () => {
        let mockOnRequestToJoin: jest.Mock
        let mockOnCancelRequest: jest.Mock

        beforeEach(() => {
          community = {
            id: "community-1",
            name: "Test Community",
            description: "Test Description",
            privacy: Privacy.PRIVATE,
            visibility: Visibility.ALL,
            active: true,
            membersCount: 100,
            ownerAddress: "0x123",
            ownerName: "Test Owner",
          }
          mockOnRequestToJoin = jest.fn()
          mockOnCancelRequest = jest.fn()
        })

        describe("and the user has no pending request", () => {
          beforeEach(() => {
            mockOnRequestToJoin = jest.fn()
          })

          it("should display request to join button", () => {
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: false,
              onRequestToJoin: mockOnRequestToJoin,
            })

            expect(screen.getByText("REQUEST TO JOIN")).toBeInTheDocument()
          })

          describe("and the request to join button is clicked", () => {
            it("should call onRequestToJoin with the community id", async () => {
              const user = userEvent.setup()
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: false,
                onRequestToJoin: mockOnRequestToJoin,
              })

              const requestButton = screen.getByText("REQUEST TO JOIN")
              await user.click(requestButton)

              expect(mockOnRequestToJoin).toHaveBeenCalledWith("community-1")
            })
          })

          describe("and a community action is being performed", () => {
            it("should disable the request to join button", () => {
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: false,
                isPerformingCommunityAction: true,
              })

              const requestButton = screen.getByText("Loading...")
              expect(requestButton).toBeDisabled()
            })
          })

          it("should display jump in button on desktop", () => {
            mockUseTabletAndBelowMediaQuery.mockReturnValue(false) // Desktop
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: false,
            })

            expect(screen.getByText("JUMP IN")).toBeInTheDocument()
          })

          it("should not display jump in button on tablet/mobile", () => {
            mockUseTabletAndBelowMediaQuery.mockReturnValue(true) // Tablet/Mobile
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: false,
            })

            expect(screen.queryByText("JUMP IN")).not.toBeInTheDocument()
          })

          it("should disable request to join button when performing community action", () => {
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: false,
              isPerformingCommunityAction: true,
            })

            const requestButton = screen.getByText("Loading...")
            expect(requestButton).toBeDisabled()
          })
        })

        describe("and the user has a pending request", () => {
          beforeEach(() => {
            mockOnCancelRequest = jest.fn()
          })

          it("should display cancel request button", () => {
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: true,
              onCancelRequest: mockOnCancelRequest,
            })

            expect(screen.getByText("CANCEL REQUEST")).toBeInTheDocument()
          })

          describe("and the cancel request button is clicked", () => {
            it("should call onCancelRequest with the community id", async () => {
              const user = userEvent.setup()
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: true,
                onCancelRequest: mockOnCancelRequest,
              })

              const cancelButton = screen.getByText("CANCEL REQUEST")
              await user.click(cancelButton)

              expect(mockOnCancelRequest).toHaveBeenCalledWith("community-1")
            })
          })

          it("should display jump in button on desktop", () => {
            mockUseTabletAndBelowMediaQuery.mockReturnValue(false) // Desktop
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: true,
            })

            expect(screen.getByText("JUMP IN")).toBeInTheDocument()
          })

          it("should not display jump in button on tablet/mobile", () => {
            mockUseTabletAndBelowMediaQuery.mockReturnValue(true) // Tablet/Mobile
            renderCommunityInfo({
              community,
              isLoggedIn: true,
              address,
              isMember: false,
              hasPendingRequest: true,
            })

            expect(screen.queryByText("JUMP IN")).not.toBeInTheDocument()
          })

          describe("and a community action is being performed", () => {
            it("should disable the cancel request button", () => {
              renderCommunityInfo({
                community,
                isLoggedIn: true,
                address,
                isMember: false,
                hasPendingRequest: true,
                isPerformingCommunityAction: true,
              })

              const cancelButton = screen.getByText("Loading...")
              expect(cancelButton).toBeDisabled()
            })
          })
        })
      })
    })

    describe("and the user is a member", () => {
      let memberCommunity: Community

      beforeEach(() => {
        memberCommunity = {
          id: "community-1",
          name: "Test Community",
          description: "Test Description",
          privacy: Privacy.PUBLIC,
          visibility: Visibility.ALL,
          active: true,
          membersCount: 100,
          ownerAddress: "0x123",
          ownerName: "Test Owner",
        }
      })

      it("should display joined button with check icon", () => {
        renderCommunityInfo({
          community: memberCommunity,
          isLoggedIn: true,
          address,
          isMember: true,
        })

        expect(screen.getByText("JOINED")).toBeInTheDocument()
        expect(screen.getByTestId("check-icon")).toBeInTheDocument()
      })

      it("should have joined button disabled", () => {
        renderCommunityInfo({
          community: memberCommunity,
          isLoggedIn: true,
          address,
          isMember: true,
        })

        const joinedButton = screen.getByText("JOINED")
        expect(joinedButton).toBeDisabled()
      })
    })
  })
})
