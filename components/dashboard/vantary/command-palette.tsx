"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  VANTARY COMMAND PALETTE · MILESTONE 8
 *  ─────────────────────────────────────────────────────────────────────────
 *  A keyboard-first global navigation surface that ties every system on the
 *  YourSpace dashboard together. Press ⌘K (or Ctrl+K) anywhere on the page
 *  and a centered overlay appears that lets the user:
 *
 *    · Jump to any day's playbook (Mon..Fri) — drives the shared day-
 *      selection context, so opening "Wednesday playbook" updates the
 *      RIGHT card's day-tabs AND mirrors to the LEFT card's 7-box grid
 *      in lockstep.
 *
 *    · Inspect any of the 7 session windows (Pre-London, London KZ,
 *      LDN-NY Gap, NY KZ, London Close, Post-NY, Off Hours). Each
 *      command surfaces the session's UTC window, KZ tag, and thesis,
 *      and the live one is annotated with elapsed/remaining minutes
 *      pulled from the clock-spine.
 *
 *    · Switch the dashboard theme between the seven Vantary palettes
 *      (Teal Glass, Cyber Pulse, Neural Light, Quantum, Solar Flare,
 *      Obsidian, Light Studio). The currently active theme is marked
 *      with a small amber pip.
 *
 *    · Run AI shortcuts that scroll-to and pre-fill the Vantary Oracle
 *      Ask-Me-Anything pill with one of the curated quick prompts
 *      (audit profile, compare to mentor, summarize today, etc.).
 *
 *    · Navigate to canonical regions of the page via data-anchor
 *      attributes (Sessions Radar, Watchlist Matrix, Macro Alerts,
 *      Vantary Oracle, Day Playbook, Week Stations, etc.) with smooth
 *      scrolling that respects prefers-reduced-motion.
 *
 *    · Re-run any of the 5 most recently used commands from the
 *      "RECENT" group, which is persisted to localStorage so it
 *      survives reloads.
 *
 *  Visual language
 *  ───────────────
 *  Brutalist editorial · 1px hairlines · monospace search field · amber
 *  caret + amber selection bar · paper/ash neutrals · radial amberWash
 *  glow at the top of the surface. No rounded corners; no dropshadows
 *  beyond the spec-level 0 0 0 1px ruleStrong border. The surface lives
 *  on the same Plane-2 elevation as side-detail rails, but with a
 *  stronger glassDeep background and a faint scanline grid at 4% alpha.
 *
 *  Keyboard contract
 *  ─────────────────
 *    ⌘K / Ctrl+K   · toggle open
 *    /             · focus search if already open
 *    ↑ ↓           · move selection cursor
 *    Enter         · execute selected command
 *    Esc           · close palette
 *    Tab           · trapped within the palette while open
 *    ⌘1..⌘5        · jump to section header (recent / days / sessions / themes / ai)
 *
 *  Provider tree
 *  ─────────────
 *      <CommandPaletteProvider>           ← global ⌘K listener + open state
 *        <CommandPaletteRoot />           ← overlay portal · mounts under <body>
 *        <CommandPaletteHint />           ← small clickable "⌘K" chip,
 *                                           place anywhere in page chrome
 *      </CommandPaletteProvider>
 *
 *  Designed for cross-system reuse. The command registry is pure data,
 *  so SignalTerminal, Briefing Card, etc. can extend it via the
 *  `useRegisterCommands(...)` hook below.
 * ═══════════════════════════════════════════════════════════════════════ */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Search, ArrowUp, ArrowDown, CornerDownLeft, X,
  CalendarDays, Clock, Palette, Sparkles, Compass,
  type LucideIcon,
} from "lucide-react"
import { VANTARY, EASE_V } from "./vantary-theme"
import { useUTCClock, useDaySelection } from "./clock-spine"
import { useVantaryTheme } from "./theme-context"
import type { ThemeId } from "./theme-system"

/* ─────────────────────────────────────────────────────────────────────────
 *  TYPES · The command registry is purely declarative. Each command is a
 *  flat record so it can be filtered, scored, and rendered uniformly. The
 *  `keywords` field feeds the fuzzy matcher; the `meta` field renders to
 *  the right of the row (e.g. "13–15 UTC · KZ" for a session).
 * ───────────────────────────────────────────────────────────────────────── */

export type CommandGroupId =
  | "recent"
  | "days"
  | "sessions"
  | "themes"
  | "ai"
  | "navigate"
  | "extension"

export interface VantaryCommand {
  /** Stable identity — used for recency persistence and dedupe. */
  id: string
  /** Logical bucket the row appears under. */
  group: CommandGroupId
  /** Bold, paper-toned label rendered as the primary row text. */
  label: string
  /** Optional secondary line in ash. Wraps to 2 lines max. */
  description?: string
  /** Right-side meta string. Mono caps for sessions/themes. */
  meta?: string
  /** lucide icon rendered in the leading 16x16 slot. */
  icon?: LucideIcon
  /** Free-text tokens to match search against, in addition to label/meta. */
  keywords?: string[]
  /** Whether the row should pulse with an amber pip (live, today, active). */
  liveDot?: boolean
  /** Action to execute on Enter / click. */
  perform: (ctx: CommandPerformContext) => void
}

export interface CommandPerformContext {
  close: () => void
  /** Scroll a `[data-vantary-anchor="..."]` element into view. */
  scrollToAnchor: (anchor: string, opts?: { focus?: boolean }) => void
  /** Set the shared selected day-of-week (0..6). */
  setSelectedDow: (dow: number) => void
  /** Toggle the dashboard theme. */
  setTheme: (id: ThemeId) => void
  /** Soft reduced-motion flag, propagated for animation choices. */
  reduceMotion: boolean
}

interface CommandPaletteAPI {
  open: boolean
  setOpen: (next: boolean) => void
  toggle: () => void
  /** Imperatively run a registered command by id (rarely used). */
  runById: (id: string) => void
  /** Extend the registry with extra commands (e.g. SignalTerminal). */
  registerCommands: (cmds: VantaryCommand[]) => () => void
}

const CommandPaletteContext = createContext<CommandPaletteAPI | null>(null)

/* ─────────────────────────────────────────────────────────────────────────
 *  STATIC DATA · The 5 weekday playbooks, the 7 session windows, the 7
 *  themes, and the AI shortcuts. Kept here so the palette stays a single
 *  importable file. If your-space.tsx ever exports the canonical SESSION /
 *  DAY tables, swap to those instead and delete the duplicates.
 * ───────────────────────────────────────────────────────────────────────── */

const DAY_DEFS: Array<{
  dow: number
  short: string
  long: string
  qualityLabel: string
  insight: string
}> = [
  { dow: 1, short: "MON", long: "Monday",    qualityLabel: "CAUTION",   insight: "Manipulation day. False moves set the weekly range." },
  { dow: 2, short: "TUE", long: "Tuesday",   qualityLabel: "PRIME DAY", insight: "Highest probability for clean displacement and trend initiation." },
  { dow: 3, short: "WED", long: "Wednesday", qualityLabel: "KEY DAY",   insight: "Midweek reversal zone. Weekly high or low often forms here." },
  { dow: 4, short: "THU", long: "Thursday",  qualityLabel: "SELECTIVE", insight: "Continuation or exhaustion. Validate against weekly objectives." },
  { dow: 5, short: "FRI", long: "Friday",    qualityLabel: "AVOID",     insight: "Profit-taking and position squaring. Reduced conviction." },
]

const SESSION_DEFS: Array<{
  key: string
  short: string
  long: string
  startUTC: number
  endUTC: number
  isKZ: boolean
  thesis: string
}> = [
  { key: "PRE-LDN", short: "PRE-LDN",  long: "Pre-London",       startUTC:  5, endUTC:  7, isKZ: false, thesis: "Dead zone. Mark the Asia range, prepare bias." },
  { key: "LDN",     short: "LDN-KZ",   long: "London Killzone",  startUTC:  7, endUTC: 10, isKZ: true,  thesis: "Displacement. Sweep → direction → entry → expansion." },
  { key: "LDN-NY",  short: "LDN-NY",   long: "London-NY Gap",    startUTC: 10, endUTC: 13, isKZ: false, thesis: "Low-volume bridge. Avoid entries — wait for NY flow." },
  { key: "NY",      short: "NY-KZ",    long: "New York Killzone",startUTC: 13, endUTC: 15, isKZ: true,  thesis: "Prime US execution. Continuation or reversal of London." },
  { key: "LDN-CLS", short: "LDN-CLS",  long: "London Close",     startUTC: 15, endUTC: 16, isKZ: false, thesis: "London exits. Volume drops; manage open positions." },
  { key: "POST-NY", short: "POST-NY",  long: "Post-NY",          startUTC: 16, endUTC: 21, isKZ: false, thesis: "Late drift. Tape goes thin; setups die at the close." },
  { key: "OFF",     short: "OFF",      long: "Off Hours",        startUTC: 21, endUTC: 29, isKZ: false, thesis: "Asia regime. Range establishment for tomorrow." }, // 21..29 = 21..00..05
]

const THEME_DEFS: Array<{ id: ThemeId; label: string; tagline: string }> = [
  { id: "teal",     label: "Teal Glass",     tagline: "Default · cool aquamarine over deep ink" },
  { id: "cyber",    label: "Cyber Pulse",    tagline: "Magenta neon · arcade interface" },
  { id: "neural",   label: "Neural Net",     tagline: "Indigo synaptic glow" },
  { id: "quantum",  label: "Quantum Field",  tagline: "Violet probability waves" },
  { id: "solar",    label: "Solar Flare",    tagline: "Amber radiance · golden hour" },
  { id: "light",    label: "Neural Light",   tagline: "Bright editorial · daytime" },
  { id: "obsidian", label: "Obsidian Glass", tagline: "Black mirror · ultra-premium" },
]

const AI_SHORTCUTS: Array<{ prompt: string; label: string; description: string }> = [
  { prompt: "audit profile",       label: "Audit my profile",          description: "Run a 360° behavioral diagnostic on the last 30 days." },
  { prompt: "compare to mentor",   label: "Compare to mentor mode",    description: "Diff your trades vs. a mentor archetype's playbook." },
  { prompt: "summarize today",     label: "Summarize today",           description: "Generate a 60-second voice-ready recap of today's tape." },
  { prompt: "best setup",          label: "Best setup right now",      description: "Surface the highest-edge setup for the active session." },
  { prompt: "weekly review",       label: "Generate weekly review",    description: "Compile P&L, R-multiple, and rule-adherence into a brief." },
]

const NAV_ANCHORS: Array<{ anchor: string; label: string; description: string }> = [
  { anchor: "jarvis-welcome",  label: "Jarvis welcome band",   description: "Top-of-page Vantary Oracle pill and period overview." },
  { anchor: "live-equity",     label: "Live equity volume",    description: "Hero chart — session-coloured volume bars." },
  { anchor: "sessions-radar",  label: "Sessions radar",        description: "Tokyo/London/NY/Sydney — circular session intel." },
  { anchor: "watchlist",       label: "Watchlist matrix",      description: "Top tickers with mini-candle sparkline strip." },
  { anchor: "macro-alerts",    label: "Macro alerts",          description: "Calendar-driven countdown sheet." },
  { anchor: "vantary-oracle",  label: "Vantary Oracle",        description: "Ask-Me-Anything pill — wired to the AI shortcuts." },
  { anchor: "day-playbook",    label: "Day playbook",          description: "RIGHT-card 5-tab playbook for Mon..Fri." },
  { anchor: "week-stations",   label: "Week stations grid",    description: "LEFT-card 7-day stations + drill-in drawer." },
]

/* ─────────────────────────────────────────────────────────────────────────
 *  FUZZY MATCHER · A tiny scoring routine. Tokenized substring matching
 *  with weighted fields (label > meta > description > keywords) and a
 *  small bonus for prefix and start-of-word hits. No regex backreferences,
 *  no external dependency. Runs fully synchronously.
 * ───────────────────────────────────────────────────────────────────────── */

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
}

function fuzzyScore(query: string, cmd: VantaryCommand): number {
  if (!query) return 0
  const q = normalize(query.trim())
  if (!q) return 0

  // The label gets the heaviest weight. Each subsequent field is dampened.
  const fields: Array<[string, number]> = [
    [normalize(cmd.label), 4.0],
    [normalize(cmd.meta ?? ""), 2.0],
    [normalize(cmd.description ?? ""), 1.5],
    [normalize((cmd.keywords ?? []).join(" ")), 1.2],
    [normalize(cmd.group), 0.8],
  ]

  let total = 0
  const tokens = q.split(/\s+/).filter(Boolean)
  for (const tok of tokens) {
    let bestForToken = 0
    for (const [text, weight] of fields) {
      if (!text) continue
      const idx = text.indexOf(tok)
      if (idx === -1) continue
      // Base score · weight × inverse-length bonus (short labels beat long).
      let score = weight * (1 + 1 / Math.max(text.length, 8))
      // Prefix bonus.
      if (idx === 0) score *= 1.4
      // Start-of-word bonus (preceded by a space or dash).
      else if (text[idx - 1] === " " || text[idx - 1] === "-") score *= 1.2
      // Exact-token bonus (whole-word hit).
      const after = text[idx + tok.length]
      if ((idx === 0 || text[idx - 1] === " ") && (after === undefined || after === " " || after === "-")) {
        score *= 1.15
      }
      if (score > bestForToken) bestForToken = score
    }
    if (bestForToken === 0) {
      // ANY token miss → command is excluded.
      return 0
    }
    total += bestForToken
  }
  return total
}

/* ─────────────────────────────────────────────────────────────────────────
 *  RECENT COMMANDS · localStorage-backed list of the last 5 distinct ids.
 *  Wrapped in a useState hook so the palette re-renders when a command is
 *  pushed. Reads are synchronous and SSR-safe.
 * ───────────────────────────────────────────────────────────────────────── */

const RECENT_KEY = "vantary-cmd-recent"
const RECENT_MAX = 5

function readRecent(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(x => typeof x === "string").slice(0, RECENT_MAX)
  } catch {
    return []
  }
}

function writeRecent(ids: string[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, RECENT_MAX)))
  } catch {
    /* quota / disabled · ignore */
  }
}

function useRecentCommands() {
  const [ids, setIds] = useState<string[]>(() => readRecent())
  const push = useCallback((id: string) => {
    setIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, RECENT_MAX)
      writeRecent(next)
      return next
    })
  }, [])
  return { ids, push }
}

/* ─────────────────────────────────────────────────────────────────────────
 *  SCROLL HELPER · Resolves a `data-vantary-anchor="..."` element and
 *  smoothly scrolls it into view. Falls back to a no-op if not found.
 *  Respects prefers-reduced-motion.
 * ───────────────────────────────────────────────────────────────────────── */

function scrollToAnchorImpl(
  anchor: string,
  opts: { focus?: boolean; reduceMotion: boolean } = { reduceMotion: false },
) {
  if (typeof document === "undefined") return
  const el = document.querySelector(`[data-vantary-anchor="${anchor}"]`) as HTMLElement | null
  if (!el) return
  el.scrollIntoView({
    behavior: opts.reduceMotion ? "auto" : "smooth",
    block: "start",
    inline: "nearest",
  })
  if (opts.focus) {
    requestAnimationFrame(() => el.focus({ preventScroll: true }))
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 *  COMMAND BUILDER · Synthesizes the canonical command set every render
 *  from the live spine + theme + day-selection state. Cheap (<100 rows).
 * ───────────────────────────────────────────────────────────────────────── */

function buildCommandRegistry(args: {
  liveDow: number
  selectedDow: number | null
  activeSessionKey: string | null
  activeSessionElapsedMin: number | null
  activeThemeId: ThemeId
  recentIds: string[]
}): VantaryCommand[] {
  const {
    liveDow, selectedDow, activeSessionKey,
    activeSessionElapsedMin, activeThemeId, recentIds,
  } = args

  const cmds: VantaryCommand[] = []

  /* ── Days ──────────────────────────────────────────────────────────── */
  for (const d of DAY_DEFS) {
    const isToday    = d.dow === liveDow
    const isSelected = d.dow === selectedDow
    cmds.push({
      id: `day:${d.short}`,
      group: "days",
      label: `${d.long} playbook`,
      description: d.insight,
      meta: [d.qualityLabel, isToday ? "TODAY" : null].filter(Boolean).join(" · "),
      icon: CalendarDays,
      liveDot: isToday || isSelected,
      keywords: [d.short, d.long, d.qualityLabel, "playbook", "weekday"],
      perform: (c) => {
        c.setSelectedDow(d.dow)
        c.scrollToAnchor("day-playbook")
        c.close()
      },
    })
  }

  /* ── Sessions ──────────────────────────────────────────────────────── */
  for (const s of SESSION_DEFS) {
    const isActive = s.key === activeSessionKey
    const startStr = String(s.startUTC).padStart(2, "0")
    const endHr    = s.endUTC > 24 ? s.endUTC - 24 : s.endUTC
    const endStr   = String(endHr).padStart(2, "0")
    const win      = `${startStr}–${endStr} UTC`
    const tag      = s.isKZ ? "KZ" : "DEAD"
    const live     = isActive && activeSessionElapsedMin != null
      ? ` · ${activeSessionElapsedMin}m elapsed`
      : ""
    cmds.push({
      id: `session:${s.key}`,
      group: "sessions",
      label: s.long,
      description: s.thesis,
      meta: `${win} · ${tag}${live}`,
      icon: Clock,
      liveDot: isActive,
      keywords: [s.short, s.long, s.key, tag, "session", "killzone", "kz"],
      perform: (c) => {
        c.scrollToAnchor("sessions-radar", { focus: true })
        c.close()
      },
    })
  }

  /* ── Themes ────────────────────────────────────────────────────────── */
  for (const t of THEME_DEFS) {
    const isActive = t.id === activeThemeId
    cmds.push({
      id: `theme:${t.id}`,
      group: "themes",
      label: `Switch theme — ${t.label}`,
      description: t.tagline,
      meta: isActive ? "ACTIVE" : undefined,
      icon: Palette,
      liveDot: isActive,
      keywords: [t.id, t.label, "theme", "palette", "color", "skin"],
      perform: (c) => {
        c.setTheme(t.id)
        c.close()
      },
    })
  }

  /* ── AI shortcuts ──────────────────────────────────────────────────── */
  for (const a of AI_SHORTCUTS) {
    cmds.push({
      id: `ai:${a.prompt}`,
      group: "ai",
      label: a.label,
      description: a.description,
      meta: "ASK ORACLE",
      icon: Sparkles,
      keywords: ["ai", "oracle", "ask", "vantary", a.prompt],
      perform: (c) => {
        c.scrollToAnchor("vantary-oracle", { focus: true })
        // Fire a custom event so the Oracle pill (if it listens) can pre-fill
        // its input. Non-fatal if no listener is registered.
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("vantary:oracle-prefill", {
            detail: { prompt: a.prompt, label: a.label },
          }))
        }
        c.close()
      },
    })
  }

  /* ── Page navigation ───────────────────────────────────────────────── */
  for (const n of NAV_ANCHORS) {
    cmds.push({
      id: `nav:${n.anchor}`,
      group: "navigate",
      label: `Jump to ${n.label}`,
      description: n.description,
      meta: "NAVIGATE",
      icon: Compass,
      keywords: [n.anchor, n.label, "go", "scroll", "section"],
      perform: (c) => {
        c.scrollToAnchor(n.anchor, { focus: true })
        c.close()
      },
    })
  }

  /* ── Recent (synthesized as a virtual group) ───────────────────────── */
  // We re-emit the same commands under group "recent" so the row-renderer
  // logic stays uniform. Order by recency and limit to RECENT_MAX.
  const byId = new Map(cmds.map(c => [c.id, c]))
  for (const id of recentIds) {
    const src = byId.get(id)
    if (!src) continue
    cmds.unshift({
      ...src,
      id: `recent:${id}`,            // unique key for React
      group: "recent",
      // Keep the original perform — but route through the original id so
      // the recency tracker dedupes correctly.
      perform: src.perform,
    })
  }

  return cmds
}

/* ─────────────────────────────────────────────────────────────────────────
 *  PROVIDER · Wires the global ⌘K listener, the open state, and the
 *  imperative API. Mount once near the top of the app tree.
 * ───────────────────────────────────────────────────────────────────────── */

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, _setOpen] = useState(false)
  const [extension, setExtension] = useState<VantaryCommand[]>([])

  const setOpen = useCallback((next: boolean) => _setOpen(next), [])
  const toggle  = useCallback(() => _setOpen(prev => !prev), [])

  // ── Global ⌘K / Ctrl+K binding ──────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && (e.key === "k" || e.key === "K")) {
        e.preventDefault()
        _setOpen(prev => !prev)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // ── Imperative API ──────────────────────────────────────────────────
  const apiRef = useRef<{ runById?: (id: string) => void }>({})

  const registerCommands = useCallback((cmds: VantaryCommand[]) => {
    setExtension(prev => [...prev, ...cmds])
    return () => setExtension(prev => prev.filter(c => !cmds.includes(c)))
  }, [])

  const runById = useCallback((id: string) => {
    apiRef.current.runById?.(id)
  }, [])

  const api = useMemo<CommandPaletteAPI>(() => ({
    open, setOpen, toggle, runById, registerCommands,
  }), [open, setOpen, toggle, runById, registerCommands])

  return (
    <CommandPaletteContext.Provider value={api}>
      {children}
      <CommandPaletteRoot
        extension={extension}
        registerRunById={(fn) => { apiRef.current.runById = fn }}
      />
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette(): CommandPaletteAPI {
  const ctx = useContext(CommandPaletteContext)
  if (!ctx) {
    // Safe noop fallback so consumers can call useCommandPalette() outside
    // the provider without crashing (e.g. SSR or isolated test renders).
    return {
      open: false,
      setOpen: () => {},
      toggle: () => {},
      runById: () => {},
      registerCommands: () => () => {},
    }
  }
  return ctx
}

/** Hook for satellite modules (SignalTerminal, etc.) to add commands.  */
export function useRegisterCommands(cmds: VantaryCommand[]): void {
  const { registerCommands } = useCommandPalette()
  useEffect(() => registerCommands(cmds), [registerCommands, cmds])
}

/* ─────────────────────────────────────────────────────────────────────────
 *  ROOT · Portalled overlay with the search field, results list, footer.
 * ───────────────────────────────────────────────────────────────────────── */

interface CommandPaletteRootProps {
  extension: VantaryCommand[]
  registerRunById: (fn: (id: string) => void) => void
}

function CommandPaletteRoot({ extension, registerRunById }: CommandPaletteRootProps) {
  const { open, setOpen } = useCommandPalette()
  const reduceMotion = useReducedMotion() ?? false

  const { liveDow, utcH, utcM, utcClock } = useUTCClock()
  const sel = useDaySelection()
  const { themeId, setTheme } = useVantaryTheme()
  const recent = useRecentCommands()

  // ── Derive active session by walking SESSION_DEFS ───────────────────
  const { activeKey, elapsedMin } = useMemo(() => {
    const hour = utcH + utcM / 60
    for (const s of SESSION_DEFS) {
      const start = s.startUTC
      const end = s.endUTC > 24 ? s.endUTC - 24 : s.endUTC
      const inWindow = start < end
        ? hour >= start && hour < end
        : hour >= start || hour < end
      if (inWindow) {
        const totalH = start < end ? end - start : 24 - start + end
        const offsetH = start < end
          ? hour - start
          : hour >= start ? hour - start : 24 - start + hour
        return { activeKey: s.key, elapsedMin: Math.round(offsetH * 60), totalH }
      }
    }
    return { activeKey: null as string | null, elapsedMin: null as number | null, totalH: 0 }
  }, [utcH, utcM])

  // ── Build the command registry ──────────────────────────────────────
  const commands = useMemo(() => {
    const base = buildCommandRegistry({
      liveDow,
      selectedDow: sel?.selectedDow ?? null,
      activeSessionKey: activeKey,
      activeSessionElapsedMin: elapsedMin,
      activeThemeId: themeId,
      recentIds: recent.ids,
    })
    return [...base, ...extension]
  }, [liveDow, sel?.selectedDow, activeKey, elapsedMin, themeId, recent.ids, extension])

  // ── Search state ────────────────────────────────────────────────────
  const [query, setQuery] = useState("")
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Reset state on open and focus the input.
  useEffect(() => {
    if (!open) return
    setQuery("")
    setCursor(0)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [open])

  // ── Filter + sort by score ──────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!query.trim()) {
      // No query: show recent first, then all groups in declared order.
      const order: CommandGroupId[] = ["recent", "days", "sessions", "themes", "ai", "navigate", "extension"]
      return commands
        .slice()
        .sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group))
    }
    return commands
      .map(c => ({ c, s: fuzzyScore(query, c) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ c }) => c)
  }, [commands, query])

  // Re-clamp the cursor when the result set shrinks.
  useEffect(() => {
    if (cursor >= filtered.length) setCursor(Math.max(0, filtered.length - 1))
  }, [filtered.length, cursor])

  // ── Imperative runById ──────────────────────────────────────────────
  const performCmd = useCallback((cmd: VantaryCommand) => {
    // Strip the synthetic "recent:" prefix so we record the canonical id.
    const canonicalId = cmd.id.startsWith("recent:") ? cmd.id.slice("recent:".length) : cmd.id
    recent.push(canonicalId)
    cmd.perform({
      close: () => setOpen(false),
      scrollToAnchor: (a, opts) => scrollToAnchorImpl(a, { ...opts, reduceMotion }),
      setSelectedDow: (dow) => sel?.setSelectedDow(dow),
      setTheme,
      reduceMotion,
    })
  }, [recent, setOpen, sel, setTheme, reduceMotion])

  useEffect(() => {
    registerRunById((id: string) => {
      const cmd = commands.find(c => c.id === id || c.id === `recent:${id}`)
      if (cmd) performCmd(cmd)
    })
  }, [commands, performCmd, registerRunById])

  // ── Keyboard navigation ─────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setCursor(c => (c + 1) % Math.max(filtered.length, 1))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setCursor(c => (c - 1 + filtered.length) % Math.max(filtered.length, 1))
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        const cmd = filtered[cursor]
        if (cmd) performCmd(cmd)
        return
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, filtered, cursor, performCmd, setOpen])

  // ── Group results for rendering ─────────────────────────────────────
  const grouped = useMemo(() => {
    const order: CommandGroupId[] = ["recent", "days", "sessions", "themes", "ai", "navigate", "extension"]
    const buckets = new Map<CommandGroupId, VantaryCommand[]>()
    for (const c of filtered) {
      if (!buckets.has(c.group)) buckets.set(c.group, [])
      buckets.get(c.group)!.push(c)
    }
    return order
      .filter(g => buckets.has(g) && buckets.get(g)!.length > 0)
      .map(g => ({ id: g, items: buckets.get(g)! }))
  }, [filtered])

  // Index the cursor across groups so we know which row is highlighted.
  const cursorRowId = filtered[cursor]?.id ?? null

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          className="fixed inset-0 z-[1000] flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.08 : 0.18, ease: EASE_V }}
          style={{
            // Backdrop · ink with heavy blur so the page reads as paused.
            background: "rgba(10,14,18,0.62)",
            backdropFilter: "blur(8px) saturate(120%)",
            WebkitBackdropFilter: "blur(8px) saturate(120%)",
            paddingTop: "12vh",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Vantary command palette"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.24, ease: EASE_V }}
            className="relative w-full max-w-[640px] mx-6 flex flex-col"
            style={{
              background: VANTARY.glassDeep,
              border: `1px solid ${VANTARY.ruleStrong}`,
              boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.35)",
              maxHeight: "70vh",
            }}
          >
            {/* Top amber bloom · subtle radial wash above the search field */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 pointer-events-none"
              style={{
                height: 120,
                background: `radial-gradient(ellipse at 50% 0%, ${VANTARY.amberWash} 0%, transparent 70%)`,
                opacity: 0.6,
              }}
            />

            {/* Hairline scanline grid · 4% opacity */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(${VANTARY.paper} 1px, transparent 1px), linear-gradient(90deg, ${VANTARY.paper} 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />

            {/* ── Header · search input ─────────────────────────────── */}
            <div
              className="relative flex items-center"
              style={{
                padding: "16px 18px",
                borderBottom: `1px solid ${VANTARY.rule}`,
              }}
            >
              <Search size={15} strokeWidth={1.5} color={VANTARY.amber} aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCursor(0) }}
                placeholder="Search commands, days, sessions, themes…"
                aria-label="Search commands"
                className="flex-1 bg-transparent border-none outline-none ml-3 font-mono"
                style={{
                  color: VANTARY.paper,
                  fontSize: 13.5,
                  letterSpacing: "0.01em",
                  caretColor: VANTARY.amber,
                }}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close palette (Esc)"
                className="ml-2 flex items-center gap-1.5 font-mono uppercase focus:outline-none"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: VANTARY.ashSoft,
                  padding: "3px 7px",
                  border: `1px solid ${VANTARY.rule}`,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ESC
              </button>
            </div>

            {/* ── Live session strip · only visible with no query ───── */}
            {!query && activeKey && (
              <div
                className="relative flex items-center justify-between font-mono"
                style={{
                  padding: "8px 18px",
                  borderBottom: `1px solid ${VANTARY.rule}`,
                  background: VANTARY.amberWash,
                  fontSize: 9.5,
                  letterSpacing: "0.22em",
                  color: VANTARY.amber,
                }}
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    aria-hidden
                    className="rounded-full"
                    style={{
                      width: 5, height: 5,
                      background: VANTARY.amber,
                      boxShadow: `0 0 5px ${VANTARY.amber}`,
                      display: "inline-block",
                    }}
                    animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
                    transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span>LIVE</span>
                  <span style={{ color: VANTARY.ashSoft }}>·</span>
                  <span>{SESSION_DEFS.find(s => s.key === activeKey)?.short ?? activeKey}</span>
                  {elapsedMin != null && (
                    <>
                      <span style={{ color: VANTARY.ashSoft }}>·</span>
                      <span>{elapsedMin}M ELAPSED</span>
                    </>
                  )}
                </div>
                <span style={{ color: VANTARY.ashSoft }}>{utcClock} UTC</span>
              </div>
            )}

            {/* ── Results list ─────────────────────────────────────── */}
            <div className="relative flex-1 overflow-y-auto" style={{ minHeight: 200 }}>
              {filtered.length === 0 ? (
                <EmptyState query={query} />
              ) : (
                grouped.map(({ id, items }) => (
                  <CommandGroupSection
                    key={id}
                    groupId={id}
                    items={items}
                    cursorRowId={cursorRowId}
                    onPerform={performCmd}
                    onHover={(rowId) => {
                      const idx = filtered.findIndex(c => c.id === rowId)
                      if (idx >= 0) setCursor(idx)
                    }}
                  />
                ))
              )}
            </div>

            {/* ── Footer · keyboard hints ───────────────────────────── */}
            <div
              className="relative flex items-center justify-between font-mono"
              style={{
                padding: "9px 18px",
                borderTop: `1px solid ${VANTARY.rule}`,
                fontSize: 8.5,
                letterSpacing: "0.22em",
                color: VANTARY.ashSoft,
                background: "rgba(0,0,0,0.18)",
              }}
            >
              <div className="flex items-center gap-4">
                <FooterHint icon={<ArrowUp   size={9} strokeWidth={1.5} />} after={<ArrowDown size={9} strokeWidth={1.5} />} label="NAVIGATE" />
                <FooterHint icon={<CornerDownLeft size={10} strokeWidth={1.5} />} label="SELECT" />
                <FooterHint label="ESC" labelOnly after={<span>CLOSE</span>} />
              </div>
              <div className="flex items-center gap-2">
                <span>{filtered.length} ROW{filtered.length === 1 ? "" : "S"}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  GROUP SECTION · One header + N rows.
 * ───────────────────────────────────────────────────────────────────────── */

function CommandGroupSection({
  groupId,
  items,
  cursorRowId,
  onPerform,
  onHover,
}: {
  groupId: CommandGroupId
  items: VantaryCommand[]
  cursorRowId: string | null
  onPerform: (cmd: VantaryCommand) => void
  onHover: (rowId: string) => void
}) {
  const headerLabel = groupHeaderLabel(groupId)
  return (
    <section aria-label={headerLabel}>
      <div
        className="flex items-center gap-2 font-mono uppercase"
        style={{
          padding: "12px 18px 6px",
          fontSize: 8.5,
          letterSpacing: "0.26em",
          color: VANTARY.ashSoft,
        }}
      >
        <span>{headerLabel}</span>
        <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule, opacity: 0.5 }} />
        <span style={{ color: VANTARY.ashGhost }}>{items.length}</span>
      </div>
      <ul role="listbox" className="flex flex-col">
        {items.map(cmd => (
          <CommandRow
            key={cmd.id}
            cmd={cmd}
            active={cmd.id === cursorRowId}
            onPerform={onPerform}
            onHover={onHover}
          />
        ))}
      </ul>
    </section>
  )
}

function groupHeaderLabel(g: CommandGroupId): string {
  switch (g) {
    case "recent":    return "RECENT"
    case "days":      return "DAYS · THE WEEK"
    case "sessions":  return "SESSIONS · 7-WINDOW CALENDAR"
    case "themes":    return "THEMES"
    case "ai":        return "AI SHORTCUTS"
    case "navigate":  return "NAVIGATE"
    case "extension": return "EXTENSIONS"
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 *  ROW · 1 px hairline divider, leading icon, label/desc stack, meta.
 *  Active state: amber left bar + amberWash background, paper text.
 * ───────────────────────────────────────────────────────────────────────── */

function CommandRow({
  cmd,
  active,
  onPerform,
  onHover,
}: {
  cmd: VantaryCommand
  active: boolean
  onPerform: (cmd: VantaryCommand) => void
  onHover: (rowId: string) => void
}) {
  const Icon = cmd.icon
  const ref = useRef<HTMLLIElement | null>(null)

  // Auto-scroll the active row into view as the cursor moves.
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest", behavior: "instant" as ScrollBehavior })
  }, [active])

  return (
    <li
      ref={ref}
      role="option"
      aria-selected={active}
      onMouseMove={() => onHover(cmd.id)}
      onClick={() => onPerform(cmd)}
      className="relative flex items-center gap-3 cursor-pointer"
      style={{
        padding: "9px 18px 9px 22px",
        borderTop: `1px solid ${VANTARY.rule}`,
        background: active ? VANTARY.amberWash : "transparent",
        transition: "background-color 120ms",
      }}
    >
      {/* Active left-bar */}
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-0 bottom-0"
          style={{ width: 2, background: VANTARY.amber, boxShadow: `0 0 6px ${VANTARY.amber}` }}
        />
      )}

      {/* Leading icon */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 22, height: 22,
          border: `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
          background: active ? VANTARY.amberWash : "transparent",
        }}
      >
        {Icon ? (
          <Icon size={12} strokeWidth={1.5} color={active ? VANTARY.amber : VANTARY.ashSoft} />
        ) : (
          <span style={{ width: 4, height: 4, background: VANTARY.ash, display: "inline-block" }} />
        )}
      </div>

      {/* Label + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="truncate"
            style={{
              fontSize: 12.5,
              color: active ? VANTARY.paper : VANTARY.paperDim,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            {cmd.label}
          </span>
          {cmd.liveDot && (
            <span
              aria-hidden
              style={{
                width: 4, height: 4, borderRadius: "50%",
                background: VANTARY.amber,
                boxShadow: `0 0 4px ${VANTARY.amber}`,
                flexShrink: 0,
              }}
            />
          )}
        </div>
        {cmd.description && (
          <div
            className="truncate font-sans"
            style={{
              fontSize: 11,
              color: VANTARY.ashSoft,
              marginTop: 2,
              letterSpacing: "0.01em",
            }}
          >
            {cmd.description}
          </div>
        )}
      </div>

      {/* Meta */}
      {cmd.meta && (
        <span
          className="flex-shrink-0 font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: active ? VANTARY.amber : VANTARY.ashSoft,
            padding: "3px 6px",
            border: `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
            background: "transparent",
          }}
        >
          {cmd.meta}
        </span>
      )}
    </li>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  EMPTY STATE · No matches. Suggests three example queries.
 * ───────────────────────────────────────────────────────────────────────── */

function EmptyState({ query }: { query: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ padding: "48px 24px", minHeight: 220 }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 36, height: 36,
          border: `1px solid ${VANTARY.rule}`,
          marginBottom: 14,
        }}
      >
        <Search size={14} strokeWidth={1.5} color={VANTARY.ashSoft} />
      </div>
      <div
        className="font-mono uppercase"
        style={{ fontSize: 9.5, letterSpacing: "0.26em", color: VANTARY.ashSoft }}
      >
        NO RESULTS
      </div>
      <div
        className="mt-2"
        style={{ fontSize: 12.5, color: VANTARY.paperDim, fontStyle: "italic" }}
      >
        {query ? <>{`Nothing matches “${query}”.`}</> : "The registry is empty."}
      </div>
      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-1.5 font-mono uppercase"
        style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        <span>TRY:</span>
        {["tuesday", "ny kz", "obsidian"].map(s => (
          <span
            key={s}
            style={{
              padding: "2px 6px",
              border: `1px solid ${VANTARY.rule}`,
              color: VANTARY.paperDim,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  FOOTER HINT · Atomic "icon + label" pill for the keyboard legend.
 * ───────────────────────────────────────────────────────────────────────── */

function FooterHint({
  icon,
  label,
  after,
  labelOnly = false,
}: {
  icon?: React.ReactNode
  label: string
  after?: React.ReactNode
  labelOnly?: boolean
}) {
  return (
    <span className="flex items-center gap-1.5">
      {!labelOnly && icon && (
        <span
          className="flex items-center justify-center"
          style={{
            width: 16, height: 16,
            border: `1px solid ${VANTARY.rule}`,
            color: VANTARY.paperDim,
          }}
        >
          {icon}
        </span>
      )}
      {labelOnly && (
        <span
          className="flex items-center justify-center"
          style={{
            padding: "1px 5px",
            border: `1px solid ${VANTARY.rule}`,
            color: VANTARY.paperDim,
            fontSize: 8.5,
          }}
        >
          {label}
        </span>
      )}
      {!labelOnly && <span>{label}</span>}
      {after && <span style={{ color: VANTARY.paperDim }}>{after}</span>}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  HINT CHIP · A small, unobtrusive "⌘K" pill that opens the palette when
 *  clicked. Drop it anywhere in page chrome (e.g. the header or footer).
 *  Hover lifts the border to amberHalo and changes the kbd glyph to amber.
 * ───────────────────────────────────────────────────────────────────────── */

export function CommandPaletteHint({ className = "" }: { className?: string }) {
  const { toggle } = useCommandPalette()
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = hover || focused

  // Detect Mac vs PC for the modifier glyph (cosmetic only).
  const isMac = useMemo(() => {
    if (typeof navigator === "undefined") return false
    return /Mac|iPhone|iPad/i.test(navigator.platform)
  }, [])

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label="Open command palette"
      title={`Open command palette (${isMac ? "⌘" : "Ctrl"}+K)`}
      className={`flex items-center gap-2 font-mono uppercase focus:outline-none ${className}`}
      style={{
        padding: "4px 9px 4px 7px",
        fontSize: 9,
        letterSpacing: "0.22em",
        color: active ? VANTARY.amber : VANTARY.ashSoft,
        border: `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
        background: active ? VANTARY.amberWash : "transparent",
        transition: "color 180ms, border-color 180ms, background-color 180ms, box-shadow 180ms",
        cursor: "pointer",
        boxShadow: focused ? `0 0 0 2px ${VANTARY.amberWash}, 0 0 6px ${VANTARY.amberHalo}` : "none",
      }}
    >
      <Search size={10} strokeWidth={1.75} aria-hidden />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        <kbd
          style={{
            fontFamily: "inherit",
            fontSize: 9,
            padding: "1px 4px",
            border: `1px solid ${VANTARY.rule}`,
            color: active ? VANTARY.amber : VANTARY.paperDim,
            letterSpacing: 0,
          }}
        >
          {isMac ? "⌘" : "Ctrl"}
        </kbd>
        <kbd
          style={{
            fontFamily: "inherit",
            fontSize: 9,
            padding: "1px 4px",
            border: `1px solid ${VANTARY.rule}`,
            color: active ? VANTARY.amber : VANTARY.paperDim,
            letterSpacing: 0,
          }}
        >
          K
        </kbd>
      </span>
      <span>COMMANDS</span>
    </button>
  )
}
