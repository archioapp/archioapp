// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIO PROFILE OS - TYPE DEFINITIONS
// Role-aware identity surface with verifiable proof + self-expression
// ═══════════════════════════════════════════════════════════════════════════════

import { Role } from "@/lib/stores/useSession"

// ─────────────────────────────────────────────────────────────────────────────
// TRUST LEVELS - How much to trust different data sources
// ─────────────────────────────────────────────────────────────────────────────
export type TrustLevel = 
  | "verified"        // Cryptographically proven by platform (journal hashes, executions)
  | "linked"          // Connected external account (TradingView, Discord)
  | "mentor-reviewed" // Reviewed/approved by assigned mentor
  | "self-reported"   // User claims, not verified
  | "imported"        // Imported from external system

// ─────────────────────────────────────────────────────────────────────────────
// PRIVACY TIERS - Who can see what
// ─────────────────────────────────────────────────────────────────────────────
export type PrivacyTier = "public" | "community" | "private"

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE LEVELS
// ─────────────────────────────────────────────────────────────────────────────
export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "elite"

// ─────────────────────────────────────────────────────────────────────────────
// BADGE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
export type BadgeCategory = 
  | "streak"       // Win streaks, consistency
  | "milestone"    // Trade count, R milestones
  | "community"    // Helping others, forecasts
  | "special"      // Events, early adopter
  | "mentor"       // Mentor-awarded badges

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  earnedAt: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE STATS - Universal to all roles
// ─────────────────────────────────────────────────────────────────────────────
export interface PerformanceStats {
  totalTrades: number
  wins: number
  losses: number
  winRate: number
  avgRR: number
  totalR: number
  bestMonth: { month: string; r: number }
  currentStreak: number
  longestStreak: number
  sharpeRatio?: number
  profitFactor?: number
  // Timeframe breakdown
  last7Days: { r: number; trades: number; winRate: number }
  last30Days: { r: number; trades: number; winRate: number }
  allTime: { r: number; trades: number; winRate: number }
  trustLevel: TrustLevel
}

// ─────────────────────────────────────────────────────────────────────────────
// TRADING IDENTITY - Style and methodology
// ─────────────────────────────────────────────────────────────────────────────
export interface TradingIdentity {
  style: "scalp" | "day" | "swing" | "position" | "hybrid"
  methodology: string
  primaryMarkets: string[]
  primaryInstruments: string[]
  preferredSessions: string[]
  experienceYears: number
  experienceLevel: ExperienceLevel
  bio: string
  tradingPhilosophy?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL STATS
// ─────────────────────────────────────────────────────────────────────────────
export interface SocialStats {
  followers: number
  following: number
  forecasts: number
  forecastAccuracy: number
  warRoomsJoined: number
  warRoomsHosted: number
  helpfulVotes: number
  communityRank?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTED ACCOUNTS
// ─────────────────────────────────────────────────────────────────────────────
export interface ConnectedAccount {
  platform: "tradingview" | "discord" | "twitter" | "telegram" | "myfxbook" | "broker"
  username: string
  linkedAt: string
  verified: boolean
  profileUrl?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT ACTIVITY
// ─────────────────────────────────────────────────────────────────────────────
export type ActivityType = 
  | "trade"
  | "forecast"
  | "war-room"
  | "journal"
  | "badge"
  | "milestone"
  | "mentor-session"

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

// ─────────────────────────────────────────────────────────────────────────────
// MENTOR-SPECIFIC MODULES
// ─────────────────────────────────────────────────────────────────────────────
export interface MentorProfile {
  mentorSince: string
  totalMentees: number
  activeMentees: number
  menteeSuccessRate: number
  sessionCount: number
  avgMenteeImprovement: number
  methodology: string
  specializations: string[]
  availability: {
    timezone: string
    slots: { day: string; times: string[] }[]
  }
  testimonials: {
    from: string
    avatar: string
    text: string
    rating: number
    date: string
  }[]
  pricing?: {
    sessionRate: number
    packageRates: { sessions: number; rate: number }[]
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT-SPECIFIC MODULES
// ─────────────────────────────────────────────────────────────────────────────
export interface StudentProfile {
  assignedMentor?: {
    id: string
    name: string
    avatar: string
  }
  enrolledCourses: string[]
  completedLessons: number
  totalLessons: number
  currentPhase: string
  learningGoals: string[]
  weeklyCommitment: number
  nextSession?: {
    date: string
    topic: string
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL PROFILE TYPE
// ─────────────────────────────────────────────────────────────────────────────
export interface FullProfile {
  // Core identity
  id: string
  handle: string
  displayName: string
  avatar: string
  bannerUrl?: string
  role: Role
  verified: boolean
  verifiedAt?: string
  joinedAt: string
  lastActive: string
  
  // Universal modules
  identity: TradingIdentity
  stats: PerformanceStats
  social: SocialStats
  badges: Badge[]
  connectedAccounts: ConnectedAccount[]
  recentActivity: ActivityItem[]
  
  // Role-specific modules (additive, not separate)
  mentorProfile?: MentorProfile
  studentProfile?: StudentProfile
  
  // Privacy settings
  privacy: {
    stats: PrivacyTier
    activity: PrivacyTier
    connections: PrivacyTier
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE CARD (For hover cards and compact views)
// ─────────────────────────────────────────────────────────────────────────────
export interface ProfileCard {
  id: string
  handle: string
  displayName: string
  avatar: string
  role: Role
  verified: boolean
  level: ExperienceLevel
  winRate: number
  totalR: number
  streak: number
  badges: Badge[]
  isFollowing: boolean
  isOnline: boolean
}
