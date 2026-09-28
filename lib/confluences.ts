import {
  type LucideIcon,
  TrendingUp,
  Waves,
  Scale,
  ScanLine,
  FlipHorizontal2,
  Box,
  Hammer,
  Repeat,
  Clock,
  CalendarClock,
  Crosshair,
  Zap,
} from "lucide-react"

export type ConfluenceId =
  | "htf-structure"
  | "liquidity-sweep"
  | "bpr"
  | "fvg"
  | "ifvg"
  | "order-block"
  | "breaker-block"
  | "po3"
  | "bank-session"
  | "opens-pd"
  | "pivot-points"

export type VisualType = "levels" | "zones" | "patterns" | "time-based"

export interface ConfluenceMeta {
  id: ConfluenceId
  name: string
  short?: string
  icon: LucideIcon
  category: "Technical" | "Fundamental" | "Sentiment" | "Custom"
  hoverDescription: string
  detailedDescription: string
  detectionRules: string[]
  visualIndicators: {
    type: VisualType
    parameters?: any
  }
  strengthWeight: number // 0-100 guidance weight
  confidenceImpact: "low" | "medium" | "high"
}

export const technicalConfluences: ConfluenceMeta[] = [
  {
    id: "htf-structure",
    name: "Higher Timeframe Structure",
    short: "HTF Bias",
    icon: TrendingUp,
    category: "Technical",
    hoverDescription:
      "Weekly/Daily swing structure sets dominant bias: HH/HL bullish, LH/LL bearish. Align intraday trades with HTF flow.",
    detailedDescription:
      "The higher timeframe (Weekly/Daily) swing structure defines market bias. Trading with HTF flow avoids countertrend traps and improves odds.",
    detectionRules: [
      "Mark Weekly/Daily swing highs/lows; confirm HH/HL (bullish) or LH/LL (bearish).",
      "Track prior week high/low; note weekly close above/below range.",
      "Confirm bias from latest confirmed swing points and closes.",
    ],
    visualIndicators: { type: "zones" },
    strengthWeight: 90,
    confidenceImpact: "high",
  },
  {
    id: "liquidity-sweep",
    name: "Liquidity Sweep",
    icon: Waves,
    category: "Technical",
    hoverDescription:
      "Stop-run beyond a key high/low, followed by rejection and displacement in the opposite direction.",
    detailedDescription:
      "Liquidity sweeps occur when price extends through well-watched highs/lows to trigger stops and fill large orders, then rejects.",
    detectionRules: [
      "Define liquidity pools: Asia high/low, PDH/PDL, PWH/PWL, equal highs/lows.",
      "Detect price trading through a pool (wick or body).",
      "Confirm sweep via rejection back inside or opposite-side displacement.",
    ],
    visualIndicators: { type: "patterns" },
    strengthWeight: 80,
    confidenceImpact: "high",
  },
  {
    id: "bpr",
    name: "Balanced Price Range",
    short: "Premium/Discount",
    icon: Scale,
    category: "Technical",
    hoverDescription:
      "Split a reference range at 50%. Above = premium, below = discount. Buy discount in uptrends, sell premium in downtrends.",
    detailedDescription:
      "BPR frames value within a swing or session range. Equilibrium (50%) divides premium/discount to guide fair entries.",
    detectionRules: [
      "Choose range: prior day/week high/low or recent swing.",
      "Compute midpoint: (High + Low) / 2.",
      "Classify price above midpoint as premium, below as discount.",
    ],
    visualIndicators: { type: "levels" },
    strengthWeight: 70,
    confidenceImpact: "medium",
  },
  {
    id: "fvg",
    name: "Fair Value Gap (FVG)",
    icon: ScanLine,
    category: "Technical",
    hoverDescription:
      "Three-candle imbalance. Bullish: low(i) > high(i-2). Bearish: high(i) < low(i-2). Often retraced/mitigated.",
    detailedDescription:
      "FVG marks an imbalance created by strong displacement where opposite-side orders are skipped. Price tends to revisit.",
    detectionRules: [
      "Bullish: Low(i) > High(i-2). Bearish: High(i) < Low(i-2).",
      "Mark gap bounds and midpoint.",
      "Track partial/full fills by later candles.",
    ],
    visualIndicators: { type: "zones" },
    strengthWeight: 65,
    confidenceImpact: "medium",
  },
  {
    id: "ifvg",
    name: "Inverted FVG (iFVG)",
    icon: FlipHorizontal2,
    category: "Technical",
    hoverDescription: "An FVG that flips to S/R after price trades through and retests from the opposite side.",
    detailedDescription:
      "Once price closes through an FVG and retests from the other side, the imbalance can invert to support or resistance.",
    detectionRules: [
      "Identify a standard FVG.",
      "Close through the gap in the opposite direction.",
      "Retest opposite boundary/midpoint with rejection.",
    ],
    visualIndicators: { type: "zones" },
    strengthWeight: 60,
    confidenceImpact: "medium",
  },
  {
    id: "order-block",
    name: "Order Block (OB)",
    icon: Box,
    category: "Technical",
    hoverDescription:
      "Last up/down candle before a displacement move. Institutional footprint where orders originated.",
    detailedDescription:
      "The final candle before impulsive displacement marks a zone of institutional orders. Acts as S/R upon revisit.",
    detectionRules: [
      "Find last bullish/bearish candle before strong displacement.",
      "Mark body and wick extremes.",
      "For bullish OB, confirm upward displacement after the candle; bearish for downward.",
    ],
    visualIndicators: { type: "zones" },
    strengthWeight: 75,
    confidenceImpact: "high",
  },
  {
    id: "breaker-block",
    name: "Breaker Block",
    icon: Hammer,
    category: "Technical",
    hoverDescription:
      "A failed OB that flips polarity after a liquidity run. Becomes support (bull) or resistance (bear).",
    detailedDescription:
      "Following a sweep and reversal through the originating OB, the zone flips and often provides reactive entries.",
    detectionRules: [
      "Identify prior swing and its sweep.",
      "Locate the opposite OB at/near the swept swing.",
      "Confirm reversal and close beyond OB origin; watch for retest.",
    ],
    visualIndicators: { type: "zones" },
    strengthWeight: 70,
    confidenceImpact: "medium",
  },
  {
    id: "po3",
    name: "Power of Three (PO3)",
    icon: Repeat,
    category: "Technical",
    hoverDescription: "Session model: Accumulation → Manipulation → Distribution with displacement and follow‑through.",
    detailedDescription:
      "PO3 structures intraday flow through a boxed consolidation, false break (liquidity), then true move with displacement.",
    detectionRules: [
      "Identify accumulation (often Asia session box).",
      "Detect manipulation/false break against intended move.",
      "Confirm distribution via displacement and expansion.",
    ],
    visualIndicators: { type: "patterns" },
    strengthWeight: 55,
    confidenceImpact: "medium",
  },
  {
    id: "bank-session",
    name: "Bank Session Filter",
    icon: Clock,
    category: "Technical",
    hoverDescription: "Execution windows: 02:00–05:00 EST (EU open) and 08:00–12:00 EST (NY active).",
    detailedDescription:
      "Filter trades to liquid hours. Align execution with Frankfurt/London open and New York session activity.",
    detectionRules: [
      "Session 1: 02:00–05:00 EST (EU open).",
      "Session 2: 08:00–12:00 EST (NY active).",
      "Check current time vs windows; prefer alignment.",
    ],
    visualIndicators: { type: "time-based" },
    strengthWeight: 40,
    confidenceImpact: "low",
  },
  {
    id: "opens-pd",
    name: "Weekly/Daily Open + PD",
    icon: CalendarClock,
    category: "Technical",
    hoverDescription: "Polarity via Weekly/Daily Opens and premium/discount equilibrium of prior day/week.",
    detailedDescription:
      "WO/DO define daily/weekly polarity. Combine with prior day/week equilibrium to judge premium vs discount.",
    detectionRules: [
      "Mark WO and DO (first tick of week/day).",
      "Above open = bullish polarity; below = bearish polarity.",
      "Compute PW_EQ/PD_EQ midpoints; classify premium/discount.",
    ],
    visualIndicators: { type: "levels" },
    strengthWeight: 65,
    confidenceImpact: "medium",
  },
  {
    id: "pivot-points",
    name: "Pivot Points",
    icon: Crosshair,
    category: "Technical",
    hoverDescription: "Keep existing Pivot Points logic and visuals exactly as implemented.",
    detailedDescription: "Classical pivots (P, S1–S3, R1–R3). This confluence remains unchanged and integrates as-is.",
    detectionRules: ["Use your existing pivot point formula and rendering; no changes required."],
    visualIndicators: { type: "levels" },
    strengthWeight: 50,
    confidenceImpact: "low",
  },
]

// Minimal trade types to preserve existing imports elsewhere:
export type TradeType = { id: string; name: string; icon: LucideIcon }
export const tradeTypes: TradeType[] = [
  { id: "trend-continuation", name: "Trend Continuation", icon: TrendingUp },
  { id: "reversal", name: "Reversal", icon: Zap },
]

// Convenience map
export const confluenceById = new Map(technicalConfluences.map((c) => [c.id, c]))
export type Confluence = ConfluenceMeta
