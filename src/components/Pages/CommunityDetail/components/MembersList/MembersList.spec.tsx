import { render, screen } from "@testing-library/react"
import { MembersList } from "./MembersList"

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
      ...rest
    } = props
    void _display
    void _justifyContent
    void _alignItems
    void _minHeight
    void _padding
    return rest
  }

  return {
    Avatar: ({
      src,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img src={src} alt={alt || "Avatar"} {...props} />
    ),
    Box: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => (
      <div {...filterStyleProps(props)}>{children}</div>
    ),
    CircularProgress: () => <div role="progressbar" />,
    Typography: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
    styled: mockStyled,
  }
})

jest.mock("../../../../../hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: jest.fn(() => ({ current: null })),
}))

function renderMembersList(
  props: Partial<React.ComponentProps<typeof MembersList>> = {}
) {
  const defaultProps = {
    members: [] as Array<{ name: string; role: string; mutualFriends: number }>,
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

      expect(screen.getByText("MEMBERS")).toBeInTheDocument()
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

      expect(screen.getByText("MEMBERS")).toBeInTheDocument()
    })

    it("should display an empty state message", () => {
      renderMembersList({ members: [] })

      expect(screen.getByText("No members found")).toBeInTheDocument()
    })
  })

  describe("and there are members", () => {
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
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should display the section title", () => {
      renderMembersList({ members })

      expect(screen.getByText("MEMBERS")).toBeInTheDocument()
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

    it("should display mutual friends count when greater than zero", () => {
      renderMembersList({ members })

      expect(screen.getByText("5 Mutual Friends")).toBeInTheDocument()
    })

    it("should not display mutual friends when count is zero", () => {
      const membersWithoutMutualFriends = [
        {
          name: "John Doe",
          role: "admin",
          mutualFriends: 0,
        },
      ]

      renderMembersList({ members: membersWithoutMutualFriends })

      expect(screen.queryByText(/Mutual Friends/)).not.toBeInTheDocument()
    })

    it("should render member avatars", () => {
      renderMembersList({ members })

      const images = screen.getAllByRole("img")
      expect(images.length).toBeGreaterThan(0)
    })
  })

  describe("and there are more members to load", () => {
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
