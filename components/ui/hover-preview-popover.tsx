"use client"

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  HoverPreviewPopover — universal side-detail surface (Project 2 · Task 2)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  The platform's universal "preview without leaving" component.
 *  Built on @radix-ui/react-hover-card for positioning + accessibility,
 *  layered with the obsidian-glass visual treatment defined in the
 *  Interaction Vocabulary contract.
 *
 *  Usage (typical):
 *  ┌───────────────────────────────────────────────────────────────────────┐
 *  │  <HoverPreviewPopover.Root category="forex">                          │
 *  │    <HoverPreviewPopover.Trigger asChild>                              │
 *  │      <button>EUR/USD 74%</button>                                     │
 *  │    </HoverPreviewPopover.Trigger>                                     │
 *  │    <HoverPreviewPopover.Content>                                      │
 *  │      <HoverPreviewPopover.Header                                      │
 *  │        subject="EURUSD · LONG"                                        │
 *  │        value="1.17013"                                                │
 *  │        meta="London"                                                  │
 *  │      />                                                               │
 *  │      <HoverPreviewPopover.Body>                                       │
 *  │        <HoverPreviewPopover.Row label="Win rate" value="74%" />       │
 *  │        <HoverPreviewPopover.Row                                       │
 *  │          label="Today"                                                │
 *  │          value="+18 pips"                                             │
 *  │          tone="positive"                                              │
 *  │        />                                                             │
 *  │        <HoverPreviewPopover.Row label="N" value="47" tone="muted" /> │
 *  │      </HoverPreviewPopover.Body>                                      │
 *  │      <HoverPreviewPopover.Footer>                                     │
 *  │        <HoverPreviewPopover.ActionButton affordance="navigate">       │
 *  │          Open chart                                                   │
 *  │        </HoverPreviewPopover.ActionButton>                            │
 *  │      </HoverPreviewPopover.Footer>                                    │
 *  │    </HoverPreviewPopover.Content>                                     │
 *  │  </HoverPreviewPopover.Root>                                          │
 *  └───────────────────────────────────────────────────────────────────────┘
 *
 *  Categories tint the popover's accent rail and side-wash so the user
 *  perceives the popover as belonging to the same family as the trigger.
 *  Pass `category="forex" | "indices" | "crypto" | "commodities" |
 *  "macro" | "focus" | "session" | "alert"` (default `"neutral"`).
 *
 *  Anatomy of the obsidian-glass surface (z-stack, bottom → top):
 *    1.  Drop shadow + outer hairline ring
 *    2.  Glass base — rgba(10,11,15,0.96) + blur(32px) saturate(180%)
 *    3.  1px hairline border at rgba(255,255,255,0.06)
 *    4.  Inset top-edge highlight + inset bottom shadow (depth)
 *    5.  Top-down gradient overlay (subtle dimensional polish)
 *    6.  Category-tinted side-wash (only if categorical)
 *    7.  Category accent rail on trigger-facing edge (only if categorical)
 *    8.  Content (Header · Body · Footer)
 *
 *  Animation contract (Radix data-state + Tailwind animate utilities):
 *    open  → fade-in + zoom-in 0.97→1 + slide-in 8px from trigger side
 *    close → fade-out + zoom-out + slide-out 4px (faster)
 *
 *  Defaults:
 *    openDelay  = 240ms   (Hover State + Long-Hover transition feel)
 *    closeDelay = 140ms   (forgiving when crossing the gap)
 *    sideOffset = 12px
 *    width      = 320px
 *    side       = "right"
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
 *  Token tables
 * ──────────────────────────────────────────────────────────────────────── */

export type HoverPreviewCategory =
  | "neutral"
  | "forex"
  | "indices"
  | "crypto"
  | "commodities"
  | "macro"
  | "focus"
  | "session"
  | "alert"

/** RGB triplets used in `rgba(${rgb}, alpha)` constructions. */
const CATEGORY_RGB: Record<HoverPreviewCategory, string> = {
  neutral: "255, 255, 255",
  forex: "59, 130, 246", // blue-500
  indices: "6, 182, 212", // cyan-500
  crypto: "245, 158, 11", // amber-500
  commodities: "16, 185, 129", // emerald-500
  macro: "239, 68, 68", // red-500
  focus: "6, 182, 212", // cyan
  session: "34, 197, 94", // green-500
  alert: "251, 146, 60", // orange-400
}

export type HoverPreviewAffordance =
  | "preview"
  | "navigate"
  | "external"
  | "save"
  | "execute"
  | "confirm"
  | "close"
  | "none"

const AFFORDANCE_GLYPH: Record<HoverPreviewAffordance, string> = {
  preview: "+",
  navigate: "→",
  external: "↗",
  save: "↓",
  execute: "▶",
  confirm: "✓",
  close: "×",
  none: "",
}

export type HoverPreviewTone =
  | "default"
  | "positive"
  | "negative"
  | "warn"
  | "muted"
  | "accent"

const TONE_COLOR: Record<HoverPreviewTone, string> = {
  default: "rgba(255, 255, 255, 0.92)",
  positive: "rgba(52, 211, 153, 0.95)", // emerald-400
  negative: "rgba(244, 114, 114, 0.95)", // rose-ish
  warn: "rgba(251, 191, 36, 0.95)", // amber-400
  muted: "rgba(255, 255, 255, 0.50)",
  accent: "", // resolved at render time from category
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Context — shares category + presentation flags down the tree
 * ──────────────────────────────────────────────────────────────────────── */

interface HoverPreviewContextValue {
  category: HoverPreviewCategory
  rgb: string
  isCategorical: boolean
  side: "right" | "left" | "top" | "bottom"
}

const HoverPreviewContext = React.createContext<HoverPreviewContextValue>({
  category: "neutral",
  rgb: CATEGORY_RGB.neutral,
  isCategorical: false,
  side: "right",
})

function useHoverPreview() {
  return React.useContext(HoverPreviewContext)
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Root
 *
 *  Thin wrapper around Radix HoverCard.Root that owns the category state
 *  and the platform-default open/close delays.
 * ──────────────────────────────────────────────────────────────────────── */

interface RootProps
  extends React.ComponentProps<typeof HoverCardPrimitive.Root> {
  /**
   * Visual category. Tints the accent rail, side-wash, action button
   * primary state, and the `tone="accent"` Row variant. Default `"neutral"`.
   */
  category?: HoverPreviewCategory
}

function Root({
  category = "neutral",
  openDelay = 240,
  closeDelay = 140,
  children,
  ...props
}: RootProps) {
  const value = React.useMemo<HoverPreviewContextValue>(
    () => ({
      category,
      rgb: CATEGORY_RGB[category],
      isCategorical: category !== "neutral",
      // Side is finalized in Content; placeholder here.
      side: "right",
    }),
    [category],
  )

  return (
    <HoverPreviewContext.Provider value={value}>
      <HoverCardPrimitive.Root
        openDelay={openDelay}
        closeDelay={closeDelay}
        {...props}
      >
        {children}
      </HoverCardPrimitive.Root>
    </HoverPreviewContext.Provider>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Trigger — re-export of Radix Trigger.
 *
 *  Use `asChild` to forward props to your own element (recommended).
 * ──────────────────────────────────────────────────────────────────────── */

const Trigger = HoverCardPrimitive.Trigger

/* ─────────────────────────────────────────────────────────────────────────
 *  Content — the obsidian glass surface
 * ──────────────────────────────────────────────────────────────────────── */

interface ContentProps
  extends Omit<
    React.ComponentProps<typeof HoverCardPrimitive.Content>,
    "side" | "align"
  > {
  /** Which side of the trigger to render on. Default `"right"`. */
  side?: "right" | "left" | "top" | "bottom"
  /** Distance in px between trigger and popover. Default `12`. */
  sideOffset?: number
  /** Pixel width of the popover. Default `320`. */
  width?: number | string
  /** Alignment along the trigger's axis. Default `"center"`. */
  align?: "start" | "center" | "end"
  /** Optional className applied to the inner glass surface. */
  className?: string
}

const Content = React.forwardRef<HTMLDivElement, ContentProps>(function Content(
  {
    className,
    side = "right",
    sideOffset = 12,
    align = "center",
    width = 320,
    children,
    style,
    ...props
  },
  ref,
) {
  const { category, rgb, isCategorical } = useHoverPreview()

  // Re-publish side into context so accent rail picks the right edge.
  const contextValue = React.useMemo<HoverPreviewContextValue>(
    () => ({
      category,
      rgb,
      isCategorical,
      side,
    }),
    [category, rgb, isCategorical, side],
  )

  // Which edge faces the trigger. The accent rail anchors to that edge.
  const railEdge: "left" | "right" | "top" | "bottom" =
    side === "right"
      ? "left"
      : side === "left"
        ? "right"
        : side === "top"
          ? "bottom"
          : "top"

  // Tinted side-wash origin matches the rail edge.
  const washOrigin =
    railEdge === "left"
      ? "0% 50%"
      : railEdge === "right"
        ? "100% 50%"
        : railEdge === "top"
          ? "50% 0%"
          : "50% 100%"

  return (
    <HoverPreviewContext.Provider value={contextValue}>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          ref={ref}
          side={side}
          sideOffset={sideOffset}
          align={align}
          collisionPadding={16}
          className={cn(
            // z-stack: above all cards, below modals
            "z-[100] outline-none",
            // Animations driven by Radix data-state
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-[0.97] data-[state=closed]:zoom-out-[0.97]",
            "data-[side=right]:data-[state=open]:slide-in-from-left-2",
            "data-[side=left]:data-[state=open]:slide-in-from-right-2",
            "data-[side=top]:data-[state=open]:slide-in-from-bottom-2",
            "data-[side=bottom]:data-[state=open]:slide-in-from-top-2",
            // Timing: enter slightly slower than exit (matches vocabulary)
            "data-[state=open]:duration-[240ms] data-[state=closed]:duration-[180ms]",
            // Use the platform motion curve via CSS variable on this element
            "[--ui-ease:cubic-bezier(0.22,1,0.36,1)]",
            "data-[state=open]:[animation-timing-function:var(--ui-ease)]",
            "data-[state=closed]:[animation-timing-function:cubic-bezier(0.4,0,1,1)]",
          )}
          style={{ width, ...style }}
          {...props}
        >
          {/* ── Glass shell ─────────────────────────────────────────────── */}
          <div
            className={cn(
              "relative rounded-[14px] overflow-hidden",
              className,
            )}
            style={{
              background: "rgba(10, 11, 15, 0.96)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              boxShadow: [
                // Inset highlights + depth
                "inset 0 1px 0 rgba(255, 255, 255, 0.045)",
                "inset 0 -1px 0 rgba(0, 0, 0, 0.4)",
                // Outer drop shadow
                "0 16px 48px -16px rgba(0, 0, 0, 0.6)",
                // Either category-tinted ambient halo or a generic outer hairline
                isCategorical
                  ? `0 0 24px -8px rgba(${rgb}, 0.22)`
                  : "0 0 0 1px rgba(255, 255, 255, 0.02)",
              ].join(", "),
            }}
          >
            {/* Top-down inner highlight — adds dimensional polish */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[14px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.020) 0%, transparent 35%, transparent 100%)",
              }}
            />

            {/* Category-tinted side-wash (only when categorical) */}
            {isCategorical && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[14px]"
                style={{
                  background: `radial-gradient(ellipse 65% 55% at ${washOrigin}, rgba(${rgb}, 0.06), transparent 60%)`,
                }}
              />
            )}

            {/* Category accent rail on trigger-facing edge */}
            {isCategorical && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  ...(railEdge === "left" || railEdge === "right"
                    ? {
                        top: "14%",
                        bottom: "14%",
                        width: "1px",
                        [railEdge]: 0,
                      }
                    : {
                        left: "14%",
                        right: "14%",
                        height: "1px",
                        [railEdge]: 0,
                      }),
                  background:
                    railEdge === "left" || railEdge === "right"
                      ? `linear-gradient(180deg, transparent 0%, rgba(${rgb}, 0.55) 50%, transparent 100%)`
                      : `linear-gradient(90deg, transparent 0%, rgba(${rgb}, 0.55) 50%, transparent 100%)`,
                }}
              />
            )}

            {/* Connector glow — a soft kiss on the trigger-facing edge,
                creates the perceptual tether without an SVG line */}
            {isCategorical && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  ...(railEdge === "left" || railEdge === "right"
                    ? {
                        top: "50%",
                        [railEdge]: "-1px",
                        width: "12px",
                        height: "24px",
                        transform: "translateY(-50%)",
                      }
                    : {
                        left: "50%",
                        [railEdge]: "-1px",
                        width: "24px",
                        height: "12px",
                        transform: "translateX(-50%)",
                      }),
                  background:
                    railEdge === "left"
                      ? `radial-gradient(ellipse at 0% 50%, rgba(${rgb}, 0.18), transparent 70%)`
                      : railEdge === "right"
                        ? `radial-gradient(ellipse at 100% 50%, rgba(${rgb}, 0.18), transparent 70%)`
                        : railEdge === "top"
                          ? `radial-gradient(ellipse at 50% 0%, rgba(${rgb}, 0.18), transparent 70%)`
                          : `radial-gradient(ellipse at 50% 100%, rgba(${rgb}, 0.18), transparent 70%)`,
                  filter: "blur(2px)",
                }}
              />
            )}

            {/* Content layer */}
            <div className="relative">{children}</div>
          </div>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverPreviewContext.Provider>
  )
})
Content.displayName = "HoverPreviewPopover.Content"

/* ─────────────────────────────────────────────────────────────────────────
 *  Header — subject + value + optional meta, with bottom hairline
 * ──────────────────────────────────────────────────────────────────────── */

interface HeaderProps {
  /** Small uppercase label above the value (e.g. "EURUSD · LONG"). */
  subject?: React.ReactNode
  /** Primary headline value (e.g. "1.17013"). */
  value?: React.ReactNode
  /** Right-aligned meta chip (e.g. "London", "live"). */
  meta?: React.ReactNode
  /** Bypass the structured layout entirely. */
  children?: React.ReactNode
  className?: string
}

function Header({ subject, value, meta, children, className }: HeaderProps) {
  if (children) {
    return (
      <div
        className={cn(
          "px-4 pt-3.5 pb-2.5 border-b border-white/[0.04]",
          className,
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "px-4 pt-3.5 pb-2.5 border-b border-white/[0.04]",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          {subject !== undefined && (
            <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/45 leading-none mb-1.5">
              {subject}
            </div>
          )}
          {value !== undefined && (
            <div className="text-[14px] font-medium text-white/90 leading-tight truncate">
              {value}
            </div>
          )}
        </div>
        {meta !== undefined && (
          <div className="flex-shrink-0 text-[10px] uppercase tracking-[0.06em] text-white/40 leading-none pt-px">
            {meta}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Body — the main content slot. Children stack with consistent gap.
 * ──────────────────────────────────────────────────────────────────────── */

function Body({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("px-4 py-3 flex flex-col gap-2", className)}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Footer — action strip with top hairline. Houses ActionButton(s).
 * ──────────────────────────────────────────────────────────────────────── */

function Footer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "px-2.5 py-2 border-t border-white/[0.04] flex items-center gap-1",
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Row — the platform's standard label/value row inside the body.
 *
 *  Tone controls the value's color. Optional `spark` slot fits a tiny
 *  inline indicator (a sparkline, a chip, a dot) just left of the value.
 * ──────────────────────────────────────────────────────────────────────── */

interface RowProps {
  label: React.ReactNode
  value: React.ReactNode
  tone?: HoverPreviewTone
  /** Optional inline indicator shown just left of the value. */
  spark?: React.ReactNode
  className?: string
}

function Row({ label, value, tone = "default", spark, className }: RowProps) {
  const { rgb } = useHoverPreview()
  const color =
    tone === "accent"
      ? `rgba(${rgb}, 0.95)`
      : TONE_COLOR[tone]

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 min-h-[18px]",
        className,
      )}
    >
      <span className="text-[11px] text-white/55 truncate leading-tight">
        {label}
      </span>
      <div className="flex items-center gap-2 flex-shrink-0">
        {spark !== undefined && <span className="opacity-70">{spark}</span>}
        <span
          className="text-[11px] font-mono font-medium tabular-nums leading-tight"
          style={{ color }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Stat — a larger metric block (used when one number deserves the spotlight)
 * ──────────────────────────────────────────────────────────────────────── */

interface StatProps {
  label: React.ReactNode
  value: React.ReactNode
  delta?: React.ReactNode
  tone?: HoverPreviewTone
  className?: string
}

function Stat({ label, value, delta, tone = "default", className }: StatProps) {
  const { rgb } = useHoverPreview()
  const color =
    tone === "accent" ? `rgba(${rgb}, 0.95)` : TONE_COLOR[tone]

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10px] uppercase tracking-[0.08em] text-white/40 leading-none">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-[18px] font-mono font-medium tabular-nums leading-none tracking-tight"
          style={{ color }}
        >
          {value}
        </span>
        {delta !== undefined && (
          <span className="text-[10px] font-mono text-white/45 tabular-nums leading-none">
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Divider — softly faded hairline used inside Body when grouping rows
 * ──────────────────────────────────────────────────────────────────────── */

function Divider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px my-1", className)}
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.06) 75%, transparent 100%)",
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Spark — tiny container that shapes inline children into a 56×16 mini slot
 *
 *  Use as: <Row spark={<Spark><MySparkline ... /></Spark>} ... />
 * ──────────────────────────────────────────────────────────────────────── */

function Spark({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end h-4 w-14 leading-none",
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  ActionButton — compact action affordance for the Footer
 *
 *  Two variants:
 *    "default" — quiet, used for secondary actions
 *    "primary" — category-tinted, used for the recommended next step
 * ──────────────────────────────────────────────────────────────────────── */

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  affordance?: HoverPreviewAffordance
  variant?: "default" | "primary"
}

function ActionButton({
  children,
  affordance = "navigate",
  variant = "default",
  className,
  type = "button",
  ...props
}: ActionButtonProps) {
  const { rgb, isCategorical } = useHoverPreview()
  const useAccent = variant === "primary" && isCategorical
  const glyph = AFFORDANCE_GLYPH[affordance]

  return (
    <button
      type={type}
      className={cn(
        "group/ab relative flex items-center gap-1.5 h-7 px-2.5 rounded-md",
        "text-[10px] font-medium tracking-[0.02em] leading-none",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
        useAccent
          ? "text-white/90 hover:text-white"
          : "text-white/55 hover:text-white/85 hover:bg-white/[0.04]",
        className,
      )}
      style={
        useAccent
          ? {
              background: `linear-gradient(180deg, rgba(${rgb}, 0.10) 0%, rgba(${rgb}, 0.05) 100%)`,
              border: `1px solid rgba(${rgb}, 0.18)`,
              boxShadow: `inset 0 1px 0 rgba(${rgb}, 0.10)`,
            }
          : undefined
      }
      {...props}
    >
      <span>{children}</span>
      {affordance !== "none" && (
        <span
          aria-hidden="true"
          className={cn(
            "text-[10px] leading-none transition-transform duration-300 ease-out",
            affordance === "navigate" && "group-hover/ab:translate-x-[1px]",
            affordance === "save" && "group-hover/ab:translate-y-[1px]",
            affordance === "external" &&
              "group-hover/ab:translate-x-[1px] group-hover/ab:-translate-y-[1px]",
          )}
          style={{
            color: useAccent
              ? `rgba(${rgb}, 0.85)`
              : "rgba(255, 255, 255, 0.45)",
          }}
        >
          {glyph}
        </span>
      )}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  Composed namespace export
 *
 *  Consumers may use either:
 *    <HoverPreviewPopover.Root> ... </HoverPreviewPopover.Root>
 *  or destructure:
 *    const { Root, Trigger, Content } = HoverPreviewPopover
 * ──────────────────────────────────────────────────────────────────────── */

const HoverPreviewPopover = {
  Root,
  Trigger,
  Content,
  Header,
  Body,
  Footer,
  Row,
  Stat,
  Divider,
  Spark,
  ActionButton,
}

export { HoverPreviewPopover }

// Named exports for ergonomic individual imports
export {
  Root as HoverPreviewRoot,
  Trigger as HoverPreviewTrigger,
  Content as HoverPreviewContent,
  Header as HoverPreviewHeader,
  Body as HoverPreviewBody,
  Footer as HoverPreviewFooter,
  Row as HoverPreviewRow,
  Stat as HoverPreviewStat,
  Divider as HoverPreviewDivider,
  Spark as HoverPreviewSpark,
  ActionButton as HoverPreviewActionButton,
}
