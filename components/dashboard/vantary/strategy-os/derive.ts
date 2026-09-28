/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS · DERIVE MODULE  (EPIC A · FOUNDATION)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Pure functions that turn the fixtures in `data.ts` into the runtime
 *  state every UI sub-component reads from. There is NO React in here, no
 *  hooks, no JSX — every function is a deterministic data → data mapping
 *  so it can be unit-tested in isolation, used inside reducers, and run
 *  cheaply during memoization.
 *
 *  ENTRY POINTS
 *  ─────────────────────────────────────────────────────────────────────
 *  · deriveStrategicMirror(data, rules)         — port of the source
 *  · deriveCapitalOfWeek(weekDays, weekCapital) — fuses week-grid into OS
 *  · derivePosture(disciplineScore)             — OPTIMAL / ACTIVE / ALERT
 *  · deriveContextLine(state)                   — RIGHT-card synthesis line
 *  · deriveBreachedRules(rules, threshold)      — for the alert badge
 *  · deriveInviolableRules(rules)               — for the "INVIOLABLE" tier
 *  · deriveArchetype(limitRatio)                — REACTOR / HYBRID / SNIPER
 *  · deriveOsState(input)                       — the top-level bundle
 *  · resolveOsTone(toneKey, theme)              — token resolver helper
 *  · applyPlanOverrides(rules, plan)            — for the plan navigator
 *
 *  All functions are exported so they can also be reached from tests, the
 *  guide drawer, and any future server-side renderer that wants to compute
 *  OS state during SSR.
 * ═══════════════════════════════════════════════════════════════════════ */

import type {
  RuleCommitment,
  StrategyData,
  StrategicMirrorState,
  CapitalOfWeek,
  OsPlanVariant,
  OsState,
  OsDerived,
  OsToneKey,
} from "./data"

import {
  OS_BREACH_THRESHOLD,
  OS_INVIOLABLE_THRESHOLD,
  OS_POSTURE_THRESHOLDS,
  OS_USD_WEIGHT_RED_DOT,
} from "./data"

/* ─────────────────────────────────────────────────────────────────────────
   1.  deriveStrategicMirror  ·  ported from the source verbatim
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Computes the StrategicMirrorState from raw StrategyData + a set of rules.
 *
 * Behavioural identical to the source `deriveStrategicMirror()` in
 * `components/copilot/analytics/StrategyAnalytics.tsx`. The signature is
 * preserved so the existing terminal Strategy OS could swap to this
 * implementation without code changes — useful for code-mod migration.
 *
 * The deterministic `weeklyAdherence` seed is preserved (sin/cos with
 * day-index + base-discipline) so the same input produces the same 7-day
 * vector across reloads — important because the Mirror INTEL slab renders
 * those bars and we don't want them to twitch between page mounts.
 */
export function deriveStrategicMirror(
  data: StrategyData,
  rules: RuleCommitment[],
): StrategicMirrorState {
  /* —— entry mix —— */
  const total      = data.entryMix.reduce((s, e) => s + e.value, 0) || 1
  const limitCount = data.entryMix.find((e) => e.label === "limit")?.value  ?? 0
  const marketCount = data.entryMix.find((e) => e.label === "market")?.value ?? 0
  const limitRatio   = limitCount / total
  const entryQuality = Math.round(limitRatio * 70 + (1 - marketCount / total) * 30)

  /* —— timeframe depth —— */
  const tfTotal = data.timeframes.reduce((s, t) => s + t.value, 0) || 1
  const htfWeight =
    data.timeframes
      .filter((t) => ["H1", "H4", "D1", "W1"].includes(t.label))
      .reduce((s, t) => s + t.value, 0) / tfTotal
  const structureDepth = Math.round(htfWeight * 100)

  /* —— instrument exposure —— */
  const instrTotal = data.instruments.reduce((s, i) => s + i.count, 0) || 1
  const currencyMap: Record<string, number> = {}
  data.instruments.forEach((inst) => {
    const base  = inst.symbol.slice(0, 3)
    const quote = inst.symbol.slice(3, 6)
    if (base)  currencyMap[base]  = (currencyMap[base]  ?? 0) + inst.count
    if (quote) currencyMap[quote] = (currencyMap[quote] ?? 0) + inst.count
  })
  const sorted = Object.entries(currencyMap).sort((a, b) => b[1] - a[1])
  const dominantCurrency = sorted[0]?.[0] ?? "N/A"
  const dominantPct = Math.round(((sorted[0]?.[1] ?? 0) / (instrTotal * 2)) * 100)
  const exposureConcentration = Math.round(((data.instruments[0]?.count ?? 0) / instrTotal) * 100)

  /* —— correlation risk (simple EUR-pair heuristic, identical to source) —— */
  const eurPairs   = data.instruments.filter((i) => i.symbol.includes("EUR"))
  const eurWeight  = eurPairs.reduce((s, i) => s + i.count, 0) / instrTotal
  const correlationRisk = eurWeight >= 0.5

  /* —— overall discipline ÷ rules —— */
  const overallDiscipline = Math.round(
    rules.reduce((s, r) => s + r.adherence, 0) / (rules.length || 1),
  )

  /* —— composite risk grade —— */
  const riskScore =
    entryQuality       * 0.3 +
    structureDepth     * 0.2 +
    overallDiscipline  * 0.3 +
    (correlationRisk ? 0 : 20) * 0.2
  const riskGrade =
    riskScore >= 70 ? ("A" as const) :
    riskScore >= 50 ? ("B" as const) :
    riskScore >= 30 ? ("C" as const) :
                       ("D" as const)

  /* —— deterministic 7-day adherence vector —— */
  const weeklyAdherence = Array.from({ length: 7 }, (_, i) => {
    const base = overallDiscipline
    const variation =
      Math.sin(i * 1.2 + base * 0.10) * 12 +
      Math.cos(i * 2.7 + base * 0.05) *  5
    return Math.max(30, Math.min(100, Math.round(base + variation)))
  })

  /* —— intent vs action gap (intended is the planned baseline) —— */
  const intended = 85
  const actual   = overallDiscipline

  return {
    overallDiscipline,
    riskGrade,
    entryQuality,
    structureDepth,
    limitRatio,
    exposureConcentration,
    correlationRisk,
    dominantCurrency,
    dominantPct,
    weeklyAdherence,
    intentVsAction: { intended, actual },
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   2.  deriveCapitalOfWeek  ·  fuses LEFT-card week grid into OS exposure
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Optional alignment helper. The DEMO_WEEK_CAPITAL fixture in `data.ts`
 * was hand-tuned to mirror the `WEEK_DAYS` shape inside `your-space.tsx`,
 * but in case future code wants to overwrite the byDay stratum with live
 * P&L from the week grid this function does that re-keying.
 *
 * Pass the existing `WEEK_DAYS` fixture (or any compatible shape) and a
 * baseline CapitalOfWeek snapshot. The byDay stratum will be rebuilt from
 * the absolute P&L share, with everything else preserved.
 */
export function deriveCapitalOfWeek(
  weekDays: ReadonlyArray<{ key: string; lbl: string; pl: number; status?: string }>,
  baseline: CapitalOfWeek,
): CapitalOfWeek {
  const totalAbs = weekDays.reduce((s, d) => s + Math.abs(d.pl), 0) || 1
  const totalNet = weekDays.reduce((s, d) => s + d.pl, 0)

  const byDay = weekDays.map((d) => ({
    id:        `day-${d.key.toLowerCase()}`,
    label:     d.key,
    pct:       Math.abs(d.pl) / totalAbs,
    pl:        d.pl,
    rMultiple: Number((d.pl / 50).toFixed(2)), // back-of-envelope R mapping for fixture
    trades:    d.pl === 0 ? 0 : Math.max(1, Math.round(Math.abs(d.pl) / 40)),
    detail:    d.status === "LIVE"
                  ? `${d.lbl} · LIVE · waiting for LND-KZ`
                  : d.status === "OFF"
                    ? `${d.lbl} · market closed`
                    : `${d.lbl} · ${d.pl > 0 ? "edge held" : d.pl < 0 ? "edge slipped" : "flat"}`,
  }))

  return {
    ...baseline,
    totalPl: totalNet,
    byDay,
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   3.  derivePosture  ·  OPTIMAL / ACTIVE / ALERT chip
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Maps an integer disciplineScore (0..100) to one of three posture chips
 * the screenshot uses. Thresholds live in data.ts so they can be tuned in
 * one place.
 */
export function derivePosture(
  disciplineScore: number,
): "OPTIMAL" | "ACTIVE" | "ALERT" {
  if (disciplineScore >= OS_POSTURE_THRESHOLDS.optimal) return "OPTIMAL"
  if (disciplineScore >= OS_POSTURE_THRESHOLDS.active)  return "ACTIVE"
  return "ALERT"
}

/* ─────────────────────────────────────────────────────────────────────────
   4.  deriveBreachedRules / deriveInviolableRules
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Returns the ids of every rule whose adherence is strictly below the
 * threshold. Used by the alert-triangle counter, the status sentence
 * ("1 rule below threshold..."), and the COMMITMENTS nerve-card red dot.
 */
export function deriveBreachedRules(
  rules: RuleCommitment[],
  threshold: number = OS_BREACH_THRESHOLD,
): string[] {
  return rules.filter((r) => r.adherence < threshold).map((r) => r.id)
}

/**
 * Returns the ids of every rule whose adherence is exactly at the
 * inviolable threshold (100 by default). Used to render the INVIOLABLE
 * tier badge inside the RuleCard header.
 */
export function deriveInviolableRules(
  rules: RuleCommitment[],
  threshold: number = OS_INVIOLABLE_THRESHOLD,
): string[] {
  return rules.filter((r) => r.adherence >= threshold).map((r) => r.id)
}

/* ─────────────────────────────────────────────────────────────────────────
   5.  deriveArchetype  ·  REACTOR / HYBRID / SNIPER from limitRatio
   ─────────────────────────────────────────────────────────────────────── */

/**
 * The 4th nerve-card label. Mirrors the source's "Hybrid Tier" and the
 * existing TRADER_DNA archetype label, so all three modules agree.
 *
 *    limitRatio < 0.30   → REACTOR  (mostly market entries, impulsive)
 *    0.30 ≤ ratio < 0.65 → HYBRID   (balanced, conscious of order type)
 *    ratio ≥ 0.65        → SNIPER   (limit-only patient executor)
 */
export function deriveArchetype(
  limitRatio: number,
): "REACTOR" | "HYBRID" | "SNIPER" {
  if (limitRatio < 0.30) return "REACTOR"
  if (limitRatio < 0.65) return "HYBRID"
  return "SNIPER"
}

/* ─────────────────────────────────────────────────────────────────────────
   6.  deriveContextLine  ·  the 1-line OS-context synthesis
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Builds the single-line synthesis that lives on the RIGHT card directly
 * above `<TraderStateFooter/>`. It compresses the OS posture into one
 * sentence the trader walks away with.
 *
 *   OPTIMAL  →  "Discipline X, edge intact — [N leak | leaks intact]."
 *   ACTIVE   →  "Discipline X, edge thinning — [N leak active | clean week]."
 *   ALERT    →  "Discipline X, edge compromised — close the platform."
 *
 * The plan-variant `verdict` field can override this string when the user
 * is paging through plans manually.
 */
export function deriveContextLine(input: {
  disciplineScore: number
  posture: "OPTIMAL" | "ACTIVE" | "ALERT"
  breachedCount: number
  archetype: "REACTOR" | "HYBRID" | "SNIPER"
  planVerdict?: string
}): string {
  if (input.planVerdict) return input.planVerdict
  const leakClause =
    input.breachedCount === 0 ? "no leaks active" :
    input.breachedCount === 1 ? "1 leak active"   :
                                 `${input.breachedCount} leaks active`
  switch (input.posture) {
    case "OPTIMAL":
      return `Discipline ${input.disciplineScore}, edge intact — ${leakClause}.`
    case "ACTIVE":
      return `Discipline ${input.disciplineScore}, edge thinning — ${leakClause}. Tighten scope.`
    case "ALERT":
      return `Discipline ${input.disciplineScore}, edge compromised — ${leakClause}. Close the platform for 24h.`
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   7.  applyPlanOverrides  ·  paging through OS_PLAN_VARIANTS
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Returns a NEW rules array with the plan variant's `adherenceOverrides`
 * applied per-id. Pure — never mutates input. Rules not referenced in the
 * override map come through unchanged.
 *
 * weeklyHistory is regenerated to reflect the new adherence so the 7-dot
 * row visually agrees with the percentage. The regeneration uses a simple
 * "fill with 1s, then flip the last (1-adh) days to 0s" pattern.
 */
export function applyPlanOverrides(
  rules: RuleCommitment[],
  plan: OsPlanVariant,
): RuleCommitment[] {
  return rules.map((r) => {
    const ov = plan.adherenceOverrides[r.id]
    if (!ov) return r
    const adherence = ov.adherence ?? r.adherence
    /* regenerate weekly history so 7-dot visual ≈ adherence% */
    const breachCount = Math.max(0, Math.min(7, Math.round(7 * (1 - adherence / 100))))
    const weeklyHistory = Array.from({ length: 7 }, (_, i) =>
      i >= 7 - breachCount ? 0 : 1,
    )
    return {
      ...r,
      adherence,
      streak:     ov.streak     ?? r.streak,
      violations: ov.violations ?? r.violations,
      weeklyHistory,
    }
  })
}

/* ─────────────────────────────────────────────────────────────────────────
   8.  resolveOsTone  ·  the OS_TONE → theme color resolver helper
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Given a theme object shaped like `VANTARY` and a tone key, return the
 * actual CSS color string. Implemented as a string lookup on the theme
 * object so consumers never need to import VANTARY separately just for
 * tone resolution.
 *
 *   resolveOsTone("discipline", VANTARY)  → VANTARY.amber
 *   resolveOsTone("calm",       VANTARY)  → VANTARY.ashSoft
 *
 * Generic `T` is constrained to objects that look like the VANTARY
 * surface — every key the OS_TONE map references must exist on the
 * theme or TypeScript will object.
 */
export function resolveOsTone<
  T extends {
    amber:     string
    paper:     string
    paperDim:  string
    ashSoft:   string
    amberWash: string
  }
>(
  toneKey: OsToneKey,
  theme: T,
): string {
  switch (toneKey) {
    case "discipline": return theme.amber
    case "violation":  return theme.paper
    case "flow":       return theme.amberWash
    case "calm":       return theme.ashSoft
    case "optimal":    return theme.amber
    case "alert":      return theme.paperDim
    case "warning":    return theme.paper
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   9.  deriveOsState  ·  the top-level bundle
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Builds the complete `OsDerived` block from the current rules + data +
 * capital fixtures. Run once per plan-key change inside the provider's
 * `useMemo`, so this function is hot-path-cheap.
 *
 * The `redDots` sub-object decides which of the 4 nerve cards lights its
 * top-right warning dot. Logic mirrors what the screenshot shows:
 *   · DISCIPLINE SCORE — never a red dot (it's the headline metric)
 *   · COMMITMENTS      — red dot when ≥1 rule is breached
 *   · USD WEIGHT       — red dot when usdWeight > OS_USD_WEIGHT_RED_DOT
 *   · EXEC PATIENCE    — red dot when limitRatio < 0.40
 */
export function deriveOsState(input: {
  rules: RuleCommitment[]
  data: StrategyData
  capital: CapitalOfWeek
  planVerdict?: string
}): OsDerived {
  const mirror   = deriveStrategicMirror(input.data, input.rules)
  const breached = deriveBreachedRules(input.rules)
  const inviolable = deriveInviolableRules(input.rules)
  const posture  = derivePosture(mirror.overallDiscipline)
  const archetype = deriveArchetype(mirror.limitRatio)
  const usdWeight = input.capital.dominantCurrency.weight

  const redDots = {
    discipline:   false,
    commitments:  breached.length > 0,
    usdWeight:    usdWeight > OS_USD_WEIGHT_RED_DOT,
    execPatience: mirror.limitRatio < 0.40,
  }
  const redDotCount =
    Number(redDots.discipline) +
    Number(redDots.commitments) +
    Number(redDots.usdWeight) +
    Number(redDots.execPatience)

  return {
    mirror,
    breachedRuleIds:   breached,
    inviolableRuleIds: inviolable,
    posture,
    contextLine: deriveContextLine({
      disciplineScore: mirror.overallDiscipline,
      posture,
      breachedCount: breached.length,
      archetype,
      planVerdict: input.planVerdict,
    }),
    redDotCount,
    redDots,
    disciplineScore:   mirror.overallDiscipline,
    commitmentsCount:  input.rules.length,
    usdWeightPct:      usdWeight,
    execPatiencePct:   mirror.limitRatio,
    archetypeLabel:    archetype,
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   10.  buildInitialOsState  ·  what the provider mounts with
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Returns the initial `OsState` for the provider given the four fixtures
 * (rules, data, capital, plans) and the starting plan-key. Pulled out as
 * a free function so React's `useReducer` initializer can call it
 * cheaply. The provider re-runs it whenever planKey changes.
 */
export function buildInitialOsState(input: {
  rules: RuleCommitment[]
  data: StrategyData
  capital: CapitalOfWeek
  plans: OsPlanVariant[]
  planKey: OsState["planKey"]
}): OsState {
  const planIndex = Math.max(0, input.plans.findIndex((p) => p.key === input.planKey))
  const plan      = input.plans[planIndex] ?? input.plans[0]
  const planRules = applyPlanOverrides(input.rules, plan)

  return {
    rules:    planRules,
    data:     input.data,
    capital:  input.capital,
    planKey:  input.planKey,
    planIndex,
    planTotal:  input.plans.length,
    plans:    input.plans,

    /* MIRROR was retired from the visible tab strip — first reachable
     * tab is now RULES, so we default selection there to avoid landing
     * the trader on an invisible tab. The "mirror" key is intentionally
     * still present in OsTabKey + ActiveSlab's switch, so any orphaned
     * JUMP_TO_DAY dispatches still resolve cleanly. */
    selectedTab:   "rules",
    selectedDow:   null,
    openSections: new Set(["section-mirror", "section-rules", "section-exposure", "section-dna"]),
    expandedRuleId: null,
    lensWeekCapital: false,
    pickerOpen:    false,
    flashRuleId:   null,

    derived: deriveOsState({
      rules:   planRules,
      data:    input.data,
      capital: input.capital,
      planVerdict: plan.verdict,
    }),
  }
}
