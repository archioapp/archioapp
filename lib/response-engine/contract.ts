/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO RESPONSE ENGINE · CONTRACT (P1 of the masterplan)
   ───────────────────────────────────────────────────────────────────────────
   The single typed envelope every Archio answer travels in. Server-side the
   model fills ONLY the content fields (message, data, followUps, actions);
   ROUTING fields (mode, room, lenses, templateId) are decided
   deterministically by the router BEFORE the model runs and are delivered
   in the `X-Archio-Route` header so the UI can react instantly (room glow,
   named thinking states) while tokens are still streaming.

   HARD PRINCIPLE — the model NEVER invents market numbers. Real polygon
   data is injected into the prompt (grounding) AND shipped raw to the
   client via `X-Archio-Market` so chart primitives render REAL closes,
   not model-echoed ones.
   ═══════════════════════════════════════════════════════════════════════════ */

import { z } from "zod"

/* ── Routing (server-decided, deterministic) ────────────────────────────── */

export type ArchioMode = "quick" | "analysis" | "build" | "workspace"
export type RoomId = "market-floor" | "studio" | "mentor-hall" | "collective"
export type LensId = "master" | "market" | "strategy" | "psychology" | "portfolio" | "network" | "trust"

export interface ArchioRoute {
  intent: string
  mode: ArchioMode
  room: RoomId | null
  lenses: LensId[]
  templateId: string | null
  /** Named thinking states rendered sequentially while tokens stream. */
  thinking: string[]
  /** Detected primary instrument (e.g. "EURUSD"), if any. */
  instrument: string | null
}

/* ── Market grounding (real polygon data, server-collected) ─────────────── */

export interface MarketGrounding {
  pair: string
  last: number | null
  dayOpen: number | null
  dayHigh: number | null
  dayLow: number | null
  prevClose: number | null
  changePct: number | null
  /** Recent hourly closes, oldest→newest — feeds the Trend primitive. */
  closes: number[]
  asOf: string
  source: "polygon"
}

/* ── Model output schema (zod — validated, degraded gracefully on fail) ──
   NOTE: `message` is FIRST so it streams first; the client extracts it
   progressively from the partial JSON text stream. */

export const archioEnvelopeSchema = z.object({
  message: z
    .string()
    .describe(
      "The verdict. One or two sentences max, senior-analyst voice, decision-useful. This is the big readout line — no preamble, no 'Based on the data'.",
    ),
  body: z
    .string()
    .describe(
      "2-4 sentences of supporting reasoning below the readout. Terse, concrete, cites the grounded numbers where relevant.",
    ),
  data: z
    .object({
      regime: z.object({
        label: z.string().describe("Regime name, 2-4 words, e.g. 'Compression before ECB'"),
        tone: z.enum(["bullish", "bearish", "neutral", "mixed"]),
        note: z.string().describe("One line on why, grounded in the provided prices"),
      }),
      metrics: z
        .array(
          z.object({
            label: z.string().describe("Short metric label, e.g. 'LAST', 'DAY RANGE', 'VS PREV CLOSE'"),
            value: z.string().describe("The value, echoing the grounded numbers EXACTLY as provided"),
            /* nullable (not optional) — OpenAI strict structured output
               requires every property present; null = no directional tone */
            tone: z.enum(["up", "down", "flat"]).nullable(),
          }),
        )
        .min(3)
        .max(6),
      events: z
        .array(
          z.object({
            time: z.string().describe("HH:MM or relative, e.g. '08:30'"),
            label: z.string(),
            weight: z.enum(["high", "med", "low"]),
          }),
        )
        .max(4)
        .describe("Session events/catalysts. If none are known from context, return an empty array — NEVER invent."),
      plan: z
        .array(
          z.object({
            action: z.string().describe("Imperative, 3-7 words"),
            detail: z.string().describe("One grounding line"),
          }),
        )
        .min(2)
        .max(4)
        .describe("What to actually do about it, in order"),
      review: z
        .object({
          verdict: z
            .enum(["discipline", "execution", "strategy", "market"])
            .describe(
              "Root cause category. discipline=broke own rules, execution=right idea traded badly, strategy=edge genuinely failed, market=unforecastable event",
            ),
          tradeTakes: z
            .array(
              z.object({
                tradeId: z.string().describe("Echo the trade id EXACTLY from JOURNAL GROUNDING, e.g. 'T4'"),
                take: z.string().describe("One tight sentence on THIS trade: what it reveals"),
              }),
            )
            .min(1)
            .max(6)
            .describe("Per-trade reads, joined to the real journal rows by tradeId"),
          lesson: z
            .string()
            .describe("THE lesson — one memorable sentence the trader should carry into tomorrow. Second person."),
        })
        .nullable()
        .describe("Post-mortem section. Fill ONLY for review intent (JOURNAL GROUNDING present); null otherwise."),
    })
    .nullable()
    .describe("Template data. null for quick conversational answers."),
  confidence: z.enum(["high", "medium", "low"]),
  followUps: z.array(z.string()).min(1).max(3).describe("Natural next questions, short"),
  actions: z
    .array(z.object({ label: z.string(), command: z.string() }))
    .max(3)
    .describe("Fireable next commands. command is a plain-english prompt to resubmit."),
})

export type ArchioEnvelope = z.infer<typeof archioEnvelopeSchema>

/* ── The full client-side answer (route + envelope + grounding merged) ──── */

export interface ArchioAnswer {
  route: ArchioRoute
  envelope: ArchioEnvelope
  market: MarketGrounding | null
  /** Journal grounding (post-mortem family) — real trades ship raw to the
      client so TradeTape renders journal truth, never model echoes. */
  journal: import("./journal").JournalGrounding | null
  /** True when served by the deterministic fallback brain (API unreachable). */
  demo: boolean
}
