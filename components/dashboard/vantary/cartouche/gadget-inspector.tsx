"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · GADGET INSPECTOR
   ───────────────────────────────────────────────────────────────────────────
   The deep canvas. Compact gadget cards stay calm + glanceable; clicking one
   opens THIS — a portal-rendered overlay at the reserved `inspector` z-layer
   where the genuinely rich, instrument-grade detail lives.

   Responsibilities:
     · Portal + scrim          (renders above everything, dims the deck)
     · Shared-element open      (springs from the clicked card's rect)
     · Dismissal                (Esc · outside-click · back button · close btn)
     · Focus management         (focus trap + restore focus on close)
     · Reduced-motion fallback  (fade only, no transform)
     · Tabs                     (optional per-inspector tab strip)
     · Registry                 (INSPECTOR_REGISTRY[id] → body component)

   Gadgets do not know about the portal. They call `openInspector(id, rect)` via
   context; each gadget registers a body component keyed by its id.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { VT, rgba } from "@/components/vantary-glass"
import type { ThemeAccent } from "@/components/vantary-glass"
import { useThemeAccent } from "@/components/vantary-glass"
import { FLIGHT_DECK_Z } from "./gadget-slot"

/* ───────────────────────────────────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────────────────────────────────── */

export interface InspectorBodyProps {
  accent: ThemeAccent
  /** Active tab id, when the inspector declares tabs. */
  activeTab: string
  setActiveTab: (id: string) => void
  /** Helper to register the tab strip from inside the body. */
  registerTabs: (tabs: InspectorTab[]) => void
}

export interface InspectorTab {
  id: string
  label: string
}

/** A registered inspector: header metadata + body renderer. */
export interface InspectorDefinition {
  /** Eyebrow line, e.g. "FUNDED ACCOUNT · EVALUATION". */
  eyebrow?: string
  /** Big title, e.g. "Firm Identity". */
  title: string
  /** One-line subtitle under the title. */
  subtitle?: string
  /** The rich body. */
  Body: React.ComponentType<InspectorBodyProps>
}

type InspectorRegistry = Record<string, InspectorDefinition>

/* The registry is module-level so gadget files can register at import time. */
const INSPECTOR_REGISTRY: InspectorRegistry = {}

export function registerInspector(id: string, def: InspectorDefinition) {
  INSPECTOR_REGISTRY[id] = def
}
export function getInspector(id: string): InspectorDefinition | undefined {
  return INSPECTOR_REGISTRY[id]
}

/* ───────────────────────────────────────────────────────────────────────────
   Context — gadgets call openInspector(id, originRect)
   ─────────────────────────────────────────────────────────────────────────── */

interface InspectorController {
  openInspector: (id: string, originRect?: DOMRect | null) => void
  closeInspector: () => void
  openId: string | null
}

const InspectorContext = React.createContext<InspectorController | null>(null)

export function useInspector(): InspectorController {
  return (
    React.useContext(InspectorContext) ?? {
      openInspector: () => {},
      closeInspector: () => {},
      openId: null,
    }
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   Provider — owns open state + renders the overlay portal
   ─────────────────────────────────────────────────────────────────────────── */

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [origin, setOrigin] = React.useState<DOMRect | null>(null)
  const restoreFocusRef = React.useRef<HTMLElement | null>(null)

  const openInspector = React.useCallback((id: string, originRect?: DOMRect | null) => {
    if (!getInspector(id)) return
    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null
    setOrigin(originRect ?? null)
    setOpenId(id)
  }, [])

  const closeInspector = React.useCallback(() => {
    setOpenId(null)
    // Restore focus to the element that opened the inspector.
    window.requestAnimationFrame(() => {
      restoreFocusRef.current?.focus?.()
    })
  }, [])

  const ctx = React.useMemo<InspectorController>(
    () => ({ openInspector, closeInspector, openId }),
    [openInspector, closeInspector, openId],
  )

  return (
    <InspectorContext.Provider value={ctx}>
      {children}
      <InspectorOverlay openId={openId} origin={origin} onClose={closeInspector} />
    </InspectorContext.Provider>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   The overlay portal
   ─────────────────────────────────────────────────────────────────────────── */

function InspectorOverlay({
  openId, origin, onClose,
}: {
  openId: string | null
  origin: DOMRect | null
  onClose: () => void
}) {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const def = openId ? getInspector(openId) : undefined

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {openId && def ? (
        <InspectorPanel
          key={openId}
          id={openId}
          def={def}
          origin={origin}
          reduced={!!reduced}
          onClose={onClose}
        />
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   The panel itself — scrim + card + header + tabs + body
   ─────────────────────────────────────────────────────────────────────────── */

function InspectorPanel({
  id, def, origin, reduced, onClose,
}: {
  id: string
  def: InspectorDefinition
  origin: DOMRect | null
  reduced: boolean
  onClose: () => void
}) {
  const accents = useThemeAccent()
  const accent = accents.primary
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const [tabs, setTabs] = React.useState<InspectorTab[]>([])
  const [activeTab, setActiveTab] = React.useState<string>("")

  const registerTabs = React.useCallback((t: InspectorTab[]) => {
    setTabs(t)
    setActiveTab((prev) => (prev && t.some((x) => x.id === prev) ? prev : t[0]?.id ?? ""))
  }, [])

  /* Esc to close + browser back to close. */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose() }
    }
    document.addEventListener("keydown", onKey, true)
    // Push a history state so the hardware/browser back button closes it first.
    window.history.pushState({ inspector: id }, "")
    const onPop = () => onClose()
    window.addEventListener("popstate", onPop)
    return () => {
      document.removeEventListener("keydown", onKey, true)
      window.removeEventListener("popstate", onPop)
    }
  }, [id, onClose])

  /* Lock body scroll while open. */
  React.useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  /* Focus the panel on open (focus trap entry point). */
  React.useEffect(() => {
    const t = window.setTimeout(() => panelRef.current?.focus(), 60)
    return () => window.clearTimeout(t)
  }, [])

  /* Focus trap — keep Tab within the panel. */
  const onKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusables || focusables.length === 0) return
    const first = focusables[0]!
    const last = focusables[focusables.length - 1]!
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus()
    }
  }

  const Body = def.Body

  /* Compute a transform-origin from the clicked card so the panel feels like it
     grows out of the gadget (shared-element feel). */
  const transformOrigin = React.useMemo(() => {
    if (!origin || typeof window === "undefined") return "center center"
    const ox = origin.left + origin.width / 2
    const oy = origin.top + origin.height / 2
    return `${(ox / window.innerWidth) * 100}% ${(oy / window.innerHeight) * 100}%`
  }, [origin])

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: FLIGHT_DECK_Z.inspector,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(16px, 4vw, 48px)",
      }}
    >
      {/* Scrim */}
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.12 : 0.3 }}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(3,6,10,0.62)",
          backdropFilter: "blur(8px) saturate(120%)",
          WebkitBackdropFilter: "blur(8px) saturate(120%)",
        }}
      />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={def.title}
        tabIndex={-1}
        onKeyDown={onKeyDownTrap}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 16 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: reduced ? "tween" : "spring", duration: reduced ? 0.14 : undefined, stiffness: 320, damping: 30, mass: 0.85 }}
        style={{
          position: "relative",
          transformOrigin,
          width: "min(880px, 100%)",
          maxHeight: "min(86vh, 720px)",
          display: "flex", flexDirection: "column",
          borderRadius: VT.cardRadius,
          background:
            "linear-gradient(180deg, rgba(15,21,28,0.96) 0%, rgba(10,15,20,0.97) 100%)",
          border: `1px solid ${rgba(accent.rgb, 0.16)}`,
          boxShadow: `0 1px 0 ${rgba("255,255,255", 0.05)} inset, 0 30px 90px rgba(0,0,0,0.6), 0 0 0 1px ${rgba("255,255,255", 0.03)}, 0 0 80px ${rgba(accent.rgb, 0.1)}`,
          overflow: "hidden",
          outline: "none",
        }}
      >
        {/* Accent top rule */}
        <div
          aria-hidden
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
            opacity: 0.7,
          }}
        />

        {/* Header */}
        <InspectorHeader def={def} accent={accent} onClose={onClose} />

        {/* Tabs */}
        {tabs.length > 1 && (
          <InspectorTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} accent={accent} />
        )}

        {/* Body (scrollable) */}
        <div
          style={{
            flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden",
            padding: "20px 24px 24px",
          }}
          className="archio-inspector-scroll"
        >
          <Body
            accent={accent}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            registerTabs={registerTabs}
          />
        </div>
      </motion.div>

      <style>{`
        .archio-inspector-scroll::-webkit-scrollbar { width: 8px; }
        .archio-inspector-scroll::-webkit-scrollbar-track { background: transparent; }
        .archio-inspector-scroll::-webkit-scrollbar-thumb {
          background: ${rgba("255,255,255", 0.1)}; border-radius: 8px;
        }
        .archio-inspector-scroll::-webkit-scrollbar-thumb:hover {
          background: ${rgba("255,255,255", 0.18)};
        }
      `}</style>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   Header
   ─────────────────────────────────────────────────────────────────────────── */

function InspectorHeader({
  def, accent, onClose,
}: {
  def: InspectorDefinition
  accent: ThemeAccent
  onClose: () => void
}) {
  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: 16, padding: "20px 24px 14px",
        borderBottom: `1px solid ${VT.ruleSoft}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        {def.eyebrow && (
          <div
            className="font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: "0.24em", color: rgba(accent.rgb, 0.85), marginBottom: 7 }}
          >
            {def.eyebrow}
          </div>
        )}
        <div
          className="font-sans"
          style={{ fontSize: 24, fontWeight: 600, color: VT.paper, letterSpacing: "-0.02em", lineHeight: 1.1 }}
        >
          {def.title}
        </div>
        {def.subtitle && (
          <div className="font-sans" style={{ fontSize: 12.5, color: VT.paperDim, marginTop: 5, lineHeight: 1.45 }}>
            {def.subtitle}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close inspector"
        className="font-mono"
        style={{
          flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 10, letterSpacing: "0.12em", color: VT.ashSoft,
          padding: "6px 10px", borderRadius: 8, cursor: "pointer",
          background: rgba("255,255,255", 0.04),
          border: `1px solid ${VT.ruleSoft}`,
          transition: "all 160ms",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = VT.paper
          e.currentTarget.style.borderColor = rgba(accent.rgb, 0.4)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = VT.ashSoft
          e.currentTarget.style.borderColor = VT.ruleSoft
        }}
      >
        ESC
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   Tabs
   ─────────────────────────────────────────────────────────────────────────── */

function InspectorTabs({
  tabs, activeTab, setActiveTab, accent,
}: {
  tabs: InspectorTab[]
  activeTab: string
  setActiveTab: (id: string) => void
  accent: ThemeAccent
}) {
  return (
    <div
      role="tablist"
      style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "10px 24px 0", borderBottom: `1px solid ${VT.ruleSoft}`,
      }}
    >
      {tabs.map((t) => {
        const active = t.id === activeTab
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className="font-mono uppercase"
            style={{
              position: "relative",
              fontSize: 10.5, letterSpacing: "0.14em",
              color: active ? accent.hex : VT.ashSoft,
              padding: "8px 12px 12px", cursor: "pointer",
              background: "transparent", border: "none",
              transition: "color 160ms",
            }}
          >
            {t.label}
            {active && (
              <motion.span
                layoutId="inspector-tab-underline"
                style={{
                  position: "absolute", left: 8, right: 8, bottom: -1, height: 2,
                  borderRadius: 2, background: accent.hex,
                  boxShadow: `0 0 8px ${rgba(accent.rgb, 0.6)}`,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   Reusable inspector layout atoms (shared across all gadget bodies)
   ─────────────────────────────────────────────────────────────────────────── */

/** A bordered glass section with an optional title. */
export function InspectorSection({
  title, action, children, accent, pad = 16,
}: {
  title?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  accent?: ThemeAccent
  pad?: number
}) {
  return (
    <section
      style={{
        borderRadius: VT.cardRadiusTight,
        border: `1px solid ${VT.ruleSoft}`,
        background: "linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.006) 100%)",
        padding: pad,
      }}
    >
      {(title || action) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          {title && (
            <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.18em", color: accent ? rgba(accent.rgb, 0.8) : VT.ashSoft }}>
              {title}
            </div>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

/** A responsive grid wrapper for inspector content. */
export function InspectorGrid({
  cols = 2, gap = 14, children,
}: {
  cols?: number
  gap?: number
  children: React.ReactNode
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
      {children}
    </div>
  )
}

/** A "what this means" explanatory callout. */
export function InspectorNote({
  children, accent,
}: {
  children: React.ReactNode
  accent: ThemeAccent
}) {
  return (
    <div
      style={{
        display: "flex", gap: 10, alignItems: "flex-start",
        borderRadius: VT.cardRadiusTight,
        border: `1px solid ${rgba(accent.rgb, 0.18)}`,
        background: rgba(accent.rgb, 0.05),
        padding: "12px 14px",
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0, marginTop: 1, width: 16, height: 16, borderRadius: "50%",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: rgba(accent.rgb, 0.16), color: accent.hex,
          fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono, monospace)",
        }}
      >
        i
      </span>
      <div className="font-sans" style={{ fontSize: 12, color: VT.paperDim, lineHeight: 1.55 }}>
        {children}
      </div>
    </div>
  )
}
