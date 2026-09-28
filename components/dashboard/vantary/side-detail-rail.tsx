"use client"

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SideDetailRail — persistent vertical focus column (Project 4)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  The platform's persistent companion column. Sits sticky on the right edge
 *  of the dashboard at lg+ breakpoints. Two states:
 *
 *    • Collapsed (nothing pinned)
 *        56px wide. Vertical "FOCUS" eyebrow text. Hover peek expands to
 *        240px and shows "Tap a pin icon on any card to drop it here."
 *
 *    • Expanded (something pinned)
 *        320px wide. Header (subject + category chip + unpin X). Body
 *        with rich, scrollable content rendered by a kind-specific
 *        renderer. Footer history strip with last 3 pins.
 *
 *  Pin lifecycle:
 *    1. Any card calls `pin({ id, kind, label, payload, ... })`
 *    2. Provider sets `pinned = item`, pushes prior pin to history, persists
 *       to localStorage
 *    3. The rail crossfades the previous content out, the new in
 *    4. Cross-highlight: the pinned item registers its `crossKey` in the
 *       cross-highlight system so hovering the rail card lights up
 *       every other card sharing that crossKey across the dashboard
 *
 *  ───────────────────────────────────────────────────────────────────────────
 *  Quick reference
 *  ───────────────────────────────────────────────────────────────────────────
 *
 *    1. Wrap your app
 *
 *        <SideRailProvider>
 *          <Dashboard />
 *          <SideDetailRail />        // sticky-fixed on the right
 *        </SideRailProvider>
 *
 *    2. Pin from anywhere
 *
 *        const { pin, togglePin, isPinned } = useSideRail()
 *
 *        <PinButton
 *          item={{
 *            id: "pair:EUR/USD",
 *            kind: "pair",
 *            label: "EUR/USD",
 *            crossKey: "pair:EUR/USD",
 *            category: "forex",
 *            payload: watchPair,
 *          }}
 *        />
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as React from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pin, X, ChevronRight, History, Target } from "lucide-react"
import { VANTARY, EASE_V } from "./vantary-theme"

/* ═══════════════════════════════════════════════════════════════════════════
 *  Types
 * ══════════════════════════════════════════════════════════════════════════ */

export type SideRailCategory =
  | "forex"
  | "indices"
  | "crypto"
  | "commodities"
  | "macro"
  | "session"
  | "focus"
  | "alert"
  | "neutral"

export type SideRailKind =
  | "pair"        // a tradeable instrument (forex, indices, crypto, commodities)
  | "session"     // a market session (London, NY, Tokyo, Sydney)
  | "event"       // a macro event (ECB rate, NFP, CPI)
  | "account"     // a trading account (FTMO, live, demo)
  | "strategy"    // a strategy (FVG, breakout, market-structure)
  | "stat"        // a generic stat / metric
  | "custom"      // arbitrary, requires custom renderer

export interface PinnedItem {
  /** unique id — second pin with same id replaces the first */
  id: string
  /** discriminates which content renderer to use */
  kind: SideRailKind
  /** short text shown in the rail header + history chips */
  label: string
  /** category tint (drives the accent rail color) */
  category?: SideRailCategory
  /** optional cross-highlight key */
  crossKey?: string
  /** kind-specific arbitrary data, deep-cloned to localStorage */
  payload?: unknown
  /** ms epoch when pinned */
  pinnedAt: number
}

/** Map a category to an [r,g,b] triplet used everywhere in this file. */
const CATEGORY_RGB: Record<SideRailCategory, string> = {
  forex:       "6, 182, 212",   // cyan
  indices:     "16, 185, 129",  // emerald
  crypto:      "251, 146, 60",  // amber-orange
  commodities: "16, 185, 129",  // emerald
  macro:       "239, 68, 68",   // red
  session:     "34, 197, 94",   // green
  focus:       "6, 182, 212",   // cyan
  alert:       "251, 146, 60",  // amber-orange
  neutral:     "255, 255, 255", // white
}

const categoryRgb = (c?: SideRailCategory): string =>
  CATEGORY_RGB[c ?? "neutral"]

/* ═══════════════════════════════════════════════════════════════════════════
 *  Custom renderer registry
 *  ──────────────────────────────────────────────────────────────────────────
 *  Consumers can register custom renderers per `kind` via:
 *    registerSideRailRenderer("pair", ({ item, unpin }) => <MyPairRail .../>)
 *  The default renderers below are used when no custom one is registered.
 * ══════════════════════════════════════════════════════════════════════════ */

export interface SideRailRendererProps {
  item: PinnedItem
  unpin: () => void
}

type RailRenderer = (props: SideRailRendererProps) => React.ReactElement | null

const RENDERER_REGISTRY = new Map<SideRailKind, RailRenderer>()

/** Register a custom content renderer for a given pin kind. */
export function registerSideRailRenderer(kind: SideRailKind, renderer: RailRenderer) {
  RENDERER_REGISTRY.set(kind, renderer)
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Context
 * ══════════════════════════════════════════════════════════════════════════ */

interface SideRailContextValue {
  pinned: PinnedItem | null
  history: PinnedItem[]
  pin: (item: Omit<PinnedItem, "pinnedAt">) => void
  unpin: () => void
  togglePin: (item: Omit<PinnedItem, "pinnedAt">) => void
  isPinned: (id: string) => boolean
  /** restore a pin from history */
  restoreFromHistory: (id: string) => void
  clearHistory: () => void
}

const NOOP_CTX: SideRailContextValue = {
  pinned: null,
  history: [],
  pin: () => {},
  unpin: () => {},
  togglePin: () => {},
  isPinned: () => false,
  restoreFromHistory: () => {},
  clearHistory: () => {},
}

const SideRailContext = createContext<SideRailContextValue>(NOOP_CTX)

/** Hook — anywhere inside `<SideRailProvider>`. Outside, it no-ops. */
export function useSideRail(): SideRailContextValue {
  return useContext(SideRailContext)
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  localStorage helpers
 * ══════════════════════════════════════════════════════════════════════════ */

const LS_KEY_PINNED = "vantary:side-rail:pinned:v1"
const LS_KEY_HISTORY = "vantary:side-rail:history:v1"
const HISTORY_MAX = 5

function safeRead<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota exceeded etc. — silent */
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Provider
 * ══════════════════════════════════════════════════════════════════════════ */

export function SideRailProvider({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState<PinnedItem | null>(null)
  const [history, setHistory] = useState<PinnedItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // hydrate from localStorage on first client render
  useEffect(() => {
    setPinned(safeRead<PinnedItem>(LS_KEY_PINNED))
    setHistory(safeRead<PinnedItem[]>(LS_KEY_HISTORY) ?? [])
    setHydrated(true)
  }, [])

  // persist to localStorage when state changes (post-hydration only)
  useEffect(() => {
    if (!hydrated) return
    if (pinned) safeWrite(LS_KEY_PINNED, pinned)
    else if (typeof window !== "undefined") {
      window.localStorage.removeItem(LS_KEY_PINNED)
    }
  }, [pinned, hydrated])

  useEffect(() => {
    if (!hydrated) return
    safeWrite(LS_KEY_HISTORY, history)
  }, [history, hydrated])

  const pin = useCallback(
    (item: Omit<PinnedItem, "pinnedAt">) => {
      const next: PinnedItem = { ...item, pinnedAt: Date.now() }
      setPinned((prev) => {
        // push prev to history (dedupe by id)
        if (prev && prev.id !== next.id) {
          setHistory((h) =>
            [prev, ...h.filter((x) => x.id !== prev.id)].slice(0, HISTORY_MAX),
          )
        }
        return next
      })
    },
    [],
  )

  const unpin = useCallback(() => {
    setPinned((prev) => {
      if (prev) {
        setHistory((h) =>
          [prev, ...h.filter((x) => x.id !== prev.id)].slice(0, HISTORY_MAX),
        )
      }
      return null
    })
  }, [])

  const togglePin = useCallback(
    (item: Omit<PinnedItem, "pinnedAt">) => {
      setPinned((prev) => {
        if (prev?.id === item.id) {
          // unpin
          setHistory((h) =>
            [prev, ...h.filter((x) => x.id !== prev.id)].slice(0, HISTORY_MAX),
          )
          return null
        }
        // pin (push prev to history)
        if (prev) {
          setHistory((h) =>
            [prev, ...h.filter((x) => x.id !== prev.id)].slice(0, HISTORY_MAX),
          )
        }
        return { ...item, pinnedAt: Date.now() }
      })
    },
    [],
  )

  const isPinned = useCallback(
    (id: string) => pinned?.id === id,
    [pinned],
  )

  const restoreFromHistory = useCallback((id: string) => {
    setHistory((h) => {
      const found = h.find((x) => x.id === id)
      if (!found) return h
      // pop from history, push current pin into history
      setPinned((prev) => {
        if (prev && prev.id !== found.id) {
          setHistory((hh) =>
            [prev, ...hh.filter((x) => x.id !== prev.id && x.id !== found.id)].slice(0, HISTORY_MAX),
          )
        }
        return { ...found, pinnedAt: Date.now() }
      })
      return h.filter((x) => x.id !== id)
    })
  }, [])

  const clearHistory = useCallback(() => setHistory([]), [])

  const value = useMemo<SideRailContextValue>(
    () => ({ pinned, history, pin, unpin, togglePin, isPinned, restoreFromHistory, clearHistory }),
    [pinned, history, pin, unpin, togglePin, isPinned, restoreFromHistory, clearHistory],
  )

  return <SideRailContext.Provider value={value}>{children}</SideRailContext.Provider>
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  PinButton — drop into any card to add a pin affordance
 * ══════════════════════════════════════════════════════════════════════════ */

export interface PinButtonProps {
  /** the item to pin (sans pinnedAt) */
  item: Omit<PinnedItem, "pinnedAt">
  /** size in px (square) */
  size?: number
  /** extra class name */
  className?: string
  /** stop click propagation so wrapping cards don't navigate */
  stopPropagation?: boolean
  /** display mode */
  variant?: "ghost" | "filled" | "inline"
  /** label (defaults to "Pin to focus") */
  ariaLabel?: string
}

export function PinButton({
  item,
  size = 22,
  className,
  stopPropagation = true,
  variant = "ghost",
  ariaLabel,
}: PinButtonProps) {
  const { togglePin, isPinned } = useSideRail()
  const pinned = isPinned(item.id)
  const rgb = categoryRgb(item.category)

  const onClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.preventDefault()
      e.stopPropagation()
    }
    togglePin(item)
  }

  // inline variant — flat icon, no background
  const isInline = variant === "inline"

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? (pinned ? `Unpin ${item.label}` : `Pin ${item.label} to focus rail`)}
      aria-pressed={pinned}
      className={cn(
        "side-rail-pin",
        pinned && "side-rail-pin--active",
        className,
      )}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        background: pinned
          ? `rgba(${rgb}, 0.18)`
          : variant === "filled"
            ? "rgba(255,255,255,0.04)"
            : "transparent",
        border: pinned
          ? `1px solid rgba(${rgb}, 0.45)`
          : variant === "filled"
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
        color: pinned ? `rgb(${rgb})` : VANTARY.ashSoft,
        cursor: "pointer",
        transition: "all 240ms cubic-bezier(0.22,1,0.36,1)",
        // hover handled via :hover in injected stylesheet (below)
        padding: 0,
        boxShadow: pinned ? `0 0 0 1px rgba(${rgb}, 0.12), 0 4px 12px -4px rgba(${rgb}, 0.32)` : "none",
      }}
      title={pinned ? "Pinned · click to unpin" : "Pin to focus rail"}
    >
      <Pin
        size={Math.max(10, size - 10)}
        strokeWidth={1.6}
        style={{
          transform: pinned ? "rotate(-30deg)" : "rotate(0deg)",
          transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)",
          fill: pinned ? `rgba(${rgb}, 0.85)` : "none",
        }}
      />
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Default content renderers
 * ══════════════════════════════════════════════════════════════════════════ */

interface DefaultPairPayload {
  symbol: string
  bias?: string
  winRate?: number
  pipsToday?: number
  sampleSize?: number
  bars?: Array<{ o: number; h: number; l: number; c: number }>
  inFocus?: boolean
  warning?: string
}

/** Mini candle chart, sized for the rail. */
function RailMiniCandle({
  bars,
  width = 280,
  height = 90,
}: {
  bars: Array<{ o: number; h: number; l: number; c: number }>
  width?: number
  height?: number
}) {
  if (!bars?.length) return null
  const lo = Math.min(...bars.map((b) => b.l))
  const hi = Math.max(...bars.map((b) => b.h))
  const range = hi - lo || 1
  const slot = width / bars.length
  const bw = Math.max(1.4, slot * 0.6)
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      role="img"
      aria-label="Recent price action"
    >
      {bars.map((b, i) => {
        const x = (i + 0.5) * slot
        const oY = height - ((b.o - lo) / range) * height
        const cY = height - ((b.c - lo) / range) * height
        const hY = height - ((b.h - lo) / range) * height
        const lY = height - ((b.l - lo) / range) * height
        const isBull = b.c >= b.o
        const top = Math.min(oY, cY)
        const ht = Math.max(1, Math.abs(cY - oY))
        const fill = isBull ? "rgba(16,185,129,0.85)" : "rgba(239,68,68,0.85)"
        const wickStroke = isBull ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)"
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={hY} y2={lY} stroke={wickStroke} strokeWidth={0.8} />
            <rect x={x - bw / 2} y={top} width={bw} height={ht} fill={fill} />
          </g>
        )
      })}
    </svg>
  )
}

/** Generic key/value row for rail content. */
function RailRow({
  label,
  value,
  tone,
}: {
  label: React.ReactNode
  value: React.ReactNode
  tone?: "positive" | "negative" | "warn" | "muted" | "default"
}) {
  const valueColor =
    tone === "positive"
      ? "rgb(16, 185, 129)"
      : tone === "negative"
        ? "rgb(239, 68, 68)"
        : tone === "warn"
          ? VANTARY.amber
          : tone === "muted"
            ? VANTARY.ash
            : VANTARY.paper
  return (
    <div className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: `1px dashed rgba(255,255,255,0.04)` }}>
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
        {label}
      </span>
      <span className="font-mono tabular-nums" style={{ fontSize: 11.5, color: valueColor, fontWeight: 500 }}>
        {value}
      </span>
    </div>
  )
}

/** Default renderer — pair. */
function DefaultPairRenderer({ item }: SideRailRendererProps) {
  const p = (item.payload as DefaultPairPayload) ?? { symbol: item.label }
  const positive = (p.pipsToday ?? 0) >= 0
  return (
    <>
      {p.bars && p.bars.length > 0 && (
        <div className="rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: 8 }}>
          <RailMiniCandle bars={p.bars} width={272} height={84} />
        </div>
      )}
      <div className="mt-3">
        {p.bias && <RailRow label="Bias" value={p.bias} />}
        {typeof p.winRate === "number" && (
          <RailRow
            label="Win-rate"
            value={`${p.winRate}%`}
            tone={p.winRate >= 65 ? "positive" : p.winRate >= 50 ? "default" : p.winRate >= 40 ? "warn" : "negative"}
          />
        )}
        {typeof p.pipsToday === "number" && (
          <RailRow
            label="Pips today"
            value={`${positive ? "+" : ""}${p.pipsToday}`}
            tone={positive ? "positive" : "negative"}
          />
        )}
        {typeof p.sampleSize === "number" && (
          <RailRow label="Sample size" value={`n=${p.sampleSize}`} tone="muted" />
        )}
        {typeof p.inFocus === "boolean" && (
          <RailRow label="In focus" value={p.inFocus ? "Yes" : "No"} tone={p.inFocus ? "positive" : "muted"} />
        )}
      </div>
      {p.warning && (
        <div
          className="mt-3 p-2.5 rounded-md flex items-start gap-2"
          style={{
            background: "rgba(251,146,60,0.07)",
            border: "1px solid rgba(251,146,60,0.18)",
          }}
        >
          <Target size={11} strokeWidth={1.8} style={{ color: VANTARY.amber, marginTop: 1, flexShrink: 0 }} />
          <span style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim }}>
            {p.warning}
          </span>
        </div>
      )}
    </>
  )
}

interface DefaultSessionPayload {
  city: string
  flag?: string
  openUTC: number
  closeUTC: number
  regime: string
  winRate: number
  pairs?: string[]
  killzone?: { label: string; from: number; to: number }
}

function DefaultSessionRenderer({ item }: SideRailRendererProps) {
  const s = item.payload as DefaultSessionPayload
  if (!s) return null
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        {s.flag && <span style={{ fontSize: 22 }}>{s.flag}</span>}
        <div className="flex flex-col">
          <span style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft, fontFamily: "monospace", textTransform: "uppercase" }}>
            City
          </span>
          <span style={{ fontSize: 14, color: VANTARY.paper, fontWeight: 500 }}>{s.city}</span>
        </div>
      </div>
      <RailRow
        label="Window (UTC)"
        value={`${String(s.openUTC).padStart(2, "0")}:00 → ${String(s.closeUTC).padStart(2, "0")}:00`}
      />
      <RailRow label="Regime" value={s.regime} tone="muted" />
      <RailRow
        label="Win-rate"
        value={`${s.winRate}%`}
        tone={s.winRate >= 65 ? "positive" : s.winRate >= 55 ? "default" : "warn"}
      />
      {s.killzone && (
        <RailRow
          label={s.killzone.label}
          value={`${String(s.killzone.from).padStart(2, "0")}:00 – ${String(s.killzone.to).padStart(2, "0")}:00`}
          tone="positive"
        />
      )}
      {s.pairs && s.pairs.length > 0 && (
        <div className="mt-3">
          <span className="font-mono uppercase block mb-2" style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
            Top pairs in window
          </span>
          <div className="flex flex-wrap gap-1.5">
            {s.pairs.map((p) => (
              <span
                key={p}
                className="font-mono"
                style={{
                  fontSize: 10,
                  padding: "2.5px 7px",
                  borderRadius: 4,
                  background: "rgba(34,197,94,0.07)",
                  color: VANTARY.paperDim,
                  border: "1px solid rgba(34,197,94,0.16)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

interface DefaultEventPayload {
  event: string
  currency: string
  time: string // HH:MM UTC
  impact: "high" | "medium" | "low"
  affects?: string[]
  rule?: string
}

function DefaultEventRenderer({ item }: SideRailRendererProps) {
  const e = item.payload as DefaultEventPayload
  if (!e) return null
  const tone =
    e.impact === "high" ? "negative" : e.impact === "medium" ? "warn" : "muted"
  return (
    <>
      <RailRow label="Currency" value={e.currency} />
      <RailRow label="Time (UTC)" value={e.time} />
      <RailRow label="Impact" value={e.impact.toUpperCase()} tone={tone as "negative" | "warn" | "muted"} />
      {e.affects && e.affects.length > 0 && (
        <RailRow label="Affects" value={e.affects.join(" · ")} tone="muted" />
      )}
      {e.rule && (
        <div
          className="mt-3 p-2.5 rounded-md flex items-start gap-2"
          style={{
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.18)",
          }}
        >
          <Target size={11} strokeWidth={1.8} style={{ color: "rgb(239,68,68)", marginTop: 1, flexShrink: 0 }} />
          <span style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.paperDim }}>
            <strong style={{ color: VANTARY.paper, fontWeight: 600 }}>Plan rule:</strong>{" "}
            {e.rule}
          </span>
        </div>
      )}
    </>
  )
}

function GenericRenderer({ item }: SideRailRendererProps) {
  const p = (item.payload ?? {}) as Record<string, unknown>
  const entries = Object.entries(p).filter(
    ([k, v]) => typeof v === "string" || typeof v === "number" || typeof v === "boolean",
  )
  return (
    <>
      {entries.length === 0 ? (
        <p style={{ fontSize: 11.5, lineHeight: 1.55, color: VANTARY.paperDim }}>
          {item.label} is pinned. No additional payload provided.
        </p>
      ) : (
        entries.map(([k, v]) => (
          <RailRow
            key={k}
            label={k.replace(/([A-Z])/g, " $1").trim()}
            value={typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}
          />
        ))
      )}
    </>
  )
}

/* Default registry seed */
RENDERER_REGISTRY.set("pair", DefaultPairRenderer)
RENDERER_REGISTRY.set("session", DefaultSessionRenderer)
RENDERER_REGISTRY.set("event", DefaultEventRenderer)
RENDERER_REGISTRY.set("account", GenericRenderer)
RENDERER_REGISTRY.set("strategy", GenericRenderer)
RENDERER_REGISTRY.set("stat", GenericRenderer)
RENDERER_REGISTRY.set("custom", GenericRenderer)

/* ═══════════════════════════════════════════════════════════════════════════
 *  Vertical-axis text (collapsed-state eyebrow)
 * ══════════════════════════════════════════════════════════════════════════ */

function VerticalText({
  text,
  fontSize = 9,
  letterSpacing = "0.32em",
  color = VANTARY.ashSoft,
  weight = 500,
}: {
  text: string
  fontSize?: number
  letterSpacing?: string
  color?: string
  weight?: number
}) {
  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize,
        letterSpacing,
        color,
        textTransform: "uppercase",
        fontWeight: weight,
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {text}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Helpers
 * ══════════════════════════════════════════════════════════════════════════ */

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ")
}

function fmtPinAge(pinnedAt: number): string {
  const ms = Date.now() - pinnedAt
  const sec = Math.floor(ms / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  return `${Math.floor(hr / 24)}d`
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  The rail
 * ══════════════════════════════════════════════════════════════════════════ */

export interface SideDetailRailProps {
  /** Where the rail is anchored. Default: right. */
  side?: "left" | "right"
  /** Whether to show the rail at all (consumers may want to hide on certain pages). */
  hidden?: boolean
  /** Distance from top of viewport (top of rail). Default: 0 — full height. */
  topOffset?: number
  /** Custom z-index. Default 60 (above main, below modals). */
  zIndex?: number
}

export function SideDetailRail({
  side = "right",
  hidden = false,
  topOffset = 0,
  zIndex = 60,
}: SideDetailRailProps) {
  const { pinned, history, unpin, restoreFromHistory } = useSideRail()
  const [peek, setPeek] = useState(false)            // hover-peek when collapsed
  const [mounted, setMounted] = useState(false)       // avoid SSR/CSR flash
  useEffect(() => setMounted(true), [])

  // Re-render every 60s so pin "age" stays fresh on the history strip
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  // Keyboard: Escape unpins
  useEffect(() => {
    if (!pinned) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        unpin()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pinned, unpin])

  const isExpanded = !!pinned || peek
  const width = pinned ? 320 : peek ? 240 : 56

  const pinnedRgb = categoryRgb(pinned?.category)

  // Resolve the renderer for the pinned kind
  const Renderer = pinned
    ? RENDERER_REGISTRY.get(pinned.kind) ?? GenericRenderer
    : null

  /* ── EMPTY STATE NO LONGER RENDERED ──────────────────────────────
   * Per the cockpit-console redesign, the persistent 56px right-edge
   * rail with its vertical "FOCUS RAIL · PIN ANYTHING" eyebrow text
   * has been retired. Its discoverability surface (tip text + history
   * list) now lives in <FocusRailDropdown/> in the VantaryHeader, next
   * to the wifi/headphones/bell utility cluster.
   *
   * The rail still renders when the user has ACTIVELY pinned a card —
   * that's the sustained workspace use-case where having the pinned
   * detail visible while scanning the rest of the dashboard is the
   * point. We just no longer steal real-estate when nothing is pinned.
   *
   * If a future redesign wants to bring back the 56px collapsed eyebrow,
   * delete this guard and the empty-state JSX below will render again. */
  if (hidden || !mounted || !pinned) return null

  return (
    <>
      {/* ── Style (focus ring + hover states for embedded buttons) ── */}
      <style>{`
        .side-rail-pin:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.12) !important;
          color: ${VANTARY.paper} !important;
        }
        .side-rail-pin--active:hover {
          background: rgba(255,255,255,0.04) !important;
        }
        .side-rail-pin:focus-visible {
          outline: 2px solid rgba(6,182,212,0.5);
          outline-offset: 2px;
        }
        .side-rail-close:hover {
          background: rgba(255,255,255,0.07) !important;
          color: ${VANTARY.paper} !important;
        }
        .side-rail-history-chip:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.10) !important;
          transform: translateY(-1px);
        }
        .side-rail-scroll::-webkit-scrollbar { width: 4px; }
        .side-rail-scroll::-webkit-scrollbar-track { background: transparent; }
        .side-rail-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
        }
        .side-rail-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.12);
        }
        @media (max-width: 1023px) {
          .side-rail-root { display: none !important; }
        }
      `}</style>

      <motion.aside
        className="side-rail-root"
        role="complementary"
        aria-label={pinned ? `Focus rail: ${pinned.label}` : "Focus rail"}
        onMouseEnter={() => !pinned && setPeek(true)}
        onMouseLeave={() => !pinned && setPeek(false)}
        initial={false}
        animate={{
          width,
          opacity: 1,
        }}
        transition={{ duration: 0.32, ease: EASE_V }}
        style={{
          position: "fixed",
          top: topOffset,
          [side]: 0,
          height: `calc(100vh - ${topOffset}px)`,
          zIndex,
          display: "flex",
          flexDirection: "column",
          background: "rgba(10,11,14,0.86)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderLeft: side === "right" ? `1px solid ${VANTARY.rule}` : undefined,
          borderRight: side === "left" ? `1px solid ${VANTARY.rule}` : undefined,
          boxShadow: pinned
            ? `inset 0 1px 0 rgba(255,255,255,0.04), -32px 0 64px -32px rgba(${pinnedRgb}, 0.18)`
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        {/* ── Vertical accent rail on the trigger-facing edge ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [side === "right" ? "left" : "right"]: 0,
            width: 2,
            background: pinned
              ? `linear-gradient(180deg, transparent 0%, rgba(${pinnedRgb}, 0.65) 50%, transparent 100%)`
              : "transparent",
            transition: "background 320ms cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: "none",
          }}
        />

        {/* ── Subtle category-tinted side-wash ── */}
        {pinned && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(120% 60% at ${side === "right" ? "0%" : "100%"} 30%, rgba(${pinnedRgb}, 0.06), transparent 70%)`,
              pointerEvents: "none",
            }}
          />
        )}

        {/* ── COLLAPSED STATE — vertical eyebrow ── */}
        <AnimatePresence>
          {!pinned && !peek && (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-between py-6 pointer-events-none"
            >
              <Pin size={14} strokeWidth={1.5} style={{ color: VANTARY.ashSoft, opacity: 0.55 }} />
              <div className="flex flex-col items-center gap-3">
                <VerticalText text="FOCUS RAIL" fontSize={9} letterSpacing="0.32em" />
                <div
                  aria-hidden="true"
                  style={{
                    width: 1,
                    height: 24,
                    background: `linear-gradient(180deg, ${VANTARY.rule}, transparent)`,
                  }}
                />
                <VerticalText text="PIN ANYTHING" fontSize={8} letterSpacing="0.28em" color={VANTARY.ash} weight={400} />
              </div>
              <div
                aria-hidden="true"
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 999,
                  background: VANTARY.ashSoft,
                  opacity: 0.4,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PEEK STATE — empty hover hint ── */}
        <AnimatePresence>
          {!pinned && peek && (
            <motion.div
              key="peek"
              initial={{ opacity: 0, x: side === "right" ? 8 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: side === "right" ? 8 : -8 }}
              transition={{ duration: 0.22, ease: EASE_V }}
              className="absolute inset-0 flex flex-col p-5 pointer-events-none"
            >
              <div className="flex items-center gap-2 mb-3">
                <Pin size={12} strokeWidth={1.6} style={{ color: VANTARY.paperDim }} />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
                >
                  Focus rail
                </span>
              </div>
              <p style={{ fontSize: 11.5, lineHeight: 1.55, color: VANTARY.paperDim }}>
                Click a <strong style={{ color: VANTARY.paper, fontWeight: 600 }}>pin icon</strong> on any card to drop it here. The pinned card stays visible while you scan the rest of the dashboard.
              </p>
              <div
                className="mt-4 p-2.5 rounded-md"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px dashed rgba(255,255,255,0.05)",
                }}
              >
                <span
                  className="font-mono uppercase block mb-1.5"
                  style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
                >
                  Tip
                </span>
                <span style={{ fontSize: 10.5, lineHeight: 1.5, color: VANTARY.ash }}>
                  Press{" "}
                  <kbd
                    style={{
                      padding: "1px 5px",
                      fontSize: 9,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 3,
                      color: VANTARY.paperDim,
                      fontFamily: "monospace",
                    }}
                  >
                    Esc
                  </kbd>{" "}
                  to unpin.
                </span>
              </div>
              {history.length > 0 && (
                <div className="mt-5">
                  <span
                    className="font-mono uppercase block mb-2"
                    style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}
                  >
                    Recent ({history.length})
                  </span>
                  <div className="flex flex-col gap-1 pointer-events-auto">
                    {history.slice(0, 3).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => restoreFromHistory(h.id)}
                        className="side-rail-history-chip text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition-all"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ fontSize: 11, color: VANTARY.paperDim, fontWeight: 500 }}>
                          {h.label}
                        </span>
                        <span style={{ fontSize: 9, color: VANTARY.ashSoft, fontFamily: "monospace" }}>
                          {fmtPinAge(h.pinnedAt)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── EXPANDED STATE — pinned content ── */}
        <AnimatePresence mode="wait">
          {pinned && (
            <motion.div
              key={pinned.id}
              initial={{ opacity: 0, x: side === "right" ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: side === "right" ? 12 : -12 }}
              transition={{ duration: 0.28, ease: EASE_V }}
              className="absolute inset-0 flex flex-col"
            >
              {/* ── HEADER ── */}
              <header
                className="flex items-start justify-between gap-2 px-5 pt-5 pb-4"
                style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 5,
                        height: 5,
                        background: `rgb(${pinnedRgb})`,
                        boxShadow: `0 0 6px rgba(${pinnedRgb}, 0.7)`,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: 8.5, letterSpacing: "0.20em", color: VANTARY.ashSoft }}
                    >
                      {pinned.kind} · pinned
                    </span>
                  </div>
                  <h2
                    className="font-sans truncate"
                    style={{
                      fontSize: 17,
                      fontWeight: 500,
                      color: VANTARY.paper,
                      letterSpacing: "-0.012em",
                      lineHeight: 1.2,
                    }}
                  >
                    {pinned.label}
                  </h2>
                  {pinned.category && pinned.category !== "neutral" && (
                    <span
                      className="inline-block self-start mt-1.5 font-mono uppercase"
                      style={{
                        fontSize: 8.5,
                        letterSpacing: "0.16em",
                        padding: "1.5px 6px",
                        borderRadius: 4,
                        background: `rgba(${pinnedRgb}, 0.10)`,
                        color: `rgb(${pinnedRgb})`,
                        border: `1px solid rgba(${pinnedRgb}, 0.22)`,
                      }}
                    >
                      {pinned.category}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={unpin}
                  aria-label={`Unpin ${pinned.label}`}
                  className="side-rail-close"
                  style={{
                    width: 24,
                    height: 24,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    background: "transparent",
                    border: "1px solid transparent",
                    color: VANTARY.ashSoft,
                    cursor: "pointer",
                    transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
                    flexShrink: 0,
                  }}
                  title="Unpin (Esc)"
                >
                  <X size={13} strokeWidth={1.8} />
                </button>
              </header>

              {/* ── BODY ── */}
              <div
                className="flex-1 overflow-y-auto side-rail-scroll px-5 py-4"
                style={{ minHeight: 0 }}
              >
                {Renderer && <Renderer item={pinned} unpin={unpin} />}
              </div>

              {/* ── FOOTER — history ── */}
              {history.length > 0 && (
                <footer
                  className="px-5 py-3"
                  style={{ borderTop: `1px solid ${VANTARY.rule}`, background: "rgba(0,0,0,0.16)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-mono uppercase flex items-center gap-1.5"
                      style={{ fontSize: 8.5, letterSpacing: "0.20em", color: VANTARY.ashSoft }}
                    >
                      <History size={9} strokeWidth={1.8} />
                      Recent
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: 8.5, color: VANTARY.ashSoft, opacity: 0.7 }}
                    >
                      {history.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {history.slice(0, 3).map((h) => {
                      const rgb = categoryRgb(h.category)
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => restoreFromHistory(h.id)}
                          className="side-rail-history-chip text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition-all"
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.04)",
                            cursor: "pointer",
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="inline-block rounded-full shrink-0"
                              style={{
                                width: 4,
                                height: 4,
                                background: `rgb(${rgb})`,
                              }}
                              aria-hidden="true"
                            />
                            <span
                              className="truncate"
                              style={{ fontSize: 10.5, color: VANTARY.paperDim, fontWeight: 500 }}
                            >
                              {h.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              style={{ fontSize: 9, color: VANTARY.ashSoft, fontFamily: "monospace" }}
                            >
                              {fmtPinAge(h.pinnedAt)}
                            </span>
                            <ChevronRight size={9} strokeWidth={2} style={{ color: VANTARY.ashSoft }} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </footer>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Default export
 * ══════════════════════════════════════════════════════════════════════════ */

export default SideDetailRail
