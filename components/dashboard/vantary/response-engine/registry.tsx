"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO RESPONSE ENGINE · TEMPLATE REGISTRY (P2/P3)
   ───────────────────────────────────────────────────────────────────────────
   templateId → composition of primitives. The router picks the id, the
   model fills the data, THIS file decides what UI exists. AI never
   generates JSX (masterplan principle).

   First composition — ASSET DEEP DIVE (the vertical slice):
     Status(regime) → Trend(REAL closes) → MetricGrid → Timeline(events)
     → ActionPlan
   Missing template data → composition's empty state, never a broken card.
   ═══════════════════════════════════════════════════════════════════════════ */

import type React from "react"
import { motion } from "framer-motion"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import type { ArchioEnvelope, MarketGrounding } from "@/lib/response-engine/contract"
import type { JournalGrounding } from "@/lib/response-engine/journal"
import {
  StatusPrimitive,
  MetricGrid,
  TrendPrimitive,
  TimelinePrimitive,
  ActionPlan,
  TradeTape,
  SessionRhythm,
  LessonCard,
} from "./primitives"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono, ui-monospace, monospace)",
  textTransform: "uppercase",
}

export interface TemplateProps {
  accent: ThemeAccent
  envelope: ArchioEnvelope
  market: MarketGrounding | null
  journal: JournalGrounding | null
}

/* Soft hairline between stacked primitives. */
function Rule({ rgb }: { rgb: string }) {
  return <div aria-hidden className="w-full" style={{ height: 1, background: `linear-gradient(90deg, ${vgRgba(rgb, 0.14)}, transparent 70%)` }} />
}

/* ── ASSET DEEP DIVE ────────────────────────────────────────────────────── */
function AssetDeepDive({ accent, envelope, market }: TemplateProps) {
  const rgb = accent.rgb
  const data = envelope.data
  if (!data) {
    return (
      <div className="flex items-center gap-3 py-2">
        <span aria-hidden style={{ width: 4, height: 4, borderRadius: 999, background: vgRgba(rgb, 0.5) }} />
        <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.24em", color: VG_VT.paperDim }}>
          Structured read unavailable — verdict above stands
        </span>
      </div>
    )
  }

  /* Stagger the primitives in — the "workspace adapts" moment. */
  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: EASE, delay: 0.08 * i },
  })

  return (
    <div className="flex flex-col gap-5 w-full" style={{ maxWidth: 640 }}>
      <motion.div {...stagger(0)}>
        <StatusPrimitive accent={accent} regime={data.regime} />
      </motion.div>

      {market && market.closes.length >= 8 && (
        <motion.div {...stagger(1)}>
          <TrendPrimitive accent={accent} market={market} />
        </motion.div>
      )}

      <motion.div {...stagger(2)} className="flex flex-col gap-5">
        <Rule rgb={rgb} />
        <MetricGrid accent={accent} metrics={data.metrics} />
      </motion.div>

      {data.events.length > 0 && (
        <motion.div {...stagger(3)} className="flex flex-col gap-5">
          <Rule rgb={rgb} />
          <TimelinePrimitive accent={accent} events={data.events} />
        </motion.div>
      )}

      {data.plan.length > 0 && (
        <motion.div {...stagger(4)} className="flex flex-col gap-5">
          <Rule rgb={rgb} />
          <ActionPlan accent={accent} plan={data.plan} />
        </motion.div>
      )}
    </div>
  )
}

/* ── TRADE POST-MORTEM ──────────────────────────────────────────────────
   "Why did I lose yesterday?" — Studio room, strategy+psychology lenses.
   Composition: Status(session character) → TradeTape(REAL journal rows,
   model takes joined by tradeId) → SessionRhythm(R by hour) → MetricGrid
   → Lesson → ActionPlan(corrective steps). The dramatic beat is the tape:
   the trader sees their own day replayed with one honest line per trade. */
function TradePostMortem({ accent, envelope, journal }: TemplateProps) {
  const rgb = accent.rgb
  const data = envelope.data
  if (!data) {
    return (
      <div className="flex items-center gap-3 py-2">
        <span aria-hidden style={{ width: 4, height: 4, borderRadius: 999, background: vgRgba(rgb, 0.5) }} />
        <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.24em", color: VG_VT.paperDim }}>
          Structured review unavailable — verdict above stands
        </span>
      </div>
    )
  }

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: EASE, delay: 0.08 * i },
  })

  return (
    <div className="flex flex-col gap-5 w-full" style={{ maxWidth: 640 }}>
      <motion.div {...stagger(0)}>
        <StatusPrimitive accent={accent} regime={data.regime} />
      </motion.div>

      {journal && (
        <motion.div {...stagger(1)} className="flex flex-col gap-5">
          <Rule rgb={rgb} />
          <TradeTape accent={accent} journal={journal} takes={data.review?.tradeTakes ?? []} />
        </motion.div>
      )}

      {journal && (
        <motion.div {...stagger(2)} className="flex flex-col gap-5">
          <SessionRhythm accent={accent} journal={journal} />
        </motion.div>
      )}

      <motion.div {...stagger(3)} className="flex flex-col gap-5">
        <Rule rgb={rgb} />
        <MetricGrid accent={accent} metrics={data.metrics} />
      </motion.div>

      {data.review?.lesson && (
        <motion.div {...stagger(4)} className="flex flex-col gap-5">
          <Rule rgb={rgb} />
          <LessonCard accent={accent} lesson={data.review.lesson} />
        </motion.div>
      )}

      {data.plan.length > 0 && (
        <motion.div {...stagger(5)} className="flex flex-col gap-5">
          <Rule rgb={rgb} />
          <ActionPlan accent={accent} plan={data.plan} />
        </motion.div>
      )}
    </div>
  )
}

/* ── Registry ───────────────────────────────────────────────────────────── */

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<TemplateProps>> = {
  "asset-deep-dive": AssetDeepDive,
  "trade-post-mortem": TradePostMortem,
  /* P3 remaining: scenario-lab, room-catch-up, discussion-summary,
     agent-discovery, trust-passport, student-radar */
}

export function ArchioTemplateCanvas(props: TemplateProps & { templateId: string | null }) {
  const { templateId, ...rest } = props
  if (!templateId) return null
  const Template = TEMPLATE_REGISTRY[templateId]
  if (!Template) return null
  return <Template {...rest} />
}
