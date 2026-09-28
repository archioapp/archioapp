"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, RotateCcw, ClipboardList, ArrowRight, StickyNote, Bell } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

const QUICK_ACTIONS = [
  { label: "Recap", icon: RotateCcw, prompt: "Recap for current market." },
  { label: "Checklist", icon: ClipboardList, prompt: "Checklist" },
  { label: "Next Session", icon: ArrowRight, prompt: "Next session plan" },
  { label: "Add Note", icon: StickyNote, prompt: "Add note" },
]

export function SimpleActivityChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text?: string) => {
    const t = (text ?? input).trim()
    if (!t || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: t,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!text) setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: t, context: { threadType: "activity" } }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.a || data.messages?.[0] || "I couldn't process that request.",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 max-w-[280px]">
              <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 flex items-center justify-center">
                <Send className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-white/50 text-sm font-medium">Start a conversation with AI Copilot</div>
              <div className="text-white/30 text-xs leading-relaxed">
                Ask about market conditions, trading strategies, or get insights
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2.5 ${
                message.role === "user"
                  ? "bg-violet-500/15 border border-violet-500/25 text-white"
                  : "bg-white/[0.04] border border-white/[0.08] text-white/90"
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
              <div className="text-[10px] text-white/30 mt-1.5">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions - above input */}
      <div className="px-3 pb-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => handleSend(action.prompt)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-white/60 bg-white/[0.04] border border-white/[0.08] hover:text-white/90 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 whitespace-nowrap disabled:opacity-40"
            >
              <action.icon className="w-3 h-3" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/[0.08] p-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask AI Copilot..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/30 resize-none transition-all duration-200"
              rows={1}
              style={{ minHeight: "40px", maxHeight: "100px" }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-violet-500/80 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
