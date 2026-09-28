"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThreadType = "activity" | "strategy" | "psych" | "custom"
export type ChatMsg = { id: string; role: "user" | "assistant"; text: string; ts: number }
export type ChatThread = {
  id: string
  title: string
  type: ThreadType
  archived?: boolean
  messages: ChatMsg[]
  createdAt: number
  updatedAt: number
}

type State = {
  threads: Record<string, ChatThread>
  order: string[] // newest first
  activeId: string
  createThread: (type: ThreadType, title?: string) => string
  switchToThread: (id: string) => void
  switchToOrCreateByType: (type: ThreadType) => string
  renameThread: (id: string, title: string) => void
  clearThread: (id: string) => void
  archiveThread: (id: string) => void
  unarchiveThread: (id: string) => void
  addUser: (id: string, text: string) => void
  addAssistant: (id: string, text: string | string[]) => void
}

function newThread(type: ThreadType, title?: string): ChatThread {
  const id = crypto.randomUUID()
  return {
    id,
    title: title ?? (type === "activity" ? "Activity" : type[0].toUpperCase() + type.slice(1)),
    type,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export const useChatThreads = create<State>()(
  persist(
    (set, get) => {
      // boot with an Activity thread
      const t = newThread("activity", "Activity")
      const boot: Record<string, ChatThread> = { [t.id]: t }
      return {
        threads: boot,
        order: [t.id],
        activeId: t.id,

        createThread: (type, title) => {
          const th = newThread(type, title)
          set((s) => ({ threads: { ...s.threads, [th.id]: th }, order: [th.id, ...s.order], activeId: th.id }))
          return th.id
        },

        switchToThread: (id) => set({ activeId: id }),

        switchToOrCreateByType: (type) => {
          const { threads } = get()
          const found = Object.values(threads).find((x) => x.type === type && !x.archived)
          if (found) {
            set({ activeId: found.id })
            return found.id
          }
          return get().createThread(type)
        },

        renameThread: (id, title) =>
          set((s) => ({
            threads: { ...s.threads, [id]: { ...s.threads[id], title, updatedAt: Date.now() } },
          })),

        clearThread: (id) =>
          set((s) => ({
            threads: { ...s.threads, [id]: { ...s.threads[id], messages: [], updatedAt: Date.now() } },
          })),

        archiveThread: (id) =>
          set((s) => {
            const t = s.threads[id]
            if (!t) return {}
            const archived = { ...t, archived: true, updatedAt: Date.now() }
            const nextActive = s.order.find((x) => x !== id && !s.threads[x].archived) ?? id
            return { threads: { ...s.threads, [id]: archived }, activeId: nextActive }
          }),

        unarchiveThread: (id) =>
          set((s) => ({
            threads: { ...s.threads, [id]: { ...s.threads[id], archived: false, updatedAt: Date.now() } },
            activeId: id,
          })),

        addUser: (id, text) =>
          set((s) => {
            const t = s.threads[id]
            if (!t) return {}
            const msg: ChatMsg = { id: crypto.randomUUID(), role: "user", text, ts: Date.now() }
            return { threads: { ...s.threads, [id]: { ...t, messages: [...t.messages, msg], updatedAt: Date.now() } } }
          }),

        addAssistant: (id, text) =>
          set((s) => {
            const t = s.threads[id]
            if (!t) return {}
            const arr = Array.isArray(text) ? text : [text]
            const msgs = arr.map((tx) => ({ id: crypto.randomUUID(), role: "assistant", text: tx, ts: Date.now() }))
            return {
              threads: { ...s.threads, [id]: { ...t, messages: [...t.messages, ...msgs], updatedAt: Date.now() } },
            }
          }),
      }
    },
    { name: "copilot.chat.threads.v1" },
  ),
)
