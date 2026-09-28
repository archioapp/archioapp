"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · ACCOUNT CONTEXT  (UX reconstruction)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Lifts the account SELECTION + every derivation (budget, health, guardrails,
 *  readiness, mode) out of the old monolithic Account station so two surfaces
 *  can share one truth:
 *
 *    · AccountRiskMiniStrip — the always-visible compact command strip at the
 *      very top of the console (selected account · equity · margin · health ·
 *      risk remaining · mode · readiness).
 *    · AccountDetailPanel  — the expandable, rich Account & Risk station that
 *      opens on demand (the old station body) WITHOUT pushing execution down.
 *
 *  Selecting an account is still the single act that changes the console's
 *  world. The provider reports the derived mode + crown identity + resolved
 *  capital up via callbacks so the shell can re-skin and feed the trade-draft
 *  engine — exactly the contract the old station had, now centralised.
 *
 *  Pure orchestration: no order path, live accounts stay locked.
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  createContext, useContext, useState, useEffect, useMemo, useCallback,
  type ReactNode,
} from "react"
import { useReducedMotion } from "framer-motion"

import { CONSOLE_ACCENTS, type ConsoleMode } from "./console-theme"
import {
  CONSOLE_ACCOUNT_ROSTER,
  modeForAccount,
  deriveRiskBudget,
  deriveHealth,
  deriveGuardrails,
  deriveReadiness,
  type ConsoleAccount,
  type RiskBudget,
  type AccountHealth,
  type Guardrail,
  type Readiness,
} from "./account-data"

/* ─── Context shape ────────────────────────────────────────────────────── */
interface AccountContextValue {
  roster: ReadonlyArray<ConsoleAccount>
  selectedId: string | null
  account: ConsoleAccount | null
  syncing: boolean
  /* derivations (null until an account is selected) */
  budget: RiskBudget | null
  health: AccountHealth | null
  guardrails: Guardrail[]
  readiness: Readiness
  mode: ConsoleMode
  liveLocked: boolean
  /* actions */
  select: (id: string) => void
  disconnect: () => void
}

const AccountContext = createContext<AccountContextValue | null>(null)

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error("useAccount must be used within AccountProvider")
  return ctx
}

/* ─── Provider ─────────────────────────────────────────────────────────── */
export function AccountProvider({
  liveUnlocked = false,
  onModeChange,
  onAccountChange,
  onResolved,
  children,
}: {
  /** crown lock toggle; arms a prop/live account to live-ready (sim ignores). */
  liveUnlocked?: boolean
  onModeChange?: (mode: ConsoleMode) => void
  onAccountChange?: (account: {
    name: string; broker: string; balance: number; currency: string; spark: number[]
  } | null) => void
  onResolved?: (resolved: {
    account: ConsoleAccount | null
    budget:  RiskBudget | null
    liveEnabled: boolean
  }) => void
  children: ReactNode
}) {
  const reduce = useReducedMotion()
  // opens DISCONNECTED — the honest rest state.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  // brief sync shimmer when switching accounts → reads as "connecting"
  useEffect(() => {
    if (!selectedId) return
    setSyncing(true)
    const t = setTimeout(() => setSyncing(false), reduce ? 0 : 620)
    return () => clearTimeout(t)
  }, [selectedId, reduce])

  const baseAccount = useMemo<ConsoleAccount | null>(
    () => CONSOLE_ACCOUNT_ROSTER.find(a => a.id === selectedId) ?? null,
    [selectedId],
  )

  // apply the crown unlock to a live/prop account (sim ignores it)
  const account = useMemo<ConsoleAccount | null>(() => {
    if (!baseAccount) return null
    if (baseAccount.kind !== "simulation" && liveUnlocked) {
      return { ...baseAccount, liveEnabled: true }
    }
    return baseAccount
  }, [baseAccount, liveUnlocked])

  const budget = useMemo(() => account ? deriveRiskBudget(account) : null, [account])
  const health = useMemo(() => account && budget ? deriveHealth(account, budget) : null, [account, budget])
  const guardrails = useMemo(() => deriveGuardrails(account, budget), [account, budget])
  const readiness = useMemo(() => deriveReadiness(account, budget, guardrails), [account, budget, guardrails])

  const mode = useMemo<ConsoleMode>(() => {
    const base = modeForAccount(account)
    if (readiness.state === "blocked") return "blocked"
    return base
  }, [account, readiness.state])

  const liveLocked = !!account && account.kind !== "simulation" && !account.liveEnabled

  /* report up — mode */
  useEffect(() => { onModeChange?.(mode) }, [mode, onModeChange])

  /* report up — crown identity (null when nothing selected → crown rests) */
  useEffect(() => {
    if (!account) { onAccountChange?.(null); return }
    onAccountChange?.({
      name:     `${account.nickname} · ${account.mask}`,
      broker:   account.broker,
      balance:  Math.round(account.equity),
      currency: account.currency,
      spark:    account.spark,
    })
  }, [account, onAccountChange])

  /* report up — resolved capital for the trade-draft engine */
  useEffect(() => {
    onResolved?.({
      account,
      budget,
      liveEnabled: !!account && account.kind !== "simulation" && !!account.liveEnabled,
    })
  }, [account, budget, onResolved])

  const select = useCallback((id: string) => setSelectedId(id), [])
  const disconnect = useCallback(() => setSelectedId(null), [])

  const value = useMemo<AccountContextValue>(() => ({
    roster: CONSOLE_ACCOUNT_ROSTER,
    selectedId, account, syncing,
    budget, health, guardrails, readiness, mode, liveLocked,
    select, disconnect,
  }), [
    selectedId, account, syncing,
    budget, health, guardrails, readiness, mode, liveLocked,
    select, disconnect,
  ])

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

/* convenience: the accent for the current mode (used by both surfaces) */
export function useAccountAccent() {
  const { mode } = useAccount()
  return CONSOLE_ACCENTS[mode]
}
