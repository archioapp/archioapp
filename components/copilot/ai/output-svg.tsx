"use client"

/* ═══════════════════════════════════════════════════════════════
   Output SVG Visualization (Step 3 of Guided Session)
   Extracted from IntelligenceBoard to keep bundle size manageable.
   ═══════════════════════════════════════════════════════════════ */

interface StageProps {
  color: string
}

export function OutputSvg({ color: c }: StageProps) {
  const W = 280
  const outputBlocks = [
    {
      label: "SITUATION ANALYSIS",
      icon: "A",
      desc: "structured breakdown of your exact scenario",
      items: ["Current position assessment", "Market context overlay", "Setup quality rating", "Edge probability score"],
      pct: 94,
    },
    {
      label: "RISK ASSESSMENT",
      icon: "R",
      desc: "quantified risk evaluation vs your rules",
      items: ["Position size validation", "Stop-loss placement logic", "Risk:Reward calculation", "Portfolio correlation check"],
      pct: 88,
    },
    {
      label: "ACTION STEPS",
      icon: "X",
      desc: "specific, executable next moves",
      items: ["Primary recommendation", "Alternative scenario plan", "Exit strategy framework", "Re-entry conditions"],
      pct: 91,
    },
    {
      label: "FOLLOW-UP",
      icon: "F",
      desc: "accountability + learning capture",
      items: ["Self-check questions", "Rule reminder anchors", "Pattern logging trigger", "Session summary export"],
      pct: 82,
    },
  ]
  const ruleIntegrations = [
    { label: "Your Rules", detail: "personal trading rulebook overlay", status: "APPLIED" },
    { label: "Scanner Signals", detail: "active behavioral alerts connected", status: "LINKED" },
    { label: "History Context", detail: "past similar situations referenced", status: "LOADED" },
  ]
  return (
    <svg width="100%" viewBox={`0 0 ${W} 620`} preserveAspectRatio="xMidYMid meet" className="block p-2">
      {/* INPUT NODE */}
      <text x={W / 2} y="12" textAnchor="middle" fill={`${c}cc`} fontSize="7" fontFamily="monospace" fontWeight="900" letterSpacing="1.5">STRUCTURED INTELLIGENCE OUTPUT</text>
      <text x={W / 2} y="21" textAnchor="middle" fill={`${c}45`} fontSize="4.5" fontFamily="monospace">not a wall of text -- a structured, actionable response</text>
      <rect x="70" y="28" width={W - 140} height="22" rx="5" fill={`${c}06`} stroke={`${c}22`} strokeWidth="0.5" />
      <text x={W / 2} y="40" textAnchor="middle" fill={`${c}88`} fontSize="6" fontFamily="monospace" fontWeight="800">CALIBRATED CONTEXT</text>
      <text x={W / 2} y="47" textAnchor="middle" fill={`${c}35`} fontSize="3.5" fontFamily="monospace">from questioning engine</text>
      <line x1={W / 2} y1="52" x2={W / 2} y2="66" stroke={`${c}22`} strokeWidth="0.7" strokeDasharray="3 2">
        <animate attributeName="stroke-dashoffset" values="0;-10" dur="1.2s" repeatCount="indefinite" />
      </line>
      <polygon points={`${W / 2 - 3},64 ${W / 2},69 ${W / 2 + 3},64`} fill={`${c}30`} />
      <text x={W / 2 + 14} y="62" fill={`${c}40`} fontSize="4.5" fontFamily="monospace" fontWeight="700">BUILDING</text>
      <circle r="2" fill={`${c}`} opacity="0">
        <animateMotion dur="1.2s" repeatCount="indefinite" path={`M${W / 2},52 L${W / 2},66`} />
        <animate attributeName="opacity" values="0;0.7;0" dur="1.2s" repeatCount="indefinite" />
      </circle>

      {/* 4 OUTPUT BLOCKS */}
      <rect x="6" y="74" width={W - 12} height="370" rx="6" fill={`${c}02`} stroke={`${c}12`} strokeWidth="0.6" />
      <rect x="6" y="74" width={W - 12} height="18" rx="6" fill={`${c}04`} />
      <rect x="6" y="86" width={W - 12} height="6" fill={`${c}04`} />
      <text x={W / 2} y="87" textAnchor="middle" fill={`${c}bb`} fontSize="7.5" fontFamily="monospace" fontWeight="900" letterSpacing="2">4-BLOCK RESPONSE STRUCTURE</text>
      <line x1="16" y1="94" x2={W - 16} y2="94" stroke={`${c}0a`} strokeWidth="0.4" />
      <text x={W / 2} y="102" textAnchor="middle" fill={`${c}40`} fontSize="4" fontFamily="monospace">every response follows this framework, personalized to you</text>
      <rect x="16" y="94" width="0" height="1" fill={`${c}25`} rx="0.5">
        <animate attributeName="width" values={`0;${W - 32};0`} dur="3.5s" repeatCount="indefinite" />
      </rect>

      {outputBlocks.map((block, i) => {
        const by = 108 + i * 82
        return (
          <g key={block.label}>
            <rect x="14" y={by} width={W - 28} height="76" rx="5" fill={`${c}03`}
              stroke={`${c}${String(8 + i * 3).padStart(2, '0')}`} strokeWidth="0.4" />
            <circle cx="30" cy={by + 14} r="8" fill={`${c}06`} stroke={`${c}20`} strokeWidth="0.5" />
            <text x="30" y={by + 17} textAnchor="middle" fill={`${c}88`} fontSize="7" fontFamily="monospace" fontWeight="900">{block.icon}</text>
            <text x="44" y={by + 12} fill={`${c}cc`} fontSize="7.5" fontFamily="monospace" fontWeight="900">{block.label}</text>
            <text x="44" y={by + 21} fill={`${c}40`} fontSize="4" fontFamily="monospace">{block.desc}</text>
            <text x={W - 22} y={by + 12} textAnchor="end" fill={`${c}66`} fontSize="6" fontFamily="monospace" fontWeight="800">{block.pct}%</text>
            {block.items.map((item, j) => (
              <g key={`item-${j}`}>
                <rect x="22" y={by + 28 + j * 11} width={W - 44} height="9" rx="2" fill={`${c}03`} stroke={`${c}06`} strokeWidth="0.25" />
                <circle cx="28" cy={by + 32.5 + j * 11} r="1.5" fill={`${c}${String(15 + j * 8).padStart(2, '0')}`}>
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.8 + i * 0.2 + j * 0.15}s`} repeatCount="indefinite" />
                </circle>
                <text x="34" y={by + 35 + j * 11} fill={`${c}66`} fontSize="4.5" fontFamily="monospace" fontWeight="600">{item}</text>
                <rect x={W - 72} y={by + 30 + j * 11} width="42" height="3.5" rx="1.75" fill={`${c}05`} />
                <rect x={W - 72} y={by + 30 + j * 11} width={20 + j * 6} height="3.5" rx="1.75" fill={`${c}${String(10 + j * 5 + i * 3).padStart(2, '0')}`}>
                  <animate attributeName="width" values={`${14 + j * 4};${32 + j * 3};${14 + j * 4}`} dur={`${2.5 + i * 0.3 + j * 0.2}s`} repeatCount="indefinite" />
                </rect>
              </g>
            ))}
            <rect x="14" y={by + 73} width="0" height="2" rx="1" fill={`${c}${String(10 + i * 5).padStart(2, '0')}`}>
              <animate attributeName="width" values={`0;${W - 28};${W - 28}`} dur={`${2 + i * 0.6}s`} begin={`${i * 0.5}s`} fill="freeze" repeatCount="indefinite" />
            </rect>
            {i < 3 && (
              <g>
                <line x1={W / 2} y1={by + 77} x2={W / 2} y2={by + 82} stroke={`${c}12`} strokeWidth="0.5" />
                <polygon points={`${W / 2 - 2},${by + 80.5} ${W / 2},${by + 83} ${W / 2 + 2},${by + 80.5}`} fill={`${c}18`} />
              </g>
            )}
          </g>
        )
      })}

      {/* CONNECTOR: Blocks -> Rule Integration */}
      <line x1={W / 2} y1="446" x2={W / 2} y2="460" stroke={`${c}22`} strokeWidth="0.7" strokeDasharray="3 2">
        <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
      </line>
      <polygon points={`${W / 2 - 3},458 ${W / 2},463 ${W / 2 + 3},458`} fill={`${c}30`} />
      <text x={W / 2 + 14} y="456" fill={`${c}40`} fontSize="4.5" fontFamily="monospace" fontWeight="700">AUGMENTED</text>

      {/* RULE INTEGRATION LAYER */}
      <text x={W / 2} y="476" textAnchor="middle" fill={`${c}88`} fontSize="6" fontFamily="monospace" fontWeight="900" letterSpacing="1">PERSONALIZATION LAYER</text>

      {ruleIntegrations.map((rule, i) => {
        const ry = 484 + i * 28
        return (
          <g key={rule.label}>
            <rect x="20" y={ry} width={W - 40} height="24" rx="4" fill={`${c}03`}
              stroke={`${c}${String(8 + i * 4).padStart(2, '0')}`} strokeWidth="0.4" />
            <circle cx="32" cy={ry + 12} r="3" fill={`${c}08`} stroke={`${c}22`} strokeWidth="0.4">
              <animate attributeName="fill-opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <text x="42" y={ry + 10} fill={`${c}bb`} fontSize="6.5" fontFamily="monospace" fontWeight="900">{rule.label}</text>
            <text x="42" y={ry + 19} fill={`${c}40`} fontSize="3.8" fontFamily="monospace">{rule.detail}</text>
            <rect x={W - 76} y={ry + 4} width="32" height="12" rx="3"
              fill={i === 1 ? "rgba(52,211,153,0.08)" : `${c}06`}
              stroke={i === 1 ? "rgba(52,211,153,0.25)" : `${c}15`} strokeWidth="0.3" />
            <text x={W - 60} y={ry + 13} textAnchor="middle"
              fill={i === 1 ? "rgba(52,211,153,0.7)" : `${c}66`}
              fontSize="4.5" fontFamily="monospace" fontWeight="900">{rule.status}</text>
          </g>
        )
      })}

      {/* FINAL: DELIVERED OUTPUT */}
      <line x1={W / 2} y1="570" x2={W / 2} y2="582" stroke={`${c}18`} strokeWidth="0.6" />
      <polygon points={`${W / 2 - 3},580 ${W / 2},585 ${W / 2 + 3},580`} fill={`${c}25`} />
      <rect x="40" y="588" width={W - 80} height="26" rx="6" fill={`${c}06`} stroke={`${c}28`} strokeWidth="0.7">
        <animate attributeName="stroke-opacity" values="0.12;0.35;0.12" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <text x={W / 2} y="601" textAnchor="middle" fill={`${c}dd`} fontSize="8" fontFamily="monospace" fontWeight="900">PRECISION DELIVERED</text>
      <circle cx={W / 2 - 40} cy="609" r="2" fill="rgba(52,211,153,0.5)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x={W / 2 - 34} y="612" fill="rgba(52,211,153,0.5)" fontSize="4" fontFamily="monospace" fontWeight="700">actionable</text>
      <text x={W / 2 + 10} y="612" fill={`${c}40`} fontSize="4" fontFamily="monospace">mapped to your rules + context</text>

      {/* Particle trail */}
      <circle r="2.5" fill={`${c}`} opacity="0">
        <animateMotion dur="5s" repeatCount="indefinite" path={`M${W / 2},40 L${W / 2},69 L${W / 2},200 L${W / 2},350 L${W / 2},463 L${W / 2},530 L${W / 2},600`} />
        <animate attributeName="opacity" values="0;0.5;0.3;0.6;0.2;0.5;0.7;0" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle r="2" fill={`${c}80`} opacity="0">
        <animateMotion dur="5s" begin="2.5s" repeatCount="indefinite" path={`M${W / 2},40 L${W / 2},69 L${W / 2},200 L${W / 2},350 L${W / 2},463 L${W / 2},530 L${W / 2},600`} />
        <animate attributeName="opacity" values="0;0.3;0.6;0.4;0.5;0.3;0.5;0" dur="5s" begin="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
