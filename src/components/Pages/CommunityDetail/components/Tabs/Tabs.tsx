import { Tab, TabButton, TabText, TabsContainer } from './Tabs.styled'

type TabType = 'members' | 'events'

type TabsProps = {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  return (
    <TabsContainer>
      <Tab active={activeTab === 'members'} onClick={() => onTabChange('members')}>
        <TabButton>
          <TabText active={activeTab === 'members'}>Members</TabText>
        </TabButton>
      </Tab>
      <Tab active={activeTab === 'events'} onClick={() => onTabChange('events')}>
        <TabButton>
          <TabText active={activeTab === 'events'}>Upcoming Events</TabText>
        </TabButton>
      </Tab>
    </TabsContainer>
  )
}

export { Tabs }
export type { TabType }
