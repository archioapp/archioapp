"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO RESPONSE ENGINE · useArchio (client streaming consumer)
   ───────────────────────────────────────────────────────────────────────────
   One hook per conversation. For each fired prompt it:

     1. POSTs /api/archio → reads `X-Archio-Route` + `X-Archio-Market`
        headers at time-to-first-byte (instant room glow + named thinking).
     2. Streams the raw JSON text of the ArchioEnvelope, progressively
        extracting the `message` field (schema puts it first) so the
        verdict types itself out live.
     3. On completion, JSON.parses the full envelope → structured template
        data for the registry.

   FAILURE MODES (masterplan §N):
     · fetch/network fail → deterministic fallback brain (archio-
       intelligence composeAnswer), flagged `demo: true` in provenance.
     · invalid final JSON but message extracted → degrade to QUICK mode
       with the streamed message. Never a broken card.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useCallback, useRef, useState } from "react"
import {
  archioEnvelopeSchema,
  type ArchioEnvelope,
  type ArchioRoute,
  type MarketGrounding,
} from "@/lib/response-engine/contract"
import type { JournalGrounding } from "@/lib/response-engine/journal"
import { composeAnswer } from "./archio-intelligence"

export type TurnStatus = "routing" | "streaming" | "done" | "error"

export interface ArchioTurnResult {
  status: TurnStatus
  route: ArchioRoute | null
  market: MarketGrounding | null
  /** Real journal rows for the post-mortem family (X-Archio-Journal). */
  journal: JournalGrounding | null
  /** Progressively streamed verdict (available during "streaming"). */
  liveMessage: string
  envelope: ArchioEnvelope | null
  demo: boolean
}

const IDLE: ArchioTurnResult = {
  status: "routing",
  route: null,
  market: null,
  journal: null,
  liveMessage: "",
  envelope: null,
  demo: false,
}

/** Extract a progressively-streaming JSON string field ("message") from a
    partial JSON buffer — tolerant of the string being mid-stream/unclosed. */
function extractStreamingField(buffer: string, field: string): string {
  const key = `"${field}"`
  const start = buffer.indexOf(key)
  if (start === -1) return ""
  let i = buffer.indexOf('"', start + key.length + 1) // opening quote of the value
  if (i === -1) return ""
  i++
  let out = ""
  while (i < buffer.length) {
    const ch = buffer[i]
    if (ch === "\\") {
      const next = buffer[i + 1]
      if (next === undefined) break
      out += next === "n" ? "\n" : next === "t" ? "\t" : next
      i += 2
      continue
    }
    if (ch === '"') break // value closed
    out += ch
    i++
  }
  return out
}

export function useArchio() {
  const [result, setResult] = useState<ArchioTurnResult>(IDLE)
  const abortRef = useRef<AbortController | null>(null)
  const historyRef = useRef<{ role: "user" | "assistant"; text: string }[]>([])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    historyRef.current = []
    setResult(IDLE)
  }, [])

  const fire = useCallback(async (prompt: string) => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setResult({ ...IDLE, status: "routing" })

    try {
      const res = await fetch("/api/archio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, history: historyRef.current.slice(-6) }),
        signal: ac.signal,
      })
      if (!res.ok || !res.body) throw new Error(`archio ${res.status}`)

      /* Route + grounding available immediately from headers. Values are
         URI-encoded JSON (headers are Latin-1 only; grounding text carries
         unicode) — decode symmetrically with the server. */
      const readHeader = <T,>(name: string): T | null => {
        const raw = res.headers.get(name)
        if (!raw) return null
        try {
          return JSON.parse(decodeURIComponent(raw)) as T
        } catch {
          return null
        }
      }
      const route = readHeader<ArchioRoute>("X-Archio-Route")
      const market = readHeader<MarketGrounding>("X-Archio-Market")
      const journal = readHeader<JournalGrounding>("X-Archio-Journal")

      setResult((r) => ({ ...r, status: "streaming", route, market, journal }))

      /* Stream the envelope JSON, surfacing `message` as it types. */
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const live = extractStreamingField(buffer, "message")
        if (live) setResult((r) => ({ ...r, liveMessage: live }))
      }
      buffer += decoder.decode()

      /* Final parse + validation. Invalid → degrade, never break. */
      let envelope: ArchioEnvelope | null = null
      try {
        envelope = archioEnvelopeSchema.parse(JSON.parse(buffer))
      } catch {
        const salvaged = extractStreamingField(buffer, "message")
        if (salvaged) {
          envelope = {
            message: salvaged,
            body: extractStreamingField(buffer, "body"),
            data: null,
            confidence: "low",
            followUps: [],
            actions: [],
          }
        }
      }
      if (!envelope) throw new Error("empty envelope")

      historyRef.current.push({ role: "user", text: prompt }, { role: "assistant", text: envelope.message })
      setResult({ status: "done", route, market, journal, liveMessage: envelope.message, envelope, demo: false })
    } catch (e) {
      if (ac.signal.aborted) return
      console.error("[v0] archio stream failed, falling back to demo brain:", e)
      /* Deterministic fallback — clearly flagged as demo in provenance. */
      const canned = composeAnswer(prompt)
      historyRef.current.push({ role: "user", text: prompt }, { role: "assistant", text: canned.readout })
      setResult({
        status: "done",
        route: null,
        market: null,
        journal: null,
        liveMessage: canned.readout,
        envelope: {
          message: canned.readout,
          body: canned.body,
          data: null,
          confidence: "low",
          followUps: [canned.suggestion],
          actions: [],
        },
        demo: true,
      })
    }
  }, [])

  return { result, fire, reset }
}
