import { NextResponse } from "next/server"

function detectSession(d = new Date()) {
  const h = d.getUTCHours()
  if (h >= 23 || h < 8) return { name: "Asia", emoji: "🌏" }
  if (h < 16) return { name: "London", emoji: "🇬🇧" }
  return { name: "New York", emoji: "🇺🇸" }
}

function pairSessionNote(pair: string, session: string) {
  const p = pair.toUpperCase()
  const notes: Record<string, { slow?: string[]; strong?: string[]; tip: string }> = {
    EURUSD: {
      slow: ["Asia"],
      strong: ["London", "New York"],
      tip: "EURUSD can idle in Asia; wakes up as London opens.",
    },
    GBPUSD: { slow: ["Asia"], strong: ["London", "New York"], tip: "Often clean in London; decent carry into NY." },
    AUDUSD: { slow: ["London"], strong: ["Asia", "New York"], tip: "Asia session is prime for AUD crosses." },
    USDJPY: { slow: ["London"], strong: ["Asia", "New York"], tip: "Tokyo flow early; reacts to US yields in NY." },
  }
  const row = notes[p] || { tip: "Liquidity tends to improve into London/NY overlaps." }
  const bias = row.strong?.includes(session)
    ? "Active session for this pair — expect cleaner moves."
    : row.slow?.includes(session)
      ? "Typically slower — expect mean‑reversion or accumulation."
      : "Neutral activity."
  return { bias, tip: row.tip }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const q = String(body.q ?? "")
  const ctx = body.context || {}
  const pair = (ctx.instrument || ctx.pair || "EURUSD") as string
  const prev = ctx.prevDay as { high?: number; low?: number } | undefined

  const session = detectSession(new Date(ctx.now ?? Date.now()))
  const note = pairSessionNote(pair, session.name)

  // Quick intents
  const ask = q.toLowerCase()
  const msgs: string[] = []

  if (ask.includes("recap") || ask.includes("summarize") || ask.includes("confluence")) {
    msgs.push(
      `⏰ **Session** ${session.emoji}\nCurrent: **${session.name}** (UTC). For **${pair}**: ${note.bias}\n_${note.tip}_`,
    )
    msgs.push(
      `🧩 **Focus**\n` +
        `• Note the most recent swing high/low and check if price is coiling or expanding.\n` +
        `• Watch reaction at obvious liquidity (prior session extremes, weekly/daily open).\n` +
        `• Avoid impulse entries right into session opens or headlines.`,
    )
    if (prev?.high && prev?.low) {
      msgs.push(
        `📍 **Reference levels**\n• Prior Day High: **${prev.high.toFixed(4)}**\n• Prior Day Low: **${prev.low.toFixed(4)}**`,
      )
    } else {
      msgs.push(`📍 **Reference levels**\nConnect daily feed to show yesterday's high/low here.`)
    }
    msgs.push(
      `🗓 **Next session plan**\n• Prepare 1–2 scenarios with trigger conditions.\n• Set a reminder 10–15m before the open to re‑check structure/news.`,
    )
    return NextResponse.json({ messages: msgs })
  }

  if (ask.includes("checklist")) {
    msgs.push(
      `✅ **Pre‑trade checklist**\n` +
        `• Clear bias? (trend/range)\n` +
        `• Key level/zone identified\n` +
        `• Entry trigger defined (break/retest/flip)\n` +
        `• News/sessions OK\n` +
        `• Exit plan clear (invalid/target areas)`,
    )
    return NextResponse.json({ messages: msgs })
  }

  if (ask.includes("next session")) {
    msgs.push(
      `🗓 **Next session plan**\n` +
        `• For **${pair}** during **${session.name}**: ${note.bias}\n` +
        `• Mark prior session extremes and watch first pullback after open.\n` +
        `• Use alerts at obvious sweeps to re‑assess bias.`,
    )
    return NextResponse.json({ messages: msgs })
  }

  if (ask.includes("note")) {
    return NextResponse.json({ a: "Noted. I'll keep this in the thread so you can revisit later." })
  }

  if (ask.includes("remind")) {
    return NextResponse.json({ a: "Reminder set locally. I'll nudge you here when it's time." })
  }

  // default buddy reply
  return NextResponse.json({
    a: `Got it. I'm your trading buddy — ask for a **recap**, **checklist**, **next session plan**, **note**, or **remind me**.`,
  })
}
