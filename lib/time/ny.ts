/**
 * Utilities to work in America/New_York without external libs.
 * We derive the offset (-05/-04) for any instant using Intl and
 * build UTC epoch seconds for a given NY-local Y/M/D hh:mm.
 */

function nyOffsetHoursFor(utcMs: number): number {
  // parts contains { type:'timeZoneName', value:'GMT-4' } or 'GMT-5'
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "short",
    hour: "2-digit",
  }).formatToParts(new Date(utcMs))
  const tz = parts.find((p) => p.type === "timeZoneName")?.value || "GMT-5"
  const m = tz.match(/GMT([+-]\d{1,2})/)
  return m ? Number.parseInt(m[1], 10) : -5
}

export function nyLocalPartsFromUtc(ms: number) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  const parts = fmt.formatToParts(new Date(ms))
  const read = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return {
    y: read("year"),
    m: read("month"),
    d: read("day"),
    hh: read("hour"),
    mm: read("minute"),
  }
}

/** UTC epoch seconds for a NY-local Y/M/D hh:mm (handles DST). */
export function epochAtNy(y: number, m: number, d: number, hh: number, mm: number): number {
  // guess utc, then adjust using the offset at that local instant
  const guessUtc = Date.UTC(y, m - 1, d, hh, mm, 0)
  const off = nyOffsetHoursFor(guessUtc)
  // local(NY) = UTC + offset  →  UTC = local - offset
  return Math.floor(Date.UTC(y, m - 1, d, hh - off, mm, 0) / 1000)
}

/** Return NY 'today' 5pm boundary and 'yesterday' 5pm boundary (UTC seconds). */
export function nyDaily5pmBoundaries(nowSec: number) {
  const nowMs = nowSec * 1000
  const { y, m, d, hh } = nyLocalPartsFromUtc(nowMs)
  const today5pm = epochAtNy(y, m, d, 17, 0)
  const currentDailyOpen = nowSec >= today5pm ? today5pm : epochAtNy(y, m, d - 1, 17, 0)
  const prevDailyOpen = currentDailyOpen - 24 * 3600
  const nextDailyOpen = currentDailyOpen + 24 * 3600
  return { prevDailyOpen, currentDailyOpen, nextDailyOpen }
}

/** NY session windows (UTC seconds) for the current daily cycle starting at currentDailyOpen. */
export function nySessions(currentDailyOpen: number) {
  // Asia 5pm→12am; London 2am→8am; NY 8am→5pm (all NY local)
  const { y, m, d } = nyLocalPartsFromUtc(currentDailyOpen * 1000 + 1) // +ε to be inside the day
  const midnight = epochAtNy(y, m, d + 1, 0, 0)
  const asiaStart = currentDailyOpen
  const asiaEnd = midnight

  const londonStart = epochAtNy(y, m, d + 1, 2, 0)
  const londonEnd = epochAtNy(y, m, d + 1, 8, 0)

  const nyStart = epochAtNy(y, m, d + 1, 8, 0)
  const nyEnd = epochAtNy(y, m, d + 1, 17, 0)

  return { asiaStart, asiaEnd, londonStart, londonEnd, nyStart, nyEnd }
}

/** Weekly open: Sunday 5pm NY before (or equal to) now. */
export function nyWeeklyOpenBefore(nowSec: number): number {
  const nowMs = nowSec * 1000
  const p = nyLocalPartsFromUtc(nowMs)
  // find the most recent Sunday (0) at 17:00
  const date = new Date(epochAtNy(p.y, p.m, p.d, 12, 0) * 1000) // noon same day (safer around DST)
  // NY weekday at noon
  const wFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short" })
  let dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wFmt.format(date))
  if (dayIndex === -1) dayIndex = 0

  const daysSinceSunday = dayIndex // 0=Sun
  const sundayYmd = nyLocalPartsFromUtc(date.getTime() - daysSinceSunday * 24 * 3600 * 1000)
  const weeklyOpen = epochAtNy(sundayYmd.y, sundayYmd.m, sundayYmd.d, 17, 0)
  return weeklyOpen <= nowSec ? weeklyOpen : weeklyOpen - 7 * 24 * 3600
}

export function clampRangeToCandles<T extends { t: number }>(candles: T[], from: number, to: number) {
  return candles.filter((c) => c.t >= from && c.t < to)
}
