"use client"

/**
 * LIVE ROOM — the workspace
 *
 * A fixed-height, non-scrolling, resizable two-pane stage:
 *
 *   ┌ INSPECTOR ─────┃─ STAGE ──────────────────────────┐
 *   │ deck · one card ┃  screen (chart hero)              │
 *   │ (scrolls inside)┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
 *   │                 ┃  talk dock (collapses to 44px)    │
 *   └─────────────────┸───────────────────────────────────┘
 *
 * Both dividers are draggable; ratios persist per device through
 * react-resizable-panels' autoSaveId. Below 880px of *container* width the
 * inspector panel unmounts and a 44px instrument rail docks on the left —
 * the room adapts to the width the shell gives it, never to the window.
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle, type ImperativePanelGroupHandle } from "react-resizable-panels"
import { LR, lrMix } from "./live-room-tokens"
import { useReducedMotion } from "./live-room-primitives"

/* ────────────────────────────────────────────────────────────────────────
 *  Layout memory — one boolean per key, SSR-safe, per device
 * ──────────────────────────────────────────────────────────────────────── */
export function useLayoutMemory(key: string, initial: boolean): [boolean, (v: boolean) => void] {
  const [value, setValue] = React.useState(initial)
  const hydrated = React.useRef(false)
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === "1" || raw === "0") setValue(raw === "1")
    } catch { /* storage unavailable — keep the default */ }
    hydrated.current = true
  }, [key])
  const set = React.useCallback((v: boolean) => {
    setValue(v)
    try { window.localStorage.setItem(key, v ? "1" : "0") } catch { /* ignore */ }
  }, [key])
  return [value, set]
}

/* ────────────────────────────────────────────────────────────────────────
 *  Layout context — width, narrow mode, dock + drawer state
 * ──────────────────────────────────────────────────────────────────────── */
export const NARROW_BELOW = 880
export const SPLIT_DEFAULT: [number, number] = [40, 60]
export const STACK_DEFAULT: [number, number] = [62, 38]
export const INSPECTOR_MIN_PX = 300
export const TALK_HANDLE_PX = 44

export interface LayoutState {
  /** measured width of the room root (0 before mount) */
  width: number
  /** below NARROW_BELOW — inspector becomes a rail + slide-over drawer */
  narrow: boolean
  talkCollapsed: boolean
  setTalkCollapsed: (v: boolean) => void
  drawerOpen: boolean
  setDrawerOpen: (v: boolean) => void
  /** the room root, for portals that must align with the room, not the window */
  rootRef: React.RefObject<HTMLDivElement | null>
}

const LayoutCtx = React.createContext<LayoutState | null>(null)

export function useLayout(): LayoutState {
  const c = React.useContext(LayoutCtx)
  if (!c) throw new Error("useLayout must be used inside <WorkspaceRoot>")
  return c
}

/** For components that also render outside the workspace (null there). */
export function useLayoutOptional(): LayoutState | null {
  return React.useContext(LayoutCtx)
}

/**
 * The room root. Measures itself, owns the layout context, never scrolls.
 */
export function WorkspaceRoot({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)
  const [talkCollapsed, setTalkCollapsed] = useLayoutMemory("lr:talk-collapsed", false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  // server + first client frame render the wide layout; narrow flips after measure
  const narrow = width > 0 && width < NARROW_BELOW
  React.useEffect(() => { if (!narrow) setDrawerOpen(false) }, [narrow])

  const value = React.useMemo<LayoutState>(
    () => ({ width, narrow, talkCollapsed, setTalkCollapsed, drawerOpen, setDrawerOpen, rootRef }),
    [width, narrow, talkCollapsed, setTalkCollapsed, drawerOpen],
  )

  return (
    <LayoutCtx.Provider value={value}>
      <div ref={rootRef} className={`lr-root relative flex flex-col min-h-0 overflow-hidden ${className}`} style={style} data-narrow={narrow ? "" : undefined}>
        {children}
      </div>
    </LayoutCtx.Provider>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  LrDivider — the draggable hairline
 *
 *  1px hairline · 8px hit area (16px on touch) · hover → 22px grip pill
 *  drag → panels follow at duration 0, a "42 · 58" readout floats on the
 *  divider · release → 180ms settle glow · double-click → defaults.
 * ──────────────────────────────────────────────────────────────────────── */
function LrDivider({
  direction, layout, onReset, disabled = false, label,
}: {
  direction: "horizontal" | "vertical"
  layout: number[]
  onReset: () => void
  disabled?: boolean
  label: string
}) {
  const reduce = useReducedMotion()
  const [dragging, setDragging] = React.useState(false)
  const [hover, setHover] = React.useState(false)
  const [settle, setSettle] = React.useState(0)
  const vertical = direction === "horizontal" // a horizontal group has a vertical divider
  const lit = dragging || hover
  const P = LR.primary
  const readout = layout.length >= 2 ? `${Math.round(layout[0])} · ${Math.round(layout[1])}` : ""

  return (
    <PanelResizeHandle
      disabled={disabled}
      hitAreaMargins={{ coarse: 16, fine: 8 }}
      onDragging={(d) => { setDragging(d); if (!d) setSettle((n) => n + 1) }}
      onDoubleClick={onReset}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="lr-divider relative shrink-0 focus:outline-none focus-visible:ring-1"
      aria-label={label}
      title={`${label} — drag to resize · double-click to reset`}
      style={{
        width: vertical ? 1 : undefined,
        height: vertical ? undefined : 1,
        alignSelf: "stretch",
        cursor: disabled ? "default" : vertical ? "col-resize" : "row-resize",
        zIndex: 5,
        // the hairline itself
        background: disabled ? "transparent" : lit ? lrMix(P, dragging ? 0.75 : 0.45) : LR.pane.border,
        boxShadow: dragging && !reduce ? `0 0 12px ${lrMix(P, 0.55)}` : "none",
        transition: disabled ? "none" : "background 180ms ease, box-shadow 180ms ease",
      }}
    >
      {/* settle glow — one flash on release */}
      {!reduce && settle > 0 && !disabled && (
        <motion.span key={settle} aria-hidden className="absolute" style={vertical ? { top: 0, bottom: 0, left: -2, width: 5 } : { left: 0, right: 0, top: -2, height: 5 }}
          initial={{ opacity: 0.9, background: lrMix(P, 0.55) }} animate={{ opacity: 0 }} transition={{ duration: 0.18 }} />
      )}
      {/* grip pill */}
      <AnimatePresence>
        {lit && !disabled && (
          <motion.span
            key="grip"
            aria-hidden
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: "50%", top: "50%", translate: "-50% -50%",
              width: vertical ? 8 : 22, height: vertical ? 22 : 8, borderRadius: 999,
              background: lrMix(LR.ink, 0.92), border: `1px solid ${lrMix(P, dragging ? 0.8 : 0.45)}`,
              boxShadow: `0 0 ${dragging ? 14 : 8}px ${lrMix(P, dragging ? 0.5 : 0.25)}`,
              flexDirection: vertical ? "column" : "row", gap: 3,
            }}
            initial={reduce ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: dragging ? 1.12 : 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.16, ease: LR.ease }}
          >
            {[0, 1, 2].map((i) => <span key={i} className="block rounded-full" style={{ width: 2, height: 2, background: lrMix(P, 0.9) }} />)}
          </motion.span>
        )}
      </AnimatePresence>
      {/* readout chip while dragging */}
      <AnimatePresence>
        {dragging && readout && (
          <motion.span
            key="readout"
            aria-hidden
            className="absolute font-mono tabular-nums whitespace-nowrap pointer-events-none"
            style={{
              left: "50%", top: "50%",
              translate: vertical ? "-50% calc(-50% - 22px)" : "calc(-50% + 0px) calc(-50% - 16px)",
              fontSize: 9.5, letterSpacing: "0.14em", fontWeight: 600, color: LR.primary,
              padding: "3px 8px", borderRadius: 999,
              background: lrMix(LR.ink, 0.94), border: `1px solid ${lrMix(P, 0.35)}`, boxShadow: `0 6px 18px ${lrMix(LR.ink, 0.6)}`,
            }}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.14 }}
          >
            {readout}
          </motion.span>
        )}
      </AnimatePresence>
    </PanelResizeHandle>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  Workspace — the two panel groups
 * ──────────────────────────────────────────────────────────────────────── */
export function Workspace({
  inspector, rail, screen, talk, talkHandle,
}: {
  /** the left pane when the room is wide */
  inspector: React.ReactNode
  /** the 44px icon rail when the room is narrow */
  rail: React.ReactNode
  screen: React.ReactNode
  talk: React.ReactNode
  /** the 44px bar shown in place of the talk dock while it is collapsed */
  talkHandle: React.ReactNode
}) {
  const { width, narrow, talkCollapsed, setTalkCollapsed } = useLayout()
  const hGroup = React.useRef<ImperativePanelGroupHandle>(null)
  const vGroup = React.useRef<ImperativePanelGroupHandle>(null)
  const talkPanel = React.useRef<ImperativePanelHandle>(null)
  const [hLayout, setHLayout] = React.useState<number[]>(SPLIT_DEFAULT)
  const [vLayout, setVLayout] = React.useState<number[]>(STACK_DEFAULT)

  // the 300px floor expressed as a percentage of the current width
  const inspectorMin = width > 0 ? Math.min(45, Math.max(20, (INSPECTOR_MIN_PX / width) * 100)) : 26

  // collapse / expand the talk dock imperatively so the screen never remounts
  React.useEffect(() => {
    const p = talkPanel.current
    if (!p) return
    if (talkCollapsed && !p.isCollapsed()) p.collapse()
    if (!talkCollapsed && p.isCollapsed()) p.expand()
  }, [talkCollapsed])

  const stage = (
    <div className="flex flex-col min-w-0 min-h-0 h-full">
      <PanelGroup ref={vGroup} direction="vertical" autoSaveId="lr:split-v" onLayout={setVLayout} className="flex-1 min-h-0">
        <Panel id="screen" order={1} defaultSize={STACK_DEFAULT[0]} minSize={46} className="min-h-0 lr-panel-screen" style={{ containerType: "inline-size" }}>
          <div className="h-full min-h-0" style={{ padding: "10px 12px 6px 6px" }}>{screen}</div>
        </Panel>
        <LrDivider direction="vertical" layout={vLayout} disabled={talkCollapsed} label="Screen / discussion divider" onReset={() => vGroup.current?.setLayout([...STACK_DEFAULT])} />
        <Panel
          ref={talkPanel}
          id="talk"
          order={2}
          defaultSize={STACK_DEFAULT[1]}
          minSize={16}
          collapsible
          collapsedSize={0}
          onCollapse={() => setTalkCollapsed(true)}
          onExpand={() => setTalkCollapsed(false)}
          className="min-h-0 lr-panel-talk"
          style={{ containerType: "inline-size" }}
        >
          <div className="h-full min-h-0" style={{ padding: "6px 12px 10px 6px" }}>{talk}</div>
        </Panel>
      </PanelGroup>
      <AnimatePresence initial={false}>
        {talkCollapsed && (
          <motion.div key="talk-handle" className="shrink-0 overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: TALK_HANDLE_PX, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: LR.ease }}>
            {talkHandle}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  if (narrow) {
    return (
      <div className="lr-workspace flex-1 min-h-0 flex min-w-0">
        <div className="shrink-0 min-h-0" style={{ width: TALK_HANDLE_PX }}>{rail}</div>
        <div className="flex-1 min-w-0 min-h-0">{stage}</div>
      </div>
    )
  }

  return (
    <PanelGroup ref={hGroup} direction="horizontal" autoSaveId="lr:split-h" onLayout={setHLayout} className="lr-workspace flex-1 min-h-0">
      <Panel id="inspector" order={1} defaultSize={SPLIT_DEFAULT[0]} minSize={inspectorMin} maxSize={55} className="min-w-0 min-h-0 lr-panel-inspector">
        {inspector}
      </Panel>
      <LrDivider direction="horizontal" layout={hLayout} label="Inspector / stage divider" onReset={() => hGroup.current?.setLayout([...SPLIT_DEFAULT])} />
      <Panel id="stage" order={2} defaultSize={SPLIT_DEFAULT[1]} minSize={45} className="min-w-0 min-h-0 lr-panel-stage">
        {stage}
      </Panel>
    </PanelGroup>
  )
}
