"use client"

/**
 * LIVE ROOM — narrow fallback (< 880px of room width)
 *
 *   InstrumentRail  — a 44px column of icon keys docked on the room's left
 *                     edge: HOME · 4 instruments · 4 tools. The screen owns
 *                     the rest of the width.
 *   InspectorDrawer — the same deck + one-card stage, sliding over the
 *                     screen from the left. Portaled to <body> and aligned
 *                     to the ROOM's rect (fixed positioning is broken by
 *                     transformed ancestors in the hub), with a scrim, a
 *                     focus trap, ESC / outside-tap / swipe-left to close.
 */

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Home, X } from "lucide-react"
import { LR, lrMix } from "./live-room-tokens"
import { LrGhostButton, useReducedMotion, useMounted } from "./live-room-primitives"
import { useSession, INSTRUMENT_IDS, type Inspector } from "./session-store"
import { TOOLS } from "./session-state"
import { useLayout } from "./workspace"
import { InspectorDeck, InspectorStage, INSTRUMENTS_DEF, TOOLS_DEF, TOOL_KEYS, inspectorKey } from "./inspector"

function RailKey({ lit, dim = false, label, onPress, children }: { lit: boolean; dim?: boolean; label: string; onPress: () => void; children: React.ReactNode }) {
  const P = LR.primary
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={lit}
      onClick={onPress}
      className="relative inline-flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-1"
      style={{ width: 34, height: 34, borderRadius: 10, color: lit ? P : dim ? LR.ashSoft : LR.ash, background: lit ? lrMix(P, 0.12) : "transparent", border: `1px solid ${lit ? lrMix(P, 0.32) : "transparent"}`, opacity: dim && !lit ? 0.7 : 1, transition: "color 200ms, background 200ms, border-color 200ms" }}
    >
      {children}
      {lit && <span aria-hidden className="absolute rounded-full" style={{ left: -6, top: 11, width: 2, height: 12, background: P, boxShadow: `0 0 6px ${P}` }} />}
    </button>
  )
}

export function InstrumentRail() {
  const s = useSession()
  const { setDrawerOpen, drawerOpen } = useLayout()
  const cur = s.inspector
  const isLit = (i: Inspector) => drawerOpen && inspectorKey(cur) === inspectorKey(i)
  const open = (to: Inspector) => {
    // pressing the lit key while the drawer is open folds it; anything else opens/swaps
    if (drawerOpen && inspectorKey(cur) === inspectorKey(to)) { setDrawerOpen(false); return }
    s.dispatch({ type: "inspector", to, toggle: false })
    setDrawerOpen(true)
  }
  return (
    <nav aria-label="Instruments" className="lr-rail flex flex-col items-center gap-1.5 h-full py-2" style={{ width: 44, borderRight: `1px solid ${LR.pane.border}`, background: lrMix(LR.ink, 0.35) }}>
      <RailKey lit={isLit({ kind: "home" })} label="Mentor (home)" onPress={() => open({ kind: "home" })}><Home size={15} strokeWidth={1.6} /></RailKey>
      <span aria-hidden className="w-4 h-px my-1" style={{ background: LR.dashed() }} />
      {INSTRUMENT_IDS.map((id) => { const D = INSTRUMENTS_DEF[id]; const I = D.icon; return <RailKey key={id} lit={isLit({ kind: "instrument", id })} label={`${D.name} — ${D.purpose}`} onPress={() => open({ kind: "instrument", id })}><I size={15} strokeWidth={1.6} /></RailKey> })}
      <span aria-hidden className="w-4 h-px my-1" style={{ background: LR.dashed() }} />
      {TOOL_KEYS.map((id) => { const D = TOOLS_DEF[id]; const I = D.icon; const fg = s.foregroundTools.includes(id); return <RailKey key={id} lit={isLit({ kind: "tool", id })} dim={!fg} label={TOOLS.find((t) => t.id === id)?.label ?? id} onPress={() => open({ kind: "tool", id })}><I size={15} strokeWidth={1.6} /></RailKey> })}
    </nav>
  )
}

export function InspectorDrawer() {
  const { narrow, drawerOpen, setDrawerOpen, rootRef } = useLayout()
  const reduce = useReducedMotion()
  const mounted = useMounted()
  const panelRef = React.useRef<HTMLDivElement>(null)
  const [rect, setRect] = React.useState<{ top: number; left: number; height: number; width: number } | null>(null)
  const show = narrow && drawerOpen

  // align to the room, not the window; follow it while open
  React.useEffect(() => {
    if (!show) return
    const measure = () => { const r = rootRef.current?.getBoundingClientRect(); if (r) setRect({ top: r.top, left: r.left, height: r.height, width: r.width }) }
    measure()
    const ro = rootRef.current ? new ResizeObserver(measure) : null
    if (rootRef.current && ro) ro.observe(rootRef.current)
    window.addEventListener("scroll", measure, true)
    window.addEventListener("resize", measure)
    return () => { ro?.disconnect(); window.removeEventListener("scroll", measure, true); window.removeEventListener("resize", measure) }
  }, [show, rootRef])

  // ESC closes; TAB stays inside. The panel mounts one render after `show`
  // (it waits for the room rect), so the focus move is keyed on `rect` too.
  React.useEffect(() => {
    if (!show || !rect) return
    const prev = document.activeElement as HTMLElement | null
    const first = panelRef.current?.querySelector<HTMLElement>("button, [href], input, [tabindex]:not([tabindex='-1'])")
    first?.focus({ preventScroll: true })
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setDrawerOpen(false); return }
      if (e.key !== "Tab" || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex='-1'])")).filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const a = items[0], z = items[items.length - 1]
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    window.addEventListener("keydown", on, true)
    return () => { window.removeEventListener("keydown", on, true); prev?.focus?.() }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- rect only matters for its first non-null value
  }, [show, !!rect, setDrawerOpen])

  if (!mounted) return null
  const width = rect ? Math.min(420, rect.width * 0.88) : 420

  return createPortal(
    <AnimatePresence>
      {show && rect && (
        <motion.div key="lr-drawer" className="fixed z-[120]" style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, overflow: "hidden" }} initial={false} animate={{}} exit={{}}>
          {/* scrim */}
          <motion.button
            type="button" aria-label="Close the inspector" onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 w-full h-full focus:outline-none" style={{ background: lrMix(LR.ink, 0.55), backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", border: "none", cursor: "pointer" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          />
          {/* panel */}
          <motion.div
            ref={panelRef}
            role="dialog" aria-modal="true" aria-label="Inspector"
            className="absolute top-0 bottom-0 left-0 flex flex-col min-h-0"
            style={{ width, background: `linear-gradient(180deg, ${lrMix(LR.ink, 0.97)} 0%, ${lrMix(LR.ink, 0.94)} 100%)`, borderRight: `1px solid ${lrMix(LR.primary, 0.22)}`, boxShadow: `18px 0 48px -18px ${lrMix(LR.ink, 0.9)}`, containerType: "inline-size" }}
            initial={reduce ? { opacity: 0 } : { x: -width * 0.35, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: -width * 0.3, opacity: 0 }}
            transition={{ duration: reduce ? 0.12 : 0.28, ease: LR.ease }}
            drag={reduce ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.35, right: 0 }}
            onDragEnd={(_, info) => { if (info.offset.x < -70 || info.velocity.x < -400) setDrawerOpen(false) }}
          >
            <div className="flex items-center gap-2 px-3 shrink-0" style={{ height: 40, borderBottom: `1px solid ${LR.pane.border}` }}>
              <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: LR.type.headerTracking, color: LR.primary, fontWeight: 600 }}>Inspector</span>
              <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
              <LrGhostButton label="Close the inspector" onClick={() => setDrawerOpen(false)} size={26}><X size={12} /></LrGhostButton>
            </div>
            <InspectorDeck deckId="drawer" />
            <InspectorStage />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
