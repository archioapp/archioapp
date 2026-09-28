export type UUID = string

export type EventType =
  | "route:change"
  | "instrument:selected"
  | "chart:symbol_changed"
  | "chart:interval_changed"
  | "chart:drawing_used"
  | "scenario:opened"
  | "scenario:changed"
  | "scenario:saved"
  | "scenario:cancelled"
  | "order:previewed"
  | "order:placed"
  | "order:modified"
  | "order:cancelled"
  | "sl:set"
  | "sl:removed"
  | "tp:set"
  | "tp:removed"
  | "community:entry_viewed"
  | "mentor:entry_viewed"
  | "mentor:copied"
  | "mentor:copy_modified"

export type Severity = "info" | "warning" | "critical"

export interface CopilotEvent {
  id: UUID
  type: EventType
  ts: number // epoch ms
  sessionId: UUID
  userId?: UUID
  context?: {
    instrument?: string // e.g. "EURUSD", "BTCUSD"
    mode?: "scalp" | "day" | "swing"
    timeframe?: string // "1m","15m","1h","4h","1d"
    route?: string
  }
  data?: Record<string, unknown> // flexible payload (entry, sl, tp, rr, balance, etc.)
}

export interface CopilotAction {
  id: string // e.g. "open-risk-sizer"
  label: string // UI label
  payload?: Record<string, unknown>
}

export interface CopilotSuggestion {
  id: UUID
  ts: number
  title: string
  detail?: string
  severity: Severity
  source: "risk" | "progress" | "copy" | "session" | "telemetry" | "confluence" | "custom"
  actions?: CopilotAction[] // 1‑click actions
  sticky?: boolean // stays visible until resolved
  meta?: Record<string, unknown>
}

export interface ActionHandlerCtx {
  lastEvent?: CopilotEvent
  pushEvent: (e: CopilotEvent) => void
}

export type ActionHandler = (action: CopilotAction, ctx: ActionHandlerCtx) => Promise<void> | void
