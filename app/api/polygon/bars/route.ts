import { NextResponse } from "next/server"
import { fetchCustomBars } from "@/lib/providers/polygonRest"

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pair = (searchParams.get("pair") || "EURUSD").toUpperCase()
  const multiplier = Number(searchParams.get("multiplier") || "1")
  const timespan = (searchParams.get("timespan") || "minute") as "minute" | "hour" | "day"
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const sort = (searchParams.get("sort") || "asc") as "asc" | "desc"

  if (!from || !to) {
    return NextResponse.json({ ok: false, error: "Missing required parameters: from, to" }, { status: 400 })
  }

  try {
    const data = await fetchCustomBars({ pair, multiplier, timespan, from, to, sort })
    return NextResponse.json({ ok: true, data }, { status: 200 })
  } catch (e: any) {
    const message = e?.message || "bars failed"
    console.error("[polygon/bars]", message)
    const status = message.includes("not set") ? 503 : 500
    return NextResponse.json({ ok: false, error: message }, { status })
  }
}
