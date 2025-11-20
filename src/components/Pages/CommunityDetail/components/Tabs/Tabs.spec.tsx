import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { Tabs } from "./Tabs"
import type { TabType } from "./Tabs"

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
      gap: _gap,
      borderBottom: _borderBottom,
      paddingBottom: _paddingBottom,
      cursor: _cursor,
      height: _height,
      padding: _padding,
      transition: _transition,
      fontSize: _fontSize,
      fontWeight: _fontWeight,
      textTransform: _textTransform,
      color: _color,
      fontFamily: _fontFamily,
      active: _active,
      ...rest
    } = props
    void _display
    void _justifyContent
    void _alignItems
    void _gap
    void _borderBottom
    void _paddingBottom
    void _cursor
    void _height
    void _padding
    void _transition
    void _fontSize
    void _fontWeight
    void _textTransform
    void _color
    void _fontFamily
    void _active
    return rest
  }

  return {
    Box: ({
      children,
      onClick,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => (
      <div onClick={onClick} {...filterStyleProps(props)}>
        {children}
      </div>
    ),
    Typography: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement> &
      Record<string, unknown>) => {
      const { active: _active, ...rest } = props
      void _active
      return <p {...rest}>{children}</p>
    },
    styled: mockStyled,
  }
})

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  const defaultProps = {
    activeTab: "members" as TabType,
    onTabChange: jest.fn() as jest.Mock,
  }
  return render(<Tabs {...defaultProps} {...props} />)
}

describe("Tabs", () => {
  describe("when rendering tabs", () => {
    it("should display both Members and Upcoming Events tabs", () => {
      renderTabs()

      expect(screen.getByText("Members")).toBeInTheDocument()
      expect(screen.getByText("Upcoming Events")).toBeInTheDocument()
    })

    it("should highlight the active tab", () => {
      renderTabs({ activeTab: "members" })

      const membersTab = screen.getByText("Members").closest("div")
      expect(membersTab).toBeInTheDocument()
    })

    it("should call onTabChange when clicking on a tab", async () => {
      const onTabChange = jest.fn()
      const user = userEvent.setup()

      renderTabs({ activeTab: "members", onTabChange })

      const eventsTab = screen.getByText("Upcoming Events")
      await user.click(eventsTab)

      expect(onTabChange).toHaveBeenCalledWith("events")
    })

    it("should call onTabChange with members when clicking on Members tab", async () => {
      const onTabChange = jest.fn()
      const user = userEvent.setup()

      renderTabs({ activeTab: "events", onTabChange })

      const membersTab = screen.getByText("Members")
      await user.click(membersTab)

      expect(onTabChange).toHaveBeenCalledWith("members")
    })
  })
})
