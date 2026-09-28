// ═══════════════════════════════════════════════════════════════════
// ORDER LAYER ENGINE -- The unified intelligence language
// Phase 2: States, Modes, Directives, Gates, Missions
// Phase 4: Truth Strip computation
// Phase 5: Mission System computation
//
// This file is PURE LOGIC. No React. No rendering.
// It consumes Strategy + Psychology + Activity signals
// and produces a single, unified "OrderLayerState."
// ═══════════════════════════════════════════════════════════════════

// ─── VOCABULARY ───────────────────────────────────────────────────

/** System-wide readiness level */
export type SystemState = "stable" | "elevated" | "reactive" | "critical"

/** Time-of-day mode */
export type SessionMode = "pre-session" | "in-session" | "post-session" | "cooldown" | "off-hours"

/** Actionable directive -- what the system is telling the trader */
export type Directive =
  | "CLEAR_TO_TRADE"
  | "ONLY_A_PLUS"
  | "REDUCE_RISK"
  | "AUDIT_REQUIRED"
  | "DO_NOT_TRADE"
  | "COOLDOWN_ACTIVE"

/** Gate -- blocks progression until resolved */
export interface Gate {
  id: string
  label: string
  reason: string
  severity: "hard" | "soft"            // hard = blocks trading, soft = warning
  resolveAction: string                // what to do
  targetTab: "strategy" | "psychology" // which tab holds the fix
  targetSection?: string               // specific section to scroll to
}

/** Mission -- a specific, actionable step */
export interface Mission {
  id: string
  priority: number                     // 1 = most urgent
  label: string                        // short imperative: "Review Rule 4"
  description: string                  // why it matters
  category: "stabilize" | "protect" | "optimize" | "learn"
  targetTab: "strategy" | "psychology" | "activity"
  targetSection?: string
  rImpact?: string                     // e.g. "-6.3R/wk"
  completed: boolean
}

/** Danger signal surfaced to the Truth Strip */
export interface DangerSignal {
  id: string
  message: string                      // one-sentence truth
  severity: SystemState
  source: "strategy" | "psychology" | "activity"
  rCost?: string
}

/** The complete Order Layer state -- what the panel renders */
export interface OrderLayerState {
  // ── Core verdict ──
  systemState: SystemState
  sessionMode: SessionMode
  directive: Directive
  readinessScore: number               // 0-100 composite
  readinessLabel: string               // "Fit" | "Caution" | "Compromised" | "Unfit"

  // ── Truth Strip ──
  dominantRisk: string                 // one sentence
  primaryCorrection: string            // one sentence
  missionCount: number
  activeMissionCount: number

  // ── Gates ──
  gates: Gate[]
  hasHardGate: boolean

  // ── Missions ──
  missions: Mission[]

  // ── Danger signals ──
  dangerSignals: DangerSignal[]

  // ── Source scores (for transparency) ──
  strategyScore: number                // 0-100
  psychologyScore: number              // 0-100
  activityScore: number                // 0-100

  // ── Quick stats ──
  disciplineScore: number
  stabilityIndex: number
  riskGrade: string
  dominantHemisphere: string
  sessionName: string
  killzoneActive: boolean
}

// ─── INPUT TYPES (from existing OS layers) ────────────────────────

export interface StrategyInput {
  overallDiscipline: number
  riskGrade: "A" | "B" | "C" | "D"
  entryQuality: number
  structureDepth: number
  limitRatio: number
  exposureConcentration: number
  correlationRisk: boolean
  dominantCurrency: string
  dominantPct: number
  weeklyAdherence: number[]
  intentVsAction: { intended: number; actual: number }
  rules: Array<{
    rule: string
    adherence: number
    violations: number
    streak: number
  }>
  executionIdentity?: string
}

export interface PsychologyInput {
  stabilityIndex: number
  stabilityLevel: "stable" | "elevated" | "reactive"
  drawdownResponse: "aggressive" | "defensive" | "detached"
  decisionLatency: "fast" | "measured" | "slow"
  revengeRisk: "clear" | "watch" | "warning" | "critical"
  cutWinnersRisk: "clear" | "watch" | "warning" | "critical"
  sizeEscalation: "clear" | "watch" | "warning" | "critical"
  overtradingRisk: "clear" | "watch" | "warning" | "critical"
  emotionVolatility: number
  disciplineScore: number
  dominantHemisphere: "left" | "right" | "balanced"
  dominantEmotion: string
  activeAlerts: Array<{ message: string; severity: "critical" | "warning"; pattern: string }>
  cortexVerdictLevel: "stable" | "elevated" | "reactive"
}

export interface ActivityInput {
  sessionName: string
  killzone: boolean
  kzProgress: number
  remaining: number
  subPhase: string
  dayQuality: "high" | "medium" | "low"
}

// ─── COMPUTATION ENGINE ──────────────────────────────────────────

/**
 * deriveOrderLayerState -- The single function that unifies all three OS layers
 * into one coherent intelligence output.
 */
export function deriveOrderLayerState(
  strategy: StrategyInput,
  psychology: PsychologyInput,
  activity: ActivityInput
): OrderLayerState {

  // ── 1. Compute individual OS scores ──
  const strategyScore = computeStrategyScore(strategy)
  const psychologyScore = computePsychologyScore(psychology)
  const activityScore = computeActivityScore(activity)

  // ── 2. Compute readiness (weighted composite) ──
  //    Psychology 40%, Strategy 35%, Activity 25%
  const readinessScore = Math.round(
    psychologyScore * 0.40 +
    strategyScore * 0.35 +
    activityScore * 0.25
  )

  const readinessLabel =
    readinessScore >= 75 ? "Fit" :
    readinessScore >= 55 ? "Caution" :
    readinessScore >= 35 ? "Compromised" :
    "Unfit"

  // ── 3. Determine system state ──
  const systemState = deriveSystemState(psychology, strategy, readinessScore)

  // ── 4. Determine session mode ──
  const sessionMode = deriveSessionMode(activity, systemState)

  // ── 5. Build gates ──
  const gates = buildGates(psychology, strategy, activity)
  const hasHardGate = gates.some(g => g.severity === "hard")

  // ── 6. Determine directive ──
  const directive = deriveDirective(systemState, sessionMode, hasHardGate, readinessScore)

  // ── 7. Build danger signals ──
  const dangerSignals = buildDangerSignals(psychology, strategy, activity)

  // ── 8. Build missions ──
  const missions = buildMissions(psychology, strategy, activity, systemState)

  // ── 9. Compute truth strip text ──
  const dominantRisk = deriveDominantRisk(dangerSignals, psychology, strategy)
  const primaryCorrection = derivePrimaryCorrection(missions)

  return {
    systemState,
    sessionMode,
    directive,
    readinessScore,
    readinessLabel,
    dominantRisk,
    primaryCorrection,
    missionCount: missions.length,
    activeMissionCount: missions.filter(m => !m.completed).length,
    gates,
    hasHardGate,
    missions,
    dangerSignals,
    strategyScore,
    psychologyScore,
    activityScore,
    disciplineScore: strategy.overallDiscipline,
    stabilityIndex: psychology.stabilityIndex,
    riskGrade: strategy.riskGrade,
    dominantHemisphere: psychology.dominantHemisphere,
    sessionName: activity.sessionName,
    killzoneActive: activity.killzone,
  }
}

// ─── SCORE COMPUTERS ─────────────────────────────────────────────

function computeStrategyScore(s: StrategyInput): number {
  const disciplineWeight = Math.min(s.overallDiscipline, 100) * 0.35
  const entryWeight = Math.min(s.entryQuality, 100) * 0.20
  const structureWeight = Math.min(s.structureDepth, 100) * 0.15
  const gapPenalty = Math.max(0, (s.intentVsAction.intended - s.intentVsAction.actual)) * 0.3
  const corrPenalty = s.correlationRisk ? 10 : 0
  const concPenalty = s.exposureConcentration > 50 ? 8 : 0
  const ruleHealthPenalty = s.rules.filter(r => r.adherence < 60).length * 5

  return Math.max(0, Math.min(100, Math.round(
    disciplineWeight + entryWeight + structureWeight + 30 - gapPenalty - corrPenalty - concPenalty - ruleHealthPenalty
  )))
}

function computePsychologyScore(p: PsychologyInput): number {
  const stabilityWeight = Math.min(p.stabilityIndex, 100) * 0.30
  const disciplineWeight = Math.min(p.disciplineScore, 100) * 0.25

  // Pattern penalties
  const patternScore = (sev: string) => sev === "critical" ? 20 : sev === "warning" ? 12 : sev === "watch" ? 5 : 0
  const patternPenalty =
    patternScore(p.revengeRisk) +
    patternScore(p.cutWinnersRisk) +
    patternScore(p.sizeEscalation) +
    patternScore(p.overtradingRisk)

  const volatilityPenalty = p.emotionVolatility > 60 ? 10 : p.emotionVolatility > 40 ? 5 : 0
  const hemispherePenalty = p.dominantHemisphere === "right" ? 8 : 0
  const latencyPenalty = p.decisionLatency === "fast" ? 6 : 0
  const alertPenalty = p.activeAlerts.filter(a => a.severity === "critical").length * 5

  return Math.max(0, Math.min(100, Math.round(
    stabilityWeight + disciplineWeight + 45 - patternPenalty - volatilityPenalty - hemispherePenalty - latencyPenalty - alertPenalty
  )))
}

function computeActivityScore(a: ActivityInput): number {
  let score = 50 // baseline

  // Killzone bonus
  if (a.killzone) {
    score += 25
    // Progress bonus (not too early, not too late)
    if (a.kzProgress > 0.15 && a.kzProgress < 0.75) score += 10
  }

  // Day quality
  if (a.dayQuality === "high") score += 10
  else if (a.dayQuality === "low") score -= 10

  // Off-hours penalty
  if (!a.killzone && a.remaining <= 0) score -= 15

  return Math.max(0, Math.min(100, score))
}

// ─── STATE DERIVATION ────────────────────────────────────────────

function deriveSystemState(
  p: PsychologyInput,
  s: StrategyInput,
  readiness: number
): SystemState {
  // Critical: any single critical pattern OR readiness below 30
  if (
    p.revengeRisk === "critical" ||
    p.sizeEscalation === "critical" ||
    p.cortexVerdictLevel === "reactive" ||
    p.stabilityIndex < 40 ||
    readiness < 30
  ) return "critical"

  // Reactive: multiple warnings OR readiness below 45
  const warningCount = [p.revengeRisk, p.cutWinnersRisk, p.sizeEscalation, p.overtradingRisk]
    .filter(r => r === "warning" || r === "critical").length
  if (
    warningCount >= 2 ||
    s.riskGrade === "D" ||
    readiness < 45
  ) return "reactive"

  // Elevated: single warning OR moderate concerns
  if (
    warningCount >= 1 ||
    s.riskGrade === "C" ||
    p.dominantHemisphere === "right" ||
    p.emotionVolatility > 60 ||
    s.overallDiscipline < 60 ||
    readiness < 65
  ) return "elevated"

  return "stable"
}

function deriveSessionMode(a: ActivityInput, state: SystemState): SessionMode {
  if (state === "critical") return "cooldown"

  const name = a.sessionName.toLowerCase()
  if (name.includes("closed") || name.includes("weekend")) return "off-hours"
  if (!a.killzone && a.remaining > 30) return "pre-session"
  if (a.killzone) return "in-session"
  if (!a.killzone && name.includes("transition")) return "pre-session"

  return "post-session"
}

// ─── DIRECTIVE ───────────────────────────────────────────────────

function deriveDirective(
  state: SystemState,
  mode: SessionMode,
  hasHardGate: boolean,
  readiness: number
): Directive {
  if (mode === "cooldown") return "COOLDOWN_ACTIVE"
  if (state === "critical" || hasHardGate) return "DO_NOT_TRADE"
  if (state === "reactive") return "AUDIT_REQUIRED"
  if (state === "elevated") return "ONLY_A_PLUS"
  if (readiness < 55) return "REDUCE_RISK"
  return "CLEAR_TO_TRADE"
}

// ─── GATES ───────────────────────────────────────────────────────

function buildGates(p: PsychologyInput, s: StrategyInput, _a: ActivityInput): Gate[] {
  const gates: Gate[] = []

  if (p.revengeRisk === "critical" || p.revengeRisk === "warning") {
    gates.push({
      id: "gate-revenge",
      label: "Revenge Circuit Active",
      reason: `Revenge risk is ${p.revengeRisk}. Trading under this state leads to -6.3R/week average loss.`,
      severity: p.revengeRisk === "critical" ? "hard" : "soft",
      resolveAction: "Complete cooldown protocol and review frustration chain",
      targetTab: "psychology",
      targetSection: "cause-effect-chains",
    })
  }

  if (p.sizeEscalation === "critical" || p.sizeEscalation === "warning") {
    gates.push({
      id: "gate-size",
      label: "Size Escalation Detected",
      reason: `Position sizing discipline is ${p.sizeEscalation}. Catastrophic loss potential.`,
      severity: p.sizeEscalation === "critical" ? "hard" : "soft",
      resolveAction: "Reset position sizing to base risk and review exposure",
      targetTab: "strategy",
      targetSection: "exposure-gravity",
    })
  }

  if (p.stabilityIndex < 40) {
    gates.push({
      id: "gate-stability",
      label: "Neural Stability Below Threshold",
      reason: `Stability index at ${p.stabilityIndex}. System is unstable for decision-making.`,
      severity: "hard",
      resolveAction: "Stabilize emotional state before any execution",
      targetTab: "psychology",
      targetSection: "neural-topology",
    })
  }

  if (s.riskGrade === "D") {
    gates.push({
      id: "gate-risk-grade",
      label: "Execution Framework Failed",
      reason: `Risk grade D. Entry quality, structure, and discipline are all compromised.`,
      severity: "hard",
      resolveAction: "Full strategy audit: review rules, exposure, and execution DNA",
      targetTab: "strategy",
      targetSection: "strategic-mirror",
    })
  }

  if (p.cortexVerdictLevel === "reactive") {
    gates.push({
      id: "gate-cortex",
      label: "Cortex Override",
      reason: "Multiple critical patterns detected. Neural system is in reactive state.",
      severity: "hard",
      resolveAction: "Complete full psychology review before proceeding",
      targetTab: "psychology",
      targetSection: "neural-cortex",
    })
  }

  const gap = s.intentVsAction.intended - s.intentVsAction.actual
  if (gap > 20) {
    gates.push({
      id: "gate-mirror",
      label: "Intent-Action Disconnect",
      reason: `${gap}pt gap between intention (${s.intentVsAction.intended}) and actual execution (${s.intentVsAction.actual}).`,
      severity: "soft",
      resolveAction: "Review Mirror timeline and identify where actions diverged from plan",
      targetTab: "strategy",
      targetSection: "mirror-timeline",
    })
  }

  if (s.correlationRisk && s.exposureConcentration > 50) {
    gates.push({
      id: "gate-correlation",
      label: "Correlated Exposure Risk",
      reason: `EUR weight >= 50% with ${s.exposureConcentration}% concentration on top instrument.`,
      severity: "soft",
      resolveAction: "Diversify exposure or reduce correlated positions",
      targetTab: "strategy",
      targetSection: "exposure-gravity",
    })
  }

  return gates.sort((a, b) => (a.severity === "hard" ? 0 : 1) - (b.severity === "hard" ? 0 : 1))
}

// ─── DANGER SIGNALS ──────────────────────────────────────────────

function buildDangerSignals(p: PsychologyInput, s: StrategyInput, _a: ActivityInput): DangerSignal[] {
  const signals: DangerSignal[] = []

  const addPsych = (cond: boolean, msg: string, sev: SystemState, rCost?: string) => {
    if (cond) signals.push({ id: `d-${signals.length}`, message: msg, severity: sev, source: "psychology", rCost })
  }
  const addStrat = (cond: boolean, msg: string, sev: SystemState, rCost?: string) => {
    if (cond) signals.push({ id: `d-${signals.length}`, message: msg, severity: sev, source: "strategy", rCost })
  }

  addPsych(p.revengeRisk === "critical", "Revenge circuit is active. Every trade deepens the loss.", "critical", "-6.3R/wk")
  addPsych(p.sizeEscalation === "critical", "Position sizing discipline has collapsed. Catastrophic risk.", "critical")
  addPsych(p.stabilityIndex < 40, `Stability at ${p.stabilityIndex}. System too unstable for decisions.`, "critical")
  addPsych(p.cortexVerdictLevel === "reactive", "Neural cortex in reactive state. Multiple systems compromised.", "critical")

  addPsych(p.cutWinnersRisk === "warning" || p.cutWinnersRisk === "critical", "Cutting winners early. Silent edge killer.", "reactive", "-4.1R/wk")
  addPsych(p.overtradingRisk === "warning" || p.overtradingRisk === "critical", "Overtrading pattern active. Dopamine loop, not strategy.", "reactive", "-4.7R/wk")
  addPsych(p.dominantHemisphere === "right", "Limbic system dominant. Emotions driving decisions over logic.", "elevated")
  addPsych(p.emotionVolatility > 60, `Emotional volatility at ${p.emotionVolatility}%. Mood swings affecting clarity.`, "elevated")
  addPsych(p.decisionLatency === "fast", "Decision speed too fast. Impulsive execution risk.", "elevated")

  addStrat(s.riskGrade === "D", "Risk grade D. Execution framework has failed.", "critical")
  addStrat(s.overallDiscipline < 50, `Discipline at ${s.overallDiscipline}%. Rules are not being followed.`, "reactive")
  addStrat(s.correlationRisk, `Correlated exposure risk: ${s.dominantCurrency} at ${s.dominantPct}%.`, "elevated")
  addStrat(s.entryQuality < 40, `Entry quality at ${s.entryQuality}. Chasing entries, not sniping.`, "elevated")

  const gap = s.intentVsAction.intended - s.intentVsAction.actual
  addStrat(gap > 15, `Intent-action gap: ${gap}pts. Self-deception active.`, "elevated")

  // Sort by severity
  const order: Record<SystemState, number> = { critical: 0, reactive: 1, elevated: 2, stable: 3 }
  return signals.sort((a, b) => order[a.severity] - order[b.severity])
}

// ─── MISSIONS ────────────────────────────────────────────────────

function buildMissions(
  p: PsychologyInput,
  s: StrategyInput,
  _a: ActivityInput,
  state: SystemState
): Mission[] {
  const missions: Mission[] = []
  let priority = 1

  // ── STABILIZE missions (when critical/reactive) ──
  if (state === "critical" || state === "reactive") {
    if (p.revengeRisk === "critical" || p.revengeRisk === "warning") {
      missions.push({
        id: "m-revenge", priority: priority++,
        label: "Interrupt revenge loop",
        description: "Review the frustration cause-effect chain. Complete cooldown before any trade.",
        category: "stabilize", targetTab: "psychology", targetSection: "cause-effect-chains",
        rImpact: "-6.3R/wk", completed: false,
      })
    }

    if (p.stabilityIndex < 50) {
      missions.push({
        id: "m-stability", priority: priority++,
        label: "Restore neural stability",
        description: `Stability at ${p.stabilityIndex}. Check brain zones and dominant hemisphere.`,
        category: "stabilize", targetTab: "psychology", targetSection: "neural-topology",
        completed: false,
      })
    }

    if (p.sizeEscalation === "critical" || p.sizeEscalation === "warning") {
      missions.push({
        id: "m-size", priority: priority++,
        label: "Reset position sizing",
        description: "Return to base risk. Review exposure gravity field for concentration.",
        category: "stabilize", targetTab: "strategy", targetSection: "exposure-gravity",
        completed: false,
      })
    }
  }

  // ── PROTECT missions (when elevated or worse) ──
  if (state !== "stable") {
    const brokenRules = s.rules.filter(r => r.adherence < 60)
    if (brokenRules.length > 0) {
      missions.push({
        id: "m-rules", priority: priority++,
        label: `Fix ${brokenRules.length} broken rule${brokenRules.length > 1 ? "s" : ""}`,
        description: `${brokenRules.map(r => r.rule).join(", ")} -- below 60% adherence. Each violation costs R.`,
        category: "protect", targetTab: "strategy", targetSection: "rules-engine",
        completed: false,
      })
    }

    if (p.cutWinnersRisk === "warning" || p.cutWinnersRisk === "critical") {
      missions.push({
        id: "m-cut", priority: priority++,
        label: "Stop cutting winners",
        description: "Fear is compressing R-multiples. Review the fear cause-effect chain.",
        category: "protect", targetTab: "psychology", targetSection: "cause-effect-chains",
        rImpact: "-4.1R/wk", completed: false,
      })
    }

    if (p.overtradingRisk === "warning" || p.overtradingRisk === "critical") {
      missions.push({
        id: "m-overtrade", priority: priority++,
        label: "Reduce trade frequency",
        description: "Boredom or dopamine loop is inflating trade count. Quality over quantity.",
        category: "protect", targetTab: "psychology", targetSection: "cause-effect-chains",
        rImpact: "-4.7R/wk", completed: false,
      })
    }

    if (s.correlationRisk) {
      missions.push({
        id: "m-correlation", priority: priority++,
        label: "Diversify currency exposure",
        description: `${s.dominantCurrency} at ${s.dominantPct}%. Correlated blowup risk.`,
        category: "protect", targetTab: "strategy", targetSection: "exposure-gravity",
        completed: false,
      })
    }
  }

  // ── OPTIMIZE missions (when stable or elevated) ──
  if (state === "stable" || state === "elevated") {
    if (s.entryQuality < 70) {
      missions.push({
        id: "m-entry", priority: priority++,
        label: "Improve entry precision",
        description: `Entry quality at ${s.entryQuality}. Increase limit order ratio for better fills.`,
        category: "optimize", targetTab: "strategy", targetSection: "execution-dna",
        completed: false,
      })
    }

    if (s.structureDepth < 50) {
      missions.push({
        id: "m-structure", priority: priority++,
        label: "Add higher-timeframe structure",
        description: `Structure depth at ${s.structureDepth}%. Decisions lack HTF backing.`,
        category: "optimize", targetTab: "strategy", targetSection: "execution-dna",
        completed: false,
      })
    }

    const gap = s.intentVsAction.intended - s.intentVsAction.actual
    if (gap > 10) {
      missions.push({
        id: "m-mirror", priority: priority++,
        label: "Close intent-action gap",
        description: `${gap}pt gap. Review Mirror timeline to find where execution drifted from plan.`,
        category: "optimize", targetTab: "strategy", targetSection: "mirror-timeline",
        completed: false,
      })
    }
  }

  // ── LEARN missions (always available) ──
  if (p.dominantHemisphere === "right") {
    missions.push({
      id: "m-hemisphere", priority: priority++,
      label: "Rebalance neural hemispheres",
      description: "Limbic system is dominant. Engage logic cortex through structured analysis.",
      category: "learn", targetTab: "psychology", targetSection: "neural-topology",
      completed: false,
    })
  }

  if (p.decisionLatency === "fast") {
    missions.push({
      id: "m-latency", priority: priority++,
      label: "Slow decision speed",
      description: "Fast decisions correlate with impulsive entries. Add deliberate pause before execution.",
      category: "learn", targetTab: "psychology", targetSection: "interconnection-map",
      completed: false,
    })
  }

  return missions
}

// ─── TRUTH STRIP TEXT ────────────────────────────────────────────

function deriveDominantRisk(signals: DangerSignal[], p: PsychologyInput, s: StrategyInput): string {
  if (signals.length === 0) return "No active threats detected. System is clear."

  const top = signals[0]
  if (top.severity === "critical") return top.message
  if (top.severity === "reactive") return top.message

  // Compose from multiple elevated signals
  if (signals.length >= 3) {
    return `${signals.length} elevated signals active. ${p.dominantHemisphere === "right" ? "Limbic override risk." : `Discipline at ${s.overallDiscipline}%.`}`
  }

  return top.message
}

function derivePrimaryCorrection(missions: Mission[]): string {
  const active = missions.filter(m => !m.completed)
  if (active.length === 0) return "All systems nominal. Focus on process quality."
  const top = active[0]
  return `${top.label}. ${top.description.split(".")[0]}.`
}

// ─── DIRECTIVE DISPLAY ───────────────────────────────────────────

export const DIRECTIVE_CONFIG: Record<Directive, {
  label: string
  color: string
  bgColor: string
  borderColor: string
  description: string
}> = {
  CLEAR_TO_TRADE: {
    label: "CLEAR",
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.06)",
    borderColor: "rgba(16,185,129,0.15)",
    description: "All systems nominal. Execute with discipline.",
  },
  ONLY_A_PLUS: {
    label: "A+ ONLY",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.06)",
    borderColor: "rgba(245,158,11,0.15)",
    description: "Elevated signals. Only highest-conviction setups.",
  },
  REDUCE_RISK: {
    label: "REDUCE",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.06)",
    borderColor: "rgba(249,115,22,0.15)",
    description: "Active concerns. Reduce position sizes.",
  },
  AUDIT_REQUIRED: {
    label: "AUDIT",
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.06)",
    borderColor: "rgba(239,68,68,0.15)",
    description: "Multiple systems compromised. Full review before any trade.",
  },
  DO_NOT_TRADE: {
    label: "HALT",
    color: "#dc2626",
    bgColor: "rgba(220,38,38,0.08)",
    borderColor: "rgba(220,38,38,0.20)",
    description: "Hard gate active. Trading will cause damage.",
  },
  COOLDOWN_ACTIVE: {
    label: "COOLDOWN",
    color: "#6366f1",
    bgColor: "rgba(99,102,241,0.06)",
    borderColor: "rgba(99,102,241,0.15)",
    description: "System in recovery mode. No execution permitted.",
  },
}

export const STATE_CONFIG: Record<SystemState, {
  label: string
  color: string
}> = {
  stable: { label: "STABLE", color: "#10b981" },
  elevated: { label: "ELEVATED", color: "#f59e0b" },
  reactive: { label: "REACTIVE", color: "#f97316" },
  critical: { label: "CRITICAL", color: "#ef4444" },
}

export const SESSION_MODE_CONFIG: Record<SessionMode, {
  label: string
  color: string
}> = {
  "pre-session": { label: "PRE-SESSION", color: "#06b6d4" },
  "in-session": { label: "IN-SESSION", color: "#10b981" },
  "post-session": { label: "POST-SESSION", color: "#8b5cf6" },
  "cooldown": { label: "COOLDOWN", color: "#6366f1" },
  "off-hours": { label: "OFF-HOURS", color: "#64748b" },
}

export const CATEGORY_CONFIG: Record<Mission["category"], {
  label: string
  color: string
  icon: string
}> = {
  stabilize: { label: "STABILIZE", color: "#ef4444", icon: "Shield" },
  protect: { label: "PROTECT", color: "#f59e0b", icon: "Lock" },
  optimize: { label: "OPTIMIZE", color: "#10b981", icon: "TrendingUp" },
  learn: { label: "LEARN", color: "#8b5cf6", icon: "BookOpen" },
}

// ═══════════════════════════════════════════════════════════════════
// INTELLIGENCE QUESTION SYSTEM
// AI-driven questions that push the user deeper into self-analysis
// Each question is connected to Strategy, Psychology, or both
// ═══════════════════════════════════════════════════════════════════

export type QuestionSource = "strategy" | "psychology" | "session" | "system" | "risk"
export type QuestionPriority = "critical" | "high" | "medium" | "standard"

export interface IntelligenceQuestion {
  id: string
  question: string
  note: string                    // why this is being asked
  source: QuestionSource
  priority: QuestionPriority
  connection: "strategy" | "psychology" | "both"
  navigateTo?: string            // which tab to navigate to
  exampleAnswers?: string[]      // example answers to guide the user
}

export interface SessionContext {
  sessionName: string
  killzone: boolean
  kzProgress: number
  remaining: number
  subPhase: string
  activeSymbol: string
  timeframe: string
}

export const QUESTION_SOURCE_CONFIG: Record<QuestionSource, {
  label: string; color: string
}> = {
  strategy: { label: "STRATEGY", color: "#06b6d4" },
  psychology: { label: "PSYCHOLOGY", color: "#8b5cf6" },
  session: { label: "SESSION", color: "#3b82f6" },
  system: { label: "SYSTEM", color: "#f59e0b" },
  risk: { label: "RISK", color: "#ef4444" },
}

export const QUESTION_PRIORITY_CONFIG: Record<QuestionPriority, {
  color: string; bgColor: string
}> = {
  critical: { color: "#ef4444", bgColor: "rgba(239,68,68,0.04)" },
  high: { color: "#f59e0b", bgColor: "rgba(245,158,11,0.03)" },
  medium: { color: "#71717a", bgColor: "rgba(255,255,255,0.015)" },
  standard: { color: "#52525b", bgColor: "rgba(255,255,255,0.01)" },
}

/**
 * generateIntelligenceQuestions -- Produces deeply contextual questions
 * that push the trader to self-examine before acting.
 * Each question is tied to Strategy and/or Psychology.
 */
export function generateIntelligenceQuestions(
  state: OrderLayerState,
  session: SessionContext,
  psychology: PsychologyInput,
  strategy: StrategyInput,
): IntelligenceQuestion[] {
  const questions: IntelligenceQuestion[] = []

  // ── CRITICAL SYSTEM QUESTIONS (when state is bad) ──
  if (state.systemState === "critical" || state.systemState === "reactive") {
    questions.push({
      id: "iq-system-state",
      question: `Your system is ${state.systemState.toUpperCase()}. What specific event or sequence pushed you here?`,
      note: `Readiness ${state.readinessScore}/100. ${state.dominantRisk} Tracing the origin prevents repeating the pattern.`,
      source: "system", priority: "critical", connection: "both",
      exampleAnswers: [
        "I took a loss and immediately re-entered without analysis",
        "I've been staring at charts for 3 hours without a plan",
        "Frustration from yesterday's missed move is driving today's decisions",
      ],
    })

    if (state.hasHardGate) {
      questions.push({
        id: "iq-hard-gate",
        question: "A hard gate is blocking you. Have you genuinely completed the required action, or are you looking for a way around it?",
        note: `Gate: ${state.gates[0]?.label}. Self-honesty here determines whether the gate protects you or becomes noise you ignore.`,
        source: "system", priority: "critical", connection: "psychology",
        navigateTo: "psychology",
      })
    }
  }

  // ── PSYCHOLOGY-DRIVEN QUESTIONS ──
  if (psychology.revengeRisk === "warning" || psychology.revengeRisk === "critical") {
    questions.push({
      id: "iq-revenge",
      question: "If you lost this next trade, what would you do? Be honest -- would you stop, or would you take another?",
      note: "Revenge circuit active. Your answer reveals whether you're trading from strategy or emotion. If you'd take another trade after a loss, you're in a loop.",
      source: "psychology", priority: "critical", connection: "psychology",
      navigateTo: "psychology",
      exampleAnswers: [
        "I'd stop and review -- I have a 2-loss daily limit",
        "Honestly, I'd probably try one more to recover",
        "I'd reduce size but keep looking for setups",
      ],
    })
  }

  if (psychology.cutWinnersRisk === "warning" || psychology.cutWinnersRisk === "critical") {
    questions.push({
      id: "iq-cut-winners",
      question: "When was the last time you held a winner to its full target? What stopped you from holding the others?",
      note: `Cut-winners pattern detected. This pattern silently costs ~4.1R/week. The fear that makes you exit early is the same fear that keeps you from compounding.`,
      source: "psychology", priority: "high", connection: "psychology",
      navigateTo: "psychology",
      exampleAnswers: [
        "I can't remember the last full target hit -- I always take partial",
        "Fear of giving back profit makes me close at 1R even when target is 3R",
        "I move my stop to breakeven too early and get stopped on noise",
      ],
    })
  }

  if (psychology.dominantHemisphere === "right") {
    questions.push({
      id: "iq-hemisphere",
      question: "Your emotional brain is dominant right now. Can you describe your current thesis in pure structure terms -- no feelings, just levels and confluences?",
      note: "Right hemisphere dominance means emotions are steering. If you can't articulate your thesis in cold structural terms, you don't have a thesis -- you have a feeling.",
      source: "psychology", priority: "high", connection: "both",
      exampleAnswers: [
        "HTF bearish, 4H rejected at daily FVG, targeting previous week low",
        "I feel like it should go up... (this answer reveals the problem)",
        "Daily bullish OB respected, London swept Asia lows, looking for continuation",
      ],
    })
  }

  if (psychology.emotionVolatility > 55) {
    questions.push({
      id: "iq-volatility",
      question: "Your emotional volatility is elevated. What changed in the last hour that shifted your mood?",
      note: `Volatility at ${psychology.emotionVolatility}%. High emotional swings corrupt decision quality. Identifying the trigger is the first step to neutralizing it.`,
      source: "psychology", priority: "medium", connection: "psychology",
    })
  }

  if (psychology.decisionLatency === "fast") {
    questions.push({
      id: "iq-speed",
      question: "You're making decisions too fast. Before your next action, can you wait 60 seconds and write down exactly why you're about to do it?",
      note: "Fast decisions correlate with impulsive entries. A 60-second pause with written rationale has been shown to reduce impulsive trades by 40%.",
      source: "psychology", priority: "high", connection: "psychology",
    })
  }

  // ── STRATEGY-DRIVEN QUESTIONS ──
  const brokenRules = strategy.rules.filter(r => r.adherence < 65)
  if (brokenRules.length > 0) {
    const worst = brokenRules.sort((a, b) => a.adherence - b.adherence)[0]
    questions.push({
      id: "iq-rules",
      question: `"${worst.rule}" is at ${worst.adherence}% adherence with ${worst.violations} violations. What makes you break this specific rule?`,
      note: `${brokenRules.length} rules below threshold. Rules exist because past-you identified edge-leaking patterns. Understanding WHY you break them matters more than just knowing you do.`,
      source: "strategy", priority: "high", connection: "strategy",
      navigateTo: "strategy",
      exampleAnswers: [
        "FOMO -- I see the candle moving and jump in before confirmation",
        "I don't actually believe in this rule anymore, maybe I should remove it",
        "I follow it when calm but forget it when the market moves fast",
      ],
    })
  }

  const gap = strategy.intentVsAction.intended - strategy.intentVsAction.actual
  if (gap > 15) {
    questions.push({
      id: "iq-mirror",
      question: `There's a ${gap}-point gap between what you intend to do (${strategy.intentVsAction.intended}) and what you actually do (${strategy.intentVsAction.actual}). Where does the drift happen?`,
      note: "The intent-action gap is the single most diagnostic metric in trading psychology. It measures self-deception in real-time.",
      source: "strategy", priority: "high", connection: "both",
      navigateTo: "strategy",
    })
  }

  if (strategy.limitRatio < 0.5) {
    questions.push({
      id: "iq-patience",
      question: `Only ${Math.round(strategy.limitRatio * 100)}% of your entries are limit orders. Are you chasing entries or waiting for price to come to you?`,
      note: "Low limit ratio = reactive execution. The best traders wait. They don't chase. Every market order is a micro-capitulation to urgency.",
      source: "strategy", priority: "medium", connection: "strategy",
      navigateTo: "strategy",
    })
  }

  if (strategy.entryQuality < 50) {
    questions.push({
      id: "iq-entry",
      question: "Your entry quality is below 50. Are you entering where structure tells you to, or where you feel like you should?",
      note: `Entry quality ${strategy.entryQuality}/100. Poor entries mean your stop is too wide or your thesis is weak. This compounds into reduced R-multiples.`,
      source: "strategy", priority: "medium", connection: "strategy",
    })
  }

  // ── SESSION-DRIVEN QUESTIONS ──
  if (session.killzone) {
    if (session.kzProgress > 0.7) {
      questions.push({
        id: "iq-kz-late",
        question: `${session.sessionName} killzone is ${Math.round(session.kzProgress * 100)}% done. If you haven't found a setup yet, is the right move to force one or accept that today wasn't your day?`,
        note: `Only ${session.remaining}min left. Late KZ entries have lower probability. The discipline to walk away when the window closes IS edge.`,
        source: "session", priority: "high", connection: "both",
      })
    } else if (session.kzProgress < 0.15) {
      questions.push({
        id: "iq-kz-early",
        question: `${session.sessionName} killzone just opened. Do you have a pre-session plan, or are you reacting to the first candle?`,
        note: "Early KZ phase. Traders who have a pre-session plan outperform reactive traders by 2.3x. Plan should include: bias, key levels, invalidation, and maximum trade count.",
        source: "session", priority: "medium", connection: "strategy",
      })
    }
  } else {
    questions.push({
      id: "iq-no-kz",
      question: `You're outside a killzone (${session.sessionName}). What specific preparation are you doing for the next session, or are you just watching candles?`,
      note: "Off-killzone time is for analysis, not execution. If you're just staring at charts, you're building screen addiction, not edge.",
      source: "session", priority: "medium", connection: "psychology",
    })
  }

  // ── RISK-DRIVEN QUESTIONS ──
  if (strategy.exposureConcentration > 40) {
    questions.push({
      id: "iq-concentration",
      question: `${strategy.dominantCurrency} represents ${strategy.dominantPct}% of your exposure. If there's an unexpected news event on ${strategy.dominantCurrency}, are you protected?`,
      note: "Concentration risk. A single currency event could hit all your positions simultaneously. Diversification isn't just a theory -- it's survival.",
      source: "risk", priority: "medium", connection: "strategy",
    })
  }

  // ── ALWAYS-ASK: DEEP SELF-REFLECTION ──
  questions.push({
    id: "iq-self-reflect",
    question: "On a scale of 1-10, how confident are you in your next trade? Now ask: is that confidence based on structure analysis or on a feeling?",
    note: "This question separates informed conviction from emotional certainty. High confidence without structural backing is the most dangerous state in trading.",
    source: "system", priority: "standard", connection: "both",
    exampleAnswers: [
      "8/10 -- but honestly, it's mostly because the last 3 trades won",
      "6/10 -- I see the setup but the bias conflicts with HTF",
      "9/10 -- daily OB + session sweep + KZ timing all align",
    ],
  })

  // Sort: critical first, then high, medium, standard
  const order: Record<QuestionPriority, number> = { critical: 0, high: 1, medium: 2, standard: 3 }
  return questions.sort((a, b) => order[a.priority] - order[b.priority])
}
