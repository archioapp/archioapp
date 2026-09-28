"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION SHELL CONTEXT  (the hoisted provider topology)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Phase 5 hoists the account + trade-draft providers OUT of the console rail
 *  and UP to the trading-desk shell, so two always-on surfaces share ONE draft:
 *
 *    · ExecutionConsoleShell — the full ticket living in the side rail.
 *    · FastEntryBar          — the slim always-visible bottom bar.
 *
 *  Set a stop in the bottom bar and it is already there when you open the rail,
 *  because both read the SAME `useTradeDraft()` / `useAccount()` context.
 *
 *  This provider owns the small bit of orchestration the old console shell held
 *  locally — `mode` (derived from the selected account), `liveUnlocked` (the
 *  crown lock toggle), and the fully `resolved` capital — then mounts
 *  `AccountProvider` → `TradeDraftProvider` around its children. It also exposes
 *  a tiny context (`useExecutionShell()`) so the console + bar can read `mode`
 *  and drive the lock toggle / "pin the console open" affordance without
 *  re-deriving anything.
 *
 *  MUST be mounted inside `<TradingDeskProvider/>` — `TradeDraftProvider` reads
 *  the chart's current symbol via `useTradingDesk()` to mirror the chart.
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  createContext, useContext, useState, useCallback, useMemo,
  type ReactNode,
} from "react"

import { type ConsoleMode } from "./console-theme"
import { type ConsoleAccount, type RiskBudget } from "./account-data"
import { AccountProvider } from "./account-context"
import { TradeDraftProvider } from "./trade-draft-context"

/* ─── Context shape ────────────────────────────────────────────────────── */
interface ExecutionShellValue {
  /** console world, derived from the selected account. */
  mode: ConsoleMode
  /** crown lock toggle — arms a prop/live account to live-ready (visual only). */
  liveUnlocked: boolean
  onToggleLock: () => void
  /** the always-on bar asks the rail to pin itself open + focus the ticket. */
  requestPinConsole: () => void
  /** the rail registers its pin handler so the bar can drive it. */
  registerPinHandler: (fn: (() => void) | null) => void
}

const ExecutionShellContext = createContext<ExecutionShellValue | null>(null)

export function useExecutionShell(): ExecutionShellValue {
  const ctx = useContext(ExecutionShellContext)
  if (!ctx) throw new Error("useExecutionShell must be used within ExecutionShellProvider")
  return ctx
}

/* ─── Provider ─────────────────────────────────────────────────────────── */
export function ExecutionShellProvider({ children }: { children: ReactNode }) {
  // The console world opens DISCONNECTED — the honest resting state.
  const [mode, setMode] = useState<ConsoleMode>("disconnected")
  // Crown lock toggle. Arms a prop/live account to live-ready (sim ignores).
  const [liveUnlocked, setLiveUnlocked] = useState(false)
  // FULL resolved account + budget, lifted so the draft engine sizes against
  // real capital.
  const [resolved, setResolved] = useState<{
    account: ConsoleAccount | null
    budget:  RiskBudget | null
    liveEnabled: boolean
  }>({ account: null, budget: null, liveEnabled: false })

  const onToggleLock = useCallback(() => setLiveUnlocked(v => !v), [])

  // The rail registers a handler that pins itself open + scrolls to the ticket;
  // the bottom bar calls requestPinConsole() to trigger it.
  const [pinHandler, setPinHandler] = useState<(() => void) | null>(null)
  const registerPinHandler = useCallback((fn: (() => void) | null) => setPinHandler(() => fn), [])
  const requestPinConsole = useCallback(() => { pinHandler?.() }, [pinHandler])

  const value = useMemo<ExecutionShellValue>(() => ({
    mode, liveUnlocked, onToggleLock, requestPinConsole, registerPinHandler,
  }), [mode, liveUnlocked, onToggleLock, requestPinConsole, registerPinHandler])

  return (
    <AccountProvider
      liveUnlocked={liveUnlocked}
      onModeChange={setMode}
      onResolved={setResolved}
    >
      <TradeDraftProvider
        account={resolved.account}
        budget={resolved.budget}
        mode={mode}
        liveUnlocked={resolved.liveEnabled}
      >
        <ExecutionShellContext.Provider value={value}>
          {children}
        </ExecutionShellContext.Provider>
      </TradeDraftProvider>
    </AccountProvider>
  )
}
