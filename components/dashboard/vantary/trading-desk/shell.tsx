"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · SHELL
 *  ─────────────────────────────────────────────────────────────────────────
 *  The bay's outer envelope. Renders the editorial border, the header
 *  strip (eyebrow + symbol picker + interval picker + layout chips +
 *  window controls), the chart-and-slot body in whatever layout mode
 *  the provider currently has, the footer caption strip, and the
 *  resize handle (split-mode only).
 *
 *  Full-bleed envelope — caller mounts it inside a centered max-width
 *  container, and we use a `calc(50% - 50vw)` negative-margin trick to
 *  break out of that container all the way to the viewport edges. The
 *  actual content inside the bay is then re-padded so it lines up
 *  visually with the centered editorial column above and below it.
 *
 *  Layout modes (see ./data.ts for the full union):
 *
 *    SPLIT       │  ┌──────────────────────┬───────────┐
 *                │  │      TradingView     │ Side slot │
 *                │  └──────────────────────┴───────────┘
 *
 *    STACKED     │  ┌──────────────────────────────────┐
 *                │  │           TradingView            │
 *                │  ├──────────────────────────────────┤
 *                │  │            Side slot             │
 *                │  └──────────────────────────────────┘
 *
 *    CHART-ONLY  │  ┌──────────────────────────────────┐
 *                │  │           TradingView            │
 *                │  └──────────────────────────────────┘
 *
 *    MIN         │  ┌─ TRADING DESK · ES 5,847 ↑0.32% ─┐  (36px)
 *
 *  Fullscreen mode — when state.isFullscreen is true the whole shell
 *  re-mounts as a position:fixed overlay covering the viewport. ESC
 *  exits (handled by the provider).
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GripVertical, Pin } from "lucide-react"

import { useTradingDesk } from "./provider"
import { TradingViewEmbed } from "./chart"
import { SideSlot } from "./side-slot"
import {
  // IntervalPicker intentionally NOT imported — TradingView's own
  // native interval picker is the source of truth. See <HeaderStrip/>.
  LayoutModeChips,
  SideSlotChips,
  SidePositionToggle,
  PeekToggle,
  WindowControls,
  MiniTicker,
} from "./pickers"
import { CustomizeButton } from "./customize-popover"
import { SignalNavigator } from "./navigator"
import { ExecutionShellProvider } from "./execution-console"
import { FastEntryBar } from "./execution-console/fast-entry-bar"
import { ThemeSwitcher } from "../theme-switcher"
import {
  TD_HEIGHTS,
  TD_HEIGHT_MIN,
  TD_VIEWPORT_PADDING,
  TD_RESIZE_MIN,
  TD_RESIZE_MAX,
  TD_CHART_GUTTER_X,
  TD_CHART_GUTTER_Y,
  TD_PEEK_PANEL_MIN_WIDTH,
  TD_PEEK_PANEL_MAX_WIDTH,
  TD_PEEK_GRACE_MS,
  TD_SIDE_SLOT_LABELS,
  clampResize,
  clampPeekPanelWidth,
} from "./data"
import { VANTARY } from "../vantary-theme"

/* ─── 0.  VIEWPORT-AWARE BAY HEIGHT  ──────────────────────────────────
 *  Returns the chart-area height the bay should occupy this frame.
 *  Always equals `window.innerHeight − TD_VIEWPORT_PADDING` on
 *  desktop, floored by `TD_HEIGHT_MIN` so it never collapses below
 *  usability on tiny viewports. There is intentionally NO `intrinsic
 *  height` cap — that's what made the bay look "short" on big
 *  monitors. The signal-terminal page (`/copilot`) uses `flex-1
 *  min-h-0` with the chart filling the entire remaining viewport,
 *  and this hook reproduces that same `fills-the-screen` feel inside
 *  a scrolling parent.
 *
 *  Fullscreen and minimized modes still defer to TD_HEIGHTS — the
 *  former takes over the whole viewport via the dialog overlay,
 *  the latter is a 36px hairline collapse and never wants to grow.
 *
 *  SSR-safe: returns the static TD_HEIGHTS[mode] until mount, then
 *  re-computes on every `resize` and `orientationchange` event.
 *  ────────────────────────────────────────────────────────────────── */
function useViewportBayHeight(layout: keyof typeof TD_HEIGHTS, isFullscreen: boolean): number {
  const intrinsic = TD_HEIGHTS[layout]
  const [vh, setVh] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const update = () => setVh(window.innerHeight)
    update()
    window.addEventListener("resize", update, { passive: true })
    window.addEventListener("orientationchange", update, { passive: true })
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("orientationchange", update)
    }
  }, [])

  // Fullscreen and minimized modes use their hard intrinsic values.
  if (isFullscreen) return intrinsic
  if (layout === "minimized") return TD_HEIGHTS.minimized

  // Pre-mount (or non-browser env): fall back to the intrinsic height.
  if (vh === null) return intrinsic

  // Always fill viewport minus chrome. No intrinsic cap — the bay must
  // visually match the signal-terminal page's `h-full` chart pane.
  return Math.max(TD_HEIGHT_MIN, vh - TD_VIEWPORT_PADDING)
}

/* ─── 1.  RESIZE HANDLE (split mode only) ──────────────────────────── */

function ResizeHandle({ containerRef }: {
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const { state, actions } = useTradingDesk()
  const dragging = state.draggingPct !== null
  const isLeftSlot = state.sideSlotPosition === "left"

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

      const onMove = (ev: PointerEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        // Position-aware: in LEFT mode, dragging right grows the
        // slot (and shrinks the chart). In RIGHT mode, dragging right
        // grows the chart. The math is mirrored — we still track
        // tvWidthPct as "fraction occupied by chart".
        const rawPct = (ev.clientX - rect.left) / rect.width
        const chartPct = isLeftSlot ? 1 - rawPct : rawPct
        actions.setDragging(clampResize(chartPct))
      }
      const onUp = () => {
        actions.setDragging(null)
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup",   onUp)
        window.removeEventListener("pointercancel", onUp)
      }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup",   onUp)
      window.addEventListener("pointercancel", onUp)
    },
    [containerRef, actions],
  )

  // Keyboard accessibility: arrow keys when handle is focused
  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 0.05 : 0.01
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        actions.setTvWidth(state.tvWidthPct - step)
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        actions.setTvWidth(state.tvWidthPct + step)
      } else if (e.key === "Home") {
        e.preventDefault()
        actions.setTvWidth(TD_RESIZE_MIN)
      } else if (e.key === "End") {
        e.preventDefault()
        actions.setTvWidth(TD_RESIZE_MAX)
      }
    },
    [actions, state.tvWidthPct],
  )

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize chart vs side panel"
      aria-valuenow={Math.round(state.tvWidthPct * 100)}
      aria-valuemin={Math.round(TD_RESIZE_MIN * 100)}
      aria-valuemax={Math.round(TD_RESIZE_MAX * 100)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKey}
      className="flex items-center justify-center"
      style={{
        position:   "relative",
        width:      8,
        height:     "100%",
        cursor:     "col-resize",
        background: dragging ? VANTARY.amberWash : "transparent",
        borderLeft:  `1px solid ${VANTARY.rule}`,
        borderRight: `1px solid ${VANTARY.rule}`,
        userSelect: "none",
        touchAction: "none",
        zIndex:     2,
        transition: "background 0.18s",
      }}
      onMouseEnter={e => {
        if (!dragging) (e.currentTarget as HTMLElement).style.background = VANTARY.rule
      }}
      onMouseLeave={e => {
        if (!dragging) (e.currentTarget as HTMLElement).style.background = "transparent"
      }}
    >
      <GripVertical
        size={12}
        strokeWidth={1.4}
        color={dragging ? VANTARY.amber : VANTARY.ashSoft}
      />
      {/* live percentage tooltip while dragging */}
      {dragging && (
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            position:      "absolute",
            top:           -28,
            left:          "50%",
            transform:     "translateX(-50%)",
            padding:       "3px 7px",
            fontSize:      10,
            letterSpacing: "0.18em",
            color:         VANTARY.amber,
            background:    VANTARY.ink ?? VANTARY.paper,
            border:        `1px solid ${VANTARY.amberHalo}`,
            borderRadius:  2,
            whiteSpace:    "nowrap",
            pointerEvents: "none",
          }}
        >
          {Math.round(state.tvWidthPct * 100)}% / {Math.round((1 - state.tvWidthPct) * 100)}%
        </span>
      )}
    </div>
  )
}

/* ─── 2.  HEADER STRIP ─────────────────────────────────────────────── */

function HeaderStrip() {
  /* Publish this control rail's vertical center to a CSS custom property
   * so the floating Community swipe tab (rendered in a separate React tree
   * via FloatingCommunityHub) can pin itself to the SAME vertical range as
   * the rail — without being a DOM child of it. We measure once on mount
   * and on resize only (not on scroll), so the tab stays put while the
   * flight deck reveals/conceals above it. */
  const headerRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const publish = () => {
      const r = el.getBoundingClientRect()
      // Pin the floating Community tab up near the chart toolbar / EURUSD row
      // (the empty band just below the header), not the rail's vertical center.
      const center = r.top + r.height / 2 - 278
      document.documentElement.style.setProperty("--community-tab-top", `${Math.round(center)}px`)
    }
    publish()
    window.addEventListener("resize", publish)
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(publish) : null
    ro?.observe(el)
    return () => {
      window.removeEventListener("resize", publish)
      ro?.disconnect()
    }
  }, [])
  return (
    <header
      ref={headerRef}
      style={{
        /* M1 · The dark `VANTARY.ink` background was the single biggest
         * source of the "Confluence Bridge feels separated from the
         * ticker rail" pathology. Removing it lets the navigator
         * inherit the page canvas, exactly like the TickerStrip above
         * — so VantaryHeader → TickerStrip → Confluence Bridge now
         * reads as ONE continuous instrument cluster. The single
         * hairline `borderBottom` (M8) is the only visual separator
         * between the navigator and the chart pane below it. */
        background:   "transparent",
        borderBottom: `1px solid ${VANTARY.rule}`,
        flexShrink:   0,
        zIndex:       2,
        position:     "relative",
      }}
    >
      {/* The bay header is a port of the Institutional Signal Terminal
          page (`/copilot` → signal-terminal-header.tsx). Two rows:
          (1) bars-glyph + title + subtitle on the left, bay-specific
          control rail on the right (interval picker, layout chips,
          side-slot chips, window controls), and (2) a rounded inner
          control panel with the ticker pill, category dropdowns
          (Forex / Indexes / Crypto / Metals / Futures / Stocks),
          and right-edge actions (search · share · customize).

          The right-side control rail is passed in here as a prop so
          the SignalNavigator stays bay-agnostic and easy to reuse. */}
      {/* The bay-specific right-side rail is intentionally minimal:
          we DROPPED the legacy `<IntervalPicker/>` (1M 5M 15M 1H 4H 1D
          1W 1M chip strip) because TradingView's own native interval
          picker is rendered immediately below this header (the
          "1m / 30m / 1h / 4h / …" row inside the embed) — having two
          independent pickers was duplicate UI and a source of
          out-of-sync state confusion. The remaining rail is just
          layout / slot / window controls. */}
      {/* The header is now a SINGLE consolidated row (Row 1 was
          collapsed into Row 2 in <SignalNavigator/>). To pack the
          identity block, category pills, layout/slot toggles, search,
          share, and window controls all into one rail without
          crowding, we render the layout-mode and side-slot chips in
          their `compact` variants — tighter padding, smaller font,
          and short "ACTIVE / EQUITY" labels for the side-slot pair.
          Visual rhythm matches the category pills next to them. */}
      <SignalNavigator
        rightControls={
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Chromatic theme switcher — moved here from the navigator's
                left slot into the spot the Community trigger used to occupy.
                The Community entry point is now the floating left-edge swipe
                tab again (see floating-community-hub.tsx). */}
            <ThemeSwitcher inline />
            <span aria-hidden style={{ width: 1, height: 12, background: VANTARY.rule, marginLeft: 2, marginRight: 2 }} />
            {/* SPLIT / CHART layout chips. STACKED + MIN dropped from
                the chip strip — minimize lives in <WindowControls/>. */}
            <LayoutModeChips compact />
            {/* The trader's pinned modules. Modules are configured via
                the CUSTOMIZE popover next to this group. */}
            <SideSlotChips compact />
            {/* Spacer */}
            <span aria-hidden style={{ width: 1, height: 12, background: VANTARY.rule, marginLeft: 2, marginRight: 2 }} />
            {/* Side panel position swap (◀ L | R ▶). */}
            <SidePositionToggle />
            {/* Hover-peek on/off (only meaningful in CHART mode). */}
            <PeekToggle />
            {/* THE customize button — modules + presets + peek panel. */}
            <CustomizeButton />
            {/* Spacer */}
            <span aria-hidden style={{ width: 1, height: 12, background: VANTARY.rule, marginLeft: 2, marginRight: 2 }} />
            <WindowControls />
          </div>
        }
      />
    </header>
  )
}

/* ─── 3.  FOOTER STRIP ─────────────────────────────────────────────── */

function FooterStrip() {
  const { state, selectors } = useTradingDesk()
  const sym = selectors.currentSymbol
  const itv = selectors.currentInterval

  return (
    <footer
      className="flex items-center gap-3 flex-wrap"
      style={{
        padding:      "6px 14px",
        background:   VANTARY.ink ?? VANTARY.paper,
        borderTop:    `1px solid ${VANTARY.rule}`,
        flexShrink:   0,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        {sym.tvSymbol} · {itv.label}
      </span>
      <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule, minWidth: 24, opacity: 0.6 }} />
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        DRAG · ↔ TO RESIZE  ·  PRESS{" "}
        <span style={{ color: VANTARY.paper }}>M</span> TO MIN  ·  POWERED BY TRADINGVIEW
      </span>
      <span aria-hidden className="rounded-full" style={{ width: 6, height: 6, background: VANTARY.amber, opacity: 0.7 }} />
    </footer>
  )
}

/* ─── 4.  BODY · per layout mode ─────────────────────────────────────
 *  ShellBody forwards `customSlotContent` (and the legacy aliases
 *  `liveEquityContent` / `activeWindowsContent`) into <SideSlot/>.
 *  Each module the trader can pick from the customize popover renders
 *  either a built-in mini, a parent-supplied node from this map, or a
 *  "wired soon" placeholder.
 *
 *  Layout grammar:
 *    · split       — chart + slot, slot on LEFT or RIGHT depending on
 *                    `state.sideSlotPosition`. Resize handle drags the
 *                    border between them. Gutters give TradingView ~10px
 *                    of breathing room on each horizontal edge.
 *    · stacked     — kept for backwards-compat (legacy persisted state).
 *                    No longer reachable from the chip strip but still
 *                    rendered cleanly if hydrated.
 *    · chart-only  — chart fills the bay. When `slotPeekEnabled` is true
 *                    a slim hairline strip lives on the slot's edge —
 *                    hovering it slides the side slot in as a 380px peek
 *                    that auto-collapses on pointer-leave. A pin button
 *                    inside the peek promotes the layout to split.
 * ───────────────────────────────────────────────────────────────────── */

function ShellBody({
  heightPx,
  customSlotContent,
  liveEquityContent,
  activeWindowsContent,
}: {
  heightPx: number
  customSlotContent?: Partial<Record<import("./data").TdSideSlot, ReactNode>>
  liveEquityContent?: ReactNode
  activeWindowsContent?: ReactNode
}) {
  const { state } = useTradingDesk()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isLeft = state.sideSlotPosition === "left"

  if (state.layout === "minimized" && !state.isFullscreen) {
    return null
  }

  /* ── PEEK MODE OVERRIDE ──────────────────────────────────────────
   *  When the eye toggle is ON, peek is a GLOBAL behavior — the panel
   *  is hidden by default no matter what layout chip is active. The
   *  trader hovers the slot-side edge of the chart; the panel slides
   *  in from outside the layout AND TradingView shrinks to make room
   *  (real flex squeeze, not an overlay). Pointer leaves → panel
   *  slides back out, chart reclaims the width.
   *
   *  This is the same UX grammar as the Marcus Big "scroll up to
   *  reveal" pattern — peek mode is the "hide by default, reveal
   *  on intent" affordance for the side panel.
   *
   *  When peek is OFF, layout chips behave normally (split shows the
   *  panel permanently, chart-only hides it with no peek).
   * ────────────────────────────────────────────────────────────── */
  if (state.slotPeekEnabled && state.layout !== "stacked") {
    return (
      <ChartOnlyBody
        heightPx={heightPx}
        customSlotContent={customSlotContent}
        liveEquityContent={liveEquityContent}
        activeWindowsContent={activeWindowsContent}
      />
    )
  }

  /* ── SPLIT LAYOUT (peek OFF) ─────────────────────────────────────
   *  Chart and slot side-by-side. TradingView is wrapped in a gutter
   *  div so it doesn't sit flush against the side-slot border or the
   *  bay edge. The chart pane reads as a "breathing surface" rather
   *  than a glued slab.
   * ────────────────────────────────────────────────────────────── */
  if (state.layout === "split") {
    const chartPanel = (
      <div
        key="chart"
        style={{
          width:      `${state.tvWidthPct * 100}%`,
          height:     "100%",
          padding:    `${TD_CHART_GUTTER_Y}px ${TD_CHART_GUTTER_X}px`,
          transition: state.draggingPct === null ? "width 0.24s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
          minWidth:   0,
        }}
      >
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <TradingViewEmbed />
        </div>
      </div>
    )

    const slotPanel = (
      <div key="slot" style={{ flex: 1, height: "100%", minWidth: 0, padding: `${TD_CHART_GUTTER_Y}px 0` }}>
        <SideSlot
          customSlotContent={customSlotContent}
          liveEquityContent={liveEquityContent}
          activeWindowsContent={activeWindowsContent}
        />
      </div>
    )

    return (
      <div
        ref={containerRef}
        className="flex"
        style={{
          height:     heightPx,
          background: VANTARY.ink ?? VANTARY.paper,
          position:   "relative",
        }}
      >
        {isLeft ? slotPanel : chartPanel}
        <ResizeHandle containerRef={containerRef} />
        {isLeft ? chartPanel : slotPanel}
      </div>
    )
  }

  if (state.layout === "stacked") {
    return (
      <div
        className="flex flex-col"
        style={{ height: heightPx, background: VANTARY.ink ?? VANTARY.paper }}
      >
        <div style={{ flex: "0 0 70%", minHeight: 0, padding: `${TD_CHART_GUTTER_Y}px ${TD_CHART_GUTTER_X}px` }}>
          <TradingViewEmbed />
        </div>
        <div style={{ flex: "0 0 30%", minHeight: 0, borderTop: `1px solid ${VANTARY.rule}` }}>
          <SideSlot
            customSlotContent={customSlotContent}
            liveEquityContent={liveEquityContent}
            activeWindowsContent={activeWindowsContent}
          />
        </div>
      </div>
    )
  }

  /* ── CHART-ONLY (with optional hover-peek) ────────────────────── */
  return (
    <ChartOnlyBody
      heightPx={heightPx}
      customSlotContent={customSlotContent}
      liveEquityContent={liveEquityContent}
      activeWindowsContent={activeWindowsContent}
    />
  )
}

/* ─── 4b.  CHART-ONLY BODY WITH SQUEEZE-PEEK ───────────────────────
 *  Default: chart fills 100% of the bay. The trader sees ZERO panel
 *  chrome — pure chart.
 *
 *  Hover the slot-side edge → the panel SLIDES IN from outside the
 *  layout AND TradingView SHRINKS by the panel width to make room.
 *  This is a real flex squeeze, NOT an overlay. The chart never gets
 *  covered.
 *
 *  Cursor leaves the panel + the edge zone → after a short grace
 *  period the panel slides back out and TradingView reclaims its full
 *  width.
 *
 *  A small "PIN" button in the panel header promotes the layout to
 *  split mode (the panel becomes permanent until the trader unpins).
 *
 *  When peek is disabled (eye toggle), chart-only is purely chart —
 *  no edge zone, no slide-in, no chrome.
 * ───────────────────────────────────────────────────────────────��� */

function ChartOnlyBody({
  heightPx,
  customSlotContent,
  liveEquityContent,
  activeWindowsContent,
}: {
  heightPx: number
  customSlotContent?: Partial<Record<import("./data").TdSideSlot, ReactNode>>
  liveEquityContent?: ReactNode
  activeWindowsContent?: ReactNode
}) {
  const { state, actions } = useTradingDesk()
  const isLeft   = state.sideSlotPosition === "left"
  const peekable = state.slotPeekEnabled

  const [peekOpen, setPeekOpen] = useState(false)
  const graceTimerRef = useRef<number | null>(null)
  const containerRef  = useRef<HTMLDivElement | null>(null)

  // Local drag state for the panel resize handle. Tracking it locally
  // (and committing on pointer-up) keeps the persisted state quiet
  // during the drag and lets us suppress the width transition while
  // the trader is actively dragging — the drag should feel like 1:1
  // pixel tracking, not an animated catch-up.
  const [draggingWidth, setDraggingWidth] = useState<number | null>(null)
  const panelWidth = draggingWidth ?? state.peekPanelWidth

  const cancelGrace = () => {
    if (graceTimerRef.current !== null) {
      window.clearTimeout(graceTimerRef.current)
      graceTimerRef.current = null
    }
  }
  const scheduleClose = () => {
    cancelGrace()
    graceTimerRef.current = window.setTimeout(() => {
      setPeekOpen(false)
      graceTimerRef.current = null
    }, TD_PEEK_GRACE_MS)
  }
  useEffect(() => () => cancelGrace(), [])

  // If peek gets disabled while open, snap closed.
  useEffect(() => {
    if (!peekable && peekOpen) setPeekOpen(false)
  }, [peekable, peekOpen])

  /* ── Panel resize drag ───────────────────────────────────────────
   *  The trader grabs the panel's chart-side edge and drags to grow
   *  or shrink the panel. The chart re-flows live (flex sibling) so
   *  it always reads as a real layout squeeze, never an overlay.
   *
   *  `draggingWidth` is the live pixel width while the pointer is
   *  down; on pointer-up we commit to the store via setPeekPanelWidth
   *  (which clamps + persists). The container ref gives us a stable
   *  origin to compute "distance from chart-side edge" in pixels for
   *  both LEFT and RIGHT slot positions.
   * ────────────────────────────────────────────────────────────── */
  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      cancelGrace()

      const onMove = (ev: PointerEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        // Distance from the bay's slot-side edge to the cursor, in px.
        // RIGHT slot: panel grows as cursor moves LEFT  → rect.right - clientX.
        // LEFT  slot: panel grows as cursor moves RIGHT → clientX - rect.left.
        const raw = isLeft
          ? ev.clientX - rect.left
          : rect.right - ev.clientX
        setDraggingWidth(clampPeekPanelWidth(raw))
      }
      const onUp = () => {
        // Commit final width and clear the local drag state.
        setDraggingWidth(prev => {
          if (prev !== null) actions.setPeekPanelWidth(prev)
          return null
        })
        window.removeEventListener("pointermove",   onMove)
        window.removeEventListener("pointerup",     onUp)
        window.removeEventListener("pointercancel", onUp)
      }
      window.addEventListener("pointermove",   onMove)
      window.addEventListener("pointerup",     onUp)
      window.addEventListener("pointercancel", onUp)
    },
    [isLeft, actions],
  )

  // Keyboard accessibility — focus the handle and use arrow keys to
  // resize in 16px steps (Shift = 48px) within the clamped bounds.
  const onResizeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 48 : 16
      let next = state.peekPanelWidth
      // For LEFT slot the keys feel inverted relative to RIGHT — we
      // mirror so that "ArrowRight" always grows the panel relative
      // to the chart, regardless of side.
      const grow   = isLeft ? "ArrowRight" : "ArrowLeft"
      const shrink = isLeft ? "ArrowLeft"  : "ArrowRight"
      if (e.key === grow)   { e.preventDefault(); next = state.peekPanelWidth + step }
      if (e.key === shrink) { e.preventDefault(); next = state.peekPanelWidth - step }
      if (e.key === "Home") { e.preventDefault(); next = TD_PEEK_PANEL_MIN_WIDTH }
      if (e.key === "End")  { e.preventDefault(); next = TD_PEEK_PANEL_MAX_WIDTH }
      if (next !== state.peekPanelWidth) actions.setPeekPanelWidth(next)
    },
    [actions, state.peekPanelWidth, isLeft],
  )

  /* ── Chart pane ─────────────────────────────────────────────────
   *  Width transitions smoothly between 100% (peek closed) and
   *  `100% - panelWidth` (peek open). The chart fills its pane —
   *  TradingView's own canvas resizes naturally as the parent
   *  shrinks.
   * ────────────────────────────────────���───────────────────────── */
  const chartPane = (
    <div
      key="chart"
      style={{
        flex:       "1 1 auto",
        minWidth:   0,
        height:     "100%",
        padding:    `${TD_CHART_GUTTER_Y}px ${TD_CHART_GUTTER_X}px`,
        transition: "padding 0.24s ease",
        position:   "relative",
      }}
    >
      <TradingViewEmbed />
    </div>
  )

  /* ── Side panel pane ────────────────────────────────────────────
   *  Always rendered when peek is enabled — its WIDTH animates from
   *  0 (closed) to `panelWidth` (open). Because it's a flex sibling
   *  to the chart, growing this pane SQUEEZES the chart. This is the
   *  real layout squeeze the trader asked for.
   *
   *  When the trader is actively dragging the resize handle, the
   *  width transition is suppressed so the drag tracks 1:1 with the
   *  cursor (no visible animation lag).
   * ────────────────────────────────────────────────────────────── */
  const isDragging = draggingWidth !== null
  const slotPane = peekable && (
    <div
      key="slot"
      onMouseEnter={cancelGrace}
      onMouseLeave={scheduleClose}
      role="region"
      aria-label={`Side panel — ${TD_SIDE_SLOT_LABELS[state.sideSlot]}`}
      style={{
        flex:       "0 0 auto",
        width:      peekOpen ? panelWidth : 0,
        height:     "100%",
        overflow:   "hidden",
        background: VANTARY.ink ?? VANTARY.paper,
        borderLeft:  !isLeft && peekOpen ? `1px solid ${VANTARY.amberHalo}` : "none",
        borderRight:  isLeft && peekOpen ? `1px solid ${VANTARY.amberHalo}` : "none",
        boxShadow:  peekOpen
          ? (isLeft
              ? `4px 0 24px rgba(0,0,0,0.28)`
              : `-4px 0 24px rgba(0,0,0,0.28)`)
          : "none",
        transition: isDragging
          ? "none"
          : "width 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.24s, border-color 0.24s",
        // Important: when width is 0 we still let the inner content
        // sit at the full panel width but it gets clipped — this
        // way the panel "slides" out of view rather than re-flows
        // its content as it shrinks.
        position:   "relative",
      }}
    >
      <div
        style={{
          width:    panelWidth,
          height:   "100%",
          display:  "flex",
          flexDirection: "column",
          // Slide content inward as the panel opens. Combined with
          // the parent's width animation this gives a smooth
          // "drawer slides in and pushes the chart" feel.
          transform:  peekOpen ? "translateX(0)" : `translateX(${isLeft ? -16 : 16}px)`,
          opacity:    peekOpen ? 1 : 0,
          transition: isDragging
            ? "none"
            : "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease",
        }}
      >
        {/* Panel header with PIN button */}
        <header
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: `1px solid ${VANTARY.rule}`, flexShrink: 0 }}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.amber, fontWeight: 500 }}
          >
            PEEK · {TD_SIDE_SLOT_LABELS[state.sideSlot]}
          </span>
          <span aria-hidden style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => { actions.pinPeek(); setPeekOpen(false) }}
            aria-label="Pin panel — promote to split layout"
            title="Pin · open as split"
            className="flex items-center gap-1 font-mono uppercase"
            style={{
              padding:       "3px 7px",
              fontSize:      9,
              letterSpacing: "0.18em",
              color:         VANTARY.amber,
              background:    VANTARY.amberWash,
              border:        `1px solid ${VANTARY.amberHalo}`,
              borderRadius:  2,
              cursor:        "pointer",
            }}
          >
            <Pin size={10} strokeWidth={1.6} />
            PIN
          </button>
        </header>

        {/* Panel body — renders the active slot module */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <SideSlot
            customSlotContent={customSlotContent}
            liveEquityContent={liveEquityContent}
            activeWindowsContent={activeWindowsContent}
          />
        </div>
      </div>
    </div>
  )

  /* ── Edge hover zone ────────────────────────────────────────────
   *  Floats inside the bay (NOT in the flex flow) so it doesn't
   *  consume any layout width. When peek is closed, hovering this
   *  zone opens the panel. When peek is open, the zone shifts
   *  inward by the panel width so it stays at the chart's slot edge
   *  (NOT past the panel).
   *
   *  No visible chrome. Just an invisible catch zone + a tiny tab
   *  pill at chart-mid-height as the visible affordance.
   * ────────────────────────────────────────────────────────────── */
  const edgeOffset = peekOpen ? panelWidth : 0

  return (
    <div
      ref={containerRef}
      className="flex"
      style={{
        height:       heightPx,
        background:   VANTARY.ink ?? VANTARY.paper,
        flexDirection: isLeft ? "row-reverse" : "row",
        position:     "relative",
        overflow:     "hidden",
      }}
    >
      {chartPane}
      {slotPane}

      {/* ── PANEL RESIZE HANDLE ─────────────────────────────────
       *  Floats inside the bay (absolute positioning) at the
       *  panel's chart-side edge. The trader grabs this and drags
       *  to grow or shrink the panel; TradingView re-flows live
       *  because it shares a flex row with the panel. Only shown
       *  while the panel is open.
       *
       *  We use absolute positioning (rather than a flex sibling
       *  between chart and panel) because the panel itself
       *  animates from width 0 to width=panelWidth, and a
       *  flex-sibling handle would either always be visible (when
       *  panel is closed) or fight the slide animation. Absolute
       *  positioning lets the handle hide cleanly while peek is
       *  closed and snap into place at exactly the seam.
       * ───────────────────────────────────────────────────────── */}
      {peekable && peekOpen && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize side panel"
          aria-valuenow={Math.round(panelWidth)}
          aria-valuemin={TD_PEEK_PANEL_MIN_WIDTH}
          aria-valuemax={TD_PEEK_PANEL_MAX_WIDTH}
          tabIndex={0}
          onPointerDown={onResizePointerDown}
          onKeyDown={onResizeKeyDown}
          onMouseEnter={cancelGrace}
          onMouseLeave={scheduleClose}
          className="flex items-center justify-center"
          style={{
            position:   "absolute",
            top:        0,
            bottom:     0,
            // Sits exactly at the panel's chart-side edge. Centered
            // on the seam (translate by half its width) so the visual
            // grip line aligns with the panel border.
            [isLeft ? "left" : "right"]: panelWidth - 4,
            width:      8,
            cursor:     "col-resize",
            background: isDragging ? VANTARY.amberWash : "transparent",
            zIndex:     11,
            userSelect: "none",
            touchAction: "none",
            transition: isDragging
              ? "none"
              : `${isLeft ? "left" : "right"} 0.28s cubic-bezier(0.4, 0, 0.2, 1), background 0.18s`,
          }}
          onMouseOver={e => {
            if (!isDragging) (e.currentTarget as HTMLElement).style.background = VANTARY.rule
          }}
          onMouseOut={e => {
            if (!isDragging) (e.currentTarget as HTMLElement).style.background = "transparent"
          }}
        >
          <GripVertical
            size={12}
            color={isDragging ? VANTARY.amber : VANTARY.ashSoft}
            style={{ opacity: isDragging ? 1 : 0.7, transition: "color 0.18s, opacity 0.18s" }}
          />
        </div>
      )}

      {/* Edge zone — only when peek is enabled */}
      {peekable && (
        <>
          {/* (1) Invisible 32px catch zone */}
          <div
            aria-hidden
            onMouseEnter={() => { cancelGrace(); setPeekOpen(true) }}
            onMouseLeave={scheduleClose}
            style={{
              position: "absolute",
              top:      0,
              bottom:   0,
              [isLeft ? "left" : "right"]: edgeOffset,
              width:    32,
              background:    "transparent",
              cursor:        "pointer",
              zIndex:        8,
              pointerEvents: "auto",
              transition:    `${isLeft ? "left" : "right"} 0.28s cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          />

          {/* (2) Visible tab pill — the affordance */}
          <button
            type="button"
            aria-label={`${peekOpen ? "Close" : "Open"} ${TD_SIDE_SLOT_LABELS[state.sideSlot]} panel`}
            title={`Hover edge or click to peek · ${TD_SIDE_SLOT_LABELS[state.sideSlot]}`}
            onMouseEnter={() => { cancelGrace(); setPeekOpen(true) }}
            onMouseLeave={scheduleClose}
            onClick={() => { cancelGrace(); setPeekOpen(o => !o) }}
            style={{
              position: "absolute",
              top:      "50%",
              [isLeft ? "left" : "right"]: edgeOffset,
              transform: "translateY(-50%)",
              height:   54,
              width:    14,
              padding:  0,
              border:   `1px solid ${peekOpen ? VANTARY.amberHalo : VANTARY.rule}`,
              [`border${isLeft ? "Left" : "Right"}`]: "none",
              borderTopLeftRadius:     isLeft ? 0 : 6,
              borderBottomLeftRadius:  isLeft ? 0 : 6,
              borderTopRightRadius:    isLeft ? 6 : 0,
              borderBottomRightRadius: isLeft ? 6 : 0,
              background: peekOpen ? VANTARY.amberWash : VANTARY.paper,
              cursor:   "pointer",
              display:  "flex",
              alignItems:     "center",
              justifyContent: "center",
              zIndex:   9,
              boxShadow: peekOpen
                ? `0 0 0 1px ${VANTARY.amberHalo}, 0 4px 16px rgba(0,0,0,0.35)`
                : `0 2px 8px rgba(0,0,0,0.18)`,
              transition: `${isLeft ? "left" : "right"} 0.28s cubic-bezier(0.4, 0, 0.2, 1), background 0.18s, border-color 0.18s, box-shadow 0.18s`,
            }}
          >
            <svg
              width="6" height="10" viewBox="0 0 6 10"
              fill="none" stroke={peekOpen ? VANTARY.amber : VANTARY.ashSoft} strokeWidth={1.6}
              style={{
                transform: `rotate(${
                  (isLeft ? (peekOpen ? 180 : 0) : (peekOpen ? 0 : 180))
                }deg)`,
                transition: "transform 0.22s, stroke 0.18s",
              }}
            >
              <polyline points="5,1 1,5 5,9" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

/* ─── 5.  MINIMIZED STRIP ──────────────────────────────────────────── */

function MinimizedStrip() {
  const { actions } = useTradingDesk()
  return (
    <button
      type="button"
      onClick={actions.expand}
      aria-label="Expand trading desk"
      className="flex items-center gap-3 w-full"
      style={{
        height:     TD_HEIGHTS.minimized,
        padding:    "0 14px",
        background: VANTARY.ink ?? VANTARY.paper,
        border:     "none",
        cursor:     "pointer",
        textAlign:  "left",
      }}
    >
      <MiniTicker />
      <span
        className="font-mono uppercase whitespace-nowrap shrink-0"
        style={{
          padding:       "3px 8px",
          fontSize:      9.5,
          letterSpacing: "0.22em",
          color:         VANTARY.amber,
          background:    VANTARY.amberWash,
          border:        `1px solid ${VANTARY.amberHalo}`,
          borderRadius:  2,
        }}
      >
        EXPAND
      </span>
    </button>
  )
}

/* ─── 6.  THE SHELL ──────────────────��─────────────────────────────── */

export interface TradingDeskShellProps {
  /** When true, the shell breaks out of its centered editorial parent
   *  to span all the way to the viewport edges using negative margins.
   *  Default: true. */
  fullBleed?: boolean
  /** Optional className applied to the outermost wrapper. */
  className?: string
  /** Render-prop override for the LIVE EQUITY VOLUME side-slot variant.
   *  When provided, the slot renders this node instead of the built-in
   *  mock mini. Used by <TradingDeskBay/> to plug in the real
   *  <EquityVolumeInline/> from your-space.tsx. */
  liveEquityContent?: ReactNode
  /** Render-prop override for the ACTIVE WINDOWS side-slot variant.
   *  Used by <TradingDeskBay/> to plug in the real <SessionsCompactStage/>
   *  from your-space.tsx. */
  activeWindowsContent?: ReactNode
}

/* ─── The shell wrapped in the hoisted execution-draft providers. The
 *  account + trade-draft state now lives ABOVE the rail so the always-visible
 *  Fast Entry bottom bar shares ONE draft with the console. Must sit inside
 *  TradingDeskProvider (already true — TradingDeskBay wraps this), since the
 *  draft provider mirrors the chart symbol via useTradingDesk(). */
export function TradingDeskShell(props: TradingDeskShellProps) {
  return (
    <ExecutionShellProvider>
      <TradingDeskShellInner {...props} />
    </ExecutionShellProvider>
  )
}

function TradingDeskShellInner({
  fullBleed = true,
  className,
  liveEquityContent,
  activeWindowsContent,
}: TradingDeskShellProps) {
  const { state } = useTradingDesk()

  /* Visible chart-area height — viewport-aware so the bay's chart pane
   *  fills the user's screen exactly the way the signal-terminal page
   *  does (vh − ~110px header on /copilot). With TD_VIEWPORT_PADDING
   *  set to 160, this lands the chart visibly at "full viewport minus
   *  navigator chrome" on any normal desktop monitor. */
  const visibleHeight = useViewportBayHeight(state.layout, state.isFullscreen)

  // The bay's header is now the SignalNavigator (a port of
  // signal-terminal-header.tsx) — 2 rows: title row (~50px) + control
  // panel row (~58px) + 1px border = ~110px total. Footer is the
  // legacy hairline strip (~28px including padding & border).
  const headerH = 110
  const footerH = 28
  const bayHeight =
    state.layout === "minimized" && !state.isFullscreen
      ? TD_HEIGHTS.minimized
      : visibleHeight + headerH + footerH

  const fullBleedStyle: CSSProperties = fullBleed
    ? {
        // The classic edge-to-edge breakout from a centered max-width
        // parent: shift left half-the-extra-viewport, right same.
        marginLeft:  "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }
    : {}

  /* Fullscreen overrides — render as a fixed overlay above everything. */
  if (state.isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0"
        style={{
          background: VANTARY.ink ?? VANTARY.paper,
          zIndex:     90,
          display:    "flex",
          flexDirection: "column",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Trading desk fullscreen"
      >
        <HeaderStrip />
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          {/* In fullscreen we always show the chart — the side slot is
              hidden because the trader explicitly asked for max chart. */}
          <TradingViewEmbed />
        </div>
        <FastEntryBar />
        <FooterStrip />
      </motion.div>
    )
  }

  return (
    <section
      data-vantary-anchor="trading-desk"
      data-trading-desk-layout={state.layout}
      aria-label="Trading desk"
      className={className}
      style={{
        ...fullBleedStyle,
        // Hairline frame
        borderTop:    `1px solid ${VANTARY.rule}`,
        borderBottom: `1px solid ${VANTARY.rule}`,
        background:   VANTARY.ink ?? VANTARY.paper,
        // Smooth height transitions when toggling layout modes
        position:     "relative",
        overflow:     "hidden",
      }}
    >
      <motion.div
        layout
        animate={{ height: bayHeight }}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state.layout === "minimized" ? (
            <motion.div
              key="td-min"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MinimizedStrip />
              <FastEntryBar collapsed />
            </motion.div>
          ) : (
            <motion.div
              key="td-open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
            >
              <HeaderStrip />
              <ShellBody
                heightPx={visibleHeight}
                liveEquityContent={liveEquityContent}
                activeWindowsContent={activeWindowsContent}
              />
              <FastEntryBar />
              <FooterStrip />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
