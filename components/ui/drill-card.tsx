"use client"

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  DrillCard — universal interactive card wrapper (Project 2 · Task 3)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  The platform's universal interactive surface. Wrap any clickable or
 *  hover-able element (card, row, tile, chip, account, watchlist row, etc.)
 *  in <DrillCard> and it inherits the entire Interaction Vocabulary:
 *
 *    • Six states     — resting · hover · long-hover · pressed · selected · disabled
 *    • Three types    — preview · navigate · action  (and compounds of them)
 *    • Affordance     — corner glyph indicating *what* the interaction does
 *    • Micro-tooltip  — long-hover (≥600ms) reveals a one-line "what this does"
 *    • Async feedback — loading · success · error transient states
 *    • Cross-highlight— same `crossKey` across multiple cards = synced tint
 *    • Keyboard       — Enter/Space activate, Escape dismisses selection
 *    • A11y           — proper role, aria-pressed/expanded/disabled, focus ring
 *    • Category tint  — forex · indices · crypto · commodities · macro · …
 *
 *  Built with pure CSS animations for performance (no framer-motion required),
 *  composable sub-components, and a composition path that auto-wires the
 *  <HoverPreviewPopover> when you pass a `preview` prop.
 *
 *  ───────────────────────────────────────────────────────────────────────────
 *  Quick reference — the four most common patterns
 *  ───────────────────────────────────────────────────────────────────────────
 *
 *  1. NAVIGATE-ONLY (click takes you somewhere)
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  <DrillCard                                                         │
 *  │    interaction="navigate"                                           │
 *  │    category="forex"                                                 │
 *  │    tooltip="Open EUR/USD chart with MTF context"                    │
 *  │    onClick={() => router.push("/chart/EURUSD")}                     │
 *  │  >                                                                  │
 *  │    <DrillCard.Title>EUR/USD</DrillCard.Title>                       │
 *  │    <DrillCard.Stat value="+18 pips" tone="positive" />              │
 *  │  </DrillCard>                                                       │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  2. PREVIEW-ONLY (hover expands a side-popover)
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  <DrillCard                                                         │
 *  │    interaction="preview"                                            │
 *  │    category="forex"                                                 │
 *  │    preview={                                                        │
 *  │      <>                                                             │
 *  │        <HoverPreviewPopover.Header subject="EURUSD" value="74%" />  │
 *  │        <HoverPreviewPopover.Body>...</HoverPreviewPopover.Body>     │
 *  │      </>                                                            │
 *  │    }                                                                │
 *  │  >                                                                  │
 *  │    EUR/USD · 74%                                                    │
 *  │  </DrillCard>                                                       │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  3. PREVIEW + NAVIGATE (the most common compound)
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  <DrillCard                                                         │
 *  │    interaction="preview-navigate"                                   │
 *  │    category="focus"                                                 │
 *  │    crossKey="EURUSD"   // syncs with all other EURUSD cards         │
 *  │    preview={...}                                                    │
 *  │    onClick={() => router.push("/chart/EURUSD")}                     │
 *  │  >                                                                  │
 *  │    EUR/USD · 74%                                                    │
 *  │  </DrillCard>                                                       │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  4. ACTION (click executes something async)
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  <DrillCard                                                         │
 *  │    interaction="action"                                             │
 *  │    affordance="execute"                                             │
 *  │    category="focus"                                                 │
 *  │    loading={isExecuting}                                            │
 *  │    success={lastResult === "ok"}                                    │
 *  │    onClick={async () => { setLoading(true); await trade(); … }}    │
 *  │  >                                                                  │
 *  │    Execute trade                                                    │
 *  │  </DrillCard>                                                       │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ───────────────────────────────────────────────────────────────────────────
 *  Cross-highlight (the platform-wide sync layer)
 *  ───────────────────────────────────────────────────────────────────────────
 *
 *  Wrap any region of the app in <DrillCardCrossHighlightProvider> and any
 *  card inside it that shares the same `crossKey` will tint together when
 *  one of them is hovered. Selecting one selects them all.
 *
 *      <DrillCardCrossHighlightProvider>
 *        <DrillCard crossKey="EURUSD">…</DrillCard>     // status strip
 *        <DrillCard crossKey="EURUSD">…</DrillCard>     // watchlist row
 *        <DrillCard crossKey="EURUSD">…</DrillCard>     // narrative claim
 *      </DrillCardCrossHighlightProvider>
 *
 *  If no provider is mounted, cross-highlight gracefully no-ops.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  HoverPreviewPopover,
  type HoverPreviewCategory,
} from "@/components/ui/hover-preview-popover"

/* ═══════════════════════════════════════════════════════════════════════════
 *  Tokens & types
 * ══════════════════════════════════════════════════════════════════════════ */

export type DrillInteraction =
  | "none"
  | "preview"
  | "navigate"
  | "external"
  | "action"
  | "preview-navigate"
  | "preview-action"

export type DrillAffordance =
  | "auto"
  | "preview"
  | "navigate"
  | "external"
  | "save"
  | "execute"
  | "confirm"
  | "close"
  | "delete"
  | "shortcut"
  | "live"
  | "idle"
  | "alert"
  | "none"

export type DrillDensity = "compact" | "default" | "rich"

export type DrillTone =
  | "default"
  | "positive"
  | "negative"
  | "warn"
  | "muted"
  | "accent"

const CATEGORY_RGB: Record<HoverPreviewCategory, string> = {
  neutral: "255, 255, 255",
  forex: "59, 130, 246",
  indices: "6, 182, 212",
  crypto: "245, 158, 11",
  commodities: "16, 185, 129",
  macro: "239, 68, 68",
  focus: "6, 182, 212",
  session: "34, 197, 94",
  alert: "251, 146, 60",
}

const AFFORDANCE_GLYPH: Record<DrillAffordance, string> = {
  auto: "",
  preview: "+",
  navigate: "→",
  external: "↗",
  save: "↓",
  execute: "▶",
  confirm: "✓",
  close: "×",
  delete: "×",
  shortcut: "⌥",
  live: "●",
  idle: "◌",
  alert: "!",
  none: "",
}

const TONE_COLOR: Record<DrillTone, string> = {
  default: "rgba(255, 255, 255, 0.92)",
  positive: "rgba(52, 211, 153, 0.95)",
  negative: "rgba(244, 114, 114, 0.95)",
  warn: "rgba(251, 191, 36, 0.95)",
  muted: "rgba(255, 255, 255, 0.50)",
  accent: "", // resolved at render time from category
}

const DENSITY_PADDING: Record<DrillDensity, string> = {
  compact: "px-2.5 py-1.5",
  default: "px-3.5 py-3",
  rich: "px-4 py-4",
}

const DENSITY_RADIUS: Record<DrillDensity, string> = {
  compact: "rounded-[10px]",
  default: "rounded-[12px]",
  rich: "rounded-[14px]",
}

/** Long-hover threshold — also matches Vocabulary §STATE 3 */
const LONG_HOVER_MS = 600

/** Async-feedback hold durations */
const SUCCESS_FEEDBACK_MS = 1200
const ERROR_FEEDBACK_MS = 2000

/* ═══════════════════════════════════════════════════════════════════════════
 *  Cross-highlight context  (platform-wide hover sync)
 * ══════════════════════════════════════════════════════════════════════════ */

interface CrossHighlightStore {
  /** The single primary key being hovered (set by the card directly under the cursor). */
  hoveredKey: string | null
  /**
   * Secondary keys broadcast by the currently-hovered card. Allows one card
   * (e.g. a macro event affecting EUR/USD + GBP/USD) to light up multiple
   * other cards simultaneously across the dashboard.
   */
  broadcastKeys: Set<string>
  /** The currently-selected key (sticky, e.g. a pinned focus). */
  selectedKey: string | null
  setHovered: (key: string | null, broadcast?: string[] | null) => void
  setSelected: (key: string | null) => void
  subscribe: (cb: () => void) => () => void
}

const CrossHighlightContext =
  React.createContext<CrossHighlightStore | null>(null)

/**
 * Mount this anywhere in the tree to enable cross-highlight sync between
 * DrillCards that share a `crossKey`. Without a provider, cross-highlight
 * is silently disabled (cards still work; they just don't sync).
 */
export function DrillCardCrossHighlightProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const subscribersRef = React.useRef(new Set<() => void>())
  const stateRef = React.useRef<{
    hoveredKey: string | null
    broadcastKeys: Set<string>
    selectedKey: string | null
  }>({ hoveredKey: null, broadcastKeys: new Set(), selectedKey: null })

  const notify = React.useCallback(() => {
    subscribersRef.current.forEach((cb) => cb())
  }, [])

  const store = React.useMemo<CrossHighlightStore>(
    () => ({
      get hoveredKey() {
        return stateRef.current.hoveredKey
      },
      get broadcastKeys() {
        return stateRef.current.broadcastKeys
      },
      get selectedKey() {
        return stateRef.current.selectedKey
      },
      setHovered: (key, broadcast) => {
        const nextBroadcast = broadcast && broadcast.length ? new Set(broadcast) : new Set<string>()
        const sameKey = stateRef.current.hoveredKey === key
        const sameBroadcast =
          stateRef.current.broadcastKeys.size === nextBroadcast.size &&
          [...nextBroadcast].every((k) => stateRef.current.broadcastKeys.has(k))
        if (sameKey && sameBroadcast) return
        stateRef.current.hoveredKey = key
        stateRef.current.broadcastKeys = nextBroadcast
        notify()
      },
      setSelected: (key) => {
        if (stateRef.current.selectedKey === key) return
        stateRef.current.selectedKey = key
        notify()
      },
      subscribe: (cb) => {
        subscribersRef.current.add(cb)
        return () => {
          subscribersRef.current.delete(cb)
        }
      },
    }),
    [notify],
  )

  return (
    <CrossHighlightContext.Provider value={store}>
      {children}
    </CrossHighlightContext.Provider>
  )
}

function useCrossHighlight(
  crossKey: string | undefined,
  broadcastKeys?: readonly string[],
) {
  const store = React.useContext(CrossHighlightContext)
  const [, force] = React.useReducer((x: number) => x + 1, 0)

  React.useEffect(() => {
    if (!store) return
    return store.subscribe(force)
  }, [store])

  if (!store || !crossKey) {
    return {
      hovered: false,
      selected: false,
      setHovered: () => {},
      setSelected: () => {},
    }
  }

  // A card "feels hovered" if the cursor is on it OR another card is
  // broadcasting our key as a secondary highlight.
  const hovered =
    store.hoveredKey === crossKey || store.broadcastKeys.has(crossKey)

  return {
    hovered,
    selected: store.selectedKey === crossKey,
    setHovered: (on: boolean) =>
      store.setHovered(
        on ? crossKey : null,
        on && broadcastKeys && broadcastKeys.length ? [...broadcastKeys] : null,
      ),
    setSelected: (on: boolean) => store.setSelected(on ? crossKey : null),
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  DrillCard — root component
 * ══════════════════════════════════════════════════════════════════════════ */

type AsProp = "div" | "button" | "a" | "li" | "article" | "section"

interface DrillCardOwnProps {
  /** Element to render as. Default `"button"` for interactive types, `"div"` otherwise. */
  as?: AsProp

  /** Interaction type — controls the affordance icon and behaviour contract. */
  interaction?: DrillInteraction

  /** Visual category — tints accent rail, selected fill, glow color. */
  category?: HoverPreviewCategory

  /** Override the affordance icon. `"auto"` infers from `interaction`. */
  affordance?: DrillAffordance

  /** Visual density — controls padding and affordance size. */
  density?: DrillDensity

  /** Selected state (controlled). Persistent across renders. */
  selected?: boolean

  /** Selected state (uncontrolled). Toggles on click for `interaction="action"`. */
  defaultSelected?: boolean

  /** Callback when selected state changes (controlled or uncontrolled). */
  onSelectedChange?: (selected: boolean) => void

  /** Disabled state — prevents interaction, dims the card. */
  disabled?: boolean

  /** One-line reason shown on long-hover when disabled. */
  disabledReason?: string

  /**
   * Long-hover (≥600ms) micro-tooltip. Should describe what the interaction
   * *does*, not what the card *is*. Skipped if `preview` is provided
   * (the popover is the equivalent affordance).
   */
  tooltip?: string

  /** Override the long-hover threshold. Default 600ms. */
  tooltipDelay?: number

  /**
   * Side-popover content (used when `interaction` includes "preview").
   * Compose with HoverPreviewPopover sub-components:
   *   <><HoverPreviewPopover.Header /><HoverPreviewPopover.Body /></>
   */
  preview?: React.ReactNode

  /** Side of the trigger to render the popover. Default `"right"`. */
  previewSide?: "right" | "left" | "top" | "bottom"

  /** Custom width for the popover. Default 320. */
  previewWidth?: number | string

  /** Cross-highlight key — same key on multiple cards = synced hover/selected. */
  crossKey?: string

  /**
   * Secondary cross-keys that should also light up while THIS card is hovered.
   * Use for broadcasting effects:
   *   • a macro event row broadcasting `pair:EUR/USD`, `pair:GBP/USD`
   *   • a session puck broadcasting `pair:EUR/USD`, `pair:GBP/USD`
   *   • an account card broadcasting `strategy:fvg`
   *
   * The current card's `crossKey` is set as the *primary* hovered key (so its
   * own selected state gets first dibs); these are added to the broadcast Set
   * so any card with a matching `crossKey` reads back as `hovered = true`.
   */
  broadcastKeys?: readonly string[]

  /** Async loading state — replaces affordance icon with a spinner. */
  loading?: boolean

  /** Transient success state — flashes green pulse + checkmark for 1.2s. */
  success?: boolean

  /** Transient error state — flashes red pulse + ! for 2s. */
  error?: boolean

  /** Hover/selected behaviour intensity. `"subtle"` for dense grids; `"prominent"` for hero cards. */
  intent?: "subtle" | "default" | "prominent"

  /** Auto-fit width to content. Default `false` (block-level). */
  inline?: boolean

  /** Override the click handler — fired after async-feedback handling. */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>

  /** Override the keyboard handler. */
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void

  /** Hover callbacks (broadcast through cross-highlight). */
  onHoverChange?: (hovered: boolean) => void

  /** Override the focus ring color. */
  focusRingColor?: string

  /** Standard className. Merged with internal classes. */
  className?: string

  /** Extra style overrides. Merged with internal styles. */
  style?: React.CSSProperties

  /** Children — the visible card content. */
  children?: React.ReactNode

  /** Optional anchor href when `as="a"`. */
  href?: string

  /** Optional anchor target when `as="a"`. */
  target?: string

  /** Optional anchor rel when `as="a"`. */
  rel?: string
}

type DrillCardProps = DrillCardOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof DrillCardOwnProps | "onClick">

/* ─────────────────────────────────────────────────────────────────────────
 *  Helpers
 * ──────────────────────────────────────────────────────────────────────── */

function inferAffordance(
  interaction: DrillInteraction,
  override: DrillAffordance,
): DrillAffordance {
  if (override !== "auto") return override
  switch (interaction) {
    case "preview":
      return "preview"
    case "navigate":
      return "navigate"
    case "external":
      return "external"
    case "action":
      return "execute"
    case "preview-navigate":
      return "navigate" // primary glyph; popover gives the secondary
    case "preview-action":
      return "execute"
    case "none":
    default:
      return "none"
  }
}

function isInteractive(interaction: DrillInteraction): boolean {
  return interaction !== "none"
}

function hasPreview(interaction: DrillInteraction): boolean {
  return (
    interaction === "preview" ||
    interaction === "preview-navigate" ||
    interaction === "preview-action"
  )
}

function hasClickAction(interaction: DrillInteraction): boolean {
  return (
    interaction === "navigate" ||
    interaction === "external" ||
    interaction === "action" ||
    interaction === "preview-navigate" ||
    interaction === "preview-action"
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Render
 * ══════════════════════════════════════════════════════════════════════════ */

const DrillCardImpl = React.forwardRef<HTMLElement, DrillCardProps>(
  function DrillCard(
    {
      as,
      interaction = "none",
      category = "neutral",
      affordance: affordanceProp = "auto",
      density = "default",
      selected: selectedProp,
      defaultSelected,
      onSelectedChange,
      disabled = false,
      disabledReason,
      tooltip,
      tooltipDelay = LONG_HOVER_MS,
      preview,
  previewSide = "right",
  previewWidth = 320,
  crossKey,
  broadcastKeys,
  loading = false,
  success = false,
      error = false,
      intent = "default",
      inline = false,
      onClick,
      onKeyDown,
      onHoverChange,
      focusRingColor,
      className,
      style,
      children,
      href,
      target,
      rel,
      ...rest
    },
    ref,
  ) {
    /* ── Resolved values ───────────────────────────────────────────────── */

    const interactiveProp = isInteractive(interaction)
    const showsPreview =
      hasPreview(interaction) && preview != null && !disabled
    const clickable = hasClickAction(interaction) && !disabled
    const affordance = inferAffordance(interaction, affordanceProp)
    const rgb = CATEGORY_RGB[category]
    const isCategorical = category !== "neutral"

    /* ── Selected state (controlled vs uncontrolled) ───────────────────── */

    const isControlled = selectedProp !== undefined
    const [uncontrolledSelected, setUncontrolledSelected] = React.useState(
      defaultSelected ?? false,
    )
    const selected = isControlled
      ? !!selectedProp
      : uncontrolledSelected

    const updateSelected = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledSelected(next)
        onSelectedChange?.(next)
      },
      [isControlled, onSelectedChange],
    )

  /* ── Cross-highlight ───────────────────────────────────────────────── */

  const cross = useCrossHighlight(crossKey, broadcastKeys)
    const crossHovered = cross.hovered
    const crossSelected = cross.selected
    const visualSelected = selected || crossSelected

    /* ── Hover (manual tracking for tooltip + cross-highlight) ─────────── */

    const [hovered, setHovered] = React.useState(false)
    const [longHovered, setLongHovered] = React.useState(false)
    const longHoverTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    )

    const handlePointerEnter = React.useCallback(() => {
      if (disabled && !disabledReason) return
      setHovered(true)
      onHoverChange?.(true)
      cross.setHovered(true)

      if (tooltip || (disabled && disabledReason)) {
        longHoverTimer.current = setTimeout(() => {
          setLongHovered(true)
        }, tooltipDelay)
      }
    }, [disabled, disabledReason, tooltip, tooltipDelay, onHoverChange, cross])

    const handlePointerLeave = React.useCallback(() => {
      setHovered(false)
      setLongHovered(false)
      onHoverChange?.(false)
      cross.setHovered(false)

      if (longHoverTimer.current) {
        clearTimeout(longHoverTimer.current)
        longHoverTimer.current = null
      }
    }, [onHoverChange, cross])

    React.useEffect(() => {
      return () => {
        if (longHoverTimer.current) clearTimeout(longHoverTimer.current)
      }
    }, [])

    /* ── Async feedback (success/error transient) ──────────────────────── */

    const [transientSuccess, setTransientSuccess] = React.useState(false)
    const [transientError, setTransientError] = React.useState(false)
    const successTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const errorTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
      if (success) {
        setTransientSuccess(true)
        if (successTimer.current) clearTimeout(successTimer.current)
        successTimer.current = setTimeout(
          () => setTransientSuccess(false),
          SUCCESS_FEEDBACK_MS,
        )
      }
    }, [success])

    React.useEffect(() => {
      if (error) {
        setTransientError(true)
        if (errorTimer.current) clearTimeout(errorTimer.current)
        errorTimer.current = setTimeout(
          () => setTransientError(false),
          ERROR_FEEDBACK_MS,
        )
      }
    }, [error])

    React.useEffect(() => {
      return () => {
        if (successTimer.current) clearTimeout(successTimer.current)
        if (errorTimer.current) clearTimeout(errorTimer.current)
      }
    }, [])

    /* ── Click handler ─────────────────────────────────────────────────── */

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        if (disabled || loading) {
          e.preventDefault()
          return
        }

        // Action interactions toggle selected state by default (uncontrolled);
        // navigate interactions don't (they're transient).
        if (interaction === "action" && !isControlled) {
          updateSelected(!selected)
        } else if (
          (interaction === "navigate" ||
            interaction === "preview-navigate") &&
          crossKey
        ) {
          // Pin selection across cross-highlight group on navigate too.
          cross.setSelected(true)
        }

        onClick?.(e)
      },
      [
        disabled,
        loading,
        interaction,
        isControlled,
        selected,
        updateSelected,
        crossKey,
        cross,
        onClick,
      ],
    )

    /* ── Keyboard handler ──────────────────────────────────────────────── */

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLElement>) => {
        if (clickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          handleClick(e as unknown as React.MouseEvent<HTMLElement>)
        }
        if (e.key === "Escape" && selected && !isControlled) {
          updateSelected(false)
          cross.setSelected(false)
        }
        onKeyDown?.(e)
      },
      [
        clickable,
        selected,
        isControlled,
        handleClick,
        updateSelected,
        cross,
        onKeyDown,
      ],
    )

    /* ── Element tag resolution ────────────────────────────────────────── */

    const Tag: AsProp =
      as ??
      (clickable
        ? interaction === "external" || (interaction === "navigate" && href)
          ? "a"
          : "button"
        : "div")

    /* ── Visual modifiers ──────────────────────────────────────────────── */

    const lift =
      intent === "subtle" ? 0.5 : intent === "prominent" ? 2 : 1
    const liftSelected =
      intent === "subtle" ? 1 : intent === "prominent" ? 3 : 2

    const ringRgb = focusRingColor
      ? focusRingColor
      : isCategorical
        ? rgb
        : "6, 182, 212"

    /* ── The card body ─────────────────────────────────────────────────── */

    const cardBody = (
      <Tag
        ref={ref as React.Ref<HTMLElement>}
        // ── A11y wiring ────────────────────────────────────────────────
        role={
          Tag === "div" || Tag === "section" || Tag === "article"
            ? clickable
              ? "button"
              : undefined
            : undefined
        }
        tabIndex={clickable && Tag === "div" ? 0 : undefined}
        aria-pressed={
          interaction === "action" && interactiveProp ? selected : undefined
        }
        aria-expanded={
          showsPreview ? hovered || longHovered : undefined
        }
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
        // anchor passthrough
        href={Tag === "a" ? href : undefined}
        target={Tag === "a" ? target : undefined}
        rel={
          Tag === "a"
            ? rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)
            : undefined
        }
        // ── Class system ───────────────────────────────────────────────
        className={cn(
          // Base layout
          "relative isolate group/drill",
          inline ? "inline-flex" : "flex",
          "flex-col text-left",
          DENSITY_PADDING[density],
          DENSITY_RADIUS[density],
          // Reset native button styling
          Tag === "button" || Tag === "a"
            ? "appearance-none border-0 m-0 bg-transparent text-inherit font-inherit"
            : "",
          // Cursor
          disabled
            ? "cursor-not-allowed"
            : clickable
              ? "cursor-pointer"
              : interactiveProp
                ? "cursor-default"
                : "",
          // Focus-visible ring (keyboard only)
          clickable
            ? "focus-visible:outline-none focus-visible:ring-2"
            : "",
          // Smooth transitions
          "transition-[transform,box-shadow,border-color,background-color]",
          // Enter / exit timing per Vocabulary §TIMING LADDER
          "duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          // Hover lift (uses CSS var below)
          interactiveProp && !disabled
            ? "hover:[transform:translateY(calc(var(--drill-lift,0px)*-1))]"
            : "",
          // Pressed state (active) — fast 120ms scale-down
          clickable
            ? "active:scale-[0.985] active:duration-[120ms] active:ease-[cubic-bezier(0.4,0,0.2,1)]"
            : "",
          className,
        )}
        // ── Style system (CSS variables drive states from one source) ─
        style={{
          // CSS variable lift values
          ["--drill-lift" as string]: visualSelected
            ? `${liftSelected}px`
            : `${lift}px`,
          // Background
          background: visualSelected
            ? `linear-gradient(180deg, rgba(${rgb}, 0.07) 0%, rgba(${rgb}, 0.04) 100%), rgba(13, 14, 18, 0.72)`
            : crossHovered
              // Cross-highlight tint — visible enough to register peripherally
              // but quiet enough to avoid stealing attention from the cursor.
              ? `linear-gradient(180deg, rgba(${rgb}, 0.06) 0%, rgba(${rgb}, 0.025) 100%), rgba(13, 14, 18, 0.62)`
              : "rgba(13, 14, 18, 0.6)",
          // Border — borrows a faint category tint when cross-highlighted so
          // the broadcast effect reads instantly without any motion.
          border: visualSelected
            ? `1px solid rgba(${rgb}, 0.18)`
            : crossHovered
              ? `1px solid rgba(${rgb}, 0.14)`
              : "1px solid rgba(255, 255, 255, 0.045)",
          // Multi-layer shadow stack
          boxShadow: [
            // Base inset highlights (always)
            "inset 0 1px 0 rgba(255, 255, 255, 0.035)",
            "inset 0 -1px 0 rgba(0, 0, 0, 0.35)",
            // Selected: persistent category-tinted glow + accent inner highlight
            visualSelected
              ? `inset 0 1px 0 rgba(${rgb}, 0.14), 0 12px 32px -12px rgba(${rgb}, 0.28), 0 4px 12px -6px rgba(0, 0, 0, 0.45)`
              // Cross-hover: subtle category-tinted halo so the broadcast
              // effect is visible peripherally even when the cursor is
              // far from this card.
              : crossHovered
                ? `inset 0 1px 0 rgba(${rgb}, 0.10), 0 6px 18px -8px rgba(${rgb}, 0.22), 0 2px 6px -2px rgba(0, 0, 0, 0.40)`
                : // Resting: minimal drop, inflates on hover via CSS hover state
                  "0 1px 2px -1px rgba(0, 0, 0, 0.35)",
            // Async feedback overrides
            transientSuccess
              ? "0 0 0 1px rgba(52, 211, 153, 0.45), 0 0 24px -4px rgba(52, 211, 153, 0.35)"
              : "",
            transientError
              ? "0 0 0 1px rgba(244, 114, 114, 0.50), 0 0 24px -4px rgba(244, 114, 114, 0.40)"
              : "",
          ]
            .filter(Boolean)
            .join(", "),
          // Disabled dim
          opacity: disabled ? 0.42 : 1,
          // Focus ring color (only used when keyboard-focused)
          ["--tw-ring-color" as string]: `rgba(${ringRgb}, 0.42)`,
          ...style,
        }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={clickable ? handleClick : undefined}
        onKeyDown={interactiveProp ? handleKeyDown : undefined}
        {...rest}
      >
        {/* ── Hover-only intensification overlay ─────────────────────── */}
        {/*  The "lift" is on the root; the bright tint + border-shimmer is on
            an absolutely-positioned overlay so we can fade them independently. */}
        {interactiveProp && !disabled && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 -z-10",
              DENSITY_RADIUS[density],
              "opacity-0 transition-opacity duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover/drill:opacity-100",
            )}
            style={{
              background: isCategorical
                ? `radial-gradient(ellipse 80% 100% at 50% 0%, rgba(${rgb}, 0.05), transparent 70%)`
                : "linear-gradient(180deg, rgba(255,255,255,0.020) 0%, transparent 100%)",
              boxShadow: isCategorical
                ? `inset 0 1px 0 rgba(${rgb}, 0.12), 0 12px 28px -12px rgba(${rgb}, 0.22), 0 4px 14px -6px rgba(0, 0, 0, 0.45)`
                : "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 12px 28px -12px rgba(0, 0, 0, 0.55), 0 4px 14px -6px rgba(0, 0, 0, 0.45)",
            }}
          />
        )}

        {/* ── Selected accent rail (left edge) ───────────────────────── */}
        {visualSelected && isCategorical && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-[14%] bottom-[14%] w-[2px]"
            style={{
              background: `linear-gradient(180deg, transparent 0%, rgba(${rgb}, 0.78) 50%, transparent 100%)`,
              borderRadius: "2px",
            }}
          />
        )}

        {/* ── Async-success ✓ pulse overlay ──────────────────────────── */}
        {transientSuccess && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0",
              DENSITY_RADIUS[density],
              "animate-in fade-in-0 duration-200",
            )}
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(52, 211, 153, 0.14), transparent 75%)",
            }}
          />
        )}

        {/* ── Async-error ! pulse overlay ────────────────────────────── */}
        {transientError && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0",
              DENSITY_RADIUS[density],
              "animate-in fade-in-0 duration-200",
            )}
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(244, 114, 114, 0.16), transparent 75%)",
            }}
          />
        )}

        {/* ── Card content (children) ────────────────────────────────── */}
        <div className="relative z-10 flex flex-col gap-1 min-w-0">
          {children}
        </div>

        {/* ── Affordance corner glyph ────────────────────────────────── */}
        {affordance !== "none" && AFFORDANCE_GLYPH[affordance] && (
          <AffordanceGlyph
            affordance={affordance}
            loading={loading}
            success={transientSuccess}
            error={transientError}
            density={density}
            isCategorical={isCategorical}
            rgb={rgb}
          />
        )}

        {/* ── Long-hover micro-tooltip ───────────────────────────────── */}
        {longHovered && (tooltip || (disabled && disabledReason)) && (
          <MicroTooltip
            text={disabled && disabledReason ? disabledReason : tooltip!}
          />
        )}
      </Tag>
    )

    /* ── Wrap with HoverPreviewPopover if `preview` provided ───────── */

    if (showsPreview && preview) {
      return (
        <HoverPreviewPopover.Root category={category}>
          <HoverPreviewPopover.Trigger asChild>
            {cardBody}
          </HoverPreviewPopover.Trigger>
          <HoverPreviewPopover.Content
            side={previewSide}
            width={previewWidth}
          >
            {preview}
          </HoverPreviewPopover.Content>
        </HoverPreviewPopover.Root>
      )
    }

    return cardBody
  },
)

/* ═══════════════════════════════════════════════════════════════════════════
 *  AffordanceGlyph — corner icon with state animations
 * ══════════════════════════════════════════════════════════════════════════ */

function AffordanceGlyph({
  affordance,
  loading,
  success,
  error,
  density,
  isCategorical,
  rgb,
}: {
  affordance: DrillAffordance
  loading: boolean
  success: boolean
  error: boolean
  density: DrillDensity
  isCategorical: boolean
  rgb: string
}) {
  const sizeClass =
    density === "compact"
      ? "w-3 h-3 text-[9px]"
      : density === "rich"
        ? "w-4 h-4 text-[11px]"
        : "w-3.5 h-3.5 text-[10px]"

  const positionClass =
    density === "compact"
      ? "top-1.5 right-1.5"
      : density === "rich"
        ? "top-3 right-3"
        : "top-2.5 right-2.5"

  // Live/idle/alert glyphs use category color or semantic color
  let glyphColor: string
  if (success) glyphColor = "rgba(52, 211, 153, 1)"
  else if (error) glyphColor = "rgba(244, 114, 114, 1)"
  else if (affordance === "alert") glyphColor = "rgba(251, 146, 60, 1)"
  else if (affordance === "live") glyphColor = "rgba(34, 197, 94, 1)"
  else if (affordance === "delete" || affordance === "close")
    glyphColor = "rgba(244, 114, 114, 0.85)"
  else if (isCategorical) glyphColor = `rgba(${rgb}, 0.85)`
  else glyphColor = "rgba(255, 255, 255, 0.55)"

  const displayGlyph = loading
    ? ""
    : success
      ? "✓"
      : error
        ? "!"
        : AFFORDANCE_GLYPH[affordance]

  return (
    <span
      aria-hidden
      className={cn(
        "absolute z-10 flex items-center justify-center font-mono leading-none select-none pointer-events-none",
        sizeClass,
        positionClass,
        // Base opacity 25% resting → 60% on hover → 100% selected/feedback
        "opacity-25 transition-[opacity,color,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "group-hover/drill:opacity-70",
        loading || success || error ? "!opacity-100" : "",
        // Subtle nudge on hover for navigate/external glyphs
        affordance === "navigate"
          ? "group-hover/drill:[transform:translateX(1px)]"
          : "",
        affordance === "external"
          ? "group-hover/drill:[transform:translate(1px,-1px)]"
          : "",
      )}
      style={{ color: glyphColor }}
    >
      {loading ? (
        <span
          className="inline-block rounded-full border-[1.5px] animate-spin"
          style={{
            width: "70%",
            height: "70%",
            borderColor: `rgba(${rgb}, 0.25)`,
            borderTopColor: `rgba(${rgb}, 0.95)`,
          }}
        />
      ) : (
        displayGlyph
      )}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  MicroTooltip — long-hover one-liner
 * ══════════════════════════════════════════════════════════════════════════ */

function MicroTooltip({ text }: { text: string }) {
  return (
    <span
      role="tooltip"
      className={cn(
        "absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-50",
        "px-2 py-1 rounded-md whitespace-nowrap",
        "text-[10px] font-medium leading-none tracking-[0.01em]",
        "pointer-events-none select-none",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-200",
      )}
      style={{
        background: "rgba(8, 10, 14, 0.96)",
        color: "rgba(255, 255, 255, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "0 8px 20px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {text}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Sub-components — composable card content
 * ══════════════════════════════════════════════════════════════════════════ */

/** Top label of a card (small, dim). E.g. `"WATCHLIST"`, `"PRIMARY"`. */
function Eyebrow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-[10px] font-medium uppercase tracking-[0.10em] leading-none",
        "text-white/45",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/** Primary heading of a card. */
function Title({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-[13px] font-semibold leading-tight tracking-[-0.005em]",
        "text-white/95",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Secondary line — subtitle, breadcrumb, time stamp. */
function Subtitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-[11px] font-normal leading-tight",
        "text-white/55",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** A label-value row inside a card. */
function Row({
  label,
  value,
  tone = "default",
  className,
  ...props
}: {
  label: React.ReactNode
  value: React.ReactNode
  tone?: DrillTone
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3 text-[11px] leading-tight",
        className,
      )}
      {...props}
    >
      <span className="text-white/45">{label}</span>
      <span
        className="font-semibold tabular-nums"
        style={{ color: TONE_COLOR[tone] || TONE_COLOR.default }}
      >
        {value}
      </span>
    </div>
  )
}

/** Big metric — e.g. the central number on a stat tile. */
function Stat({
  value,
  unit,
  tone = "default",
  className,
  ...props
}: {
  value: React.ReactNode
  unit?: React.ReactNode
  tone?: DrillTone
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div
      className={cn("flex items-baseline gap-1", className)}
      {...props}
    >
      <span
        className="text-[20px] font-semibold leading-none tabular-nums tracking-[-0.01em]"
        style={{ color: TONE_COLOR[tone] || TONE_COLOR.default }}
      >
        {value}
      </span>
      {unit && (
        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/40">
          {unit}
        </span>
      )}
    </div>
  )
}

/** A tiny inline chip (status / tag / category). */
function Chip({
  children,
  tone = "default",
  className,
  ...props
}: {
  tone?: DrillTone
} & React.HTMLAttributes<HTMLSpanElement>) {
  const fg = TONE_COLOR[tone] || TONE_COLOR.default
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md",
        "text-[9px] font-semibold uppercase tracking-[0.10em] leading-none",
        "border",
        className,
      )}
      style={{
        color: fg,
        background:
          tone === "default"
            ? "rgba(255, 255, 255, 0.04)"
            : `${fg.replace(/[\d.]+\)$/, "0.10)")}`,
        borderColor:
          tone === "default"
            ? "rgba(255, 255, 255, 0.06)"
            : `${fg.replace(/[\d.]+\)$/, "0.20)")}`,
      }}
      {...props}
    >
      {children}
    </span>
  )
}

/** Hairline divider inside a card. */
function Divider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("w-full h-px", className)}
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
      }}
    />
  )
}

/** Footer row — for in-card secondary actions or meta. */
function Footer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 mt-1 pt-2",
        className,
      )}
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.04)",
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/** Inline meta line — small, muted, tabular. */
function Meta({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-[10px] font-medium leading-none tracking-[0.02em] tabular-nums",
        "text-white/40",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Compound export — DrillCard.Title etc.
 * ═══════════════════════════════════════════════════════════════���══════════ */

type DrillCardComponent = React.ForwardRefExoticComponent<
  DrillCardProps & React.RefAttributes<HTMLElement>
> & {
  Eyebrow: typeof Eyebrow
  Title: typeof Title
  Subtitle: typeof Subtitle
  Row: typeof Row
  Stat: typeof Stat
  Chip: typeof Chip
  Divider: typeof Divider
  Footer: typeof Footer
  Meta: typeof Meta
}

const DrillCard = DrillCardImpl as DrillCardComponent
DrillCard.Eyebrow = Eyebrow
DrillCard.Title = Title
DrillCard.Subtitle = Subtitle
DrillCard.Row = Row
DrillCard.Stat = Stat
DrillCard.Chip = Chip
DrillCard.Divider = Divider
DrillCard.Footer = Footer
DrillCard.Meta = Meta

export { DrillCard }
