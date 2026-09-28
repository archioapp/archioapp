import { NextResponse } from "next/server"
import { fetchUnifiedSnapshot } from "@/lib/providers/polygonRest"

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pair = (searchParams.get("pair") || "EURUSD").toUpperCase()

  try {
    const data = await fetchUnifiedSnapshot(pair)
    return NextResponse.json({ ok: true, data }, { status: 200 })
  } catch (e: any) {
    const message = e?.message || "snapshot failed"
    console.error("[polygon/snapshot]", message)
    const status = message.includes("not set") ? 503 : 500
    return NextResponse.json({ ok: false, error: message }, { status })
  }
}
