/* ═══════════════════════════════════════════════════════════════════════════
 *
 *                            ▮  STRATEGY OS  ▮
 *           HOW RULES, CAPITAL, AND DNA FUSE INTO ONE IDENTITY LAYER
 *
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  The Strategy OS is the trader-identity nervous system of the Vantary
 *  Live Equity dashboard. It lives in the LEFT card directly under the
 *  WEEK STATIONS spread and is the editorial answer to one question:
 *
 *      "Given what I committed to, how am I actually trading right now?"
 *
 *  It is composed of THREE substrates that talk to each other in real
 *  time:
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │  1. RULES         · the trader's swore-to commitments               │
 *  │  2. CAPITAL       · where the dollars actually went this week       │
 *  │  3. DNA           · the patterns the execution history reveals      │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  Each substrate lives in its own tab (RULES / EXPOSURE / DNA), and a
 *  fourth tab (MIRROR) renders the discipline ribbon that summarises all
 *  three across the seven days of the current week.
 *
 *  ARCHITECTURE
 *  ─────────────────────────────────────────────────────────────────────
 *
 *      data.ts          ·  Pure types, fixtures (DEMO_RULES,
 *                          ALL_AVAILABLE_RULES, DEMO_WEEK_CAPITAL),
 *                          OS_TONE semantic-token map, thresholds,
 *                          plan variants (OPTIMAL / ACTIVE / ALERT).
 *
 *      derive.ts        ·  Pure functions:
 *                            deriveStrategicMirror   (rules → mirror)
 *                            deriveCapitalOfWeek     (P&L → strata)
 *                            derivePosture           (score → grade)
 *                            deriveContextLine       (state → prose)
 *                            deriveOsState           (everything → OsState)
 *
 *      provider.tsx     ·  React surface:
 *                            <StrategyOsProvider/>   (context root)
 *                            useStrategyOs()         (full state + actions)
 *                            useOsTone()/useOsPalette()/useOsActions()/...
 *                            27-action reducer with multi-slice atomic
 *                            transitions (JUMP_TO_RULE, JUMP_TO_DAY, …).
 *
 *      header.tsx       ·  <OsCommandHeader/> — the visible top:
 *                            eyebrow · 82-C DisciplineRing · OPTIMAL chip
 *                            · status sentence · alert triangle · 4 nerve
 *                            cards (DISCIPLINE / COMMITMENTS / USD WEIGHT
 *                            / HYBRID·EXEC PATIENCE) · MIRROR/RULES/
 *                            EXPOSURE/DNA tab strip · PLAN n/n navigator.
 *
 *      intel.tsx        ·  <OsIntelBay/> — the active-tab body container.
 *                            Mounts the deep modules below per the
 *                            selectedTab; also hosts the toolbar (LENS
 *                            toggle · ASK COPILOT · COPY READOUT) and
 *                            the cross-section drilldown ribbon.
 *
 *      mirror.tsx       ·  <DisciplineMirror/> — full-fidelity weekly
 *                            ribbon · INTENDED-vs-ACTUAL band · breach
 *                            markers · hover crumb · best-streak overlay
 *                            · weekly delta caption · bidirectional
 *                            selectedDow sync.
 *
 *      rules.tsx        ·  <RuleCommitments/> — adherence rings · 7-dot
 *                            history · streak/best chips · INVIOLABLE
 *                            tier · in-place expansion (teaching /
 *                            impact-followed / impact-broken / log) ·
 *                            AddRule picker (search + 5 categories +
 *                            30 templates) · prose verdict footer ·
 *                            markdown copy-out.
 *
 *      exposure.tsx     ·  <CapitalExposureMap/> — dominant currency
 *                            chip · correlation-risk badge · three
 *                            strata (SYMBOL / SESSION / DAY) with
 *                            hover-to-isolate · suggestion engine ·
 *                            net-USD-exposure pill · R-per-killzone ·
 *                            week-grid mirror beneath.
 *
 *      dna.tsx          ·  <ExecutionDnaProfile/> — archetype banner ·
 *                            entry-mix hairline · patience tier ladder
 *                            (REACTOR → HYBRID → SNIPER) · current-
 *                            position pip · impatience-cost ledger ·
 *                            axis micrometers · evolution arc · next-
 *                            tier requirement · verdict footer.
 *
 *      sync.tsx         ·  <OsDaySync/> — invisible bridge between
 *                            <DaySelectionProvider> and the OS state's
 *                            selectedDow, with echo suppression so a
 *                            click on a week-station tile lights the
 *                            Mirror cell and vice-versa.
 *
 *      os-context-line  ·  <OsContextLine/> — single editorial sentence
 *                            shown on the RIGHT card just above
 *                            <TraderStateFooter/>; distils the OS into
 *                            "the why" before the trader reads "the what".
 *
 *  WIRING POINTS IN your-space.tsx
 *  ─────────────────────────────────────────────────────────────────────
 *
 *      <StrategyOsProvider initialPlan="optimal">
 *        <OsDaySync />                            ← bridge (invisible)
 *        ...
 *        <YourSpaceContent>
 *          ...left card...
 *          <OsCommandHeader />                    ← header
 *          <OsIntelBay />                         ← active tab body
 *          ...right card...
 *          <OsContextLine />                      ← above TraderStateFooter
 *          <TraderStateFooter />                  ← verdict
 *        </YourSpaceContent>
 *      </StrategyOsProvider>
 *
 *  THEMING
 *  ─────────────────────────────────────────────────────────────────────
 *
 *  Every coloured surface in the OS resolves through the OS_TONE map in
 *  data.ts. OS_TONE values are themselves keys of the VANTARY palette
 *  (which itself resolves to CSS custom properties). Result: the OS
 *  auto-themes when <VantaryThemeProvider/> swaps palettes, with no
 *  hard-coded colors anywhere in the rendering tree.
 *
 *  KEYBOARD MAP
 *  ─────────────────────────────────────────────────────────────────────
 *
 *      1-4              Jump to MIRROR / RULES / EXPOSURE / DNA tabs
 *      M / R / E / D    First-letter shortcuts (same as 1-4)
 *      ←  / →           Page through PLAN variants (OPTIMAL / ACTIVE / ALERT)
 *      ?                Open guide drawer
 *      ESC              Close any open expansion / picker
 *
 *  PERFORMANCE NOTES
 *  ─────────────────────────────────────────────────────────────────────
 *
 *      · All derived state lives in `state.derived` and is recomputed
 *        atomically in the reducer's `_recompute` helper; leaves never
 *        re-derive in render.
 *      · All leaf modules are wrapped in React.memo; selectors are
 *        wrapped in useMemo with explicit dep arrays.
 *      · The Mirror ribbon and Exposure strata gate their heavy SVGs
 *        with IntersectionObserver — they don't paint until they're in
 *        the viewport.
 *      · framer-motion's useReducedMotion() short-circuits every
 *        animated path so the OS reads as a static editorial spread for
 *        users with motion-reduction preferences.
 *
 * ═══════════════════════════════════════════════════════════════════════ */

export {
  /* — context + hooks — */
  StrategyOsProvider,
  useStrategyOs,
  useOsTone,
  useOsPalette,
  useOsActions,
  useOsRule,
  useOsContextLine,
  useOsPosture,
  useOsDisciplineScore,
} from "./provider"

export type { OsContextValue, OsToneMap, OsSelectors, OsActions } from "./provider"

/* — pure types (consumers may import these to type their leaves) — */
export type {
  RuleCommitment,
  RuleCategory,
  RuleTemplate,
  StrategicMirrorState,
  CapitalSlice,
  CapitalOfWeek,
  OsState,
  OsDerived,
  OsTabKey,
  OsSectionId,
  OsToneKey,
  OsPlanVariant,
} from "./data"

/* — surface modules (mount these in your tree) — */
export { OsCommandHeader }      from "./header"
export { OsIntelBay }           from "./intel"
export { DisciplineMirror }     from "./mirror"
export { RuleCommitments }      from "./rules"
export { CapitalExposureMap }   from "./exposure"
export { ExecutionDnaProfile }  from "./dna"
export { OsDaySync }            from "./sync"
export { OsContextLine }        from "./os-context-line"
