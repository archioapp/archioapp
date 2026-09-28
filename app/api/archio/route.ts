/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO RESPONSE ENGINE · /api/archio (P1)
   ───────────────────────────────────────────────────────────────────────────
   The Intelligence Chamber's real brain. One request =

     1. routeArchio(prompt)          → deterministic route (mode/room/lens/
                                       template) — shipped IMMEDIATELY in the
                                       `X-Archio-Route` header so the UI can
                                       glow the room + name its thinking
                                       states while tokens stream.
     2. collect MARKET grounding    → REAL polygon snapshot + 48 hourly bars
                                       for the detected instrument (server-
                                       side, no extra client round-trip),
                                       shipped raw in `X-Archio-Market`.
     3. streamObject(gpt-5-mini)    → the ArchioEnvelope, `message` field
                                       first so it streams first. The model
                                       is grounded in the real numbers and
                                       FORBIDDEN from inventing any.

   Client contract: read the text stream (partial JSON), progressively
   extract `message`, JSON.parse on completion, merge with the two headers.
   Invalid final JSON → client degrades to quick mode (masterplan §N).
   ═══════════════════════════════════════════════════════════════════════════ */

import { streamObject } from "ai"
import { archioEnvelopeSchema, type MarketGrounding } from "@/lib/response-engine/contract"
import { collectJournalGrounding, type JournalGrounding } from "@/lib/response-engine/journal"
import { routeArchio } from "@/lib/response-engine/router"
import { fetchUnifiedSnapshot, fetchCustomBars } from "@/lib/providers/polygonRest"

export const maxDuration = 30

const SYSTEM = `You are ARCHIO — the intelligence layer of a premium trading operating system.

VOICE:
- Senior analyst. Terse, precise, quietly authoritative. Never chatty, never emojis, never "Great question".
- The "message" field is a VERDICT: the single line a desk head would say. Make it land.
- The "body" field is the supporting read: 2-4 concrete sentences.

HARD RULES:
- NEVER invent market numbers. Use ONLY the numbers in MARKET GROUNDING (when provided), echoed exactly.
- NEVER invent trades or journal numbers. Use ONLY the trades in JOURNAL GROUNDING (when provided). tradeIds echoed exactly.
- Post-mortem verdicts separate WHAT happened (strategy) from WHO happened (discipline/psychology). The pre-computed patterns in the grounding are trusted signal — build on them, do not contradict them.
- If grounding is absent or empty, answer qualitatively and set any numeric metrics you cannot ground to fewer metrics — never fabricate.
- The "events" array: only include events you can infer from the provided context. Empty array is correct when unsure.
- NEVER give direct financial advice ("take this trade"). Frame as "this matches / violates your criteria".
- "confidence" reflects data quality: real grounding = high/medium; no grounding = low.
- followUps: what the trader would genuinely ask next. actions: plain-english commands they can fire.`

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null
}

/** Collect REAL market grounding server-side. Null-safe on every failure. */
async function collectMarketGrounding(pair: string): Promise<MarketGrounding | null> {
  try {
    const to = new Date()
    const from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 4) // 4 days of hourly bars
    const [snap, bars] = await Promise.all([
      fetchUnifiedSnapshot(pair),
      fetchCustomBars({
        pair,
        multiplier: 1,
        timespan: "hour",
        from: from.toISOString(),
        to: to.toISOString(),
        sort: "asc",
      }),
    ])

    const last = num(snap.last) ?? num(bars.at(-1)?.c)
    const prevClose = num(snap.prev?.c)
    const changePct =
      last != null && prevClose != null && prevClose !== 0
        ? Number((((last - prevClose) / prevClose) * 100).toFixed(3))
        : null

    /* Compact closes: last 48 hourly closes, rounded to keep headers small. */
    const closes = bars.slice(-48).map((b: { c: number }) => Number(b.c.toFixed(5)))

    if (last == null && closes.length === 0) return null

    return {
      pair,
      last,
      dayOpen: num(snap.day?.o),
      dayHigh: num(snap.day?.h),
      dayLow: num(snap.day?.l),
      prevClose,
      changePct,
      closes,
      asOf: new Date().toISOString(),
      source: "polygon",
    }
  } catch (e) {
    /* Grounding is best-effort by design: a failed market fetch degrades
       the answer to honest AI reasoning (confidence drops, no fabricated
       numbers) rather than failing the request. Log for observability. */
    console.error("archio grounding failed:", e instanceof Error ? e.message : e)
    return null
  }
}

export async function POST(req: Request) {
  const {
    prompt,
    history,
  }: {
    prompt: string
    history?: { role: "user" | "assistant"; text: string }[]
  } = await req.json()

  if (!prompt?.trim()) {
    return new Response(JSON.stringify({ error: "empty prompt" }), { status: 400 })
  }

  /* 1 · Deterministic route — computed before any model/data work. */
  const route = routeArchio(prompt)

  /* 2 · Grounding packs, selected by route. Market for instrument
        questions; journal for the post-mortem family. Both are adapters —
        the engine never knows (or cares) whether the source is polygon,
        Supabase, or the deterministic demo book. */
  const market = route.instrument ? await collectMarketGrounding(route.instrument) : null
  const journal: JournalGrounding | null = route.intent === "review" ? collectJournalGrounding() : null

  /* 3 · Compose the grounded prompt. */
  let user = ""
  if (history?.length) {
    user += `CONVERSATION SO FAR:\n${history
      .slice(-6)
      .map((h) => `${h.role === "user" ? "TRADER" : "ARCHIO"}: ${h.text}`)
      .join("\n")}\n\n`
  }
  user += `ROUTE: intent=${route.intent} mode=${route.mode} template=${route.templateId ?? "none"}\n`
  if (market) {
    user += `\nMARKET GROUNDING (REAL polygon data — the ONLY numbers you may use):\n${JSON.stringify(
      { ...market, closes: `${market.closes.length} hourly closes, latest ${market.closes.at(-1)}` },
      null,
      2,
    )}\nRecent hourly closes (oldest→newest): ${market.closes.join(", ")}\n`
  } else if (route.instrument) {
    user += `\nMARKET GROUNDING: unavailable for ${route.instrument} right now. Answer qualitatively, say data is unavailable, confidence=low.\n`
  }
  if (journal) {
    user += `\nJOURNAL GROUNDING (the trader's REAL logged trades for ${journal.stats.date} — the ONLY trades/numbers you may cite):\n${JSON.stringify(
      { stats: journal.stats, trades: journal.trades, patterns: journal.patterns },
      null,
      2,
    )}\n`
  }
  user += `\nMODE INSTRUCTION: ${
    route.templateId === "trade-post-mortem"
      ? "Trade post-mortem — fill data completely: regime = the session's character (label like 'Discipline drift after lunch', tone, note); 4-6 metrics from the journal stats (NET R, WIN RATE, RULE BREAKS, AM/PM split); events = []; plan = 2-4 corrective steps for tomorrow; review = { verdict category, one take per losing/rule-breaking trade joined by tradeId, and THE lesson }."
      : route.mode === "analysis"
        ? "Full analysis — fill the data object completely (regime, 4-6 metrics from the grounding, events you can infer or [], a 2-4 step plan, review=null)."
        : "Quick answer — set data to null. Verdict + body only."
  }\n\nTRADER'S QUESTION: ${prompt}`

  /* gpt-5-mini measured 24s to first token / 38s total on the post-mortem —
     past this route's 30s ceiling. gpt-4.1-mini lands the same grounded
     verdict in ~6s. */
  const result = streamObject({
    model: "openai/gpt-4.1-mini",
    schema: archioEnvelopeSchema,
    system: SYSTEM,
    prompt: user,
    abortSignal: req.signal,
  })

  /* 4 · Stream raw JSON text; route + grounding travel as headers so the
        client has them at time-to-first-byte. */
  const response = result.toTextStreamResponse()
  const headers = new Headers(response.headers)
  /* HTTP headers are ByteStrings (Latin-1 only) — grounding text can carry
     unicode (em-dashes in journal patterns, symbols in thinking states), so
     every payload header is URI-encoded; the client decodes symmetrically. */
  const headerSafe = (v: unknown) => encodeURIComponent(JSON.stringify(v))
  headers.set("X-Archio-Route", headerSafe(route))
  if (market) headers.set("X-Archio-Market", headerSafe(market))
  if (journal) headers.set("X-Archio-Journal", headerSafe(journal))
  headers.set("Cache-Control", "no-store")

  return new Response(response.body, { status: response.status, headers })
}
