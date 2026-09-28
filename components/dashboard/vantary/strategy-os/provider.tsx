"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS · PROVIDER + HOOK MODULE   (EPIC A · MILESTONES A6 + A8)
 *  ─────────────────────────────────────────────────────────────────────────
 *  This file is the *nervous system* of the Strategy OS. It owns all UI
 *  state, exposes a single `useStrategyOs()` hook to every leaf, binds the
 *  abstract `OS_TONE` keys to concrete VANTARY palette hex values, and
 *  re-derives the heavy `OsDerived` slice (mirror, breaches, posture,
 *  archetype, context-line) every time a state mutation could possibly
 *  affect it.
 *
 *  Why a reducer + context (not a single useState, not Zustand, not Jotai)?
 *  ────────────────────────────────────────────────────────────────────────
 *  • The OS is going to be touched by ~30 leaf components across 4 INTEL
 *    slabs, 4 nerve cards, the discipline ring, the tab strip, the plan
 *    navigator, the rule picker, the violation log, and the OS-context
 *    line on the RIGHT card. With useState that's a prop-drilling
 *    nightmare.
 *  • Many actions need to mutate *several* slices atomically — e.g.
 *    `JUMP_TO_RULE` opens RULES tab, expands the rule, sets `flashRuleId`
 *    to the rule for 1.4s, *and* opens the section if it was collapsed.
 *    Reducers handle multi-slice atomic transitions cleanly.
 *  • Every plan switch must re-run `applyPlanOverrides` + `deriveOsState`.
 *    Centralising that in the reducer guarantees no consumer can ever
 *    forget to re-derive.
 *  • External integrations are stateless, the OS is local. No need for
 *    a third-party store with serialisation overhead.
 *
 *  The provider also exposes:
 *  ────────────────────────────────────────────────────────────────────────
 *    state          — full OsState (read-only, frozen by React)
 *    actions        — every dispatch helper, pre-bound (no manual dispatch)
 *    selectors      — derived booleans/lookups (isSectionOpen, getRule…)
 *    tone(key)      — abstract OS_TONE → concrete VANTARY hex
 *    palette        — the VANTARY palette object (so leaves don't import twice)
 *    EASE / motion  — single source of truth for animation timing
 *
 *  SSR / hydration safety
 *  ────────────────────────────────────────────────────────────────────────
 *  This file is `"use client"` because it uses `useReducer` + `useEffect`.
 *  The reducer initialiser is pure and deterministic, so the first render
 *  on the server matches the first render on the client (no hydration
 *  warnings).
 *
 *  Memoisation
 *  ────────────────────────────────────────────────────────────────────────
 *  `useStrategyOs()` returns a single object built once per dispatch via
 *  `useMemo`. Action creators are memoised in `useCallback` so leaves can
 *  pass them straight to `onClick={actions.selectTab}` without spurious
 *  re-renders. Heavy derivations live inside the reducer (computed once on
 *  state-change, cached in `state.derived`), so leaf re-renders never
 *  trigger them.
 * ═══════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react"
import { VANTARY } from "../vantary-theme"
import {
  /* fixtures */
  DEMO_RULES,
  DEMO_STRATEGY_DATA,
  DEMO_WEEK_CAPITAL,
  OS_PLAN_VARIANTS,
  /* tokens + thresholds */
  OS_TONE,
  OS_TABS_ORDER,
  OS_BREACH_THRESHOLD,
  /* types */
  type CapitalOfWeek,
  type OsPlanKey,
  type OsPlanVariant,
  type OsSectionId,
  type OsState,
  type OsTabKey,
  type OsToneKey,
  type RuleCommitment,
  type StrategyData,
} from "./data"
import {
  applyPlanOverrides,
  buildInitialOsState,
  deriveOsState,
} from "./derive"

/* ═══════════════════════════════════════════════════════════════════════════
 *  1.  ACTIONS  ·  the entire mutation surface
 *  ─────────────────────────────────────────────────────────────────────────
 *  Every state change goes through one of these actions. New actions must
 *  be added here AND handled in the reducer below — TypeScript enforces
 *  exhaustiveness via the `never` default branch.
 * ═══════════════════════════════════════════════════════════════════════ */
type OsAction =
  /* tab + section navigation */
  | { type: "SELECT_TAB"; tab: OsTabKey }
  | { type: "TOGGLE_SECTION"; section: OsSectionId }
  | { type: "OPEN_SECTION"; section: OsSectionId }
  | { type: "CLOSE_SECTION"; section: OsSectionId }
  | { type: "OPEN_ALL_SECTIONS" }
  | { type: "CLOSE_ALL_SECTIONS" }

  /* day-of-week selection · bidirectional sync with the LEFT-card week grid */
  | { type: "SELECT_DOW"; dow: number | null }

  /* rule expansion · the "click a rule, see its deep dive" interaction */
  | { type: "EXPAND_RULE"; ruleId: string | null }
  | { type: "TOGGLE_RULE"; ruleId: string }

  /* compound macro-actions · multi-slice atomic transitions */
  | { type: "JUMP_TO_RULE"; ruleId: string }
  | { type: "JUMP_TO_DAY"; dow: number }
  | { type: "JUMP_TO_BREACHES" }

  /* lenses + overlays */
  | { type: "TOGGLE_LENS_WEEK_CAPITAL" }
  | { type: "SET_LENS_WEEK_CAPITAL"; on: boolean }

  /* picker + flash transient effects */
  | { type: "OPEN_PICKER" }
  | { type: "CLOSE_PICKER" }
  | { type: "TOGGLE_PICKER" }
  | { type: "FLASH_RULE"; ruleId: string | null }

  /* plan navigation · cycles through OPTIMAL / ACTIVE / ALERT */
  | { type: "PREV_PLAN" }
  | { type: "NEXT_PLAN" }
  | { type: "SET_PLAN"; planKey: OsPlanKey }

  /* rule mutation · used by the picker & the inline "remove rule" affordance */
  | { type: "ADD_RULE"; rule: RuleCommitment }
  | { type: "REMOVE_RULE"; ruleId: string }
  | { type: "REPLACE_RULES"; rules: RuleCommitment[] }

  /* utility */
  | { type: "RESET" }

/* ═══════════════════════════════════════════════════════════════════════════
 *  2.  REDUCER  ·  pure state-transition function
 *  ─────────────────────────────────────────────────────────────────────────
 *  Three responsibilities only:
 *    a)  apply the literal slice change
 *    b)  re-run `deriveOsState` whenever the inputs to derivation change
 *        (rules, data, capital, plan)
 *    c)  encode multi-slice atomic transitions for compound actions
 *
 *  The reducer NEVER reads from React state, NEVER touches the DOM, and
 *  NEVER triggers side effects. Side effects (timers for flash, focus
 *  management, analytics) live in `useStrategyOs()`.
 * ═══════════════════════════════════════════════════════════════════════ */
function reduce(state: OsState, action: OsAction): OsState {
  switch (action.type) {
    /* ── tab / section ─────────────────────────────────────────────── */
    case "SELECT_TAB":
      if (state.selectedTab === action.tab) return state
      return { ...state, selectedTab: action.tab }

    case "TOGGLE_SECTION": {
      const next = new Set(state.openSections)
      if (next.has(action.section)) next.delete(action.section)
      else next.add(action.section)
      return { ...state, openSections: next }
    }
    case "OPEN_SECTION": {
      if (state.openSections.has(action.section)) return state
      const next = new Set(state.openSections)
      next.add(action.section)
      return { ...state, openSections: next }
    }
    case "CLOSE_SECTION": {
      if (!state.openSections.has(action.section)) return state
      const next = new Set(state.openSections)
      next.delete(action.section)
      return { ...state, openSections: next }
    }
    case "OPEN_ALL_SECTIONS":
      return {
        ...state,
        openSections: new Set([
          "section-mirror",
          "section-rules",
          "section-exposure",
          "section-dna",
        ]),
      }
    case "CLOSE_ALL_SECTIONS":
      return { ...state, openSections: new Set() }

    /* ── day-of-week ───────────────────────────────────────────────── */
    case "SELECT_DOW":
      if (state.selectedDow === action.dow) return state
      return { ...state, selectedDow: action.dow }

    /* ── rule expansion ────────────────────────────────────────────── */
    case "EXPAND_RULE":
      if (state.expandedRuleId === action.ruleId) return state
      return { ...state, expandedRuleId: action.ruleId }
    case "TOGGLE_RULE":
      return {
        ...state,
        expandedRuleId:
          state.expandedRuleId === action.ruleId ? null : action.ruleId,
      }

    /* ── compound jumps ────────────────────────────────────────────── */
    case "JUMP_TO_RULE": {
      const next = new Set(state.openSections)
      next.add("section-rules")
      return {
        ...state,
        selectedTab: "rules",
        openSections: next,
        expandedRuleId: action.ruleId,
        flashRuleId: action.ruleId,
      }
    }
    case "JUMP_TO_DAY": {
      const next = new Set(state.openSections)
      next.add("section-mirror")
      return {
        ...state,
        selectedTab: "mirror",
        openSections: next,
        selectedDow: action.dow,
      }
    }
    case "JUMP_TO_BREACHES": {
      // Jump to RULES, expand the first breached rule, flash it.
      const firstBreached = state.derived.breachedRuleIds[0] ?? null
      const next = new Set(state.openSections)
      next.add("section-rules")
      return {
        ...state,
        selectedTab: "rules",
        openSections: next,
        expandedRuleId: firstBreached,
        flashRuleId: firstBreached,
      }
    }

    /* ── lenses ────────────────────────────────────────────────────── */
    case "TOGGLE_LENS_WEEK_CAPITAL":
      return { ...state, lensWeekCapital: !state.lensWeekCapital }
    case "SET_LENS_WEEK_CAPITAL":
      if (state.lensWeekCapital === action.on) return state
      return { ...state, lensWeekCapital: action.on }

    /* ── picker + flash ────────────────────────────────────────────── */
    case "OPEN_PICKER":
      return state.pickerOpen ? state : { ...state, pickerOpen: true }
    case "CLOSE_PICKER":
      return state.pickerOpen ? { ...state, pickerOpen: false } : state
    case "TOGGLE_PICKER":
      return { ...state, pickerOpen: !state.pickerOpen }
    case "FLASH_RULE":
      if (state.flashRuleId === action.ruleId) return state
      return { ...state, flashRuleId: action.ruleId }

    /* ── plan navigation · re-derives ──────────────────────────────── */
    case "PREV_PLAN":
    case "NEXT_PLAN":
    case "SET_PLAN": {
      let nextIndex = state.planIndex
      if (action.type === "PREV_PLAN") {
        nextIndex = (state.planIndex - 1 + state.planTotal) % state.planTotal
      } else if (action.type === "NEXT_PLAN") {
        nextIndex = (state.planIndex + 1) % state.planTotal
      } else {
        nextIndex = Math.max(
          0,
          state.plans.findIndex((p) => p.key === action.planKey),
        )
      }
      const plan       = state.plans[nextIndex] ?? state.plans[0]
      // Re-apply plan overrides on the *original* DEMO rules — not on the
      // already-overridden ones, otherwise the previous plan's deltas
      // would compound. We ship the original fixtures via `state.plans`
      // and re-derive from `DEMO_RULES`.
      const baseRules  = DEMO_RULES
      const planRules  = applyPlanOverrides(baseRules, plan)
      return {
        ...state,
        planKey:   plan.key,
        planIndex: nextIndex,
        rules:     planRules,
        derived:   deriveOsState({
          rules:       planRules,
          data:        state.data,
          capital:     state.capital,
          planVerdict: plan.verdict,
        }),
      }
    }

    /* ── rule mutation · re-derives ─────────────────────────────────── */
    case "ADD_RULE": {
      const nextRules = [...state.rules, action.rule]
      return {
        ...state,
        rules: nextRules,
        derived: deriveOsState({
          rules:   nextRules,
          data:    state.data,
          capital: state.capital,
          planVerdict: state.plans[state.planIndex]?.verdict,
        }),
      }
    }
    case "REMOVE_RULE": {
      const nextRules = state.rules.filter((r) => r.id !== action.ruleId)
      return {
        ...state,
        rules: nextRules,
        // If the removed rule was expanded, collapse.
        expandedRuleId:
          state.expandedRuleId === action.ruleId ? null : state.expandedRuleId,
        derived: deriveOsState({
          rules:   nextRules,
          data:    state.data,
          capital: state.capital,
          planVerdict: state.plans[state.planIndex]?.verdict,
        }),
      }
    }
    case "REPLACE_RULES": {
      return {
        ...state,
        rules: action.rules,
        derived: deriveOsState({
          rules:   action.rules,
          data:    state.data,
          capital: state.capital,
          planVerdict: state.plans[state.planIndex]?.verdict,
        }),
      }
    }

    /* ── reset ─────────────────────────────────────────────────────── */
    case "RESET":
      return buildInitialOsState({
        rules:   DEMO_RULES,
        data:    DEMO_STRATEGY_DATA,
        capital: DEMO_WEEK_CAPITAL,
        plans:   OS_PLAN_VARIANTS,
        planKey: "optimal",
      })

    default: {
      // Exhaustiveness check — TS error here means a new action type is
      // missing a handler.
      const _exhaustive: never = action
      void _exhaustive
      return state
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  3.  TONE BINDING  ·  abstract OS_TONE keys → concrete VANTARY hex
 *  ─────────────────────────────────────────────────────────────────────────
 *  `OS_TONE` is a *semantic* key map (`discipline`, `optimal`, `alert`…)
 *  whose values are themselves keys of the VANTARY palette object
 *  (`"amber"`, `"paper"`, `"ashSoft"`, `"paperDim"`, `"amberWash"`).
 *
 *  This makes the resolver trivial: `VANTARY[OS_TONE[key]]`. The result
 *  is a CSS `var(--vt-..)` reference, so it auto-themes when the
 *  <VantaryThemeProvider/> swaps palettes.
 *
 *  We expose the bound map two ways:
 *
 *    tone(key)   →  imperative resolver   (`tone("optimal")`)
 *    toneMap     →  full record          (`toneMap.optimal`)
 *
 *  Both share the same memoised backing object so identity-stable refs
 *  flow into leaf style props without re-renders.
 * ═══════════════════════════════════════════════════════════════════════ */
export type OsToneMap = Readonly<Record<OsToneKey, string>>

function buildToneMap(): OsToneMap {
  // Derived directly from OS_TONE: each value is a literal key on
  // VANTARY, so the lookup is type-safe at runtime. We cast through
  // `Record<string, string>` because `VANTARY` is a `const` object
  // and TS can't narrow the dynamic key without a generic helper.
  const v = VANTARY as unknown as Record<string, string>
  const out = {} as Record<OsToneKey, string>
  for (const key of Object.keys(OS_TONE) as OsToneKey[]) {
    const palettePointer = OS_TONE[key] as string
    out[key] = v[palettePointer] ?? VANTARY.paper
  }
  return out
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  4.  CONTEXT VALUE  ·  what the hook returns
 *  ─────────────────────────────────────────────────────────────────────────
 *  Designed so 90% of leaf components destructure exactly one or two
 *  things — never the entire context. Common patterns:
 *
 *    const { state }      = useStrategyOs()                 // read-only leaf
 *    const { actions }    = useStrategyOs()                 // a button
 *    const { tone }       = useStrategyOs()                 // colour resolution
 *    const rule = useStrategyOs().selectors.getRule(id)     // single rule
 *
 *  We expose `palette` separately from `tone()` — `tone()` is for
 *  semantic mapping, `palette` is for raw VANTARY hexes a leaf may need
 *  for tracks, washes, rule lines, etc.
 * ═══════════════════════════════════════════════════════════════════════ */
export interface OsActions {
  /* navigation */
  selectTab:        (tab: OsTabKey) => void
  selectDow:        (dow: number | null) => void
  toggleSection:    (section: OsSectionId) => void
  openSection:      (section: OsSectionId) => void
  closeSection:     (section: OsSectionId) => void
  openAllSections:  () => void
  closeAllSections: () => void
  /* rules */
  expandRule:       (ruleId: string | null) => void
  toggleRule:       (ruleId: string) => void
  jumpToRule:       (ruleId: string) => void
  jumpToDay:        (dow: number) => void
  jumpToBreaches:   () => void
  flashRule:        (ruleId: string | null) => void
  addRule:          (rule: RuleCommitment) => void
  removeRule:       (ruleId: string) => void
  replaceRules:     (rules: RuleCommitment[]) => void
  /* lenses */
  toggleLensWeekCapital: () => void
  setLensWeekCapital:    (on: boolean) => void
  /* picker */
  openPicker:   () => void
  closePicker:  () => void
  togglePicker: () => void
  /* plan */
  prevPlan: () => void
  nextPlan: () => void
  setPlan:  (planKey: OsPlanKey) => void
  /* utility */
  reset: () => void
}

export interface OsSelectors {
  /** Whether a section's collapsible body is currently expanded. */
  isSectionOpen: (section: OsSectionId) => boolean
  /** Whether a rule's deep-dive is currently expanded inline. */
  isRuleExpanded: (ruleId: string) => boolean
  /** Whether a rule should currently flash (recently jumped-to). */
  isRuleFlashing: (ruleId: string) => boolean
  /** Lookup a rule by id, or undefined if missing. */
  getRule: (ruleId: string) => RuleCommitment | undefined
  /** Per-day (dow 0..6) overall adherence as a 0..1 fraction, drawn from
   *  `mirror.weeklyAdherence`. Fed straight into ribbon-cell heat. */
  adherenceOnDay: (dow: number) => number
  /** Whether the dow's adherence dipped below the breach threshold —
   *  drives the breach pip in the Mirror ribbon. */
  isDowBreach: (dow: number) => boolean
  /** Whether a given dow is the currently selected one. */
  isDowSelected: (dow: number | null | undefined) => boolean
}

export interface OsContextValue {
  state:    OsState
  actions:  OsActions
  selectors: OsSelectors
  /** Resolve an abstract OS_TONE key (e.g. "discipline") to a VANTARY hex. */
  tone:     (key: OsToneKey) => string
  /** Full bound tone map (object form, useful for spreading). */
  toneMap:  OsToneMap
  /** Raw VANTARY palette — use for hairlines, washes, deep colours. */
  palette:  typeof VANTARY
  /** Tabs in display order — pass straight to <button> map calls. */
  tabs:     typeof OS_TABS_ORDER
  /** Animation easing tuple shared with the rest of VANTARY. */
  ease:     readonly [number, number, number, number]
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  5.  THE CONTEXT  ·  one symbol, never re-created
 * ═══════════════════════════════════════════════════════════════════════ */
const StrategyOsContext = React.createContext<OsContextValue | null>(null)
StrategyOsContext.displayName = "StrategyOsContext"

/* ═══════════════════════════════════════════════════════════════════════════
 *  6.  PROVIDER  ·  what mounts the OS into the tree
 *  ─────────────────────────────────────────────────────────────────────────
 *  Props
 *    initialPlan      Which plan variant to mount with (default "optimal")
 *    rules / data /
 *    capital / plans  Optional overrides — useful for storybook / tests
 *    flashDurationMs  How long FLASH_RULE highlights stay before fading
 *
 *  The provider also runs the *only* side-effect in this file: when a
 *  flash is dispatched, it auto-clears after `flashDurationMs`.
 * ═══════════════════════════════════════════════════════════════════════ */
export interface StrategyOsProviderProps {
  children: React.ReactNode
  initialPlan?:     OsPlanKey
  rules?:           RuleCommitment[]
  data?:            StrategyData
  capital?:         CapitalOfWeek
  plans?:           OsPlanVariant[]
  /** ms before a flashRuleId clears itself · default 1400 */
  flashDurationMs?: number
}

export function StrategyOsProvider({
  children,
  initialPlan     = "optimal",
  rules           = DEMO_RULES,
  data            = DEMO_STRATEGY_DATA,
  capital         = DEMO_WEEK_CAPITAL,
  plans           = OS_PLAN_VARIANTS,
  flashDurationMs = 1400,
}: StrategyOsProviderProps) {
  /* ── reducer mount ─────────────────────────────────────────────── */
  const [state, dispatch] = useReducer(
    reduce,
    null as unknown as OsState,
    /* lazy initialiser — runs once on mount */
    () =>
      buildInitialOsState({
        rules,
        data,
        capital,
        plans,
        planKey: initialPlan,
      }),
  )

  /* ── flash auto-clear ──────────────────────────────────────────── */
  // When a rule is flashed (programmatic jump), automatically clear the
  // flash after `flashDurationMs` so the highlight fades. We use a ref
  // so back-to-back flashes don't stack timers.
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!state.flashRuleId) return
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    flashTimerRef.current = setTimeout(() => {
      dispatch({ type: "FLASH_RULE", ruleId: null })
    }, flashDurationMs)
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    }
  }, [state.flashRuleId, flashDurationMs])

  /* ── action creators ───────────────────────────────────────────── */
  // Each one wrapped in useCallback so leaves can pass them straight to
  // event handlers without re-rendering on every state change.
  const actions = useMemo<OsActions>(
    () => ({
      selectTab:           (tab)     => dispatch({ type: "SELECT_TAB", tab }),
      selectDow:           (dow)     => dispatch({ type: "SELECT_DOW", dow }),
      toggleSection:       (section) => dispatch({ type: "TOGGLE_SECTION", section }),
      openSection:         (section) => dispatch({ type: "OPEN_SECTION", section }),
      closeSection:        (section) => dispatch({ type: "CLOSE_SECTION", section }),
      openAllSections:     ()        => dispatch({ type: "OPEN_ALL_SECTIONS" }),
      closeAllSections:    ()        => dispatch({ type: "CLOSE_ALL_SECTIONS" }),
      expandRule:          (ruleId)  => dispatch({ type: "EXPAND_RULE", ruleId }),
      toggleRule:          (ruleId)  => dispatch({ type: "TOGGLE_RULE", ruleId }),
      jumpToRule:          (ruleId)  => dispatch({ type: "JUMP_TO_RULE", ruleId }),
      jumpToDay:           (dow)     => dispatch({ type: "JUMP_TO_DAY", dow }),
      jumpToBreaches:      ()        => dispatch({ type: "JUMP_TO_BREACHES" }),
      flashRule:           (ruleId)  => dispatch({ type: "FLASH_RULE", ruleId }),
      addRule:             (rule)    => dispatch({ type: "ADD_RULE", rule }),
      removeRule:          (ruleId)  => dispatch({ type: "REMOVE_RULE", ruleId }),
      replaceRules:        (rules)   => dispatch({ type: "REPLACE_RULES", rules }),
      toggleLensWeekCapital: ()      => dispatch({ type: "TOGGLE_LENS_WEEK_CAPITAL" }),
      setLensWeekCapital:  (on)      => dispatch({ type: "SET_LENS_WEEK_CAPITAL", on }),
      openPicker:          ()        => dispatch({ type: "OPEN_PICKER" }),
      closePicker:         ()        => dispatch({ type: "CLOSE_PICKER" }),
      togglePicker:        ()        => dispatch({ type: "TOGGLE_PICKER" }),
      prevPlan:            ()        => dispatch({ type: "PREV_PLAN" }),
      nextPlan:            ()        => dispatch({ type: "NEXT_PLAN" }),
      setPlan:             (planKey) => dispatch({ type: "SET_PLAN", planKey }),
      reset:               ()        => dispatch({ type: "RESET" }),
    }),
    [],
  )

  /* ── selectors · derived booleans + lookups ────────────────────── */
  const selectors = useMemo<OsSelectors>(
    () => ({
      isSectionOpen:   (section) => state.openSections.has(section),
      isRuleExpanded:  (ruleId)  => state.expandedRuleId === ruleId,
      isRuleFlashing:  (ruleId)  => state.flashRuleId === ruleId,
      getRule:         (ruleId)  => state.rules.find((r) => r.id === ruleId),
      adherenceOnDay:  (dow)     => state.derived.mirror.weeklyAdherence[dow] ?? 0,
      isDowBreach:     (dow)     =>
        (state.derived.mirror.weeklyAdherence[dow] ?? 1) <
        (OS_BREACH_THRESHOLD / 100),
      isDowSelected:   (dow)     => dow != null && state.selectedDow === dow,
    }),
    [
      state.openSections,
      state.expandedRuleId,
      state.flashRuleId,
      state.rules,
      state.derived.mirror.weeklyAdherence,
      state.selectedDow,
    ],
  )

  /* ── tone binding · stable identity for the lifetime of the provider ─ */
  const toneMap = useMemo<OsToneMap>(() => buildToneMap(), [])
  const tone    = useCallback<OsContextValue["tone"]>(
    (key) => toneMap[key] ?? VANTARY.paper,
    [toneMap],
  )

  /* ── easing tuple · same as the rest of VANTARY's motion language ── */
  const ease = useMemo(() => [0.65, 0, 0.35, 1] as const, [])

  /* ── final value · single object, identity-stable per dispatch ─── */
  const value = useMemo<OsContextValue>(
    () => ({
      state,
      actions,
      selectors,
      tone,
      toneMap,
      palette: VANTARY,
      tabs:    OS_TABS_ORDER,
      ease,
    }),
    [state, actions, selectors, tone, toneMap, ease],
  )

  return (
    <StrategyOsContext.Provider value={value}>
      {children}
    </StrategyOsContext.Provider>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  7.  THE HOOK  ·  the *only* way to read OS state
 *  ─────────────────────────────────────────────────────────────────────────
 *  Throws a clear error if used outside the provider — easier to debug
 *  than silent null-deref crashes deep in a leaf.
 * ═══════════════════════════════════════════════════════════════════════ */
export function useStrategyOs(): OsContextValue {
  const ctx = useContext(StrategyOsContext)
  if (ctx == null) {
    throw new Error(
      "[strategy-os] useStrategyOs() must be called inside <StrategyOsProvider>. " +
        "Wrap your tree with the provider before mounting any OS surface.",
    )
  }
  return ctx
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  8.  CONVENIENCE HOOKS  ·  for hot leaf paths
 *  ─────────────────────────────────────────────────────────────────────────
 *  These exist so the most-called leaves (e.g. a 7-cell mirror ribbon
 *  rendered 7 times per row) don't have to re-destructure the entire
 *  context object on every render.
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * Read just the OS tone-map. Use in leaves that only need colour
 * resolution and never dispatch.
 */
export function useOsTone(): OsToneMap {
  return useStrategyOs().toneMap
}

/**
 * Read just the OS palette. Use in leaves that bind to raw VANTARY hex
 * (hairline borders, washes, etc.) and never dispatch.
 */
export function useOsPalette(): typeof VANTARY {
  return useStrategyOs().palette
}

/**
 * Read just the actions. Use in pure dispatch buttons.
 */
export function useOsActions(): OsActions {
  return useStrategyOs().actions
}

/**
 * Read a single rule by id. Returns undefined if the rule doesn't
 * exist (e.g. mid-removal). Memoised through the selectors object.
 */
export function useOsRule(ruleId: string | null | undefined): RuleCommitment | undefined {
  const { selectors } = useStrategyOs()
  if (ruleId == null) return undefined
  return selectors.getRule(ruleId)
}

/**
 * Read the OS-context one-liner (the synthesis line that lives above
 * the RIGHT-card TraderStateFooter). Pulled into its own hook so the
 * RIGHT-card can mount a tiny <span> with no other OS dependency.
 */
export function useOsContextLine(): string {
  return useStrategyOs().state.derived.contextLine
}

/**
 * Read the posture verdict (OPTIMAL / ACTIVE / ALERT). Pulled out so
 * the eyebrow + chip can subscribe to it in isolation.
 */
export function useOsPosture(): OsState["derived"]["posture"] {
  return useStrategyOs().state.derived.posture
}

/**
 * Read just the discipline score for the ring + nerve card. Same
 * memoisation guarantee as the others — only re-renders when the
 * derived score changes.
 */
export function useOsDisciplineScore(): number {
  return useStrategyOs().state.derived.disciplineScore
}
