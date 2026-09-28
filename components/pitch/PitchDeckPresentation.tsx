"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, ChevronRight, Brain, TrendingUp, Users, Globe,
  Shield, Target, Layers, CheckCircle2, Clock,
  ArrowRight, Activity, Eye,
  Cpu, Network, GraduationCap, Presentation,
  Newspaper, ChevronDown, Palette,
} from "lucide-react"
import { BrokenWorkflowSystemSlide } from "./BrokenWorkflowSystemSlide"
import { MarketOpportunitySlide } from "./MarketOpportunitySlide"
import { SolutionArchitectureSlide } from "./SolutionArchitectureSlide"
import { ArchioCoverExperience } from "./ArchioCoverExperience"
import { PlatformArchitectureSlide } from "./PlatformArchitectureSlide"
import { BuiltSlide } from "./BuiltSlide"
import { PartialSlide } from "./PartialSlide"
import { RoadmapSlide } from "./RoadmapSlide"
import { AskSlide } from "./AskSlide"
import {
  ALL_THEMES,
  getTheme,
  type ThemeId,
  type VantaryTheme,
} from "@/components/dashboard/vantary/theme-system"

/* ═══════════════════════════════════════════════════════════════════════
   PITCH × DASHBOARD THEME BRIDGE
   ═══════════════════════════════════════════════════════════════════════
   The pitch deck now consumes the exact same 7-theme palette system that
   powers /dashboard (theme-system.ts: TEAL_GLASS, CYBER_NEON, NEURAL_DARK,
   QUANTUM_GREEN, SOLAR_FUSION, NEURAL_LIGHT, OBSIDIAN_GLASS).

   Instead of each slide hardcoding a hex like "#10b981", every slide now
   declares an `accentRole` — a key into the active theme. When the user
   swaps themes via the in-shell ThemeSwitcher, all 13 slides recolor in
   lockstep while keeping their RELATIVE visual rhythm:

      Cover         → primary       (the hero color, the brand chord)
      Problem       → warnEdge      (danger / pain)
      Market        → tertiary      (purple-ish — story of opportunity)
      Solution      → primary       (introduces the hero again)
      Architecture  → secondary     (cool, structural, blueprinty)
      Product 1     → primary       (Neural Matrix — the centerpiece)
      Product 2     → tertiary      (AI Forecast — purple intelligence)
      Product 3     → chartUp       (Community — positive, social green)
      Product 4     → secondary     (Nexus — networked, blue)
      Built         → primary       (the wins)
      Partial       → warnEdge      (the gaps)
      Roadmap       → secondary     (the path forward)
      Ask           → primary       (the close)

   The result: switching from TEAL → CYBER → SOLAR doesn't just tint the
   background; every section breathes a totally different palette while
   preserving the editorial pacing of the deck.
   ═══════════════════════════════════════════════════════════════════════ */

type AccentRole = "primary" | "secondary" | "tertiary" | "chartUp" | "warnEdge" | "primaryDeep"

interface Slide {
  id: number
  title: string
  label: string
  accentRole: AccentRole
}

const SLIDES: Slide[] = [
  { id: 1,  title: "Cover",                       label: "Archio AI",     accentRole: "primary" },
  { id: 2,  title: "The Broken Workflow System",  label: "Problem",       accentRole: "warnEdge" },
  { id: 3,  title: "The Business Problem",        label: "Market",        accentRole: "tertiary" },
  { id: 4,  title: "Introducing Archio AI",       label: "Solution",      accentRole: "primary" },
  { id: 5,  title: "Platform Architecture",       label: "Architecture",  accentRole: "secondary" },
  { id: 6,  title: "Neural Matrix + Copilot",     label: "Product 1",     accentRole: "primary" },
  { id: 7,  title: "AI Forecast + Intelligence",  label: "Product 2",     accentRole: "tertiary" },
  { id: 8,  title: "Community + Education",       label: "Product 3",     accentRole: "chartUp" },
  { id: 9,  title: "Nexus + Copilot AI",          label: "Product 4",     accentRole: "secondary" },
  { id: 10, title: "What Is Built Today",         label: "Built",         accentRole: "primary" },
  { id: 11, title: "What Is Partial",             label: "Partial",       accentRole: "warnEdge" },
  { id: 12, title: "Roadmap",                     label: "Roadmap",       accentRole: "secondary" },
  { id: 13, title: "The Ask",                     label: "Ask",           accentRole: "primary" },
]

/* ── Theme order in the switcher rail (left → right) ─────────────────── */
const THEME_ORDER: ThemeId[] = ["teal", "cyber", "neural", "quantum", "solar", "light", "obsidian"]

const THEME_PERSIST_KEY = "archio.pitch.theme"

/* Tiny helper to read an opaque-ish hex from a theme accent role and
   return a stable rgba wash. We need this because some theme tokens are
   already rgba (like warnEdge), some are hex; the shell layer wants
   normalized alpha treatment. */
function resolveAccent(theme: VantaryTheme, role: AccentRole): string {
  // primary/secondary/tertiary/primaryDeep are always hex.
  // chartUp is hex. warnEdge is rgba — but the slides treat the accent
  // as a base color and add their own alpha math (e.g. `${accent}15`),
  // which only works on hex. So for warnEdge we extract a hex-ish base.
  const raw = theme[role]
  if (raw.startsWith("#")) return raw
  // warnEdge fallback: derive a danger hex from the theme's offlineDot
  return theme.offlineDot
}

/* ═══════════════════════════════════════════════════════════════════════
   PRESENTATION SHELL
   ═══════════════════════════════════════════════════════════════════════ */

export function PitchDeckPresentation() {
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [themeId, setThemeId] = useState<ThemeId>("teal")

  /* Hydrate persisted theme once on mount. SSR-safe because useEffect
     only runs on the client. */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_PERSIST_KEY)
      if (stored && (THEME_ORDER as string[]).includes(stored)) {
        setThemeId(stored as ThemeId)
      }
    } catch { /* localStorage disabled — silently keep default */ }
  }, [])

  /* Persist when changed. */
  useEffect(() => {
    try { window.localStorage.setItem(THEME_PERSIST_KEY, themeId) } catch {}
  }, [themeId])

  const theme = useMemo(() => getTheme(themeId), [themeId])

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1)), [])
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next() }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev() }
      if (e.key === "Escape") setIsFullscreen(false)
      if (e.key === "f" || e.key === "F") setIsFullscreen((v) => !v)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [next, prev])

  const slide = SLIDES[current]
  const accent = resolveAccent(theme, slide.accentRole)

  /* Whether the active theme is the light one — used to flip a couple of
     opacity values (the "rgba(255,255,255,0.02)" surfaces look invisible
     on white backgrounds, so we use rgba(0,0,0,0.03) instead). */
  const isLight = themeId === "light"
  const surfaceWash = isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.02)"
  const surfaceEdge = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)"
  const surfaceEdgeStrong = isLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.08)"
  const dimText = isLight ? "rgba(0,0,0,0.45)" : "rgba(148,163,184,0.4)"

  return (
    <motion.div
      className={`${isFullscreen ? "fixed inset-0 z-[9999]" : "min-h-screen"} flex flex-col relative overflow-hidden`}
      style={{ background: theme.ink }}
      animate={{ background: theme.ink }}
      transition={{ duration: 0.45 }}
    >
      {/* ── AMBIENT THEME BACKDROP ────────────────────────────────────
          Three slow-orbiting radial gradient blobs colored from the
          active theme's particleColors. Pointer-events: none so they
          never interfere with interaction. Hidden in fullscreen-print
          ish scenarios via mix-blend-mode preserving the slide canvas. */}
      <AmbientBackdrop theme={theme} />

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-3"
        style={{ background: surfaceWash, borderBottom: `1px solid ${surfaceEdge}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: theme.primaryWash, border: `1px solid ${theme.primaryHalo}` }}
          >
            <Presentation className="w-4 h-4" style={{ color: theme.primary }} />
          </div>
          <div>
            <span className="text-sm font-bold tracking-wide" style={{ color: theme.paper }}>ARCHIO AI</span>
            <span className="text-xs ml-2" style={{ color: theme.ashSoft }}>Investor Deck</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* ── Theme switcher ────────────────────────────────── */}
          <ThemeSwitcher
            activeId={themeId}
            onPick={setThemeId}
            isLight={isLight}
            surfaceWash={surfaceWash}
            surfaceEdge={surfaceEdge}
            paper={theme.paper}
            ashSoft={theme.ashSoft}
          />

          <span className="text-xs font-mono" style={{ color: theme.ashSoft }}>{current + 1} / {SLIDES.length}</span>
          <button
            onClick={() => setIsFullscreen((v) => !v)}
            className="text-xs px-3 py-1.5 rounded-md transition-colors"
            style={{
              background: surfaceWash,
              border: `1px solid ${surfaceEdgeStrong}`,
              color: theme.ashSoft,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.paper)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.ashSoft)}
          >
            {isFullscreen ? "Exit" : "Fullscreen"} (F)
          </button>
        </div>
      </div>

      {/* Slide navigation thumbnails */}
      <div
        className="relative z-10 flex items-center gap-1 px-6 py-2 overflow-x-auto"
        style={{ background: isLight ? "rgba(0,0,0,0.015)" : "rgba(255,255,255,0.01)", borderBottom: `1px solid ${surfaceEdge}` }}
      >
        {SLIDES.map((s, i) => {
          const a = resolveAccent(theme, s.accentRole)
          const active = i === current
          return (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className="flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider transition-all"
              style={{
                background: active ? `${a}15` : "transparent",
                color: active ? a : dimText,
                border: active ? `1px solid ${a}30` : "1px solid transparent",
              }}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Main slide area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-6">
        {/* Prev/Next buttons */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-10"
          style={{ background: surfaceWash, border: `1px solid ${surfaceEdgeStrong}` }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: theme.ashSoft }} />
        </button>
        <button
          onClick={next}
          disabled={current === SLIDES.length - 1}
          className="absolute right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-10"
          style={{ background: surfaceWash, border: `1px solid ${surfaceEdgeStrong}` }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" style={{ color: theme.ashSoft }} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${themeId}-${slide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-5xl"
          >
            <SlideRenderer slideIndex={current} accent={accent} theme={theme} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-1 w-full" style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)" }}>
        <motion.div
          className="h-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}80` }}
          animate={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   THEME SWITCHER
   ═══════════════════════════════════════════════════════════════════════
   Seven round swatches, one per dashboard theme. Each swatch is a 22×22
   button. The active swatch is wrapped in a 2px outline ring using the
   theme's own primary color and lifts ~2px on hover. A tooltip appears
   above on hover showing the theme name.

   Why this lives inline in this file rather than a shared component:
   the dashboard already has its own theme switcher chrome in
   your-space.tsx; the pitch deck wants a more minimal, presentation-
   appropriate rail. Keeping them separate avoids coupling.
   ═══════════════════════════════════════════════════════════════════════ */

function ThemeSwitcher({
  activeId,
  onPick,
  isLight,
  surfaceWash,
  surfaceEdge,
  paper,
  ashSoft,
}: {
  activeId: ThemeId
  onPick: (id: ThemeId) => void
  isLight: boolean
  surfaceWash: string
  surfaceEdge: string
  paper: string
  ashSoft: string
}) {
  const [hovered, setHovered] = useState<ThemeId | null>(null)

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
      style={{ background: surfaceWash, border: `1px solid ${surfaceEdge}` }}
    >
      <Palette className="w-3 h-3 mr-0.5" style={{ color: ashSoft }} aria-hidden="true" />
      {THEME_ORDER.map((id) => {
        const t = ALL_THEMES[id]
        const isActive = id === activeId
        const isHovered = hovered === id
        return (
          <div key={id} className="relative">
            <motion.button
              onClick={() => onPick(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ y: -1, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="relative rounded-full overflow-hidden"
              style={{
                width: 18,
                height: 18,
                background: t.primary,
                boxShadow: isActive
                  ? `0 0 0 2px ${isLight ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)"}, 0 0 0 3.5px ${t.primary}, 0 0 14px ${t.primary}80`
                  : `0 0 0 1px ${isLight ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.12)"}`,
              }}
              aria-label={`Switch to ${t.name} theme`}
              aria-pressed={isActive}
            >
              {/* Dual-tone diagonal: top-left = primary, bottom-right = secondary.
                  This previews the theme's chord, not just one swatch. */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primary} 48%, ${t.secondary} 52%, ${t.secondary} 100%)`,
                }}
              />
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-50"
                  style={{
                    background: isLight ? "rgba(20,20,30,0.92)" : "rgba(0,0,0,0.88)",
                    border: `1px solid ${t.primary}40`,
                    boxShadow: `0 4px 18px rgba(0,0,0,0.5), 0 0 14px ${t.primary}30`,
                  }}
                >
                  <div className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: t.primary }}>
                    {t.name}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   AMBIENT BACKDROP
   ═══════════════════════════════════════════════════════════════════════
   Three slow-orbiting radial gradient blobs colored from the theme's
   particleColors. Sits behind everything (z-0) with pointer-events:none.
   Theme transitions are interpolated by Framer because we wrap the
   blob colors in animated style. */

function AmbientBackdrop({ theme }: { theme: VantaryTheme }) {
  const colors = theme.particleColors.length >= 3
    ? theme.particleColors
    : [theme.primary, theme.secondary, theme.tertiary]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute rounded-full"
        style={{ width: 720, height: 720, left: "-12%", top: "-18%" }}
        animate={{
          background: `radial-gradient(circle, ${colors[0]}18, transparent 65%)`,
          x: [0, 30, 0],
          y: [0, 24, 0],
        }}
        transition={{
          background: { duration: 0.6 },
          x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 18, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 620, height: 620, right: "-8%", top: "30%" }}
        animate={{
          background: `radial-gradient(circle, ${colors[1] ?? colors[0]}14, transparent 65%)`,
          x: [0, -22, 0],
          y: [0, -28, 0],
        }}
        transition={{
          background: { duration: 0.6 },
          x: { duration: 26, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 520, height: 520, left: "30%", bottom: "-15%" }}
        animate={{
          background: `radial-gradient(circle, ${colors[2] ?? colors[0]}10, transparent 65%)`,
          x: [0, 18, 0],
          y: [0, -16, 0],
        }}
        transition={{
          background: { duration: 0.6 },
          x: { duration: 24, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 19, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function SlideCard({ children, theme }: { children: React.ReactNode; theme: VantaryTheme }) {
  const isLight = theme.id === "light"
  return (
    <div
      className="rounded-2xl p-8 md:p-10"
      style={{
        background: isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)"}`,
        minHeight: 480,
      }}
    >
      {children}
    </div>
  )
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {children}
    </span>
  )
}

function StatBox({ label, value, accent, theme }: { label: string; value: string; accent: string; theme: VantaryTheme }) {
  const isLight = theme.id === "light"
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      <div className="text-2xl font-black font-mono mb-1" style={{ color: accent }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.ashSoft }}>{label}</div>
    </div>
  )
}

function KeyPoint({ children, icon: Icon, accent }: { children: React.ReactNode; icon?: React.ElementType; accent: string }) {
  return (
    <div
      className="flex gap-3 py-2.5 px-3 rounded-lg"
      style={{ background: `${accent}06`, borderLeft: `2px solid ${accent}50` }}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: `${accent}80` }} />}
      <div className="text-sm leading-relaxed" style={{ color: "rgba(228,228,231,0.85)" }}>{children}</div>
    </div>
  )
}

function SpeakerNote({ children, theme }: { children: React.ReactNode; theme: VantaryTheme }) {
  return (
    <div
      className="mt-6 rounded-lg px-4 py-3"
      style={{ background: theme.secondaryWash, border: `1px solid ${theme.secondary}25` }}
    >
      <div className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: `${theme.secondary}80` }}>
        Speaker Notes
      </div>
      <div className="text-xs leading-relaxed italic" style={{ color: `${theme.secondary}AA` }}>
        {children}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SLIDE RENDERER
   ═══════════════════════════════════════════════════════════ */

function SlideRenderer({ slideIndex, accent, theme }: { slideIndex: number; accent: string; theme: VantaryTheme }) {
  switch (slideIndex) {
      case 0:  return <ArchioCoverExperience accent={accent} theme={theme} />
      case 1:  return <BrokenWorkflowSystemSlide accent={accent} theme={theme} />
    case 2:  return <MarketOpportunitySlide accent={accent} />
    case 3:  return <SolutionArchitectureSlide accent={accent} />
    case 4:  return <PlatformArchitectureSlide accent={accent} />
    case 5:  return <Slide8NeuralCopilot accent={accent} theme={theme} />
    case 6:  return <Slide9ForecastIntel accent={accent} theme={theme} />
    case 7:  return <Slide10Community accent={accent} theme={theme} />
    case 8:  return <Slide11NexusAI accent={accent} theme={theme} />
    case 9:  return <BuiltSlide accent={accent} />
    case 10: return <PartialSlide accent={accent} />
    case 11: return <RoadmapSlide accent={accent} />
    case 12: return <AskSlide accent={accent} />
    default: return null
  }
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 6 — NEURAL MATRIX + COPILOT (theme-aware)
   ═══════════════════════════════════════════════════════════ */

function Slide8NeuralCopilot({ accent, theme }: { accent: string; theme: VantaryTheme }) {
  const [activePanel, setActivePanel] = useState<"matrix" | "copilot" | null>(null)
  const [flowStep, setFlowStep] = useState(0)
  const isLight = theme.id === "light"
  const cardEdge = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"
  const dimText = isLight ? "rgba(0,0,0,0.55)" : "rgb(161,161,170)"
  const subText = isLight ? "rgba(0,0,0,0.42)" : "rgb(113,113,122)"

  useEffect(() => {
    const t = setInterval(() => setFlowStep(p => (p + 1) % 3), 2500)
    return () => clearInterval(t)
  }, [])

  const flowLabels = ["Analyze", "Execute", "Journal"]
  const flowColors = [theme.tertiary, accent, theme.chartUp]

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: theme.ink2, border: `1px solid ${cardEdge}` }}>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ left: "20%", top: "30%", background: `radial-gradient(circle, ${accent}10, transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}90` }} />
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: `${accent}80` }}>Product 1</span>
          <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: theme.paper }}>Where analysis meets execution.</h2>
        <p className="text-sm mb-5 max-w-2xl" style={{ color: dimText }}>Two workspaces, one mission: eliminate the 3-app handoff that kills your edge. Click either panel to explore.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { key: "matrix" as const, icon: Activity, title: "Neural Matrix", sub: "The daily command center", desc: "Live TradingView chart with 50+ instruments, market state display (session/spread/volatility), and AI Copilot sidebar with 5 intelligent tabs.", replaces: "TradingView + news tabs + AI tools", features: ["Chart Widget", "Instrument Selector", "Market State Display", "Copilot 5-Tab Rail", "AI Overlay"] },
            { key: "copilot" as const, icon: Target, title: "Execution Copilot", sub: "From setup to logged trade", desc: "Split-screen workspace. Chart on left, execution panel on right. Signal terminal header with live price. Auto-journal and social feed below.", replaces: "MT5 + TradeZella + Discord feed", features: ["Signal Header", "Chart Panel", "Execute Toggle", "Auto-Journal", "Social Feed"] },
          ].map((p, i) => {
            const isActive = activePanel === p.key
            return (
              <motion.button
                key={p.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-4 text-left cursor-pointer transition-all duration-300"
                style={{
                  background: isActive ? `${accent}10` : isLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.02)",
                  border: isActive ? `1px solid ${accent}35` : `1px solid ${cardEdge}`,
                  boxShadow: isActive ? `0 0 25px ${accent}15` : "none",
                }}
                onClick={() => setActivePanel(isActive ? null : p.key)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <p.icon className="w-5 h-5" style={{ color: accent }} />
                  <span className="text-sm font-black" style={{ color: theme.paper }}>{p.title}</span>
                </div>
                <div className="text-[10px] mb-2" style={{ color: subText }}>{p.sub}</div>
                <div className="text-[11px] leading-relaxed mb-2" style={{ color: dimText }}>{p.desc}</div>
                <div className="text-[9px] font-bold mb-2" style={{ color: subText }}>Replaces: {p.replaces}</div>
                <AnimatePresence>
                  {isActive && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="flex flex-wrap gap-1 pt-2" style={{ borderTop: `1px solid ${accent}20` }}>
                        {p.features.map(f => (
                          <span key={f} className="text-[8px] px-2 py-0.5 rounded-md font-bold" style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}25` }}>{f}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        {/* Animated flow bar */}
        <div className="rounded-xl p-3 flex items-center justify-center gap-2" style={{ background: `${accent}06`, border: `1px solid ${accent}15` }}>
          {flowLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <motion.div
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300"
                style={{
                  background: flowStep === i ? `${flowColors[i]}18` : "transparent",
                  color: flowStep === i ? flowColors[i] : subText,
                  border: flowStep === i ? `1px solid ${flowColors[i]}40` : "1px solid transparent",
                }}
              >
                {label}
              </motion.div>
              {i < flowLabels.length - 1 && <ArrowRight className="w-3.5 h-3.5" style={{ color: flowStep > i ? `${flowColors[i]}70` : subText }} />}
            </div>
          ))}
          <span className="text-[10px] ml-3" style={{ color: subText }}>One workspace. Zero switching.</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 7 — AI FORECAST + INTELLIGENCE (theme-aware)
   ═══════════════════════════════════════════════════════════ */

function Slide9ForecastIntel({ accent, theme }: { accent: string; theme: VantaryTheme }) {
  const [activeIntelPanel, setActiveIntelPanel] = useState<string | null>(null)
  const isLight = theme.id === "light"
  const cardEdge = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"
  const dimText = isLight ? "rgba(0,0,0,0.55)" : "rgb(161,161,170)"
  const subText = isLight ? "rgba(0,0,0,0.42)" : "rgb(113,113,122)"

  // Pair the slide accent (tertiary by default) with the theme's chartUp
  // for the second column — gives a clear two-tone story.
  const peer = theme.chartUp

  const intelPanels = [
    { id: "sentiment",   label: "Market Sentiment",     icon: Activity,  desc: "Real-time aggregated sentiment from social media, news, and institutional flow. Gauges show bullish/bearish positioning across major pairs and indices." },
    { id: "fundamentals",label: "Fundamental Drivers",  icon: TrendingUp,desc: "GDP, employment, inflation, and interest rate differentials. Color-coded by impact level. Shows the fundamental backdrop behind every price move." },
    { id: "headlines",   label: "Live Headlines",       icon: Newspaper, desc: "AI-curated financial headlines from 50+ sources. Categorized by asset impact. Sentiment-tagged and urgency-ranked. No noise." },
    { id: "political",   label: "Political Risk",       icon: Shield,    desc: "Geopolitical events, trade policy shifts, sanctions, elections. Impact-scored against your open positions and watchlist." },
    { id: "centralbank", label: "Central Bank Events",  icon: Layers,    desc: "Rate decisions, forward guidance, QT/QE programs, speeches. Countdown timers. Historical reaction data. Consensus vs actual." },
    { id: "calendar",    label: "Economic Calendar",    icon: Clock,     desc: "High, medium, low impact events with forecast vs previous. Countdown to release. AI-generated preview of expected market reaction." },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: theme.ink2, border: `1px solid ${cardEdge}` }}>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ right: "-5%", top: "20%", background: `radial-gradient(circle, ${accent}10, transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>
      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}90` }} />
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: `${accent}80` }}>Product 2</span>
          <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: theme.paper }}>Bloomberg for the modern retail trader.</h2>
        <p className="text-sm mb-5 max-w-2xl" style={{ color: dimText }}>AI forecasting + 6-panel macro intelligence. The platform thinks and aggregates so you don&apos;t have to.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-4" style={{ background: `${accent}08`, border: `1px solid ${accent}18` }}>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5" style={{ color: accent }} />
              <span className="text-sm font-black" style={{ color: theme.paper }}>AI Forecast Engine</span>
            </div>
            <div className="text-[11px] leading-relaxed mb-3" style={{ color: dimText }}>Select any instrument. AI generates directional bias, confidence %, auto-identified key levels, and written reasoning. Not a black box - shows its work.</div>
            <div className="text-[9px] font-bold mb-2" style={{ color: theme.offlineDot }}>Replaces: Manual analysis + paid signals ($30-200/mo)</div>
            <div className="flex gap-1.5">
              {["Forecast UI", "AI Generation", "History Tracking"].map(f => (
                <span key={f} className="text-[8px] px-2 py-0.5 rounded-md font-bold" style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}25` }}>{f}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: `${peer}06`, border: `1px solid ${peer}15` }}>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5" style={{ color: peer }} />
              <span className="text-sm font-black" style={{ color: theme.paper }}>MRKT Intelligence</span>
            </div>
            <div className="text-[10px] mb-2" style={{ color: dimText }}>6-panel macro dashboard. Click any panel to explore:</div>
            <div className="grid grid-cols-2 gap-1">
              {intelPanels.map(p => {
                const PIcon = p.icon
                const isActive = activeIntelPanel === p.id
                return (
                  <button
                    key={p.id}
                    className="rounded-lg p-1.5 text-left flex items-center gap-1.5 cursor-pointer transition-all duration-200"
                    style={{
                      background: isActive ? `${peer}12` : isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.015)",
                      border: isActive ? `1px solid ${peer}30` : `1px solid ${cardEdge}`,
                    }}
                    onClick={() => setActiveIntelPanel(isActive ? null : p.id)}
                  >
                    <PIcon className="w-3 h-3 flex-shrink-0" style={{ color: isActive ? peer : subText }} />
                    <span className="text-[9px] font-bold" style={{ color: isActive ? peer : dimText }}>{p.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeIntelPanel && (() => {
            const panel = intelPanels.find(p => p.id === activeIntelPanel)!
            const PanelIcon = panel.icon
            return (
              <motion.div key={activeIntelPanel} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="rounded-xl p-4 mb-4 flex items-start gap-3" style={{ background: `${peer}06`, border: `1px solid ${peer}15` }}>
                  <PanelIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: peer }} />
                  <div>
                    <div className="text-xs font-black mb-1" style={{ color: theme.paper }}>{panel.label}</div>
                    <div className="text-[10px] leading-relaxed" style={{ color: dimText }}>{panel.desc}</div>
                  </div>
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 8 — COMMUNITY + EDUCATION (theme-aware)
   ═══════════════════════════════════════════════════════════ */

function Slide10Community({ accent, theme }: { accent: string; theme: VantaryTheme }) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const isLight = theme.id === "light"
  const cardEdge = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"
  const dimText = isLight ? "rgba(0,0,0,0.55)" : "rgb(161,161,170)"

  const products = [
    { id: "disc",    icon: Users,           title: "Community Discovery",     tagline: "\"Yelp + App Store\" for trading communities", desc: "Orbit-based marketplace with 15+ filters. Community cards show win rate, R:R, signals/wk, pairs traded. Full inspector modal with video carousel. Mentor profiles with verified track records.", expanded: ["Orbit Discovery Engine", "15+ Filter System", "Community Cards", "Inspector Modal", "Video Carousel", "Mentor Profiles"] },
    { id: "student", icon: GraduationCap,   title: "Student Hub",             tagline: "Structured, measurable learning", desc: "Students submit chart forecasts, get AI-scored on accuracy, compete on gamified leaderboard with badges and points. Filters by asset class, direction, and timeframe.", expanded: ["Forecast Submission", "AI Scoring Engine", "Gamified Leaderboard", "Badge System", "Asset Filters", "Progress Tracking"] },
    { id: "mentor",  icon: Eye,             title: "Mentor Forecast Engine",  tagline: "No more \"trust me bro\" signals", desc: "Professional forecast creation: chart upload, canvas annotations, key levels, macro driver tags, narrative editor. Every forecast tracked. Every outcome recorded. Full transparency.", expanded: ["Chart Upload", "Canvas Annotations", "Key Level Markers", "Macro Tags", "Narrative Editor", "Outcome Tracking"] },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: theme.ink2, border: `1px solid ${cardEdge}` }}>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ left: "-5%", top: "40%", background: `radial-gradient(circle, ${accent}10, transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>
      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}90` }} />
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: `${accent}80` }}>Product 3</span>
          <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: theme.paper }}>Mentors can&apos;t hide. Performance is transparent.</h2>
        <p className="text-sm mb-5 max-w-2xl" style={{ color: dimText }}>The trust layer. Every track record visible. Every signal tracked. Every community metric transparent. Click any product to explore.</p>

        <div className="flex flex-col gap-2">
          {products.map((p, i) => {
            const isExp = expandedProduct === p.id
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl p-4 text-left cursor-pointer transition-all duration-300"
                style={{
                  background: isExp ? `${accent}10` : `${accent}05`,
                  border: isExp ? `1px solid ${accent}30` : `1px solid ${accent}10`,
                }}
                onClick={() => setExpandedProduct(isExp ? null : p.id)}
              >
                <div className="flex items-center gap-3">
                  <p.icon className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
                  <div className="flex-1">
                    <div className="text-xs font-black" style={{ color: theme.paper }}>{p.title}</div>
                    <div className="text-[9px] italic" style={{ color: `${accent}AA` }}>{p.tagline}</div>
                  </div>
                  <ChevronDown
                    className="w-3 h-3 transition-transform duration-300"
                    style={{ color: `${accent}60`, transform: isExp ? "rotate(180deg)" : "" }}
                  />
                </div>
                <AnimatePresence>
                  {isExp && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${accent}20` }}>
                        <div className="text-[10px] leading-relaxed mb-2" style={{ color: dimText }}>{p.desc}</div>
                        <div className="flex flex-wrap gap-1">
                          {p.expanded.map(f => (
                            <span key={f} className="text-[8px] px-2 py-0.5 rounded-md font-bold" style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}20` }}>{f}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 9 — NEXUS + COPILOT AI (theme-aware)
   ═══════════════════════════════════════════════════════════ */

function Slide11NexusAI({ accent, theme }: { accent: string; theme: VantaryTheme }) {
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null)
  const isLight = theme.id === "light"
  const cardEdge = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"
  const dimText = isLight ? "rgba(0,0,0,0.55)" : "rgb(161,161,170)"
  const subText = isLight ? "rgba(0,0,0,0.42)" : "rgb(113,113,122)"

  // Map status colors through the theme so "done" and "partial" recolor
  // with the active palette.
  const doneColor = theme.chartUp
  const partialColor = theme.id === "solar" ? theme.tertiary : "#f59e0b"

  const subsystems = [
    { name: "Chat System",        status: "done",    desc: "AI-powered conversational interface" },
    { name: "Activity Console",   status: "done",    desc: "Trading activity tracking and analysis" },
    { name: "Strategy Console",   status: "done",    desc: "Strategy building and backtesting" },
    { name: "Psychology Console", status: "done",    desc: "5 emotional profiles, mood tracking" },
    { name: "AI Console",         status: "done",    desc: "Direct AI model interaction" },
    { name: "Edge Analytics",     status: "done",    desc: "Statistical edge identification" },
    { name: "Trade Execution",    status: "partial", desc: "Order routing (pending broker API)" },
    { name: "Coach Tools",        status: "done",    desc: "Mentor coaching interface" },
    { name: "Mentor Console",     status: "done",    desc: "Content and student management" },
    { name: "Onboarding",         status: "done",    desc: "Guided platform introduction" },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: theme.ink2, border: `1px solid ${cardEdge}` }}>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ left: "50%", top: "30%", transform: "translate(-50%,-50%)", background: `radial-gradient(circle, ${accent}10, transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}90` }} />
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: `${accent}80` }}>Product 4</span>
          <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: theme.paper }}>48 AI components. 14 sub-systems. Built.</h2>
        <p className="text-sm mb-5 max-w-2xl" style={{ color: dimText }}>Nexus Knowledge Graph + Copilot AI. This is the depth that separates a prototype from a product.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: Network, title: "Nexus Knowledge Graph", desc: "Interactive visual knowledge graph. Nodes = markets, concepts, strategies. Three layout modes: circular, force-directed, hierarchical. AI synthesizes connections." },
            { icon: Cpu,     title: "Copilot AI System",     desc: "5-tab right rail: Activity, Strategy, Psychology (5 profiles), AI, Edge. Each with console, analytics, guides. Mood tracking and emotional pattern recognition." },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-4"
              style={{ background: `${accent}08`, border: `1px solid ${accent}18` }}
            >
              <p.icon className="w-5 h-5 mb-2" style={{ color: accent }} />
              <div className="text-xs font-black mb-1.5" style={{ color: theme.paper }}>{p.title}</div>
              <div className="text-[10px] leading-relaxed" style={{ color: dimText }}>{p.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {subsystems.map((s) => {
            const c = s.status === "done" ? doneColor : partialColor
            return (
              <button
                key={s.name}
                className="rounded-lg py-1.5 px-1.5 text-center cursor-pointer transition-all duration-200 hover:scale-105"
                style={{ background: `${c}10`, border: `1px solid ${c}20` }}
                onClick={() => setExpandedSystem(expandedSystem === s.name ? null : s.name)}
              >
                <div className="text-[8px] font-bold" style={{ color: c }}>{s.name}</div>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {expandedSystem && (() => {
            const sys = subsystems.find(s => s.name === expandedSystem)!
            const c = sys.status === "done" ? doneColor : partialColor
            return (
              <motion.div key={expandedSystem} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="rounded-lg p-3 mb-3 flex items-center gap-3" style={{ background: `${c}10`, border: `1px solid ${c}20` }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: c }} />
                  <div>
                    <div className="text-xs font-bold" style={{ color: theme.paper }}>{sys.name}</div>
                    <div className="text-[10px]" style={{ color: dimText }}>{sys.desc}</div>
                  </div>
                  <div
                    className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${c}15`, color: c }}
                  >
                    {sys.status === "done" ? "Complete" : "In Progress"}
                  </div>
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-2">
          {[{ l: "AI Components", v: "48" }, { l: "Sub-Systems", v: "14" }, { l: "Psychology Profiles", v: "5" }].map(s => (
            <div key={s.l} className="rounded-lg p-2.5 text-center" style={{ background: `${accent}08`, border: `1px solid ${accent}18` }}>
              <div className="text-lg font-black font-mono" style={{ color: accent }}>{s.v}</div>
              <div className="text-[9px] font-bold" style={{ color: subText }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
