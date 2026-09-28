import { create } from "zustand"

type Log = { ts: number; type: string; payload?: any }

type S = {
  events: Log[]
  push: (type: string, payload?: any) => void
  clear: () => void
}

export const useEventLog = create<S>((set) => ({
  events: [],
  push: (type, payload) => set((s) => ({ events: [...s.events, { ts: Date.now(), type, payload }] })),
  clear: () => set({ events: [] }),
}))
