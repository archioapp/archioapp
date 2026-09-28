"use client"

/**
 * MASTERPLAN — detail panel (DETAILED PASS v2)
 * ────────────────────────────────────────────────────────────────────────
 * Renders the protagonist breakdown for the currently-selected pillar.
 * Layout (top-down):
 *   1. HEADER · eyebrow + 2-weight headline + title + verdict + tags + close
 *   2. KPI DELTA STRIP · the single hero metric this pillar moves
 *   3. 3-COL COMPOSITION · LEFT ledger | CENTER thesis + build order | RIGHT ledger
 *   4. SIGNAL MAGNITUDE · sparkbar rail
 *   5. WORKED EXAMPLE · before / after / delta micro-ledger
 *   6. DEPENDENCIES + RISKS · paired band, hairline-separated
 *   7. SUB-NODES · mirror of the satellites orbiting in the star
 *
 * The panel sits inline under the star — no portal, no modal — so the
 * page reads as one continuous editorial scroll.
 */

import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight,
  X,
  ArrowRight,
  ShieldAlert,
  TrendingUp,
  ChevronRight,
} from "lucide-react"
import {
  PILLARS,
  type LedgerEntry,
  type Pillar,
  type PillarKey,
  type Risk,
} from "./master-plan-data"

const C = {
  ink: "#0c0c10",
  glass: "rgba(18,20,28,0.62)",
  glassDeep: "rgba(12,12,16,0.85)",
  rule: "rgba(255,255,255,0.08)",
  ruleSoft: "rgba(255,255,255,0.05)",
  ruleStrong: "rgba(255,255,255,0.14)",
  paper: "rgba(255,255,255,0.96)",
  paperDim: "rgba(255,255,255,0.78)",
  ash: "rgba(255,255,255,0.55)",
  ashSoft: "rgba(255,255,255,0.42)",
  ashGhost: "rgba(255,255,255,0.30)",
  amber: "#f59e0b",
  amberWash: "rgba(245,158,11,0.10)",
  amberHalo: "rgba(245,158,11,0.22)",
  emerald: "#10b981",
  emeraldWash: "rgba(16,185,129,0.12)",
  rose: "#ef4444",
  roseWash: "rgba(239,68,68,0.12)",
} as const

const toneColor = (tone?: LedgerEntry["tone"]) =>
  tone === "emerald"
    ? C.emerald
    : tone === "rose"
      ? C.rose
      : tone === "amber"
        ? C.amber
        : C.paper

const severityColor = (sev: Risk["severity"]) =>
  sev === "high" ? C.rose : sev === "medium" ? C.amber : C.ash

const severityWash = (sev: Risk["severity"]) =>
  sev === "high" ? C.roseWash : sev === "medium" ? C.amberWash : "rgba(255,255,255,0.04)"

/* ── Panel ──────────────────────────────────────────────────────────── */
export function MasterPlanDetail({
  pillar,
  onClose,
  onJumpTo,
}: {
  pillar: Pillar | null
  onClose: () => void
  /** Optional handler — pillar dependency chips become buttons that
   *  jump the active pillar to their target. Wired by the page. */
  onJumpTo?: (key: PillarKey) => void
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {pillar && (
        <motion.section
          key={pillar.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
          style={{
            background: C.glass,
            backdropFilter: "blur(24px) saturate(150%)",
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
            border: `1px solid ${C.rule}`,
            borderRadius: 24,
            padding: "26px 28px 24px",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.06)",
          }}
          aria-labelledby={`pillar-${pillar.key}-title`}
        >
          {/* HEADER ─────────────────────────────────────────────────── */}
          <header className="flex items-start justify-between gap-4 mb-5">
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center justify-center rounded-md"
                  style={{
                    width: 28,
                    height: 28,
                    background: C.amberWash,
                    border: `1px solid rgba(245,158,11,0.35)`,
                    color: C.amber,
                  }}
                >
                  <pillar.icon size={14} strokeWidth={1.6} />
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    color: C.amber,
                    fontSize: 9.5,
                    letterSpacing: "0.28em",
                    fontWeight: 500,
                  }}
                >
                  {pillar.eyebrow}
                </span>
                <span
                  aria-hidden
                  className="inline-block"
                  style={{ width: 12, height: 1, background: C.ruleStrong }}
                />
                <span
                  className="font-mono uppercase"
                  style={{
                    color: C.ashGhost,
                    fontSize: 9.5,
                    letterSpacing: "0.22em",
                    fontWeight: 500,
                  }}
                >
                  PILLAR 0{pillar.vertex + 1} / 05
                </span>
                <span
                  aria-hidden
                  className="inline-block"
                  style={{ width: 12, height: 1, background: C.ruleStrong }}
                />
                <span
                  className="font-mono uppercase"
                  style={{
                    color: C.ashGhost,
                    fontSize: 9.5,
                    letterSpacing: "0.22em",
                    fontWeight: 500,
                  }}
                >
                  PHASE 0{pillar.phase}
                </span>
              </div>

              {/* Two-weight headline */}
              <div className="flex items-baseline gap-2 flex-wrap" style={{ lineHeight: 0.94 }}>
                <span
                  className="font-sans tabular-nums"
                  style={{
                    fontSize: 64,
                    fontWeight: 600,
                    color: C.amber,
                    letterSpacing: "-0.045em",
                    textShadow: `0 0 32px ${C.amberHalo}`,
                  }}
                >
                  {pillar.headline[0]}
                </span>
                <span
                  className="font-sans"
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: C.paperDim,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {pillar.headline[1]}
                </span>
              </div>

              <h2
                id={`pillar-${pillar.key}-title`}
                className="font-sans"
                style={{
                  color: C.paper,
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.18,
                  maxWidth: 680,
                }}
              >
                {pillar.title}
              </h2>

              <p
                className="font-sans italic"
                style={{
                  color: C.paperDim,
                  fontSize: 13.5,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.55,
                  maxWidth: 720,
                }}
              >
                {pillar.summary}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                {pillar.tags.map((t) => (
                  <span
                    key={t}
                    className="font-sans"
                    style={{
                      padding: "4px 9px",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                      color: C.ashSoft,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${C.ruleSoft}`,
                      borderRadius: 999,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-md"
              style={{
                padding: "6px 10px 6px 8px",
                color: C.ashSoft,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.rule}`,
                cursor: "pointer",
                transition: "color 200ms ease-out, background 200ms ease-out",
              }}
              aria-label="Close pillar detail"
            >
              <X size={12} strokeWidth={1.8} />
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.22em",
                  fontWeight: 500,
                }}
              >
                CLOSE
              </span>
            </button>
          </header>

          {/* KPI DELTA STRIP ─────────────────────────────────────── */}
          <KpiDeltaStrip pillar={pillar} />

          {/* HAIRLINE ─────────────────────────────────────────────── */}
          <Hairline />

          {/* 3-COL COMPOSITION ─────────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
              <BandLabel>LEDGER · LEAD METRICS</BandLabel>
              <div className="flex flex-col">
                {pillar.leftLedger.map((row, i) => (
                  <LedgerRow key={i} entry={row} first={i === 0} />
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
              <BandLabel>THESIS</BandLabel>
              <p
                className="font-sans"
                style={{
                  color: C.paperDim,
                  fontSize: 13,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.6,
                  paddingLeft: 14,
                  borderLeft: `1px solid ${C.amber}`,
                }}
              >
                {pillar.thesis}
              </p>

              <BandLabel className="mt-2">BUILD ORDER</BandLabel>
              <ol className="flex flex-col">
                {pillar.actions.map((a, i) => (
                  <ActionRow key={i} index={i + 1} text={a} />
                ))}
              </ol>
            </div>

            <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
              <BandLabel>LEDGER · GUARDRAILS</BandLabel>
              <div className="flex flex-col">
                {pillar.rightLedger.map((row, i) => (
                  <LedgerRow key={i} entry={row} first={i === 0} />
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER RAIL — sparkbar magnitude */}
          {pillar.rail && (
            <>
              <Hairline className="mt-6" />
              <div className="flex flex-col gap-2 mt-5">
                <div className="flex items-center justify-between">
                  <BandLabel>SIGNAL MAGNITUDE</BandLabel>
                  <span
                    className="font-mono uppercase inline-flex items-center gap-1"
                    style={{
                      color: C.ashGhost,
                      fontSize: 9,
                      letterSpacing: "0.22em",
                    }}
                  >
                    OPEN PROFILE <ArrowUpRight size={10} strokeWidth={1.8} />
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {pillar.rail.map((r) => (
                    <SparkbarRow key={r.label} label={r.label} value={r.value} tone={r.tone} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* WORKED EXAMPLE + DEPENDENCIES band ───────────────────── */}
          <Hairline className="mt-7" />
          <div className="grid grid-cols-12 gap-x-6 gap-y-6 mt-6">
            <div className="col-span-12 lg:col-span-7">
              <WorkedExampleBlock pillar={pillar} />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <DependencyBlock pillar={pillar} onJumpTo={onJumpTo} />
            </div>
          </div>

          {/* RISK BAND ──────────────────────────────────────────────── */}
          <Hairline className="mt-7" />
          <RiskBand pillar={pillar} />

          {/* SUB-NODES MIRROR ───────────────────────────────────────── */}
          <Hairline className="mt-7" />
          <SubNodeMirror pillar={pillar} />
        </motion.section>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** KPI delta strip — single hero metric this pillar moves. Reads
 *  before · after · improvement on a 3-cell grid with a centered
 *  arrow and a tone-coded improvement chip. */
function KpiDeltaStrip({ pillar }: { pillar: Pillar }) {
  const accent =
    pillar.kpiDelta.tone === "emerald"
      ? C.emerald
      : pillar.kpiDelta.tone === "rose"
        ? C.rose
        : C.amber
  const accentWash =
    pillar.kpiDelta.tone === "emerald"
      ? C.emeraldWash
      : pillar.kpiDelta.tone === "rose"
        ? C.roseWash
        : C.amberWash

  return (
    <div
      className="flex items-stretch gap-3 px-4 py-3 mb-1 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${C.ruleSoft}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="flex flex-col gap-1 min-w-0 lg:min-w-[200px]">
        <BandLabel>HERO KPI</BandLabel>
        <span
          className="font-sans truncate"
          style={{
            color: C.paper,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {pillar.kpiDelta.metric}
        </span>
      </div>

      <Sep />

      <div className="flex flex-col gap-0.5 lg:min-w-[150px]">
        <BandLabel>BEFORE</BandLabel>
        <span
          className="font-sans tabular-nums"
          style={{
            color: C.paperDim,
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          {pillar.kpiDelta.before}
        </span>
      </div>

      <div className="flex items-center" aria-hidden>
        <span
          className="inline-flex items-center justify-center rounded-full"
          style={{
            width: 22,
            height: 22,
            background: accentWash,
            border: `1px solid ${accent}`,
            color: accent,
          }}
        >
          <ArrowRight size={12} strokeWidth={2} />
        </span>
      </div>

      <div className="flex flex-col gap-0.5 lg:min-w-[160px]">
        <BandLabel>AFTER</BandLabel>
        <span
          className="font-sans tabular-nums"
          style={{
            color: accent,
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            textShadow: `0 0 18px ${accentWash}`,
          }}
        >
          {pillar.kpiDelta.after}
        </span>
      </div>

      <Sep />

      <div className="flex flex-col gap-0.5 ml-auto items-end">
        <BandLabel>IMPROVEMENT</BandLabel>
        <span
          className="font-mono uppercase inline-flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{
            color: accent,
            background: accentWash,
            border: `1px solid ${accent}`,
            fontSize: 10,
            letterSpacing: "0.18em",
            fontWeight: 500,
          }}
        >
          <TrendingUp size={11} strokeWidth={2} />
          {pillar.kpiDelta.improvement}
        </span>
      </div>
    </div>
  )
}

function Sep() {
  return (
    <span
      aria-hidden
      className="hidden lg:inline-block self-stretch"
      style={{ width: 1, background: C.ruleSoft }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** Worked example — before/after card with a delta callout. The
 *  `before` cell uses paper-dim, the `after` cell uses amber, the
 *  `delta` chip uses an emerald accent. */
function WorkedExampleBlock({ pillar }: { pillar: Pillar }) {
  const ex = pillar.workedExample
  return (
    <div className="flex flex-col gap-3">
      <BandLabel>WORKED EXAMPLE</BandLabel>

      <div
        className="grid grid-cols-2 gap-x-3"
        style={{ alignItems: "stretch" }}
      >
        <div
          className="flex flex-col gap-1 px-3 py-2.5 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px dashed ${C.ruleSoft}`,
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              color: C.ashGhost,
              fontSize: 8.5,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            BEFORE · {ex.before.label}
          </span>
          <span
            className="font-sans"
            style={{
              color: C.paperDim,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
            }}
          >
            {ex.before.value}
          </span>
        </div>

        <div
          className="flex flex-col gap-1 px-3 py-2.5 rounded-lg"
          style={{
            background: C.amberWash,
            border: `1px solid rgba(245,158,11,0.35)`,
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              color: C.amber,
              fontSize: 8.5,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            AFTER · {ex.after.label}
          </span>
          <span
            className="font-sans"
            style={{
              color: C.paper,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
            }}
          >
            {ex.after.value}
          </span>
        </div>
      </div>

      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{
          background: C.emeraldWash,
          border: `1px solid rgba(16,185,129,0.32)`,
        }}
      >
        <span
          className="inline-flex items-center justify-center rounded-full"
          style={{
            width: 18,
            height: 18,
            background: "rgba(16,185,129,0.22)",
            border: `1px solid ${C.emerald}`,
            color: C.emerald,
          }}
          aria-hidden
        >
          <TrendingUp size={10} strokeWidth={2} />
        </span>
        <span
          className="font-mono uppercase"
          style={{
            color: C.emerald,
            fontSize: 9.5,
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          {ex.delta.label}
        </span>
        <span
          aria-hidden
          className="inline-block"
          style={{ width: 1, height: 12, background: "rgba(16,185,129,0.4)" }}
        />
        <span
          className="font-sans tabular-nums"
          style={{
            color: C.emerald,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {ex.delta.value}
        </span>
      </div>

      <p
        className="font-sans italic"
        style={{
          color: C.paperDim,
          fontSize: 12,
          letterSpacing: "-0.005em",
          lineHeight: 1.55,
        }}
      >
        {ex.caption}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** Dependency block — list of pillars feeding INTO the active pillar.
 *  Each is a clickable chip that jumps to that pillar via onJumpTo.
 *  When a pillar has no dependencies, we say so explicitly with an
 *  emerald "north-star" badge. */
function DependencyBlock({
  pillar,
  onJumpTo,
}: {
  pillar: Pillar
  onJumpTo?: (key: PillarKey) => void
}) {
  const deps = pillar.dependencies
    .map((k) => PILLARS.find((p) => p.key === k))
    .filter((x): x is Pillar => Boolean(x))

  return (
    <div className="flex flex-col gap-3">
      <BandLabel>DEPENDENCIES · INBOUND</BandLabel>
      {deps.length === 0 ? (
        <div
          className="flex items-center gap-2 px-3 py-3 rounded-lg"
          style={{
            background: C.emeraldWash,
            border: `1px solid rgba(16,185,129,0.32)`,
          }}
        >
          <span
            aria-hidden
            className="inline-block rounded-full"
            style={{
              width: 8,
              height: 8,
              background: C.emerald,
              boxShadow: `0 0 8px ${C.emerald}`,
            }}
          />
          <span
            className="font-mono uppercase"
            style={{
              color: C.emerald,
              fontSize: 10,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            NORTH STAR · NO INBOUND DEPENDENCIES
          </span>
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {deps.map((d) => (
            <li key={d.key}>
              <button
                type="button"
                onClick={() => onJumpTo?.(d.key)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${C.ruleSoft}`,
                  cursor: onJumpTo ? "pointer" : "default",
                  transition: "background 200ms ease-out, border-color 200ms ease-out",
                }}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-flex items-center justify-center rounded-md"
                    style={{
                      width: 22,
                      height: 22,
                      background: C.amberWash,
                      border: `1px solid rgba(245,158,11,0.32)`,
                      color: C.amber,
                    }}
                  >
                    <d.icon size={12} strokeWidth={1.6} />
                  </span>
                  <span className="flex flex-col items-start min-w-0">
                    <span
                      className="font-mono uppercase truncate"
                      style={{
                        color: C.ashGhost,
                        fontSize: 8.5,
                        letterSpacing: "0.22em",
                        fontWeight: 500,
                      }}
                    >
                      0{d.vertex + 1} · PHASE 0{d.phase}
                    </span>
                    <span
                      className="font-sans truncate"
                      style={{
                        color: C.paper,
                        fontSize: 12.5,
                        fontWeight: 500,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {d.tag}
                    </span>
                  </span>
                </span>
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${C.rule}`,
                    color: C.ashSoft,
                  }}
                >
                  <ChevronRight size={11} strokeWidth={1.8} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <span
        className="font-sans italic"
        style={{
          color: C.ashGhost,
          fontSize: 11,
          letterSpacing: "-0.005em",
          lineHeight: 1.5,
        }}
      >
        Dependencies render as inbound arcs in the constellation when this
        pillar is open.
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** Risk band — three rows, each with a severity dot, label, note,
 *  and a small severity chip. Color-coded throughout. */
function RiskBand({ pillar }: { pillar: Pillar }) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex items-center justify-between">
        <BandLabel>
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert size={11} strokeWidth={1.7} />
            RISKS · 03 IDENTIFIED
          </span>
        </BandLabel>
        <span
          className="font-mono uppercase"
          style={{
            color: C.ashGhost,
            fontSize: 9,
            letterSpacing: "0.22em",
          }}
        >
          GUARD BEFORE MERGING
        </span>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-2"
        role="list"
      >
        {pillar.risks.map((r, i) => (
          <RiskCard key={i} risk={r} index={i + 1} />
        ))}
      </div>
    </div>
  )
}

function RiskCard({ risk, index }: { risk: Risk; index: number }) {
  const accent = severityColor(risk.severity)
  const wash = severityWash(risk.severity)
  return (
    <div
      role="listitem"
      className="flex flex-col gap-1.5 px-3 py-3 rounded-lg relative"
      style={{
        background: wash,
        border: `1px solid ${accent}55`,
      }}
    >
      <span
        aria-hidden
        className="absolute"
        style={{
          left: 0,
          top: 14,
          bottom: 14,
          width: 2,
          background: accent,
          borderRadius: 999,
        }}
      />
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-mono uppercase inline-flex items-center gap-1.5"
          style={{
            color: accent,
            fontSize: 9.5,
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          <span
            aria-hidden
            className="inline-block rounded-full"
            style={{
              width: 6,
              height: 6,
              background: accent,
              boxShadow: `0 0 6px ${accent}`,
            }}
          />
          R-{String(index).padStart(2, "0")} · {risk.severity.toUpperCase()}
        </span>
      </div>
      <span
        className="font-sans"
        style={{
          color: C.paper,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          lineHeight: 1.35,
        }}
      >
        {risk.label}
      </span>
      <span
        className="font-sans"
        style={{
          color: C.paperDim,
          fontSize: 11.5,
          fontWeight: 400,
          letterSpacing: "-0.005em",
          lineHeight: 1.5,
        }}
      >
        {risk.note}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

/** Sub-node mirror — three chips matching the satellites orbiting this
 *  vertex in the star. Doubles as visual confirmation that the user
 *  understands what's hovering above the active anchor. */
function SubNodeMirror({ pillar }: { pillar: Pillar }) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex items-center justify-between">
        <BandLabel>SUB-NODES · ORBITING THIS PILLAR</BandLabel>
        <span
          className="font-mono uppercase"
          style={{
            color: C.ashGhost,
            fontSize: 9,
            letterSpacing: "0.22em",
          }}
        >
          {pillar.subNodes.length} SATELLITES
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {pillar.subNodes.map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 px-3 py-3 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px dashed ${C.ruleSoft}`,
            }}
          >
            <span
              className="inline-flex items-center justify-center rounded-md shrink-0"
              style={{
                width: 28,
                height: 28,
                background: C.amberWash,
                border: `1px solid rgba(245,158,11,0.32)`,
                color: C.amber,
              }}
            >
              <s.icon size={13} strokeWidth={1.7} />
            </span>
            <div className="flex flex-col min-w-0">
              <span
                className="font-mono uppercase"
                style={{
                  color: C.amber,
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  fontWeight: 500,
                }}
              >
                SAT · 0{i + 1} / 0{pillar.subNodes.length}
              </span>
              <span
                className="font-sans"
                style={{
                  color: C.paper,
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                }}
              >
                {s.tag}
              </span>
              <span
                className="font-sans"
                style={{
                  color: C.paperDim,
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.45,
                  marginTop: 2,
                }}
              >
                {s.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function Hairline({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block w-full ${className ?? ""}`}
      style={{
        height: 1,
        backgroundImage: `linear-gradient(90deg, transparent, ${C.ruleSoft} 12%, ${C.ruleSoft} 88%, transparent)`,
        marginBottom: 22,
      }}
    />
  )
}

function BandLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`font-mono uppercase ${className ?? ""}`}
      style={{
        color: C.ashGhost,
        fontSize: 9.5,
        letterSpacing: "0.28em",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  )
}

function LedgerRow({ entry, first }: { entry: LedgerEntry; first?: boolean }) {
  const accent = toneColor(entry.tone)
  return (
    <div
      className="flex items-center justify-between gap-3"
      style={{
        padding: "10px 0",
        borderTop: first ? "none" : `1px dashed ${C.ruleSoft}`,
        position: "relative",
      }}
    >
      <span
        aria-hidden
        className="absolute"
        style={{
          left: -8,
          top: 12,
          bottom: 12,
          width: 2,
          background: accent,
          opacity: entry.tone ? 0.6 : 0.18,
          borderRadius: 999,
        }}
      />
      <div className="flex flex-col min-w-0">
        <span
          className="font-mono uppercase truncate"
          style={{
            color: C.ashGhost,
            fontSize: 9.5,
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          {entry.label}
        </span>
        {entry.sub && (
          <span
            className="font-sans truncate mt-0.5"
            style={{
              color: C.ashSoft,
              fontSize: 10.5,
              fontWeight: 400,
              letterSpacing: "-0.005em",
            }}
          >
            {entry.sub}
          </span>
        )}
      </div>
      <span
        className="font-sans tabular-nums shrink-0"
        style={{
          color: accent,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          textAlign: "right",
        }}
      >
        {entry.value}
      </span>
    </div>
  )
}

function ActionRow({ index, text }: { index: number; text: string }) {
  return (
    <li
      className="flex items-start gap-3"
      style={{
        padding: "10px 0",
        borderTop: index === 1 ? "none" : `1px dashed ${C.ruleSoft}`,
      }}
    >
      <span
        className="font-mono inline-flex items-center justify-center shrink-0"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          color: C.amber,
          background: C.amberWash,
          border: `1px solid rgba(245,158,11,0.32)`,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.04em",
        }}
        aria-hidden
      >
        {String(index).padStart(2, "0")}
      </span>
      <span
        className="font-sans"
        style={{
          color: C.paperDim,
          fontSize: 12.5,
          fontWeight: 400,
          letterSpacing: "-0.005em",
          lineHeight: 1.55,
          paddingTop: 2,
        }}
      >
        {text}
      </span>
    </li>
  )
}

function SparkbarRow({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "emerald" | "amber" | "rose"
}) {
  const accent = tone === "emerald" ? C.emerald : tone === "rose" ? C.rose : C.amber
  const fillBg =
    tone === "emerald" ? C.emeraldWash : tone === "rose" ? C.roseWash : C.amberWash
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono uppercase truncate"
        style={{
          flex: "0 0 180px",
          color: C.ashSoft,
          fontSize: 10,
          letterSpacing: "0.18em",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        className="relative grow"
        style={{
          height: 6,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-y-0"
          style={{
            left: "50%",
            width: 1,
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 4px)",
          }}
        />
        <motion.span
          aria-hidden
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0"
          style={{
            background: `linear-gradient(90deg, ${fillBg} 0%, ${accent} 100%)`,
            borderRadius: 999,
            boxShadow: `0 0 8px ${accent}55`,
          }}
        />
      </span>
      <span
        className="font-mono tabular-nums shrink-0"
        style={{
          color: accent,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          width: 36,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  )
}
