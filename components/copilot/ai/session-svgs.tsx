"use client"

import { useState } from "react"

/* ═══════════════════════════════════════════════════════════════
   Guided Session SVG Visualizations
   Extracted from IntelligenceBoard to keep bundle size manageable.
   ═══════════════════════════════════════════════════════════════ */

interface StageProps {
  color: string
}

/* ── STEP 1 (GUIDED SESSION): Mode Grid - Clean & Elegant ── */
export function ModeGridSvg({ color: _bg }: StageProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  const modes = [
    { label: "Analyst", color: "#6366f1", desc: "Pattern-Based Market Reasoning", emoji: "🔍",
      focus: "Reads structure, levels, and institutional footprints from price data to build a directional bias backed by evidence.",
      bestFor: "Pre-trade analysis, bias confirmation, level identification",
      when: "Before entering a trade or when you need market context" },
    { label: "Strategist", color: "#8b5cf6", desc: "Plan Construction & Scenario Building", emoji: "♟️",
      focus: "Builds complete trade plans with entries, exits, and if-then contingencies so you trade with a framework, not impulse.",
      bestFor: "Planning sessions, thesis building, scenario mapping",
      when: "Before your trading session or when building a new thesis" },
    { label: "Coach", color: "#10b981", desc: "Accountability & Discipline Partner", emoji: "🛡️",
      focus: "Holds you accountable to your own rules, manages emotional moments, and enforces the boundaries you set for yourself.",
      bestFor: "During tilt, after losses, when breaking rules",
      when: "When you feel yourself slipping or need an accountability check" },
    { label: "Mirror", color: "#06b6d4", desc: "Self-Reflection & Pattern Recognition", emoji: "🪞",
      focus: "Reflects your decisions back honestly without judgment, revealing hidden behavioral patterns you cannot see yourself.",
      bestFor: "Post-session review, recognizing recurring mistakes",
      when: "After your session or when you sense a blind spot" },
    { label: "Focus", color: "#f59e0b", desc: "Deep Single-Topic Investigation", emoji: "🎯",
      focus: "Drills into one specific issue with precision until fully resolved. No tangents, no surface answers, just depth.",
      bestFor: "Confused about one setup, deep-dive on a concept",
      when: "When one topic needs complete understanding" },
    { label: "Mentor", color: "#22c55e", desc: "Guided Learning & Skill Development", emoji: "📚",
      focus: "Teaches concepts progressively, builds your trading knowledge brick by brick, and identifies where your skill gaps are.",
      bestFor: "Learning new setups, understanding market mechanics",
      when: "When you want to learn something new" },
    { label: "Review", color: "#ef4444", desc: "Post-Trade Analysis & Feedback", emoji: "📋",
      focus: "Breaks down your executed trades objectively, identifies edge leaks, grading each decision against your own framework.",
      bestFor: "After closing trades, end-of-day review",
      when: "After your trading day or closing a position" },
    { label: "Psych", color: "#14b8a6", desc: "Behavioral & Emotional Investigation", emoji: "🧠",
      focus: "Maps your emotional landscape in real-time, identifies cognitive biases, and tracks how psychology affects execution.",
      bestFor: "When feeling off, tracking mood patterns",
      when: "When emotions are affecting your trading" },
  ]

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="text-center py-3 rounded-lg border border-purple-500/10" style={{ background: "rgba(139,92,246,0.03)" }}>
        <p className="text-[11px] font-mono font-black text-purple-300/90 tracking-[0.2em] uppercase">Your Trading Intent</p>
        <p className="text-[9px] font-mono text-purple-400/50 mt-0.5">Tell the AI what you need</p>
      </div>

      {/* Minimal connector */}
      <div className="flex flex-col items-center -my-1">
        <div className="w-7 h-7 rounded-full border border-purple-500/25 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.06)" }}>
          <div className="w-2 h-2 rounded-full bg-purple-400/50" />
        </div>
        <div className="w-px h-3 bg-gradient-to-b from-purple-500/20 to-purple-500/5" />
      </div>

      {/* 8 INTELLIGENCE ENGINES */}
      <div className="rounded-lg border border-purple-500/10 overflow-hidden" style={{ background: "rgba(139,92,246,0.02)" }}>
        <div className="px-4 py-2.5 border-b border-purple-500/8" style={{ background: "rgba(139,92,246,0.04)" }}>
          <p className="text-center text-[13px] font-mono font-black text-purple-200/90 tracking-[0.18em] uppercase">8 Intelligence Engines</p>
          <p className="text-center text-[9px] font-mono text-purple-300/45 mt-0.5">Click to expand details</p>
        </div>

        {/* Engine grid - 2 columns */}
        <div className="p-2.5 space-y-2">
          {/* Row by row for visual balance */}
          {[0, 2, 4, 6].map(rowStart => (
            <div key={rowStart} className="grid grid-cols-2 gap-2">
              {modes.slice(rowStart, rowStart + 2).map((m, localIdx) => {
                const i = rowStart + localIdx
                const isExpanded = expandedIdx === i
                const isActive = i === 0

                return (
                  <div
                    key={m.label}
                    onClick={() => setExpandedIdx(isExpanded ? null : i)}
                    className={`rounded-md cursor-pointer transition-all duration-200 overflow-hidden ${isExpanded ? "col-span-2" : ""}`}
                    style={{
                      background: isExpanded ? `${m.color}0c` : isActive ? `${m.color}08` : `${m.color}04`,
                      border: `1px solid ${isExpanded ? m.color + "30" : isActive ? m.color + "25" : m.color + "12"}`,
                    }}
                  >
                    {/* Collapsed: emoji + name + chevron */}
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{m.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[12px] font-mono font-black" style={{ color: m.color }}>{m.label}</p>
                            {isActive && <span className="text-[7px] font-mono font-black tracking-wider px-1.5 py-0.5 rounded" style={{ color: "#34d399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>ACTIVE</span>}
                          </div>
                          <p className="text-[9px] font-mono truncate" style={{ color: m.color + "88" }}>{m.desc}</p>
                        </div>
                      </div>
                      <svg width="10" height="10" viewBox="0 0 10 10" className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        <path d="M2 3.5L5 6.5L8 3.5" stroke={m.color + "66"} strokeWidth="1.2" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 space-y-2.5 border-t" style={{ borderColor: m.color + "15" }}>
                        <div>
                          <p className="text-[8px] font-mono font-black tracking-wider uppercase mb-1" style={{ color: m.color + "66" }}>What It Does</p>
                          <p className="text-[11px] font-mono leading-relaxed" style={{ color: m.color + "bb" }}>{m.focus}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded" style={{ background: `${m.color}06` }}>
                            <p className="text-[7px] font-mono font-bold uppercase mb-0.5" style={{ color: m.color + "55" }}>Best For</p>
                            <p className="text-[9px] font-mono" style={{ color: m.color + "88" }}>{m.bestFor}</p>
                          </div>
                          <div className="p-2 rounded" style={{ background: `${m.color}06` }}>
                            <p className="text-[7px] font-mono font-bold uppercase mb-0.5" style={{ color: m.color + "55" }}>When to Use</p>
                            <p className="text-[9px] font-mono" style={{ color: m.color + "88" }}>{m.when}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Connector to selected */}
      <div className="flex flex-col items-center -my-1">
        <div className="w-px h-4 bg-gradient-to-b from-purple-500/15 to-emerald-500/15" />
        <p className="text-[8px] font-mono text-purple-400/40 font-bold tracking-wider">SELECTED</p>
      </div>

      {/* ENGINE LOADED - Compact */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "rgba(52,211,153,0.15)", background: "rgba(52,211,153,0.02)" }}>
        <div className="px-4 py-2 border-b border-emerald-500/10" style={{ background: "rgba(52,211,153,0.04)" }}>
          <p className="text-center text-[11px] font-mono font-black text-emerald-300/85 tracking-[0.15em] uppercase">Engine Loaded</p>
        </div>
        <div className="p-3 space-y-2.5">
          {/* Active engine */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🔍</span>
              <p className="text-[11px] font-mono font-black text-emerald-300/90">Analyst Engine Active</p>
            </div>
            <span className="text-[8px] font-mono font-black text-emerald-400/60 tracking-wider px-2 py-1 rounded" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)" }}>READY</span>
          </div>

          {/* Framework description */}
          <div className="p-2.5 rounded" style={{ background: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.08)" }}>
            <p className="text-[8px] font-mono font-bold text-indigo-400/60 uppercase tracking-wider mb-1">Active Framework</p>
            <p className="text-[10px] font-mono text-purple-300/65 leading-relaxed">Pattern-Based Market Reasoning -- Reads structure, levels, and institutional footprints from price data to build directional bias backed by evidence.</p>
          </div>

          {/* Parameters row */}
          <div className="grid grid-cols-3 gap-2">
            {[{ l: "Depth", v: "Full" }, { l: "Scope", v: "Trade-level" }, { l: "Response", v: "Structured" }].map(p => (
              <div key={p.l} className="rounded p-2 text-center" style={{ background: "rgba(52,211,153,0.03)", border: "1px solid rgba(52,211,153,0.08)" }}>
                <p className="text-[7px] font-mono font-bold text-emerald-500/45 uppercase">{p.l}</p>
                <p className="text-[10px] font-mono font-black text-emerald-400/75 mt-0.5">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── STEP 2 (GUIDED SESSION): Situational Deep Scan ── */
export function CalibrateSvg() {
  const sc = {
    positions: "#22d3ee",
    pnl: "#f59e0b",
    session: "#10b981",
    emotion: "#f472b6",
    rules: "#3b82f6",
  }

  const channels = [
    { label: "Open Positions Scanner", color: sc.positions, sub: "Active Trade Context",
      desc: "Reads all your open positions, entry prices, current P&L per trade, how long you have been holding, and whether you are over-exposed",
      reads: ["Current open lots", "Entry price vs market", "Hold duration", "Unrealized P&L"] },
    { label: "P&L Momentum Tracker", color: sc.pnl, sub: "Profit & Loss Velocity",
      desc: "Tracks your session P&L direction, speed of gains or losses, whether you are in drawdown recovery, and compares to your daily average",
      reads: ["Session P&L direction", "Loss velocity", "Drawdown depth %", "vs Daily average"] },
    { label: "Session Timing Analyzer", color: sc.session, sub: "Trading Schedule Intelligence",
      desc: "Knows what time you started, how long you have been active, whether you are in your optimal trading window, and if fatigue patterns are emerging",
      reads: ["Session start time", "Active duration", "Optimal window?", "Fatigue indicators"] },
    { label: "Emotional State Detector", color: sc.emotion, sub: "Psychological Signal Mapping",
      desc: "Detects frustration, revenge impulses, overconfidence after wins, fear after losses, and urgency that leads to impulsive entries",
      reads: ["Tilt probability", "Revenge impulse", "Confidence level", "Urgency signal"] },
    { label: "Rule Compliance Checker", color: sc.rules, sub: "Personal Trading Rules Overlay",
      desc: "Cross-references every action against your custom trading rules: max position size, daily loss limits, setup checklist requirements, and session boundaries",
      reads: ["Position size check", "Loss limit status", "Checklist score", "Boundary breach?"] },
  ]

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="px-4 py-3 rounded-lg text-center" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.15)" }}>
        <p className="text-[13px] font-mono font-black text-cyan-300/90 tracking-[0.18em] uppercase">Real-Time State Reader</p>
        <p className="text-[10px] font-mono text-cyan-400/55 mt-1">AI scans your full trading context before generating any response</p>
      </div>

      {/* Scanner animation + label */}
      <div className="flex flex-col items-center gap-1">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="18" fill="rgba(34,211,238,0.04)" stroke="rgba(34,211,238,0.2)" strokeWidth="0.8" />
          <path d="M26 26 L26 8 A18,18 0 0,1 42 18 Z" fill="rgba(34,211,238,0.06)">
            <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="6s" repeatCount="indefinite" />
          </path>
          <line x1="18" y1="26" x2="34" y2="26" stroke="rgba(34,211,238,0.35)" strokeWidth="0.6" />
          <line x1="26" y1="18" x2="26" y2="34" stroke="rgba(34,211,238,0.35)" strokeWidth="0.6" />
          <circle cx="26" cy="26" r="2.5" fill="rgba(34,211,238,0.55)" />
        </svg>
        <p className="text-[9px] font-mono font-black text-cyan-400/50 tracking-[0.15em]">SCANNING TRADER STATE</p>
      </div>

      {/* Section label */}
      <div className="text-center">
        <p className="text-[13px] font-mono font-black text-cyan-300/80 tracking-[0.15em] uppercase">5 Deep Scan Channels</p>
        <p className="text-[10px] font-mono text-cyan-400/45 mt-0.5">Each channel reads a different dimension of your trading state</p>
      </div>

      {/* Channel cards — LEFT: label + description, RIGHT: 2×2 metric boxes */}
      <div className="space-y-2.5">
        {channels.map((ch, i) => (
          <div key={ch.label} className="rounded-lg overflow-hidden" style={{ background: `${ch.color}05`, border: `1px solid ${ch.color}18` }}>
            <div className="flex gap-3 p-3">
              {/* LEFT: title + subtitle + description */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                <div>
                  <p className="text-[12px] font-mono font-black uppercase tracking-wide" style={{ color: `${ch.color}ee` }}>{ch.label}</p>
                  <p className="text-[10px] font-mono font-bold mt-0.5" style={{ color: `${ch.color}88` }}>{ch.sub}</p>
                </div>
                <p className="text-[9px] font-mono leading-relaxed" style={{ color: `${ch.color}66` }}>{ch.desc}</p>
              </div>

              {/* RIGHT: 2×2 grid of metric boxes */}
              <div className="shrink-0 grid grid-cols-2 gap-1.5 w-[160px]">
                {ch.reads.map((r, j) => (
                  <div key={`r-${j}`} className="px-2 py-1.5 rounded-md flex flex-col gap-0.5" style={{ background: `${ch.color}08`, border: `1px solid ${ch.color}14` }}>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ch.color, opacity: 0.4 }} />
                      <p className="text-[10px] font-mono font-black leading-tight" style={{ color: `${ch.color}cc` }}>{r}</p>
                    </div>
                    <p className="text-[8px] font-mono" style={{ color: `${ch.color}44` }}>reading...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer merge line */}
      <div className="pt-1 space-y-1.5">
        <p className="text-center text-[9px] font-mono font-black text-cyan-400/50 tracking-[0.12em] uppercase">All 5 Channels Merge Into Unified State</p>
        <div className="px-4 py-2.5 rounded-lg text-center" style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)" }}>
          <p className="text-[12px] font-mono font-black text-emerald-300/85 tracking-[0.12em] uppercase">State Profile Complete</p>
          <p className="text-[10px] font-mono text-cyan-400/50 mt-0.5">Full trading context captured -- AI response calibrated to your exact state</p>
        </div>
      </div>
    </div>
  )
}

/* ── Render the correct SVG for Guided Session pipeline steps ── */
export function GuidedSessionStageSvg({ svgType, color }: { svgType: string; color: string }) {
  if (svgType === "mode-grid") return <ModeGridSvg color={color} />
  if (svgType === "calibrate") return <CalibrateSvg />
  return null
}
