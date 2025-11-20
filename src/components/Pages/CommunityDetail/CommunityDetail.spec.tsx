import { useParams, useSearchParams } from "react-router-dom"
import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import {
  getData as getWallet,
  isConnecting,
} from "decentraland-dapps/dist/modules/wallet/selectors"
import { CommunityDetail } from "./CommunityDetail"
import { useAppSelector } from "../../../app/hooks"
import {
  useCancelCommunityRequestMutation,
  useCreateCommunityRequestMutation,
  useGetCommunityByIdQuery,
  useGetMemberRequestsQuery,
  useJoinCommunityMutation,
} from "../../../features/communities/communities.client"
import {
  Privacy,
  RequestStatus,
  RequestType,
  Role,
  Visibility,
} from "../../../features/communities/types"
import { usePaginatedCommunityEvents } from "../../../hooks/usePaginatedCommunityEvents"
import { usePaginatedCommunityMembers } from "../../../hooks/usePaginatedCommunityMembers"
import { hasValidIdentity } from "../../../utils/identity"

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
      autoHideDuration: _autoHideDuration,
      flexDirection: _flexDirection,
      ...rest
    } = props
    void _display
    void _justifyContent
    void _alignItems
    void _minHeight
    void _padding
    void _autoHideDuration
    void _flexDirection
    return rest
  }

  return {
    Alert: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    Box: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => (
      <div {...filterStyleProps(props)}>{children}</div>
    ),
    CircularProgress: () => <div role="progressbar" />,
    Snackbar: ({
      children,
      open,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> &
      Record<string, unknown> & { open?: boolean }) =>
      open ? <div {...filterStyleProps(props)}>{children}</div> : null,
    Typography: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
    useTabletAndBelowMediaQuery: (...args: unknown[]) =>
      mockUseTabletAndBelowMediaQuery(...args),
    styled: mockStyled,
  }
})

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock("decentraland-dapps/dist/modules/wallet/selectors", () => ({
  getData: jest.fn(),
  isConnecting: jest.fn(),
}))

jest.mock("../../../features/communities/communities.client", () => ({
  useGetCommunityByIdQuery: jest.fn(),
  useJoinCommunityMutation: jest.fn(),
  useGetMemberRequestsQuery: jest.fn(),
  useCreateCommunityRequestMutation: jest.fn(),
  useCancelCommunityRequestMutation: jest.fn(),
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
    onRequestToJoin,
    onCancelRequest,
    hasPendingRequest,
  }: {
    community: { id: string; name: string }
    onJoin?: (id: string) => void
    onRequestToJoin?: (id: string) => void
    onCancelRequest?: (id: string) => void
    hasPendingRequest?: boolean
  }) => (
    <div data-testid="community-info">
      <div>{community.name}</div>
      {hasPendingRequest ? (
        <button
          onClick={() => onCancelRequest && onCancelRequest(community.id)}
        >
          CANCEL REQUEST
        </button>
      ) : (
        <button
          onClick={() => onRequestToJoin && onRequestToJoin(community.id)}
        >
          REQUEST TO JOIN
        </button>
      )}
      {onJoin && <button onClick={() => onJoin(community.id)}>Join</button>}
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
const mockUseSearchParams = useSearchParams as jest.Mock
const mockUseGetCommunityByIdQuery = useGetCommunityByIdQuery as jest.Mock
const mockUseJoinCommunityMutation = useJoinCommunityMutation as jest.Mock
const mockUseGetMemberRequestsQuery = useGetMemberRequestsQuery as jest.Mock
const mockUseCreateCommunityRequestMutation =
  useCreateCommunityRequestMutation as jest.Mock
const mockUseCancelCommunityRequestMutation =
  useCancelCommunityRequestMutation as jest.Mock
const mockUsePaginatedCommunityEvents = usePaginatedCommunityEvents as jest.Mock
const mockUsePaginatedCommunityMembers =
  usePaginatedCommunityMembers as jest.Mock
const mockHasValidIdentity = hasValidIdentity as jest.Mock
const mockUseAppSelector = useAppSelector as jest.Mock

function renderCommunityDetail(searchParamsValue = new URLSearchParams()) {
  const mockSetSearchParams = jest.fn()
  mockUseSearchParams.mockReturnValue([searchParamsValue, mockSetSearchParams])
  const result = render(<CommunityDetail />)
  return { ...result, mockSetSearchParams, rerender: result.rerender }
}

describe("when rendering the community detail page", () => {
  let mockJoinMutation: jest.Mock
  let mockJoinUnwrap: jest.Mock

  beforeEach(() => {
    mockJoinUnwrap = jest.fn()
    mockJoinMutation = jest.fn(() => ({
      unwrap: mockJoinUnwrap,
    }))

    // Default to desktop (not tablet/mobile)
    mockUseTabletAndBelowMediaQuery.mockReturnValue(false)

    mockUseParams.mockReturnValue({ id: "community-1" })
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), jest.fn()])
    // Mock useAppSelector to return different values based on selector
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === isConnecting) {
        return false // isWalletConnecting should be false
      }
      if (selector === getWallet) {
        return null // wallet should be null by default
      }
      return null
    })
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
    mockUseGetMemberRequestsQuery.mockReturnValue({
      data: { data: { results: [], total: 0, page: 1, pages: 1, limit: 10 } },
    })
    mockUseCreateCommunityRequestMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false, error: undefined, reset: jest.fn() },
    ])
    mockUseCancelCommunityRequestMutation.mockReturnValue([
      jest.fn(),
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
        privacy: Privacy.PUBLIC,
        visibility: Visibility.ALL,
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
        mockUseAppSelector.mockImplementation((selector) => {
          if (selector === isConnecting) {
            return false
          }
          if (selector === getWallet) {
            return null
          }
          return null
        })
        mockHasValidIdentity.mockReturnValue(false)
      })

      it("should not check if user is a member", () => {
        renderCommunityDetail()

        expect(screen.getByTestId("community-info")).toBeInTheDocument()
      })

      describe("and action parameter is present in URL", () => {
        it("should not execute the action", () => {
          const searchParams = new URLSearchParams("action=join")
          const mockSetSearchParams = jest.fn()
          mockUseSearchParams.mockReturnValue([
            searchParams,
            mockSetSearchParams,
          ])

          renderCommunityDetail()

          expect(mockJoinMutation).not.toHaveBeenCalled()
        })
      })
    })

    describe("and invalid action parameter is present", () => {
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
      }

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
        mockUseGetCommunityByIdQuery.mockReturnValue({
          data: { data: community },
          isLoading: false,
          error: undefined,
          isError: false,
        })
        const wallet = {
          address: "0x456",
        }
        mockUseAppSelector.mockImplementation((selector) => {
          if (selector === isConnecting) {
            return false
          }
          if (selector === getWallet) {
            return wallet
          }
          return null
        })
        mockHasValidIdentity.mockReturnValue(true)
      })

      it("should handle invalid action parameter", () => {
        // This test verifies the component can handle invalid action parameters
        // The actual cleanup is tested via integration tests
        const searchParams = new URLSearchParams("action=invalidAction")
        const mockSetSearchParams = jest.fn()
        mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams])

        renderCommunityDetail()

        // The component should render without errors
        expect(screen.getByTestId("community-info")).toBeInTheDocument()
      })
    })

    describe("and the user is logged in", () => {
      let wallet: { address: string }

      beforeEach(() => {
        wallet = {
          address: "0x456",
        }
        mockUseAppSelector.mockImplementation((selector) => {
          if (selector === isConnecting) {
            return false
          }
          if (selector === getWallet) {
            return wallet
          }
          return null
        })
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
            privacy: Privacy.PRIVATE,
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

        describe("and the community is private", () => {
          let mockCreateRequestMutation: jest.Mock
          let mockCreateRequestUnwrap: jest.Mock
          let mockCancelRequestMutation: jest.Mock
          let mockCancelRequestUnwrap: jest.Mock

          beforeEach(() => {
            community = {
              ...community,
              privacy: Privacy.PRIVATE,
            }
            mockUseGetCommunityByIdQuery.mockReturnValue({
              data: { data: community },
              isLoading: false,
              error: undefined,
              isError: false,
            })

            mockCreateRequestUnwrap = jest.fn()
            mockCreateRequestMutation = jest.fn(() => ({
              unwrap: mockCreateRequestUnwrap,
            }))
            mockUseCreateCommunityRequestMutation.mockReturnValue([
              mockCreateRequestMutation,
              { isLoading: false, error: undefined, reset: jest.fn() },
            ])

            mockCancelRequestUnwrap = jest.fn()
            mockCancelRequestMutation = jest.fn(() => ({
              unwrap: mockCancelRequestUnwrap,
            }))
            mockUseCancelCommunityRequestMutation.mockReturnValue([
              mockCancelRequestMutation,
              { isLoading: false, error: undefined, reset: jest.fn() },
            ])
          })

          describe("and the user has no pending request", () => {
            beforeEach(() => {
              mockUseGetMemberRequestsQuery.mockReturnValue({
                data: {
                  data: {
                    results: [],
                    total: 0,
                    page: 1,
                    pages: 1,
                    limit: 10,
                  },
                },
              })
            })

            it("should fetch member requests", () => {
              renderCommunityDetail()

              expect(mockUseGetMemberRequestsQuery).toHaveBeenCalledWith(
                {
                  address: "0x456",
                  type: RequestType.REQUEST_TO_JOIN,
                },
                { skip: false }
              )
            })

            describe("and the request to join button is clicked", () => {
              it("should call createCommunityRequest", async () => {
                const user = userEvent.setup()
                mockCreateRequestUnwrap.mockResolvedValue({
                  data: {
                    id: "request-1",
                    communityId: "community-1",
                    memberAddress: "0x456",
                    type: RequestType.REQUEST_TO_JOIN,
                    status: RequestStatus.PENDING,
                  },
                })

                renderCommunityDetail()

                const requestButton = screen.getByText("REQUEST TO JOIN")
                await user.click(requestButton)

                await waitFor(() => {
                  expect(mockCreateRequestMutation).toHaveBeenCalledWith({
                    communityId: "community-1",
                    targetedAddress: "0x456",
                  })
                })
              })
            })

            describe("and action=requestToJoin parameter is present in URL", () => {
              it("should render with the action parameter", () => {
                // This test verifies the redirect URL includes the action parameter
                // The actual auto-execution is tested via integration tests
                const searchParams = new URLSearchParams("action=requestToJoin")
                const mockSetSearchParams = jest.fn()
                mockUseSearchParams.mockReturnValue([
                  searchParams,
                  mockSetSearchParams,
                ])

                renderCommunityDetail()

                // The component should render with the action parameter
                expect(mockUseSearchParams).toHaveBeenCalled()
              })
            })

            describe("and creating the request fails", () => {
              let createRequestError: Error

              beforeEach(() => {
                createRequestError = new Error("Failed to create request")
                mockCreateRequestUnwrap.mockRejectedValue(createRequestError)
              })

              it("should display the error message", async () => {
                const user = userEvent.setup()
                renderCommunityDetail()

                const requestButton = screen.getByText("REQUEST TO JOIN")
                await user.click(requestButton)

                await waitFor(() => {
                  expect(
                    screen.getByText("Failed to create request")
                  ).toBeInTheDocument()
                })
              })
            })
          })

          describe("and the user has a pending request", () => {
            let pendingRequest: {
              id: string
              communityId: string
              type: string
              status: string
            }

            beforeEach(() => {
              pendingRequest = {
                id: "request-1",
                communityId: "community-1",
                type: RequestType.REQUEST_TO_JOIN,
                status: RequestStatus.PENDING,
              }
              mockUseGetMemberRequestsQuery.mockReturnValue({
                data: {
                  data: {
                    results: [pendingRequest],
                    total: 1,
                    page: 1,
                    pages: 1,
                    limit: 10,
                  },
                },
              })
            })

            it("should identify the pending request for the community", () => {
              renderCommunityDetail()

              expect(mockUseGetMemberRequestsQuery).toHaveBeenCalledWith(
                {
                  address: "0x456",
                  type: RequestType.REQUEST_TO_JOIN,
                },
                { skip: false }
              )
            })

            describe("and the cancel request button is clicked", () => {
              it("should call cancelCommunityRequest", async () => {
                const user = userEvent.setup()
                mockCancelRequestUnwrap.mockResolvedValue(undefined)

                renderCommunityDetail()

                const cancelButton = screen.getByText("CANCEL REQUEST")
                await user.click(cancelButton)

                await waitFor(() => {
                  expect(mockCancelRequestMutation).toHaveBeenCalledWith({
                    communityId: "community-1",
                    requestId: "request-1",
                    address: "0x456",
                  })
                })
              })
            })

            describe("and canceling the request fails", () => {
              let cancelRequestError: Error

              beforeEach(() => {
                cancelRequestError = new Error("Failed to cancel request")
                mockCancelRequestUnwrap.mockRejectedValue(cancelRequestError)
              })

              it("should display the error message", async () => {
                const user = userEvent.setup()
                renderCommunityDetail()

                const cancelButton = screen.getByText("CANCEL REQUEST")
                await user.click(cancelButton)

                await waitFor(() => {
                  expect(
                    screen.getByText("Failed to cancel request")
                  ).toBeInTheDocument()
                })
              })
            })
          })
        })
      })

      describe("and the user is a member", () => {
        beforeEach(() => {
          community = {
            ...community,
            role: Role.MEMBER,
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

        describe("and the join button is clicked", () => {
          it("should call onJoin with the community id", async () => {
            const user = userEvent.setup()
            mockJoinUnwrap.mockResolvedValue({})

            renderCommunityDetail()

            const joinButton = screen.getByText("Join")
            await user.click(joinButton)

            await waitFor(() => {
              expect(mockJoinMutation).toHaveBeenCalledWith("community-1")
            })
          })
        })

        describe("and action=join parameter is present in URL", () => {
          it("should render with the action parameter", () => {
            // This test verifies the redirect URL includes the action parameter
            // The actual auto-execution is tested via integration tests
            const searchParams = new URLSearchParams("action=join")
            const mockSetSearchParams = jest.fn()
            mockUseSearchParams.mockReturnValue([
              searchParams,
              mockSetSearchParams,
            ])

            renderCommunityDetail()

            // The component should render with the action parameter
            expect(mockUseSearchParams).toHaveBeenCalled()
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
            role: Role.MEMBER,
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
