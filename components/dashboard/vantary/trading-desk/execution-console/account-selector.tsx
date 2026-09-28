"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · ACCOUNT SELECTOR  (Phase 2)
 *  ─────────────────────────────────────────────────────────────────────────
 *  A premium account control — not a basic dropdown. It presents the SELECTED
 *  account as an identity card (broker · nickname · kind · equity · sync ·
 *  health/lock badges) and expands into a glassy list of every account, plus
 *  a calm "disconnected" empty state.
 *
 *  Selecting an account is the single act that changes the console's WORLD —
 *  the parent station maps the chosen account → ConsoleMode and re-skins
 *  everything. The selector itself holds no risk logic; it only chooses.
 * ══════════════════════════════════════════════════════════════════════ */

import { memo, useState, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  FlaskConical, Building2, Zap, ChevronDown, Check, Lock, PlugZap, Plus,
  type LucideIcon,
} from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import {
  type ConsoleAccount, type AccountKind,
  fmtMoney, fmtSyncLabel,
} from "./account-data"
import { MicroSparkLine } from "./console-instruments"

/* kind → glyph + tone (PROP = blue, never purple; LIVE = gold; SIM = teal) */
const KIND_META: Record<AccountKind, { icon: LucideIcon; label: string; tone: string }> = {
  simulation: { icon: FlaskConical, label: "SIMULATION", tone: VANTARY.teal },
  prop:       { icon: Building2,    label: "PROP",       tone: VANTARY.blue },
  live:       { icon: Zap,          label: "LIVE",       tone: "#E5A93C" },
}

/* ─── A single account row inside the open list ────────────────────────── */
const AccountRow = memo(function AccountRow({
  acc,
  selected,
  onSelect,
  order,
}: {
  acc: ConsoleAccount
  selected: boolean
  onSelect: (id: string) => void
  order: number
}) {
  const reduce = useReducedMotion()
  const meta = KIND_META[acc.kind]
  const Icon = meta.icon
  const liveLocked = acc.kind !== "simulation" && !acc.liveEnabled

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(acc.id)}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.26, delay: order * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { y: -1 }}
      className="flex items-center gap-3 text-left w-full"
      style={{
        padding: "10px 11px",
        borderRadius: 11,
        border: `1px solid ${selected ? `${meta.tone}55` : VANTARY.rule}`,
        background: selected ? `${meta.tone}10` : VANTARY.glass,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.18s, background 0.18s",
      }}
    >
      {/* monogram */}
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: `${meta.tone}14`,
          border: `1px solid ${meta.tone}3A`,
          color: meta.tone,
        }}
      >
        <Icon size={15} strokeWidth={1.7} />
      </span>

      {/* identity */}
      <span className="flex flex-col" style={{ minWidth: 0, flex: 1 }}>
        <span className="flex items-center gap-1.5" style={{ minWidth: 0 }}>
          <span
            className="font-sans truncate"
            style={{ fontSize: 12.5, color: VANTARY.paper, fontWeight: 500 }}
          >
            {acc.nickname}
          </span>
          {liveLocked && (
            <Lock size={9} strokeWidth={2} color="#E5A93C" style={{ flexShrink: 0 }} />
          )}
        </span>
        <span
          className="font-mono uppercase truncate"
          style={{ fontSize: 8, letterSpacing: "0.14em", color: VANTARY.ashSoft, marginTop: 2 }}
        >
          {acc.broker} · {acc.mask} · {meta.label}
        </span>
      </span>

      {/* equity + spark */}
      <span className="flex flex-col items-end" style={{ flexShrink: 0, width: 78 }}>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 12, color: VANTARY.paper, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          {fmtMoney(acc.equity, acc.currency)}
        </span>
        <span style={{ width: 64, height: 14, marginTop: 2 }}>
          <MicroSparkLine series={acc.spark.slice(-20)} color={meta.tone} width={64} height={14} />
        </span>
      </span>

      {/* selected check */}
      {selected && (
        <span
          className="inline-flex items-center justify-center"
          style={{
            width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
            background: meta.tone, color: VANTARY.ink,
          }}
        >
          <Check size={10} strokeWidth={3} />
        </span>
      )}
    </motion.button>
  )
})

/* ─── The selector ─────────────────────────────────────────────────────── */
export const ExecutionAccountSelector = memo(function ExecutionAccountSelector({
  accounts,
  selectedId,
  onSelect,
  onDisconnect,
}: {
  accounts: ReadonlyArray<ConsoleAccount>
  selectedId: string | null
  onSelect: (id: string) => void
  onDisconnect: () => void
}) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const selected = accounts.find(a => a.id === selectedId) ?? null

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id)
      setOpen(false)
    },
    [onSelect],
  )

  const meta = selected ? KIND_META[selected.kind] : null
  const tone = meta?.tone ?? VANTARY.ash
  const liveLocked = selected ? selected.kind !== "simulation" && !selected.liveEnabled : false

  return (
    <div style={{ position: "relative" }}>
      {/* TRIGGER — selected identity card, or disconnected prompt */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={selected ? `Selected account ${selected.nickname}` : "Select an account"}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 w-full text-left"
        style={{
          padding: "11px 12px",
          borderRadius: 12,
          border: `1px solid ${selected ? `${tone}44` : VANTARY.rule}`,
          background: selected ? `${tone}0D` : VANTARY.glass,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.2s, background 0.2s",
        }}
      >
        {/* edge light */}
        <span
          aria-hidden
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${tone}55, transparent)`,
          }}
        />
        {selected && meta ? (
          <>
            <span
              className="inline-flex items-center justify-center"
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: `${tone}16`, border: `1px solid ${tone}40`, color: tone,
              }}
            >
              <meta.icon size={17} strokeWidth={1.7} />
            </span>
            <span className="flex flex-col" style={{ minWidth: 0, flex: 1 }}>
              <span className="flex items-center gap-1.5">
                <span className="font-sans truncate" style={{ fontSize: 13.5, color: VANTARY.paper, fontWeight: 600 }}>
                  {selected.nickname}
                </span>
                <span
                  className="font-mono uppercase inline-flex items-center gap-1"
                  style={{
                    fontSize: 7.5, letterSpacing: "0.12em", padding: "1.5px 5px",
                    borderRadius: 4, color: tone, background: `${tone}16`, border: `1px solid ${tone}33`,
                  }}
                >
                  {liveLocked && <Lock size={7} strokeWidth={2.4} />}
                  {meta.label}
                </span>
              </span>
              <span
                className="font-mono uppercase truncate"
                style={{ fontSize: 8.5, letterSpacing: "0.14em", color: VANTARY.ashSoft, marginTop: 3 }}
              >
                {selected.broker} · {selected.mask} · {fmtSyncLabel(selected.lastSyncedAt)}
              </span>
            </span>
          </>
        ) : (
          <>
            <span
              className="inline-flex items-center justify-center"
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: VANTARY.ruleSoft, border: `1px dashed ${VANTARY.rule}`, color: VANTARY.ashSoft,
              }}
            >
              <PlugZap size={17} strokeWidth={1.7} />
            </span>
            <span className="flex flex-col" style={{ minWidth: 0, flex: 1 }}>
              <span className="font-sans" style={{ fontSize: 13, color: VANTARY.paperDim, fontWeight: 500 }}>
                No account selected
              </span>
              <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: VANTARY.ashSoft, marginTop: 3 }}>
                Choose simulation or a broker
              </span>
            </span>
          </>
        )}
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0, color: VANTARY.ashSoft }}
        >
          <ChevronDown size={16} strokeWidth={1.8} />
        </motion.span>
      </button>

      {/* OPEN LIST — renders IN FLOW (height-animated), never absolutely
          positioned: the console surfaces use overflow:hidden, which used to
          clip the old popover so accounts could not be chosen. */}
      <AnimatePresence initial={false}>
        {open && (
            <motion.div
              role="listbox"
              aria-label="Accounts"
              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={{
                overflow: "hidden",
                marginTop: 6,
                display: "flex", flexDirection: "column", gap: 6,
              }}
            >
              <span
                className="font-mono uppercase"
                style={{ fontSize: 8, letterSpacing: "0.2em", color: VANTARY.ashSoft, padding: "2px 4px" }}
              >
                {accounts.length} ACCOUNTS
              </span>
              {accounts.map((acc, i) => (
                <AccountRow
                  key={acc.id}
                  acc={acc}
                  selected={acc.id === selectedId}
                  onSelect={handleSelect}
                  order={i}
                />
              ))}

              {/* disconnect + (future) add */}
              <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
                {selectedId && (
                  <button
                    type="button"
                    onClick={() => { onDisconnect(); setOpen(false) }}
                    className="font-mono uppercase"
                    style={{
                      flex: 1, padding: "7px 8px", fontSize: 8.5, letterSpacing: "0.14em",
                      color: VANTARY.ashSoft, background: "transparent",
                      border: `1px solid ${VANTARY.rule}`, borderRadius: 8, cursor: "pointer",
                    }}
                  >
                    Disconnect
                  </button>
                )}
                <span
                  className="font-mono uppercase inline-flex items-center justify-center gap-1.5"
                  title="Connecting a new TradeLocker account arrives in a later phase"
                  style={{
                    flex: 1, padding: "7px 8px", fontSize: 8.5, letterSpacing: "0.14em",
                    color: VANTARY.ashGhost, border: `1px dashed ${VANTARY.rule}`,
                    borderRadius: 8, cursor: "default",
                  }}
                >
                  <Plus size={10} strokeWidth={2} />
                  Connect · soon
                </span>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

/* keep CONSOLE_ACCENTS referenced for downstream theme coupling */
export { CONSOLE_ACCENTS } from "./console-theme"
