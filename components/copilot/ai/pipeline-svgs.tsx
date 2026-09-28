"use client"

/* ═══════════════════════════════════════════════════════════════
   Pipeline SVG Visualizations
   Extracted from IntelligenceBoard to keep bundle size manageable.
   Each export renders the SVG for one pipeline stage.
   ═══════════════════════════════════════════════════════════════ */

interface StageProps {
  color: string
}

/* ── STEP 1 (AI COPILOT): Capture ── */
export function CaptureSvg({ color: sc }: StageProps) {
  const scanColors = {
    psy: "#f472b6",
    dis: "#60a5fa",
    str: "#fbbf24",
    rsk: "#f87171",
  }
  return (
    <svg width="100%" viewBox="0 0 320 340" preserveAspectRatio="xMidYMid meet" className="block p-1">
      <rect x="40" y="4" width="240" height="36" rx="6" fill={`${sc}08`} stroke={`${sc}28`} strokeWidth="0.7" />
      <rect x="40" y="4" width="240" height="16" rx="6" fill={`${sc}06`} />
      <rect x="40" y="16" width="240" height="4" fill={`${sc}06`} />
      <text x="160" y="17" textAnchor="middle" fill={`${sc}dd`} fontSize="11" fontFamily="monospace" fontWeight="900" letterSpacing="1.5">YOUR TRADING ACTIVITY</text>
      <text x="160" y="33" textAnchor="middle" fill={`${sc}88`} fontSize="6" fontFamily="monospace" fontWeight="700">Every entry, exit, hesitation, timing, and position size you make</text>
      <line x1="160" y1="42" x2="160" y2="62" stroke={`${sc}22`} strokeWidth="0.8" strokeDasharray="3 2">
        <animate attributeName="stroke-dashoffset" values="0;-10" dur="1.2s" repeatCount="indefinite" />
      </line>
      <polygon points="157,60 160,65 163,60" fill={`${sc}40`} />
      <text x="174" y="55" fill={`${sc}55`} fontSize="5" fontFamily="monospace" fontWeight="700">passive capture</text>
      <text x="160" y="76" textAnchor="middle" fill={`${sc}cc`} fontSize="9" fontFamily="monospace" fontWeight="900" letterSpacing="2">4 PARALLEL SCANNERS</text>
      <text x="160" y="85" textAnchor="middle" fill={`${sc}66`} fontSize="5" fontFamily="monospace" fontWeight="700">Each scanner runs independently on your live behavior</text>
      <line x1="160" y1="88" x2="80" y2="98" stroke={`${scanColors.psy}25`} strokeWidth="0.5" />
      <line x1="160" y1="88" x2="240" y2="98" stroke={`${scanColors.dis}25`} strokeWidth="0.5" />
      <line x1="160" y1="88" x2="80" y2="186" stroke={`${scanColors.str}25`} strokeWidth="0.5" />
      <line x1="160" y1="88" x2="240" y2="186" stroke={`${scanColors.rsk}25`} strokeWidth="0.5" />
      {([
        { label: "PSYCHOLOGY", sub: "Emotional Signal Detection", emoji: "\u{1F9E0}", color: scanColors.psy,
          metrics: [
            { name: "Fear Response Index", desc: "Measures hesitation after losses" },
            { name: "Greed Acceleration Pulse", desc: "Detects over-sizing after wins" },
            { name: "Tilt Severity Score", desc: "Emotional deviation from baseline" },
          ], x: 4, y: 96 },
        { label: "DISCIPLINE", sub: "Rule Adherence Tracking", emoji: "\u{1F4CB}", color: scanColors.dis,
          metrics: [
            { name: "Checklist Compliance %", desc: "Pre-trade steps completed" },
            { name: "Rule Deviation Counter", desc: "How often you break your plan" },
            { name: "Session Boundary Score", desc: "Trading within allowed hours" },
          ], x: 162, y: 96 },
        { label: "STRATEGY", sub: "Setup Execution Quality", emoji: "\u{1F3AF}", color: scanColors.str,
          metrics: [
            { name: "Timeframe Alignment", desc: "Are you on the right chart?" },
            { name: "Edge Quality Score", desc: "Does this match your edge?" },
            { name: "Context Awareness", desc: "Market regime recognition" },
          ], x: 4, y: 184 },
        { label: "RISK", sub: "Exposure Control Mapping", emoji: "\u26A0\uFE0F", color: scanColors.rsk,
          metrics: [
            { name: "Correlation Overlap", desc: "How connected your positions are" },
            { name: "Concentration Heat", desc: "Position clustering intensity" },
            { name: "Drawdown Trajectory", desc: "Session loss velocity tracking" },
          ], x: 162, y: 184 },
      ] as const).map((ch, i) => (
        <g key={ch.label}>
          <rect x={ch.x} y={ch.y} width="154" height="82" rx="5" fill={`${ch.color}08`} stroke={`${ch.color}22`} strokeWidth="0.5" />
          <rect x={ch.x} y={ch.y} width="154" height="20" rx="5" fill={`${ch.color}0c`} />
          <rect x={ch.x} y={ch.y + 16} width="154" height="4" fill={`${ch.color}0c`} />
          <text x={ch.x + 14} y={ch.y + 15} textAnchor="middle" fontSize="11">{ch.emoji}</text>
          <text x={ch.x + 26} y={ch.y + 12} fill={`${ch.color}ee`} fontSize="8" fontFamily="monospace" fontWeight="900" letterSpacing="0.5">{ch.label}</text>
          <text x={ch.x + 26} y={ch.y + 28} fill={`${ch.color}bb`} fontSize="5.5" fontFamily="monospace" fontWeight="800">{ch.sub}</text>
          {ch.metrics.map((m, j) => {
            const my = ch.y + 36 + j * 15
            return (
              <g key={`m-${j}`}>
                <rect x={ch.x + 4} y={my} width="146" height="12" rx="2.5" fill={`${ch.color}06`} stroke={`${ch.color}0c`} strokeWidth="0.3" />
                <text x={ch.x + 9} y={my + 5.5} fill={`${ch.color}cc`} fontSize="5" fontFamily="monospace" fontWeight="800">{m.name}</text>
                <text x={ch.x + 9} y={my + 10.5} fill={`${ch.color}66`} fontSize="3.5" fontFamily="monospace" fontWeight="600">{m.desc}</text>
                <circle cx={ch.x + 142} cy={my + 6} r="2.5" fill={`${ch.color}15`} stroke={`${ch.color}30`} strokeWidth="0.3" />
                <circle cx={ch.x + 142} cy={my + 6} r="1.5" fill={`${ch.color}`} opacity="0.4">
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${2 + i * 0.3 + j * 0.2}s`} repeatCount="indefinite" />
                </circle>
              </g>
            )
          })}
          <circle cx={ch.x + 145} cy={ch.y + 10} r="2" fill={`${ch.color}`} opacity="0.3">
            <animate attributeName="opacity" values="0.15;0.55;0.15" dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <line x1="80" y1="178" x2="160" y2="280" stroke={`${scanColors.psy}15`} strokeWidth="0.5" />
      <line x1="240" y1="178" x2="160" y2="280" stroke={`${scanColors.dis}15`} strokeWidth="0.5" />
      <line x1="80" y1="266" x2="160" y2="280" stroke={`${scanColors.str}15`} strokeWidth="0.5" />
      <line x1="240" y1="266" x2="160" y2="280" stroke={`${scanColors.rsk}15`} strokeWidth="0.5" />
      <polygon points="158,278 160,283 162,278" fill={`${sc}30`} />
      <rect x="10" y="286" width="300" height="48" rx="6" fill={`${sc}06`} stroke="rgba(52,211,153,0.2)" strokeWidth="0.7">
        <animate attributeName="stroke-opacity" values="0.12;0.28;0.12" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <rect x="10" y="286" width="300" height="18" rx="6" fill="rgba(52,211,153,0.04)" />
      <rect x="10" y="300" width="300" height="4" fill="rgba(52,211,153,0.04)" />
      <circle cx="24" cy="296" r="3.5" fill="#34d399" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.85;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x="34" y="299" fill="rgba(187,247,208,0.92)" fontSize="10" fontFamily="monospace" fontWeight="900" letterSpacing="1.5">CONTINUOUS DATA FEED</text>
      <rect x="252" y="289" width="50" height="12" rx="3" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.2)" strokeWidth="0.3" />
      <text x="277" y="298" textAnchor="middle" fill="rgba(52,211,153,0.8)" fontSize="5" fontFamily="monospace" fontWeight="900">STREAMING</text>
      <text x="24" y="314" fill={`${sc}99`} fontSize="6" fontFamily="monospace" fontWeight="700">Merged 4-channel behavioral stream delivering real-time data</text>
      <text x="24" y="325" fill={`${sc}55`} fontSize="5" fontFamily="monospace" fontWeight="600">Psychology + Discipline + Strategy + Risk = Complete Behavioral Profile</text>
      <rect x="24" y="330" width="272" height="2" rx="1" fill={`${sc}06`} />
      <rect x="24" y="330" width="0" height="2" rx="1" fill="rgba(52,211,153,0.25)">
        <animate attributeName="width" values="0;272;0" dur="4s" repeatCount="indefinite" />
      </rect>
      <circle r="2" fill={scanColors.psy} opacity="0">
        <animateMotion dur="3.5s" repeatCount="indefinite" path="M80,120 L160,280 L100,310" />
        <animate attributeName="opacity" values="0;0.5;0.3;0.5;0" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2" fill={scanColors.dis} opacity="0">
        <animateMotion dur="3.8s" begin="0.8s" repeatCount="indefinite" path="M240,120 L160,280 L200,310" />
        <animate attributeName="opacity" values="0;0.4;0.5;0.3;0" dur="3.8s" begin="0.8s" repeatCount="indefinite" />
      </circle>
      <circle r="2" fill={scanColors.str} opacity="0">
        <animateMotion dur="2.5s" begin="1.5s" repeatCount="indefinite" path="M80,220 L160,280 L140,310" />
        <animate attributeName="opacity" values="0;0.5;0.4;0.6;0" dur="2.5s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      <circle r="1.5" fill={scanColors.rsk} opacity="0">
        <animateMotion dur="2.8s" begin="2s" repeatCount="indefinite" path="M240,220 L160,280 L180,310" />
        <animate attributeName="opacity" values="0;0.4;0.5;0.4;0" dur="2.8s" begin="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/* ── STEP 2 (AI COPILOT): Detect / Pattern Recognition ── */
export function DetectSvg() {
  const p = {
    head: "#67e8f9",
    text: "rgba(103,232,249,0.9)",
    sub: "rgba(103,232,249,0.7)",
    mid: "rgba(103,232,249,0.5)",
    dim: "rgba(103,232,249,0.25)",
    faint: "rgba(103,232,249,0.1)",
    bg: "rgba(103,232,249,0.03)",
    baseline: "#a78bfa",
    biases: "#f472b6",
    history: "#34d399",
  }
  return (
    <svg width="100%" viewBox="0 0 320 440" preserveAspectRatio="xMidYMid meet" className="block p-1">
      <rect x="30" y="4" width="260" height="36" rx="6" fill={p.bg} stroke={p.faint} strokeWidth="0.6" />
      <rect x="30" y="4" width="260" height="16" rx="6" fill="rgba(103,232,249,0.05)" />
      <rect x="30" y="16" width="260" height="4" fill="rgba(103,232,249,0.05)" />
      <text x="160" y="17" textAnchor="middle" fill={p.head} fontSize="10" fontFamily="monospace" fontWeight="900" letterSpacing="1.2">INCOMING DATA STREAM</text>
      <text x="160" y="33" textAnchor="middle" fill={p.sub} fontSize="5.5" fontFamily="monospace" fontWeight="700">Live behavioral data flowing from Step 01 capture layer</text>
      <line x1="160" y1="42" x2="160" y2="56" stroke={p.dim} strokeWidth="0.6" strokeDasharray="3 2">
        <animate attributeName="stroke-dashoffset" values="0;-8" dur="2s" repeatCount="indefinite" />
      </line>
      <polygon points="157.5,54 160,59 162.5,54" fill={p.dim} />
      <rect x="4" y="62" width="312" height="84" rx="6" fill={p.bg} stroke={p.faint} strokeWidth="0.5" />
      <text x="160" y="74" textAnchor="middle" fill={p.head} fontSize="8" fontFamily="monospace" fontWeight="900" letterSpacing="1.5">CROSS-REFERENCE ENGINE</text>
      <text x="160" y="83" textAnchor="middle" fill={p.mid} fontSize="4.5" fontFamily="monospace" fontWeight="700">Four sequential processing stages applied to every data point</text>
      {[
        { emoji: "\u{1F9F9}", label: "NORMALIZE", desc: "Clean raw data,", desc2: "apply weights", color: "#67e8f9" },
        { emoji: "\u{1F50D}", label: "COMPARE", desc: "Match against", desc2: "your baseline", color: "#a78bfa" },
        { emoji: "\u26A1", label: "DETECT", desc: "Flag deviations", desc2: "& anomalies", color: "#fbbf24" },
        { emoji: "\u{1F3AF}", label: "SCORE", desc: "Rank severity", desc2: "0-100 scale", color: "#f472b6" },
      ].map((stg, i) => {
        const sx = 10 + i * 76
        return (
          <g key={stg.label}>
            <rect x={sx} y="88" width="68" height="50" rx="4" fill={`${stg.color}08`} stroke={`${stg.color}22`} strokeWidth="0.4" />
            <text x={sx + 14} y="102" textAnchor="middle" fontSize="10">{stg.emoji}</text>
            <text x={sx + 24} y="100" fill={`${stg.color}`} fontSize="6.5" fontFamily="monospace" fontWeight="900">{stg.label}</text>
            <text x={sx + 34} y="112" textAnchor="middle" fill={`${stg.color}aa`} fontSize="4.2" fontFamily="monospace" fontWeight="700">{stg.desc}</text>
            <text x={sx + 34} y="118" textAnchor="middle" fill={`${stg.color}77`} fontSize="4.2" fontFamily="monospace" fontWeight="600">{stg.desc2}</text>
            <circle cx={sx + 60} cy="92" r="2" fill={`${stg.color}`} opacity="0.35">
              <animate attributeName="opacity" values="0.15;0.55;0.15" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
            {i < 3 && (
              <g>
                <line x1={sx + 70} y1="113" x2={sx + 76} y2="113" stroke={p.dim} strokeWidth="0.5" />
                <polygon points={`${sx + 74},111.5 ${sx + 77},113 ${sx + 74},114.5`} fill={p.dim} />
              </g>
            )}
          </g>
        )
      })}
      <rect x="10" y="140" width="0" height="1.5" rx="0.75" fill="rgba(103,232,249,0.2)">
        <animate attributeName="width" values="0;296;296;0" dur="6s" repeatCount="indefinite" />
        <animate attributeName="x" values="10;10;10;306" dur="6s" repeatCount="indefinite" />
      </rect>
      <text x="160" y="158" textAnchor="middle" fill={p.mid} fontSize="5" fontFamily="monospace" fontWeight="800" letterSpacing="0.8">COMPARED AGAINST 3 REFERENCE DATABASES</text>
      <line x1="160" y1="162" x2="80" y2="176" stroke={`${p.baseline}22`} strokeWidth="0.6" />
      <line x1="160" y1="162" x2="160" y2="176" stroke={`${p.biases}22`} strokeWidth="0.6" />
      <line x1="160" y1="162" x2="240" y2="176" stroke={`${p.history}22`} strokeWidth="0.6" />
      {[
        { label: "YOUR BASELINE", emoji: "\u{1F4CA}", sub: "Established Normal Behavior", color: p.baseline,
          items: [
            { name: "Average Trade Frequency", desc: "How often you typically trade per session" },
            { name: "Standard Position Sizing", desc: "Your normal lot size and risk per trade" },
            { name: "Session Duration Norms", desc: "Expected active time in each session" },
          ], x: 4 },
        { label: "COGNITIVE BIASES", emoji: "\u{1F9E0}", sub: "12+ Known Behavioral Traps", color: p.biases,
          items: [
            { name: "Loss Aversion Detection", desc: "Holding losers too long, cutting winners early" },
            { name: "Recency Bias Tracking", desc: "Over-weighting recent trades in decisions" },
            { name: "Anchoring Pattern Scan", desc: "Fixating on entry price or recent levels" },
          ], x: 108 },
        { label: "TRADE HISTORY", emoji: "\u{1F4C8}", sub: "Outcome Correlation Analysis", color: p.history,
          items: [
            { name: "Win/Loss Ratio Trends", desc: "How your hit rate changes under stress" },
            { name: "Streak Pattern Analysis", desc: "Behavior shifts during wins or loss streaks" },
            { name: "P&L Curve Trajectory", desc: "Equity curve shape and drawdown patterns" },
          ], x: 212 },
      ].map((db, i) => (
        <g key={db.label}>
          <rect x={db.x} y="178" width="100" height="132" rx="5" fill={`${db.color}08`} stroke={`${db.color}22`} strokeWidth="0.5" />
          <rect x={db.x} y="178" width="100" height="20" rx="5" fill={`${db.color}0c`} />
          <rect x={db.x} y="194" width="100" height="4" fill={`${db.color}0c`} />
          <text x={db.x + 14} y="191" fontSize="9">{db.emoji}</text>
          <text x={db.x + 26} y="190" fill={`${db.color}ee`} fontSize="5.5" fontFamily="monospace" fontWeight="900" letterSpacing="0.3">{db.label}</text>
          <text x={db.x + 50} y="206" textAnchor="middle" fill={`${db.color}bb`} fontSize="4" fontFamily="monospace" fontWeight="800">{db.sub}</text>
          {db.items.map((item, j) => {
            const iy = 212 + j * 30
            return (
              <g key={`item-${j}`}>
                <rect x={db.x + 4} y={iy} width="92" height="26" rx="3" fill={`${db.color}06`} stroke={`${db.color}0e`} strokeWidth="0.3" />
                <circle cx={db.x + 10} cy={iy + 8} r="2" fill={`${db.color}`} opacity="0.4">
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${3 + i * 0.6 + j * 0.4}s`} repeatCount="indefinite" />
                </circle>
                <text x={db.x + 16} y={iy + 10} fill={`${db.color}dd`} fontSize="4.2" fontFamily="monospace" fontWeight="800">{item.name}</text>
                <text x={db.x + 8} y={iy + 19} fill={`${db.color}66`} fontSize="3.3" fontFamily="monospace" fontWeight="600">{item.desc}</text>
              </g>
            )
          })}
        </g>
      ))}
      <line x1="54" y1="310" x2="160" y2="328" stroke={`${p.baseline}15`} strokeWidth="0.5" />
      <line x1="160" y1="310" x2="160" y2="328" stroke={`${p.biases}15`} strokeWidth="0.5" />
      <line x1="262" y1="310" x2="160" y2="328" stroke={`${p.history}15`} strokeWidth="0.5" />
      <polygon points="158,326 160,331 162,326" fill={p.dim} />
      <rect x="10" y="334" width="300" height="100" rx="6" fill={p.bg} stroke={p.faint} strokeWidth="0.6" />
      <rect x="10" y="334" width="300" height="18" rx="6" fill="rgba(103,232,249,0.05)" />
      <rect x="10" y="348" width="300" height="4" fill="rgba(103,232,249,0.05)" />
      <text x="160" y="347" textAnchor="middle" fill={p.head} fontSize="9" fontFamily="monospace" fontWeight="900" letterSpacing="1.5">PATTERN MATCH RESULTS</text>
      <text x="160" y="358" textAnchor="middle" fill={p.mid} fontSize="4.5" fontFamily="monospace" fontWeight="700">Deviations scored, classified, and queued for alert generation</text>
      {[
        { level: "CRITICAL", emoji: "\u{1F534}", desc: "Immediate capital threat identified", color: "#ef4444", score: "90-100", count: "1 pattern" },
        { level: "HIGH", emoji: "\u{1F7E0}", desc: "Active edge degradation detected", color: "#f59e0b", score: "70-89", count: "2 patterns" },
        { level: "MEDIUM", emoji: "\u{1F535}", desc: "Developing behavioral concern", color: "#3b82f6", score: "40-69", count: "3 patterns" },
      ].map((sev, i) => {
        const sy = 364 + i * 22
        return (
          <g key={sev.level}>
            <rect x="16" y={sy} width="288" height="18" rx="3.5" fill={`${sev.color}08`} stroke={`${sev.color}18`} strokeWidth="0.4" />
            <text x="26" y={sy + 12} fontSize="7">{sev.emoji}</text>
            <text x="38" y={sy + 12} fill={`${sev.color}ee`} fontSize="6.5" fontFamily="monospace" fontWeight="900">{sev.level}</text>
            <text x="110" y={sy + 12} fill={`${sev.color}99`} fontSize="4.5" fontFamily="monospace" fontWeight="700">{sev.desc}</text>
            <rect x="246" y={sy + 3} width="28" height="12" rx="3" fill={`${sev.color}12`} stroke={`${sev.color}28`} strokeWidth="0.3" />
            <text x="260" y={sy + 12} textAnchor="middle" fill={`${sev.color}cc`} fontSize="4.5" fontFamily="monospace" fontWeight="900">{sev.score}</text>
            <text x="282" y={sy + 12} fill={`${sev.color}55`} fontSize="3.5" fontFamily="monospace">{sev.count}</text>
            <circle cx="20" cy={sy + 9} r="1.5" fill={`${sev.color}`} opacity="0.3">
              <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${4 + i * 0.8}s`} repeatCount="indefinite" />
            </circle>
          </g>
        )
      })}
      <text x="20" y="428" fill={p.dim} fontSize="3.5" fontFamily="monospace">Pattern engine processing</text>
      <text x="300" y="428" textAnchor="end" fill={p.head} fontSize="3.5" fontFamily="monospace" fontWeight="700">6 patterns detected</text>
      <circle r="2" fill={p.baseline} opacity="0">
        <animateMotion dur="6s" repeatCount="indefinite" path="M160,20 L160,60 L80,110 L54,240 L160,328 L100,380" />
        <animate attributeName="opacity" values="0;0.4;0.35;0.5;0.3;0" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle r="1.5" fill={p.biases} opacity="0">
        <animateMotion dur="6.5s" begin="2s" repeatCount="indefinite" path="M160,20 L160,60 L160,110 L160,240 L160,328 L160,400" />
        <animate attributeName="opacity" values="0;0.35;0.45;0.3;0.4;0" dur="6.5s" begin="2s" repeatCount="indefinite" />
      </circle>
      <circle r="1.5" fill={p.history} opacity="0">
        <animateMotion dur="7s" begin="3.5s" repeatCount="indefinite" path="M160,20 L160,60 L240,110 L262,240 L160,328 L220,400" />
        <animate attributeName="opacity" values="0;0.4;0.3;0.5;0.35;0" dur="7s" begin="3.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/* ── STEP 3 (AI COPILOT): Intelligent Signal Routing ──
   REDESIGNED: Much larger fonts, clearer visual hierarchy, 
   animated arrow from problem to solution */
export function SurfaceSvg({ color: _color }: StageProps) {
  const W = 340
  const sig = {
    critical: "#ef4444",
    high: "#f59e0b",
    medium: "#3b82f6",
    route: "#10b981",
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} 780`} preserveAspectRatio="xMidYMid meet" className="block p-1">

      {/* ═══ INPUT: SCORED PATTERNS ═══ */}
      <rect x="20" y="4" width={W - 40} height="44" rx="8" fill="rgba(180,83,9,0.06)" stroke="rgba(180,83,9,0.2)" strokeWidth="0.6" />
      <text x={W / 2} y="22" textAnchor="middle" fill="rgba(251,191,36,0.95)" fontSize="12" fontFamily="monospace" fontWeight="900" letterSpacing="1.5">SCORED PATTERNS RECEIVED</text>
      <text x={W / 2} y="38" textAnchor="middle" fill="rgba(251,191,36,0.55)" fontSize="7" fontFamily="monospace" fontWeight="700">6 patterns detected, ranked by severity</text>

      {/* Arrow down */}
      <line x1={W / 2} y1="50" x2={W / 2} y2="66" stroke="rgba(180,83,9,0.2)" strokeWidth="1" strokeDasharray="4 3">
        <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.5s" repeatCount="indefinite" />
      </line>
      <polygon points={`${W / 2 - 5},64 ${W / 2},72 ${W / 2 + 5},64`} fill="rgba(180,83,9,0.3)" />

      {/* ═══ SIGNAL DECISION LAYER ═══ */}
      <rect x="4" y="76" width={W - 8} height="330" rx="8" fill="rgba(180,83,9,0.02)" stroke="rgba(180,83,9,0.12)" strokeWidth="0.6" />
      <rect x="4" y="76" width={W - 8} height="28" rx="8" fill="rgba(180,83,9,0.05)" />
      <rect x="4" y="98" width={W - 8} height="6" fill="rgba(180,83,9,0.05)" />
      <text x={W / 2} y="96" textAnchor="middle" fill="rgba(251,191,36,0.9)" fontSize="12" fontFamily="monospace" fontWeight="900" letterSpacing="2">SIGNAL DECISION LAYER</text>
      <text x={W / 2} y="114" textAnchor="middle" fill="rgba(251,191,36,0.5)" fontSize="7" fontFamily="monospace" fontWeight="700">Pattern analysis + intervention mapping</text>

      {/* ═══ CRITICAL SIGNAL CARD ═══ */}
      {(() => {
        const cy = 126
        const cardH = 96
        return (
          <g>
            {/* Card with red glow */}
            <rect x="10" y={cy} width={W - 20} height={cardH} rx="6" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.6">
              <animate attributeName="stroke-opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
            </rect>

            {/* Header row: CRITICAL badge + pattern name + IMMEDIATE */}
            <rect x="16" y={cy + 6} width="70" height="22" rx="5" fill="rgba(239,68,68,0.18)" stroke="rgba(239,68,68,0.4)" strokeWidth="0.5" />
            <text x="51" y={cy + 21} textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="900">CRITICAL</text>

            <text x="94" y={cy + 21} fill="rgba(239,68,68,0.95)" fontSize="10" fontFamily="monospace" fontWeight="900">Revenge Trading</text>

            <rect x={W - 90} y={cy + 6} width="72" height="20" rx="5" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.4" />
            <text x={W - 54} y={cy + 20} textAnchor="middle" fill="rgba(239,68,68,0.85)" fontSize="8" fontFamily="monospace" fontWeight="900">IMMEDIATE</text>

            {/* TRIGGER row */}
            <rect x="16" y={cy + 34} width="56" height="14" rx="3" fill="rgba(251,191,36,0.08)" />
            <text x="44" y={cy + 45} textAnchor="middle" fill="rgba(251,191,36,0.85)" fontSize="8" fontFamily="monospace" fontWeight="900">TRIGGER</text>
            <text x="80" y={cy + 45} fill="rgba(251,191,36,0.75)" fontSize="7" fontFamily="monospace" fontWeight="700">3 rapid entries after loss, skipping checklist</text>

            {/* WHY row */}
            <rect x="16" y={cy + 52} width="36" height="14" rx="3" fill="rgba(244,114,182,0.08)" />
            <text x="34" y={cy + 63} textAnchor="middle" fill="rgba(244,114,182,0.85)" fontSize="8" fontFamily="monospace" fontWeight="900">WHY</text>
            <text x="60" y={cy + 63} fill="rgba(244,114,182,0.75)" fontSize="7" fontFamily="monospace" fontWeight="700">Emotional override -- frustration triggering impulsive recovery</text>

            {/* HISTORY row */}
            <rect x="16" y={cy + 70} width="56" height="14" rx="3" fill="rgba(34,211,238,0.08)" />
            <text x="44" y={cy + 81} textAnchor="middle" fill="rgba(34,211,238,0.85)" fontSize="8" fontFamily="monospace" fontWeight="900">HISTORY</text>
            <text x="80" y={cy + 81} fill="rgba(34,211,238,0.7)" fontSize="7" fontFamily="monospace" fontWeight="600">4 times this month, -2.3% drawdown each</text>

            {/* Pulsing dot */}
            <circle cx={W - 24} cy={cy + cardH - 12} r="4" fill="#ef4444" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )
      })()}

      {/* ═══ HIGH SIGNAL CARD ═══ */}
      {(() => {
        const cy = 230
        const cardH = 86
        return (
          <g>
            <rect x="10" y={cy} width={W - 20} height={cardH} rx="6" fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.18)" strokeWidth="0.5" />

            {/* Header */}
            <rect x="16" y={cy + 6} width="50" height="20" rx="4" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="0.4" />
            <text x="41" y={cy + 20} textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="900">HIGH</text>
            <text x="74" y={cy + 20} fill="rgba(245,158,11,0.9)" fontSize="9" fontFamily="monospace" fontWeight="900">Overtrading Cycle</text>

            <rect x={W - 86} y={cy + 6} width="68" height="18" rx="4" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.2)" strokeWidth="0.3" />
            <text x={W - 52} y={cy + 19} textAnchor="middle" fill="rgba(245,158,11,0.8)" fontSize="7" fontFamily="monospace" fontWeight="900">NEXT PAUSE</text>

            {/* Details */}
            <rect x="16" y={cy + 32} width="56" height="13" rx="3" fill="rgba(251,191,36,0.06)" />
            <text x="44" y={cy + 42} textAnchor="middle" fill="rgba(251,191,36,0.8)" fontSize="7" fontFamily="monospace" fontWeight="900">TRIGGER</text>
            <text x="80" y={cy + 42} fill="rgba(251,191,36,0.7)" fontSize="6.5" fontFamily="monospace" fontWeight="700">14 trades vs 5 avg, hold time dropped 73%</text>

            <rect x="16" y={cy + 48} width="36" height="13" rx="3" fill="rgba(244,114,182,0.06)" />
            <text x="34" y={cy + 58} textAnchor="middle" fill="rgba(244,114,182,0.8)" fontSize="7" fontFamily="monospace" fontWeight="900">WHY</text>
            <text x="60" y={cy + 58} fill="rgba(244,114,182,0.7)" fontSize="6.5" fontFamily="monospace" fontWeight="700">Dopamine-driven chasing, not setup quality</text>

            <rect x="16" y={cy + 64} width="56" height="13" rx="3" fill="rgba(34,211,238,0.06)" />
            <text x="44" y={cy + 74} textAnchor="middle" fill="rgba(34,211,238,0.8)" fontSize="7" fontFamily="monospace" fontWeight="900">HISTORY</text>
            <text x="80" y={cy + 74} fill="rgba(34,211,238,0.65)" fontSize="6.5" fontFamily="monospace" fontWeight="600">Win rate drops 58% to 31% on 10+ trade days</text>

            <circle cx={W - 24} cy={cy + cardH - 12} r="3" fill="#f59e0b" opacity="0.25">
              <animate attributeName="opacity" values="0.15;0.45;0.15" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        )
      })()}

      {/* ═══ MEDIUM SIGNAL CARD ═══ */}
      {(() => {
        const cy = 322
        const cardH = 78
        return (
          <g>
            <rect x="10" y={cy} width={W - 20} height={cardH} rx="6" fill="rgba(59,130,246,0.04)" stroke="rgba(59,130,246,0.14)" strokeWidth="0.4" />

            <rect x="16" y={cy + 6} width="60" height="18" rx="4" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.25)" strokeWidth="0.4" />
            <text x="46" y={cy + 19} textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="monospace" fontWeight="900">MEDIUM</text>
            <text x="84" y={cy + 18} fill="rgba(59,130,246,0.85)" fontSize="8" fontFamily="monospace" fontWeight="900">Position Sizing Drift</text>

            <rect x={W - 100} y={cy + 6} width="82" height="16" rx="4" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.18)" strokeWidth="0.3" />
            <text x={W - 59} y={cy + 18} textAnchor="middle" fill="rgba(59,130,246,0.75)" fontSize="6.5" fontFamily="monospace" fontWeight="900">END OF SESSION</text>

            <rect x="16" y={cy + 30} width="56" height="12" rx="3" fill="rgba(251,191,36,0.05)" />
            <text x="44" y={cy + 39} textAnchor="middle" fill="rgba(251,191,36,0.75)" fontSize="6.5" fontFamily="monospace" fontWeight="900">TRIGGER</text>
            <text x="80" y={cy + 39} fill="rgba(251,191,36,0.65)" fontSize="6" fontFamily="monospace" fontWeight="700">Last 3 trades at 2.4x standard lot size</text>

            <rect x="16" y={cy + 44} width="36" height="12" rx="3" fill="rgba(244,114,182,0.05)" />
            <text x="34" y={cy + 53} textAnchor="middle" fill="rgba(244,114,182,0.75)" fontSize="6.5" fontFamily="monospace" fontWeight="900">WHY</text>
            <text x="60" y={cy + 53} fill="rgba(244,114,182,0.65)" fontSize="6" fontFamily="monospace" fontWeight="700">Confidence creep from winning streak</text>

            <rect x="16" y={cy + 58} width="56" height="12" rx="3" fill="rgba(34,211,238,0.05)" />
            <text x="44" y={cy + 67} textAnchor="middle" fill="rgba(34,211,238,0.75)" fontSize="6.5" fontFamily="monospace" fontWeight="900">HISTORY</text>
            <text x="80" y={cy + 67} fill="rgba(34,211,238,0.6)" fontSize="6" fontFamily="monospace" fontWeight="600">Preceded -4.7% drawdown last month</text>

            <circle cx={W - 24} cy={cy + cardH - 12} r="3" fill="#3b82f6" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.35;0.1" dur="3.5s" repeatCount="indefinite" />
            </circle>
          </g>
        )
      })()}

      {/* ═══ ROUTING CONNECTOR ═══ */}
      <line x1={W / 2} y1="408" x2={W / 2} y2="430" stroke="rgba(16,185,129,0.2)" strokeWidth="1.2" strokeDasharray="5 3">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.2s" repeatCount="indefinite" />
      </line>
      <polygon points={`${W / 2 - 5},428 ${W / 2},438 ${W / 2 + 5},428`} fill="rgba(16,185,129,0.35)" />
      <text x={W / 2} y="424" textAnchor="middle" fill="rgba(52,211,153,0.5)" fontSize="7" fontFamily="monospace" fontWeight="900">ROUTING</text>

      {/* ═══ INTERVENTION ROUTING TABLE ═══ */}
      <rect x="4" y="442" width={W - 8} height="200" rx="8" fill="rgba(16,185,129,0.02)" stroke="rgba(16,185,129,0.12)" strokeWidth="0.6" />
      <rect x="4" y="442" width={W - 8} height="28" rx="8" fill="rgba(16,185,129,0.05)" />
      <rect x="4" y="464" width={W - 8} height="6" fill="rgba(16,185,129,0.05)" />
      <text x={W / 2} y="462" textAnchor="middle" fill="rgba(52,211,153,0.9)" fontSize="12" fontFamily="monospace" fontWeight="900" letterSpacing="2">INTERVENTION ROUTING</text>
      <text x={W / 2} y="480" textAnchor="middle" fill="rgba(52,211,153,0.5)" fontSize="7" fontFamily="monospace" fontWeight="700">Pattern mapped to AI session + action plan</text>

      {/* Route rows -- bigger, clearer, with animated arrow flow */}
      {[
        { signal: "Revenge Trading", from: sig.critical, engine: "Coach", mode: "Tilt Intervention",
          action: "Pause trading, emotional reset, re-commit to checklist",
          engineColor: "#f43f5e" },
        { signal: "Overtrading", from: sig.high, engine: "Mirror", mode: "Self-Reflection",
          action: "Review frequency, identify emotional driver behind volume",
          engineColor: "#06b6d4" },
        { signal: "Sizing Drift", from: sig.medium, engine: "Analyst", mode: "Risk Recalibration",
          action: "Audit exposure, recalculate sizing, reset risk parameters",
          engineColor: "#3b82f6" },
      ].map((r, i) => {
        const ry = 492 + i * 52
        return (
          <g key={r.signal}>
            {/* Row card */}
            <rect x="10" y={ry} width={W - 20} height="46" rx="5" fill={`${r.engineColor}05`} stroke={`${r.engineColor}15`} strokeWidth="0.5" />

            {/* Left: signal name with severity dot */}
            <circle cx="22" cy={ry + 16} r="5" fill={r.from} opacity="0.35">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${2.5 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
            <text x="34" y={ry + 20} fill={`${r.from}dd`} fontSize="10" fontFamily="monospace" fontWeight="900">{r.signal}</text>

            {/* Animated arrow flowing from signal to engine */}
            <line x1="130" y1={ry + 16} x2="168" y2={ry + 16} stroke="rgba(52,211,153,0.25)" strokeWidth="1.5" />
            <polygon points={`166,${ry + 12} 176,${ry + 16} 166,${ry + 20}`} fill="rgba(52,211,153,0.4)" />
            {/* Arrow particle */}
            <circle r="3" fill={r.from} opacity="0">
              <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={`M130,${ry + 16} L176,${ry + 16}`} />
              <animate attributeName="opacity" values="0;0.6;0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>

            {/* Right: engine box */}
            <rect x="180" y={ry + 4} width="80" height="28" rx="5" fill={`${r.engineColor}0c`} stroke={`${r.engineColor}25`} strokeWidth="0.5" />
            <text x="220" y={ry + 18} textAnchor="middle" fill={`${r.engineColor}`} fontSize="11" fontFamily="monospace" fontWeight="900">{r.engine}</text>
            <text x="220" y={ry + 28} textAnchor="middle" fill={`${r.engineColor}88`} fontSize="6" fontFamily="monospace" fontWeight="700">{r.mode}</text>

            {/* Live indicator */}
            <circle cx={W - 22} cy={ry + 16} r="3" fill={r.engineColor} opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${3 + i * 0.7}s`} repeatCount="indefinite" />
            </circle>

            {/* ACTION row */}
            <rect x="16" y={ry + 34} width="54" height="10" rx="2" fill="rgba(52,211,153,0.08)" />
            <text x="43" y={ry + 42} textAnchor="middle" fill="rgba(52,211,153,0.9)" fontSize="7" fontFamily="monospace" fontWeight="900">ACTION</text>
            <text x="78" y={ry + 42} fill="rgba(52,211,153,0.7)" fontSize="6.5" fontFamily="monospace" fontWeight="700">{r.action}</text>
          </g>
        )
      })}

      {/* ═══ DELIVERY CONNECTOR ═══ */}
      <line x1={W / 2} y1="644" x2={W / 2} y2="666" stroke="rgba(180,83,9,0.18)" strokeWidth="1" strokeDasharray="4 3">
        <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.5s" repeatCount="indefinite" />
      </line>
      <polygon points={`${W / 2 - 5},664 ${W / 2},674 ${W / 2 + 5},664`} fill="rgba(180,83,9,0.25)" />

      {/* ═══ DELIVERY QUEUE ═══ */}
      <rect x="4" y="678" width={W - 8} height="96" rx="8" fill="rgba(180,83,9,0.02)" stroke="rgba(180,83,9,0.12)" strokeWidth="0.5" />
      <rect x="4" y="678" width={W - 8} height="24" rx="8" fill="rgba(180,83,9,0.05)" />
      <rect x="4" y="698" width={W - 8} height="4" fill="rgba(180,83,9,0.05)" />
      <text x={W / 2} y="696" textAnchor="middle" fill="rgba(251,191,36,0.85)" fontSize="11" fontFamily="monospace" fontWeight="900" letterSpacing="2">DELIVERY QUEUE</text>
      <text x={W / 2} y="712" textAnchor="middle" fill="rgba(251,191,36,0.45)" fontSize="6.5" fontFamily="monospace" fontWeight="700">Timed by urgency -- critical fires now, drift waits</text>

      {/* Queue items */}
      {[
        { label: "Revenge Trading", timing: "NOW", color: sig.critical, desc: "Interrupt -- capital at risk" },
        { label: "Overtrading", timing: "NEXT PAUSE", color: sig.high, desc: "Queue for natural break" },
        { label: "Sizing Drift", timing: "SESSION END", color: sig.medium, desc: "Surface in review" },
      ].map((q, i) => {
        const qy = 720 + i * 22
        return (
          <g key={q.label}>
            <rect x="10" y={qy} width={W - 20} height="18" rx="4" fill={`${q.color}06`} stroke={`${q.color}15`} strokeWidth="0.4" />

            {/* Timing badge */}
            <rect x="16" y={qy + 3} width="70" height="12" rx="3" fill={`${q.color}15`} stroke={`${q.color}30`} strokeWidth="0.4" />
            <text x="51" y={qy + 12} textAnchor="middle" fill={`${q.color}`} fontSize="7" fontFamily="monospace" fontWeight="900">{q.timing}</text>

            {/* Signal name */}
            <text x="94" y={qy + 12} fill={`${q.color}cc`} fontSize="8" fontFamily="monospace" fontWeight="800">{q.label}</text>

            {/* Description */}
            <text x="210" y={qy + 12} fill={`${q.color}77`} fontSize="6.5" fontFamily="monospace" fontWeight="600">{q.desc}</text>

            {/* Live dot */}
            <circle cx={W - 22} cy={qy + 9} r="3" fill={q.color} opacity="0.3">
              <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${2.2 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        )
      })}

      {/* ═══ FLOW PARTICLES ═══ */}
      <circle r="3" fill={sig.critical} opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" path={`M${W / 2},20 L${W / 2},72 L${W / 4},170 L${W / 4},438 L60,520 L${W / 2},674 L${W / 4},730`} />
        <animate attributeName="opacity" values="0;0.5;0.35;0.5;0.3;0.45;0" dur="8s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/* ── Render the correct SVG for AI Copilot pipeline steps ── */
export function AiCopilotStageSvg({ svgType, color }: { svgType: string; color: string }) {
  if (svgType === "capture") return <CaptureSvg color={color} />
  if (svgType === "detect") return <DetectSvg />
  if (svgType === "surface") return <SurfaceSvg color={color} />
  return null
}
