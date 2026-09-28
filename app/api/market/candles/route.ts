import { type NextRequest, NextResponse } from "next/server"
import { mapFxToFinnhub, mapTfToResolution, secondsPerTf, mapTfToAVInterval } from "@/lib/price/symbolMap"

type Candle = { t: number; o: number; h: number; l: number; c: number }

async function fetchFinnhub(symbol: string, tf: string, limit: number, key: string) {
  const reso = mapTfToResolution(tf)
  const step = secondsPerTf(tf)
  const to = Math.floor(Date.now() / 1000)
  const from = to - step * limit
  const mapped = mapFxToFinnhub(symbol)
  const url = `https://finnhub.io/api/v1/forex/candle?symbol=${encodeURIComponent(mapped)}&resolution=${reso}&from=${from}&to=${to}&token=${key}`
  const r = await fetch(url, { cache: "no-store" })
  if (!r.ok) return [] as Candle[]
  const j = await r.json()
  if (j.s !== "ok" || !Array.isArray(j.t)) return [] as Candle[]
  return j.t.map((t: number, i: number) => ({
    t,
    // keep provider floats RAW; do not round here
    o: Number(j.o[i]),
    h: Number(j.h[i]),
    l: Number(j.l[i]),
    c: Number(j.c[i]),
  })) as Candle[]
}

async function fetchAV(symbol: string, tf: string, limit: number, key: string) {
  const s = symbol.toUpperCase()
  const from = s.slice(0, 3),
    toSym = s.slice(3, 6)
  const interval = mapTfToAVInterval(tf) // 1min/5min/15min/60min
  // use full to ensure enough history; we slice to limit
  const url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${from}&to_symbol=${toSym}&interval=${interval}&outputsize=full&apikey=${key}`
  const r = await fetch(url, { cache: "no-store" })
  if (!r.ok) return [] as Candle[]
  const j = await r.json()
  const k = Object.keys(j).find((x) => x.startsWith("Time Series FX"))
  if (!k) return [] as Candle[]
  return Object.entries(j[k] as Record<string, any>)
    .map(([ts, v]) => ({
      t: Math.floor(Date.parse(ts + "Z") / 1000),
      // keep provider floats RAW; do not round here
      o: Number(v["1. open"]),
      h: Number(v["2. high"]),
      l: Number(v["3. low"]),
      c: Number(v["4. close"]),
    }))
    .sort((a, b) => a.t - b.t)
    .slice(-limit) as Candle[]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = (searchParams.get("symbol") || "EURUSD").toUpperCase()
  const tf = searchParams.get("tf") || "15m"
  const limit = Math.min(Number(searchParams.get("limit") || "600"), 3000)

  const fKey = process.env.FINNHUB_KEY
  const aKey = process.env.ALPHAVANTAGE_KEY

  let candles: Candle[] = []
  if (fKey) candles = await fetchFinnhub(symbol, tf, limit, fKey)
  if (candles.length === 0 && aKey) candles = await fetchAV(symbol, tf, limit, aKey)

  return NextResponse.json({ symbol, tf, candles })
}
