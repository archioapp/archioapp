export type ForecastView = "feed" | "record" | "leaderboard" | "archive"

export type ForecastDirection = "LONG" | "SHORT"

/**
 * Full lifecycle states for a forecast.
 * A forecast moves: draft -> submitted -> active -> (near_expiry) -> expired | awaiting_resolution -> resolved_win | resolved_loss | invalidated
 */
export type ForecastStatus =
  | "active"
  | "near_expiry"
  | "awaiting_resolution"
  | "resolved_win"
  | "resolved_loss"
  | "expired"
  | "invalidated"

export type ForecastInstrument = "Forex" | "Crypto" | "Indices" | "Commodities"

export type UserRole = "student" | "trader" | "mentor"
export type UserTier = "beginner" | "intermediate" | "advanced" | "expert"

export interface ForecastUser {
  id: string
  name: string
  avatar?: string
  role: UserRole
  tier: UserTier
  isMentor: boolean
  isVerified: boolean
  communityId?: string
  communityName?: string
  /** Total resolved forecasts this user has */
  resolvedCount?: number
  /** Overall accuracy across resolved forecasts */
  overallAccuracy?: number
}

export interface ForecastConfluence {
  id: string
  name: string
  strength: number
  category: "structure" | "liquidity" | "momentum" | "session" | "pattern"
}

export interface ForecastItem {
  id: string
  user: ForecastUser
  instrument: string
  instrumentType: ForecastInstrument
  direction: ForecastDirection
  timeframe: string
  entry: string
  stopLoss: string
  takeProfit: string
  riskReward: string
  confidence: number
  commentary: string
  invalidation?: string
  chartImageUrl?: string
  confluences: ForecastConfluence[]
  status: ForecastStatus
  accuracy?: number
  createdAt: string
  resolvedAt?: string
  expiresAt?: string
  likes: number
  comments: number
  views: number
  mentorReview?: {
    mentorName: string
    mentorId: string
    rating: number
    feedback: string
    reviewedAt: string
  }
  /** Which community this forecast was submitted under */
  communityContext?: {
    id: string
    name: string
  }
  /** Lifecycle timeline entries */
  timeline?: {
    event: string
    timestamp: string
    detail?: string
  }[]
}

export interface LeaderboardEntry {
  rank: number
  user: ForecastUser
  totalForecasts: number
  resolvedForecasts: number
  accuracy: number
  winRate: number
  avgRiskReward: string
  currentStreak: number
  bestStreak: number
  points: number
  trend: "up" | "down" | "stable"
  recentChange: number
  /** Minimum 5 resolved to qualify */
  isQualified: boolean
}

export interface ArchiveDay {
  date: string
  forecasts: ForecastItem[]
  totalWins: number
  totalLosses: number
  totalActive: number
}

/** Status config helper return type */
export interface StatusConfig {
  label: string
  shortLabel: string
  description: string
  color: string
  iconName: string
}

/** Lifecycle state descriptions for tooltips */
export const LIFECYCLE_DESCRIPTIONS: Record<ForecastStatus, string> = {
  active: "This prediction is live. The market has not reached the target or stop loss yet.",
  near_expiry: "This prediction expires within 4 hours. Outcome pending.",
  awaiting_resolution: "This prediction has expired and is being reviewed for outcome verification.",
  resolved_win: "Target was reached. This prediction was correct.",
  resolved_loss: "Stop loss was hit. This prediction was incorrect.",
  expired: "The prediction window closed without the target or stop loss being reached.",
  invalidated: "This prediction was invalidated due to extraordinary market conditions or rule violations.",
}
