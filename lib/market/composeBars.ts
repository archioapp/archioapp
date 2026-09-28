import { lastNDaysRangeNY, lastNHoursRangeNY, weeklyBucketsFromDaily } from "@/lib/analysis/timeNY"
import { rollup60mTo4h } from "@/lib/analysis/rollup"

export type Bar = { t: number; o: number; h: number; l: number; c: number }

export async function getCompletedDailyBars(pair: string, count: number): Promise<Bar[]> {
  const { fromISO, toISO } = lastNDaysRangeNY(count + 5) // Buffer for weekends
  const q = new URLSearchParams({
    pair,
    multiplier: "1",
    timespan: "day",
    from: fromISO,
    to: toISO,
    sort: "desc",
    limit: count.toString(),
  })

  const r = await fetch(`/api/polygon/bars?${q}`, { cache: "no-store" })
  const j = await r.json()
  if (!j.ok) throw new Error(j.error || "daily bars failed")

  // Return in ASC order (oldest -> newest)
  return j.data.reverse().map((b: any) => ({
    t: b.t,
    o: b.o,
    h: b.h,
    l: b.l,
    c: b.c,
  }))
}

export async function getCompleted60mBars(pair: string, hours: number): Promise<Bar[]> {
  const { fromISO, toISO } = lastNHoursRangeNY(hours)
  const q = new URLSearchParams({
    pair,
    multiplier: "60",
    timespan: "minute",
    from: fromISO,
    to: toISO,
    sort: "asc",
  })

  const r = await fetch(`/api/polygon/bars?${q}`, { cache: "no-store" })
  const j = await r.json()
  if (!j.ok) throw new Error(j.error || "60m bars failed")

  return j.data.map((b: any) => ({
    t: b.t,
    o: b.o,
    h: b.h,
    l: b.l,
    c: b.c,
  }))
}

export async function composeCurrentDailyBarFromSnapshot(pair: string): Promise<Bar | null> {
  try {
    const r = await fetch(`/api/polygon/snapshot?pair=${pair}`, { cache: "no-store" })
    const j = await r.json()
    if (!j.ok) return null

    const snapshot = j.data
    const now = new Date()
    const nyTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    }).format(now)

    const currentHour = Number.parseInt(nyTime)

    // If before 5pm ET (17:00), we're still in the current trading day
    if (currentHour < 17 && snapshot.day) {
      // Start of today's EST session (5pm previous day)
      const today = new Date()
      const startOfDay = new Date(today)
      startOfDay.setDate(startOfDay.getDate() - 1)
      startOfDay.setHours(17, 0, 0, 0)

      return {
        t: startOfDay.getTime(),
        o: snapshot.day.o,
        h: snapshot.day.h,
        l: snapshot.day.l,
        c: snapshot.last || snapshot.day.c,
      }
    }

    return null
  } catch (error) {
    console.error("[v0] Compose daily bar error:", error)
    return null
  }
}

export async function composeCurrentWeeklyBar(pair: string): Promise<Bar | null> {
  try {
    const now = new Date()
    const nyTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "long",
      hour: "numeric",
      hour12: false,
    }).format(now)

    const [weekday, hour] = nyTime.split(", ")
    const currentHour = Number.parseInt(hour)

    // If it's Friday after 5pm ET, the week is complete
    if (weekday === "Friday" && currentHour >= 17) {
      return null
    }

    // Get start of current week (Sunday 5pm ET)
    const weekStart = new Date(now)
    const daysToSunday = (weekStart.getDay() + 7) % 7
    weekStart.setDate(weekStart.getDate() - daysToSunday)
    weekStart.setHours(17, 0, 0, 0)

    // Fetch daily bars from week start to now
    const { fromISO, toISO } = {
      fromISO: weekStart.toISOString(),
      toISO: now.toISOString(),
    }

    const q = new URLSearchParams({
      pair,
      multiplier: "1",
      timespan: "day",
      from: fromISO,
      to: toISO,
      sort: "asc",
    })

    const r = await fetch(`/api/polygon/bars?${q}`, { cache: "no-store" })
    const j = await r.json()
    if (!j.ok || !j.data.length) return null

    const dailyBars = j.data

    // Get current snapshot for latest close
    const snapR = await fetch(`/api/polygon/snapshot?pair=${pair}`, { cache: "no-store" })
    const snapJ = await snapR.json()
    const latestClose = snapJ.ok
      ? snapJ.data.last || dailyBars[dailyBars.length - 1].c
      : dailyBars[dailyBars.length - 1].c

    return {
      t: weekStart.getTime(),
      o: dailyBars[0].o,
      h: Math.max(...dailyBars.map((b: any) => b.h)),
      l: Math.min(...dailyBars.map((b: any) => b.l)),
      c: latestClose,
    }
  } catch (error) {
    console.error("[v0] Compose weekly bar error:", error)
    return null
  }
}

export async function buildWeekly5Bars(pair: string): Promise<Bar[]> {
  try {
    // Get enough daily bars for weekly rollup (~60 days for 8-9 weeks)
    const { fromISO, toISO } = lastNDaysRangeNY(60)
    const q = new URLSearchParams({
      pair,
      multiplier: "1",
      timespan: "day",
      from: fromISO,
      to: toISO,
      sort: "asc",
    })

    const r = await fetch(`/api/polygon/bars?${q}`, { cache: "no-store" })
    const j = await r.json()
    if (!j.ok) throw new Error(j.error || "weekly bars failed")

    const weeklyBars = weeklyBucketsFromDaily(j.data)
    const last4Completed = weeklyBars.slice(-4)

    // Try to get current partial week
    const currentWeek = await composeCurrentWeeklyBar(pair)

    return currentWeek ? [...last4Completed, currentWeek] : last4Completed
  } catch (error) {
    console.error("[v0] Build weekly bars error:", error)
    return []
  }
}

export async function buildDaily10Bars(pair: string): Promise<Bar[]> {
  try {
    const last6Completed = await getCompletedDailyBars(pair, 6)
    const currentDay = await composeCurrentDailyBarFromSnapshot(pair)

    return currentDay ? [...last6Completed, currentDay] : last6Completed
  } catch (error) {
    console.error("[v0] Build daily bars error:", error)
    return []
  }
}

export async function buildH4_20Bars(pair: string): Promise<Bar[]> {
  try {
    // Get ~144 hours of 60m bars (30 * 4 = 120 hours + buffer)
    const bars60m = await getCompleted60mBars(pair, 144)
    const bars4h = rollup60mTo4h(bars60m)

    // Return last 30 4H bars
    return bars4h.slice(-30)
  } catch (error) {
    console.error("[v0] Build 4H bars error:", error)
    return []
  }
}
