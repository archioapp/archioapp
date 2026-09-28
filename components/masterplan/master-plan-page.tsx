"use client"

/**
 * MASTERPLAN page shell (DETAILED PASS v2)
 * ────────────────────────────────────────────────────────────────────────
 * Top-level client island. Owns the surface state and orchestrates the
 * star + the editorial detail panel. The page is now organised as a
 * cockpit:
 *
 *   1. AMBIENT BACKDROP — radial amber wash, dashed grid (intensified
 *      in blueprint mode), two slow counter-rotating rings.
 *   2. UTILITY BAR — plan slug + version + status + open-pillar chip.
 *   3. CONTROL BAR — Constellation / Ledger / Topology mode chips,
 *      Blueprint, Auto-tour, Reset, Keys. All keyboard-shortcut linked.
 *   4. HERO BLOCK — protagonist editorial header + ScopeCard.
 *   5. PHASE RIBBON — three-phase rollout sequencer, click any pillar
 *      chip to open it. Reads from PHASES[] in master-plan-data.
 *   6. STAR CONSTELLATION — the 5-vertex pentagram (untouched).
 *   7. DESIGN LANGUAGE BAND — typography rules used in the surface.
 *   8. SCROLL CUE — only when a pillar is active.
 *   9. DETAIL PANEL — editorial breakdown of the active pillar.
 *  10. STATUS BAR — live HUD: active, hovered, mode, blueprint, tour,
 *      telemetry counter (clickable to expand the dock).
 *  11. OUT-OF-SCOPE STRIP — guardrails the user shouldn't touch.
 *  12. TELEMETRY DOCK — collapsible audit trail at the bottom.
 *  13. SHORTCUTS OVERLAY — full-screen modal listing all keys.
 *
 * The page intentionally adds chrome AROUND the existing star + detail
 * components rather than modifying them, so the surface composes cleanly
 * with the existing components/masterplan files.
 *
 * Keyboard contract (handler is no-op when typing inside an input):
 *   1–5         jump to pillar
 *   ←  →        cycle pillars (when one is open)
 *   Esc         close the active pillar / overlay
 *   T           toggle auto-tour
 *   B           toggle blueprint mode
 *   M           cycle mode (Constellation → Ledger → Topology)
 *   R           reset canvas
 *   ?           open / close the shortcuts overlay
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Activity,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Command,
  Compass,
  Cpu,
  FileText,
  Keyboard,
  Layers,
  Map as MapIcon,
  PauseCircle,
  PlayCircle,
  Ruler,
  RotateCcw,
  Sigma,
  Sparkles,
  Terminal,
  X,
} from "lucide-react"
import { MasterPlanStar } from "./master-plan-star"
import { MasterPlanDetail } from "./master-plan-detail"
import {
  LANGUAGE_RULES,
  OUT_OF_SCOPE,
  PHASES,
  PILLARS,
  TELEMETRY_LOG,
  type Pillar,
  type PillarKey,
} from "./master-plan-data"

/* ── Theme — kept identical to the prior page so the new chrome
 * inherits the same warm-paper-on-graphite ground. ── */
const C = {
  ink: "#0c0c10",
  glass: "rgba(18,20,28,0.62)",
  glassDeep: "rgba(12,12,16,0.85)",
  rule: "rgba(255,255,255,0.08)",
  ruleSoft: "rgba(255,255,255,0.05)",
  ruleStrong: "rgba(255,255,255,0.14)",
  paper: "rgba(255,255,255,0.96)",
  paperDim: "rgba(255,255,255,0.78)",
  ash: "rgba(255,255,255,0.55)",
  ashSoft: "rgba(255,255,255,0.42)",
  ashGhost: "rgba(255,255,255,0.30)",
  amber: "#f59e0b",
  amberWash: "rgba(245,158,11,0.10)",
  amberHalo: "rgba(245,158,11,0.22)",
  emerald: "#10b981",
  emeraldHalo: "rgba(16,185,129,0.22)",
  cyan: "#22d3ee",
  cyanHalo: "rgba(34,211,238,0.22)",
  rose: "#ef4444",
} as const

/* ── Types ───────────────────────────────────────────────────────────── */

type StarMode = "constellation" | "ledger" | "topology"

/** A single line in the runtime audit trail. The dock concatenates
 *  TELEMETRY_LOG (the seeded story) with `runtimeEvents` (events
 *  emitted as the user interacts) so the dock always feels alive. */
type RuntimeEvent = {
  id: number
  ts: number
  kind:
    | "open"
    | "close"
    | "tour-start"
    | "tour-stop"
    | "mode-change"
    | "blueprint"
    | "reset"
    | "tab-change"
  pillarKey?: PillarKey
  payload?: string
}

/** Auto-tour stride. Enough to read each panel, not so slow it feels
 *  sluggish. */
const TOUR_STRIDE_MS = 5400

/* ════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════ */
export function MasterPlanPage() {
  /* ── 1. STATE ─────────────────────────────────────────────────────── */
  const [active, setActive] = useState<PillarKey | null>("goal")
  const [hovered, setHovered] = useState<PillarKey | null>(null)
  const [mode, setMode] = useState<StarMode>("constellation")
  const [blueprint, setBlueprint] = useState(false)
  const [tourRunning, setTourRunning] = useState(false)
  const [telemetryOpen, setTelemetryOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [runtimeEvents, setRuntimeEvents] = useState<RuntimeEvent[]>([])
  const eventCounter = useRef(0)
  const reducedMotion = useReducedMotion()

  /* Compute the active pillar object once per state change. */
  const activePillar = useMemo<Pillar | null>(
    () => (active ? PILLARS.find((p) => p.key === active) ?? null : null),
    [active],
  )
  const hoveredPillar = useMemo<Pillar | null>(
    () => (hovered ? PILLARS.find((p) => p.key === hovered) ?? null : null),
    [hovered],
  )

  /* ── 2. TELEMETRY RECORDER ────────────────────────────────────────── */
  const log = useCallback(
    (kind: RuntimeEvent["kind"], pillarKey?: PillarKey, payload?: string) => {
      eventCounter.current += 1
      setRuntimeEvents((prev) => {
        const next = [
          ...prev,
          {
            id: eventCounter.current,
            ts: Date.now(),
            kind,
            pillarKey,
            payload,
          },
        ]
        /* Cap at 80 entries so the dock paginates sensibly. */
        return next.length > 80 ? next.slice(next.length - 80) : next
      })
    },
    [],
  )

  /* ── 3. PILLAR HANDLERS ───────────────────────────────────────────── */
  const handleSelect = useCallback(
    (key: PillarKey) => {
      setActive((prev) => {
        const next = prev === key ? null : key
        log(next === null ? "close" : "open", key)
        return next
      })
      /* Microtask delay so AnimatePresence has a frame to mount. */
      requestAnimationFrame(() => {
        const el = document.getElementById("masterplan-detail")
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" })
      })
    },
    [log],
  )

  const closeActive = useCallback(() => {
    if (active) log("close", active)
    setActive(null)
  }, [active, log])

  /* ── 4. AUTO-TOUR ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!tourRunning) return
    const id = window.setInterval(() => {
      setActive((current) => {
        if (current === null) {
          log("open", PILLARS[0].key)
          return PILLARS[0].key
        }
        const idx = PILLARS.findIndex((p) => p.key === current)
        const next = PILLARS[(idx + 1) % PILLARS.length].key
        log("open", next)
        return next
      })
    }, TOUR_STRIDE_MS)
    return () => window.clearInterval(id)
  }, [tourRunning, log])

  const startTour = useCallback(() => {
    if (tourRunning) return
    setTourRunning(true)
    log("tour-start")
  }, [tourRunning, log])

  const stopTour = useCallback(() => {
    if (!tourRunning) return
    setTourRunning(false)
    log("tour-stop")
  }, [tourRunning, log])

  /* ── 5. MODE / BLUEPRINT / RESET ──────────────────────────────────── */
  const setModeAndLog = useCallback(
    (m: StarMode) => {
      if (m === mode) return
      setMode(m)
      log("mode-change", undefined, m)
    },
    [mode, log],
  )
  const toggleBlueprint = useCallback(() => {
    setBlueprint((b) => {
      const next = !b
      log("blueprint", undefined, next ? "on" : "off")
      return next
    })
  }, [log])
  const resetCanvas = useCallback(() => {
    setActive("goal")
    setMode("constellation")
    setBlueprint(false)
    setTourRunning(false)
    log("reset")
  }, [log])

  /* ── 6. KEYBOARD CONTRACT ─────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }
      if (e.key === "?") {
        setShortcutsOpen((s) => !s)
        return
      }
      if (e.key === "Escape") {
        if (shortcutsOpen) setShortcutsOpen(false)
        else closeActive()
        return
      }
      if (e.key === "t" || e.key === "T") {
        if (tourRunning) stopTour()
        else startTour()
        return
      }
      if (e.key === "b" || e.key === "B") {
        toggleBlueprint()
        return
      }
      if (e.key === "m" || e.key === "M") {
        const order: StarMode[] = ["constellation", "ledger", "topology"]
        const next = order[(order.indexOf(mode) + 1) % order.length]
        setModeAndLog(next)
        return
      }
      if (e.key === "r" || e.key === "R") {
        resetCanvas()
        return
      }
      const num = Number.parseInt(e.key, 10)
      if (!Number.isNaN(num) && num >= 1 && num <= 5) {
        const p = PILLARS.find((x) => x.vertex === num - 1)
        if (p) handleSelect(p.key)
        return
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const idx = activePillar
          ? PILLARS.findIndex((p) => p.key === activePillar.key)
          : -1
        const next =
          e.key === "ArrowRight"
            ? PILLARS[(idx + 1 + PILLARS.length) % PILLARS.length]
            : PILLARS[(idx - 1 + PILLARS.length) % PILLARS.length]
        handleSelect(next.key)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [
    activePillar,
    mode,
    tourRunning,
    shortcutsOpen,
    handleSelect,
    closeActive,
    startTour,
    stopTour,
    toggleBlueprint,
    setModeAndLog,
    resetCanvas,
  ])

  /* ── 7. RENDER ────────────────────────────────────────────────────── */
  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        background: C.ink,
        color: C.paper,
      }}
    >
      <Backdrop blueprint={blueprint} reducedMotion={!!reducedMotion} />

      <main className="relative max-w-[1180px] mx-auto px-6 md:px-10 pt-10 pb-32">
        <UtilityBar
          activeLabel={activePillar?.tag ?? "Pick a pillar"}
          tourRunning={tourRunning}
        />

        {/* CONTROL BAR — sits directly under the utility bar so the
            cockpit chrome reads as one unit before the editorial hero. */}
        <ControlBar
          mode={mode}
          setMode={setModeAndLog}
          blueprint={blueprint}
          toggleBlueprint={toggleBlueprint}
          tourRunning={tourRunning}
          startTour={startTour}
          stopTour={stopTour}
          resetCanvas={resetCanvas}
          openShortcuts={() => setShortcutsOpen(true)}
        />

        {/* HERO + SCOPE */}
        <header className="mt-8 mb-8 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-3">
            <span
              className="inline-flex items-center gap-2 font-mono uppercase"
              style={{
                color: C.amber,
                fontSize: 10,
                letterSpacing: "0.28em",
                fontWeight: 500,
              }}
            >
              <Sparkles size={12} strokeWidth={1.6} />
              MY RECORD · MASTERPLAN v2 · LIGHT-SCOPE
            </span>
            <h1
              className="font-sans text-balance"
              style={{
                fontSize: "clamp(38px, 5vw, 64px)",
                fontWeight: 500,
                color: C.paper,
                letterSpacing: "-0.045em",
                lineHeight: 0.94,
              }}
            >
              Replace one passive sparkline
              <br />
              with{" "}
              <span style={{ color: C.amber, textShadow: `0 0 32px ${C.amberHalo}` }}>
                three protagonist stories.
              </span>
            </h1>
            <p
              className="font-sans italic"
              style={{
                color: C.paperDim,
                fontSize: 14,
                letterSpacing: "-0.005em",
                lineHeight: 1.55,
                maxWidth: 620,
              }}
            >
              Each pillar is one vertex of the plan. Click a vertex to expand its
              build order, ledger and signal magnitude. Use <kbd className="font-mono">←</kbd>{" "}
              <kbd className="font-mono">→</kbd> to cycle, <kbd className="font-mono">1</kbd>–
              <kbd className="font-mono">5</kbd> to jump, <kbd className="font-mono">T</kbd> for
              auto-tour, <kbd className="font-mono">?</kbd> for all keys.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <PlanScopeCard />
          </div>
        </header>

        {/* PHASE RIBBON — the rollout cadence above the star. */}
        <PhaseRibbon active={active} hovered={hovered} onSelect={handleSelect} />

        {/* STAR CONSTELLATION */}
        <section
          className="relative mx-auto"
          style={{
            paddingTop: 24,
            paddingBottom: 40,
          }}
          aria-label="Pentagram of plan pillars"
        >
          <MasterPlanStar
            active={active}
            onSelect={handleSelect}
            blueprint={blueprint}
            tourActive={tourRunning}
          />

          {/* Hover-receiver — invisible chip strip below the star giving
              the user a way to hover-preview pillars without leaving the
              keyboard / star. Mirrors the phase ribbon's behavior. */}
          <PillarHoverStrip
            active={active}
            hovered={hovered}
            onHover={setHovered}
            onSelect={handleSelect}
          />
        </section>

        {/* DESIGN-LANGUAGE BAND */}
        <LanguageBand />

        {/* SCROLL CUE */}
        {active && (
          <div className="flex items-center justify-center my-8" aria-hidden>
            <span
              className="inline-flex items-center gap-1.5 font-mono uppercase"
              style={{
                color: C.ashGhost,
                fontSize: 9,
                letterSpacing: "0.28em",
                fontWeight: 500,
              }}
            >
              <span
                aria-hidden
                className="inline-block"
                style={{ width: 28, height: 1, background: C.ruleSoft }}
              />
              <ArrowDown size={11} strokeWidth={1.6} />
              PILLAR DETAIL
              <span
                aria-hidden
                className="inline-block"
                style={{ width: 28, height: 1, background: C.ruleSoft }}
              />
            </span>
          </div>
        )}

        {/* DETAIL PANEL */}
        <div id="masterplan-detail" className="scroll-mt-8">
          <MasterPlanDetail
            pillar={activePillar}
            onClose={closeActive}
            onJumpTo={handleSelect}
          />
        </div>

        {/* STATUS BAR — between the detail and the out-of-scope strip,
            reads like the cockpit's HUD. */}
        <StatusBar
          activePillar={activePillar}
          hoveredPillar={hoveredPillar}
          mode={mode}
          blueprint={blueprint}
          tourRunning={tourRunning}
          telemetryCount={runtimeEvents.length + TELEMETRY_LOG.length}
          telemetryOpen={telemetryOpen}
          onToggleTelemetry={() => setTelemetryOpen((t) => !t)}
        />

        {/* OUT-OF-SCOPE STRIP */}
        <OutOfScopeStrip />
      </main>

      {/* TELEMETRY DOCK */}
      <AnimatePresence>
        {telemetryOpen && (
          <motion.div
            initial={{ y: 240, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 240, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 inset-x-0 z-30"
          >
            <TelemetryDock
              runtimeEvents={runtimeEvents}
              onClear={() => setRuntimeEvents([])}
              onClose={() => setTelemetryOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHORTCUTS OVERLAY */}
      <AnimatePresence>
        {shortcutsOpen && <ShortcutsOverlay onClose={() => setShortcutsOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   BACKDROP — radial wash + dashed grid + slow rings + blueprint overlay
   ════════════════════════════════════════════════════════════════════════ */
function Backdrop({
  blueprint,
  reducedMotion,
}: {
  blueprint: boolean
  reducedMotion: boolean
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Radial amber wash, top-center. */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: -200,
          transform: "translateX(-50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(245,158,11,0.10), rgba(245,158,11,0.02) 50%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Base dashed grid — soft. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.55), transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.55), transparent 78%)",
        }}
      />

      {/* Blueprint overlay — only visible when blueprint mode is on.
          Adds an engineering-paper grid at finer cadence + cyan tint
          so the entire surface reads as a working schematic. */}
      <AnimatePresence>
        {blueprint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(34,211,238,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.045) 1px, transparent 1px), linear-gradient(0deg, rgba(34,211,238,0.020) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.020) 1px, transparent 1px)",
              backgroundSize: "144px 144px, 144px 144px, 24px 24px, 24px 24px",
              maskImage:
                "radial-gradient(ellipse at 50% 35%, rgba(0,0,0,0.55), transparent 82%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 50% 35%, rgba(0,0,0,0.55), transparent 82%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Slow counter-rotating rings — these add the "cosmic chart"
          feel. We pause animations under reduced-motion. */}
      <motion.div
        className="absolute"
        style={{
          left: "50%",
          top: "44%",
          width: 1200,
          height: 1200,
          marginLeft: -600,
          marginTop: -600,
          borderRadius: "50%",
          border: `1px dashed ${C.ruleSoft}`,
        }}
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 240, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute"
        style={{
          left: "50%",
          top: "44%",
          width: 880,
          height: 880,
          marginLeft: -440,
          marginTop: -440,
          borderRadius: "50%",
          border: `1px dashed ${C.ruleSoft}`,
        }}
        animate={reducedMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 320, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   UTILITY BAR — plan slug + version + status
   ════════════════════════════════════════════════════════════════════════ */
function UtilityBar({
  activeLabel,
  tourRunning,
}: {
  activeLabel: string
  tourRunning: boolean
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-full"
      style={{
        background: C.glass,
        border: `1px solid ${C.rule}`,
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="inline-flex items-center justify-center rounded-md shrink-0"
          style={{
            width: 26,
            height: 26,
            background: C.amberWash,
            border: `1px solid rgba(245,158,11,0.4)`,
            color: C.amber,
          }}
        >
          <FileText size={13} strokeWidth={1.6} />
        </span>
        <div className="flex flex-col min-w-0">
          <span
            className="font-mono uppercase truncate"
            style={{
              color: C.ashGhost,
              fontSize: 8.5,
              letterSpacing: "0.28em",
              fontWeight: 500,
            }}
          >
            ACTIVE PLAN FILE
          </span>
          <span
            className="font-mono truncate"
            style={{
              color: C.paper,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            v0_plans/light-scope.md
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 shrink-0">
        <UtilityChip
          label="STATUS"
          value={tourRunning ? "TOURING" : "LIVE"}
          tone={tourRunning ? "emerald" : "emerald"}
          pulse
        />
        <UtilityDivider />
        <UtilityChip label="SCOPE" value="forecast-my-record.tsx" />
        <UtilityDivider />
        <UtilityChip label="OPEN" value={activeLabel} tone="amber" />
      </div>
    </div>
  )
}

function UtilityChip({
  label,
  value,
  tone,
  pulse,
}: {
  label: string
  value: string
  tone?: "emerald" | "amber"
  pulse?: boolean
}) {
  const accent = tone === "emerald" ? C.emerald : tone === "amber" ? C.amber : C.paper
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="font-mono uppercase"
        style={{
          color: C.ashGhost,
          fontSize: 8.5,
          letterSpacing: "0.22em",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      {pulse && (
        <motion.span
          aria-hidden
          className="inline-block rounded-full"
          style={{ width: 6, height: 6, background: accent, boxShadow: `0 0 6px ${accent}` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      )}
      <span
        className="font-mono tabular-nums truncate max-w-[180px]"
        style={{
          color: accent,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {value}
      </span>
    </span>
  )
}

function UtilityDivider() {
  return (
    <span
      aria-hidden
      className="inline-block"
      style={{ width: 1, height: 12, background: C.ruleSoft }}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   CONTROL BAR — mode chips + blueprint + auto-tour + reset + keys
   ════════════════════════════════════════════════════════════════════════ */
function ControlBar({
  mode,
  setMode,
  blueprint,
  toggleBlueprint,
  tourRunning,
  startTour,
  stopTour,
  resetCanvas,
  openShortcuts,
}: {
  mode: StarMode
  setMode: (m: StarMode) => void
  blueprint: boolean
  toggleBlueprint: () => void
  tourRunning: boolean
  startTour: () => void
  stopTour: () => void
  resetCanvas: () => void
  openShortcuts: () => void
}) {
  return (
    <div
      className="mt-3 flex items-center justify-between gap-3 px-3 py-2 rounded-2xl flex-wrap"
      style={{
        background: C.glass,
        border: `1px solid ${C.rule}`,
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
      }}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className="font-mono uppercase pl-1"
          style={{
            color: C.ashGhost,
            fontSize: 8.5,
            letterSpacing: "0.28em",
            fontWeight: 500,
          }}
        >
          VIEW MODE
        </span>
        <ModeChip
          icon={<Compass size={11} strokeWidth={1.7} />}
          label="Constellation"
          active={mode === "constellation"}
          onClick={() => setMode("constellation")}
          shortcut="M"
        />
        <ModeChip
          icon={<Layers size={11} strokeWidth={1.7} />}
          label="Ledger"
          active={mode === "ledger"}
          onClick={() => setMode("ledger")}
        />
        <ModeChip
          icon={<MapIcon size={11} strokeWidth={1.7} />}
          label="Topology"
          active={mode === "topology"}
          onClick={() => setMode("topology")}
        />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <ToolChip
          icon={<Ruler size={11} strokeWidth={1.7} />}
          label={blueprint ? "Blueprint on" : "Blueprint"}
          active={blueprint}
          onClick={toggleBlueprint}
          shortcut="B"
          accent={blueprint ? C.cyan : undefined}
        />
        <ToolChip
          icon={
            tourRunning ? (
              <PauseCircle size={11} strokeWidth={1.7} />
            ) : (
              <PlayCircle size={11} strokeWidth={1.7} />
            )
          }
          label={tourRunning ? "Pause tour" : "Auto-tour"}
          active={tourRunning}
          onClick={tourRunning ? stopTour : startTour}
          shortcut="T"
          accent={tourRunning ? C.emerald : undefined}
        />
        <ToolChip
          icon={<RotateCcw size={11} strokeWidth={1.7} />}
          label="Reset"
          onClick={resetCanvas}
          shortcut="R"
        />
        <ToolChip
          icon={<Keyboard size={11} strokeWidth={1.7} />}
          label="Keys"
          onClick={openShortcuts}
          shortcut="?"
        />
      </div>
    </div>
  )
}

function ModeChip({
  icon,
  label,
  active,
  onClick,
  shortcut,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  shortcut?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex items-center gap-1.5"
      style={{
        height: 28,
        padding: "0 12px",
        borderRadius: 999,
        background: active ? "rgba(245,158,11,0.10)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${active ? "rgba(245,158,11,0.45)" : C.ruleSoft}`,
        color: active ? C.amber : C.ashSoft,
        cursor: "pointer",
        transition:
          "background 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out",
      }}
      aria-pressed={active}
    >
      {icon}
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "-0.005em" }}>
        {label}
      </span>
      {shortcut && (
        <kbd
          className="font-mono ml-1"
          style={{
            fontSize: 8.5,
            fontWeight: 500,
            color: C.ashGhost,
            padding: "1px 5px",
            borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.ruleSoft}`,
            lineHeight: 1,
          }}
        >
          {shortcut}
        </kbd>
      )}
    </button>
  )
}

function ToolChip({
  icon,
  label,
  active,
  onClick,
  shortcut,
  accent,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
  shortcut?: string
  accent?: string
}) {
  const tone = accent ?? (active ? C.amber : C.ashSoft)
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex items-center gap-1.5"
      style={{
        height: 28,
        padding: "0 10px",
        borderRadius: 7,
        background: active ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? `${tone}44` : C.ruleSoft}`,
        color: tone,
        cursor: "pointer",
        transition:
          "background 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out",
      }}
      aria-pressed={!!active}
    >
      {icon}
      <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: "-0.005em" }}>
        {label}
      </span>
      {shortcut && (
        <kbd
          className="font-mono ml-0.5"
          style={{
            fontSize: 8.5,
            fontWeight: 500,
            color: C.ashGhost,
            padding: "1px 5px",
            borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.ruleSoft}`,
            lineHeight: 1,
          }}
        >
          {shortcut}
        </kbd>
      )}
    </button>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   PLAN SCOPE CARD — totals + 1-line manifesto
   ════════════════════════════════════════════════════════════════════════ */
function PlanScopeCard() {
  const counts = useMemo(() => {
    const totalActions = PILLARS.reduce((acc, p) => acc + p.actions.length, 0)
    return {
      pillars: PILLARS.length,
      actions: totalActions,
      ledgerRows: PILLARS.reduce(
        (acc, p) => acc + p.leftLedger.length + p.rightLedger.length,
        0,
      ),
    }
  }, [])

  return (
    <div
      className="relative px-5 py-4 flex flex-col gap-3"
      style={{
        background: C.glass,
        border: `1px solid ${C.rule}`,
        borderRadius: 18,
        backdropFilter: "blur(22px) saturate(150%)",
        WebkitBackdropFilter: "blur(22px) saturate(150%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 42px rgba(0,0,0,0.4)",
      }}
    >
      {/* Anchor circle ornament — top-right. */}
      <span
        aria-hidden
        className="absolute"
        style={{
          right: 14,
          top: 14,
          width: 9,
          height: 9,
          border: `1px solid ${C.amber}`,
          borderRadius: "50%",
          boxShadow: `0 0 10px ${C.amberHalo}`,
        }}
      />
      <span
        aria-hidden
        className="absolute"
        style={{
          right: 22.5,
          top: 18.5,
          width: 24,
          height: 1,
          background: C.amber,
          opacity: 0.35,
        }}
      />

      <span
        className="inline-flex items-center gap-2 font-mono uppercase"
        style={{
          color: C.ashGhost,
          fontSize: 9.5,
          letterSpacing: "0.28em",
          fontWeight: 500,
        }}
      >
        <Sigma size={11} strokeWidth={1.6} />
        SCOPE TOTALS
      </span>

      <div className="grid grid-cols-3 gap-2">
        <ScopeCell value={String(counts.pillars).padStart(2, "0")} label="PILLARS" />
        <ScopeCell value={String(counts.actions)} label="BUILD STEPS" tone="amber" />
        <ScopeCell value={String(counts.ledgerRows)} label="LEDGER ROWS" />
      </div>

      <span
        aria-hidden
        className="block w-full"
        style={{
          height: 1,
          backgroundImage: `linear-gradient(90deg, transparent, ${C.ruleSoft} 14%, ${C.ruleSoft} 86%, transparent)`,
        }}
      />

      <p
        className="font-sans italic"
        style={{
          color: C.paperDim,
          fontSize: 11.5,
          letterSpacing: "-0.005em",
          lineHeight: 1.55,
        }}
      >
        One file in scope. Six new shared primitives. Three protagonist cards
        replace three small ones — the page reads as a story.
      </p>
    </div>
  )
}

function ScopeCell({
  value,
  label,
  tone,
}: {
  value: string
  label: string
  tone?: "amber"
}) {
  return (
    <div className="flex flex-col">
      <span
        className="font-sans tabular-nums"
        style={{
          color: tone === "amber" ? C.amber : C.paper,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        className="font-mono uppercase mt-1"
        style={{
          color: C.ashGhost,
          fontSize: 8.5,
          letterSpacing: "0.22em",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   PHASE RIBBON — 3-phase rollout sequencer above the star
   Each phase: index badge, label + caption, mini progress bar, and
   pillar chips that are themselves clickable. Hovering a chip
   propagates to `hovered` so the status bar reads the same pillar.
   ════════════════════════════════════════════════════════════════════════ */
function PhaseRibbon({
  active,
  hovered,
  onSelect,
}: {
  active: PillarKey | null
  hovered: PillarKey | null
  onSelect: (key: PillarKey) => void
}) {
  return (
    <section
      className="relative mt-2"
      aria-label="Rollout phases"
      style={{
        borderRadius: 16,
        border: `1px solid ${C.rule}`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.008) 100%)",
        padding: 6,
        overflow: "hidden",
      }}
    >
      {/* Soft horizontal glow — telegraphs that the ribbon reads
          left-to-right as a build cadence. */}
      <div
        aria-hidden
        className="absolute inset-y-0"
        style={{
          left: 0,
          right: 0,
          background:
            "radial-gradient(40% 100% at 0% 50%, rgba(245,158,11,0.08) 0%, transparent 60%), radial-gradient(40% 100% at 100% 50%, rgba(34,211,238,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative flex items-stretch gap-0 flex-wrap md:flex-nowrap">
        {PHASES.map((phase, idx) => (
          <div
            key={phase.index}
            className="relative flex-1 min-w-[240px] flex items-stretch"
            style={{
              padding: "10px 14px",
              borderRight:
                idx < PHASES.length - 1
                  ? `1px dashed ${C.ruleSoft}`
                  : "none",
            }}
          >
            <div className="flex items-stretch gap-3 min-w-0 w-full">
              {/* Index badge */}
              <div
                className="shrink-0 flex flex-col items-center justify-center font-mono"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background:
                    phase.progress === 100
                      ? "rgba(16,185,129,0.10)"
                      : "rgba(245,158,11,0.10)",
                  border: `1px solid ${
                    phase.progress === 100
                      ? "rgba(16,185,129,0.45)"
                      : "rgba(245,158,11,0.45)"
                  }`,
                  color: phase.progress === 100 ? C.emerald : C.amber,
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {phase.index}
              </div>

              {/* Phase copy + chips */}
              <div className="min-w-0 flex-1 flex flex-col">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="font-sans truncate"
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: C.paper,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {phase.label}
                  </span>
                  <span
                    className="font-mono uppercase shrink-0"
                    style={{
                      fontSize: 8.5,
                      fontWeight: 500,
                      color:
                        phase.progress === 100
                          ? C.emerald
                          : phase.progress >= 25
                          ? C.amber
                          : C.ashGhost,
                      letterSpacing: "0.22em",
                    }}
                  >
                    {phase.progress === 100
                      ? "SHIPPED"
                      : phase.progress >= 25
                      ? `IN FLIGHT · ${phase.progress}%`
                      : "QUEUED"}
                  </span>
                </div>
                <span
                  className="font-sans block truncate mt-0.5"
                  style={{
                    fontSize: 10.5,
                    color: C.ashSoft,
                    letterSpacing: "-0.005em",
                  }}
                  title={phase.caption}
                >
                  {phase.caption}
                </span>

                {/* Progress bar — slim hairline that fills with amber/emerald. */}
                <div
                  className="mt-2 relative"
                  style={{
                    height: 3,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                  aria-hidden
                >
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${phase.progress}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0"
                    style={{
                      borderRadius: 999,
                      background:
                        phase.progress === 100
                          ? `linear-gradient(90deg, rgba(16,185,129,0.55), ${C.emerald})`
                          : `linear-gradient(90deg, rgba(245,158,11,0.55), ${C.amber})`,
                      boxShadow:
                        phase.progress === 100
                          ? `0 0 6px ${C.emeraldHalo}`
                          : `0 0 6px ${C.amberHalo}`,
                    }}
                  />
                </div>

                {/* Pillar chips for this phase */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {phase.pillars.map((pk) => {
                    const pillar = PILLARS.find((p) => p.key === pk)!
                    const isActive = active === pk
                    const isHovered = hovered === pk
                    return (
                      <button
                        key={pk}
                        type="button"
                        onClick={() => onSelect(pk)}
                        className="group relative flex items-center gap-1 shrink-0"
                        style={{
                          height: 22,
                          padding: "0 8px",
                          borderRadius: 5,
                          background: isActive
                            ? "rgba(245,158,11,0.14)"
                            : "rgba(255,255,255,0.025)",
                          border: `1px solid ${
                            isActive
                              ? "rgba(245,158,11,0.55)"
                              : isHovered
                              ? "rgba(255,255,255,0.18)"
                              : C.ruleSoft
                          }`,
                          cursor: "pointer",
                          transition:
                            "background 180ms ease-out, border-color 180ms ease-out",
                        }}
                        aria-label={`Open ${pillar.title}`}
                      >
                        <span
                          aria-hidden
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            background: isActive ? C.amber : C.paper,
                            opacity: isActive ? 1 : 0.6,
                            boxShadow: isActive
                              ? `0 0 6px ${C.amberHalo}`
                              : "none",
                          }}
                        />
                        <span
                          className="font-sans truncate"
                          style={{
                            fontSize: 10,
                            fontWeight: 500,
                            color: isActive ? C.amber : C.paperDim,
                            letterSpacing: "-0.005em",
                            maxWidth: 110,
                          }}
                        >
                          {pillar.tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   PILLAR HOVER STRIP — discrete chip row that lets the user point at
   any pillar to surface it in the hovered state without leaving the
   star area. Doubles as a visible "all five at a glance" footer.
   ════════════════════════════════════════════════════════════════════════ */
function PillarHoverStrip({
  active,
  hovered,
  onHover,
  onSelect,
}: {
  active: PillarKey | null
  hovered: PillarKey | null
  onHover: (key: PillarKey | null) => void
  onSelect: (key: PillarKey) => void
}) {
  return (
    <div
      className="relative mt-4 flex items-center justify-center gap-1.5 flex-wrap"
      onMouseLeave={() => onHover(null)}
      aria-label="Pillar quick navigator"
    >
      {PILLARS.map((p) => {
        const isActive = active === p.key
        const isHovered = hovered === p.key
        return (
          <button
            key={p.key}
            type="button"
            onMouseEnter={() => onHover(p.key)}
            onFocus={() => onHover(p.key)}
            onClick={() => onSelect(p.key)}
            className="group flex items-center gap-1.5"
            style={{
              height: 26,
              padding: "0 12px",
              borderRadius: 999,
              background: isActive
                ? "rgba(245,158,11,0.10)"
                : "rgba(255,255,255,0.025)",
              border: `1px solid ${
                isActive
                  ? "rgba(245,158,11,0.55)"
                  : isHovered
                  ? "rgba(255,255,255,0.20)"
                  : C.ruleSoft
              }`,
              color: isActive ? C.amber : C.paperDim,
              cursor: "pointer",
              transition: "all 200ms ease-out",
            }}
            aria-label={`Open ${p.title}`}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8.5,
                color: isActive ? C.amber : C.ashGhost,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              {String(p.vertex + 1).padStart(2, "0")}
            </span>
            <span
              className="font-sans truncate"
              style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: "-0.005em" }}
            >
              {p.tag}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   DESIGN-LANGUAGE BAND — typography rules used in the surface
   ════════════════════════════════════════════════════════════════════════ */
function LanguageBand() {
  return (
    <section
      className="relative mt-6 px-5 py-4"
      style={{
        background: C.glass,
        border: `1px solid ${C.rule}`,
        borderRadius: 18,
        backdropFilter: "blur(22px) saturate(150%)",
        WebkitBackdropFilter: "blur(22px) saturate(150%)",
      }}
      aria-label="Design language band"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-mono uppercase"
          style={{
            color: C.ashGhost,
            fontSize: 9.5,
            letterSpacing: "0.28em",
            fontWeight: 500,
          }}
        >
          DESIGN LANGUAGE · MANDATORY RULES
        </span>
        <span
          className="font-mono uppercase"
          style={{
            color: C.amber,
            fontSize: 9.5,
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          MATCHES LIVE EQUITY VOLUME
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {LANGUAGE_RULES.map((r) => (
          <div
            key={r.eyebrow}
            className="flex flex-col gap-1 px-3 py-2.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px dashed ${C.ruleSoft}`,
            }}
          >
            <span
              className="font-mono uppercase"
              style={{
                color: C.ashGhost,
                fontSize: 8.5,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              {r.eyebrow}
            </span>
            <span
              className="font-sans tabular-nums"
              style={{
                color: C.paper,
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              {r.sample}
            </span>
            <span
              className="font-mono"
              style={{
                color: C.ashSoft,
                fontSize: 9.5,
                letterSpacing: "0.04em",
                fontWeight: 400,
              }}
            >
              {r.sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   STATUS BAR — live HUD between the detail and out-of-scope sections
   ════════════════════════════════════════════════════════════════════════ */
function StatusBar({
  activePillar,
  hoveredPillar,
  mode,
  blueprint,
  tourRunning,
  telemetryCount,
  telemetryOpen,
  onToggleTelemetry,
}: {
  activePillar: Pillar | null
  hoveredPillar: Pillar | null
  mode: StarMode
  blueprint: boolean
  tourRunning: boolean
  telemetryCount: number
  telemetryOpen: boolean
  onToggleTelemetry: () => void
}) {
  return (
    <div
      className="mt-10 flex items-center gap-3 min-w-0 px-3 py-2.5"
      style={{
        height: 44,
        borderRadius: 10,
        background: C.glass,
        border: `1px solid ${C.rule}`,
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <motion.span
          aria-hidden
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: tourRunning ? C.emerald : C.amber,
            boxShadow: `0 0 6px ${tourRunning ? C.emerald : C.amber}`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            color: C.ashGhost,
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          {tourRunning ? "AUTO-TOUR" : "LIVE"}
        </span>
      </div>

      <span aria-hidden className="block w-px h-4" style={{ background: C.ruleSoft }} />

      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className="font-mono uppercase shrink-0"
          style={{
            fontSize: 9,
            color: C.ashGhost,
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          ACTIVE
        </span>
        <span
          className="font-sans truncate"
          style={{
            fontSize: 11,
            color: activePillar ? C.amber : C.ashGhost,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {activePillar ? activePillar.title : "—"}
        </span>
      </div>

      <span aria-hidden className="block w-px h-4" style={{ background: C.ruleSoft }} />

      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className="font-mono uppercase shrink-0"
          style={{
            fontSize: 9,
            color: C.ashGhost,
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          HOVER
        </span>
        <span
          className="font-sans truncate"
          style={{
            fontSize: 11,
            color: hoveredPillar ? C.paper : C.ashGhost,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {hoveredPillar ? hoveredPillar.tag : "—"}
        </span>
      </div>

      <span className="ml-auto" />

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1">
          <span
            className="font-mono uppercase"
            style={{ fontSize: 9, color: C.ashGhost, letterSpacing: "0.22em" }}
          >
            MODE
          </span>
          <span className="font-mono" style={{ fontSize: 11, color: C.paper }}>
            {mode}
          </span>
        </div>
        {blueprint && (
          <div className="flex items-center gap-1">
            <Ruler size={10} strokeWidth={1.7} style={{ color: C.cyan }} aria-hidden />
            <span style={{ fontSize: 10.5, color: C.cyan }}>blueprint</span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleTelemetry}
          className="flex items-center gap-1.5"
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            background: telemetryOpen
              ? "rgba(34,211,238,0.10)"
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${
              telemetryOpen ? "rgba(34,211,238,0.45)" : C.ruleSoft
            }`,
            color: telemetryOpen ? C.cyan : C.ashSoft,
            cursor: "pointer",
            transition: "all 200ms ease-out",
          }}
          aria-expanded={telemetryOpen}
        >
          <Activity size={10} strokeWidth={1.7} aria-hidden />
          <span style={{ fontSize: 10.5, fontWeight: 500 }}>Telemetry</span>
          <span
            className="font-mono"
            style={{
              fontSize: 9.5,
              color: C.ashGhost,
              padding: "1px 5px",
              borderRadius: 4,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {telemetryCount}
          </span>
          {telemetryOpen ? (
            <ChevronDown size={10} strokeWidth={1.7} />
          ) : (
            <ChevronUp size={10} strokeWidth={1.7} />
          )}
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   TELEMETRY DOCK — fixed-position collapsible at the bottom
   ════════════════════════════════════════════════════════════════════════ */
function TelemetryDock({
  runtimeEvents,
  onClear,
  onClose,
}: {
  runtimeEvents: RuntimeEvent[]
  onClear: () => void
  onClose: () => void
}) {
  /* Compose seeded log + runtime — runtime first (newest user actions
     on top), then the seeded narrative below. */
  const seededRows = useMemo(
    () =>
      [...TELEMETRY_LOG].reverse().map((r, i) => ({
        kind: "seed" as const,
        id: -1 - i,
        ts: r.t,
        pillar: r.pillar,
        msg: r.msg,
      })),
    [],
  )
  const runtimeRows = useMemo(
    () =>
      [...runtimeEvents].reverse().map((evt) => ({
        kind: "runtime" as const,
        id: evt.id,
        ts: fmtRelative(evt.ts),
        pillar: evt.pillarKey,
        msg: verbalize(evt),
      })),
    [runtimeEvents],
  )

  return (
    <div className="mx-auto w-full" style={{ maxWidth: 1180, padding: "0 24px 16px" }}>
      <div
        className="relative"
        style={{
          borderRadius: 14,
          background:
            "linear-gradient(180deg, rgba(20,20,24,0.92) 0%, rgba(14,14,18,0.96) 100%)",
          border: `1px solid ${C.rule}`,
          boxShadow: "0 -12px 40px rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
          overflow: "hidden",
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderBottom: `1px solid ${C.ruleSoft}` }}
        >
          <Terminal size={12} strokeWidth={1.7} style={{ color: C.cyan }} aria-hidden />
          <span
            className="font-mono uppercase"
            style={{
              color: C.ashGhost,
              fontSize: 9.5,
              letterSpacing: "0.28em",
              fontWeight: 500,
            }}
          >
            TELEMETRY · AUDIT TRAIL
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: C.ashGhost,
              padding: "2px 7px",
              borderRadius: 4,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.ruleSoft}`,
            }}
          >
            {runtimeEvents.length} runtime · {TELEMETRY_LOG.length} seed
          </span>
          <span className="ml-auto" />
          <button
            type="button"
            onClick={onClear}
            className="font-sans"
            style={{
              fontSize: 10.5,
              color: C.ashSoft,
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.ruleSoft}`,
              cursor: "pointer",
            }}
          >
            Clear runtime
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.ruleSoft}`,
              color: C.ashSoft,
              cursor: "pointer",
            }}
            aria-label="Close telemetry"
          >
            <X size={13} strokeWidth={1.7} />
          </button>
        </div>

        <div
          className="overflow-y-auto"
          style={{
            maxHeight: 280,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.012) 0%, transparent 30%)",
          }}
        >
          {/* Runtime rows first, then a divider, then the seeded story. */}
          <ul className="divide-y" style={{ borderColor: C.ruleSoft }}>
            {runtimeRows.map((row) => (
              <TelemetryRow
                key={row.id}
                ts={row.ts}
                pillarKey={row.pillar ?? undefined}
                msg={row.msg}
                kind="runtime"
              />
            ))}
            {runtimeRows.length > 0 && (
              <li
                className="px-4 py-1.5 font-mono uppercase"
                style={{
                  fontSize: 8.5,
                  letterSpacing: "0.28em",
                  color: C.ashGhost,
                  background: "rgba(255,255,255,0.015)",
                  borderTop: `1px dashed ${C.ruleSoft}`,
                }}
              >
                ─── SEED LOG ───
              </li>
            )}
            {seededRows.map((row) => (
              <TelemetryRow
                key={row.id}
                ts={row.ts}
                pillarKey={row.pillar}
                msg={row.msg}
                kind="seed"
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function TelemetryRow({
  ts,
  pillarKey,
  msg,
  kind,
}: {
  ts: string
  pillarKey?: PillarKey
  msg: string
  kind: "runtime" | "seed"
}) {
  const pillar = pillarKey ? PILLARS.find((p) => p.key === pillarKey) : null
  return (
    <li
      className="flex items-center gap-3 px-4 py-2 font-mono"
      style={{
        fontSize: 10.5,
        color: C.paper,
        borderTop: `1px solid ${C.ruleSoft}`,
      }}
    >
      <span style={{ color: C.ashGhost, width: 60 }}>{ts}</span>
      <Cpu
        size={10}
        strokeWidth={1.7}
        style={{ color: kind === "runtime" ? C.cyan : C.amber, opacity: 0.7 }}
        aria-hidden
      />
      {pillar ? (
        <>
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: kind === "runtime" ? C.cyan : C.amber,
              boxShadow: `0 0 4px ${kind === "runtime" ? C.cyan : C.amber}`,
            }}
          />
          <span
            style={{
              color: kind === "runtime" ? C.cyan : C.amber,
              fontWeight: 500,
              minWidth: 110,
            }}
          >
            {pillar.tag}
          </span>
        </>
      ) : (
        <span style={{ color: C.ashSoft, minWidth: 110 }}>system</span>
      )}
      <span style={{ color: C.ashSoft }}>·</span>
      <span style={{ color: C.paper }}>{msg}</span>
    </li>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   SHORTCUTS OVERLAY — full-screen modal listing every key
   ════════════════════════════════════════════════════════════════════════ */
function ShortcutsOverlay({ onClose }: { onClose: () => void }) {
  const shortcuts: { keys: string[]; label: string; group: string }[] = [
    { keys: ["1"], label: "Open Goal pillar", group: "Navigation" },
    { keys: ["2"], label: "Open Distribution pillar", group: "Navigation" },
    { keys: ["3"], label: "Open Instruments pillar", group: "Navigation" },
    { keys: ["4"], label: "Open Calibration pillar", group: "Navigation" },
    { keys: ["5"], label: "Open Execution pillar", group: "Navigation" },
    { keys: ["←", "→"], label: "Cycle pillars", group: "Navigation" },
    { keys: ["Esc"], label: "Close panel / overlay", group: "Navigation" },
    { keys: ["T"], label: "Toggle auto-tour", group: "Canvas" },
    { keys: ["B"], label: "Toggle blueprint mode", group: "Canvas" },
    { keys: ["M"], label: "Cycle mode (Constellation → Ledger → Topology)", group: "Canvas" },
    { keys: ["R"], label: "Reset canvas", group: "Canvas" },
    { keys: ["?"], label: "Toggle this overlay", group: "Help" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-6"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 6 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full"
        style={{
          maxWidth: 540,
          borderRadius: 14,
          background:
            "linear-gradient(180deg, rgba(28,28,32,0.96) 0%, rgba(18,18,22,0.96) 100%)",
          border: `1px solid ${C.rule}`,
          padding: 24,
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Command size={13} strokeWidth={1.6} style={{ color: C.amber }} aria-hidden />
          <span
            className="font-mono uppercase"
            style={{
              color: C.ashGhost,
              fontSize: 9.5,
              letterSpacing: "0.28em",
              fontWeight: 500,
            }}
          >
            KEYBOARD SHORTCUTS
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${C.ruleSoft}`,
              color: C.ashSoft,
              cursor: "pointer",
            }}
            aria-label="Close shortcuts"
          >
            <X size={13} strokeWidth={1.7} />
          </button>
        </div>
        <h2
          className="font-sans"
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: C.paper,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Drive the constellation by keyboard
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-1.5">
          {shortcuts.map((s, idx) => {
            const showGroup = idx === 0 || shortcuts[idx - 1].group !== s.group
            return (
              <div key={`${s.label}-${idx}`}>
                {showGroup && (
                  <div
                    className="font-mono uppercase mt-3 mb-1"
                    style={{
                      fontSize: 9,
                      fontWeight: 500,
                      color: C.ashGhost,
                      letterSpacing: "0.22em",
                    }}
                  >
                    {s.group}
                  </div>
                )}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex items-center gap-1 shrink-0">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="font-mono"
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: C.paper,
                          padding: "2px 7px",
                          borderRadius: 5,
                          background: "rgba(255,255,255,0.06)",
                          border: `1px solid ${C.rule}`,
                          minWidth: 22,
                          textAlign: "center",
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 12,
                      color: C.paperDim,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   OUT-OF-SCOPE STRIP — guardrails the user shouldn't touch
   ════════════════════════════════════════════════════════════════════════ */
function OutOfScopeStrip() {
  return (
    <section className="mt-12" aria-label="Out of scope guardrails">
      <div className="flex items-center gap-2 mb-3">
        <span
          aria-hidden
          className="inline-block rounded-full"
          style={{
            width: 8,
            height: 8,
            border: `1px solid ${C.amber}`,
            background: "transparent",
            boxShadow: `0 0 6px ${C.amberHalo}`,
          }}
        />
        <span
          aria-hidden
          className="inline-block"
          style={{ width: 28, height: 1, background: C.ruleStrong }}
        />
        <span
          className="font-mono uppercase"
          style={{
            color: C.ashGhost,
            fontSize: 10,
            letterSpacing: "0.28em",
            fontWeight: 500,
          }}
        >
          OUT OF SCOPE · DO NOT TOUCH
        </span>
        <span
          aria-hidden
          className="inline-block flex-1"
          style={{ height: 1, background: C.ruleSoft }}
        />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-0">
        {OUT_OF_SCOPE.map((row, i) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 py-2.5"
            style={{
              borderTop: i < 3 ? "none" : `1px dashed ${C.ruleSoft}`,
            }}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span
                aria-hidden
                className="inline-block rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  background: C.ash,
                  boxShadow: `0 0 4px ${C.ash}`,
                }}
              />
              <span
                className="font-sans truncate"
                style={{
                  color: C.paper,
                  fontSize: 12.5,
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                }}
              >
                {row.label}
              </span>
            </span>
            <span
              className="font-mono uppercase shrink-0"
              style={{
                color: C.ashGhost,
                fontSize: 9,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              {row.reason}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════════ */
function fmtRelative(ts: number) {
  const delta = Math.max(0, Date.now() - ts)
  if (delta < 1000) return "just now"
  if (delta < 60_000) return `${Math.floor(delta / 1000)}s ago`
  return `${Math.floor(delta / 60_000)}m ago`
}

function verbalize(evt: RuntimeEvent) {
  switch (evt.kind) {
    case "open":
      return "pillar opened"
    case "close":
      return "pillar closed"
    case "tour-start":
      return "auto-tour started"
    case "tour-stop":
      return "auto-tour paused"
    case "mode-change":
      return `mode → ${evt.payload}`
    case "blueprint":
      return `blueprint ${evt.payload}`
    case "reset":
      return "canvas reset"
    case "tab-change":
      return `tab → ${evt.payload}`
    default:
      return ""
  }
}
