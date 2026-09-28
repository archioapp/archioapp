"use client"

/**
 * LIVE ROOM — Trade anatomy
 *
 * The open (or last) position drawn as R-geometry: entry = 0 R, original
 * stop = −1 R, every other rung in the same unit. One ladder for every
 * trade, so a viewer learns one shape. The live price marker rides the
 * same tape as the chart; MFE / MAE come from the extremes since entry.
 *
 * Hover a rung → its source event lights in the timeline and the chart
 * draws its marker. Everything derives at viewMin.
 */

import * as React from "react"
import { motion, animate, useMotionValue } from "framer-motion"
import { LR, lrMix, toneColor, type LrTone } from "./live-room-tokens"
import { LrPane, LrPaneHeader, LrRecess, LrEyebrow, LrChip, useReducedMotion } from "./live-room-primitives"
import { LrCapsule, LrCapsuleStrip } from "./lr-capsule"
import { useSession } from "./session-store"
import { agoLabel, clockLabel, type AnatomyRung, type RiskState } from "./session-state"
import { Term } from "./explain-term"
import { scrollToEvent } from "./phase-rail"

const RISK_LABEL: Record<RiskState, { label: string; tone: LrTone; line: string }> = {
  "at-risk":   { label: "At risk",    tone: "down",    line: "Full stop distance is exposed. Risk is defined by the stop, not the headline." },
  banked:      { label: "Banked",     tone: "primary", line: "Profit has been taken; the remainder still carries its original stop." },
  protected:   { label: "Protected",  tone: "up",      line: "Stop is at entry. The trade can no longer lose." },
  "risk-free": { label: "Risk-free",  tone: "up",      line: "Stop is above entry. The worst case is a smaller win." },
  closed:      { label: "Closed",     tone: "neutral", line: "Flat. This is the shape of the finished trade." },
  flat:        { label: "Flat",       tone: "neutral", line: "No position." },
}

function Rolling({ value, digits = 1, prefix = "", suffix = "" }: { value: number; digits?: number; prefix?: string; suffix?: string }) {
  const mv = useMotionValue(value)
  const reduce = useReducedMotion()
  const [txt, setTxt] = React.useState(() => value.toFixed(digits))
  React.useEffect(() => {
    if (reduce) { setTxt(value.toFixed(digits)); return }
    const c = animate(mv, value, { duration: 0.6, ease: LR.easeOut, onUpdate: (v) => setTxt(v.toFixed(digits)) })
    return () => c.stop()
  }, [value, mv, reduce, digits])
  return <>{prefix}{txt}{suffix}</>
}

const fmtPrice = (p: number) => (p >= 100 ? p.toFixed(2) : p.toFixed(4))
const fmtR = (r: number) => `${r >= 0 ? "+" : "−"}${Math.abs(r).toFixed(1)} R`

function Ladder() {
  const s = useSession()
  const a = s.anatomy!
  const reduce = useReducedMotion()
  const H = 226
  const y = (r: number) => ((a.rMax - r) / Math.max(1e-9, a.rMax - a.rMin)) * H
  const up = toneColor("up"), dn = toneColor("down"), pr = LR.primary
  const priceY = y(a.rNow)
  const protectedNow = a.riskState === "protected" || a.riskState === "risk-free"
  const stopNowR = (a.stop - a.entry) / a.riskPerUnit * (a.direction === "bearish" ? -1 : 1)

  const hover = (id?: string) => s.dispatch({ type: "hoverEvent", id: id ?? null })

  return (
    <div className="relative w-full select-none" style={{ height: H }} role="img" aria-label={`Trade ladder: price at ${fmtR(a.rNow)}, target ${fmtR(a.rungs[0].r)}, stop ${fmtR(-1)}`}>
      {/* zones */}
      {/* remaining reward — hatched from price to target */}
      {a.remaining > 0 && a.rungs[0].r > a.rNow && (
        <span aria-hidden className="absolute left-[76px] right-[120px]" style={{ top: y(a.rungs[0].r), height: Math.max(0, priceY - y(a.rungs[0].r)), background: `repeating-linear-gradient(135deg, ${lrMix(up, 0.16)} 0 2px, transparent 2px 7px)`, borderTop: `1px dashed ${lrMix(up, 0.35)}` }} />
      )}
      {/* captured — solid from entry to price */}
      {a.rNow > 0 && (
        <motion.span aria-hidden className="absolute left-[76px] right-[120px]" style={{ background: `linear-gradient(180deg, ${lrMix(up, 0.22)}, ${lrMix(up, 0.06)})` }}
          animate={{ top: priceY, height: Math.max(0, y(0) - priceY) }} transition={reduce ? { duration: 0 } : LR.spring} />
      )}
      {/* risk — entry to stop now (solid) and original stop (dashed, retired) */}
      <span aria-hidden className="absolute left-[76px] right-[120px]" style={{ top: y(0), height: Math.max(0, y(-1) - y(0)), background: `linear-gradient(180deg, ${lrMix(dn, protectedNow ? 0.03 : 0.1)}, ${lrMix(dn, protectedNow ? 0.01 : 0.03)})`, borderBottom: `1px ${protectedNow ? "dashed" : "solid"} ${lrMix(dn, protectedNow ? 0.35 : 0.6)}` }} />
      {protectedNow && (
        <span aria-hidden className="absolute left-[76px] right-[120px]" style={{ top: Math.min(y(0), y(stopNowR)), height: Math.abs(y(0) - y(stopNowR)), background: lrMix(up, 0.1), borderBottom: `1px solid ${lrMix(up, 0.6)}` }} />
      )}
      {/* axis */}
      <span aria-hidden className="absolute" style={{ left: 76, top: 0, bottom: 0, width: 1, background: LR.dashedV(lrMix(LR.paper, 0.14)) }} />

      {/* rungs */}
      {a.rungs.map((rg: AnatomyRung) => {
        const c = toneColor(rg.tone)
        const lit = !!rg.eventId && (s.hoveredEvent === rg.eventId || s.focusedEvent === rg.eventId || s.litEvents.has(rg.eventId))
        return (
          <button
            key={`${rg.kind}-${rg.price}`}
            type="button"
            aria-label={`${rg.label} ${fmtPrice(rg.price)} · ${fmtR(rg.r)}${rg.note ? ` · ${rg.note}` : ""}`}
            className="absolute left-0 right-0 flex items-center gap-2 focus:outline-none"
            style={{ top: y(rg.r) - 9, height: 18, opacity: rg.retired ? 0.55 : 1 }}
            onMouseEnter={() => hover(rg.eventId)}
            onMouseLeave={() => hover(undefined)}
            onFocus={() => hover(rg.eventId)}
            onBlur={() => hover(undefined)}
            onClick={() => { if (rg.eventId) { s.focusEvent(rg.eventId); window.setTimeout(() => scrollToEvent(rg.eventId!), 40) } }}
          >
            <span className="font-mono uppercase text-right shrink-0" style={{ width: 66, fontSize: 9, letterSpacing: "0.16em", color: lit ? c : rg.retired ? LR.ashGhost : LR.ashSoft, fontWeight: 600, transition: "color 200ms" }}>{rg.label}</span>
            <span aria-hidden className="shrink-0 rounded-full" style={{ width: 6, height: 6, marginLeft: -3, background: rg.retired ? "transparent" : c, border: `1px solid ${c}`, boxShadow: lit ? `0 0 8px ${c}` : "none" }} />
            <span aria-hidden className="flex-1 h-px" style={{ background: rg.retired ? `repeating-linear-gradient(90deg, ${lrMix(c, 0.5)} 0 3px, transparent 3px 7px)` : lrMix(c, lit ? 0.8 : 0.42), transition: "background 200ms" }} />
            <span className="font-mono tabular-nums text-right shrink-0 whitespace-nowrap inline-flex items-baseline justify-end gap-1.5" style={{ width: 112, fontSize: 11, color: lit ? LR.paper : LR.paperDim, transition: "color 200ms" }}>
              {fmtPrice(rg.price)}<span style={{ color: c, fontSize: 9, letterSpacing: "0.04em" }}>{fmtR(rg.r)}</span>
            </span>
          </button>
        )
      })}

      {/* live price marker */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 flex items-center gap-2 pointer-events-none"
        style={{ height: 18 }}
        animate={{ top: priceY - 9 }}
        transition={reduce ? { duration: 0 } : LR.spring}
      >
        <span className="font-mono uppercase text-right shrink-0" style={{ width: 66, fontSize: 9, letterSpacing: "0.16em", color: pr, fontWeight: 700 }}>{a.archived ? "Exit" : "Price"}</span>
        <span className="shrink-0 rounded-full" style={{ width: 8, height: 8, marginLeft: -4, background: pr, boxShadow: `0 0 10px ${pr}` }} />
        <span className="flex-1" style={{ height: 1.5, background: `linear-gradient(90deg, ${pr}, ${lrMix(pr, 0.2)})` }} />
        <span className="shrink-0 inline-flex justify-end" style={{ width: 112 }}>
          <span className="font-mono tabular-nums text-right px-1.5 py-[2px] rounded-md whitespace-nowrap" style={{ fontSize: 11, color: LR.primaryInk, background: pr, fontWeight: 600 }}>
            {fmtPrice(a.price)}
          </span>
        </span>
      </motion.div>
    </div>
  )
}

export function TradeAnatomy({ delay = 0 }: { delay?: number }) {
  const s = useSession()
  const a = s.anatomy
  const risk = RISK_LABEL[a?.riskState ?? "flat"]
  const rTone: LrTone = !a ? "neutral" : a.rNow >= 0 ? "up" : "down"

  return (
    <LrPane labelledBy="lr-anatomy-title" delay={delay}>
      <LrPaneHeader
        id="lr-anatomy-title"
        eyebrow="Trade anatomy"
        hint={a ? `${a.instrument} · ${a.direction === "bullish" ? "long" : "short"} · ${a.archived ? "closed" : "live"}` : "no position"}
        trailing={<LrChip tone={risk.tone === "neutral" ? "ash" : risk.tone} active={risk.tone !== "neutral"} size={9}>{risk.label}</LrChip>}
      />
      <div className="px-3 pb-3 flex flex-col gap-2.5">
        {!a ? (
          <LrRecess className="p-4">
            <p className="m-0 font-sans" style={{ fontSize: 12.5, lineHeight: 1.55, color: LR.paperDim }}>
              Nothing is on. When the mentor takes an entry the position appears here as a ladder in <Term id="r-multiple">R</Term> — entry at zero, the original stop at minus one — so every trade shares one geometry.
            </p>
          </LrRecess>
        ) : (
          <>
            {/* hero readout — one big R, the rest as Flight Deck capsules */}
            <LrRecess className="flex flex-col gap-2 px-3.5 pt-3 pb-2.5">
              <div className="flex items-end justify-between gap-3 min-w-0">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <LrEyebrow size={9} weight={500}>{a.archived ? "Final" : "R now"}</LrEyebrow>
                  <span className="font-mono tabular-nums" style={{ fontSize: 26, lineHeight: 1, color: toneColor(rTone), letterSpacing: "-0.02em", fontWeight: 500 }}>
                    <Rolling value={a.rNow} prefix={a.rNow >= 0 ? "+" : "−"} suffix=" R" />
                  </span>
                </div>
                <span className="font-mono uppercase text-right" style={{ fontSize: 9, letterSpacing: "0.16em", color: LR.ashSoft, lineHeight: 1.5 }}>
                  <Term id="r-multiple">{`1 R = ${a.riskPerUnit.toFixed(2)}`}</Term>
                  <br />
                  {a.instrument} · {a.direction === "bullish" ? "long" : "short"}
                </span>
              </div>
              <span aria-hidden className="h-px" style={{ background: LR.dashed() }} />
              <LrCapsuleStrip className="-mx-2">
                <LrCapsule eyebrow="Realised" tone={a.realised >= 0 ? "up" : "down"} value={<span style={{ color: a.realised >= 0 ? toneColor("up") : toneColor("down") }}>{a.realised >= 0 ? "+" : "−"}${Math.abs(a.realised).toLocaleString()} <span style={{ color: LR.ashSoft }}>· {Math.round((1 - a.remaining) * 100)}% closed</span></span>} />
                <LrCapsule eyebrow="In trade" tone="primary" value={<>{agoLabel(a.openedAt, a.closedAt ?? s.viewMin)} <span style={{ color: LR.ashSoft }}>· since {clockLabel(a.openedAt)}</span></>} />
                <LrCapsule eyebrow="Size" tone={a.sizeLabel?.includes("FOMC") ? "warn" : "primary"} value={<>{a.sizeLabel?.split(" ")[0] ?? "100%"} <span style={{ color: LR.ashSoft }}>· {a.sizeLabel?.includes("FOMC") ? <Term id="half-size">FOMC ahead</Term> : "of plan"}</span></>} />
              </LrCapsuleStrip>
            </LrRecess>

            <LrRecess className="px-3 pt-3 pb-2.5">
              <Ladder />
            </LrRecess>

            <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <LrRecess className="flex items-center gap-3 px-3.5 py-2.5 min-w-0">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <LrEyebrow size={9}><Term id="mfe">MFE</Term></LrEyebrow>
                  <span className="font-mono tabular-nums" style={{ fontSize: 12.5, color: toneColor("up") }}>+{a.mfe.toFixed(2)} <span style={{ color: LR.ashSoft, fontSize: 10 }}>· {fmtR(a.mfe / a.riskPerUnit)}</span></span>
                </div>
                <span aria-hidden className="h-1 rounded-full overflow-hidden" style={{ width: 64, background: lrMix(LR.paper, 0.06) }}>
                  <span className="block h-full" style={{ width: `${Math.min(100, (a.mfe / Math.max(1e-9, Math.abs(a.target - a.entry))) * 100)}%`, background: toneColor("up") }} />
                </span>
              </LrRecess>
              <LrRecess className="flex items-center gap-3 px-3.5 py-2.5 min-w-0">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <LrEyebrow size={9}><Term id="mae">MAE</Term></LrEyebrow>
                  <span className="font-mono tabular-nums" style={{ fontSize: 12.5, color: toneColor("down") }}>−{a.mae.toFixed(2)} <span style={{ color: LR.ashSoft, fontSize: 10 }}>· {fmtR(-a.mae / a.riskPerUnit)}</span></span>
                </div>
                <span aria-hidden className="h-1 rounded-full overflow-hidden" style={{ width: 64, background: lrMix(LR.paper, 0.06) }}>
                  <span className="block h-full" style={{ width: `${Math.min(100, (a.mae / a.riskPerUnit) * 100)}%`, background: toneColor("down") }} />
                </span>
              </LrRecess>
            </div>

            <p className="m-0 font-sans text-pretty px-0.5" style={{ fontSize: 12, lineHeight: 1.5, color: LR.paperDim, fontStyle: "italic" }}>
              <span aria-hidden className="not-italic font-mono" style={{ color: LR.primary, marginRight: 6 }}>›</span>{risk.line}
            </p>
          </>
        )}
      </div>
    </LrPane>
  )
}
