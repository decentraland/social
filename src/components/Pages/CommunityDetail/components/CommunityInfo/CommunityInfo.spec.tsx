import { useNavigate } from "react-router-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { CommunityInfo } from "./CommunityInfo"
import type { Community } from "../../../../../features/communities/types"

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}))

jest.mock("decentraland-ui2", () => ({
  ...jest.requireActual("decentraland-ui2"),
  JumpIn: ({
    buttonText,
    ...props
  }: {
    buttonText: string
  } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{buttonText}</button>
  ),
}))

jest.mock("decentraland-dapps/dist/modules/translation/utils", () => ({
  t: jest.fn((key: string) => key),
}))

jest.mock("../../utils/communityUtils", () => ({
  getThumbnailUrl: jest.fn(
    (id: string) => `https://example.com/thumbnails/${id}.jpg`
  ),
}))

const mockNavigate = useNavigate as jest.Mock

function renderCommunityInfo(
  props: Partial<React.ComponentProps<typeof CommunityInfo>> = {}
) {
  const defaultCommunity: Community = {
    id: "community-1",
    name: "Test Community",
    description: "Test Description",
    privacy: "public",
    visibility: "all",
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
      onLeave={jest.fn()}
      {...props}
    />
  )
}

describe("when rendering the community info", () => {
  let mockOnJoin: jest.Mock
  let mockOnLeave: jest.Mock
  let mockNavigateFn: jest.Mock

  beforeEach(() => {
    mockOnJoin = jest.fn()
    mockOnLeave = jest.fn()
    mockNavigateFn = jest.fn()
    mockNavigate.mockReturnValue(mockNavigateFn)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should display the community name", () => {
    const community: Community = {
      id: "community-1",
      name: "Test Community",
      description: "Test Description",
      privacy: "public",
      visibility: "all",
      active: true,
      membersCount: 100,
      ownerAddress: "0x123",
      ownerName: "Test Owner",
    }

    renderCommunityInfo({ community })

    expect(screen.getByText("Test Community")).toBeInTheDocument()
  })

  it("should display the community privacy badge", () => {
    const community: Community = {
      id: "community-1",
      name: "Test Community",
      description: "Test Description",
      privacy: "private",
      visibility: "all",
      active: true,
      membersCount: 100,
      ownerAddress: "0x123",
      ownerName: "Test Owner",
    }

    renderCommunityInfo({ community })

    expect(screen.getByText("private")).toBeInTheDocument()
  })

  it("should display the members count", () => {
    const community: Community = {
      id: "community-1",
      name: "Test Community",
      description: "Test Description",
      privacy: "public",
      visibility: "all",
      active: true,
      membersCount: 1500,
      ownerAddress: "0x123",
      ownerName: "Test Owner",
    }

    renderCommunityInfo({ community })

    expect(screen.getByText(/1.5K Members/)).toBeInTheDocument()
  })

  it("should display the owner name", () => {
    const community: Community = {
      id: "community-1",
      name: "Test Community",
      description: "Test Description",
      privacy: "public",
      visibility: "all",
      active: true,
      membersCount: 100,
      ownerAddress: "0x123",
      ownerName: "Test Owner",
    }

    renderCommunityInfo({ community })

    expect(screen.getByText(/By/)).toBeInTheDocument()
    expect(screen.getByText("Test Owner")).toBeInTheDocument()
  })

  it("should display the community description when canViewContent is true", () => {
    const community: Community = {
      id: "community-1",
      name: "Test Community",
      description: "Test Description",
      privacy: "public",
      visibility: "all",
      active: true,
      membersCount: 100,
      ownerAddress: "0x123",
      ownerName: "Test Owner",
    }

    renderCommunityInfo({ community, canViewContent: true })

    expect(screen.getByText("Test Description")).toBeInTheDocument()
  })

  it("should not display the community description when canViewContent is false", () => {
    const community: Community = {
      id: "community-1",
      name: "Test Community",
      description: "Test Description",
      privacy: "public",
      visibility: "all",
      active: true,
      membersCount: 100,
      ownerAddress: "0x123",
      ownerName: "Test Owner",
    }

    renderCommunityInfo({ community, canViewContent: false })

    expect(screen.queryByText("Test Description")).not.toBeInTheDocument()
  })

  describe("and the user is not logged in", () => {
    let community: Community

    beforeEach(() => {
      community = {
        id: "community-1",
        name: "Test Community",
        description: "Test Description",
        privacy: "public",
        visibility: "all",
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

    it("should navigate to sign in page when sign in button is clicked", () => {
      renderCommunityInfo({ community, isLoggedIn: false })

      const signInButton = screen.getByText("SIGN IN TO JOIN")
      fireEvent.click(signInButton)

      expect(mockNavigateFn).toHaveBeenCalledWith(
        "/sign-in?redirectTo=" + encodeURIComponent("/communities/community-1")
      )
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
        privacy: "public",
        visibility: "all",
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
            privacy: "public",
            visibility: "all",
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

        it("should call onJoin when join button is clicked", () => {
          renderCommunityInfo({
            community,
            isLoggedIn: true,
            address,
            isMember: false,
            onJoin: mockOnJoin,
          })

          const joinButton = screen.getByText("JOIN")
          fireEvent.click(joinButton)

          expect(mockOnJoin).toHaveBeenCalledWith("community-1")
        })

        it("should disable join button when performing community action", () => {
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

      describe("and the community is private", () => {
        beforeEach(() => {
          community = {
            id: "community-1",
            name: "Test Community",
            description: "Test Description",
            privacy: "private",
            visibility: "all",
            active: true,
            membersCount: 100,
            ownerAddress: "0x123",
            ownerName: "Test Owner",
          }
        })

        it("should display request to join button", () => {
          renderCommunityInfo({
            community,
            isLoggedIn: true,
            address,
            isMember: false,
          })

          expect(screen.getByText("REQUEST TO JOIN")).toBeInTheDocument()
        })

        it("should call onJoin when request to join button is clicked", () => {
          renderCommunityInfo({
            community,
            isLoggedIn: true,
            address,
            isMember: false,
            onJoin: mockOnJoin,
          })

          const requestButton = screen.getByText("REQUEST TO JOIN")
          fireEvent.click(requestButton)

          expect(mockOnJoin).toHaveBeenCalledWith("community-1")
        })

        it("should display jump in button", () => {
          renderCommunityInfo({
            community,
            isLoggedIn: true,
            address,
            isMember: false,
          })

          expect(screen.getByText("JUMP IN")).toBeInTheDocument()
        })

        it("should disable request to join button when performing community action", () => {
          renderCommunityInfo({
            community,
            isLoggedIn: true,
            address,
            isMember: false,
            isPerformingCommunityAction: true,
          })

          const requestButton = screen.getByText("Loading...")
          expect(requestButton).toBeDisabled()
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
          privacy: "public",
          visibility: "all",
          active: true,
          membersCount: 100,
          ownerAddress: "0x123",
          ownerName: "Test Owner",
        }
      })

      it("should display leave button", () => {
        renderCommunityInfo({
          community: memberCommunity,
          isLoggedIn: true,
          address,
          isMember: true,
        })

        expect(screen.getByText("Leave")).toBeInTheDocument()
      })

      it("should call onLeave when leave button is clicked", () => {
        renderCommunityInfo({
          community: memberCommunity,
          isLoggedIn: true,
          address,
          isMember: true,
          onLeave: mockOnLeave,
        })

        const leaveButton = screen.getByText("Leave")
        fireEvent.click(leaveButton)

        expect(mockOnLeave).toHaveBeenCalledWith("community-1")
      })

      it("should disable leave button when performing community action", () => {
        renderCommunityInfo({
          community: memberCommunity,
          isLoggedIn: true,
          address,
          isMember: true,
          isPerformingCommunityAction: true,
        })

        const leaveButton = screen.getByText("Loading...")
        expect(leaveButton).toBeDisabled()
      })
    })
  })
})
