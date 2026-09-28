"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { EntryModel, ModelState, ConditionStatus, ModelEducation, EducationStep } from "@/lib/mentor/types"

/* ── Visual config ── */

const STATE_CONFIG: Record<ModelState, { color: string; label: string; bg: string; glow: string }> = {
  TRIGGERED: { color: "#10b981", label: "TRIGGERED", bg: "rgba(16,185,129,0.06)", glow: "rgba(16,185,129,0.08)" },
  FORMING:   { color: "#f59e0b", label: "FORMING",  bg: "rgba(245,158,11,0.04)", glow: "rgba(245,158,11,0.06)" },
  ACTIVE:    { color: "#3b82f6", label: "ACTIVE",   bg: "rgba(59,130,246,0.04)", glow: "rgba(59,130,246,0.06)" },
  INACTIVE:  { color: "#6b7280", label: "INACTIVE", bg: "rgba(107,114,128,0.02)", glow: "transparent" },
}

const COND_CFG: Record<ConditionStatus, { color: string; bg: string }> = {
  MET:     { color: "#10b981", bg: "rgba(16,185,129,0.06)" },
  PENDING: { color: "#f59e0b", bg: "rgba(245,158,11,0.04)" },
  FAILED:  { color: "#ef4444", bg: "rgba(239,68,68,0.04)" },
}

/* ── Condition icon (check / clock / x) ── */

function ConditionIcon({ status }: { status: ConditionStatus }) {
  const { color } = COND_CFG[status]
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      {status === "MET" && (
        <g>
          <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1" opacity="0.2" />
          <path d="M4.5 7L6 8.5L9.5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {status === "PENDING" && (
        <g>
          <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1" opacity="0.2" />
          <circle cx="7" cy="7" r="2" fill={color} opacity="0.3" />
        </g>
      )}
      {status === "FAILED" && (
        <g>
          <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1" opacity="0.2" />
          <path d="M5 5L9 9M9 5L5 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}

/* ── Education Step Card ── */

function StepCard({ step, accentColor }: { step: EducationStep; accentColor: string }) {
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
      {/* Step header */}
      <div className="flex items-center gap-2.5 px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.015)" }}>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
        >
          <span className="text-[9px] font-mono font-black" style={{ color: accentColor }}>
            {step.stepNumber}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-white/70">{step.title}</span>
      </div>

      <div className="px-3 py-2.5">
        <p className="text-[9px] font-mono text-white/40 leading-relaxed">{step.description}</p>

        {/* Visual cue */}
        <div className="mt-2 rounded-md px-2.5 py-2" style={{ backgroundColor: "rgba(59,130,246,0.03)", border: "1px solid rgba(59,130,246,0.08)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="#3b82f6" strokeWidth="0.8" opacity="0.4" />
              <circle cx="5" cy="5" r="1.5" fill="#3b82f6" opacity="0.6" />
            </svg>
            <span className="text-[7px] font-mono font-black tracking-wider uppercase text-blue-400/50">WHAT TO LOOK FOR</span>
          </div>
          <p className="text-[8px] font-mono text-blue-300/40 leading-relaxed">{step.visualCue}</p>
        </div>

        {/* Media placeholder (chart annotation representation) */}
        {step.media && (
          <div className="mt-2 rounded-md overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="h-20 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005))" }}>
              <div className="flex flex-col items-center gap-1.5">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/10">
                  {step.media.type === "video" ? (
                    <g>
                      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
                      <polygon points="8,7 14,10 8,13" fill="currentColor" />
                    </g>
                  ) : (
                    <g>
                      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="0.8" />
                      <path d="M2 14L7 10L11 13L14 10L18 14" stroke="currentColor" strokeWidth="0.8" />
                    </g>
                  )}
                </svg>
                <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">
                  {step.media.type === "video" ? "VIDEO" : step.media.type === "diagram" ? "DIAGRAM" : "CHART"}
                </span>
              </div>
            </div>
            <div className="px-2 py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
              <p className="text-[7.5px] font-mono text-white/25 leading-relaxed">{step.media.caption}</p>
            </div>
          </div>
        )}

        {/* Mentor tip */}
        {step.mentorTip && (
          <button
            onClick={() => setShowTip(!showTip)}
            className="mt-2 w-full text-left"
          >
            <div
              className="rounded-md px-2.5 py-2 transition-all duration-200"
              style={{
                backgroundColor: showTip ? `${accentColor}06` : "transparent",
                border: `1px solid ${showTip ? `${accentColor}15` : "rgba(255,255,255,0.03)"}`,
              }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="text-[7px] font-mono font-black tracking-wider uppercase" style={{ color: `${accentColor}60` }}>
                  JADECAP TIP
                </span>
                <svg
                  width="8" height="8" viewBox="0 0 8 8" fill="none" className="ml-auto transition-transform duration-200"
                  style={{ transform: showTip ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <path d="M2 3L4 5L6 3" stroke={`${accentColor}40`} strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
              <AnimatePresence>
                {showTip && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-[8px] font-mono leading-relaxed mt-1.5 overflow-hidden"
                    style={{ color: `${accentColor}50` }}
                  >
                    {step.mentorTip}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Education Popup (full deep-dive) ── */

function EducationPopup({
  model,
  education,
  accentColor,
  onClose,
}: {
  model: EntryModel
  education: ModelEducation
  accentColor: string
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState<"steps" | "mistakes" | "examples">("steps")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-[420px] max-h-[85vh] rounded-xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: "#0c0c12",
          border: `1px solid ${accentColor}18`,
          boxShadow: `0 0 60px ${accentColor}08, 0 25px 50px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Header */}
        <div className="px-4 py-3.5 flex items-center justify-between shrink-0" style={{ borderBottom: `1px solid ${accentColor}10` }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-[7px] font-mono font-black tracking-[0.15em] uppercase" style={{ color: `${accentColor}60` }}>
                EDUCATION
              </span>
            </div>
            <h2 className="text-[13px] font-bold text-white/90 truncate">{model.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              {model.historicalWinRate && (
                <span className="text-[8px] font-mono text-emerald-400/50">
                  {model.historicalWinRate}% WR
                </span>
              )}
              {model.averageR && (
                <span className="text-[8px] font-mono text-blue-400/50">
                  {model.averageR}R avg
                </span>
              )}
              {model.sampleSize && (
                <span className="text-[8px] font-mono text-white/20">
                  {model.sampleSize} trades
                </span>
              )}
              {model.executionTimeframe && (
                <span className="text-[8px] font-mono text-white/20">
                  {model.executionTimeframe}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.04] transition-colors shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3L9 9M9 3L3 9" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Overview */}
        <div className="px-4 py-3 shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
          <p className="text-[9px] font-mono text-white/35 leading-[1.7]">{education.overview}</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 gap-1 shrink-0 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          {(["steps", "mistakes", "examples"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-3 py-2 text-[8px] font-mono font-bold uppercase tracking-wider transition-colors"
              style={{ color: activeTab === tab ? accentColor : "rgba(255,255,255,0.2)" }}
            >
              {tab === "steps" ? `${education.steps.length} Steps` : tab === "mistakes" ? "Mistakes" : `${education.chartExamples.length} Charts`}
              {activeTab === tab && (
                <motion.div
                  layoutId="edu-tab"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-terminal px-4 py-3">
          {activeTab === "steps" && (
            <div className="flex flex-col gap-2.5">
              {education.steps.map(step => (
                <StepCard key={step.id} step={step} accentColor={accentColor} />
              ))}

              {/* Psychology note at bottom */}
              <div className="rounded-lg px-3 py-3 mt-1" style={{ backgroundColor: "rgba(236,72,153,0.03)", border: "1px solid rgba(236,72,153,0.08)" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#ec4899" strokeWidth="0.8" opacity="0.3" />
                    <path d="M6 3.5V6.5M6 8V8.01" stroke="#ec4899" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-[7px] font-mono font-black tracking-wider uppercase text-pink-400/50">PSYCHOLOGY</span>
                </div>
                <p className="text-[8.5px] font-mono text-pink-300/30 leading-relaxed">{education.psychologyNotes}</p>
              </div>

              {/* Key takeaway */}
              <div className="rounded-lg px-3 py-3" style={{ backgroundColor: `${accentColor}04`, border: `1px solid ${accentColor}12` }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  <span className="text-[7px] font-mono font-black tracking-wider uppercase" style={{ color: `${accentColor}50` }}>KEY TAKEAWAY</span>
                </div>
                <p className="text-[9px] font-mono leading-relaxed" style={{ color: `${accentColor}40` }}>{education.keyTakeaway}</p>
              </div>
            </div>
          )}

          {activeTab === "mistakes" && (
            <div className="flex flex-col gap-2">
              {education.commonMistakes.map((mistake, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                  style={{ backgroundColor: "rgba(239,68,68,0.02)", border: "1px solid rgba(239,68,68,0.06)" }}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-px" style={{ backgroundColor: "rgba(239,68,68,0.08)" }}>
                    <span className="text-[8px] font-mono font-black text-red-400/50">{i + 1}</span>
                  </div>
                  <p className="text-[9px] font-mono text-white/35 leading-relaxed">{mistake}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "examples" && (
            <div className="flex flex-col gap-2.5">
              {education.chartExamples.map(ex => (
                <div key={ex.id} className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="h-28 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))" }}>
                    <div className="flex flex-col items-center gap-2">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="3" y="4" width="22" height="20" rx="3" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
                        <circle cx="10" cy="11" r="3" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                        <path d="M3 19L10 14L15 17L19 13L25 18" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                      </svg>
                      <span className="text-[7px] font-mono text-white/12 uppercase tracking-wider">ANNOTATED CHART</span>
                    </div>
                  </div>
                  <div className="px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                    <p className="text-[8.5px] font-mono text-white/30 leading-relaxed">{ex.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Main Component ── */

interface Props {
  models: EntryModel[]
  accentColor?: string
}

export function EntryModelCards({ models, accentColor = "#a78bfa" }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [educationModelId, setEducationModelId] = useState<string | null>(null)

  const educationModel = models.find(m => m.id === educationModelId)

  const handleEducationOpen = useCallback((id: string) => {
    setEducationModelId(id)
  }, [])

  return (
    <>
      <div className="mx-3 my-2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[7px] font-mono font-black tracking-[0.14em] uppercase text-white/25">
            ENTRY MODELS
          </span>
          <span className="text-[8px] font-mono tabular-nums text-white/15">
            {models.filter(m => m.state !== "INACTIVE").length} active
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {models.map(model => {
            const cfg = STATE_CONFIG[model.state]
            const metCount = model.conditions.filter(c => c.status === "MET").length
            const total = model.conditions.length
            const isExpanded = expandedId === model.id
            const progress = total > 0 ? (metCount / total) * 100 : 0

            return (
              <div key={model.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${cfg.color}12` }}>
                {/* Card header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : model.id)}
                  className="w-full text-left px-3 py-3 transition-all duration-200 relative overflow-hidden"
                  style={{ backgroundColor: cfg.bg }}
                >
                  {/* Ambient glow for active states */}
                  {model.state !== "INACTIVE" && (
                    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 0% 50%, ${cfg.glow}, transparent 70%)` }} />
                  )}

                  <div className="relative">
                    {/* Top row: name + badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                          {(model.state === "TRIGGERED" || model.state === "FORMING") && (
                            <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: cfg.color, opacity: 0.4 }} />
                          )}
                        </div>
                        <span className="text-[11px] font-mono font-bold text-white/75 truncate">{model.name}</span>
                      </div>
                      <span
                        className="text-[6.5px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0"
                        style={{ color: cfg.color, backgroundColor: `${cfg.color}12`, border: `1px solid ${cfg.color}18` }}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono text-white/20">Conditions</span>
                        <span className="text-[9px] font-mono font-bold tabular-nums" style={{ color: `${cfg.color}80` }}>
                          {metCount}/{total}
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-white/10">|</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono text-white/20">Target</span>
                        <span className="text-[9px] font-mono font-bold tabular-nums text-emerald-400/50">1:{model.targetRMultiple}R</span>
                      </div>
                      {model.executionTimeframe && (
                        <>
                          <div className="text-[8px] font-mono text-white/10">|</div>
                          <span className="text-[8px] font-mono text-white/20">{model.executionTimeframe}</span>
                        </>
                      )}
                    </div>

                    {/* Instruments */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {model.instruments.map(inst => (
                        <span key={inst} className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: "rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                          {inst}
                        </span>
                      ))}
                      {model.historicalWinRate && (
                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded ml-auto" style={{ color: "rgba(16,185,129,0.4)", backgroundColor: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.08)" }}>
                          {model.historicalWinRate}% WR ({model.sampleSize})
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2.5 h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: `${cfg.color}08` }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ backgroundColor: cfg.color, boxShadow: `0 0 8px ${cfg.color}30` }}
                      />
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <div className="flex justify-center mt-1">
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className="transition-transform duration-200"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                      <path d="M3 5L6 7.5L9 5" stroke={`${cfg.color}30`} strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                </button>

                {/* Expanded section: conditions + education CTA */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-1" style={{ backgroundColor: "rgba(255,255,255,0.008)" }}>
                        {/* Conditions list */}
                        <div className="rounded-lg px-2.5 py-2.5" style={{ backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                          <span className="text-[7px] font-mono font-black tracking-wider uppercase text-white/18">
                            CONDITIONS CHECKLIST
                          </span>
                          <div className="mt-2 flex flex-col gap-2">
                            {model.conditions.map(c => {
                              const cc = COND_CFG[c.status]
                              return (
                                <div key={c.id} className="rounded-md px-2.5 py-2 transition-all" style={{ backgroundColor: cc.bg, border: `1px solid ${cc.color}08` }}>
                                  <div className="flex items-center gap-2">
                                    <ConditionIcon status={c.status} />
                                    <span className="text-[9px] font-mono font-bold flex-1" style={{ color: `${cc.color}85` }}>
                                      {c.label}
                                    </span>
                                    <span className="text-[7px] font-mono font-black tracking-wider uppercase" style={{ color: `${cc.color}50` }}>
                                      {c.status}
                                    </span>
                                  </div>
                                  <p className="text-[8px] font-mono text-white/25 leading-relaxed mt-1 pl-[22px]">
                                    {c.description}
                                  </p>
                                  {c.whatToWatch && c.status === "PENDING" && (
                                    <div className="mt-1.5 ml-[22px] rounded px-2 py-1.5" style={{ backgroundColor: "rgba(245,158,11,0.03)", border: "1px solid rgba(245,158,11,0.06)" }}>
                                      <div className="flex items-center gap-1 mb-0.5">
                                        <span className="text-[6px] font-mono font-black tracking-wider uppercase text-amber-400/40">WATCH FOR</span>
                                        {c.checkTimeframe && <span className="text-[6px] font-mono text-white/12 ml-auto">{c.checkTimeframe}</span>}
                                      </div>
                                      <p className="text-[7.5px] font-mono text-amber-300/25 leading-relaxed">{c.whatToWatch}</p>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Invalidation rules */}
                        <div className="mt-2 rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(239,68,68,0.02)", border: "1px solid rgba(239,68,68,0.06)" }}>
                          <span className="text-[7px] font-mono font-black tracking-wider uppercase text-red-400/30">INVALIDATION</span>
                          <div className="mt-1.5 flex flex-col gap-1">
                            {model.invalidationRules.map((rule, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0 mt-0.5">
                                  <path d="M2 2L6 6M6 2L2 6" stroke="rgba(239,68,68,0.25)" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                                <span className="text-[8px] font-mono text-white/20 leading-relaxed">{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Education CTA */}
                        {model.education && (
                          <button
                            onClick={() => handleEducationOpen(model.id)}
                            className="mt-2.5 w-full rounded-lg px-3 py-3 text-left transition-all duration-300 group relative overflow-hidden"
                            style={{ backgroundColor: `${accentColor}04`, border: `1px solid ${accentColor}15` }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(ellipse at 30% 50%, ${accentColor}08, transparent 70%)` }} />
                            <div className="relative flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}20` }}
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <rect x="2" y="3" width="12" height="10" rx="1.5" stroke={accentColor} strokeWidth="1" opacity="0.5" />
                                  <path d="M5 7H11M5 9.5H9" stroke={accentColor} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
                                  <circle cx="8" cy="5.5" r="1.2" stroke={accentColor} strokeWidth="0.6" opacity="0.4" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-mono font-bold block" style={{ color: `${accentColor}70` }}>
                                  Learn This Model
                                </span>
                                <span className="text-[7.5px] font-mono text-white/20">
                                  {model.education.steps.length} steps -- videos, charts, mentor tips
                                </span>
                              </div>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 group-hover:translate-x-0.5 transition-transform">
                                <path d="M4.5 3L8 6L4.5 9" stroke={`${accentColor}40`} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Education popup portal */}
      <AnimatePresence>
        {educationModel?.education && (
          <EducationPopup
            model={educationModel}
            education={educationModel.education}
            accentColor={accentColor}
            onClose={() => setEducationModelId(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
