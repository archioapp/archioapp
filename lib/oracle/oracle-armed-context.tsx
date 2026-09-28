"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ORACLE ARMED CONTEXT · the spine for the ARCHIO Halo Bar
   ───────────────────────────────────────────────────────────────────────────
   When the trader engages the Oracle's halo bar, three things must
   happen across distant subtrees:

     1.  The bar itself enters its "armed" state — the radial halo
         intensifies, the placeholder freezes, the input is focused.
     2.  The Flight Deck Cockpit (Market Floor / Studio / Mentor Hall /
         Collective) swaps every room's destination list for a
         per-room AI-suggestion list. The room headers stay (so the
         categorical scaffolding is preserved) but each row now reads
         as a prompt the AI can answer.
     3.  Anywhere in the dashboard can fire `submit(query)` to commit
         the prompt, letting the existing VantaryOracle pipeline route
         it through the Universal Template Engine.

   Without a context spine, these three concerns would have to drill
   props through 30+ components or worse, share state via a module-
   level singleton. The context isolates the entire choreography to a
   tiny, well-typed surface that any subtree can subscribe to.

   ───────────────────────────────────────────────────────────────────────────
   API contract:
     armed             boolean   — whether the halo bar is open / engaged
     setArmed(b)                 — toggle the armed state
     query             string    — the live input value
     setQuery(s)                 — update the input value
     submit(q)                   — commit a prompt (typed or suggested)
     placeholder       string    — the currently displayed dynamic prompt

   Defaults are a no-op safety harness so the cockpit renders correctly
   when no provider is mounted (e.g. inside design-system previews).
   ═══════════════════════════════════════════════════════════════════════════ */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

export interface OracleArmedContextValue {
  /** Whether the halo bar is engaged. Drives the cockpit's destination swap. */
  armed: boolean
  /** Manually toggle armed state (e.g. ESC closes, focus opens). */
  setArmed: (next: boolean) => void
  /** Live input value. Bound to the halo bar's <input/>. */
  query: string
  /** Update the input value. */
  setQuery: (next: string) => void
  /** Commit a prompt — typed, suggested, or otherwise. */
  submit: (query: string) => void
  /**
   * VantaryOracle (or any other host owning the answer pipeline) calls
   * this in an effect to register its submit handler. The Halo Bar's
   * `submit` then routes to whichever handler was most recently
   * registered. Returns an unregister cleanup function.
   */
  registerSubmit: (handler: (q: string) => void) => () => void
  /** The currently displayed dynamic placeholder prompt. */
  placeholder: string
}

const NOOP_VALUE: OracleArmedContextValue = {
  armed: false,
  setArmed: () => {},
  query: "",
  setQuery: () => {},
  submit: () => {},
  registerSubmit: () => () => {},
  placeholder: "Ask anything",
}

const OracleArmedContext = createContext<OracleArmedContextValue>(NOOP_VALUE)

/**
 * Subscribe to the Oracle's armed state. Safe to call without a provider;
 * returns the no-op singleton in that case.
 */
export function useOracleArmed(): OracleArmedContextValue {
  return useContext(OracleArmedContext)
}

/**
 * The provider wires the three concerns described in the file header.
 *
 * The host (typically `<JarvisWelcomeBand/>`) mounts this and exposes
 * `registerSubmit` so a downstream `<VantaryOracle/>` can plug its own
 * submit pipeline in. The Halo Bar / suggestion clicks then route to
 * whatever the most recently registered handler is. When nothing has
 * registered yet, `submit` is a silent no-op.
 */
export function OracleArmedProvider({
  children,
  placeholder,
}: {
  children: ReactNode
  /** The currently displayed dynamic placeholder text. */
  placeholder: string
}) {
  const [armed, setArmed] = useState(false)
  const [query, setQuery] = useState("")

  /* `handlerRef` is a mutable holder so swapping the registered handler
     doesn't trigger a re-render — the Halo Bar's `submit` reference can
     stay stable across renders. */
  const handlerRef = useRef<(q: string) => void>(() => {})

  const registerSubmit = useCallback(
    (handler: (q: string) => void) => {
      handlerRef.current = handler
      return () => {
        if (handlerRef.current === handler) {
          handlerRef.current = () => {}
        }
      }
    },
    [],
  )

  const submit = useCallback(
    (q: string) => {
      const trimmed = q.trim()
      if (!trimmed) return
      handlerRef.current(trimmed)
    },
    [],
  )

  const value = useMemo<OracleArmedContextValue>(
    () => ({
      armed,
      setArmed,
      query,
      setQuery,
      submit,
      registerSubmit,
      placeholder,
    }),
    [armed, query, submit, registerSubmit, placeholder],
  )

  return (
    <OracleArmedContext.Provider value={value}>
      {children}
    </OracleArmedContext.Provider>
  )
}
