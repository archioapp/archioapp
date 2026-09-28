"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SCREENS } from "./owen-data"

/* Obsidian · paper · teal — the product's own palette, so the screens read
   as a piece of the product and not a slide template. */
export const OW = {
  ink: "var(--vt-ink, #0A0E12)",
  ink2: "var(--vt-ink2, #141B21)",
  paper: "var(--vt-paper, #EAEFF4)",
  paperDim: "var(--vt-paper-dim, #C5CCD4)",
  ash: "var(--vt-ash, #7B8894)",
  ashSoft: "var(--vt-ash-soft, #5E6A75)",
  teal: "var(--vt-primary, #2DD4BF)",
  tealDim: "rgba(45,212,191,0.45)",
  rule: "var(--vt-rule, rgba(45,212,191,0.12))",
  hair: "rgba(234,239,244,0.09)",
  hairStrong: "rgba(234,239,244,0.16)",
  red: "#F0555A",
  amber: "#F59E0B",
}

export const EASE = [0.22, 1, 0.36, 1] as const

export function Eyebrow({ children, tone = "ash", size = 11, className = "" }: { children: React.ReactNode; tone?: "ash" | "teal" | "red" | "paper"; size?: number; className?: string }) {
  const color = tone === "teal" ? OW.teal : tone === "red" ? OW.red : tone === "paper" ? OW.paper : OW.ash
  return (
    <span className={`font-mono uppercase ${className}`} style={{ fontSize: size, letterSpacing: "0.22em", color, fontWeight: 500 }}>
      {children}
    </span>
  )
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="font-mono inline-flex items-center justify-center rounded-md" style={{ minWidth: 22, height: 20, padding: "0 6px", fontSize: 11, color: OW.paperDim, border: `1px solid ${OW.hair}`, background: "rgba(255,255,255,0.03)" }}>
      {children}
    </kbd>
  )
}

/* ── Deck state, shared between the audience and presenter windows ─── */

export type DeckState = { i: number; t0: number | null; notes: string }
const KEY = "owen:deck:v2"
const CHANNEL = "owen-deck-v2"
const DEFAULT: DeckState = { i: 0, t0: null, notes: "" }
const clampIndex = (i: unknown) => (typeof i === "number" && i >= 0 && i < SCREENS.length ? i : 0)

export function useDeckSync(): [DeckState, (patch: Partial<DeckState>) => void, boolean] {
  const [state, setState] = useState<DeckState>(DEFAULT)
  const [ready, setReady] = useState(false)
  const ref = useRef<DeckState>(DEFAULT)
  const ch = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DeckState>
        const s = { ...DEFAULT, ...parsed, i: clampIndex(parsed.i) }
        ref.current = s
        setState(s)
      }
    } catch {}
    setReady(true)
    if (typeof BroadcastChannel !== "undefined") {
      ch.current = new BroadcastChannel(CHANNEL)
      ch.current.onmessage = (e: MessageEvent<Partial<DeckState>>) => {
        ref.current = { ...ref.current, ...e.data, i: clampIndex(e.data.i ?? ref.current.i) }
        setState(ref.current)
      }
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return
      try {
        const parsed = JSON.parse(e.newValue) as Partial<DeckState>
        ref.current = { ...DEFAULT, ...parsed, i: clampIndex(parsed.i) }
        setState(ref.current)
      } catch {}
    }
    window.addEventListener("storage", onStorage)
    return () => {
      ch.current?.close()
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const update = useCallback((patch: Partial<DeckState>) => {
    ref.current = { ...ref.current, ...patch }
    setState(ref.current)
    try {
      localStorage.setItem(KEY, JSON.stringify(ref.current))
    } catch {}
    ch.current?.postMessage(patch)
  }, [])

  return [state, update, ready]
}

/** Keys shared by both windows: arrows / space / 1–4 / T timer / N presenter / F fullscreen. */
export function useDeckKeys(state: DeckState, update: (p: Partial<DeckState>) => void, opts: { onPresenter?: () => void; onFullscreen?: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      const last = SCREENS.length - 1
      if (k === "ArrowRight" || k === " " || k === "PageDown" || k === "Enter") { e.preventDefault(); update({ i: Math.min(last, state.i + 1) }) }
      else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") { e.preventDefault(); update({ i: Math.max(0, state.i - 1) }) }
      else if (k === "Home") update({ i: 0 })
      else if (k === "End") update({ i: last })
      else if (k === "t" || k === "T") update({ t0: state.t0 ? null : Date.now() })
      else if (k === "n" || k === "N") opts.onPresenter?.()
      else if (k === "f" || k === "F") opts.onFullscreen?.()
      else if (/^[1-4]$/.test(k)) update({ i: Number(k) - 1 })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [state.i, state.t0, update, opts])
}

export function openPresenter() {
  window.open("/owen/presenter", "owen-presenter", "width=780,height=980,menubar=no,toolbar=no")
}

/** Seconds elapsed since t0, ticking once a second. */
export function useElapsed(t0: number | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!t0) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [t0])
  return t0 ? Math.max(0, Math.floor((now - t0) / 1000)) : 0
}

export const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

export const isTyping = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null
  return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
}
