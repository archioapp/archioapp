"use client"

import { create } from "zustand"
import type { CopilotSuggestion, CopilotAction, ActionHandler } from "@/lib/copilot/types"

interface CopilotState {
  open: boolean
  unread: number
  suggestions: CopilotSuggestion[]
  actionsRegistry: Map<string, ActionHandler>
  setOpen: (v: boolean) => void
  addSuggestion: (s: CopilotSuggestion) => void
  resolveSuggestion: (id: string) => void
  registerAction: (id: string, handler: ActionHandler) => void
  runAction: (action: CopilotAction) => Promise<void>
}

export const useCopilotStore = create<CopilotState>((set, get) => ({
  open: false,
  unread: 0,
  suggestions: [],
  actionsRegistry: new Map(),
  setOpen: (v) => set({ open: v, unread: v ? 0 : get().unread }),
  addSuggestion: (s) =>
    set((st) => ({ suggestions: [s, ...st.suggestions], unread: st.open ? st.unread : st.unread + 1 })),
  resolveSuggestion: (id) => set((st) => ({ suggestions: st.suggestions.filter((x) => x.id !== id) })),
  registerAction: (id, handler) =>
    set((st) => {
      const next = new Map(st.actionsRegistry)
      next.set(id, handler)
      return { actionsRegistry: next }
    }),
  runAction: async (action) => {
    const h = get().actionsRegistry.get(action.id)
    if (!h) {
      console.warn(`[Copilot] no handler for action ${action.id}`)
      return
    }
    await h(action, { pushEvent: () => {} /* inject lastEvent if needed */ })
  },
}))
