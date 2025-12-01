import { render, screen } from "@testing-library/react"
import { MembersList } from "./MembersList"
import { Role } from "../../../../../features/communities/types"

jest.mock("../../../../../hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: jest.fn(() => ({ current: null })),
}))

function renderMembersList(
  props: Partial<React.ComponentProps<typeof MembersList>> = {}
) {
  const defaultProps = {
    members: [] as Array<{
      memberAddress: string
      name: string
      role: string
      profilePictureUrl: string
      hasClaimedName?: boolean
    }>,
    isLoading: false,
    isFetchingMore: false,
    hasMore: false,
    onLoadMore: jest.fn() as jest.Mock,
  }
  return render(<MembersList {...defaultProps} {...props} />)
}

describe("when rendering the members list", () => {
  describe("and the list is loading", () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should display the section title", () => {
      renderMembersList({ isLoading: true })

      expect(screen.getByText(/^MEMBERS/)).toBeInTheDocument()
    })

    it("should not display the section title when hideTitle is true", () => {
      renderMembersList({ isLoading: true, hideTitle: true })

      expect(screen.queryByText(/^MEMBERS/)).not.toBeInTheDocument()
    })

    it("should display a loading indicator", () => {
      renderMembersList({ isLoading: true })

      expect(screen.getByRole("progressbar")).toBeInTheDocument()
    })
  })

  describe("and there are no members", () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should display the section title", () => {
      renderMembersList({ members: [] })

      expect(screen.getByText(/^MEMBERS/)).toBeInTheDocument()
    })

    it("should not display the section title when hideTitle is true", () => {
      renderMembersList({ members: [], hideTitle: true })

      expect(screen.queryByText(/^MEMBERS/)).not.toBeInTheDocument()
    })

    it("should display an empty state message", () => {
      renderMembersList({ members: [] })

      expect(screen.getByText("No members found")).toBeInTheDocument()
    })
  })

  describe("and there are members", () => {
    let members: Array<{
      memberAddress: string
      name: string
      role: string
      profilePictureUrl: string
      hasClaimedName?: boolean
    }>

    beforeEach(() => {
      members = [
        {
          memberAddress: "0x111",
          name: "John Doe",
          role: "admin",
          profilePictureUrl: "https://example.com/john.jpg",
          hasClaimedName: false,
        },
        {
          memberAddress: "0x222",
          name: "Jane Smith",
          role: Role.MEMBER,
          profilePictureUrl: "https://example.com/jane.jpg",
          hasClaimedName: false,
        },
      ]
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should display the section title", () => {
      renderMembersList({ members })

      expect(screen.getByText(/^MEMBERS/)).toBeInTheDocument()
    })

    it("should not display the section title when hideTitle is true", () => {
      renderMembersList({ members, hideTitle: true })

      expect(screen.queryByText(/^MEMBERS/)).not.toBeInTheDocument()
    })

    it("should display the total count when provided", () => {
      renderMembersList({ members, total: 15 })

      expect(screen.getByText("MEMBERS (15)")).toBeInTheDocument()
    })

    it("should hide the total count when showCount is false", () => {
      renderMembersList({ members, total: 15, showCount: false })

      expect(screen.getByText("MEMBERS")).toBeInTheDocument()
      expect(screen.queryByText(/^MEMBERS \(\d+\)/)).not.toBeInTheDocument()
    })

    it("should render all members", () => {
      renderMembersList({ members })

      expect(screen.getByText("John Doe")).toBeInTheDocument()
      expect(screen.getByText("Jane Smith")).toBeInTheDocument()
    })

    it("should display member roles", () => {
      renderMembersList({ members })

      expect(screen.getByText("admin")).toBeInTheDocument()
      expect(screen.getByText("member")).toBeInTheDocument()
    })

    it("should show the claimed name icon when the member has claimed a name", () => {
      const claimedMembers = [
        {
          memberAddress: "0x123",
          name: "Claimed Member",
          role: Role.MEMBER,
          profilePictureUrl: "https://example.com/claimed.jpg",
          hasClaimedName: true,
        },
      ]

      renderMembersList({ members: claimedMembers })

      expect(screen.getByTestId("claimed-name-icon")).toBeInTheDocument()
    })

    it("should render member avatars", () => {
      renderMembersList({ members })

      const images = screen.getAllByRole("img")
      expect(images.length).toBeGreaterThan(0)
    })
  })

  describe("and there are more members to load", () => {
    let members: Array<{
      memberAddress: string
      name: string
      role: string
      profilePictureUrl: string
      mutualFriends: number
    }>

    beforeEach(() => {
      members = [
        {
          memberAddress: "0x111",
          name: "John Doe",
          role: "admin",
          profilePictureUrl: "https://example.com/john.jpg",
          mutualFriends: 0,
        },
      ]
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should render the load more sentinel", () => {
      const { container } = renderMembersList({ members, hasMore: true })

      const sentinel = container.querySelector("div")
      expect(sentinel).toBeInTheDocument()
    })

    describe("and more members are being fetched", () => {
      it("should display a loading indicator in the sentinel", () => {
        renderMembersList({ members, hasMore: true, isFetchingMore: true })

        expect(screen.getByRole("progressbar")).toBeInTheDocument()
      })
    })

    describe("and more members are not being fetched", () => {
      it("should not display a loading indicator in the sentinel", () => {
        renderMembersList({ members, hasMore: true, isFetchingMore: false })

        const progressbars = screen.queryAllByRole("progressbar")
        expect(progressbars.length).toBe(0)
      })
    })
  })

  describe("and there are no more members to load", () => {
    let members: Array<{
      memberAddress: string
      name: string
      role: string
      profilePictureUrl: string
      mutualFriends: number
    }>

    beforeEach(() => {
      members = [
        {
          memberAddress: "0x111",
          name: "John Doe",
          role: "admin",
          profilePictureUrl: "https://example.com/john.jpg",
          mutualFriends: 0,
        },
      ]
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should not render the load more sentinel", () => {
      renderMembersList({ members, hasMore: false })

      const progressbars = screen.queryAllByRole("progressbar")
      expect(progressbars.length).toBe(0)
    })
  })
})
