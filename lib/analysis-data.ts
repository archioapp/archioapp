import { TypeIcon as type, LucideIcon, CalendarDays, Scale, Droplets, ArrowRightLeft, RectangleHorizontal, CandlestickChart, Clock, LineChart, Target } from 'lucide-react'

export interface Confluence {
  id: string
  category: "confluence"
  title: string
  subtitle: string
  icon: LucideIcon
  color: string
  status: string
  statusColor: "emerald" | "amber" | "cyan"
  confidence: number
  relevantPairs: string[]
  textbookExplanation: string
  imagePath?: string
  // Optional data fields used by various popups
  bprHigh?: string
  bprMid?: string
  bprLow?: string
  duration?: string
  pricePosition?: "Above" | "Below"
  weeklyOpenPrice?: string
  currentPrice?: string
  marketState?: "Premium" | "Discount"
  weeklyHigh?: string
  weeklyLow?: string
  dailyHigh?: string
  dailyLow?: string
  tokyoHigh?: string
  tokyoLow?: string
  pivots?: {
    r3: string
    r2: string
    r1: string
    p: string
    s1: string
    s2: string
    s3: string
  }
}

export interface Scenario {
  id: string
  category: "scenario"
  pair: string
  position: "Buy Position" | "Sell Position"
  probability: string
  level: string
  rr: string
  sl: string
  tp: string
  confluences: { text: string; tooltip?: string }[]
  aiConfidence: number
  relevantPairs: string[]
}

export interface UserScenario {
  id: string
  type: "buy" | "sell"
  entry?: number
  tp?: number
  sl?: number
  rr?: number
  confluences: string[]
}

export type AnalysisItem = Confluence | Scenario

export type BPRConfluence = Confluence &
  Required<Pick<Confluence, "bprHigh" | "bprMid" | "bprLow" | "duration" | "pricePosition">>
export type WeeklyOpenConfluence = Confluence &
  Required<Pick<Confluence, "weeklyOpenPrice" | "currentPrice" | "marketState">>
export type LiquiditySweepConfluence = Confluence &
  Required<Pick<Confluence, "weeklyHigh" | "weeklyLow" | "dailyHigh" | "dailyLow" | "tokyoHigh" | "tokyoLow">>
export type PivotLinesConfluence = Confluence & Required<Pick<Confluence, "pivots">>

export const allAnalysisData: AnalysisItem[] = [
  // Scenarios (unchanged examples)
  {
    id: "scenario-buy-gbpusd",
    category: "scenario",
    pair: "GBP/USD",
    position: "Buy Position",
    probability: "High Probability",
    level: "1.31650 – 1.31890",
    rr: "1:4",
    sl: "1.31627",
    tp: "1.32527",
    confluences: [
      {
        text: "Bellow Weekly Open",
        tooltip:
          "Price is currently in a discount area relative to the weekly open, often considered a bullish sign in an uptrend.",
      },
      {
        text: "4h 80% FIB",
        tooltip:
          "The entry level aligns with the 80% Fibonacci retracement level on the 4-hour chart, a key area for potential reversals.",
      },
      {
        text: "S1 Pivot Support",
        tooltip: "The S1 daily pivot is providing a floor for price, indicating potential support.",
      },
      {
        text: "1.32 Bank Level",
        tooltip: "The 1.3200 level is a significant psychological and institutional price point.",
      },
    ],
    aiConfidence: 92,
    relevantPairs: ["GBPUSD"],
  },
  {
    id: "scenario-sell-gbpusd",
    category: "scenario",
    pair: "GBP/USD",
    position: "Sell Position",
    probability: "High Probability",
    level: "1.33413 – 1.33650",
    rr: "1:4",
    sl: "1.33627",
    tp: "1.32785",
    confluences: [
      {
        text: "Above Weekly Open",
        tooltip:
          "Price is currently in a premium area relative to the weekly open, often considered a bearish sign in a downtrend.",
      },
      {
        text: "4h 50% FIB",
        tooltip:
          "The entry level aligns with the 50% Fibonacci retracement level on the 4-hour chart, a common area for continuations.",
      },
      {
        text: "R1 Pivot Resistance",
        tooltip: "The R1 daily pivot is acting as a ceiling for price, indicating potential resistance.",
      },
    ],
    aiConfidence: 88,
    relevantPairs: ["GBPUSD"],
  },

  // Existing Confluences (unchanged)
  {
    id: "confluence-bpr",
    category: "confluence",
    title: "BPR Resistance",
    subtitle: "Balanced Price Range",
    icon: Scale,
    color: "#f472b6",
    status: "Forming",
    statusColor: "amber",
    confidence: 75,
    relevantPairs: ["ALL"],
    bprHigh: "1.32850",
    bprMid: "1.32550",
    bprLow: "1.32250",
    duration: "4.5 hours",
    pricePosition: "Below",
    textbookExplanation: `
      <h3>Balances & Imbalances</h3>
      <p>Price oscillates between balanced and imbalanced states. A BPR marks a range where price seeks rebalancing.</p>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },
  {
    id: "confluence-weekly-open",
    category: "confluence",
    title: "Weekly Open",
    subtitle: "Key Pivot",
    icon: CalendarDays,
    color: "#fbbf24",
    status: "Tested",
    statusColor: "amber",
    confidence: 87,
    relevantPairs: ["ALL"],
    weeklyOpenPrice: "1.32411",
    currentPrice: "1.31980",
    marketState: "Discount",
    textbookExplanation: `
      <h3>Weekly Open Analysis</h3>
      <p>Defines premium vs. discount. Aligns higher timeframe bias.</p>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },
  {
    id: "confluence-liquidity-sweep",
    category: "confluence",
    title: "Liquidity Sweep",
    subtitle: "Stop Hunt",
    icon: Droplets,
    color: "#34d399",
    status: "Confirmed",
    statusColor: "emerald",
    confidence: 90,
    relevantPairs: ["ALL"],
    weeklyHigh: "1.33500",
    weeklyLow: "1.31000",
    dailyHigh: "1.32800",
    dailyLow: "1.31500",
    tokyoHigh: "1.32200",
    tokyoLow: "1.31800",
    textbookExplanation: `
      <h3>Liquidity Sweep</h3>
      <p>Sharp probes through highs/lows to trigger stops before reversal or continuation.</p>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },
  {
    id: "confluence-pivot-lines",
    category: "confluence",
    title: "Pivot Lines",
    subtitle: "Daily Pivots",
    icon: ArrowRightLeft,
    color: "#60a5fa",
    status: "Active",
    statusColor: "cyan",
    confidence: 78,
    relevantPairs: ["ALL"],
    pivots: {
      r3: "1.33800",
      r2: "1.33550",
      r1: "1.33150",
      p: "1.32900",
      s1: "1.32500",
      s2: "1.32250",
      s3: "1.31850",
    },
    textbookExplanation: `
      <h3>Pivot Probabilities</h3>
      <p>Statistical levels from prior session's H/L/C. Magnet/turn zones.</p>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },

  // New Confluences (5) — enhanced icons and consistent popup content
  {
    id: "confluence-fvg",
    category: "confluence",
    title: "Fair Value Gap",
    subtitle: "Inefficiency",
    icon: RectangleHorizontal,
    color: "#a78bfa", // violet
    status: "Forming",
    statusColor: "amber",
    confidence: 72,
    relevantPairs: ["ALL"],
    textbookExplanation: `
      <h3>Fair Value Gap (FVG)</h3>
      <p>Displacement leaves pricing inefficiency that price often revisits to rebalance before continuation.</p>
      <ul>
        <li>Mark HTF displacement gaps.</li>
        <li>Look for first revisit with LTF confirmation.</li>
        <li>Align with liquidity/pivots for confluence.</li>
      </ul>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },
  {
    id: "confluence-order-block",
    category: "confluence",
    title: "Order Block",
    subtitle: "Institutional Footprint",
    icon: CandlestickChart,
    color: "#f87171", // red
    status: "Active",
    statusColor: "emerald",
    confidence: 80,
    relevantPairs: ["ALL"],
    textbookExplanation: `
      <h3>Order Block (OB)</h3>
      <p>Last up/down candle before strong displacement; acts as mitigation zone.</p>
      <ul>
        <li>Prefer OBs aligned with HTF bias.</li>
        <li>Use body-to-wick range for zone.</li>
        <li>First touch with LTF confirmation is optimal.</li>
      </ul>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },
  {
    id: "confluence-session-range",
    category: "confluence",
    title: "Session Range",
    subtitle: "London/NY Killzones",
    icon: Clock,
    color: "#34d399", // emerald
    status: "Tested",
    statusColor: "emerald",
    confidence: 76,
    relevantPairs: ["ALL"],
    textbookExplanation: `
      <h3>Session Dynamics</h3>
      <p>Asian builds liquidity; London expands; NY continues or reverts.</p>
      <ul>
        <li>Map Asia range for liquidity traps.</li>
        <li>Watch LO/NYO for expansion.</li>
        <li>Confluence with HTF bias.</li>
      </ul>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },
  {
    id: "confluence-ema-200",
    category: "confluence",
    title: "200 EMA Bias",
    subtitle: "Dynamic S/R",
    icon: LineChart,
    color: "#60a5fa", // blue
    status: "Active",
    statusColor: "cyan",
    confidence: 69,
    relevantPairs: ["ALL"],
    textbookExplanation: `
      <h3>200 EMA</h3>
      <p>Widely tracked dynamic support/resistance and trend filter.</p>
      <ul>
        <li>Above = bullish bias; below = bearish bias.</li>
        <li>Use HTF for bias, LTF for timing.</li>
        <li>Combine with FVG/liquidity for entries.</li>
      </ul>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },
  {
    id: "confluence-round-number",
    category: "confluence",
    title: "Round Number",
    subtitle: "Psychological Level",
    icon: Target,
    color: "#fbbf24", // amber
    status: "Active",
    statusColor: "amber",
    confidence: 74,
    relevantPairs: ["ALL"],
    textbookExplanation: `
      <h3>Round Numbers / Bank Levels</h3>
      <p>00/50 handles attract liquidity and often act as magnet or reaction zones.</p>
      <ul>
        <li>Mark 00/50s across HTF.</li>
        <li>Seek sweeps and reclaim patterns.</li>
        <li>Use for partials and RR targeting.</li>
      </ul>
    `,
    imagePath: "/placeholder.svg?width=600&height=300",
  },
]
