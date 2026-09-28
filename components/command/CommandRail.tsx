"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useCommandStore } from "@/lib/stores/commandStore"
import { parseIntent } from "@/lib/command/intent-parser"
import { generateSuggestions } from "@/lib/command/suggestions"
import { SuggestionChips } from "@/components/command/CommandResultObjects"
import type { SuggestionChip } from "@/lib/command/types"
import {
  Terminal,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pin,
  Mic,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

const EASE = [0.22, 1, 0.36, 1] as const

function getUIMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function CommandRail() {
  const router = useRouter()
  const pathname = usePathname()
  const { railOpen, railCollapsed, setRailOpen, setRailCollapsed } = useCommandStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [localInput, setLocalInput] = useState("")
  const [currentSuggestions, setCurrentSuggestions] = useState<SuggestionChip[]>([])

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/command" }),
  })

  const isStreaming = status === "streaming" || status === "submitted"

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  // Focus input when rail opens
  useEffect(() => {
    if (railOpen && !railCollapsed) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [railOpen, railCollapsed])

  // Generate suggestions when assistant responds
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")
    const lastUser = [...messages].reverse().find((m) => m.role === "user")
    if (lastAssistant && lastUser) {
      const userText = getUIMessageText(lastUser)
      const parsed = parseIntent(userText)
      setCurrentSuggestions(generateSuggestions(parsed.intent, parsed.entities))
    }
  }, [messages])

  const handleSend = useCallback(() => {
    const text = localInput.trim()
    if (!text || isStreaming) return
    setLocalInput("")
    sendMessage({ text })
  }, [localInput, isStreaming, sendMessage])

  const handleSuggestionClick = useCallback((chip: SuggestionChip) => {
    if (chip.route) {
      router.push(chip.route)
      return
    }
    if (chip.query) {
      setLocalInput("")
      sendMessage({ text: chip.query })
    }
  }, [router, sendMessage])

  const handleClear = useCallback(() => {
    setMessages([])
    setCurrentSuggestions([])
  }, [setMessages])

  // Listen for command:send from CommandBar docking
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const query = e.detail?.query
      if (query) {
        sendMessage({ text: query })
      }
    }
    window.addEventListener("command:send", handler as EventListener)
    return () => window.removeEventListener("command:send", handler as EventListener)
  }, [sendMessage])

  if (!railOpen) return null

  // Collapsed state: icon strip
  if (railCollapsed) {
    return (
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-3 p-2 rounded-l-xl"
        style={{
          background: "linear-gradient(180deg, rgba(14,18,32,0.98) 0%, rgba(11,15,26,0.95) 100%)",
          borderLeft: "1px solid rgba(148,163,184,0.07)",
          borderTop: "1px solid rgba(148,163,184,0.07)",
          borderBottom: "1px solid rgba(148,163,184,0.07)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.4)",
        }}
      >
        <button
          onClick={() => setRailCollapsed(false)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-purple-500/10"
          aria-label="Expand command rail"
        >
          <Terminal className="w-5 h-5 text-purple-400" />
        </button>
        <button
          onClick={() => setRailCollapsed(false)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/5"
          aria-label="Expand"
        >
          <ChevronLeft className="w-4 h-4 text-white/50" />
        </button>
        {messages.length > 0 && (
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        )}
      </motion.div>
    )
  }

  // Full expanded rail
  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 480, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 480, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="fixed right-0 top-0 bottom-0 z-[60] flex flex-col"
        style={{
          width: "420px",
          background: "linear-gradient(180deg, rgba(10,12,21,0.99) 0%, rgba(8,10,18,0.98) 100%)",
          borderLeft: "1px solid rgba(148,163,184,0.07)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.5), 0 0 80px rgba(139,92,246,0.03)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(148,163,184,0.07)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)" }}>
              <Terminal className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white/92 tracking-tight">Archio Command</h2>
              <p className="text-[9px] font-mono uppercase tracking-widest text-white/28">Phase 1 Active</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200"
              aria-label="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRailCollapsed(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200"
              aria-label="Collapse rail"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRailOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200"
              aria-label="Close rail"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Messages Area ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(148,163,184,0.1) transparent",
          }}
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(139,92,246,0.08)" }}>
                <Sparkles className="w-7 h-7 text-purple-400/60" />
              </div>
              <h3 className="text-sm font-semibold text-white/70 mb-1">Command Layer Active</h3>
              <p className="text-[11px] text-white/35 leading-relaxed max-w-[260px]">
                Ask anything about your forecasts, mentors, accounts, performance, or plan. The platform is callable at the speed of thought.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {[
                  "Show my win rate by session",
                  "Compare my accounts",
                  "What should I focus on today?",
                  "Show EURUSD forecasts",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setLocalInput("")
                      sendMessage({ text: q })
                    }}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg border border-white/8 text-white/50 hover:text-white/70 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const text = getUIMessageText(msg)
            if (!text) return null

            if (msg.role === "user") {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="flex justify-end"
                >
                  <div className="max-w-[85%] rounded-xl px-3 py-2 text-xs text-white/90 leading-relaxed" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.15)" }}>
                    {text}
                  </div>
                </motion.div>
              )
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="space-y-2"
              >
                <div
                  className="rounded-xl px-3 py-2.5 text-[11px] text-white/80 leading-relaxed"
                  style={{
                    background: "linear-gradient(180deg, rgba(14,18,32,0.6) 0%, rgba(11,15,26,0.4) 100%)",
                    border: "1px solid rgba(148,163,184,0.05)",
                  }}
                >
                  <div className="whitespace-pre-wrap">{text}</div>
                </div>
              </motion.div>
            )
          })}

          {/* Streaming indicator */}
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-1"
            >
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400/20 animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-[10px] text-white/25 font-mono">Processing</span>
            </motion.div>
          )}

          {/* Suggestion chips after last response */}
          {currentSuggestions.length > 0 && !isStreaming && messages.length > 0 && (
            <SuggestionChips chips={currentSuggestions} onSelect={handleSuggestionClick} />
          )}
        </div>

        {/* ── Input Area ── */}
        <div
          className="flex-shrink-0 px-3 py-3"
          style={{ borderTop: "1px solid rgba(148,163,184,0.07)" }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 focus-within:border-purple-500/30"
            style={{
              background: "rgba(14,18,32,0.8)",
              border: "1px solid rgba(148,163,184,0.08)",
            }}
          >
            <input
              ref={inputRef}
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Command the platform..."
              className="flex-1 bg-transparent text-xs text-white/90 placeholder:text-white/25 focus:outline-none"
            />
            <button
              disabled
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/15 cursor-not-allowed"
              aria-label="Voice input coming soon"
              title="Voice input coming soon"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!localInput.trim() || isStreaming}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-purple-400 hover:bg-purple-500/10 disabled:text-white/15 disabled:hover:bg-transparent transition-all duration-200"
              aria-label="Send command"
            >
              {isStreaming ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[8px] font-mono uppercase tracking-widest text-white/15">
              {pathname}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-widest text-white/15">
              Cmd+Shift+A
            </span>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
