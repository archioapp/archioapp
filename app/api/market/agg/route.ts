import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get("ticker")
    const pair = searchParams.get("pair") // Keep backward compatibility
    const fromMs = searchParams.get("fromMs")
    const toMs = searchParams.get("toMs")
    const granularity = searchParams.get("granularity") || "minute"
    const multiplier = searchParams.get("multiplier") || "1"
    const timespan = searchParams.get("timespan") || granularity
    const sort = searchParams.get("sort") || "asc"

    // Use ticker if provided, otherwise fall back to pair
    const targetTicker = ticker || pair
    if (!targetTicker || !fromMs || !toMs) {
      return NextResponse.json({ error: "Missing required parameters: ticker/pair, fromMs, toMs" }, { status: 400 })
    }

    // Ensure ticker has C: prefix for FX pairs
    const polygonTicker = targetTicker.startsWith("C:") ? targetTicker : `C:${targetTicker}`

    const apiKey = process.env.POLYGON_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Polygon API key not configured" }, { status: 500 })
    }

    const fromDate = new Date(Number.parseInt(fromMs)).toISOString().split("T")[0]
    const toDate = new Date(Number.parseInt(toMs)).toISOString().split("T")[0]

    const polygonUrl = `https://api.polygon.io/v2/aggs/ticker/${polygonTicker}/range/${multiplier}/${timespan}/${fromDate}/${toDate}?adjusted=true&sort=${sort}&limit=50000&apikey=${apiKey}`

    console.info("[POLY AGG FX]", {
      ticker: polygonTicker,
      fromDate,
      toDate,
      from: new Date(Number.parseInt(fromMs)).toISOString(),
      to: new Date(Number.parseInt(toMs)).toISOString(),
    })

    const response = await fetch(polygonUrl)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[POLY AGG FX] API error:", response.status, errorText)

      // Graceful degrade for known upstream conditions:
      //   403 → subscription tier doesn't include this data
      //   429 → per-minute rate limit (next poll will succeed)
      // Returning a 200 with an empty results array lets every consumer
      // render its empty state instead of throwing across the chunk
      // boundary (which the browser surfaces as an opaque "Script error.").
      if (response.status === 403 || response.status === 429) {
        const reason = response.status === 403 ? "not_authorized" : "rate_limited"
        return NextResponse.json({
          results: [],
          status: "OK",
          degraded: true,
          reason,
        })
      }

      return NextResponse.json({ error: "Polygon API error" }, { status: response.status })
    }

    const data = await response.json()

    const bars = (data.results || []).map((bar: any) => ({
      t: bar.t, // timestamp in ms
      o: bar.o, // open
      h: bar.h, // high
      l: bar.l, // low
      c: bar.c, // close
    }))

    return NextResponse.json({
      results: bars,
      status: "OK",
    })
  } catch (error) {
    console.error("[POLY AGG FX] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
