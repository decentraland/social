import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Tabs } from './Tabs'
import type { TabType } from './Tabs'

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  const defaultProps = {
    activeTab: 'members' as TabType,
    onTabChange: jest.fn()
  }
  return render(<Tabs {...defaultProps} {...props} />)
}

describe('Tabs', () => {
  describe('when rendering tabs', () => {
    it('should display both Members and Upcoming Events tabs', () => {
      renderTabs()

      expect(screen.getByText('Members')).toBeInTheDocument()
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument()
    })

    it('should highlight the active tab', () => {
      renderTabs({ activeTab: 'members' })

      const membersTab = screen.getByText('Members').closest('div')
      expect(membersTab).toBeInTheDocument()
    })

    it('should call onTabChange when clicking on a tab', async () => {
      const onTabChange = jest.fn()
      const user = userEvent.setup()

      renderTabs({ activeTab: 'members', onTabChange })

      const eventsTab = screen.getByText('Upcoming Events')
      await user.click(eventsTab)

      expect(onTabChange).toHaveBeenCalledWith('events')
    })

    it('should call onTabChange with members when clicking on Members tab', async () => {
      const onTabChange = jest.fn()
      const user = userEvent.setup()

      renderTabs({ activeTab: 'events', onTabChange })

      const membersTab = screen.getByText('Members')
      await user.click(membersTab)

      expect(onTabChange).toHaveBeenCalledWith('members')
    })
  })
})
