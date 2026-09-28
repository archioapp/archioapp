"use client"

import { create } from "zustand"
import type { CommandMessage, CommandResponse, SuggestionChip } from "@/lib/command/types"

interface CommandLayerState {
  /* ── Rail State ── */
  railOpen: boolean
  railCollapsed: boolean // icon-only vs expanded
  setRailOpen: (v: boolean) => void
  setRailCollapsed: (v: boolean) => void
  toggleRail: () => void

  /* ── Command Bar State ── */
  commandBarOpen: boolean
  setCommandBarOpen: (v: boolean) => void
  toggleCommandBar: () => void

  /* ── Conversation ── */
  messages: CommandMessage[]
  isProcessing: boolean
  addUserMessage: (content: string) => string
  addAssistantMessage: (id: string, content: string, response?: CommandResponse) => void
  updateAssistantMessage: (id: string, updates: Partial<CommandMessage>) => void
  setProcessing: (v: boolean) => void
  clearMessages: () => void

  /* ── Pinned Results ── */
  pinnedCards: CommandMessage[]
  pinCard: (msg: CommandMessage) => void
  unpinCard: (id: string) => void

  /* ── Recents ── */
  recentQueries: string[]
  addRecentQuery: (q: string) => void
}

export const useCommandStore = create<CommandLayerState>((set, get) => ({
  /* ── Rail ── */
  railOpen: false,
  railCollapsed: true,
  setRailOpen: (v) => set({ railOpen: v }),
  setRailCollapsed: (v) => set({ railCollapsed: v }),
  toggleRail: () => {
    const { railOpen, railCollapsed } = get()
    if (!railOpen) {
      set({ railOpen: true, railCollapsed: false })
    } else if (!railCollapsed) {
      set({ railCollapsed: true })
    } else {
      set({ railOpen: false })
    }
  },

  /* ── Command Bar ── */
  commandBarOpen: false,
  setCommandBarOpen: (v) => set({ commandBarOpen: v }),
  toggleCommandBar: () => set((s) => ({ commandBarOpen: !s.commandBarOpen })),

  /* ── Conversation ── */
  messages: [],
  isProcessing: false,

  addUserMessage: (content) => {
    const id = crypto.randomUUID()
    const msg: CommandMessage = {
      id,
      role: "user",
      content,
      timestamp: Date.now(),
    }
    set((s) => ({ messages: [...s.messages, msg] }))
    // Track recent queries
    get().addRecentQuery(content)
    return id
  },

  addAssistantMessage: (id, content, response) => {
    const msg: CommandMessage = {
      id,
      role: "assistant",
      content,
      timestamp: Date.now(),
      response,
    }
    set((s) => ({ messages: [...s.messages, msg] }))
  },

  updateAssistantMessage: (id, updates) => {
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }))
  },

  setProcessing: (v) => set({ isProcessing: v }),

  clearMessages: () => set({ messages: [] }),

  /* ── Pinned ── */
  pinnedCards: [],
  pinCard: (msg) =>
    set((s) => ({
      pinnedCards: s.pinnedCards.some((p) => p.id === msg.id)
        ? s.pinnedCards
        : [...s.pinnedCards, msg],
    })),
  unpinCard: (id) =>
    set((s) => ({ pinnedCards: s.pinnedCards.filter((p) => p.id !== id) })),

  /* ── Recents ── */
  recentQueries: [],
  addRecentQuery: (q) =>
    set((s) => ({
      recentQueries: [q, ...s.recentQueries.filter((r) => r !== q)].slice(0, 20),
    })),
}))
