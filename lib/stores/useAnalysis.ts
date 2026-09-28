import { create } from "zustand"
import type { Overlays } from "@/types/core"
import { lastNDaysRangeNY, lastNHoursRangeNY, weeklyBucketsFromDaily } from "@/lib/analysis/timeNY"
import { rollup60mTo4h } from "@/lib/analysis/rollup"
import type { Bar, SessionKey, SessionWindow } from "@/types/market"
import { normalizePair, toPolygonFxTicker, calculateRangePips } from "@/lib/market/symbols"

type PolygonSnapshot = {
  pair: string
  last: number
  minute: { o: number; h: number; l: number; c: number; tEnd: number }
  day: { o: number; h: number; l: number; c: number }
  prev: { o: number; h: number; l: number; c: number }
}

type PolygonBar = {
  t: number
  o: number
  h: number
  l: number
  c: number
  v: number
}

type SessionBars = {
  asia: Bar[]
  london: Bar[]
  newyork: Bar[]
}

type SessionOHLC = {
  asia: {
    open?: number
    high?: number
    low?: number
    close?: number
    range?: number
    rangePips?: number
    pair?: string
    status: "UPCOMING" | "LIVE" | "COMPLETED"
    start: number
    end: number
  }
  london: {
    open?: number
    high?: number
    low?: number
    close?: number
    range?: number
    rangePips?: number
    pair?: string
    status: "UPCOMING" | "LIVE" | "COMPLETED"
    start: number
    end: number
  }
  newyork: {
    open?: number
    high?: number
    low?: number
    close?: number
    range?: number
    rangePips?: number
    pair?: string
    status: "UPCOMING" | "LIVE" | "COMPLETED"
    start: number
    end: number
  }
}

type MultiTimeframeBars = {
  daily: PolygonBar[]
  weekly: PolygonBar[]
  h4: PolygonBar[]
}

type S = {
  overlays?: Overlays
  computedAt?: string
  snapshot?: PolygonSnapshot
  sessionBars: SessionBars
  sessionOHLC: SessionOHLC
  multiTimeframeBars?: MultiTimeframeBars
  selectedPair: string

  weeklyBars?: PolygonBar[]
  dailyBars?: PolygonBar[]
  h4Bars?: PolygonBar[]

  weeklyStats?: { bullish: number; bearish: number; maxRange: number }
  dailyStats?: { bullish: number; bearish: number; maxRange: number }
  h4Stats?: { bullish: number; bearish: number; maxRange: number }

  loading: boolean

  set: (o: Overlays) => void
  setOverlays: (o: Overlays) => void
  clear: () => void
  setSelectedPair: (pair: string) => void

  loadSnapshot: (pair: string) => Promise<void>
  loadSessionBars: (pair: string) => Promise<void>
  loadMultiTFBars: (pair: string) => Promise<void>

  loadBankingSessions: (pair?: string, nowMs?: number) => Promise<void>
}

function getNYWindows() {
  const now = new Date()
  const nyTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now)

  const today = new Date(`${nyTime[4].value}-${nyTime[0].value}-${nyTime[2].value}`)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Session windows in NY time
  const sessions = {
    asia: {
      from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0).toISOString(),
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0).toISOString(),
    },
    london: {
      from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 0).toISOString(),
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0).toISOString(),
    },
    newyork: {
      from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0).toISOString(),
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0).toISOString(),
    },
  }

  return sessions
}

async function fetchMinuteBars(pair: string, from: number, to: number) {
  const fromISO = new Date(from).toISOString()
  const toISO = new Date(to).toISOString()
  const q = new URLSearchParams({ pair, multiplier: "1", timespan: "minute", from: fromISO, to: toISO, sort: "asc" })
  const r = await fetch(`/api/polygon/bars?${q}`, { cache: "no-store" })
  const j = await r.json()
  if (!j.ok) throw new Error(j.error || "minute bars failed")
  return j.data as { t: number; o: number; h: number; l: number; c: number }[]
}

const REFRESH_MS = 60_000 // 60s
let sessionTimer: number | null = null
let pairChangeTimer: number | null = null

export const useAnalysis = create<S>((set, get) => ({
  overlays: undefined,
  computedAt: undefined,
  snapshot: undefined,
  sessionBars: { asia: [], london: [], newyork: [] },
  sessionOHLC: {
    asia: { status: "UPCOMING", start: 0, end: 0 },
    london: { status: "UPCOMING", start: 0, end: 0 },
    newyork: { status: "UPCOMING", start: 0, end: 0 },
  },
  multiTimeframeBars: undefined,
  selectedPair: "EURUSD",

  weeklyBars: undefined,
  dailyBars: undefined,
  h4Bars: undefined,
  weeklyStats: undefined,
  dailyStats: undefined,
  h4Stats: undefined,

  loading: false,

  set: (o) => set({ overlays: o, computedAt: new Date().toISOString() }),
  setOverlays: (o) => set({ overlays: o, computedAt: new Date().toISOString() }),
  setSelectedPair: (pair: string) => {
    const normalizedPair = normalizePair(pair)
    set({ selectedPair: normalizedPair })

    // Cancel any existing timer
    if (pairChangeTimer) {
      clearTimeout(pairChangeTimer)
    }

    // Cancel any in-flight session fetch
    if (sessionTimer) {
      clearInterval(sessionTimer)
      sessionTimer = null
    }

    // Debounce the session reload
    pairChangeTimer = window.setTimeout(() => {
      get().loadBankingSessions(normalizedPair)
      pairChangeTimer = null
    }, 300) as unknown as number
  },
  clear: () =>
    set({
      overlays: undefined,
      computedAt: undefined,
      snapshot: undefined,
      sessionBars: { asia: [], london: [], newyork: [] },
      sessionOHLC: {
        asia: { status: "UPCOMING", start: 0, end: 0 },
        london: { status: "UPCOMING", start: 0, end: 0 },
        newyork: { status: "UPCOMING", start: 0, end: 0 },
      },
      multiTimeframeBars: undefined,
      weeklyBars: undefined,
      dailyBars: undefined,
      h4Bars: undefined,
      weeklyStats: undefined,
      dailyStats: undefined,
      h4Stats: undefined,
    }),

  loadSnapshot: async (pair: string) => {
    set({ loading: true })
    try {
      const r = await fetch(`/api/polygon/snapshot?pair=${pair}`, { cache: "no-store" })
      const j = await r.json()
      if (!j.ok) throw new Error(j.error || "snapshot failed")

      set({ snapshot: j.data })
      console.log("[v0] Snapshot loaded for", pair, j.data)
    } catch (error) {
      console.error("[v0] Snapshot error:", error)
    } finally {
      set({ loading: false })
    }
  },

  loadSessionBars: async (pair: string) => {
    set({ loading: true })
    try {
      const windows = getNYWindows()
      const sessionBars: SessionBars = { asia: [], london: [], newyork: [] }

      // Load bars for each session window
      for (const [session, window] of Object.entries(windows)) {
        const q = new URLSearchParams({
          pair,
          from: window.from,
          to: window.to,
          multiplier: "1",
          timespan: "minute",
          sort: "asc",
        })

        const r = await fetch(`/api/polygon/bars?${q}`, { cache: "no-store" })
        const j = await r.json()
        if (j.ok) {
          sessionBars[session as keyof SessionBars] = j.data
        }
      }

      // Compute session OHLC and update overlays
      const sessions = {
        asia:
          sessionBars.asia.length > 0
            ? {
                o: sessionBars.asia[0].o,
                h: Math.max(...sessionBars.asia.map((b) => b.h)),
                l: Math.min(...sessionBars.asia.map((b) => b.l)),
                c: sessionBars.asia[sessionBars.asia.length - 1].c,
              }
            : { o: 0, h: 0, l: 0, c: 0 },
        london:
          sessionBars.london.length > 0
            ? {
                o: sessionBars.london[0].o,
                h: Math.max(...sessionBars.london.map((b) => b.h)),
                l: Math.min(...sessionBars.london.map((b) => b.l)),
                c: sessionBars.london[sessionBars.london.length - 1].c,
              }
            : { o: 0, h: 0, l: 0, c: 0 },
        newyork:
          sessionBars.newyork.length > 0
            ? {
                o: sessionBars.newyork[0].o,
                h: Math.max(...sessionBars.newyork.map((b) => b.h)),
                l: Math.min(...sessionBars.newyork.map((b) => b.l)),
                c: sessionBars.newyork[sessionBars.newyork.length - 1].c,
              }
            : { o: 0, h: 0, l: 0, c: 0 },
      }

      set({
        sessionBars,
        overlays: {
          ...get().overlays,
          sessions,
        },
      })

      console.log("[v0] Session bars loaded for", pair, sessions)
    } catch (error) {
      console.error("[v0] Session bars error:", error)
    } finally {
      set({ loading: false })
    }
  },

  loadMultiTFBars: async (pair: string) => {
    set({ loading: true })
    try {
      // Load daily bars with robust NY time range
      async function loadDailyBars(pair: string) {
        const { fromISO, toISO } = lastNDaysRangeNY(20) // load >7 days; keep last 7
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
        if (!j.ok) throw new Error(j.error || "daily bars failed")

        set({
          multiTimeframeBars: {
            ...(get().multiTimeframeBars || {}),
            daily: j.data.slice(-7),
          },
        })
        return j.data
      }

      // Load 4H bars from 60m rollup for accuracy
      async function loadH4Bars(pair: string) {
        const { fromISO, toISO } = lastNHoursRangeNY(200) // last ~8+ days of 4H data for 30 candles
        // 60m base, then roll to 4H for accuracy
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

        const h4 = rollup60mTo4h(j.data)
        set({
          multiTimeframeBars: {
            ...(get().multiTimeframeBars || {}),
            h4: h4.slice(-30),
          },
        })
      }

      // Load weekly bars from daily rollup
      async function loadWeeklyBars(pair: string, dailyData?: PolygonBar[]) {
        let dailyBars = dailyData

        if (!dailyBars) {
          const { fromISO, toISO } = lastNDaysRangeNY(80) // ~11-12 weeks of dailies for 5 weekly candles
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
          if (!j.ok) throw new Error(j.error || "weekly-from-daily failed")
          dailyBars = j.data
        }

        const weekly = weeklyBucketsFromDaily(dailyBars).slice(-5)
        set({
          multiTimeframeBars: {
            ...(get().multiTimeframeBars || {}),
            weekly,
          },
        })
      }

      // Load all timeframes in parallel
      const dailyData = await loadDailyBars(pair)
      await Promise.all([
        loadH4Bars(pair),
        loadWeeklyBars(pair, dailyData), // Reuse daily data for weekly rollup
      ])

      console.log("[v0] Multi-timeframe bars loaded for", pair, get().multiTimeframeBars)
    } catch (error) {
      console.error("[v0] Multi-timeframe bars error:", error)
    } finally {
      set({ loading: false })
    }
  },

  loadBankingSessions: async (pair?: string, nowMs = Date.now()) => {
    try {
      // Use provided pair or fall back to selectedPair from state
      const targetPair = pair || get().selectedPair
      const { getSessionWindowsNY, getActiveOrPrev } = await import("@/lib/analysis/sessionsNY")
      const { rollupToTF } = await import("@/lib/analysis/rollupTF")

      const windows = getSessionWindowsNY(nowMs)
      const sessions: [SessionKey, SessionWindow][] = [
        ["asia", windows.asia],
        ["london", windows.london],
        ["newyork", windows.newyork],
      ]

      const newSessionBars = { ...get().sessionBars }
      const newSessionOHLC = { ...get().sessionOHLC }

      for (const [key, win] of sessions) {
        const activeWindow = getActiveOrPrev(key, nowMs)
        const fetchTo = activeWindow.endMs
        const fetchFrom = activeWindow.startMs - 5 * 60 * 1000 // 5m buffer

        console.log(
          `[v0] Loading ${key} session data from ${new Date(fetchFrom).toISOString()} to ${new Date(fetchTo).toISOString()}`,
        )

        const polygonTicker = toPolygonFxTicker(targetPair)
        const url = `/api/market/agg?ticker=${encodeURIComponent(polygonTicker)}&fromMs=${fetchFrom}&toMs=${fetchTo}&granularity=minute`
        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) {
          console.error(`[v0] Session ${key} API error:`, await res.text())
          continue
        }
        const response = await res.json()

        let minutes: Bar[] = []
        if (response && response.results && Array.isArray(response.results)) {
          minutes = response.results
        } else {
          console.warn(`[v0] Invalid API response for ${key} session:`, response)
          // Set empty session data for invalid responses
          newSessionBars[key] = []
          newSessionOHLC[key] = {
            pair: targetPair,
            status: win.status,
            start: Math.floor(activeWindow.startMs / 1000),
            end: Math.floor(activeWindow.endMs / 1000),
          }
          continue
        }

        // Strictly filter to window (defensive; polygon may return outside)
        if (Array.isArray(minutes)) {
          minutes = minutes.filter((b) => b.t >= activeWindow.startMs && b.t < activeWindow.endMs)
        } else {
          console.error(`[v0] Minutes is not an array for ${key} session:`, minutes)
          minutes = []
        }

        // Compute OHLC for the window
        let open, high, low, close, range, rangePips
        if (minutes.length) {
          open = minutes[0].o
          close = minutes[minutes.length - 1].c
          high = minutes.reduce((m, b) => Math.max(m, b.h), Number.NEGATIVE_INFINITY)
          low = minutes.reduce((m, b) => Math.min(m, b.l), Number.POSITIVE_INFINITY)
          range = high - low
          rangePips = calculateRangePips(high, low, targetPair)
        }

        // Rollup to 30m anchored to session start
        const bars30 = rollupToTF(minutes, 30, activeWindow.startMs)

        newSessionBars[key] = bars30
        newSessionOHLC[key] = {
          open,
          high,
          low,
          close,
          range,
          rangePips,
          pair: targetPair,
          status: win.status,
          start: Math.floor(activeWindow.startMs / 1000),
          end: Math.floor(activeWindow.endMs / 1000),
        }

        console.info("[SESSIONS]", targetPair, key, {
          minutes: minutes.length,
          bars30: bars30.length,
          status: win.status,
          isWeekendData: win.status === "COMPLETED" && new Date(activeWindow.startMs).getDay() === 5,
        })
      }

      set({
        sessionBars: newSessionBars,
        sessionOHLC: newSessionOHLC,
      })

      const anyLive = [windows.asia, windows.london, windows.newyork].some((w) => w.status === "LIVE")
      if (anyLive && !sessionTimer) {
        sessionTimer = window.setInterval(() => {
          get().loadBankingSessions(targetPair, Date.now())
        }, REFRESH_MS) as unknown as number
      } else if (!anyLive && sessionTimer) {
        clearInterval(sessionTimer)
        sessionTimer = null
      }
    } catch (error) {
      console.error("[v0] loadBankingSessions error:", error)
    }
  },
}))

export async function loadMultiTFBars(pair: string) {
  return useAnalysis.getState().loadMultiTFBars(pair)
}
