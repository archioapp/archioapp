"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCommandStore } from "@/lib/stores/commandStore"
import { parseIntent } from "@/lib/command/intent-parser"
import {
  Terminal,
  Search,
  ArrowRight,
  CornerDownLeft,
  Dock,
  Loader2,
} from "lucide-react"

const EASE = [0.22, 1, 0.36, 1] as const

const EXAMPLE_QUERIES = [
  "Show my win rate by session",
  "Compare my prop vs personal account",
  "What should I focus on today?",
  "Show EURUSD forecasts this week",
  "How did I perform during London session?",
  "What confluences do I win most with?",
  "Compare JadeCap vs Sarah Kim",
  "Am I following my plan?",
]

export function CommandBar() {
  const { commandBarOpen, setCommandBarOpen, setRailOpen, setRailCollapsed } = useCommandStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Filter example queries based on input
  const filteredExamples = query.trim()
    ? EXAMPLE_QUERIES.filter((q) =>
        q.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : EXAMPLE_QUERIES.slice(0, 6)

  // Auto-focus on open
  useEffect(() => {
    if (commandBarOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery("")
      setPreview(null)
      setSelectedIndex(0)
    }
  }, [commandBarOpen])

  // Detect intent for inline preview
  useEffect(() => {
    if (query.trim().length > 3) {
      const parsed = parseIntent(query)
      const entityLabels = parsed.entities.map((e) => e.value).join(", ")
      setPreview(`${parsed.intent.toUpperCase()}${entityLabels ? ` \u2014 ${entityLabels}` : ""}`)
    } else {
      setPreview(null)
    }
  }, [query])

  const executeQuery = useCallback((q: string) => {
    if (!q.trim()) return
    // Dock to rail and send
    setCommandBarOpen(false)
    setRailOpen(true)
    setRailCollapsed(false)
    // Dispatch event for the rail to pick up
    window.dispatchEvent(
      new CustomEvent("command:execute", { detail: { query: q.trim() } })
    )
  }, [setCommandBarOpen, setRailOpen, setRailCollapsed])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setCommandBarOpen(false)
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        if (query.trim()) {
          executeQuery(query)
        } else if (filteredExamples[selectedIndex]) {
          executeQuery(filteredExamples[selectedIndex])
        }
        return
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filteredExamples.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      }
    },
    [query, filteredExamples, selectedIndex, executeQuery, setCommandBarOpen]
  )

  if (!commandBarOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
        onClick={() => setCommandBarOpen(false)}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        />

        {/* Command Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[580px] rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(14,18,32,0.98) 0%, rgba(10,12,21,0.99) 100%)",
            border: "1px solid rgba(148,163,184,0.1)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.06), 0 0 120px rgba(139,92,246,0.04)",
          }}
        >
          {/* Input row */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: "1px solid rgba(148,163,184,0.06)" }}
          >
            <Terminal className="w-5 h-5 text-purple-400/60 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Command the platform..."
              className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/25 focus:outline-none font-medium"
              autoComplete="off"
              spellCheck={false}
            />
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
            ) : (
              <div className="flex items-center gap-1 text-white/20 flex-shrink-0">
                <kbd className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 font-mono">ESC</kbd>
              </div>
            )}
          </div>

          {/* Intent preview */}
          {preview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-5 py-2 flex items-center gap-2"
              style={{ borderBottom: "1px solid rgba(148,163,184,0.04)" }}
            >
              <Search className="w-3 h-3 text-purple-400/40" />
              <span className="text-[10px] font-mono text-purple-400/50">{preview}</span>
            </motion.div>
          )}

          {/* Suggestions / Example queries */}
          <div className="px-2 py-2 max-h-[300px] overflow-y-auto">
            {filteredExamples.map((q, i) => (
              <button
                key={q}
                onClick={() => executeQuery(q)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                  i === selectedIndex
                    ? "bg-purple-500/8 text-white/90"
                    : "text-white/50 hover:text-white/70 hover:bg-white/3"
                }`}
              >
                <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 transition-all duration-150 ${
                  i === selectedIndex ? "text-purple-400" : "text-white/20"
                }`} />
                <span className="flex-1">{q}</span>
                {i === selectedIndex && (
                  <CornerDownLeft className="w-3 h-3 text-white/20" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-5 py-2.5"
            style={{ borderTop: "1px solid rgba(148,163,184,0.06)" }}
          >
            <div className="flex items-center gap-3 text-[9px] font-mono text-white/20 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" /> Execute
              </span>
              <span className="flex items-center gap-1">
                <Dock className="w-3 h-3" /> Dock to Rail
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/15 uppercase tracking-wider">
              Archio Command
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
