"use client"

/**
 * LIVE ROOM — shared trade vocabulary
 *
 *   ConfluenceStrata  — a level as a stack of weighted reasons
 *   InvalidationLine  — the red hairline: price · condition · consequence
 *   EvidenceChips     — provenance: the events a claim stands on
 */

import * as React from "react"
import { motion } from "framer-motion"
import { Droplets, Layers, Grid2x2, Waves, Landmark, Clock, type LucideIcon } from "lucide-react"
import { LR, lrMix, toneColor } from "./live-room-tokens"
import { LrEyebrow, useReducedMotion } from "./live-room-primitives"
import { useSession } from "./session-store"
import { EVENT_META, clockLabel, type Confluence, type ConfluenceKind, type Invalidation } from "./session-state"
import { scrollToEvent } from "./phase-rail"

const KIND_GLYPH: Record<ConfluenceKind, LucideIcon> = { liquidity: Droplets, structure: Layers, gap: Grid2x2, flow: Waves, macro: Landmark, time: Clock }
const KIND_LABEL: Record<ConfluenceKind, string> = { liquidity: "Liquidity", structure: "Structure", gap: "Imbalance", flow: "Order flow", macro: "Macro", time: "Time / range" }

export function ConfluenceStrata({ strata, compact = false, live = true }: { strata: Confluence[]; compact?: boolean; live?: boolean }) {
  const reduce = useReducedMotion()
  const total = strata.reduce((s, c) => s + c.weight, 0)
  return (
    <div className="flex flex-col gap-1.5 min-w-0" role="list" aria-label={`${strata.length} confluences, total weight ${total}`}>
      {!compact && (
        <div className="flex items-center gap-2 pb-0.5">
          <LrEyebrow size={9}>Confluence</LrEyebrow>
          <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
          <span className="font-mono tabular-nums" style={{ fontSize: 9, letterSpacing: "0.14em", color: LR.primary }}>{total} / {strata.length * 5}</span>
        </div>
      )}
      {strata.map((c, i) => {
        const Glyph = KIND_GLYPH[c.kind]
        return (
          <div key={c.label} role="listitem" className="flex items-center gap-2.5 min-w-0" style={{ padding: compact ? "2px 0" : "3px 0" }}>
            <span className="inline-flex items-center justify-center shrink-0" style={{ width: 20, height: 20, borderRadius: 6, background: lrMix(LR.primary, 0.08), border: `1px solid ${lrMix(LR.primary, 0.16)}`, color: LR.primary }} title={KIND_LABEL[c.kind]}>
              <Glyph size={10.5} />
            </span>
            <span className="font-sans flex-1 min-w-0 truncate" style={{ fontSize: compact ? 11.5 : 12, color: LR.paper, lineHeight: 1.3 }}>{c.label}</span>
            <span className="flex items-center gap-[3px] shrink-0" aria-label={`weight ${c.weight} of 5`}>
              {[1, 2, 3, 4, 5].map((w) => (
                <motion.span
                  key={w}
                  className="block rounded-[1.5px]"
                  style={{ width: 6, height: 9, background: w <= c.weight ? lrMix(LR.primary, 0.85 - (w - 1) * 0.1) : lrMix(LR.paper, 0.07), boxShadow: w <= c.weight ? `0 0 6px ${lrMix(LR.primary, 0.25)}` : "none" }}
                  initial={live && !reduce ? { opacity: 0, scaleY: 0.3 } : false}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.35, ease: LR.ease, delay: 0.05 * i + 0.04 * w }}
                />
              ))}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function InvalidationLine({ inv, compact = false }: { inv: Invalidation; compact?: boolean }) {
  const c = toneColor("down")
  return (
    <div className="relative flex flex-col gap-0.5 min-w-0" style={{ paddingLeft: 10 }}>
      <span aria-hidden className="absolute left-0 top-1 bottom-1 w-px" style={{ background: `linear-gradient(180deg, transparent, ${lrMix(c, 0.8)} 20%, ${lrMix(c, 0.8)} 80%, transparent)` }} />
      <div className="flex items-center gap-2 min-w-0">
        <span aria-hidden className="inline-block rounded-full shrink-0" style={{ width: 4, height: 4, background: lrMix(c, 0.85), boxShadow: `0 0 6px ${lrMix(c, 0.55)}` }} />
        <span className="font-mono uppercase shrink-0" style={{ fontSize: 8.5, letterSpacing: "0.2em", color: c, fontWeight: 500 }}>Invalidation</span>
        {inv.price !== undefined && (
          <span className="font-mono tabular-nums shrink-0" style={{ fontSize: compact ? 11 : 12, color: c, fontWeight: 500 }}>{inv.instrument ? `${inv.instrument} ` : ""}{inv.price >= 100 ? inv.price.toFixed(2) : inv.price.toFixed(4)}</span>
        )}
      </div>
      <p className="m-0 font-sans text-pretty" style={{ fontSize: compact ? 11 : 11.5, lineHeight: 1.4, color: LR.paperDim, paddingLeft: 12 }}>
        {inv.condition}{!compact && inv.consequence ? ` — ${inv.consequence}` : ""}
      </p>
    </div>
  )
}

export function EvidenceChips({ ids, label = "Stands on", max = 4 }: { ids: string[]; label?: string; max?: number }) {
  const s = useSession()
  const evs = ids.map((id) => s.events.find((e) => e.id === id)).filter(Boolean) as NonNullable<ReturnType<typeof s.events.find>>[]
  if (!evs.length) return null
  return (
    <div className="flex items-center gap-x-2 gap-y-1 flex-wrap min-w-0">
      <LrEyebrow size={8.5} weight={500}>{label}</LrEyebrow>
      {evs.slice(0, max).map((e, i) => {
        const on = s.litEvents.has(e.id) || s.focusedEvent === e.id
        return (
          <React.Fragment key={e.id}>
            {i > 0 && <span aria-hidden style={{ width: 1, height: 10, background: LR.rule }} />}
            <button
              type="button"
              title={e.title}
              onClick={() => { s.focusEvent(e.id); window.setTimeout(() => scrollToEvent(e.id), 40) }}
              onMouseEnter={() => s.dispatch({ type: "hoverEvent", id: e.id })}
              onMouseLeave={() => s.dispatch({ type: "hoverEvent", id: null })}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded focus:outline-none focus-visible:ring-1"
              style={{ padding: 0, background: "transparent", border: "none", cursor: "pointer", font: "inherit" }}
            >
              <span aria-hidden className="inline-block rounded-full" style={{ width: 3, height: 3, background: on ? LR.primary : lrMix(LR.ashSoft, 0.7), boxShadow: on ? `0 0 6px ${LR.primary}` : "none", transition: "background 200ms" }} />
              <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: on ? LR.primary : LR.ashSoft, transition: "color 200ms" }}>{EVENT_META[e.type].label}</span>
              <span className="font-mono tabular-nums" style={{ fontSize: 9.5, color: on ? LR.paper : LR.paperDim, transition: "color 200ms" }}>{clockLabel(e.at)}</span>
            </button>
          </React.Fragment>
        )
      })}
      {evs.length > max && <span className="font-mono" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: LR.ashSoft }}>+{evs.length - max}</span>}
    </div>
  )
}
