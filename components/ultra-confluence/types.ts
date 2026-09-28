import {
  type LucideIcon,
  TrendingUp,
  Droplets,
  Scale,
  ScanLine,
  FlipHorizontal2,
  Box,
  Hammer,
  Clock,
  Repeat,
  CalendarClock,
} from "lucide-react"

export type UltraConfluenceId =
  | "htf-structure"
  | "liquidity-sweep"
  | "bpr"
  | "fvg"
  | "ifvg"
  | "order-block"
  | "breaker-block"
  | "bank-session"
  | "po3"
  | "opens-pd"

export type UltraConfluence = {
  id: UltraConfluenceId
  name: string
  icon: LucideIcon
  description: string
}

export const ULTRA_CONFLUENCES: UltraConfluence[] = [
  {
    id: "htf-structure",
    name: "HTF Structure",
    icon: TrendingUp,
    description: "BOS, CHoCH, trend bias, risk on/off, DXY context.",
  },
  {
    id: "liquidity-sweep",
    name: "Liquidity Sweep",
    icon: Droplets,
    description: "Liquidity hunts, stop runs, engineered moves.",
  },
  { id: "bpr", name: "BPR", icon: Scale, description: "Premium/discount zones and the 50% midpoint." },
  { id: "fvg", name: "FVG", icon: ScanLine, description: "Identify HTF/LTF imbalances and gaps." },
  { id: "ifvg", name: "iFVG", icon: FlipHorizontal2, description: "Inverted FVGs after flips and retests." },
  { id: "order-block", name: "Order Block", icon: Box, description: "Institutional footprints and mitigation rules." },
  {
    id: "breaker-block",
    name: "Breaker Block",
    icon: Hammer,
    description: "Failed OB flipping polarity after a sweep.",
  },
  {
    id: "bank-session",
    name: "Bank Session Filter",
    icon: Clock,
    description: "Session windows with interactive map and timeline.",
  },
  { id: "po3", name: "PO3", icon: Repeat, description: "Accumulation → Manipulation → Distribution." },
  {
    id: "opens-pd",
    name: "Weekly/Daily Open + PD",
    icon: CalendarClock,
    description: "Opens with premium/discount context.",
  },
]
