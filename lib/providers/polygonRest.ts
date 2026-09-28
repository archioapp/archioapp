import { toPolygonTicker } from "@/lib/market/to-polygon-ticker"

const BASE = process.env.POLYGON_REST_URL || "https://api.polygon.io"

function getApiKey(): string {
  const key = process.env.POLYGON_API_KEY
  if (!key) {
    throw new Error("POLYGON_API_KEY environment variable is not set")
  }
  return key
}

// Unified Snapshot -- fast scalars for "Daily Candle Analysis"
export async function fetchUnifiedSnapshot(pair: string): Promise<Snapshot> {
  const KEY = getApiKey()
  const ticker = toPolygonTicker(pair)
  const url = `${BASE}/v3/snapshot?ticker=${encodeURIComponent(ticker)}&limit=1&order=asc&sort=ticker&apiKey=${KEY}`
  const r = await fetch(url, { cache: "no-store" })
  if (!r.ok) {
    const errorText = await r.text().catch(() => "")
    console.error("[v0] Polygon snapshot error:", r.status, errorText)
    // 403 = the key's plan has no snapshot entitlement. The previous-day
    // aggregate IS entitled, so recover prev close (and a last price) from it
    // instead of returning an empty snapshot.
    if (r.status === 403) {
      console.warn("[v0] Polygon 403: snapshot not entitled. Falling back to /prev aggregate.")
      return fetchPrevDayAsSnapshot(pair, ticker, KEY)
    }
    // Return null-safe defaults for 429 (rate-limited) — caller's chart
    // should render its empty state and re-poll on its normal cadence.
    if (r.status === 429) {
      console.warn("[v0] Polygon 429: snapshot rate-limited. Returning empty snapshot; will retry on next poll.")
      return { pair, last: undefined, minute: {}, day: {}, prev: {} }
    }
    throw new Error(`snapshot ${r.status}`)
  }
  const j = await r.json()

  // normalize best-effort (fields vary by asset class)
  const res = (j.results && j.results[0]) || {}
  const minute = res.last_minute || {}
  const day = res.session?.day || res.day || {}
  const prev = res.session?.prev_day || res.prev_day || {}

  const lastQuote = res.last_quote || {}
  const last = lastQuote.p || lastQuote.ask || lastQuote.bid || minute.c

  return {
    pair,
    last,
    minute: { o: minute.o, h: minute.h, l: minute.l, c: minute.c, tEnd: minute.t },
    day: { o: day.open, h: day.high, l: day.low, c: day.close },
    prev: { o: prev.open, h: prev.high, l: prev.low, c: prev.close },
  }
}

/** Snapshot-shaped result built from the free-tier previous-day aggregate. */
type Ohlc = { o?: number; h?: number; l?: number; c?: number }
type Snapshot = { pair: string; last: number | undefined; minute: Ohlc & { tEnd?: number }; day: Ohlc; prev: Ohlc }

async function fetchPrevDayAsSnapshot(pair: string, ticker: string, KEY: string): Promise<Snapshot> {
  const empty: Snapshot = { pair, last: undefined, minute: {}, day: {}, prev: {} }
  try {
    const r = await fetch(`${BASE}/v2/aggs/ticker/${encodeURIComponent(ticker)}/prev?adjusted=true&apiKey=${KEY}`, { cache: "no-store" })
    if (!r.ok) return empty
    const j = await r.json()
    const b = j?.results?.[0]
    if (!b) return empty
    return {
      pair,
      last: b.c as number,
      minute: {},
      day: {},
      prev: { o: b.o, h: b.h, l: b.l, c: b.c },
    }
  } catch {
    return empty
  }
}

// Custom Bars -- robust OHLC arrays
export async function fetchCustomBars(opts: {
  pair: string
  multiplier: number
  timespan: "minute" | "hour" | "day"
  from: string
  to: string
  sort?: "asc" | "desc"
}) {
  const KEY = getApiKey()
  const ticker = toPolygonTicker(opts.pair)

  const formatDateForPolygon = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toISOString().split("T")[0]
  }

  const fromFormatted = formatDateForPolygon(opts.from)
  const toFormatted = formatDateForPolygon(opts.to)

  const url = `${BASE}/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/${opts.multiplier}/${opts.timespan}/${fromFormatted}/${toFormatted}?adjusted=true&sort=${opts.sort || "asc"}&limit=50000&apiKey=${KEY}`

  console.log(`[v0] Polygon bars URL: ${url.replace(/apiKey=[^&]+/, "apiKey=***")}`)

  const r = await fetch(url, { cache: "no-store" })
  if (!r.ok) {
    const errorText = await r.text().catch(() => "")
    console.error(`[v0] Polygon bars error: ${r.status}`, errorText)
    // Return empty array for 403 (subscription tier) instead of throwing
    if (r.status === 403) {
      console.warn("[v0] Polygon 403: forex data may require a paid plan. Returning empty bars.")
      return []
    }
    // Return empty array for 429 (rate-limited) instead of throwing — the
    // chart's existing empty-state UI handles "no data right now" cleanly,
    // and the next poll will succeed once the per-minute window resets.
    if (r.status === 429) {
      console.warn("[v0] Polygon 429: bars rate-limited. Returning empty bars; will retry on next poll.")
      return []
    }
    throw new Error(`bars ${r.status}`)
  }
  const j = await r.json()
  const out = (j.results || []).map((b: any) => ({
    t: b.t,
    o: b.o,
    h: b.h,
    l: b.l,
    c: b.c,
    v: b.v,
  }))
  return out
}
