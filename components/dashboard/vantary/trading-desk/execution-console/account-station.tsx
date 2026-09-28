"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · ACCOUNT + RISK-FIRST SIZING STATION  (Phase 2)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The first LIVE station of the cockpit. It answers, at a glance:
 *    1. which account is selected   → ExecutionAccountSelector
 *    2. disconnected / sim / live   → mode badge + readiness rail
 *    3. locked / unlocked execution → readiness rail + crown coupling
 *    4. how much equity / margin     → vault metrics
 *    5. how much daily risk is left  → RiskArcGauge (the protagonist)
 *    6. how much risk per next trade → per-trade ceiling strip
 *    7. is the trader allowed on     → guardrail checklist + readiness
 *    8. what to fix first            → readiness detail + failing guardrail
 *
 *  This station OWNS the selected-account state and reports the derived
 *  ConsoleMode up to the shell via `onModeChange`, so the whole console
 *  re-skins from the trader's one real decision: which account.
 *
 *  No order submit. No TradeLocker calls. Live accounts are locked.
 * ══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Gauge, ShieldCheck, ShieldAlert, Activity, Lock } from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import { CONSOLE_ACCENTS, type ConsoleMode } from "./console-theme"
import {
  deriveRiskBudget,
  deriveHealth,
  deriveReadiness,
  fmtMoney,
  type ConsoleAccount,
} from "./account-data"
import { useAccount } from "./account-context"
import { ExecutionAccountSelector } from "./account-selector"
import {
  RiskArcGauge, VaultNumber, HealthDial, SegmentMeter, Skeleton, Hairline,
} from "./console-instruments"
import {
  ExecutionModeBadge, AccountVaultMetric,
  GuardrailItem, StationEyebrow, toneForHealth, LegendDot,
} from "./station-primitives"

/* heat colour for the risk gauge: green when budget plentiful → amber → red */
function riskHeat(remainingPct: number): string {
  if (remainingPct >= 0.5) return VANTARY.chartUp
  if (remainingPct >= 0.25) return "#E5A93C"
  return VANTARY.chartDown
}

/* ─── ACCOUNT HEALTH CARD ──────────────────────────────────────────────── */
const AccountHealthCard = memo(function AccountHealthCard({
  acc,
  health,
  equityDriftPct,
  marginUse,
}: {
  acc: ConsoleAccount
  health: ReturnType<typeof deriveHealth>
  equityDriftPct: number
  marginUse: number
}) {
  const tone = toneForHealth(health.tier)
  const strong = health.tier === "strong" || health.tier === "steady"
  const driftPos = equityDriftPct >= 0
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: "11px 12px",
        borderRadius: 11,
        border: `1px solid ${VANTARY.rule}`,
        background: VANTARY.glass,
      }}
    >
      <HealthDial score={health.score} color={tone} size={76} breathing={strong} />
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: VANTARY.ashSoft }}>
          ACCOUNT HEALTH
        </span>
        <div className="flex items-baseline gap-1.5" style={{ marginTop: 3 }}>
          <VaultNumber value={health.score} color={tone} size={22} />
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.12em", color: tone, fontWeight: 500 }}>
            {health.label}
          </span>
        </div>
        <div className="flex items-center gap-2.5" style={{ marginTop: 6 }}>
          <span className="font-mono" style={{ fontSize: 9, color: VANTARY.ashSoft }}>
            <span style={{ color: driftPos ? VANTARY.chartUp : VANTARY.chartDown }}>
              {driftPos ? "+" : ""}{(equityDriftPct * 100).toFixed(2)}%
            </span> equity
          </span>
          <span aria-hidden style={{ width: 1, height: 9, background: VANTARY.rule }} />
          <span className="font-mono" style={{ fontSize: 9, color: VANTARY.ashSoft }}>
            {Math.round(marginUse * 100)}% margin used
          </span>
        </div>
      </div>
    </div>
  )
})

/* ─── RISK BUDGET GAUGE BLOCK ──────────────────────────────────────────── */
const RiskBudgetBlock = memo(function RiskBudgetBlock({
  acc,
  budget,
}: {
  acc: ConsoleAccount
  budget: ReturnType<typeof deriveRiskBudget>
}) {
  const heat = riskHeat(budget.remainingPct)
  const healthyBudget = budget.remainingPct >= 0.5
  return (
    <div>
      <StationEyebrow
        label="DAILY RISK BUDGET"
        right={`${Math.round(budget.remainingPct * 100)}% LEFT`}
      />
      <div className="flex items-center gap-4">
        {/* the arc — protagonist */}
        <RiskArcGauge
          fraction={budget.remainingPct}
          color={heat}
          size={132}
          thickness={9}
          centerLabel={fmtMoney(budget.remaining, acc.currency)}
          centerSub="REMAINING"
          centerColor={heat}
          breathing={healthyBudget}
        />

        {/* budget breakdown */}
        <div className="flex flex-col" style={{ flex: 1, minWidth: 0, gap: 9 }}>
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
              Limit
            </span>
            <VaultNumber value={budget.limit} prefix="$" color={VANTARY.paperDim} size={13} weight={500} />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
              Used today
            </span>
            <VaultNumber value={budget.used} prefix="−$" color={budget.usedPct >= 0.7 ? VANTARY.chartDown : VANTARY.paperDim} size={13} weight={500} />
          </div>
          <Hairline opacity={0.5} />
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: heat }}>
              Remaining
            </span>
            <VaultNumber value={budget.remaining} prefix="$" color={heat} size={15} weight={600} />
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: 1 }}>
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: VANTARY.ashSoft }}>
              Trade cap
            </span>
            <span className="font-mono tabular-nums" style={{ fontSize: 11, color: VANTARY.paperDim }}>
              {budget.tradeCap === 0
                ? "Uncapped"
                : `${Number.isFinite(budget.tradesLeft) ? budget.tradesLeft : "—"} / ${budget.tradeCap} left`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})

/* ─── PER-TRADE RISK STRIP ─────────────────────────────────────────────── */
const PerTradeRiskStrip = memo(function PerTradeRiskStrip({
  acc,
  budget,
}: {
  acc: ConsoleAccount
  budget: ReturnType<typeof deriveRiskBudget>
}) {
  // fraction of the per-trade *amount* relative to the remaining budget — how
  // big one max-risk trade is vs what's left today (teaches the trade-count math).
  const frac = budget.remaining > 0
    ? Math.min(1, budget.perTradeCeiling / budget.remaining)
    : 0
  const heat = riskHeat(budget.remainingPct)
  return (
    <div>
      <StationEyebrow label="MAX RISK · NEXT TRADE" right={`${budget.perTradePct}% EQUITY`} />
      <div
        className="flex items-center gap-3"
        style={{ padding: "11px 12px", borderRadius: 11, border: `1px solid ${VANTARY.rule}`, background: VANTARY.glass }}
      >
        <div className="flex flex-col" style={{ minWidth: 0 }}>
          <VaultNumber value={budget.perTradeCeiling} prefix="$" color={VANTARY.paper} size={20} />
          <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashSoft, marginTop: 3 }}>
            RISK AMOUNT
          </span>
        </div>
        <div className="flex flex-col" style={{ flex: 1, gap: 6 }}>
          <SegmentMeter fraction={frac} color={heat} segments={20} height={7} />
          <span className="font-mono" style={{ fontSize: 8.5, color: VANTARY.ashSoft, letterSpacing: "0.04em" }}>
            {budget.perTradeCeiling < budget.perTradeAmount
              ? "Capped by remaining daily budget"
              : `${budget.perTradePct}% of ${fmtMoney(acc.equity, acc.currency)} equity`}
          </span>
        </div>
      </div>
    </div>
  )
})

/* ─── READINESS RAIL ───────────────────────────────────────────────────── */
const ReadinessRail = memo(function ReadinessRail({
  readiness,
  mode,
}: {
  readiness: ReturnType<typeof deriveReadiness>
  mode: ConsoleMode
}) {
  const reduce = useReducedMotion()
  const accent = CONSOLE_ACCENTS[mode]
  const map: Record<string, { tone: string; icon: typeof ShieldCheck; bg: string }> = {
    ready:     { tone: "#E5A93C",          icon: ShieldCheck, bg: "rgba(229,169,60,0.10)" },
    "sim-ready": { tone: VANTARY.teal,     icon: ShieldCheck, bg: VANTARY.tealWash },
    blocked:   { tone: VANTARY.chartDown,  icon: ShieldAlert, bg: "rgba(229,72,77,0.10)" },
    locked:    { tone: "#E5A93C",          icon: Lock,        bg: "rgba(229,169,60,0.08)" },
    idle:      { tone: VANTARY.ash,        icon: Activity,    bg: VANTARY.ruleSoft },
  }
  const m = map[readiness.state] ?? map.idle
  const Icon = m.icon
  const danger = readiness.state === "blocked"

  return (
    <motion.div
      className="flex items-center gap-3"
      style={{
        position: "relative",
        padding: "12px 13px",
        borderRadius: 12,
        border: `1px solid ${m.tone}3A`,
        background: m.bg,
        overflow: "hidden",
      }}
      animate={
        danger && !reduce
          ? { boxShadow: [`0 0 0 0 ${m.tone}00`, `0 0 0 3px ${m.tone}22`, `0 0 0 0 ${m.tone}00`] }
          : { boxShadow: `0 0 0 0 ${m.tone}00` }
      }
      transition={{ duration: 2.4, repeat: danger && !reduce ? Infinity : 0, ease: "easeInOut" }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${m.tone}18`, border: `1px solid ${m.tone}44`, color: m.tone }}
      >
        <Icon size={17} strokeWidth={1.8} />
      </span>
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <span className="font-sans" style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 600, letterSpacing: "-0.01em" }}>
          {readiness.headline}
        </span>
        <span className="font-sans" style={{ fontSize: 11, color: VANTARY.paperDim, marginTop: 2, lineHeight: 1.4 }}>
          {readiness.detail}
        </span>
      </div>
      <ExecutionModeBadge mode={mode} />
    </motion.div>
  )
})

/* ─── LOADING SKELETON (sync) ──────────────────────────────────────────── */
const StationSkeleton = memo(function StationSkeleton() {
  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      <Skeleton height={58} radius={12} />
      <Skeleton height={64} radius={11} />
      <div className="flex gap-4 items-center">
        <Skeleton width={132} height={132} radius={66} />
        <div className="flex flex-col" style={{ flex: 1, gap: 10 }}>
          <Skeleton height={12} /><Skeleton height={12} /><Skeleton height={12} /><Skeleton height={12} />
        </div>
      </div>
    </div>
  )
})

/* ─── THE DETAIL PANEL ─────────────────────────────────────────────────────
 *  The rich Account & Risk station — now CONTEXT-DRIVEN and rendered only when
 *  the trader expands the compact command strip. It no longer owns selection
 *  state or reports anything up (the AccountProvider does that centrally); it
 *  purely VISUALISES the shared account context. Mounting it is cheap and it
 *  never pushes the execution controls down because it lives in a collapsible.
 * ──────────────────────────────────────────────────────────────────────── */
export const AccountDetailPanel = memo(function AccountDetailPanel() {
  const reduce = useReducedMotion()
  const {
    roster, selectedId, account, syncing,
    budget, health, guardrails, readiness, mode, liveLocked,
    select, disconnect,
  } = useAccount()

  const accent = CONSOLE_ACCENTS[mode]
  const passCount = guardrails.filter(g => g.status === "pass").length

  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      {/* selector — always present */}
      <ExecutionAccountSelector
        accounts={roster}
        selectedId={selectedId}
        onSelect={select}
        onDisconnect={disconnect}
      />

      {/* body — empty state / skeleton / full instrument */}
      {!account ? (
        <EmptyState />
      ) : syncing ? (
        <StationSkeleton />
      ) : (
        <motion.div
          className="flex flex-col"
          style={{ gap: 14 }}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* readiness verdict — top, the answer to "am I allowed?" */}
          <ReadinessRail readiness={readiness} mode={mode} />

          {/* health */}
          {health && (
            <AccountHealthCard
              acc={account}
              health={health}
              equityDriftPct={health.equityDrift}
              marginUse={health.marginUse}
            />
          )}

          {/* equity / margin vault numbers */}
          <div>
            <StationEyebrow label="CAPITAL VAULT" right={account.leverage} />
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              <AccountVaultMetric label="EQUITY" emphasize>
                <VaultNumber value={account.equity} prefix="$" color={VANTARY.paper} size={19} />
              </AccountVaultMetric>
              <AccountVaultMetric label="AVAILABLE MARGIN" emphasize>
                <VaultNumber value={account.availableMargin} prefix="$" color={accent.base} size={19} />
              </AccountVaultMetric>
              <AccountVaultMetric label="BALANCE" emphasize align="left">
                <VaultNumber value={account.balance} prefix="$" color={VANTARY.paperDim} size={15} weight={500} />
              </AccountVaultMetric>
              <AccountVaultMetric label="USED MARGIN" emphasize align="left">
                <VaultNumber value={account.usedMargin} prefix="$" color={VANTARY.paperDim} size={15} weight={500} />
              </AccountVaultMetric>
            </div>
          </div>

          {/* RISK — the protagonist */}
          {budget && <RiskBudgetBlock acc={account} budget={budget} />}
          {budget && <PerTradeRiskStrip acc={account} budget={budget} />}

          {/* guardrails */}
          <div>
            <StationEyebrow label="PRE-FLIGHT GUARDRAILS" right={`${passCount}/${guardrails.length} CLEAR`} />
            <ul className="flex flex-col" style={{ listStyle: "none", margin: 0, padding: 0, gap: 1 }}>
              {guardrails.map((g, i) => (
                <GuardrailItem
                  key={g.id}
                  label={g.label}
                  detail={g.detail}
                  status={g.status}
                  order={i}
                  future={g.future}
                />
              ))}
            </ul>
          </div>

          {/* legend */}
          <div className="flex items-center gap-3" style={{ paddingTop: 2 }}>
            <LegendDot color={VANTARY.chartUp} label="Pass" />
            <LegendDot color="#E5A93C" label="Caution" />
            <LegendDot color={VANTARY.chartDown} label="Blocked" />
            <span aria-hidden style={{ flex: 1 }} />
            {liveLocked && (
              <span className="font-mono uppercase inline-flex items-center gap-1" style={{ fontSize: 8, letterSpacing: "0.14em", color: "#E5A93C" }}>
                <Lock size={8} strokeWidth={2.2} /> LIVE LOCKED
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
})

/* ─── EMPTY STATE — premium "connect to begin" ─────────────────────────── */
const EmptyState = memo(function EmptyState() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      style={{
        padding: "26px 18px 22px",
        borderRadius: 12,
        border: `1px dashed ${VANTARY.rule}`,
        background: VANTARY.ruleSoft,
        gap: 10,
      }}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        className="inline-flex items-center justify-center"
        style={{ width: 46, height: 46, borderRadius: 13, background: VANTARY.glass, border: `1px solid ${VANTARY.rule}`, color: VANTARY.ash }}
        animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Gauge size={22} strokeWidth={1.5} />
      </motion.span>
      <span className="font-sans" style={{ fontSize: 13, color: VANTARY.paperDim, fontWeight: 500 }}>
        Risk-first execution starts here
      </span>
      <span className="font-sans" style={{ fontSize: 11, color: VANTARY.ashSoft, lineHeight: 1.5, maxWidth: 240 }}>
        Select a simulation or broker account above. ArchioAI will read its equity, daily risk budget, and guardrails — then size every trade from what you&apos;re willing to lose.
      </span>
    </motion.div>
  )
})

export default AccountDetailPanel
