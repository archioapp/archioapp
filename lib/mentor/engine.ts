/* ═══════════════════════════════════════════════════════════════
   MENTOR DASHBOARD STATE ENGINE
   
   Computes the live dashboard state from a MentorTemplate + 
   current time. This is the brain that makes the dashboard
   time-aware and realistic.
   
   The engine answers: "What should the student see RIGHT NOW?"
   ═══════════════════════════════════════════════════════════════ */

import type {
  MentorTemplate,
  MentorDashboardState,
  SessionPhase,
  MentorStatus,
  DayValidity,
  NewsEvent,
  EntryModel,
  ConditionStatus,
} from "./types"

/** Get current hour as decimal in UTC (e.g. 13.5 = 1:30 PM UTC) */
function getCurrentHourUTC(now: Date): number {
  return now.getUTCHours() + now.getUTCMinutes() / 60
}

/** Compute session phase from current time */
function computeSessionPhase(template: MentorTemplate, now: Date): SessionPhase {
  const hour = getCurrentHourUTC(now)
  const { preSessionStart, killzoneStart, killzoneEnd, extendedEnd } = template.session

  if (hour >= killzoneStart && hour < killzoneEnd) return "KILLZONE"
  if (hour >= killzoneEnd && hour < extendedEnd) return "EXTENDED"
  if (hour >= preSessionStart && hour < killzoneStart) return "PRE_SESSION"
  return "CLOSED"
}

/** Compute human-readable time until next phase */
function computeTimeUntilNext(template: MentorTemplate, now: Date): string {
  const hour = getCurrentHourUTC(now)
  const { preSessionStart, killzoneStart, killzoneEnd, extendedEnd } = template.session
  const phase = computeSessionPhase(template, now)

  let targetHour: number
  let label: string

  switch (phase) {
    case "CLOSED":
      if (hour < preSessionStart) {
        targetHour = preSessionStart
        label = "pre-session"
      } else {
        // After extended end -- next day
        targetHour = preSessionStart + 24
        label = "next pre-session"
      }
      break
    case "PRE_SESSION":
      targetHour = killzoneStart
      label = "killzone"
      break
    case "KILLZONE":
      targetHour = killzoneEnd
      label = "killzone close"
      break
    case "EXTENDED":
      targetHour = extendedEnd
      label = "session end"
      break
    default:
      targetHour = preSessionStart
      label = "next session"
  }

  const diffMinutes = Math.max(0, Math.round((targetHour - hour) * 60))
  if (diffMinutes >= 60) {
    const h = Math.floor(diffMinutes / 60)
    const m = diffMinutes % 60
    return m > 0 ? `${h}h ${m}m until ${label}` : `${h}h until ${label}`
  }
  return `${diffMinutes}m until ${label}`
}

/** Compute day validity */
function computeDayValidity(template: MentorTemplate, now: Date): { validity: DayValidity; note: string } {
  const dayOfWeek = now.getUTCDay()
  const rule = template.dayRules.find(r => r.day === dayOfWeek)
  if (!rule) return { validity: "VALID", note: "" }

  // Check Friday cutoff
  if (rule.validity === "CONDITIONAL" && rule.cutoffHourUTC) {
    const hour = getCurrentHourUTC(now)
    if (hour >= rule.cutoffHourUTC) {
      return { validity: "INVALID", note: rule.note || "Past cutoff time" }
    }
  }

  return { validity: rule.validity, note: rule.note || "" }
}

/** Compute mentor status from session phase */
function computeMentorStatus(phase: SessionPhase): MentorStatus {
  switch (phase) {
    case "KILLZONE": return "ACTIVE"
    case "PRE_SESSION":
    case "EXTENDED": return "WAITING"
    default: return "OFFLINE"
  }
}

/** Generate simulated news events based on current time */
function generateSimulatedNews(now: Date): NewsEvent[] {
  const dayOfWeek = now.getUTCDay()
  const hour = getCurrentHourUTC(now)
  const events: NewsEvent[] = []

  // Simulate realistic news events based on time of day
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Pre-market economic data (8:30 AM ET = 12:30 UTC)
    if (hour < 13) {
      events.push({
        id: "n1",
        title: "Initial Jobless Claims",
        currency: "USD",
        time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 30).toISOString(),
        severity: "MEDIUM",
        impact: "CAUTION",
        cooldownMinutes: 0,
        note: "Reduce position size by 50%",
      })
    }

    if (dayOfWeek === 3) {
      events.push({
        id: "n2",
        title: "FOMC Minutes",
        currency: "USD",
        time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0).toISOString(),
        severity: "HIGH",
        impact: "BLOCKING",
        cooldownMinutes: 30,
        note: "No trading 30 min before and after release",
      })
    }

    if (dayOfWeek === 5) {
      events.push({
        id: "n3",
        title: "Non-Farm Payrolls",
        currency: "USD",
        time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 30).toISOString(),
        severity: "HIGH",
        impact: "BLOCKING",
        cooldownMinutes: 30,
        note: "No trading until 30 min after release",
      })
    }
  }

  // Filter: only show events within next 4 hours
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000)
  return events.filter(e => {
    const eventTime = new Date(e.time)
    return eventTime <= fourHoursFromNow
  })
}

/** 
 * Update entry model conditions based on current session state.
 * This makes the dashboard LIVE -- conditions toggle based on real time.
 */
function computeEntryModelState(
  model: EntryModel,
  phase: SessionPhase,
  dayValidity: DayValidity,
): EntryModel {
  const updatedConditions = model.conditions.map(c => {
    // Auto-compute time-dependent conditions
    if (c.label.toLowerCase().includes("killzone") || c.label.toLowerCase().includes("session")) {
      const newStatus: ConditionStatus = phase === "KILLZONE" ? "MET" : "PENDING"
      return { ...c, status: newStatus, evaluatedAt: new Date().toISOString() }
    }
    // HTF bias is always set pre-session by the mentor
    if (c.label.toLowerCase().includes("htf") || c.label.toLowerCase().includes("bias")) {
      return { ...c, status: "MET" as ConditionStatus, evaluatedAt: new Date().toISOString() }
    }
    return c
  })

  const metCount = updatedConditions.filter(c => c.status === "MET").length
  const allMet = metCount === updatedConditions.length
  const someMet = metCount > 0

  let state = model.state
  if (phase === "CLOSED" || dayValidity === "INVALID") {
    state = "INACTIVE"
  } else if (allMet) {
    state = "TRIGGERED"
  } else if (someMet && (phase === "KILLZONE" || phase === "PRE_SESSION")) {
    state = "FORMING"
  } else if (phase === "EXTENDED") {
    state = "INACTIVE"
  }

  return { ...model, conditions: updatedConditions, state }
}

/** Create a simulated "demo" time that's always inside the killzone */
function getDemoTime(template: MentorTemplate): Date {
  const now = new Date()
  // Set UTC hour to killzone start + 30 min
  const targetHour = Math.floor(template.session.killzoneStart)
  const targetMin = Math.round((template.session.killzoneStart - targetHour) * 60) + 30
  now.setUTCHours(targetHour, targetMin, 0, 0)
  // Make sure it's a Tuesday (valid day)
  const day = now.getUTCDay()
  if (day === 0) now.setUTCDate(now.getUTCDate() + 2)
  else if (day === 6) now.setUTCDate(now.getUTCDate() + 3)
  return now
}

/** 
 * MAIN ENGINE: Compute the full dashboard state from template + current time.
 * This is called on every render tick (every 30 seconds in practice).
 * 
 * @param demoMode - When true, simulates a time inside the killzone so the 
 *   dashboard is always interactive and alive, regardless of real time.
 */
export function computeDashboardState(
  template: MentorTemplate,
  now: Date = new Date(),
  demoMode: boolean = false,
): MentorDashboardState {
  // In demo mode, override time to be inside the killzone
  if (demoMode) {
    now = getDemoTime(template)
  }
  
  const phase = computeSessionPhase(template, now)
  const mentorStatus = computeMentorStatus(phase)
  const { validity: dayValidity, note: dayNote } = computeDayValidity(template, now)
  const timeUntilNext = computeTimeUntilNext(template, now)
  const activeNews = generateSimulatedNews(now)

  // Compute session label
  const sessionLabels: Record<SessionPhase, string> = {
    PRE_SESSION: "Pre-Session Analysis",
    KILLZONE: "NY Killzone ACTIVE",
    EXTENDED: "Extended Session (Management Only)",
    CLOSED: "Session Closed",
  }
  const sessionLabel = sessionLabels[phase]

  // Compute entry models with live state
  const entryModels = template.entryModels.map(m =>
    computeEntryModelState(m, phase, dayValidity)
  )

  // Count conditions
  const allConditions = entryModels.flatMap(m => m.conditions)
  const conditionsMetCount = allConditions.filter(c => c.status === "MET").length
  const conditionsTotalCount = allConditions.length

  // Simulated war rooms
  const activeWarRooms = phase === "KILLZONE" ? [
    {
      id: "wr-demo",
      mentorId: template.id,
      instrument: "EUR/USD",
      direction: template.defaultBias.direction,
      modelId: template.entryModels[0]?.id || "",
      thesis: "NY open displacement forming. Watching for OB sweep at 1.0865 level.",
      phase: "FORMING" as const,
      createdAt: new Date(now.getTime() - 12 * 60 * 1000).toISOString(), // 12 min ago
      participantCount: 24,
      messageCount: 8,
    },
  ] : []

  return {
    mentorStatus,
    sessionPhase: phase,
    sessionLabel,
    timeUntilNext,
    dayValidity,
    dayNote,
    activeNews,
    bias: template.defaultBias,
    entryModels,
    riskGuidance: template.riskGuidance,
    activeWarRooms,
    conditionsMetCount,
    conditionsTotalCount,
    currentTime: now,
  }
}

/** Hook helper: format a time string for display */
export function formatSessionTime(hourUTC: number, timezone: string): string {
  const h = Math.floor(hourUTC)
  const m = Math.round((hourUTC - h) * 60)
  // Convert to ET (UTC-4 for EDT)
  const etHour = ((h - 4) + 24) % 24
  const period = etHour >= 12 ? "PM" : "AM"
  const displayHour = etHour === 0 ? 12 : etHour > 12 ? etHour - 12 : etHour
  return `${displayHour}:${m.toString().padStart(2, "0")} ${period} ET`
}
