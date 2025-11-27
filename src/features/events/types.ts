type Event = {
  id: string
  name: string
  description?: string
  image?: string
  startAt: string
  finishAt: string
  coordinates?: [number, number]
  server?: string
  sceneName?: string
  user?: string
  approved: boolean
  rejected: boolean
  attending?: number
  totalAttendees: number
  latestAttendees: string[]
  url?: string
  live?: boolean
}

type EventsResponse = {
  ok: boolean
  data: {
    events: Event[]
    total: number
  }
}

export type { Event, EventsResponse }
