import { useParams } from "react-router-dom"
import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { CommunityDetail } from "./CommunityDetail"
import { useAppSelector } from "../../../app/hooks"
import {
  useGetCommunityByIdQuery,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from "../../../features/communities/communities.client"
import { usePaginatedCommunityEvents } from "../../../hooks/usePaginatedCommunityEvents"
import { usePaginatedCommunityMembers } from "../../../hooks/usePaginatedCommunityMembers"
import { hasValidIdentity } from "../../../utils/identity"

jest.mock("decentraland-ui2", () => ({
  ...jest.requireActual("decentraland-ui2"),
  CircularProgress: () => <div role="progressbar" />,
  Snackbar: ({
    children,
    open,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { open?: boolean }) =>
    open ? <div {...props}>{children}</div> : null,
}))

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}))

jest.mock("decentraland-dapps/dist/modules/wallet/selectors", () => ({
  getData: jest.fn(),
}))

jest.mock("../../../features/communities/communities.client", () => ({
  useGetCommunityByIdQuery: jest.fn(),
  useJoinCommunityMutation: jest.fn(),
  useLeaveCommunityMutation: jest.fn(),
}))

jest.mock("../../../hooks/usePaginatedCommunityEvents", () => ({
  usePaginatedCommunityEvents: jest.fn(),
}))

jest.mock("../../../hooks/usePaginatedCommunityMembers", () => ({
  usePaginatedCommunityMembers: jest.fn(),
}))

jest.mock("../../../utils/identity", () => ({
  hasValidIdentity: jest.fn(),
}))

jest.mock("../../../app/hooks", () => ({
  useAppSelector: jest.fn(),
}))

jest.mock("./components/CommunityInfo", () => ({
  CommunityInfo: ({
    community,
    onJoin,
    onLeave,
  }: {
    community: { id: string; name: string }
    onJoin: (id: string) => void
    onLeave: (id: string) => void
  }) => (
    <div data-testid="community-info">
      <div>{community.name}</div>
      <button onClick={() => onJoin(community.id)}>Join</button>
      <button onClick={() => onLeave(community.id)}>Leave</button>
    </div>
  ),
}))

jest.mock("./components/EventsList", () => ({
  EventsList: ({
    events,
    isLoading,
  }: {
    events: Array<{ id: string; name: string }>
    isLoading: boolean
  }) => (
    <div data-testid="events-list">
      {isLoading ? (
        <div>Loading events...</div>
      ) : (
        events.map((event) => <div key={event.id}>{event.name}</div>)
      )}
    </div>
  ),
}))

jest.mock("./components/MembersList", () => ({
  MembersList: ({
    members,
    isLoading,
  }: {
    members: Array<{ name: string }>
    isLoading: boolean
  }) => (
    <div data-testid="members-list">
      {isLoading ? (
        <div>Loading members...</div>
      ) : (
        members.map((member, index) => <div key={index}>{member.name}</div>)
      )}
    </div>
  ),
}))

jest.mock("./components/PrivateMessage", () => ({
  PrivateMessage: () => (
    <div data-testid="private-message">Private Message</div>
  ),
}))

jest.mock("../../PageLayout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  ),
}))

const mockUseParams = useParams as jest.Mock
const mockUseGetCommunityByIdQuery = useGetCommunityByIdQuery as jest.Mock
const mockUseJoinCommunityMutation = useJoinCommunityMutation as jest.Mock
const mockUseLeaveCommunityMutation = useLeaveCommunityMutation as jest.Mock
const mockUsePaginatedCommunityEvents = usePaginatedCommunityEvents as jest.Mock
const mockUsePaginatedCommunityMembers =
  usePaginatedCommunityMembers as jest.Mock
const mockHasValidIdentity = hasValidIdentity as jest.Mock
const mockUseAppSelector = useAppSelector as jest.Mock

function renderCommunityDetail() {
  return render(<CommunityDetail />)
}

describe("when rendering the community detail page", () => {
  let mockJoinMutation: jest.Mock
  let mockLeaveMutation: jest.Mock
  let mockJoinUnwrap: jest.Mock
  let mockLeaveUnwrap: jest.Mock

  beforeEach(() => {
    mockJoinUnwrap = jest.fn()
    mockLeaveUnwrap = jest.fn()
    mockJoinMutation = jest.fn(() => ({
      unwrap: mockJoinUnwrap,
    }))
    mockLeaveMutation = jest.fn(() => ({
      unwrap: mockLeaveUnwrap,
    }))

    mockUseParams.mockReturnValue({ id: "community-1" })
    mockUseAppSelector.mockReturnValue(null)
    mockHasValidIdentity.mockReturnValue(false)
    mockUseGetCommunityByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      isError: false,
    })
    mockUseJoinCommunityMutation.mockReturnValue([
      mockJoinMutation,
      { isLoading: false, error: undefined, reset: jest.fn() },
    ])
    mockUseLeaveCommunityMutation.mockReturnValue([
      mockLeaveMutation,
      { isLoading: false, error: undefined, reset: jest.fn() },
    ])
    mockUsePaginatedCommunityEvents.mockReturnValue({
      events: [],
      isLoading: false,
      isFetchingMore: false,
      hasMore: false,
      loadMore: jest.fn(),
    })
    mockUsePaginatedCommunityMembers.mockReturnValue({
      members: [],
      isLoading: false,
      isFetchingMore: false,
      hasMore: false,
      loadMore: jest.fn(),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("and the community id is not provided", () => {
    beforeEach(() => {
      mockUseParams.mockReturnValue({ id: undefined })
    })

    it("should skip the query", () => {
      renderCommunityDetail()

      expect(mockUseGetCommunityByIdQuery).toHaveBeenCalledWith("", {
        skip: true,
      })
    })
  })

  describe("and the community is loading", () => {
    beforeEach(() => {
      mockUseGetCommunityByIdQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: undefined,
        isError: false,
      })
    })

    it("should display a loading indicator", () => {
      renderCommunityDetail()

      expect(screen.getByRole("progressbar")).toBeInTheDocument()
    })
  })

  describe("and the community query fails", () => {
    let queryError: Error

    beforeEach(() => {
      queryError = new Error("Failed to fetch community")
      mockUseGetCommunityByIdQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: queryError,
        isError: true,
      })
    })

    it("should display an error message", () => {
      renderCommunityDetail()

      expect(screen.getByText("Failed to fetch community")).toBeInTheDocument()
    })
  })

  describe("and the community is not found", () => {
    beforeEach(() => {
      mockUseGetCommunityByIdQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: undefined,
        isError: false,
      })
    })

    it("should display a not found message", () => {
      renderCommunityDetail()

      expect(screen.getByText("Community not found")).toBeInTheDocument()
    })
  })

  describe("and the community is found", () => {
    let community: {
      id: string
      name: string
      description: string
      privacy: string
      visibility: string
      active: boolean
      membersCount: number
      ownerAddress: string
      ownerName: string
      role?: string
    }

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

      mockUseGetCommunityByIdQuery.mockReturnValue({
        data: { data: community },
        isLoading: false,
        error: undefined,
        isError: false,
      })
    })

    it("should render the community info", () => {
      renderCommunityDetail()

      expect(screen.getByTestId("community-info")).toBeInTheDocument()
      expect(screen.getByText("Test Community")).toBeInTheDocument()
    })

    describe("and the user is not logged in", () => {
      beforeEach(() => {
        mockUseAppSelector.mockReturnValue(null)
        mockHasValidIdentity.mockReturnValue(false)
      })

      it("should not check if user is a member", () => {
        renderCommunityDetail()

        expect(screen.getByTestId("community-info")).toBeInTheDocument()
      })
    })

    describe("and the user is logged in", () => {
      let wallet: { address: string }

      beforeEach(() => {
        wallet = {
          address: "0x456",
        }
        mockUseAppSelector.mockReturnValue(wallet)
        mockHasValidIdentity.mockReturnValue(true)
      })

      describe("and the user is not a member", () => {
        beforeEach(() => {
          community = {
            ...community,
            role: "none",
          }
          mockUseGetCommunityByIdQuery.mockReturnValue({
            data: { data: community },
            isLoading: false,
            error: undefined,
            isError: false,
          })
        })

        it("should enable content viewing for public communities", () => {
          renderCommunityDetail()

          expect(screen.getByTestId("events-list")).toBeInTheDocument()
          expect(screen.getByTestId("members-list")).toBeInTheDocument()
        })

        it("should not enable content viewing for private communities", () => {
          community = {
            ...community,
            privacy: "private",
          }
          mockUseGetCommunityByIdQuery.mockReturnValue({
            data: { data: community },
            isLoading: false,
            error: undefined,
            isError: false,
          })

          renderCommunityDetail()

          expect(screen.getByTestId("private-message")).toBeInTheDocument()
          expect(screen.queryByTestId("events-list")).not.toBeInTheDocument()
          expect(screen.queryByTestId("members-list")).not.toBeInTheDocument()
        })
      })

      describe("and the user is a member", () => {
        beforeEach(() => {
          community = {
            ...community,
            role: "member",
          }
          mockUseGetCommunityByIdQuery.mockReturnValue({
            data: { data: community },
            isLoading: false,
            error: undefined,
            isError: false,
          })
        })

        it("should enable content viewing", () => {
          renderCommunityDetail()

          expect(screen.getByTestId("events-list")).toBeInTheDocument()
          expect(screen.getByTestId("members-list")).toBeInTheDocument()
        })

        it("should call onJoin with the community id when join button is clicked", async () => {
          const user = userEvent.setup()
          mockJoinUnwrap.mockResolvedValue({})

          renderCommunityDetail()

          const joinButton = screen.getByText("Join")
          await user.click(joinButton)

          await waitFor(() => {
            expect(mockJoinMutation).toHaveBeenCalledWith("community-1")
          })
        })

        it("should call onLeave with the community id when leave button is clicked", async () => {
          const user = userEvent.setup()
          mockLeaveUnwrap.mockResolvedValue({})

          renderCommunityDetail()

          const leaveButton = screen.getByText("Leave")
          await user.click(leaveButton)

          await waitFor(() => {
            expect(mockLeaveMutation).toHaveBeenCalledWith("community-1")
          })
        })

        describe("and joining the community fails", () => {
          let joinError: Error

          beforeEach(() => {
            joinError = new Error("Failed to join")
            mockJoinUnwrap.mockRejectedValue(joinError)
          })

          it("should display the error message from the failed join attempt", async () => {
            const user = userEvent.setup()
            renderCommunityDetail()

            const joinButton = screen.getByText("Join")
            await user.click(joinButton)

            await waitFor(() => {
              expect(screen.getByText("Failed to join")).toBeInTheDocument()
            })
          })
        })

        describe("and leaving the community fails", () => {
          let leaveError: Error

          beforeEach(() => {
            leaveError = new Error("Failed to leave")
            mockLeaveUnwrap.mockRejectedValue(leaveError)
          })

          it("should display the error message from the failed leave attempt", async () => {
            const user = userEvent.setup()
            renderCommunityDetail()

            const leaveButton = screen.getByText("Leave")
            await user.click(leaveButton)

            await waitFor(() => {
              expect(screen.getByText("Failed to leave")).toBeInTheDocument()
            })
          })
        })
      })
    })

    describe("and events are loading", () => {
      beforeEach(() => {
        mockUsePaginatedCommunityEvents.mockReturnValue({
          events: [],
          isLoading: true,
          isFetchingMore: false,
          hasMore: false,
          loadMore: jest.fn(),
        })
      })

      it("should display loading state for events", () => {
        renderCommunityDetail()

        expect(screen.getByText("Loading events...")).toBeInTheDocument()
      })
    })

    describe("and members are loading", () => {
      beforeEach(() => {
        mockUsePaginatedCommunityMembers.mockReturnValue({
          members: [],
          isLoading: true,
          isFetchingMore: false,
          hasMore: false,
          loadMore: jest.fn(),
        })
      })

      it("should display loading state for members", () => {
        renderCommunityDetail()

        expect(screen.getByText("Loading members...")).toBeInTheDocument()
      })
    })

    describe("and events are available", () => {
      let events: Array<{
        id: string
        name: string
        image: string
        isLive: boolean
        startTime: string
      }>

      beforeEach(() => {
        events = [
          {
            id: "event-1",
            name: "Event 1",
            image: "https://example.com/image1.jpg",
            isLive: false,
            startTime: "2024-01-01T10:00:00Z",
          },
          {
            id: "event-2",
            name: "Event 2",
            image: "https://example.com/image2.jpg",
            isLive: true,
            startTime: "2024-01-02T10:00:00Z",
          },
        ]

        mockUsePaginatedCommunityEvents.mockReturnValue({
          events,
          isLoading: false,
          isFetchingMore: false,
          hasMore: false,
          loadMore: jest.fn(),
        })
      })

      it("should render all events", () => {
        renderCommunityDetail()

        expect(screen.getByText("Event 1")).toBeInTheDocument()
        expect(screen.getByText("Event 2")).toBeInTheDocument()
      })
    })

    describe("and members are available", () => {
      let members: Array<{
        name: string
        role: string
        mutualFriends: number
      }>

      beforeEach(() => {
        members = [
          {
            name: "John Doe",
            role: "admin",
            mutualFriends: 0,
          },
          {
            name: "Jane Smith",
            role: "member",
            mutualFriends: 5,
          },
        ]

        mockUsePaginatedCommunityMembers.mockReturnValue({
          members,
          isLoading: false,
          isFetchingMore: false,
          hasMore: false,
          loadMore: jest.fn(),
        })
      })

      it("should render all members", () => {
        renderCommunityDetail()

        expect(screen.getByText("John Doe")).toBeInTheDocument()
        expect(screen.getByText("Jane Smith")).toBeInTheDocument()
      })
    })
  })
})
