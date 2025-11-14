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
  url?: string
  live?: boolean
}

type EventsResponse = {
  data: Event[]
  ok: boolean
  total?: number
}

export type { Event, EventsResponse }
