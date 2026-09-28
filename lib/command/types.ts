/* ────────────────────────────────────────────────
   ARCHIO COMMAND LAYER — Core Type Definitions
   ──────────────────────────────────────────────── */

export type IntentClass =
  | "show"
  | "compare"
  | "explain"
  | "guide"
  | "drill"
  | "navigate"

export type EntityType =
  | "mentor"
  | "community"
  | "account"
  | "accountType"
  | "instrument"
  | "timeframe"
  | "session"
  | "setup"
  | "confluence"
  | "tag"
  | "dateRange"
  | "planRef"
  | "macroEvent"

export interface ExtractedEntity {
  type: EntityType
  value: string
  confidence: number
}

export interface ParsedIntent {
  intent: IntentClass
  entities: ExtractedEntity[]
  raw: string
  timeframe?: string
  filters?: Record<string, string>
}

/* ── Result Object Types ── */

export type ResultObjectType =
  | "forecast-card"
  | "entry-card"
  | "mentor-card"
  | "account-card"
  | "comparison-board"
  | "stat-grid"
  | "performance-strip"
  | "timeline-strip"
  | "confluence-cluster"
  | "win-rate-table"
  | "macro-panel"
  | "plan-checklist"
  | "alert-banner"
  | "summary-text"
  | "action-buttons"

export interface ForecastCardData {
  id: string
  mentor: string
  mentorAvatar?: string
  pair: string
  direction: "LONG" | "SHORT"
  confidence: number
  status: "active" | "hit_tp" | "hit_sl" | "pending" | "expired"
  entry?: number
  sl?: number
  tp?: number
  confluences: string[]
  createdAt: string
}

export interface EntryCardData {
  id: string
  pair: string
  direction: "LONG" | "SHORT"
  pnl: number
  rMultiple: number
  session: string
  setup: string
  confluences: string[]
  date: string
  accountName?: string
}

export interface MentorCardData {
  id: string
  name: string
  avatar?: string
  accuracy: number
  totalCalls: number
  specialization: string[]
  winRate: number
  isFollowed: boolean
}

export interface AccountCardData {
  id: string
  name: string
  type: "prop" | "personal" | "demo" | "funded"
  broker: string
  balance: number
  equity: number
  drawdown: number
  phase?: string
  winRate: number
}

export interface ComparisonBoardData {
  title: string
  leftLabel: string
  rightLabel: string
  metrics: Array<{
    label: string
    leftValue: string | number
    rightValue: string | number
    leftColor?: "emerald" | "rose" | "amber" | "slate"
    rightColor?: "emerald" | "rose" | "amber" | "slate"
  }>
}

export interface StatGridData {
  items: Array<{
    label: string
    value: string | number
    change?: number
    color?: "emerald" | "rose" | "amber" | "cyan" | "purple" | "slate"
  }>
}

export interface MacroPanelData {
  events: Array<{
    name: string
    time: string
    impact: "high" | "medium" | "low"
    currency: string
    forecast?: string
    previous?: string
    affectedPairs: string[]
  }>
}

export interface PlanChecklistData {
  items: Array<{
    label: string
    checked: boolean
    status: "on-track" | "warning" | "violation" | "pending"
    detail?: string
  }>
  compliance: number
}

export interface AlertBannerData {
  type: "warning" | "info" | "success" | "danger"
  title: string
  message: string
}

export interface WinRateTableData {
  headers: string[]
  rows: Array<{
    label: string
    values: (string | number)[]
    highlight?: boolean
  }>
}

/* ── Result Object Union ── */

export interface ResultObject {
  type: ResultObjectType
  data:
    | ForecastCardData
    | ForecastCardData[]
    | EntryCardData
    | EntryCardData[]
    | MentorCardData
    | MentorCardData[]
    | AccountCardData
    | AccountCardData[]
    | ComparisonBoardData
    | StatGridData
    | MacroPanelData
    | PlanChecklistData
    | AlertBannerData
    | WinRateTableData
    | string // summary-text
}

/* ── Suggestion Chips ── */

export type SuggestionCategory =
  | "compare"
  | "drill"
  | "explain"
  | "navigate"
  | "action"
  | "synthesize"
  | "monitor"

export interface SuggestionChip {
  id: string
  label: string
  category: SuggestionCategory
  query?: string  // pre-filled query when clicked
  route?: string  // navigation target
  icon?: string
}

/* ── Command Response ── */

export interface CommandResponse {
  /** One-line answer / result framing */
  framing: string
  /** Rendered result objects */
  objects: ResultObject[]
  /** One concise intelligence takeaway */
  insight?: string
  /** 3-5 next-step suggestion chips */
  suggestions: SuggestionChip[]
  /** Data source status for transparency */
  sourceStatus?: Record<string, "live" | "partial" | "mock" | "unavailable">
}

/* ── Command Layer Message ── */

export interface CommandMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  response?: CommandResponse
  isStreaming?: boolean
}

/* ── Data Source Capability Matrix ── */

export type DataSourceStatus = "live" | "partial" | "mock" | "unavailable"

export interface DataCapabilityMatrix {
  forecasts: DataSourceStatus
  mentors: DataSourceStatus
  mentorLiveCalls: DataSourceStatus
  journalEntries: DataSourceStatus
  accounts: DataSourceStatus
  communities: DataSourceStatus
  followedMentors: DataSourceStatus
  userPlans: DataSourceStatus
  psychologyCheckins: DataSourceStatus
  macroCalendar: DataSourceStatus
  marketIntelligence: DataSourceStatus
  scenarioHistory: DataSourceStatus
  bookmarks: DataSourceStatus
  leaderboards: DataSourceStatus
  strategyProfiles: DataSourceStatus
  sessionPerformance: DataSourceStatus
  confluenceLibrary: DataSourceStatus
}

export const CAPABILITY_MATRIX: DataCapabilityMatrix = {
  forecasts: "live",
  mentors: "live",
  mentorLiveCalls: "partial",
  journalEntries: "live",
  accounts: "live",
  communities: "live",
  followedMentors: "live",
  userPlans: "partial",
  psychologyCheckins: "partial",
  macroCalendar: "mock",
  marketIntelligence: "partial",
  scenarioHistory: "partial",
  bookmarks: "partial",
  leaderboards: "partial",
  strategyProfiles: "partial",
  sessionPerformance: "partial",
  confluenceLibrary: "live",
}
