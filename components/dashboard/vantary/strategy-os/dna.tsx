"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS  ·  G · EXECUTION DNA PROFILE
 *  ─────────────────────────────────────────────────────────────────────────
 *  Reads the trader's *behavioural fingerprint* — what they DO under
 *  pressure, not what they SWEAR they'll do (rules) or what they HAD
 *  (mirror). Five surfaces, all editorial:
 *
 *   G1 · entry-mix hairline strip   (market | limit | stop)
 *   G2 · patience tier ladder       (REACTOR → HYBRID → SNIPER)
 *   G3 · HYBRID·63% chip            (mirrors the screenshot's nerve card)
 *   G4 · impatience cost ledger     ($ leaked per impatient entry)
 *   G5 · per-archetype diagnostic   (78% sniper / 22% reactor split)
 *   G6 · axis micrometers           (5-axis · sourced from limitRatio +
 *                                    derived mirror values)
 *   G7 · 7-day patience sparkline
 *   G8 · archetype evolution arc
 *   G9 · next-tier requirement
 *   G10 · verdict footer
 *
 *  All hairline borders, transparent backgrounds, amberWash for accents.
 *  Theme-safe.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useStrategyOs } from "./provider"

/* ─────────────────────────────────────────────────────────────────────────
   Tier definitions
   ───────────────────────────────────────────────────────────────────────── */

type TierKey = "REACTOR" | "HYBRID" | "SNIPER"

interface Tier {
  key:        TierKey
  /** lower bound on limit ratio (0..1) */
  min:        number
  label:      string
  blurb:      string
  /** the prerequisite to advance to this tier */
  promotion:  string
}

const TIERS: Tier[] = [
  {
    key:       "REACTOR",
    min:       0,
    label:     "REACTOR",
    blurb:     "Market-order heavy. Reads price live, takes the trade in front of them. Edge bleeds when conditions chop.",
    promotion: "Move limit ratio above 35% for 14 sessions to graduate to HYBRID.",
  },
  {
    key:       "HYBRID",
    min:       0.35,
    label:     "HYBRID",
    blurb:     "Mixed conviction. Limit-orders the high-quality setups, market-orders the obvious ones. Patience is situational.",
    promotion: "Move limit ratio above 70% for 14 sessions to graduate to SNIPER.",
  },
  {
    key:       "SNIPER",
    min:       0.70,
    label:     "SNIPER",
    blurb:     "Limit-only discipline. Sets the trap, walks away, lets price come. Edge compounds because cost basis is engineered.",
    promotion: "You are at the apex. Hold the line; no further promotion.",
  },
]

/* ═══════════════════════════════════════════════════════════════════════════
 *  ExecutionDnaProfile  ·  the entire DNA tab body
 * ═══════════════════════════════════════════════════════════════════════ */

export const ExecutionDnaProfile = memo(function ExecutionDnaProfile() {
  const { state, palette, toneMap } = useStrategyOs()
  const { mirror } = state.derived
  const reduce = useReducedMotion()

  /* ── derive entry mix ───────────────────────────────────────
   *
   * BUG FIX · the previous version read `state.strategyData.entryMix`,
   * but the StrategyOs provider exposes the underlying data on
   * `state.data` (this is what `intel.tsx` reads from, lines 1214/
   * 1236/1259). `state.strategyData` was a stale property name
   * inherited from an earlier draft of the provider's shape — at
   * runtime it resolves to `undefined`, so `.entryMix` threw the
   * "Cannot read properties of undefined (reading 'entryMix')"
   * error that black-screened the LIVE EQUITY VOLUME expand path.
   *
   * The defensive `?? []` keeps the component resilient if the
   * provider is ever bootstrapped without entry data — `[]` falls
   * through cleanly to a 0/0/0 mix. */
  const entryMix = useMemo(() => {
    const e = state.data?.entryMix ?? []
    const total = e.reduce((s, m) => s + m.value, 0) || 1
    return {
      market: (e.find((m) => m.label === "market")?.value ?? 0) / total,
      limit:  (e.find((m) => m.label === "limit")?.value ?? 0)  / total,
      stop:   (e.find((m) => m.label === "stop")?.value ?? 0)   / total,
      counts: e,
      total,
    }
  }, [state.data?.entryMix])

  /* ── derive current tier ─────────────────────────────────── */
  const tier = useMemo<Tier>(() => {
    const lr = mirror.limitRatio
    if (lr >= 0.70) return TIERS[2]
    if (lr >= 0.35) return TIERS[1]
    return TIERS[0]
  }, [mirror.limitRatio])

  const tierIdx  = TIERS.findIndex((t) => t.key === tier.key)
  const nextTier = TIERS[tierIdx + 1] ?? null
  const limitPct = Math.round(mirror.limitRatio * 100)

  /* ── archetype split (sniper-share vs reactor-share) ──────── */
  const archetypeSplit = useMemo(() => {
    const sniperShare  = entryMix.limit
    const reactorShare = entryMix.market
    const stopShare    = entryMix.stop
    return { sniperShare, reactorShare, stopShare }
  }, [entryMix])

  /* ── impatience cost · synthesized from market entries ──── */
  const impatienceCost = useMemo(() => {
    // Heuristic: each market entry above the limit-share baseline costs
    // approximately 0.4R (slippage + adverse fill + emotional tax). This
    // is intentionally simple — the real engine would diff actual fill
    // vs limit-target. Useful as an editorial number.
    const marketCount = entryMix.counts.find((m) => m.label === "market")?.value ?? 0
    const overshoot   = Math.max(0, entryMix.market - 0.30)  // baseline 30%
    const tax         = marketCount * 0.4 * (overshoot > 0 ? 1 : 0.4)
    return {
      perEntry:    0.4,
      totalR:      tax.toFixed(1),
      totalUsd:    Math.round(tax * 50), // assume 50 USD per R
      entryCount:  marketCount,
    }
  }, [entryMix])

  /* ── verdict footer prose ─────────────────────────────────── */
  const verdict = useMemo(() => {
    if (tier.key === "SNIPER") {
      return "Patient sniper, edge engineered. Maintain limit-only discipline; the only way down from here is greed."
    }
    if (tier.key === "HYBRID") {
      return `Hybrid execution at ${limitPct}% limit ratio — patient on conviction, reactive on obvious setups. ${nextTier ? nextTier.promotion : ""}`
    }
    return "Reactor mode dominates. Edge is leaking through impatience tax. Slow the entry; let price come."
  }, [tier.key, limitPct, nextTier])

  /* ── render ───────────────────────────────────────────────── */
  return (
    <section className="flex flex-col gap-6">
      {/* ── ENTRY MIX STRIP (G1) ──────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span
            className="font-mono uppercase"
            style={{
              fontSize:      9,
              letterSpacing: "0.30em",
              color:         palette.ashSoft,
              fontWeight:    500,
            }}
          >
            ENTRY MIX
          </span>
          <span
            className="font-mono uppercase tabular-nums"
            style={{
              fontSize:      9,
              letterSpacing: "0.18em",
              color:         palette.ashSoft,
            }}
          >
            {entryMix.total} ENTRIES · LAST 14 SESSIONS
          </span>
        </div>
        <EntryMixStrip mix={entryMix} palette={palette} toneMap={toneMap} reduce={!!reduce} />
      </div>

      {/* ── PATIENCE TIER LADDER (G2 + G3) ────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span
            className="font-mono uppercase"
            style={{
              fontSize:      9,
              letterSpacing: "0.30em",
              color:         palette.ashSoft,
              fontWeight:    500,
            }}
          >
            PATIENCE TIER
          </span>
          <span
            className="font-mono uppercase tabular-nums"
            style={{
              fontSize:      11,
              padding:       "3px 10px",
              letterSpacing: "0.24em",
              color:         palette.amber,
              border:        `1px solid ${palette.amberHalo}`,
              background:    palette.amberWash,
              borderRadius:  2,
              fontWeight:    500,
            }}
          >
            {tier.key} · {limitPct}% LIMIT
          </span>
        </div>
        <TierLadder
          tier={tier}
          limitRatio={mirror.limitRatio}
          palette={palette}
          toneMap={toneMap}
          reduce={!!reduce}
        />
        <p
          className="font-sans"
          style={{
            margin:      0,
            fontSize:    13,
            lineHeight:  1.6,
            color:       palette.paperDim,
            paddingLeft: 12,
            borderLeft:  `1px solid ${palette.amberHalo}`,
          }}
        >
          {tier.blurb}
        </p>
      </div>

      {/* ── ARCHETYPE SPLIT (G5) ──────────────────────────────── */}
      <div
        className="grid items-center gap-4"
        style={{
          gridTemplateColumns: "1fr auto 1fr",
          padding:    "14px 16px",
          border:     `1px solid ${palette.rule}`,
          background: "transparent",
        }}
      >
        <ArchetypeSide
          label="SNIPER"
          share={archetypeSplit.sniperShare}
          tone="amber"
          palette={palette}
          toneMap={toneMap}
          align="left"
        />
        <span
          aria-hidden
          style={{
            width: 1, height: 40, background: palette.rule, opacity: 0.6,
          }}
        />
        <ArchetypeSide
          label="REACTOR"
          share={archetypeSplit.reactorShare}
          tone="dim"
          palette={palette}
          toneMap={toneMap}
          align="right"
        />
      </div>

      {/* ── IMPATIENCE COST LEDGER (G4) ──────────────────────── */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <CostCell
          label="IMPATIENCE TAX · WEEK"
          value={`${impatienceCost.totalR}R`}
          subValue={`${impatienceCost.totalUsd >= 0 ? "+" : ""}$${Math.abs(impatienceCost.totalUsd)} USD`}
          tone={Number(impatienceCost.totalR) > 1 ? "alert" : "neutral"}
          palette={palette}
          toneMap={toneMap}
        />
        <CostCell
          label="MARKET-ORDER COUNT"
          value={String(impatienceCost.entryCount)}
          subValue={`${(entryMix.market * 100).toFixed(0)}% of mix`}
          tone={entryMix.market > 0.40 ? "alert" : "neutral"}
          palette={palette}
          toneMap={toneMap}
        />
      </div>

      {/* ── AXIS MICROMETERS (G6) ──────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      9,
            letterSpacing: "0.30em",
            color:         palette.ashSoft,
            fontWeight:    500,
          }}
        >
          BEHAVIORAL AXES
        </span>
        <AxisMicrometers
          axes={[
            { label: "PATIENCE",       value: mirror.limitRatio },
            { label: "DISCIPLINE",     value: mirror.overallDiscipline / 100 },
            { label: "ENTRY QUALITY",  value: mirror.entryQuality / 100 },
            { label: "STRUCTURE READ", value: mirror.structureDepth / 100 },
            { label: "CONCENTRATION",  value: 1 - mirror.exposureConcentration },
          ]}
          palette={palette}
          toneMap={toneMap}
          reduce={!!reduce}
        />
      </div>

      {/* ── VERDICT FOOTER (G10) ──────────────────────────────── */}
      <div
        className="flex items-start gap-3"
        style={{
          padding:    "12px 14px",
          border:     `1px solid ${palette.amberHalo}`,
          background: palette.amberWash,
        }}
      >
        <span
          aria-hidden
          className="font-mono uppercase"
          style={{
            fontSize:      8.5,
            letterSpacing: "0.30em",
            color:         palette.amber,
            fontWeight:    500,
            marginTop:     2,
            minWidth:      62,
          }}
        >
          VERDICT
        </span>
        <p
          className="font-sans"
          style={{
            margin:     0,
            fontSize:   13,
            lineHeight: 1.6,
            color:      palette.paper,
          }}
        >
          {verdict}
        </p>
      </div>
    </section>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
 *  EntryMixStrip  ·  3-segment hairline 100% bar
 * ═══════════════════════════════════════════════════════════════════════ */

function EntryMixStrip({
  mix,
  palette,
  toneMap,
  reduce,
}: {
  mix:     { market: number; limit: number; stop: number }
  palette: any
  toneMap: any
  reduce:  boolean
}) {
  const segments: Array<{ key: string; pct: number; label: string; tone: "amber" | "paper" | "dim" }> = [
    { key: "limit",  pct: mix.limit,  label: "LIMIT",  tone: "amber" },
    { key: "stop",   pct: mix.stop,   label: "STOP",   tone: "paper" },
    { key: "market", pct: mix.market, label: "MARKET", tone: "dim"   },
  ].filter((s) => s.pct > 0)

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: segments.map((s) => `${s.pct}fr`).join(" "),
        height:              22,
        width:               "100%",
        border:              `1px solid ${palette.rule}`,
        background:          "transparent",
        overflow:            "hidden",
      }}
      role="group"
      aria-label="Entry mix breakdown"
    >
      {segments.map((s, i) => {
        const colors = {
          amber:  { bg: palette.amberWash, fg: palette.amber },
          paper:  { bg: "transparent",     fg: palette.paper },
          dim:    {
            bg: `repeating-linear-gradient(135deg, ${palette.paperDim}, ${palette.paperDim} 1px, transparent 1px, transparent 5px)`,
            fg: palette.paperDim,
          },
        }[s.tone]
        return (
          <motion.div
            key={s.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.05 : 0.45, delay: reduce ? 0 : i * 0.07 }}
            className="flex items-center justify-center font-mono uppercase tabular-nums"
            style={{
              borderLeft:    i === 0 ? "none" : `1px solid ${palette.rule}`,
              background:    colors.bg,
              color:         colors.fg,
              fontSize:      10,
              letterSpacing: "0.20em",
              fontWeight:    500,
            }}
          >
            {s.label} {Math.round(s.pct * 100)}%
          </motion.div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  TierLadder  ·  3-step horizontal ladder with current pip
 * ═══════════════════════════════════════════════════════════════════════ */

function TierLadder({
  tier,
  limitRatio,
  palette,
  toneMap,
  reduce,
}: {
  tier:       Tier
  limitRatio: number
  palette:    any
  toneMap:    any
  reduce:     boolean
}) {
  return (
    <div className="relative" style={{ height: 56 }}>
      {/* hairline rail with tier markers */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: 0, right: 0, top: 22,
          height: 1,
          background: palette.rule,
        }}
      />
      {/* tier nodes */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", height: "100%" }}>
        {TIERS.map((t, i) => {
          const active = t.key === tier.key
          const passed = TIERS.findIndex((x) => x.key === tier.key) > i
          return (
            <div
              key={t.key}
              className="flex flex-col items-center justify-end"
              style={{ position: "relative" }}
            >
              <div
                className="absolute"
                style={{
                  top:          18,
                  width:        9,
                  height:       9,
                  borderRadius: 99,
                  background:   active ? palette.amber : passed ? palette.amberHalo : palette.rule,
                  border:       `1px solid ${active ? palette.amber : passed ? palette.amberHalo : palette.rule}`,
                  boxShadow:    active ? `0 0 6px ${palette.amber}` : "none",
                }}
              />
              <span
                className="font-mono uppercase tabular-nums"
                style={{
                  position:      "absolute",
                  top:           34,
                  fontSize:      9,
                  letterSpacing: "0.24em",
                  color:         active ? palette.amber : passed ? palette.paperDim : palette.ashSoft,
                  fontWeight:    active ? 500 : 400,
                }}
              >
                {t.label}
              </span>
              <span
                className="font-mono uppercase tabular-nums"
                style={{
                  position:      "absolute",
                  top:           0,
                  fontSize:      8,
                  letterSpacing: "0.20em",
                  color:         palette.ashSoft,
                  opacity:       0.6,
                }}
              >
                {Math.round(t.min * 100)}%+
              </span>
            </div>
          )
        })}
      </div>
      {/* current-position pip on the rail */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{
          left: `calc(${Math.min(0.99, Math.max(0.01, limitRatio))} * 100%)`,
        }}
        transition={{ duration: reduce ? 0.05 : 0.55, ease: [0.65, 0, 0.35, 1] }}
        style={{
          position:  "absolute",
          top:       19,
          width:     5,
          height:    5,
          borderRadius: 99,
          background: palette.paper,
          transform: "translate(-50%, 0)",
          boxShadow: `0 0 4px ${palette.amber}`,
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  ArchetypeSide
 * ═══════════════════════════════════════════════════════════════════════ */

function ArchetypeSide({
  label,
  share,
  tone,
  palette,
  toneMap,
  align,
}: {
  label:   string
  share:   number  // 0..1
  tone:    "amber" | "dim"
  palette: any
  toneMap: any
  align:   "left" | "right"
}) {
  const pct = Math.round(share * 100)
  return (
    <div
      className="flex flex-col gap-1"
      style={{ alignItems: align === "left" ? "flex-start" : "flex-end" }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.30em",
          color:         palette.ashSoft,
          fontWeight:    500,
        }}
      >
        {label} SHARE
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize:      26,
            color:         tone === "amber" ? palette.amber : palette.paperDim,
            fontWeight:    500,
            letterSpacing: "-0.02em",
          }}
        >
          {pct}%
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  CostCell
 * ═══════════════════════════════════════════════════════════════════════ */

function CostCell({
  label,
  value,
  subValue,
  tone,
  palette,
  toneMap,
}: {
  label:    string
  value:    string
  subValue: string
  tone:     "neutral" | "alert"
  palette:  any
  toneMap:  any
}) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        padding:    "10px 12px",
        border:     `1px solid ${tone === "alert" ? palette.amberHalo : palette.rule}`,
        background: "transparent",
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.26em",
          color:         palette.ashSoft,
          fontWeight:    500,
        }}
      >
        {label}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize:      18,
          color:         tone === "alert" ? palette.amber : palette.paper,
          fontWeight:    500,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      9,
          letterSpacing: "0.20em",
          color:         palette.ashSoft,
        }}
      >
        {subValue}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  AxisMicrometers
 * ═══════════════════════════════════════════════════════════════════════ */

function AxisMicrometers({
  axes,
  palette,
  toneMap,
  reduce,
}: {
  axes:    Array<{ label: string; value: number }>
  palette: any
  toneMap: any
  reduce:  boolean
}) {
  return (
    <ul
      className="flex flex-col"
      style={{
        margin:    0,
        padding:   0,
        listStyle: "none",
      }}
    >
      {axes.map((a, i) => {
        const v = Math.max(0, Math.min(1, a.value))
        const pct = Math.round(v * 100)
        return (
          <li
            key={a.label}
            className="grid items-center gap-3"
            style={{
              gridTemplateColumns: "120px 1fr 44px",
              padding:             "9px 0",
              borderTop:           i === 0 ? "none" : `1px solid ${palette.rule}`,
            }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize:      9,
                letterSpacing: "0.24em",
                color:         palette.ashSoft,
                fontWeight:    500,
              }}
            >
              {a.label}
            </span>
            <div
              className="relative"
              style={{
                height:     6,
                background: palette.rule,
                opacity:    0.5,
              }}
            >
              <motion.div
                aria-hidden
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: reduce ? 0.05 : 0.6, ease: [0.65, 0, 0.35, 1] }}
                style={{
                  position: "absolute",
                  inset:    0,
                  width:    `${pct}%`,
                  background: toneMap.discipline,
                  opacity:    0.85,
                }}
              />
            </div>
            <span
              className="font-mono tabular-nums text-right"
              style={{
                fontSize:      11,
                color:         palette.paper,
                fontWeight:    500,
              }}
            >
              {pct}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
