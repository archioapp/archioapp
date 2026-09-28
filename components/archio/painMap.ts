import { Flame, TrendingDown, TrendingUp, Compass, Activity, Users, type LucideIcon } from "lucide-react"

export type PainId = "revenge" | "cutShort" | "sizeUp" | "noPlan" | "noEdge" | "alone"

export type Severity = "red" | "amber" | "rose" | "cyan" | "violet"

export interface PainMeta {
  id: PainId
  label: string
  consequence: string
  icon: LucideIcon
  severity: Severity
}

export interface SolutionMeta {
  id: PainId
  title: string
  body: string
  screenshot: string
  alt: string
}

/**
 * Severity swatches — only small dots ever paint these colors.
 * Large background surfaces must stay neutral per the brand system.
 */
export const SEVERITY_CLASS: Record<Severity, { dot: string; ring: string; label: string }> = {
  red:    { dot: "bg-rose-500",       ring: "shadow-[0_0_10px_rgba(244,63,94,0.45)]",    label: "text-rose-300/80" },
  amber:  { dot: "bg-amber-400",      ring: "shadow-[0_0_10px_rgba(251,191,36,0.4)]",    label: "text-amber-300/80" },
  rose:   { dot: "bg-rose-400",       ring: "shadow-[0_0_10px_rgba(251,113,133,0.4)]",   label: "text-rose-300/80" },
  cyan:   { dot: "bg-cyan-300",       ring: "shadow-[0_0_10px_rgba(34,211,238,0.45)]",   label: "text-cyan-200/80" },
  violet: { dot: "bg-violet-400",     ring: "shadow-[0_0_10px_rgba(167,139,250,0.4)]",   label: "text-violet-300/80" },
}

export const PAINS: PainMeta[] = [
  {
    id: "revenge",
    label: "I revenge-trade after losses",
    consequence: "You give back a week in a single session.",
    icon: Flame,
    severity: "red",
  },
  {
    id: "cutShort",
    // NOTE: spec requested Scissors with TrendingDown as the documented fallback.
    label: "I cut winners short",
    consequence: "Your R multiple never matches your setup.",
    icon: TrendingDown,
    severity: "amber",
  },
  {
    id: "sizeUp",
    label: "I size up at the wrong time",
    consequence: "One trade erases ten.",
    icon: TrendingUp,
    severity: "rose",
  },
  {
    id: "noPlan",
    // NOTE: spec requested Map with Compass as the documented fallback.
    label: "I trade without a plan",
    consequence: "Every session is reactive.",
    icon: Compass,
    severity: "amber",
  },
  {
    id: "noEdge",
    label: "I can't tell if my edge is real",
    consequence: "You confuse luck with skill for years.",
    icon: Activity,
    severity: "cyan",
  },
  {
    id: "alone",
    label: "I trade alone with no coaching",
    consequence: "No one sees the pattern but you, too late.",
    icon: Users,
    severity: "violet",
  },
]

export const SOLUTIONS: Record<PainId, SolutionMeta> = {
  revenge: {
    id: "revenge",
    title: "Here's what happens the next time you try.",
    body:
      "After your next red trade, the Cortex detects the pattern in under three seconds, locks size, flags the setup, and asks the one question that kills the spiral — before your finger touches Buy.",
    screenshot: "/archio/screens/11-copilot-right-rail.png",
    alt: "Cortex right rail intercepting a revenge pattern with a critical alert.",
  },
  cutShort: {
    id: "cutShort",
    title: "Your next winner runs.",
    body:
      "CauseEffect ties your exits to the reasons you took them. When you reach for the close button on a setup that historically runs, the copilot intercepts and shows you the distribution of what this trade has paid before.",
    screenshot: "/archio/screens/02-dashboard.png",
    alt: "Archio performance dashboard with edge decomposition and exit analytics.",
  },
  sizeUp: {
    id: "sizeUp",
    title: "You don't get to size up today.",
    body:
      "When the Cortex sees you escalating lot size after a win streak or inside a fatigue window, Cooldown kicks in — lots are capped, a five-minute breathe timer triggers, and you log the reason before the order goes through.",
    screenshot: "/archio/screens/12-execution-chart.png",
    alt: "Trade Forge execution terminal with lot sizing, broker rail, and risk overrides.",
  },
  noPlan: {
    id: "noPlan",
    title: "You walk in already prepped.",
    body:
      "Daily Gameplan arrives before London. Macro drivers, your focus pair, your bias, your levels — written with your mentor, stress-tested against your history, ready before your first coffee.",
    screenshot: "/archio/screens/09-communities.png",
    alt: "Whale Room Daily Gameplan with weekly outlook and macro drivers.",
  },
  noEdge: {
    id: "noEdge",
    title: "Your edge, in numbers.",
    body:
      "Edge Decomposition breaks your P&L across session, setup, pair, and time-of-day. You stop guessing which part of your trading actually prints — you know it within a week.",
    screenshot: "/archio/screens/08-hub.png",
    alt: "Forecast Hub feed with pair, confidence, and session-tagged calls.",
  },
  alone: {
    id: "alone",
    title: "You never trade solo again.",
    body:
      "Nexus routes you to the exact mentor and room that matches your style. Whale Room, Prop Firm, Small Tribe — the community finder places you, and the copilot watches over the call.",
    screenshot: "/archio/screens/07-nexus.png",
    alt: "Nexus routing constellation connecting trader to mentors and rooms.",
  },
}
