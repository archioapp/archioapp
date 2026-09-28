import { type NextRequest, NextResponse } from "next/server"
import { nyDaily5pmBoundaries, nySessions, nyWeeklyOpenBefore } from "@/lib/time/ny"
type C = { t: number; o: number; h: number; l: number; c: number }

function hiLowRaw(arr: C[]) {
  let hi = Number.NEGATIVE_INFINITY,
    lo = Number.POSITIVE_INFINITY
  for (const x of arr) {
    if (x.h > hi) hi = x.h
    if (x.l < lo) lo = x.l
  }
  return { high: hi, low: lo }
}
function roundHL(x: { high: number; low: number }, d = 5) {
  return { high: +x.high.toFixed(d), low: +x.low.toFixed(d) }
}
function fvg(c: C[]) {
  const out: { from: number; to: number; dir: "up" | "down" }[] = []
  for (let i = 2; i < c.length; i++) {
    const a = c[i - 2],
      d = c[i]
    if (a.h < d.l) out.push({ from: +a.h.toFixed(5), to: +d.l.toFixed(5), dir: "up" })
    if (a.l > d.h) out.push({ from: +d.h.toFixed(5), to: +a.l.toFixed(5), dir: "down" })
  }
  return out
}
function liq(c: C[]) {
  const out: { kind: "equal_highs" | "equal_lows"; level: number }[] = []
  const epsPct = 0.01
  for (let i = 1; i < c.length; i++) {
    const a = c[i - 1],
      b = c[i]
    const epsH = a.h * epsPct * 0.01,
      epsL = a.l * epsPct * 0.01
    if (Math.abs(a.h - b.h) <= epsH) out.push({ kind: "equal_highs", level: +Math.max(a.h, b.h).toFixed(5) })
    if (Math.abs(a.l - b.l) <= epsL) out.push({ kind: "equal_lows", level: +Math.min(a.l, b.l).toFixed(5) })
  }
  return out
}
function weeklyOpenFrom(c: C[], at: number) {
  const f = c.find((x) => x.t >= at)
  if (!f) return undefined
  const last = c[c.length - 1]?.c ?? f.o
  return { price: +f.o.toFixed(5), side: (last >= f.o ? "premium" : "discount") as "premium" | "discount" }
}

function ohlc(seg: any[]) {
  if (!seg?.length) return undefined
  const open = Number(seg[0].o)
  const close = Number(seg[seg.length - 1].c)
  const high = seg.reduce((m: number, x: any) => (x.h > m ? x.h : m), seg[0].h)
  const low = seg.reduce((m: number, x: any) => (x.l < m ? x.l : m), seg[0].l)
  return { open, high, low, close, range: high - low }
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url)
  const symbol = (u.searchParams.get("symbol") || "EURUSD").toUpperCase()
  const provider = (u.searchParams.get("provider") || "OANDA").toUpperCase()
  const tf = "1m" // force 1m for accuracy

  const nowSec = Math.floor(Date.now() / 1000)
  const { prevDailyOpen, currentDailyOpen, nextDailyOpen } = nyDaily5pmBoundaries(nowSec)
  const { asiaStart, asiaEnd, londonStart, londonEnd, nyStart, nyEnd } = nySessions(currentDailyOpen)

  const limit = 2880 + 60
  const q = new URLSearchParams({ symbol, tf, provider, limit: String(limit) })
  const r = await fetch(`${u.origin}/api/market/candles?${q.toString()}`, { cache: "no-store" })
  if (!r.ok) return NextResponse.json({ symbol, tf, overlays: {}, computedAt: new Date().toISOString() })
  const j = await r.json()
  const c: C[] = (j?.candles || []).sort((a, b) => a.t - b.t)

  const EPS = 0.5 // seconds; tolerate minute-edge skew
  const prevDay = c.filter((x) => x.t >= prevDailyOpen - EPS && x.t < currentDailyOpen - EPS + 60)
  const asia = c.filter((x) => x.t >= asiaStart - EPS && x.t < asiaEnd - EPS + 60)

  const londonSeg = c.filter((x) => x.t >= londonStart && x.t < londonEnd)
  const newyorkSeg = c.filter((x) => x.t >= nyStart && x.t < nyEnd)

  const london = ohlc(londonSeg)
  const newyork = ohlc(newyorkSeg)

  const oneDay = 24 * 3600
  const prevAsiaSeg = c.filter((x) => x.t >= asiaStart - oneDay && x.t < asiaEnd - oneDay)
  const prevLondonSeg = c.filter((x) => x.t >= londonStart - oneDay && x.t < londonEnd - oneDay)
  const prevNySeg = c.filter((x) => x.t >= nyStart - oneDay && x.t < nyEnd - oneDay)
  const prevSessions = {
    asia: ohlc(prevAsiaSeg),
    london: ohlc(prevLondonSeg),
    newyork: ohlc(prevNySeg),
  }

  const thisSun5pm = nyWeeklyOpenBefore(nowSec) // most recent Sun 17:00 NY
  const prevSun5pm = nyWeeklyOpenBefore(thisSun5pm - 60) // prior Sun 17:00 NY
  const prevFri5pm = prevSun5pm + 5 * 24 * 3600 // that Fri 17:00 NY
  const qW = new URLSearchParams({ symbol, tf: "15m", provider, limit: "3000" })
  const rW = await fetch(`${u.origin}/api/market/candles?${qW}`, { cache: "no-store" })
  const wAll = rW.ok ? await rW.json() : []
  const wSeg = Array.isArray(wAll) ? wAll.filter((x: any) => x.t >= prevSun5pm && x.t < prevFri5pm) : []
  const weekly = wSeg.length
    ? {
        open: wSeg[0].o,
        high: wSeg.reduce((m: any, x: any) => (x.h > m ? x.h : m), wSeg[0].h),
        low: wSeg.reduce((m: any, x: any) => (x.l < m ? x.l : m), wSeg[0].l),
        close: wSeg[wSeg.length - 1].c,
        range:
          wSeg.reduce((m: any, x: any) => (x.h > m ? x.h : m), wSeg[0].h) -
          wSeg.reduce((m: any, x: any) => (x.l < m ? x.l : m), wSeg[0].l),
      }
    : undefined
  const weekBounds = weekly ? [prevSun5pm, prevFri5pm] : undefined

  // Fetch monthly data using 60m candles
  const prevMon5pm = nowSec - 7 * 24 * 3600 // Simplified weekly boundary
  const thisMon5pm = nowSec
  const prevStart = nowSec - 30 * 24 * 3600 // Simplified monthly boundary
  const thisStart = nowSec

  const monthlyQ = new URLSearchParams({ symbol, tf: "60m", provider, limit: "744" })
  const monthlyR = await fetch(`${u.origin}/api/market/candles?${monthlyQ.toString()}`, { cache: "no-store" })
  const monthlyCandles = monthlyR.ok ? (await monthlyR.json())?.candles || [] : []
  const monthlySeg = monthlyCandles.filter((x: any) => x.t >= prevStart && x.t < thisStart)
  const monthly = ohlc(monthlySeg)

  const overlays = {
    daily: prevDay.length ? roundHL(hiLowRaw(prevDay)) : undefined,
    asia: asia.length ? roundHL(hiLowRaw(asia)) : undefined,
    london,
    newyork,
    newYork: newyork, // alias for legacy readers
    prev: prevSessions,
    weekly,
    monthly,
    weeklyOpen: weeklyOpenFrom(c, nyWeeklyOpenBefore(nowSec)),
    fvg: fvg(c),
    bpr: [],
    liquidity: liq(c),
    meta: {
      provider,
      resolution: "1m",
      tz: "America/New_York",
      now: nowSec,
      windows: {
        prevDaily: [prevDailyOpen, currentDailyOpen],
        asia: [asiaStart, asiaEnd],
        london: [londonStart, londonEnd],
        newyork: [nyStart, nyEnd],
        prev: {
          asia: [asiaStart - oneDay, asiaEnd - oneDay],
          london: [londonStart - oneDay, londonEnd - oneDay],
          newyork: [nyStart - oneDay, nyEnd - oneDay],
        },
        week: weekBounds,
        nextDailyOpen,
      },
    },
  }
  return NextResponse.json({ symbol, tf, overlays, computedAt: new Date().toISOString() })
}
