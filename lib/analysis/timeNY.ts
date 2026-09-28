/**
 * New York timezone utilities for market data
 * Handles proper market time boundaries and ranges
 */

export function nowNY(): Date {
  const now = new Date()
  console.log("[v0] Current UTC time:", now.toISOString())

  // Convert to NY timezone properly
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  console.log("[v0] NY time:", nyTime.toISOString())

  return nyTime
}

export function lastNDaysRangeNY(n: number): { fromISO: string; toISO: string } {
  const now = new Date()
  const to = new Date(now)
  const from = new Date(now)
  from.setDate(from.getDate() - n)

  console.log("[v0] Date range calculation:", {
    n,
    now: now.toISOString(),
    from: from.toISOString(),
    to: to.toISOString(),
    fromFormatted: from.toISOString().split("T")[0],
    toFormatted: to.toISOString().split("T")[0],
  })

  return {
    fromISO: from.toISOString().split("T")[0], // YYYY-MM-DD format
    toISO: to.toISOString().split("T")[0],
  }
}

export function lastNHoursRangeNY(n: number): { fromISO: string; toISO: string } {
  const now = new Date()
  const to = new Date(now)
  const from = new Date(now)
  from.setHours(from.getHours() - n)

  console.log("[v0] Hours range calculation:", {
    n,
    from: from.toISOString(),
    to: to.toISOString(),
  })

  return {
    fromISO: from.toISOString(),
    toISO: to.toISOString(),
  }
}

export function weeklyBucketsFromDaily(
  bars: { t: number; o: number; h: number; l: number; c: number }[],
): Array<{ t: number; o: number; h: number; l: number; c: number }> {
  if (!bars || bars.length === 0) return []

  const weeks: { [key: string]: { t: number; o: number; h: number; l: number; c: number; bars: typeof bars } } = {}

  bars.forEach((bar) => {
    const date = new Date(bar.t)
    // Get NY time
    const nyDate = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }))

    // Find the Sunday 17:00 NY that starts this week
    const dayOfWeek = nyDate.getDay() // 0 = Sunday
    const hoursFromSunday17 = dayOfWeek * 24 + nyDate.getHours() - 17

    const weekStart = new Date(nyDate)
    weekStart.setHours(weekStart.getHours() - hoursFromSunday17)
    weekStart.setMinutes(0, 0, 0)

    const weekKey = weekStart.toISOString().split("T")[0]

    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        t: weekStart.getTime(),
        o: bar.o,
        h: bar.h,
        l: bar.l,
        c: bar.c,
        bars: [],
      }
    }

    weeks[weekKey].bars.push(bar)
    weeks[weekKey].h = Math.max(weeks[weekKey].h, bar.h)
    weeks[weekKey].l = Math.min(weeks[weekKey].l, bar.l)
    weeks[weekKey].c = bar.c // Last close
  })

  return Object.values(weeks)
    .sort((a, b) => a.t - b.t)
    .map((week) => ({
      t: week.t,
      o: week.o,
      h: week.h,
      l: week.l,
      c: week.c,
    }))
}
