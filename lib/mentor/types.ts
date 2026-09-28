/* ═══════════════════════════════════════════════════════════════
   MENTOR OPERATING SYSTEM -- TYPE DEFINITIONS
   
   The mentor dashboard is the mentor's live operating method
   made interactive. Every type here represents a piece of the
   mentor's decision-making system, not a UI widget.
   ═══════════════════════════════════════════════════════════════ */

// ── Session & Timing ──

export type SessionId = "ny" | "london" | "asia" | "custom"
export type SessionPhase = "PRE_SESSION" | "KILLZONE" | "EXTENDED" | "CLOSED"
export type DayValidity = "VALID" | "CONDITIONAL" | "INVALID"
export type MentorStatus = "ACTIVE" | "WAITING" | "OFFLINE"

export interface SessionWindow {
  id: SessionId
  label: string
  preSessionStart: number
  killzoneStart: number
  killzoneEnd: number
  extendedEnd: number
  timezone: string
  timezoneLabel: string
}

export interface DayRule {
  day: number
  validity: DayValidity
  note?: string
  cutoffHourUTC?: number
}

// ── News ──

export type NewsSeverity = "HIGH" | "MEDIUM" | "LOW"
export type NewsImpact = "BLOCKING" | "CAUTION" | "IGNORE"

export interface NewsEvent {
  id: string
  title: string
  currency: string
  time: string
  severity: NewsSeverity
  impact: NewsImpact
  cooldownMinutes: number
  note?: string
}

// ── Bias ──

export type BiasDirection = "BULLISH" | "BEARISH" | "NEUTRAL"

export interface MarketBias {
  direction: BiasDirection
  instrument: string
  timeframe: string
  reasoning: string
  updatedAt: string
  confidence: number
}

// ── Education Content (for Entry Model deep-dives) ──

export type EducationMediaType = "video" | "image" | "diagram" | "annotated_chart"

export interface EducationMedia {
  id: string
  type: EducationMediaType
  /** URL or placeholder path */
  src: string
  /** Thumbnail for video */
  thumbnail?: string
  caption: string
  duration?: string // e.g. "4:32" for video
}

export interface EducationStep {
  id: string
  stepNumber: number
  title: string
  description: string
  /** What the student should be looking for visually */
  visualCue: string
  /** Mentor's personal tip for this step */
  mentorTip?: string
  media?: EducationMedia
}

export interface ModelEducation {
  /** Long-form explanation of this entry model */
  overview: string
  /** Step-by-step walkthrough */
  steps: EducationStep[]
  /** Common mistakes students make */
  commonMistakes: string[]
  /** Psychology notes -- what the student should be feeling/thinking */
  psychologyNotes: string
  /** Links to chart examples */
  chartExamples: EducationMedia[]
  /** Key takeaway */
  keyTakeaway: string
}

// ── Entry Models ──

export type ConditionStatus = "MET" | "PENDING" | "FAILED"
export type ModelState = "ACTIVE" | "FORMING" | "INACTIVE" | "TRIGGERED"

export interface EntryCondition {
  id: string
  label: string
  description: string
  status: ConditionStatus
  evaluatedAt?: string
  /** What the student should look for to confirm this condition */
  whatToWatch?: string
  /** The timeframe to check this condition on */
  checkTimeframe?: string
}

export interface EntryModel {
  id: string
  name: string
  shortName: string
  description: string
  session: SessionId
  state: ModelState
  conditions: EntryCondition[]
  invalidationRules: string[]
  targetRMultiple: number
  instruments: string[]
  /** Deep education content */
  education?: ModelEducation
  /** The ideal timeframe for execution */
  executionTimeframe?: string
  /** Win rate from backtesting (display only) */
  historicalWinRate?: number
  /** Average R from backtesting */
  averageR?: number
  /** Number of trades backtested */
  sampleSize?: number
}

// ── Risk Guidance ──

export interface RiskGuidance {
  maxRiskPerTrade: number
  maxTradesPerDay: number
  maxDailyLoss: number
  minRiskReward: number
  maxConcurrentTrades: number
  noAveraging: boolean
  noMartingale: boolean
  additionalRules: string[]
}

// ── War Room ──

export type WarRoomPhase = "FORMING" | "ACTIVE" | "EXECUTED" | "REVIEW" | "CLOSED"

export interface WarRoom {
  id: string
  mentorId: string
  instrument: string
  direction: BiasDirection
  modelId: string
  thesis: string
  phase: WarRoomPhase
  createdAt: string
  closedAt?: string
  participantCount: number
  messageCount: number
}

// ── Mentor AI Persona ──

export interface MentorAIPersona {
  voice: string
  coreBeliefs: string[]
  terminology: string[]
  refusalPattern: string
  patience: string
  systemPromptPrefix: string
  /** Quick-reply suggestions */
  suggestedQuestions?: string[]
}

// ── Full Template ──

export interface MentorTemplate {
  id: string
  name: string
  mentorName: string
  mentorAvatar?: string
  mentorTitle: string
  methodology: string
  accentColor: string
  session: SessionWindow
  dayRules: DayRule[]
  newsRules: {
    highImpactCooldown: number
    mediumImpactSizeReduction: number
    lowImpactAction: "IGNORE"
  }
  defaultBias: MarketBias
  entryModels: EntryModel[]
  riskGuidance: RiskGuidance
  aiPersona: MentorAIPersona
  methodVault: MethodVaultEntry[]
}

export interface MethodVaultEntry {
  id: string
  title: string
  category: "lesson" | "trade_plan" | "chart_example" | "war_room_archive"
  description: string
  tags: string[]
  createdAt: string
}

// ── Computed Dashboard State ──

export interface MentorDashboardState {
  mentorStatus: MentorStatus
  sessionPhase: SessionPhase
  sessionLabel: string
  timeUntilNext: string
  dayValidity: DayValidity
  dayNote: string
  activeNews: NewsEvent[]
  bias: MarketBias
  entryModels: EntryModel[]
  riskGuidance: RiskGuidance
  activeWarRooms: WarRoom[]
  conditionsMetCount: number
  conditionsTotalCount: number
  /** Current server time for display */
  currentTime: Date
}
