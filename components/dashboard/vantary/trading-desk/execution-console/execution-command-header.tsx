"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · COMMAND HEADER  (UX reconstruction)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Replaces the old stack of (1) a 3-row Status Crown + (2) the full-height
 *  Account & Risk station that together pushed the actual trade controls far
 *  below the fold. This is ONE compact, always-visible command strip:
 *
 *     ┌──────────────────────────────────────────────────────────────┐
 *     │  ◆ Practice Desk ••4821   FTMO · sim     [SIM]   ⌄ details      │
 *     │  EQUITY $100,240   MARGIN $98,1k   RISK LEFT ▓▓▓░ 78%   ● READY │
 *     └──────────────────────────────────────────────────────────────┘
 *
 *  · It is the account picker entry-point (click the identity → switch).
 *  · It shows the four numbers a trader glances at before every order:
 *    equity, free margin, daily-risk remaining, and the go/no-go verdict.
 *  · A "details" disclosure expands the rich AccountDetailPanel inline so the
 *    full guardrail / health / vault story is one click away — never blocking
 *    the path to the trade ticket.
 *
 *  All state lives in AccountProvider; this is a pure consumer.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronDown, Wallet, Plug, ShieldCheck, ShieldAlert, Lock, CircleDot } from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import { CONSOLE_ACCENTS } from "./console-theme"
import { useAccount } from "./account-context"
import { fmtMoney } from "./account-data"
import { SegmentMeter } from "./console-instruments"
import { toneForHealth } from "./station-primitives"
import { ExecutionAccountSelector } from "./account-selector"
import { AccountDetailPanel } from "./account-station"
import { SafetyPip, LiveArmingControl } from "./status-crown"
import { GlassSurface, tintA } from "./glass-surface"

/* compact money: $100,240 → "$100.2k", $1,240,000 → "$1.24M" */
function compactMoney(n: number, currency = "USD"): string {
  const sym = currency === "USD" ? "$" : ""
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 10_000)    return `${sym}${(n / 1_000).toFixed(1)}k`
  return fmtMoney(n, currency)
}

/* risk-budget heat: green plentiful → amber → red */
function riskHeat(remainingPct: number): string {
  if (remainingPct >= 0.5) return VANTARY.chartUp
  if (remainingPct >= 0.25) return "#E5A93C"
  return VANTARY.chartDown
}

/* ─── one compact metric cell ──────────────────────────────────────────── */
const MetricCell = memo(function MetricCell({
  label, children, grow = false,
}: { label: string; children: React.ReactNode; grow?: boolean }) {
  return (
    <div className="flex flex-col" style={{ gap: 3, minWidth: 0, flex: grow ? 1 : "none" }}>
      <span
        className="font-mono uppercase"
        style={{ fontSize: 8, letterSpacing: "0.16em", color: VANTARY.ashGhost, whiteSpace: "nowrap" }}
      >
        {label}
      </span>
      {children}
    </div>
  )
})

/* ─── whisper-thin SIM / LIVE safety marker ───────────────────────────────
   Replaces the old word-heavy "EXECUTION CONSOLE" eyebrow + ModePill. The
   only words that survive are the one safety word a trader must never be
   unsure about — SIM vs LIVE — rendered as a tiny color-coded dot + 9px
   label, floated to the top-right so it reads as a quiet status marker
   rather than a header. ───────────────────────────────────────────────── */
const SafetyMarker = memo(function SafetyMarker({ mode }: { mode: import("./console-theme").ConsoleMode }) {
  const accent = CONSOLE_ACCENTS[mode]
  const label =
    mode === "disconnected" ? "OFFLINE"
    : mode === "blocked" ? "BLOCKED"
    : accent.isLive ? "LIVE" : "SIM"
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={accent.caption}
      style={{
        position: "absolute", top: 9, right: 11, zIndex: 4,
        padding: "2px 7px", borderRadius: 999,
        border: `1px solid ${tintA(accent.base, 0.28)}`,
        background: tintA(accent.base, 0.08),
      }}
    >
      <SafetyPip mode={mode} size={6} />
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", fontWeight: 600, color: accent.base, lineHeight: 1 }}>
        {label}
      </span>
    </span>
  )
})

/* ─── DISCONNECTED rest state — invites the one real decision ──────────── */
const DisconnectedStrip = memo(function DisconnectedStrip({
  onOpen,
}: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center gap-3 w-full"
      style={{
        padding: "13px 15px",
        borderRadius: 13,
        border: `1px dashed ${VANTARY.rule}`,
        background: VANTARY.ruleSoft,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: VANTARY.ruleSoft, border: `1px solid ${VANTARY.rule}`, color: VANTARY.ashSoft }}
      >
        <Plug size={16} strokeWidth={1.8} />
      </span>
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <span className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: VANTARY.paper, letterSpacing: "-0.01em" }}>
          No account connected
        </span>
        <span className="font-sans" style={{ fontSize: 11, color: VANTARY.paperDim, marginTop: 1 }}>
          Connect a desk to arm the console — choose simulation, prop, or live.
        </span>
      </div>
      <span
        className="font-mono uppercase inline-flex items-center gap-1.5"
        style={{ fontSize: 9.5, letterSpacing: "0.1em", color: VANTARY.paper, padding: "6px 11px", borderRadius: 8, background: VANTARY.paper + "0F", border: `1px solid ${VANTARY.rule}`, whiteSpace: "nowrap" }}
      >
        <Wallet size={11} strokeWidth={2} /> CONNECT
      </span>
    </button>
  )
})

/* ═══ THE COMMAND HEADER ═══════════════════════════════════════════════ */
export interface ExecutionCommandHeaderProps {
  /** Arms / disarms live execution (visual only — no order path). Forwarded to
   *  the merged crown arming control that now lives inside this header. */
  onToggleLock: () => void
}

export const ExecutionCommandHeader = memo(function ExecutionCommandHeader({
  onToggleLock,
}: ExecutionCommandHeaderProps) {
  const reduce = useReducedMotion()
  const {
    account, syncing, budget, health, readiness, mode, liveLocked,
    roster, selectedId, select, disconnect,
  } = useAccount()

  const [expanded, setExpanded] = useState(false)   // details disclosure
  const [picking, setPicking]   = useState(false)    // account switcher popover

  const accent = CONSOLE_ACCENTS[mode]

  // disconnected → invite connection (still crowned with the eyebrow so the
  // block always reads as the one EXECUTION CONSOLE surface).
  if (!account) {
    return (
      <GlassSurface
        accent={accent.base}
        tone="idle"
        transparent
        interactive={false}
        radius={14}
        className="flex flex-col"
        style={{ padding: "12px 13px 13px" }}
      >
        <SafetyMarker mode={mode} />
        {picking ? (
          <ExecutionAccountSelector
            accounts={roster}
            selectedId={selectedId}
            onSelect={(id) => { select(id); setPicking(false) }}
            onDisconnect={() => setPicking(false)}
          />
        ) : (
          <DisconnectedStrip onOpen={() => setPicking(true)} />
        )}
      </GlassSurface>
    )
  }

  const heat = budget ? riskHeat(budget.remainingPct) : VANTARY.ashSoft
  const healthTone = health ? toneForHealth(health.tier) : VANTARY.ashSoft

  return (
    <GlassSurface
      accent={accent.base}
      tone={mode === "blocked" ? "warn" : accent.isLive ? "live" : "active"}
      transparent
      interactive
      radius={14}
      className="flex flex-col"
    >
      {/* whisper-thin SIM/LIVE safety marker — the one surviving header word */}
      <SafetyMarker mode={mode} />

      {/* ── ROW 1: identity + spark + live arming + details toggle ───────── */}
      <div className="flex items-center gap-3" style={{ padding: "13px 13px 9px" }}>
        {/* identity → click to switch account */}
        <button
          type="button"
          onClick={() => setPicking(p => !p)}
          className="flex items-center gap-2.5"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, minWidth: 0, flex: 1, textAlign: "left" }}
          aria-label="Switch account"
        >
          <span
            className="inline-flex items-center justify-center"
            style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: `${accent.base}1C`, border: `1px solid ${accent.base}44`, color: accent.base }}
          >
            <Wallet size={15} strokeWidth={1.9} />
          </span>
          <span className="flex flex-col" style={{ minWidth: 0 }}>
            <span className="flex items-center gap-1.5" style={{ minWidth: 0 }}>
              <span className="font-sans" style={{ fontSize: 13.5, fontWeight: 650, color: VANTARY.paper, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {account.nickname}
              </span>
              <span className="font-mono" style={{ fontSize: 10, color: VANTARY.ashSoft, flexShrink: 0 }}>{account.mask}</span>
              <ChevronDown size={12} strokeWidth={2} color={VANTARY.ashGhost} style={{ flexShrink: 0, transform: picking ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </span>
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: VANTARY.ashGhost, whiteSpace: "nowrap" }}>
              {account.broker} · {account.kind}
            </span>
          </span>
        </button>

        {/* live arming control — moved here from the crown (LOCK / ARM). */}
        <LiveArmingControl mode={mode} onToggleLock={onToggleLock} />

        {/* details disclosure */}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="font-mono uppercase inline-flex items-center gap-1"
          style={{
            fontSize: 8.5, letterSpacing: "0.12em", color: expanded ? VANTARY.paper : VANTARY.ashSoft,
            padding: "5px 8px", borderRadius: 7, border: `1px solid ${expanded ? accent.base + "55" : VANTARY.rule}`,
            background: expanded ? `${accent.base}14` : "transparent", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
          }}
          aria-expanded={expanded}
        >
          DETAILS
          <ChevronDown size={11} strokeWidth={2.2} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
      </div>

      {/* account switcher popover (inline) */}
      <AnimatePresence>
        {picking && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden", padding: "0 13px" }}
          >
            <div style={{ paddingBottom: 11 }}>
              <ExecutionAccountSelector
                accounts={roster}
                selectedId={selectedId}
                onSelect={(id) => { select(id); setPicking(false) }}
                onDisconnect={() => { disconnect(); setPicking(false) }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ROW 2: the four glance numbers ──────────────────────────────── */}
      {/* 2×2 grid so the cells never collide on the narrow peek rail; the
          dividers are the grid gaps, not absolute spacers. */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          columnGap: 14, rowGap: 10,
          padding: "10px 14px 12px",
          borderTop: `1px solid ${VANTARY.rule}`,
          background: VANTARY.ruleSoft,
          opacity: syncing ? 0.45 : 1, transition: "opacity .25s",
        }}
      >
        <MetricCell label="EQUITY">
          <span className="font-mono" style={{ fontSize: 14, fontWeight: 600, color: VANTARY.paper, letterSpacing: "-0.01em" }}>
            {compactMoney(account.equity, account.currency)}
          </span>
        </MetricCell>

        <MetricCell label="FREE MARGIN">
          <span className="font-mono" style={{ fontSize: 14, fontWeight: 600, color: accent.base, letterSpacing: "-0.01em" }}>
            {compactMoney(account.availableMargin, account.currency)}
          </span>
        </MetricCell>

        {/* daily risk remaining — the protagonist, even when compact */}
        {budget && (
          <MetricCell label="DAILY RISK LEFT">
            <div className="flex items-center gap-2">
              <span className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: heat, whiteSpace: "nowrap" }}>
                {compactMoney(budget.remaining, account.currency)}
              </span>
              <span style={{ flex: 1, minWidth: 28 }}>
                <SegmentMeter fraction={budget.remainingPct} color={heat} segments={10} height={6} />
              </span>
              <span className="font-mono" style={{ fontSize: 10, color: VANTARY.ashSoft, flexShrink: 0 }}>
                {Math.round(budget.remainingPct * 100)}%
              </span>
            </div>
          </MetricCell>
        )}

        {/* go / no-go verdict */}
        <MetricCell label="STATUS">
          <span className="inline-flex items-center gap-1.5" style={{ whiteSpace: "nowrap" }}>
            {readiness.state === "blocked" ? (
              <ShieldAlert size={13} strokeWidth={2} color={VANTARY.chartDown} />
            ) : liveLocked ? (
              <Lock size={12} strokeWidth={2.2} color="#E5A93C" />
            ) : readiness.state === "idle" ? (
              <CircleDot size={12} strokeWidth={2} color={VANTARY.ashSoft} />
            ) : (
              <ShieldCheck size={13} strokeWidth={2} color={VANTARY.chartUp} />
            )}
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
                color: readiness.state === "blocked" ? VANTARY.chartDown : liveLocked ? "#E5A93C" : readiness.state === "idle" ? VANTARY.ashSoft : VANTARY.chartUp,
              }}
            >
              {readiness.state === "blocked" ? "BLOCKED" : liveLocked ? "LOCKED" : readiness.state === "idle" ? "STANDBY" : "READY"}
            </span>
            {/* tiny health dot — sits with the verdict, its natural home */}
            {health && (
              <span
                title={`Account health · ${health.label}`}
                style={{ width: 8, height: 8, borderRadius: 5, marginLeft: 2, flexShrink: 0, background: healthTone, boxShadow: `0 0 8px ${healthTone}99` }}
                aria-label={`Account health ${health.label}`}
              />
            )}
          </span>
        </MetricCell>
      </div>

      {/* ── EXPANDED DETAIL — the rich station, on demand ───────────────── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden", borderTop: `1px solid ${VANTARY.rule}` }}
          >
            <div style={{ padding: "14px 14px 15px", background: VANTARY.ink }}>
              <AccountDetailPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassSurface>
  )
})
