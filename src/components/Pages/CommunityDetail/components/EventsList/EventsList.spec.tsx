import { render, screen } from "@testing-library/react"
import { EventsList } from "./EventsList"
import { formatEventTime } from "../../../../../utils/dateFormat"

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

function renderEventsList(
  props: Partial<React.ComponentProps<typeof EventsList>> = {}
) {
  const defaultProps = {
    events: [] as Array<{
      id: string
      name: string
      image: string
      isLive: boolean
      startTime: string
    }>,
    isLoading: false,
    isFetchingMore: false,
    hasMore: false,
    onLoadMore: jest.fn() as jest.Mock,
  }
  return render(<EventsList {...defaultProps} {...props} />)
}

describe("when rendering the events list", () => {
  describe("and the list is loading", () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should display the section title", () => {
      renderEventsList({ isLoading: true })

      expect(screen.getByText("UPCOMING EVENTS")).toBeInTheDocument()
    })

    it("should display a loading indicator", () => {
      renderEventsList({ isLoading: true })

      expect(screen.getByRole("progressbar")).toBeInTheDocument()
    })
  })

  describe("and there are no events", () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should display the section title", () => {
      renderEventsList({ events: [] })

      expect(screen.getByText("UPCOMING EVENTS")).toBeInTheDocument()
    })

    it("should display an empty state message", () => {
      renderEventsList({ events: [] })

      expect(screen.getByText("No Upcoming Events")).toBeInTheDocument()
    })
  })

  describe("and there are events", () => {
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
          name: "Test Event 1",
          image: "https://example.com/image1.jpg",
          isLive: false,
          startTime: "2024-01-01T10:00:00Z",
        },
        {
          id: "event-2",
          name: "Test Event 2",
          image: "https://example.com/image2.jpg",
          isLive: true,
          startTime: "2024-01-02T10:00:00Z",
        },
      ]
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should display the section title", () => {
      renderEventsList({ events })

      expect(screen.getByText("UPCOMING EVENTS")).toBeInTheDocument()
    })

    it("should render all events", () => {
      renderEventsList({ events })

      expect(screen.getByText("Test Event 1")).toBeInTheDocument()
      expect(screen.getByText("Test Event 2")).toBeInTheDocument()
    })

    it("should display event images with correct alt text", () => {
      renderEventsList({ events })

      const images = screen.getAllByRole("img")
      expect(images[0]).toHaveAttribute("alt", "Test Event 1")
      expect(images[1]).toHaveAttribute("alt", "Test Event 2")
    })

    it("should display live badge for live events", () => {
      renderEventsList({ events })

      expect(screen.getByText("live")).toBeInTheDocument()
    })

    it("should not display live badge for non-live events", () => {
      const nonLiveEvents = [
        {
          id: "event-1",
          name: "Test Event 1",
          image: "https://example.com/image1.jpg",
          isLive: false,
          startTime: "2024-01-01T10:00:00Z",
        },
      ]

      renderEventsList({ events: nonLiveEvents })

      expect(screen.queryByText("live")).not.toBeInTheDocument()
    })

    it("should display event start times", () => {
      renderEventsList({ events })

      expect(screen.getByTestId("event-time-event-1")).toHaveTextContent(
        formatEventTime(events[0].startTime)
      )
      expect(screen.getByTestId("event-time-event-2")).toHaveTextContent(
        formatEventTime(events[1].startTime)
      )
    })
  })

  describe("and there are more events to load", () => {
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
          name: "Test Event 1",
          image: "https://example.com/image1.jpg",
          isLive: false,
          startTime: "2024-01-01T10:00:00Z",
        },
      ]
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should render the load more sentinel", () => {
      const { container } = renderEventsList({ events, hasMore: true })

      const sentinel = container.querySelector("div")
      expect(sentinel).toBeInTheDocument()
    })

    describe("and more events are being fetched", () => {
      it("should display a loading indicator in the sentinel", () => {
        renderEventsList({ events, hasMore: true, isFetchingMore: true })

        expect(screen.getByRole("progressbar")).toBeInTheDocument()
      })
    })

    describe("and more events are not being fetched", () => {
      it("should not display a loading indicator in the sentinel", () => {
        renderEventsList({ events, hasMore: true, isFetchingMore: false })

        const progressbars = screen.queryAllByRole("progressbar")
        expect(progressbars.length).toBe(0)
      })
    })
  })

  describe("and there are no more events to load", () => {
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
          name: "Test Event 1",
          image: "https://example.com/image1.jpg",
          isLive: false,
          startTime: "2024-01-01T10:00:00Z",
        },
      ]
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it("should not render the load more sentinel", () => {
      renderEventsList({ events, hasMore: false })

      const progressbars = screen.queryAllByRole("progressbar")
      expect(progressbars.length).toBe(0)
    })
  })
})
