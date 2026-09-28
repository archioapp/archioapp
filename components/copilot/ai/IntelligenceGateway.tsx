"use client"

import { motion, AnimatePresence } from "framer-motion"

interface IntelligenceGatewayProps {
  homeSection: "signals" | "modes"
  setHomeSection: (section: "signals" | "modes") => void
}

/* ── Inline SVG: AI Reads You ──
   DETAILED pipeline: Behavioral Streams -> [INGEST -> NORMALIZE -> PATTERN ENGINE -> CORRELATION -> CLASSIFY -> SCORE] -> Filters -> Alert
   The AI Core is now exploded into 6 visible processing stages showing exactly what happens inside */
function AIReadsYouDiagram({ active }: { active: boolean }) {
  const a = active
  const W = 440
  const c = {
    bright: a ? "#fbbf24" : "rgba(255,255,255,0.18)",
    head: a ? "#fde68a" : "rgba(255,255,255,0.22)",
    text: a ? "rgba(253,224,138,0.92)" : "rgba(255,255,255,0.22)",
    mid: a ? "rgba(251,191,36,0.72)" : "rgba(255,255,255,0.14)",
    dim: a ? "rgba(245,158,11,0.38)" : "rgba(255,255,255,0.07)",
    faint: a ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.025)",
    bg: a ? "rgba(245,158,11,0.025)" : "rgba(255,255,255,0.004)",
    green: a ? "rgba(74,222,128,0.85)" : "rgba(255,255,255,0.1)",
    red: a ? "rgba(248,113,113,0.85)" : "rgba(255,255,255,0.1)",
    cyan: a ? "rgba(103,232,249,0.7)" : "rgba(255,255,255,0.1)",
  }

  /* ── BEHAVIORAL DATA STREAMS ── */
  const streams = [
    { label: "Emotions", micro: "fear / greed / doubt" },
    { label: "Decisions", micro: "entry / exit / sizing" },
    { label: "Patterns", micro: "repeats / sequences" },
    { label: "Exposure", micro: "risk / correlation" },
  ]

  /* ── 6 CORE STAGES shown 2-by-2, cycling every ~2.5s ── */
  const corePairs = [
    [
      { n: "01", label: "INGEST",
        line1: "Captures every trade you make,",
        line2: "every hesitation, every click.",
        line3: "Real-time behavioral stream.",
        specs: ["4 streams", "< 1ms", "zero lag"] },
      { n: "02", label: "NORMALIZE",
        line1: "Cleans raw data with z-score",
        line2: "scaling. Removes market noise,",
        line3: "detrends drift, fixes outliers.",
        specs: ["z-score", "detrend", "scale"] },
    ],
    [
      { n: "03", label: "PATTERN MATCH",
        line1: "Runs behavior through 47 proven",
        line2: "models. Detects repeating cycles,",
        line3: "emotional loops, decision chains.",
        specs: ["47 models", "3.2ms", "6 APIs"] },
      { n: "04", label: "CORRELATE",
        line1: "Maps hidden links between your",
        line2: "emotions, timing, and sizing.",
        line3: "Cross-signal relationship map.",
        specs: ["6 pairs", "r\u00B2>0.7", "multi-axis"] },
    ],
    [
      { n: "05", label: "CLASSIFY",
        line1: "Sorts each pattern into four",
        line2: "behavioral categories with a",
        line3: "weighted confidence score.",
        specs: ["4 filters", "weighted", "scored"] },
      { n: "06", label: "SCORE",
        line1: "Outputs a severity score 0-100.",
        line2: "Gates against your threshold.",
        line3: "Determines if alert fires.",
        specs: ["0-100", "threshold", "priority"] },
    ],
  ]

  /* ── 4 CLASSIFICATION FILTERS ── */
  const filters = [
    { label: "Psychology", pct: 94, sub: "Emotional State Mapping" },
    { label: "Discipline", pct: 87, sub: "Rule Adherence Tracking" },
    { label: "Strategy", pct: 72, sub: "Plan Execution Quality" },
    { label: "Risk", pct: 91, sub: "Exposure Control Score" },
  ]

  /* ── 4 BEHAVIORAL ALERTS shown 2-by-2 cycling ── */
  const alertPairs = [
    [
      { cat: "PSYCHOLOGY", severity: "HIGH", score: 94, color: c.red,
        trap: "Revenge Trading Pattern",
        detail1: "Detected 3 rapid entries after loss",
        detail2: "Position size increased 2.4x normal",
        detail3: "Matches emotional escalation model",
        action: "Cooldown period recommended" },
      { cat: "DISCIPLINE", severity: "MED", score: 87, color: c.bright,
        trap: "Rule Violation Streak",
        detail1: "Skipped pre-trade checklist 4 times",
        detail2: "Entered outside of session window",
        detail3: "Stop-loss not set on 2 positions",
        action: "Re-engage trading framework" },
    ],
    [
      { cat: "STRATEGY", severity: "LOW", score: 72, color: c.cyan,
        trap: "Setup Drift Detected",
        detail1: "Entry criteria modified mid-session",
        detail2: "Timeframe switched 3x in 20 minutes",
        detail3: "Edge score dropped below baseline",
        action: "Return to primary setup only" },
      { cat: "RISK", severity: "HIGH", score: 91, color: c.red,
        trap: "Overexposure Warning",
        detail1: "Correlated positions: 78% overlap",
        detail2: "Portfolio heat exceeds 4% threshold",
        detail3: "Drawdown trajectory: -2.1% session",
        action: "Reduce position size immediately" },
    ],
  ]

  /* Cycle timing: doubled for readability */
  const cycleDur = "15s"
  const alertCycleDur = "12s"

  /* Layout Y */
  const streamY = 4
  const coreY = 68
  const coreH = 142
  const filterY = coreY + coreH + 38
  const alertY = filterY + 86

  return (
    <svg viewBox={`0 0 ${W} ${alertY + 170}`} className="w-full h-auto" fill="none">

      {/* ════════════════════════════════════
          BEHAVIORAL DATA STREAMS
          ════════════════════════════════════ */}
      <text x={W / 2} y={streamY + 8} textAnchor="middle" fill={c.head} fontSize="9" fontFamily="monospace" fontWeight="900" letterSpacing="1.8">BEHAVIORAL DATA STREAMS</text>

      {streams.map((s, i) => {
        const sw = (W - 24) / 4
        const sx = 6 + i * (sw + 4)
        return (
          <g key={`s-${i}`}>
            <rect x={sx} y={streamY + 13} width={sw} height="26" rx="3"
              fill={c.bg} stroke={c.faint} strokeWidth="0.5" />
            <text x={sx + sw / 2} y={streamY + 26} textAnchor="middle" fill={c.text}
              fontSize="8" fontFamily="monospace" fontWeight="900">{s.label}</text>
            <text x={sx + sw / 2} y={streamY + 35} textAnchor="middle" fill={c.mid}
              fontSize="5.5" fontFamily="monospace" fontWeight="700">{s.micro}</text>
            <circle cx={sx + sw / 2} cy={streamY + 43} r="1.5" fill={c.dim}>
              {a && <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
            </circle>
          </g>
        )
      })}

      {/* Converge */}
      {[0, 1, 2, 3].map(i => {
        const sw = (W - 24) / 4
        return <line key={`cv-${i}`} x1={6 + i * (sw + 4) + sw / 2} y1={streamY + 45} x2={W / 2} y2={coreY - 2} stroke={c.faint} strokeWidth="0.4" />
      })}
      <polygon points={`${W / 2 - 3},${coreY - 4} ${W / 2},${coreY} ${W / 2 + 3},${coreY - 4}`} fill={c.dim} />

      {/* ════════════════════════════════════
          AI PROCESSING CORE
          2-by-2 cycling every 2.5s
          ════════════════════════════════════ */}
      <rect x="4" y={coreY} width={W - 8} height={coreH} rx="5" fill={c.bg} stroke={c.faint} strokeWidth="0.5" />

      {/* Title */}
      <rect x="4" y={coreY} width={W - 8} height="16" rx="5" fill={a ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.006)"} />
      <rect x="4" y={coreY + 12} width={W - 8} height="4" fill={a ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.006)"} />
      <text x={W / 2} y={coreY + 12} textAnchor="middle" fill={c.head} fontSize="10" fontFamily="monospace" fontWeight="900" letterSpacing="2.5">AI PROCESSING CORE</text>

      {/* Step indicator: 3 dots */}
      {[0, 1, 2].map(p => (
        <circle key={`sd-${p}`} cx={W / 2 - 10 + p * 10} cy={coreY + 7} r="2" fill={c.faint} stroke={c.dim} strokeWidth="0.3">
          {a && (
            <animate attributeName="fill"
              values={p === 0
                ? `${c.bright};${c.bright};${c.bright};${c.faint};${c.faint};${c.faint};${c.faint};${c.faint};${c.faint};${c.bright}`
                : p === 1
                  ? `${c.faint};${c.faint};${c.faint};${c.bright};${c.bright};${c.bright};${c.faint};${c.faint};${c.faint};${c.faint}`
                  : `${c.faint};${c.faint};${c.faint};${c.faint};${c.faint};${c.faint};${c.bright};${c.bright};${c.bright};${c.faint}`}
              dur={cycleDur} repeatCount="indefinite" />
          )}
        </circle>
      ))}

      {/* 3 pairs cycling */}
      {corePairs.map((pair, pi) => {
        const cardW = (W - 24) / 2
        return (
          <g key={`cp-${pi}`} opacity={pi === 0 ? "1" : "0"}>
            {a && (
              <animate attributeName="opacity"
                values={pi === 0
                  ? "1;1;1;0;0;0;0;0;0;1"
                  : pi === 1
                    ? "0;0;0;1;1;1;0;0;0;0"
                    : "0;0;0;0;0;0;1;1;1;0"}
                dur={cycleDur} repeatCount="indefinite" />
            )}

            {pair.map((stage, si) => {
              const sx = 8 + si * (cardW + 8)
              const sy = coreY + 20

              return (
                <g key={`cs-${pi}-${si}`}>
                  {/* Card */}
                  <rect x={sx} y={sy} width={cardW} height={coreH - 24} rx="4"
                    fill={a ? "rgba(245,158,11,0.035)" : "rgba(255,255,255,0.006)"}
                    stroke={a ? `rgba(245,158,11,${0.1 + si * 0.04})` : "rgba(255,255,255,0.015)"}
                    strokeWidth="0.4" />

                  {/* Top bar with number */}
                  <rect x={sx} y={sy} width={cardW} height="18" rx="4" fill={a ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.008)"} />
                  <rect x={sx} y={sy + 14} width={cardW} height="4" fill={a ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.008)"} />

                  {/* Number badge */}
                  <rect x={sx + 4} y={sy + 3} width="18" height="14" rx="3"
                    fill={a ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.01)"}
                    stroke={c.dim} strokeWidth="0.3" />
                  <text x={sx + 13} y={sy + 13} textAnchor="middle" fill={c.head}
                    fontSize="8" fontFamily="monospace" fontWeight="900">{stage.n}</text>

                  {/* Label */}
                  <text x={sx + 26} y={sy + 13} fill={c.head}
                    fontSize="10" fontFamily="monospace" fontWeight="900" letterSpacing="0.8">{stage.label}</text>

                  {/* SVG icon area */}
                  {stage.n === "01" && (
                    <g>
                      {/* Funnel shape -- tighter to description */}
                      <path d={`M${sx + 12},${sy + 24} L${sx + cardW - 12},${sy + 24} L${sx + cardW / 2 + 10},${sy + 56} L${sx + cardW / 2 - 10},${sy + 56} Z`}
                        fill={a ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.004)"} stroke={c.dim} strokeWidth="0.4" />
                      {a && [0, 1, 2, 3].map(j => (
                        <circle key={`fi-${j}`} cx={sx + 20 + j * ((cardW - 40) / 3)} cy={sy + 26} r="2" fill={c.dim} opacity="0">
                          <animate attributeName="cy" values={`${sy + 25};${sy + 53};${sy + 25}`} dur={`${1.5 + j * 0.3}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;0.5;0" dur={`${1.5 + j * 0.3}s`} repeatCount="indefinite" />
                        </circle>
                      ))}
                    </g>
                  )}
                  {stage.n === "02" && (
                    <g>
                      {/* Stacked layers -- tighter spacing */}
                      {["z-score", "detrend", "scale", "clean"].map((lbl, j) => (
                        <g key={`nl-${j}`}>
                          <rect x={sx + 8} y={sy + 24 + j * 11} width={cardW - 16} height="8" rx="2"
                            fill={a ? `rgba(245,158,11,${0.04 + j * 0.015})` : "rgba(255,255,255,0.005)"}
                            stroke={c.faint} strokeWidth="0.3" />
                          <text x={sx + 14} y={sy + 31 + j * 11} fill={c.mid} fontSize="5" fontFamily="monospace" fontWeight="700">{lbl}</text>
                          {a && (
                            <rect x={sx + 8} y={sy + 24 + j * 11} width="0" height="8" rx="2" fill={c.faint}>
                              <animate attributeName="width" values={`0;${cardW - 16};0`} dur={`${3 + j * 0.4}s`} begin={`${j * 0.6}s`} repeatCount="indefinite" />
                            </rect>
                          )}
                        </g>
                      ))}
                    </g>
                  )}
                  {stage.n === "03" && (
                    <g>
                      {/* Neural network nodes -- tighter vertical */}
                      {[0, 1, 2].map(row => (
                        <g key={`nr-${row}`}>
                          <circle cx={sx + 18} cy={sy + 28 + row * 14} r="4" fill={a ? `rgba(245,158,11,${0.12 + row * 0.06})` : "rgba(255,255,255,0.015)"} stroke={c.faint} strokeWidth="0.3" />
                          <circle cx={sx + cardW / 2} cy={sy + 32 + row * 10} r="3" fill={a ? `rgba(245,158,11,${0.08 + row * 0.04})` : "rgba(255,255,255,0.01)"} stroke={c.faint} strokeWidth="0.2" />
                          <circle cx={sx + cardW - 18} cy={sy + 28 + row * 14} r="4" fill={a ? `rgba(245,158,11,${0.12 + row * 0.06})` : "rgba(255,255,255,0.015)"} stroke={c.faint} strokeWidth="0.3" />
                          <line x1={sx + 22} y1={sy + 28 + row * 14} x2={sx + cardW / 2 - 3} y2={sy + 32 + row * 10} stroke={c.faint} strokeWidth="0.3" />
                          <line x1={sx + cardW / 2 + 3} y1={sy + 32 + row * 10} x2={sx + cardW - 22} y2={sy + 28 + row * 14} stroke={c.faint} strokeWidth="0.3" />
                        </g>
                      ))}
                      {a && (
                        <circle r="2" fill={c.bright} opacity="0">
                          <animateMotion dur="2.5s" repeatCount="indefinite" path={`M${sx + 18},${sy + 28} L${sx + cardW / 2},${sy + 32} L${sx + cardW - 18},${sy + 28} L${sx + cardW / 2},${sy + 42} L${sx + 18},${sy + 56}`} />
                          <animate attributeName="opacity" values="0;0.5;0.3;0.5;0" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  )}
                  {stage.n === "04" && (
                    <g>
                      {/* Correlation matrix -- tighter */}
                      {[0, 1, 2, 3].map(mr => (
                        [0, 1, 2, 3].map(mc => {
                          const int = a ? (mr === mc ? 0.16 : Math.abs(mr - mc) === 1 ? 0.08 : 0.03) : 0.006
                          return (
                            <rect key={`mx-${mr}-${mc}`} x={sx + 10 + mc * ((cardW - 20) / 4)} y={sy + 24 + mr * 10} width={(cardW - 24) / 4} height="8" rx="1.5"
                              fill={a ? `rgba(245,158,11,${int})` : "rgba(255,255,255,0.004)"}
                              stroke={a ? `rgba(245,158,11,${int + 0.04})` : "rgba(255,255,255,0.006)"} strokeWidth="0.2">
                              {a && mr === mc && <animate attributeName="fill-opacity" values="0.5;1;0.5" dur={`${2 + mr * 0.3}s`} repeatCount="indefinite" />}
                            </rect>
                          )
                        })
                      ))}
                    </g>
                  )}
                  {stage.n === "05" && (
                    <g>
                      {/* Sort/classify bars -- spaced */}
                      {["Psychology", "Discipline", "Strategy", "Risk"].map((cl, j) => {
                        const bw = [cardW - 18, cardW - 24, cardW - 30, cardW - 22][j]
                        return (
                          <g key={`clf-${j}`}>
                            <rect x={sx + 8} y={sy + 24 + j * 12} width={a ? bw : cardW - 30} height="9" rx="2"
                              fill={a ? `rgba(245,158,11,${0.05 + j * 0.02})` : "rgba(255,255,255,0.005)"}
                              stroke={c.faint} strokeWidth="0.3" />
                            <text x={sx + 14} y={sy + 32 + j * 12} fill={c.mid} fontSize="5.5" fontFamily="monospace" fontWeight="800">{cl}</text>
                          </g>
                        )
                      })}
                    </g>
                  )}
                  {stage.n === "06" && (() => {
                    const gr = 26 /* gauge radius -- constrained to card */
                    const gcx = sx + cardW / 2
                    const gcy = sy + 46
                    return (
                    <g>
                      {/* Gauge arc background */}
                      <path d={`M${gcx - gr},${gcy} A${gr},${gr} 0 0,1 ${gcx + gr},${gcy}`}
                        fill="none" stroke={c.faint} strokeWidth="3" strokeLinecap="round" />
                      {/* Gauge arc filled -- 87% of semicircle */}
                      <path d={`M${gcx - gr},${gcy} A${gr},${gr} 0 0,1 ${gcx + gr - 4},${gcy - 12}`}
                        fill="none" stroke={c.dim} strokeWidth="3" strokeLinecap="round">
                        {a && <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />}
                      </path>
                      <text x={gcx} y={gcy - 6} textAnchor="middle" fill={c.head} fontSize="13" fontFamily="monospace" fontWeight="900">87</text>
                      <text x={gcx} y={gcy + 4} textAnchor="middle" fill={c.mid} fontSize="5" fontFamily="monospace">/100</text>
                    </g>
                    )
                  })()}

                  {/* Description lines -- with breathing room from graphics */}
                  <text x={sx + cardW / 2} y={sy + 74} textAnchor="middle" fill={c.text} fontSize="6.5" fontFamily="monospace" fontWeight="700">{stage.line1}</text>
                  <text x={sx + cardW / 2} y={sy + 84} textAnchor="middle" fill={c.text} fontSize="6.5" fontFamily="monospace" fontWeight="700">{stage.line2}</text>
                  <text x={sx + cardW / 2} y={sy + 93} textAnchor="middle" fill={c.mid} fontSize="6" fontFamily="monospace" fontWeight="600">{stage.line3}</text>

                  {/* Spec tags */}
                  {stage.specs.map((sp, si2) => (
                    <g key={`sp-${si2}`}>
                      <rect x={sx + 6 + si2 * ((cardW - 12) / 3)} y={sy + 99} width={(cardW - 18) / 3} height="10" rx="2.5"
                        fill={a ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.005)"}
                        stroke={c.faint} strokeWidth="0.3" />
                      <text x={sx + 6 + si2 * ((cardW - 12) / 3) + (cardW - 18) / 6} y={sy + 106} textAnchor="middle" fill={c.mid}
                        fontSize="5.5" fontFamily="monospace" fontWeight="700">{sp}</text>
                    </g>
                  ))}
                </g>
              )
            })}
          </g>
        )
      })}

      {/* ── Connector ── */}
      <line x1={W / 2} y1={coreY + coreH + 1} x2={W / 2} y2={filterY - 3} stroke={c.faint} strokeWidth="0.4" strokeDasharray="2 1.5">
        {a && <animate attributeName="stroke-dashoffset" values="0;-7" dur="1.2s" repeatCount="indefinite" />}
      </line>
      <polygon points={`${W / 2 - 3},${filterY - 5} ${W / 2},${filterY - 1} ${W / 2 + 3},${filterY - 5}`} fill={c.dim} />

      {/* ════════════════════════════════════
          CLASSIFICATION OUTPUT
          ════════════════════════════════════ */}
      <text x={W / 2} y={filterY + 8} textAnchor="middle" fill={c.head} fontSize="9" fontFamily="monospace" fontWeight="900" letterSpacing="1.5">CLASSIFICATION OUTPUT</text>

      {filters.map((f, i) => {
        const fw = (W - 24) / 4
        const fx = 6 + i * (fw + 4)
        const fy = filterY + 14
        const barFill = f.pct >= 90 ? c.green : f.pct >= 80 ? c.dim : c.cyan
        return (
          <g key={`f-${i}`}>
            <rect x={fx} y={fy} width={fw} height="38" rx="3" fill={c.bg} stroke={c.faint} strokeWidth="0.4" />

            <text x={fx + fw / 2} y={fy + 13} textAnchor="middle" fill={c.text} fontSize="8" fontFamily="monospace" fontWeight="900">{f.label}</text>
            <text x={fx + fw / 2} y={fy + 22} textAnchor="middle" fill={c.mid} fontSize="5.5" fontFamily="monospace" fontWeight="700">{f.sub}</text>

            {/* Score bar */}
            <rect x={fx + 6} y={fy + 28} width={fw - 30} height="5" rx="2.5" fill={a ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.003)"} />
            <rect x={fx + 6} y={fy + 28} width={a ? (f.pct / 100) * (fw - 30) : 4} height="5" rx="2.5" fill={barFill} opacity="0.7">
              {a && <animate attributeName="opacity" values="0.5;0.85;0.5" dur={`${2.8 + i * 0.3}s`} repeatCount="indefinite" />}
            </rect>
            <text x={fx + fw - 6} y={fy + 34} textAnchor="end" fill={c.head} fontSize="7" fontFamily="monospace" fontWeight="900">{a ? `${f.pct}%` : "--"}</text>
          </g>
        )
      })}

      {/* Converge to alerts */}
      {[0, 1, 2, 3].map(i => {
        const fw = (W - 24) / 4
        return <line key={`fc-${i}`} x1={6 + i * (fw + 4) + fw / 2} y1={filterY + 56} x2={W / 2} y2={alertY - 4} stroke={c.faint} strokeWidth="0.3" />
      })}
      <polygon points={`${W / 2 - 3},${alertY - 6} ${W / 2},${alertY - 2} ${W / 2 + 3},${alertY - 6}`} fill={c.dim} />

      {/* ════════════════════════════════════
          BEHAVIORAL ALERTS
          4 category boxes shown 2-by-2 cycling
          ════════════════════════════════════ */}
      <text x={W / 2} y={alertY + 9} textAnchor="middle" fill={c.head} fontSize="9" fontFamily="monospace" fontWeight="900" letterSpacing="1.5">BEHAVIORAL ALERTS</text>

      {/* Live indicator */}
      <circle cx="14" cy={alertY + 6} r="2.5" fill={c.green}>
        {a && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />}
      </circle>
      <text x="20" y={alertY + 9} fill={c.green} fontSize="5.5" fontFamily="monospace" fontWeight="800">LIVE</text>

      {/* Alert pair indicator dots */}
      {[0, 1].map(p => (
        <circle key={`ad-${p}`} cx={W / 2 - 4 + p * 8} cy={alertY + 3} r="1.5" fill={c.faint} stroke={c.dim} strokeWidth="0.2">
          {a && (
            <animate attributeName="fill"
              values={p === 0 ? `${c.bright};${c.bright};${c.faint};${c.faint};${c.bright}` : `${c.faint};${c.faint};${c.bright};${c.bright};${c.faint}`}
              dur={alertCycleDur} repeatCount="indefinite" />
          )}
        </circle>
      ))}

      {/* 2 alert pairs cycling */}
      {alertPairs.map((pair, pi) => {
        const alertCardW = (W - 20) / 2
        return (
          <g key={`ap-${pi}`} opacity={pi === 0 ? "1" : "0"}>
            {a && (
              <animate attributeName="opacity"
                values={pi === 0 ? "1;1;1;0;0;0;0;1" : "0;0;0;1;1;1;1;0"}
                dur={alertCycleDur} repeatCount="indefinite" />
            )}

            {pair.map((al, ai) => {
              const ax = 6 + ai * (alertCardW + 8)
              const ay = alertY + 16

              return (
                <g key={`al-${pi}-${ai}`}>
                  {/* Card */}
                  <rect x={ax} y={ay} width={alertCardW} height="145" rx="4"
                    fill={a ? "rgba(245,158,11,0.03)" : "rgba(255,255,255,0.005)"}
                    stroke={a ? al.color : "rgba(255,255,255,0.015)"}
                    strokeWidth="0.5" strokeOpacity="0.4" />

                  {/* Header bar */}
                  <rect x={ax} y={ay} width={alertCardW} height="18" rx="4"
                    fill={a ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.006)"} />
                  <rect x={ax} y={ay + 14} width={alertCardW} height="4"
                    fill={a ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.006)"} />

                  {/* Category label */}
                  <text x={ax + 10} y={ay + 13} fill={c.head} fontSize="8" fontFamily="monospace" fontWeight="900" letterSpacing="0.8">{al.cat}</text>

                  {/* Severity badge */}
                  <rect x={ax + alertCardW - 40} y={ay + 3} width="34" height="12" rx="3"
                    fill={a ? (al.severity === "HIGH" ? "rgba(248,113,113,0.12)" : al.severity === "MED" ? "rgba(251,191,36,0.1)" : "rgba(103,232,249,0.1)") : "rgba(255,255,255,0.005)"}
                    stroke={al.color} strokeWidth="0.3" strokeOpacity="0.5" />
                  <text x={ax + alertCardW - 23} y={ay + 12} textAnchor="middle" fill={al.color}
                    fontSize="6" fontFamily="monospace" fontWeight="900">{al.severity}</text>

                  {/* Trap name -- large and visible */}
                  <text x={ax + alertCardW / 2} y={ay + 32} textAnchor="middle" fill={c.text}
                    fontSize="8.5" fontFamily="monospace" fontWeight="900">{a ? al.trap : "--"}</text>

                  {/* Divider */}
                  <line x1={ax + 8} y1={ay + 37} x2={ax + alertCardW - 8} y2={ay + 37} stroke={c.faint} strokeWidth="0.3" />

                  {/* Detail lines -- much bigger */}
                  <text x={ax + 10} y={ay + 50} fill={c.text} fontSize="6.5" fontFamily="monospace" fontWeight="700">{a ? al.detail1 : ""}</text>
                  <text x={ax + 10} y={ay + 62} fill={c.text} fontSize="6.5" fontFamily="monospace" fontWeight="700">{a ? al.detail2 : ""}</text>
                  <text x={ax + 10} y={ay + 74} fill={c.mid} fontSize="6.5" fontFamily="monospace" fontWeight="600">{a ? al.detail3 : ""}</text>

                  {/* Score bar */}
                  <text x={ax + 10} y={ay + 88} fill={c.dim} fontSize="5.5" fontFamily="monospace" fontWeight="700">SCORE</text>
                  <rect x={ax + 40} y={ay + 82} width={alertCardW - 56} height="7" rx="3.5" fill={a ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.003)"} />
                  <rect x={ax + 40} y={ay + 82} width={a ? (al.score / 100) * (alertCardW - 56) : 4} height="7" rx="3.5" fill={al.color} opacity="0.5">
                    {a && <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />}
                  </rect>
                  <text x={ax + alertCardW - 8} y={ay + 89} textAnchor="end" fill={c.head} fontSize="7" fontFamily="monospace" fontWeight="900">{a ? al.score : "--"}</text>

                  {/* Divider */}
                  <line x1={ax + 8} y1={ay + 96} x2={ax + alertCardW - 8} y2={ay + 96} stroke={c.faint} strokeWidth="0.2" />

                  {/* Action -- bigger green text */}
                  <text x={ax + 10} y={ay + 106} fill={c.dim} fontSize="5.5" fontFamily="monospace" fontWeight="700">RECOMMENDED ACTION</text>
                  <rect x={ax + 8} y={ay + 110} width={alertCardW - 16} height="18" rx="3"
                    fill={a ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.003)"}
                    stroke={c.green} strokeWidth="0.4" strokeOpacity="0.4" />
                  <text x={ax + alertCardW / 2} y={ay + 122} textAnchor="middle" fill={c.green}
                    fontSize="7" fontFamily="monospace" fontWeight="900">{a ? al.action : "--"}</text>

                  {/* Bottom status */}
                  <circle cx={ax + 12} cy={ay + 136} r="1.5" fill={al.color} opacity="0.6">
                    {a && <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />}
                  </circle>
                  <text x={ax + 18} y={ay + 138} fill={c.dim} fontSize="4.5" fontFamily="monospace">monitoring active</text>
                </g>
              )
            })}
          </g>
        )
      })}

      {/* Pipeline particle */}
      {a && (
        <circle r="2" fill={c.bright} opacity="0">
          <animateMotion dur="9s" repeatCount="indefinite"
            path={`M${W / 2},${streamY + 42} L${W / 2},${coreY} L${W / 2},${coreY + coreH} L${W / 2},${filterY} L${W / 2},${filterY + 58} L${W / 2},${alertY + 90}`} />
          <animate attributeName="opacity" values="0;0.4;0.2;0.5;0.3;0.4;0" dur="9s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}


/* ── HTML: You Lead the AI ──
   Full pipeline: User Intent -> Mode Selector -> AI Calibration -> Boot -> Session Active
   Converted from SVG to HTML for readable font sizes */
function YouLeadAIDiagram(_props: { active: boolean }) {
  /* Shared styles */
  const sectionBorder = "1px solid rgba(139,92,246,0.12)"
  const sectionBg = "rgba(139,92,246,0.02)"
  const greenBorder = "1px solid rgba(74,222,128,0.15)"
  const greenBg = "rgba(74,222,128,0.02)"

  /* Connector arrow between sections */
  const Connector = ({ green = false }: { green?: boolean }) => (
    <div className="flex flex-col items-center -my-0.5">
      <div className="w-px h-4" style={{ background: green ? "rgba(74,222,128,0.15)" : "rgba(139,92,246,0.12)" }} />
      <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-transparent" style={{ borderTopColor: green ? "rgba(74,222,128,0.25)" : "rgba(139,92,246,0.2)" }} />
    </div>
  )

  return (
    <div className="space-y-1">

      {/* ── YOUR DIRECTION ── */}
      <div className="text-center py-3">
        <p className="text-[10px] font-mono font-black text-purple-200/80 tracking-[0.2em] uppercase mb-2">Your Direction</p>
        <div className="mx-auto w-8 h-8 rounded-full border border-purple-500/25 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.04)" }}>
          <div className="w-2 h-2 rounded-full bg-purple-400/40" />
        </div>
      </div>

      <Connector />

      {/* ── 8 INTELLIGENCE ENGINES ── */}
      <div className="rounded-lg overflow-hidden" style={{ border: sectionBorder, background: sectionBg }}>
        <div className="px-3 py-2" style={{ background: "rgba(139,92,246,0.04)" }}>
          <p className="text-center text-[11px] font-mono font-black text-purple-200/85 tracking-[0.15em] uppercase">8 Intelligence Engines</p>
          <p className="text-center text-[9px] font-mono text-purple-400/45 mt-0.5">Each engine is a specialized AI thinking framework</p>
        </div>
        <div className="grid grid-cols-2 gap-1 p-1.5">
          {[
            { label: "Analyst", color: "#6366f1", desc: "Pattern-based reasoning" },
            { label: "Strategist", color: "#8b5cf6", desc: "Plan & scenarios" },
            { label: "Coach", color: "#10b981", desc: "Accountability" },
            { label: "Mirror", color: "#06b6d4", desc: "Self-reflection" },
            { label: "Focus", color: "#f59e0b", desc: "Deep single-topic" },
            { label: "Mentor", color: "#22c55e", desc: "Guided learning" },
            { label: "Review", color: "#ef4444", desc: "Post-trade analysis" },
            { label: "Psych", color: "#14b8a6", desc: "Behavioral investigation" },
          ].map((m, i) => (
            <div key={m.label} className="flex items-center gap-1.5 px-2 py-1.5 rounded" style={{
              background: i === 0 ? `${m.color}10` : `${m.color}05`,
              border: `1px solid ${i === 0 ? m.color + "30" : m.color + "10"}`,
            }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color, opacity: i === 0 ? 0.7 : 0.25 }} />
              <div className="min-w-0">
                <p className="text-[9px] font-mono font-black leading-tight" style={{ color: m.color + (i === 0 ? "dd" : "88") }}>{m.label}</p>
                <p className="text-[7px] font-mono leading-tight" style={{ color: m.color + "55" }}>{m.desc}</p>
              </div>
              {i === 0 && (
                <span className="text-[6px] font-mono font-black text-emerald-400/60 tracking-wider ml-auto shrink-0 px-1 py-0.5 rounded-sm" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)" }}>ACTIVE</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <Connector />

      {/* ── AI CALIBRATION ENGINE ── Redesigned: No bars, clear explanations */}
      <div className="rounded-lg overflow-hidden" style={{ border: sectionBorder, background: sectionBg }}>
        <div className="px-4 py-3" style={{ background: "rgba(139,92,246,0.05)" }}>
          <p className="text-center text-[13px] font-mono font-black text-purple-200/90 tracking-[0.18em] uppercase">AI Calibration Engine</p>
          <p className="text-center text-[10px] font-mono text-purple-300/50 mt-1">6 parameters auto-tuned to match your selected engine</p>
        </div>
        
        <div className="p-3 space-y-3">
          {/* Explanation */}
          <div className="p-3 rounded-md" style={{ background: "rgba(139,92,246,0.03)", border: "1px solid rgba(139,92,246,0.08)" }}>
            <p className="text-[10px] font-mono text-purple-300/60 leading-relaxed">
              When you select an engine, these parameters automatically adjust to optimize how the AI thinks, responds, and remembers your context.
            </p>
          </div>

          {/* Parameters grid - 2 columns, 3 rows */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Depth", value: "Full", desc: "Multi-layer root cause analysis -- AI digs through surface issues to find underlying patterns", icon: "1" },
              { label: "Scope", value: "Focused", desc: "Single-topic investigation window -- no tangents, complete resolution before moving on", icon: "2" },
              { label: "Tone", value: "Direct", desc: "Empathetic but firm delivery -- AI tells you what you need to hear, not what feels good", icon: "3" },
              { label: "Context", value: "30 Sessions", desc: "Historical weighting from your last 30 interactions to understand your patterns", icon: "4" },
              { label: "Memory", value: "Full Recall", desc: "Cross-session continuity -- AI remembers what you discussed and follows through", icon: "5" },
              { label: "Precision", value: "Data-Backed", desc: "Every insight tied to your actual data -- no generic advice, only specific to you", icon: "6" },
            ].map(p => (
              <div key={p.label} className="p-2.5 rounded-md" style={{ background: "rgba(139,92,246,0.025)", border: "1px solid rgba(139,92,246,0.08)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono font-black text-purple-300/85">{p.label}</span>
                  <span className="text-[10px] font-mono font-bold text-purple-400/70 px-2 py-0.5 rounded" style={{ background: "rgba(139,92,246,0.08)" }}>{p.value}</span>
                </div>
                <p className="text-[9px] font-mono text-purple-400/50 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Connector green />

      {/* ── SESSION BOOT SEQUENCE ── Redesigned: Detailed breakdown */}
      <div className="rounded-lg overflow-hidden" style={{ border: greenBorder, background: greenBg }}>
        <div className="px-4 py-3" style={{ background: "rgba(74,222,128,0.05)" }}>
          <p className="text-center text-[13px] font-mono font-black text-emerald-200/90 tracking-[0.18em] uppercase">Session Boot Sequence</p>
          <p className="text-center text-[10px] font-mono text-emerald-400/50 mt-1">5 initialization steps before your session goes live</p>
        </div>
        
        <div className="p-3 space-y-2">
          {[
            { n: "01", label: "LOAD", 
              what: "Import engine rules and templates", 
              detail: "Loads the selected engine's decision framework, response patterns, and analytical templates into memory",
              time: "0.2s" },
            { n: "02", label: "CALIBRATE", 
              what: "Apply tuned parameters", 
              detail: "Configures depth, scope, tone, context, memory, and precision settings to match your engine choice",
              time: "0.5s" },
            { n: "03", label: "HISTORY", 
              what: "Sync behavioral patterns", 
              detail: "Pulls your last 30 sessions, trading patterns, and previous AI interactions for contextual continuity",
              time: "0.8s" },
            { n: "04", label: "VALIDATE", 
              what: "Pre-flight data checks", 
              detail: "Verifies data stream integrity, confirms API connections, and ensures all feeds are live",
              time: "0.3s" },
            { n: "05", label: "ACTIVATE", 
              what: "AI copilot is live", 
              detail: "All systems nominal -- your AI copilot is now actively monitoring and ready to respond",
              time: "0.1s" },
          ].map((step, i) => {
            const isLive = i === 4
            return (
              <div key={step.n} className="p-2.5 rounded-md" style={{ 
                background: isLive ? "rgba(74,222,128,0.04)" : "rgba(139,92,246,0.02)", 
                border: `1px solid ${isLive ? "rgba(74,222,128,0.15)" : "rgba(139,92,246,0.06)"}` 
              }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded" style={{ 
                      color: isLive ? "rgba(74,222,128,0.9)" : "rgba(139,92,246,0.7)",
                      background: isLive ? "rgba(74,222,128,0.1)" : "rgba(139,92,246,0.08)"
                    }}>{step.n}</span>
                    <span className="text-[12px] font-mono font-black" style={{ color: isLive ? "rgba(74,222,128,0.9)" : "rgba(216,180,254,0.85)" }}>{step.label}</span>
                    <span className="text-[10px] font-mono text-purple-300/60">{step.what}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded" style={{ 
                      color: isLive ? "rgba(74,222,128,0.9)" : "rgba(139,92,246,0.5)",
                      background: isLive ? "rgba(74,222,128,0.12)" : "rgba(139,92,246,0.05)"
                    }}>{isLive ? "LIVE" : "OK"}</span>
                    <span className="text-[9px] font-mono text-purple-400/35">{step.time}</span>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-purple-400/45 leading-relaxed pl-7">{step.detail}</p>
              </div>
            )
          })}
        </div>
      </div>

      <Connector green />

      {/* ── SESSION ACTIVE ── Redesigned: Clearer metrics */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(74,222,128,0.2)", background: "rgba(74,222,128,0.015)" }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ background: "rgba(74,222,128,0.05)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400/80 animate-pulse" />
            <p className="text-[14px] font-mono font-black text-emerald-200/90 tracking-wide">SESSION ACTIVE</p>
          </div>
          <span className="text-[11px] font-mono font-bold text-purple-300/70 px-2.5 py-1 rounded" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>Analyst Engine</span>
        </div>

        {/* Behavioral Filters - Redesigned */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(74,222,128,0.08)" }}>
          <p className="text-[11px] font-mono font-black text-emerald-300/70 tracking-[0.12em] uppercase mb-2.5">4 Behavioral Filters Scanning</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Psychology", color: "#f43f5e", desc: "Tracking emotional patterns, tilt signals, and confidence levels in real-time" },
              { label: "Discipline", color: "#f59e0b", desc: "Monitoring rule adherence, checklist compliance, and boundary enforcement" },
              { label: "Strategy", color: "#3b82f6", desc: "Evaluating setup quality, entry timing, and thesis alignment" },
              { label: "Risk", color: "#10b981", desc: "Watching position sizing, exposure levels, and drawdown thresholds" },
            ].map(f => (
              <div key={f.label} className="p-2.5 rounded-md" style={{ background: `${f.color}06`, border: `1px solid ${f.color}15` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.color, opacity: 0.6 }} />
                  <p className="text-[12px] font-mono font-black" style={{ color: `${f.color}cc` }}>{f.label}</p>
                </div>
                <p className="text-[9px] font-mono leading-relaxed" style={{ color: `${f.color}77` }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Metrics - Redesigned */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(74,222,128,0.08)" }}>
          <p className="text-[11px] font-mono font-black text-emerald-300/70 tracking-[0.12em] uppercase mb-2.5">Live Session Metrics</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "AI State", value: "Listening", color: "rgba(74,222,128,0.85)" },
              { label: "Latency", value: "< 200ms", color: "rgba(139,92,246,0.75)" },
              { label: "Patterns", value: "23 tracked", color: "rgba(245,158,11,0.75)" },
              { label: "Memory", value: "Full recall", color: "rgba(34,211,238,0.75)" },
              { label: "Signals", value: "Contextual", color: "rgba(244,114,182,0.75)" },
              { label: "Streams", value: "4 live feeds", color: "rgba(74,222,128,0.75)" },
            ].map(m => (
              <div key={m.label} className="px-2.5 py-2 rounded-md text-center" style={{ background: "rgba(74,222,128,0.02)", border: "1px solid rgba(74,222,128,0.08)" }}>
                <p className="text-[9px] font-mono font-bold text-purple-400/45 uppercase mb-0.5">{m.label}</p>
                <p className="text-[11px] font-mono font-black" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Session Controls */}
        <div className="px-3 py-2 border-t" style={{ borderColor: "rgba(74,222,128,0.08)" }}>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: "Switch Engine", desc: "Change framework" },
              { label: "Pause", desc: "Halt monitoring" },
              { label: "End + Review", desc: "Close session" },
            ].map(ctrl => (
              <div key={ctrl.label} className="text-center px-1.5 py-1.5 rounded" style={{ background: "rgba(139,92,246,0.03)", border: "1px solid rgba(139,92,246,0.08)" }}>
                <p className="text-[8px] font-mono font-black text-purple-300/70">{ctrl.label}</p>
                <p className="text-[6px] font-mono text-purple-400/30">{ctrl.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom status */}
        <div className="flex items-center justify-between px-3 py-1.5" style={{ background: "rgba(74,222,128,0.02)" }}>
          <span className="text-[7px] font-mono text-purple-400/25">All systems nominal</span>
          <span className="text-[8px] font-mono font-bold text-emerald-400/55">streaming live</span>
        </div>
      </div>
    </div>
  )
}






/* ══════════════════════════════════════════════════════════════
   CHOOSE YOUR PATH -- User Experience Journey SVG
   NOT a technical pipeline -- shows what the USER feels/experiences
   The bottom detail SVGs show the actual mechanics
   ══════════════════════════════════════════════════════════════ */
function PathSelectorSVG({ homeSection, setHomeSection }: { homeSection: "signals" | "modes"; setHomeSection: (s: "signals" | "modes") => void }) {
  const isSignals = homeSection === "signals"
  const amberA = (o: number) => `rgba(245,158,11,${o})`
  const purpleA = (o: number) => `rgba(139,92,246,${o})`

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06))" }} />
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">Choose Your Path</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
      </div>

      {/* ═══ TWO-COLUMN LAYOUT: No overlapping, no scale transforms ═══ */}
      <div className="flex gap-2">

        {/* ═══════════════════════════════��══════════════════
            LEFT: PATTERN DETECTION
            When active: takes ~65% width, full detail
            When inactive: takes ~35% width, header + tiny SVG
            ══════════════════════════════════════════════════ */}
        <div
          className="cursor-pointer overflow-hidden"
          onClick={() => setHomeSection("signals")}
          style={{
            flex: isSignals ? "1.85 1 0%" : "1 1 0%",
            transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <svg viewBox={isSignals ? "0 0 310 155" : "0 0 170 70"} className="w-full h-auto" fill="none" preserveAspectRatio="xMidYMid meet"
            style={{ transition: "all 0.4s ease" }}>

            {/* Title -- always visible, same y position */}
            <text x={isSignals ? "155" : "85"} y="16" fill={isSignals ? amberA(0.9) : amberA(0.5)} fontSize={isSignals ? "11" : "9"} fontFamily="monospace" fontWeight="900" textAnchor="middle" letterSpacing="1.5"
              style={{ transition: "all 0.3s ease" }}>PATTERN DETECTION</text>
            <text x={isSignals ? "155" : "85"} y={isSignals ? "30" : "28"} fill={isSignals ? amberA(0.65) : amberA(0.3)} fontSize={isSignals ? "8" : "6.5"} fontFamily="monospace" fontWeight="700" textAnchor="middle" letterSpacing="0.5"
              style={{ transition: "all 0.3s ease" }}>The AI Reads You</text>

            {/* SVG flow content -- full when active, tiny faded when inactive */}
            <g opacity={isSignals ? 1 : 0.35} style={{ transition: "opacity 0.4s ease" }}>

              {/* Step 1: YOU TRADE */}
              <circle cx={isSignals ? "28" : "20"} cy={isSignals ? "68" : "48"} r={isSignals ? "13" : "8"} fill={amberA(0.06)} stroke={amberA(isSignals ? 0.25 : 0.1)} strokeWidth="0.8"
                style={{ transition: "all 0.4s ease" }} />
              <circle cx={isSignals ? "28" : "20"} cy={isSignals ? "64" : "45"} r={isSignals ? "3.5" : "2"} fill={amberA(isSignals ? 0.35 : 0.15)}
                style={{ transition: "all 0.4s ease" }} />
              <text x={isSignals ? "28" : "20"} y={isSignals ? "92" : "62"} fill={amberA(isSignals ? 0.75 : 0.25)} fontSize={isSignals ? "7.5" : "5"} fontFamily="monospace" fontWeight="900" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>YOU</text>
              <text x={isSignals ? "28" : "20"} y={isSignals ? "102" : "68"} fill={amberA(isSignals ? 0.5 : 0.15)} fontSize={isSignals ? "6.5" : "4"} fontFamily="monospace" fontWeight="700" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>TRADE</text>

              {/* Connection 1: passive */}
              <line x1={isSignals ? "43" : "29"} y1={isSignals ? "68" : "48"} x2={isSignals ? "72" : "42"} y2={isSignals ? "68" : "48"} stroke={amberA(isSignals ? 0.15 : 0.06)} strokeWidth="1" strokeDasharray="4 3"
                style={{ transition: "all 0.4s ease" }}>
                {isSignals && <animate attributeName="stroke-dashoffset" values="0;-14" dur="2s" repeatCount="indefinite" />}
              </line>
              {isSignals && <text x="57" y="61" fill={amberA(0.45)} fontSize="5.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">passive</text>}

              {/* Step 2: AI WATCHES */}
              <rect x={isSignals ? "76" : "44"} y={isSignals ? "46" : "38"} width={isSignals ? "48" : "28"} height={isSignals ? "44" : "20"} rx={isSignals ? "6" : "4"} fill={amberA(0.04)} stroke={amberA(isSignals ? 0.2 : 0.08)} strokeWidth="0.8"
                style={{ transition: "all 0.4s ease" }} />
              <ellipse cx={isSignals ? "100" : "58"} cy={isSignals ? "62" : "45"} rx={isSignals ? "13" : "6"} ry={isSignals ? "7" : "4"} fill="none" stroke={amberA(isSignals ? 0.25 : 0.1)} strokeWidth="0.7"
                style={{ transition: "all 0.4s ease" }} />
              <circle cx={isSignals ? "100" : "58"} cy={isSignals ? "62" : "45"} r={isSignals ? "3.5" : "2"} fill={amberA(isSignals ? 0.4 : 0.15)}
                style={{ transition: "all 0.4s ease" }}>
                {isSignals && <animate attributeName="r" values="3;4;3" dur="2.5s" repeatCount="indefinite" />}
              </circle>
              {isSignals && (
                <circle cx="100" cy="62" r="7" fill="none" stroke={amberA(0.15)} strokeWidth="0.5" opacity="0">
                  <animate attributeName="r" values="7;16;7" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
              <text x={isSignals ? "100" : "58"} y={isSignals ? "102" : "64"} fill={amberA(isSignals ? 0.7 : 0.2)} fontSize={isSignals ? "7" : "4.5"} fontFamily="monospace" fontWeight="800" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>AI WATCHES</text>

              {/* Connection 2 */}
              <line x1={isSignals ? "126" : "73"} y1={isSignals ? "68" : "48"} x2={isSignals ? "158" : "86"} y2={isSignals ? "68" : "48"} stroke={amberA(isSignals ? 0.15 : 0.06)} strokeWidth="1" strokeDasharray="3 3"
                style={{ transition: "all 0.4s ease" }}>
                {isSignals && <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.8s" repeatCount="indefinite" />}
              </line>
              {isSignals && (
                <circle r="2.5" fill={amberA(0.6)} opacity="0">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path="M126,68 L158,68" />
                  <animate attributeName="opacity" values="0;0.7;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Step 3: PATTERNS SURFACE */}
              <rect x={isSignals ? "162" : "88"} y={isSignals ? "42" : "36"} width={isSignals ? "54" : "30"} height={isSignals ? "52" : "24"} rx={isSignals ? "6" : "4"} fill={amberA(0.05)} stroke={amberA(isSignals ? 0.25 : 0.1)} strokeWidth="0.8"
                style={{ transition: "all 0.4s ease" }}>
                {isSignals && <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="2.5s" repeatCount="indefinite" />}
              </rect>
              {[0, 1, 2, 3].map((i) => (
                <rect key={`rbar-${i}`}
                  x={isSignals ? 172 + i * 10 : 93 + i * 5}
                  y={isSignals ? 74 - (14 + i * 5) : 48 - (4 + i * 2)}
                  width={isSignals ? "5.5" : "3"}
                  height={isSignals ? 14 + i * 5 : 4 + i * 2}
                  rx="1.5"
                  fill={amberA(isSignals ? 0.15 + i * 0.08 : 0.06 + i * 0.03)}
                  style={{ transition: "all 0.4s ease" }}>
                  {isSignals && <animate attributeName="height" values={`${10 + i * 3};${18 + i * 5};${10 + i * 3}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />}
                  {isSignals && <animate attributeName="y" values={`${74 - (10 + i * 3)};${74 - (18 + i * 5)};${74 - (10 + i * 3)}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />}
                </rect>
              ))}
              <text x={isSignals ? "189" : "103"} y={isSignals ? "86" : "56"} fill={amberA(isSignals ? 0.7 : 0.2)} fontSize={isSignals ? "7" : "4.5"} fontFamily="monospace" fontWeight="800" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>PATTERNS</text>

              {/* Connection 3 */}
              <line x1={isSignals ? "218" : "119"} y1={isSignals ? "68" : "48"} x2={isSignals ? "240" : "130"} y2={isSignals ? "68" : "48"} stroke={amberA(isSignals ? 0.18 : 0.06)} strokeWidth="1.5"
                style={{ transition: "all 0.4s ease" }} />
              <polygon points={isSignals ? "238,65.5 243,68 238,70.5" : "128,46 132,48 128,50"} fill={amberA(isSignals ? 0.35 : 0.1)} />

              {/* Step 4: BLIND SPOTS -- no border, no icon, just text */}
              <text x={isSignals ? "262" : "148"} y={isSignals ? "65" : "46"} fill={amberA(isSignals ? 0.85 : 0.25)} fontSize={isSignals ? "8" : "5"} fontFamily="monospace" fontWeight="900" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>BLIND</text>
              <text x={isSignals ? "262" : "148"} y={isSignals ? "77" : "53"} fill={amberA(isSignals ? 0.7 : 0.2)} fontSize={isSignals ? "7.5" : "4.5"} fontFamily="monospace" fontWeight="800" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>SPOTS</text>
            </g>

            {/* Description -- only when active */}
            {isSignals && (
              <g>
                <text x="155" y="118" fill={amberA(0.55)} fontSize="6.5" fontFamily="monospace" fontWeight="600" textAnchor="middle" letterSpacing="0.3">No effort required. The AI does the watching.</text>
                <text x="155" y="129" fill={amberA(0.4)} fontSize="5.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.3">You just see what you were missing.</text>
                <rect x="30" y="142" width="250" height="3" rx="1.5" fill={amberA(0.3)}>
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
                </rect>
              </g>
            )}
          </svg>
        </div>


        {/* ══════════════════════════════════════════════════
            RIGHT: GUIDED SESSIONS
            When active: takes ~65% width, full detail
            When inactive: takes ~35% width, header + tiny SVG
            ══════════════════════════════════════════════════ */}
        <div
          className="cursor-pointer overflow-hidden"
          onClick={() => setHomeSection("modes")}
          style={{
            flex: !isSignals ? "1.85 1 0%" : "1 1 0%",
            transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <svg viewBox={!isSignals ? "0 0 310 155" : "0 0 170 70"} className="w-full h-auto" fill="none" preserveAspectRatio="xMidYMid meet"
            style={{ transition: "all 0.4s ease" }}>

            {/* Title -- always visible */}
            <text x={!isSignals ? "155" : "85"} y="16" fill={!isSignals ? purpleA(0.9) : purpleA(0.5)} fontSize={!isSignals ? "11" : "9"} fontFamily="monospace" fontWeight="900" textAnchor="middle" letterSpacing="1.5"
              style={{ transition: "all 0.3s ease" }}>GUIDED SESSIONS</text>
            <text x={!isSignals ? "155" : "85"} y={!isSignals ? "30" : "28"} fill={!isSignals ? purpleA(0.65) : purpleA(0.3)} fontSize={!isSignals ? "8" : "6.5"} fontFamily="monospace" fontWeight="700" textAnchor="middle" letterSpacing="0.5"
              style={{ transition: "all 0.3s ease" }}>You Lead the AI</text>

            {/* SVG flow content */}
            <g opacity={!isSignals ? 1 : 0.35} style={{ transition: "opacity 0.4s ease" }}>

              {/* Step 1: YOU CHOOSE */}
              <circle cx={!isSignals ? "28" : "20"} cy={!isSignals ? "68" : "48"} r={!isSignals ? "13" : "8"} fill={purpleA(0.06)} stroke={purpleA(!isSignals ? 0.25 : 0.1)} strokeWidth="0.8"
                style={{ transition: "all 0.4s ease" }} />
              <circle cx={!isSignals ? "28" : "20"} cy={!isSignals ? "64" : "45"} r={!isSignals ? "3.5" : "2"} fill={purpleA(!isSignals ? 0.4 : 0.15)}
                style={{ transition: "all 0.4s ease" }} />
              <text x={!isSignals ? "28" : "20"} y={!isSignals ? "92" : "62"} fill={purpleA(!isSignals ? 0.75 : 0.25)} fontSize={!isSignals ? "7.5" : "5"} fontFamily="monospace" fontWeight="900" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>YOU</text>
              <text x={!isSignals ? "28" : "20"} y={!isSignals ? "102" : "68"} fill={purpleA(!isSignals ? 0.5 : 0.15)} fontSize={!isSignals ? "6.5" : "4"} fontFamily="monospace" fontWeight="700" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>CHOOSE</text>

              {/* Connection 1: direct */}
              <line x1={!isSignals ? "43" : "29"} y1={!isSignals ? "68" : "48"} x2={!isSignals ? "72" : "42"} y2={!isSignals ? "68" : "48"} stroke={purpleA(!isSignals ? 0.15 : 0.06)} strokeWidth="1"
                style={{ transition: "all 0.4s ease" }} />
              <polygon points={!isSignals ? "70,65.5 74,68 70,70.5" : "40,46 44,48 40,50"} fill={purpleA(!isSignals ? 0.25 : 0.08)} />
              {!isSignals && <text x="57" y="61" fill={purpleA(0.45)} fontSize="5.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">direct</text>}

              {/* Step 2: MODE SELECT */}
              <rect x={!isSignals ? "76" : "44"} y={!isSignals ? "46" : "38"} width={!isSignals ? "44" : "28"} height={!isSignals ? "44" : "20"} rx={!isSignals ? "5" : "3"} fill={purpleA(0.04)} stroke={purpleA(!isSignals ? 0.2 : 0.08)} strokeWidth="0.8"
                style={{ transition: "all 0.4s ease" }} />
              {!isSignals ? (
                ["Focus", "Mentor", "Review"].map((m, i) => (
                  <g key={`mc-${i}`}>
                    <rect x="81" y={51 + i * 13} width="34" height="10" rx="2.5" fill={i === 0 ? purpleA(0.12) : purpleA(0.04)} stroke={i === 0 ? purpleA(0.35) : purpleA(0.1)} strokeWidth="0.5" />
                    <text x="98" y={59 + i * 13} fill={purpleA(0.5 + (i === 0 ? 0.3 : 0))} fontSize="6" fontFamily="monospace" fontWeight="700" textAnchor="middle">{m}</text>
                  </g>
                ))
              ) : (
                [0, 1, 2].map((i) => (
                  <rect key={`mc-s-${i}`} x="48" y={41 + i * 6} width="20" height="4" rx="1" fill={purpleA(0.06 + (i === 0 ? 0.06 : 0))} />
                ))
              )}
              {!isSignals && <text x="98" y="102" fill={purpleA(0.5)} fontSize="5.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">+5 modes</text>}

              {/* Connection 2 */}
              <line x1={!isSignals ? "122" : "73"} y1={!isSignals ? "68" : "48"} x2={!isSignals ? "152" : "86"} y2={!isSignals ? "68" : "48"} stroke={purpleA(!isSignals ? 0.15 : 0.06)} strokeWidth="1" strokeDasharray="3 3"
                style={{ transition: "all 0.4s ease" }}>
                {!isSignals && <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.8s" repeatCount="indefinite" />}
              </line>
              {!isSignals && (
                <circle r="2.5" fill={purpleA(0.6)} opacity="0">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path="M122,68 L152,68" />
                  <animate attributeName="opacity" values="0;0.7;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Step 3: AI ADAPTS */}
              <rect x={!isSignals ? "156" : "88"} y={!isSignals ? "46" : "38"} width={!isSignals ? "42" : "24"} height={!isSignals ? "44" : "20"} rx={!isSignals ? "6" : "4"} fill={purpleA(0.05)} stroke={purpleA(!isSignals ? 0.25 : 0.1)} strokeWidth="0.8"
                style={{ transition: "all 0.4s ease" }}>
                {!isSignals && <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="2s" repeatCount="indefinite" />}
              </rect>
              {[0, 1, 2].map((i) => (
                <line key={`wv-${i}`}
                  x1={!isSignals ? "164" : "92"}
                  y1={!isSignals ? 56 + i * 9 : 42 + i * 5}
                  x2={!isSignals ? 178 + i * 4 : 104}
                  y2={!isSignals ? 56 + i * 9 : 42 + i * 5}
                  stroke={purpleA(!isSignals ? 0.2 + i * 0.08 : 0.08)} strokeWidth={!isSignals ? "1.8" : "1"} strokeLinecap="round"
                  style={{ transition: "all 0.4s ease" }}>
                  {!isSignals && <animate attributeName="x2" values={`${170};${184 + i * 3};${170}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />}
                </line>
              ))}
              <text x={!isSignals ? "177" : "100"} y={!isSignals ? "102" : "64"} fill={purpleA(!isSignals ? 0.7 : 0.2)} fontSize={!isSignals ? "6.5" : "4.5"} fontFamily="monospace" fontWeight="800" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>AI ADAPTS</text>

              {/* Connection 3 */}
              <line x1={!isSignals ? "200" : "113"} y1={!isSignals ? "68" : "48"} x2={!isSignals ? "218" : "124"} y2={!isSignals ? "68" : "48"} stroke={purpleA(!isSignals ? 0.18 : 0.06)} strokeWidth="1.5"
                style={{ transition: "all 0.4s ease" }} />
              <polygon points={!isSignals ? "216,65.5 221,68 216,70.5" : "122,46 126,48 122,50"} fill={purpleA(!isSignals ? 0.35 : 0.1)} />

              {/* Step 4: SHARPER EDGE -- no border, just diamond + text */}
              {!isSignals ? (
                <g>
                  <polygon points="240,56 247,65 240,74 233,65" fill="none" stroke={purpleA(0.4)} strokeWidth="0.8" />
                  <polygon points="240,60 244,65 240,70 236,65" fill={purpleA(0.25)} />
                  <polygon points="240,56 247,65 240,74 233,65" fill="none" stroke={purpleA(0.2)} strokeWidth="0.4" opacity="0">
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
                  </polygon>
                </g>
              ) : (
                <g>
                  <polygon points="140,44 144,48 140,52 136,48" fill="none" stroke={purpleA(0.15)} strokeWidth="0.6" />
                  <polygon points="140,46 142,48 140,50 138,48" fill={purpleA(0.1)} />
                </g>
              )}
              <text x={!isSignals ? "240" : "140"} y={!isSignals ? "88" : "58"} fill={purpleA(!isSignals ? 0.8 : 0.25)} fontSize={!isSignals ? "7" : "4.5"} fontFamily="monospace" fontWeight="900" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>SHARPER</text>
              <text x={!isSignals ? "240" : "140"} y={!isSignals ? "98" : "64"} fill={purpleA(!isSignals ? 0.65 : 0.2)} fontSize={!isSignals ? "6.5" : "4"} fontFamily="monospace" fontWeight="800" textAnchor="middle"
                style={{ transition: "all 0.4s ease" }}>EDGE</text>
            </g>

            {/* Description -- only when active */}
            {!isSignals && (
              <g>
                <text x="155" y="118" fill={purpleA(0.55)} fontSize="6.5" fontFamily="monospace" fontWeight="600" textAnchor="middle" letterSpacing="0.3">You set the direction. The AI follows your lead.</text>
                <text x="155" y="129" fill={purpleA(0.4)} fontSize="5.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.3">Every session sharpens how you think.</text>
                <rect x="30" y="142" width="250" height="3" rx="1.5" fill={purpleA(0.3)}>
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
                </rect>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}


export function IntelligenceGateway({ homeSection, setHomeSection }: IntelligenceGatewayProps) {
  return (
    <div className="relative px-4 pt-6 pb-4">

      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute left-1/2 top-0 -translate-x-1/2 w-[280px] h-[160px] rounded-full"
          animate={{ opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.18), rgba(59,130,246,0.04) 50%, transparent 75%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5, ease: "easeOut" }}
        className="relative px-4"
      >
        {/* HERO TITLE */}
        <div className="text-center mb-6 relative">
          <h2 className="text-[22px] font-black text-white tracking-[-0.03em] leading-[1.3] relative">
            {"See what you can't see."}
          </h2>

          {/* "Think what you haven't thought." -- meaningful color expression */}
          <div className="relative mt-2 mb-1">
            <div className="flex items-center justify-center gap-[5px] flex-wrap">
              {[
                { word: "Think", color: "#a78bfa" },
                { word: "what", color: null },
                { word: "you", color: null },
                { word: "haven't", color: "#f59e0b" },
                { word: "thought.", color: "#34d399" },
              ].map(({ word, color }, i) => (
                <motion.span
                  key={word}
                  className="text-[22px] font-black tracking-[-0.03em] leading-[1.2] relative inline-block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }}
                >
                  {color ? (
                    <span className="relative" style={{ color }}>
                      {word}
                      <motion.span
                        className="absolute bottom-[-3px] left-0 right-0 h-[2px] rounded-full"
                        animate={{ opacity: [0.25, 0.6, 0.25], scaleX: [0.6, 1, 0.6] }}
                        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                          transformOrigin: "center",
                        }}
                      />
                    </span>
                  ) : (
                    <span className="text-white/55">{word}</span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-[12.5px] text-white/50 mt-3 leading-[1.7] max-w-[360px] mx-auto text-balance">
            {"Your AI copilot detects behavioral patterns in real-time and gives you focused, structured sessions to sharpen every trading decision you make."}
          </p>
        </div>

        {/* PATH SELECTOR SVG */}
        <div className="mb-4">
          <PathSelectorSVG homeSection={homeSection} setHomeSection={setHomeSection} />
        </div>

        {/* SELECTED PATH DETAIL CARD */}
        <AnimatePresence mode="wait">
          {homeSection === "signals" ? (
            <motion.div
              key="path-signals"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 rounded-xl"
                style={{
                  backgroundColor: "rgba(245,158,11,0.04)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }} />
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ boxShadow: "inset 0 0 40px rgba(245,158,11,0.06), 0 0 25px rgba(245,158,11,0.04)" }} />
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none border"
                animate={{ borderColor: ["rgba(245,158,11,0.15)", "rgba(245,158,11,0.3)", "rgba(245,158,11,0.15)"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ background: "linear-gradient(120deg, transparent 25%, rgba(245,158,11,0.05) 50%, transparent 75%)", backgroundSize: "250% 100%" }}
                animate={{ backgroundPositionX: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

              <div className="relative px-4 py-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[14px] font-black text-white leading-tight tracking-tight">How Detection Works</h3>
                  <span className="text-[8px] font-mono uppercase tracking-wider text-amber-400/60">Internal Mechanics</span>
                </div>
                <p className="text-[10px] leading-[1.55] text-amber-200/50 mb-3">Four behavioral streams are ingested, normalized, and processed through a 6-stage AI pipeline: pattern matching across 47 models, cross-signal correlation analysis, weighted classification into Psychology, Discipline, Strategy, and Risk, then confidence scoring before generating targeted alerts.</p>
                <AIReadsYouDiagram active />
                <motion.div className="mt-2 h-[2px] rounded-full"
                  style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.5), rgba(245,158,11,0.05))" }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="path-modes"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 rounded-xl"
                style={{
                  backgroundColor: "rgba(139,92,246,0.04)",
                  border: "1px solid rgba(139,92,246,0.2)",
                }} />
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ boxShadow: "inset 0 0 30px rgba(139,92,246,0.04), 0 0 20px rgba(139,92,246,0.03)" }} />
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ background: "linear-gradient(120deg, transparent 30%, rgba(139,92,246,0.04) 50%, transparent 70%)", backgroundSize: "250% 100%" }}
                animate={{ backgroundPositionX: ["-100%", "200%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

              <div className="relative px-4 py-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[14px] font-black text-white leading-tight tracking-tight">How Sessions Work</h3>
                  <span className="text-[8px] font-mono uppercase tracking-wider text-purple-400/60">Engine Architecture</span>
                </div>
                <p className="text-[10px] leading-[1.55] text-purple-200/55 mb-3">Your intent selects a thinking framework from 8 intelligence modes. The AI Engine calibrates depth, scope, and tone to match your exact needs before activating the session.</p>
                <YouLeadAIDiagram active />
                <motion.div className="mt-2 h-[2px] rounded-full"
                  style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.5), rgba(139,92,246,0.05))" }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
