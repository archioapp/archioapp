"use client"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { useChatThreads, type ThreadType } from "@/lib/stores/chatThreads"
import { useCoach } from "@/lib/stores/coach"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { QuickActions } from "@/components/copilot/chat/QuickActions"

function Seg({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded border text-xs transition
        ${
          active
            ? "border-violet-400 text-violet-300 bg-violet-400/10"
            : "border-white/10 text-white/70 hover:text-white hover:border-white/20"
        }`}
    >
      {label}
    </button>
  )
}

export function CopilotChatPanel() {
  const store = useChatThreads()
  const { threads, order, activeId, addUser, addAssistant, clearThread, archiveThread, renameThread } = store
  const active = threads[activeId]
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const [showHistory, setShowHistory] = useState(false)
  const history = useMemo(() => order.map((id) => threads[id]).filter((t) => t.archived), [order, threads])
  const profile = useCoach.getState?.() ?? {}

  // auto-scroll on new messages
  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e9, behavior: "smooth" })
  }, [active?.messages.length])

  // Workspace switcher
  const switchTo = useCallback(
    (type: ThreadType) => {
      store.switchToOrCreateByType(type)
    },
    [store],
  )

  // Ask API
  const askApi = async (text: string, ctx: any = {}) => {
    const res = await fetch("/api/copilot/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ q: text, context: { ...ctx, user: profile } }),
    })
    return res.json()
  }

  const send = async (text?: string) => {
    const t = (text ?? input).trim()
    if (!t || busy) return
    setInput("")
    setBusy(true)
    addUser(activeId, t)
    try {
      const data = await askApi(t)
      if (Array.isArray(data.messages)) addAssistant(activeId, data.messages)
      else if (data.a) addAssistant(activeId, data.a)
      else addAssistant(activeId, "No response.")
    } catch {
      addAssistant(activeId, "I couldn't fetch that right now.")
    } finally {
      setBusy(false)
    }
  }

  // Global events → route to current or specific thread
  const onSeed = useCallback(
    (e: any) => {
      const text: string | undefined = e.detail?.text
      const type: ThreadType | undefined = e.detail?.threadType
      const targetId = type ? store.switchToOrCreateByType(type) : activeId
      if (text) addAssistant(targetId, text)
      if (type) store.switchToThread(targetId)
    },
    [activeId, addAssistant, store],
  )

  const onAsk = useCallback(
    async (e: any) => {
      const text: string | undefined = e.detail?.text
      const type: ThreadType | undefined = e.detail?.threadType
      const ctx = e.detail?.context || {}
      const targetId = type ? store.switchToOrCreateByType(type) : activeId
      if (!text) return
      addUser(targetId, text)
      try {
        const data = await askApi(text, ctx)
        if (Array.isArray(data.messages)) addAssistant(targetId, data.messages)
        else if (data.a) addAssistant(targetId, data.a)
      } catch {
        addAssistant(targetId, "I couldn't fetch that right now.")
      }
    },
    [activeId, addAssistant, addUser, store],
  )

  const onActivityAsk = useCallback((e: any) => {
    // convenience: always route to Activity
    window.dispatchEvent(
      new CustomEvent("copilot:chat:ask", {
        detail: { text: e.detail?.text, context: e.detail?.context, threadType: "activity" },
      }),
    )
  }, [])

  useEffect(() => {
    window.addEventListener("copilot:chat:seed", onSeed as any)
    window.addEventListener("copilot:chat:ask", onAsk as any)
    window.addEventListener("copilot:activity:ask", onActivityAsk as any)
    return () => {
      window.removeEventListener("copilot:chat:seed", onSeed as any)
      window.removeEventListener("copilot:chat:ask", onAsk as any)
      window.removeEventListener("copilot:activity:ask", onActivityAsk as any)
    }
  }, [onSeed, onAsk, onActivityAsk])

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 py-1.5 border-b border-white/8 flex items-center justify-between">
        <div className="flex gap-1">
          <Seg label="Activity" active={active?.type === "activity"} onClick={() => switchTo("activity")} />
          <Seg label="Strategy" active={active?.type === "strategy"} onClick={() => switchTo("strategy")} />
          <Seg label="Psychology" active={active?.type === "psych"} onClick={() => switchTo("psych")} />
        </div>
        <div className="flex items-center gap-0.5">
          <Button size="sm" variant="ghost" className="h-5 px-1.5 text-xs" onClick={() => clearThread(activeId)}>
            Clear
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 px-1.5 text-xs"
            onClick={() => {
              archiveThread(activeId)
              setShowHistory(true)
            }}
          >
            A
          </Button>
          <Button size="sm" variant="ghost" className="h-5 px-1.5 text-xs" onClick={() => setShowHistory(true)}>
            +
          </Button>
        </div>
      </div>

      <ScrollArea ref={listRef} className="flex-1 p-2 mt-2">
        <div className="space-y-1.5 pt-1">
          {active?.type === "activity" && <QuickActions threadType="activity" />}
          {active?.type === "strategy" && <QuickActions threadType="strategy" />}
          {active?.type === "psych" && <QuickActions threadType="psych" />}

          {!active?.messages.length && (
            <div className="text-xs text-white/60 mt-3">
              This is **{active?.title}**. Ask anything (e.g. "optimize RR", "size 0.5%", "check session").
            </div>
          )}
          {active?.messages.map((m) => (
            <div key={m.id} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}>
              <div
                className={`rounded-md px-2 py-1.5 text-xs leading-4 transition-all duration-150 ${m.role === "user" ? "bg-white/8" : "bg-white/4"} whitespace-pre-wrap break-words`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-white/8 p-1.5 flex gap-1.5">
        <input
          className="flex-1 bg-white/4 border border-white/8 rounded-md text-xs px-2 h-7"
          placeholder={`Ask in ${active?.title}…`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              send()
            }
          }}
        />
        <Button className="h-7 px-2 text-xs" onClick={() => send()} disabled={busy}>
          Send
        </Button>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur" onClick={() => setShowHistory(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-[360px] bg-neutral-900 border-l border-white/10 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-semibold mb-2">Archived chats</div>
            <div className="space-y-2">
              {history.length === 0 && <div className="text-xs text-white/60">No archived chats.</div>}
              {history.map((t) => (
                <div key={t.id} className="rounded border border-white/10 p-2">
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-[11px] text-white/60 mb-2">
                    {t.type} · {new Date(t.updatedAt).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        store.switchToThread(t.id)
                        store.unarchiveThread(t.id)
                        setShowHistory(false)
                      }}
                    >
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        renameThread(t.id, prompt("Rename chat", t.title) || t.title)
                      }}
                    >
                      Rename
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
