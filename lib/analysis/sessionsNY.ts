import { DateTime } from "luxon"

const TZ = process.env.MARKET_TZ || "America/New_York"

export type SessionKey = "asia" | "london" | "newyork"
export type SessionWindow = { startMs: number; endMs: number; status: "UPCOMING" | "LIVE" | "COMPLETED" }

type Window = { start: number; end: number; label: string } // epoch ms; label like "Thu, Aug 28"
type Status = "UPCOMING" | "LIVE" | "COMPLETED"

function parseHHMM(val: string) {
  const [h, m] = val.split(":").map(Number)
  return { h: h || 0, m: m || 0 }
}

function todayNY() {
  return DateTime.now().setZone(TZ)
}

function yyyyMMddNY(dt: DateTime) {
  return dt.toFormat("yyyy-LL-dd")
}

export function getSessionDefs() {
  // read from env or default
  const A = process.env.SESSION_ASIA || "17:00-00:00"
  const L = process.env.SESSION_LONDON || "02:00-08:00"
  const N = process.env.SESSION_NEWYORK || "08:00-17:00"
  return { A, L, N }
}

export function computeWindowForDate(dateNY: DateTime, fromTo: string): Window {
  // fromTo example "17:00-00:00"
  const [from, to] = fromTo.split("-")
  const { h: fh, m: fm } = parseHHMM(from)
  const { h: th, m: tm } = parseHHMM(to)

  if (isNaN(fh) || isNaN(fm) || isNaN(th) || isNaN(tm)) {
    console.error("[v0] Invalid time format in session:", fromTo)
    throw new Error(`Invalid time format: ${fromTo}`)
  }

  const start = dateNY.set({ hour: fh, minute: fm, second: 0, millisecond: 0 })
  let end = dateNY.set({ hour: th, minute: tm, second: 0, millisecond: 0 })

  // handle 00:00 (crossing midnight)
  if (end <= start) end = end.plus({ days: 1 })

  if (!start.isValid || !end.isValid) {
    console.error("[v0] Invalid DateTime objects:", { start: start.invalidReason, end: end.invalidReason })
    throw new Error(`Invalid DateTime calculation for session: ${fromTo}`)
  }

  return { start: start.toMillis(), end: end.toMillis(), label: dateNY.toFormat("ccc, LLL dd") }
}

export function sessionWindowForNow(session: "asia" | "london" | "newyork"): { window: Window; status: Status } {
  const now = todayNY()
  const defs = getSessionDefs()
  const baseDate = now // the "anchor" calendar day

  const f = (s: string) => computeWindowForDate(baseDate, s)

  const win = session === "asia" ? f(defs.A) : session === "london" ? f(defs.L) : f(defs.N)

  let status: Status = "UPCOMING"
  const t = now.toMillis()
  if (t >= win.start && t < win.end) status = "LIVE"
  else if (t >= win.end) status = "COMPLETED"

  return { window: win, status }
}

export function previousCompletedWindow(session: "asia" | "london" | "newyork"): Window {
  const now = todayNY()
  const defs = getSessionDefs()
  const baseDate = now.minus({ days: 1 }) // go back one day and compute
  const f = (s: string) => computeWindowForDate(baseDate, s)
  return session === "asia" ? f(defs.A) : session === "london" ? f(defs.L) : f(defs.N)
}

export function getActiveOrPrev(sessionKey: SessionKey, nowMs: number): { startMs: number; endMs: number } {
  const now = DateTime.fromMillis(nowMs).setZone(TZ)
  const defs = getSessionDefs()

  // Check if it's weekend (Saturday=6, Sunday=7)
  const isWeekend = now.weekday >= 6

  // Get current session window
  const currentWindow = getSessionWindowsNY(nowMs)[sessionKey]

  if (currentWindow.status === "LIVE") {
    // If session is live, use current window but cap end time to now
    return {
      startMs: currentWindow.startMs,
      endMs: Math.min(currentWindow.endMs, nowMs),
    }
  } else if (currentWindow.status === "COMPLETED") {
    // If session is completed, use the full completed window
    return {
      startMs: currentWindow.startMs,
      endMs: currentWindow.endMs,
    }
  } else {
    // If session is upcoming, use previous day's completed session
    // Special handling for Asia session which crosses midnight
    let baseDate = now.minus({ days: 1 })

    // For Asia session on weekends, go back to Friday
    if (sessionKey === "asia" && isWeekend) {
      baseDate = now.minus({ days: now.weekday - 5 + 1 }) // Go to previous Friday
    }

    const timeRange = sessionKey === "asia" ? defs.A : sessionKey === "london" ? defs.L : defs.N
    const prevWindow = computeWindowForDate(baseDate, timeRange)

    return {
      startMs: prevWindow.start,
      endMs: prevWindow.end,
    }
  }
}

export function getSessionWindowsNY(nowMs = Date.now()): Record<SessionKey, SessionWindow> {
  const now = DateTime.fromMillis(nowMs).setZone(TZ)
  const defs = getSessionDefs()

  // Check if it's weekend (Saturday=6, Sunday=7)
  const isWeekend = now.weekday >= 6

  // If it's weekend, use Friday's data instead
  const targetDate = isWeekend ? now.minus({ days: now.weekday - 5 }) : now

  const computeSession = (sessionKey: SessionKey, timeRange: string): SessionWindow => {
    const baseDate = targetDate // use Friday on weekends, current day otherwise
    const window = computeWindowForDate(baseDate, timeRange)

    let status: "UPCOMING" | "LIVE" | "COMPLETED" = "UPCOMING"

    if (isWeekend) {
      // On weekends, always show Friday's sessions as COMPLETED
      status = "COMPLETED"
    } else {
      // Normal weekday logic
      if (nowMs >= window.start && nowMs < window.end) status = "LIVE"
      else if (nowMs >= window.end) status = "COMPLETED"
    }

    return {
      startMs: window.start,
      endMs: window.end,
      status,
    }
  }

  return {
    asia: computeSession("asia", defs.A),
    london: computeSession("london", defs.L),
    newyork: computeSession("newyork", defs.N),
  }
}

export function formatNYTimeLabel(timestampMs: number): string {
  const dt = DateTime.fromMillis(timestampMs).setZone(TZ)
  return dt.toFormat("h:mm a")
}

export function getSessionLabels(sessionKey: SessionKey, nowMs = Date.now()): { startLabel: string; endLabel: string } {
  const window = getSessionWindowsNY(nowMs)[sessionKey]
  return {
    startLabel: formatNYTimeLabel(window.startMs),
    endLabel: formatNYTimeLabel(window.endMs),
  }
}

export function getNYTradingDayWindow(nowMs = Date.now()): {
  startMs: number
  endMs: number
  status: "UPCOMING" | "LIVE" | "COMPLETED"
} {
  const now = DateTime.fromMillis(nowMs).setZone(TZ)

  // NY trading day: 17:00 → 17:00 next day
  const todayStart = now.set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
  let dayStart: DateTime
  let dayEnd: DateTime

  if (now.hour >= 17) {
    // After 5pm today, current trading day is today 17:00 → tomorrow 17:00
    dayStart = todayStart
    dayEnd = todayStart.plus({ days: 1 })
  } else {
    // Before 5pm today, current trading day is yesterday 17:00 → today 17:00
    dayStart = todayStart.minus({ days: 1 })
    dayEnd = todayStart
  }

  let status: "UPCOMING" | "LIVE" | "COMPLETED" = "UPCOMING"
  if (nowMs >= dayStart.toMillis() && nowMs < dayEnd.toMillis()) status = "LIVE"
  else if (nowMs >= dayEnd.toMillis()) status = "COMPLETED"

  return {
    startMs: dayStart.toMillis(),
    endMs: dayEnd.toMillis(),
    status,
  }
}
