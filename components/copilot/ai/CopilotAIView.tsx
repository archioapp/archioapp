"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Target, Shield, Brain, BookOpen, GitBranch, TrendingUp,
  ArrowRight, ChevronDown, ChevronRight, ChevronLeft,
  X, Sparkles, Sparkle, Send, ArrowLeft, ArrowUpRight, Copy, Check,
  Globe, Waypoints, HeartPulse, RotateCcw, SunMedium, Moon, Cpu,
  MessageSquare, Plus, Mic, Paperclip, Zap, Compass, AlertTriangle,
  Lightbulb, Activity, Award, Layers,
  Flame, Search, ShieldAlert, Scale, Timer
} from "lucide-react"
import {
  CONVERSATION_MODES, BEHAVIOR_SIGNALS, CATEGORY_STYLES,
  type Message, type ConversationMode, type BehaviorSignal, type ChatThread
} from "./copilot-ai-data"
import { IntelligenceGateway } from "./IntelligenceGateway"
import { IntelligenceBoard } from "./IntelligenceBoard"
import { getModeVisualization } from "./mode-visualizations"

const IMPACT_STYLES: Record<string, { dot: string; label: string; pulse: number }> = {
  critical: { dot: "bg-red-400", label: "text-red-400/70", pulse: 0.8 },
  high: { dot: "bg-amber-400", label: "text-amber-400/70", pulse: 1.5 },
  medium: { dot: "bg-blue-400", label: "text-blue-400/70", pulse: 2.5 },
}

/* =================================================================
   AI NUCLEUS
   ================================================================= */
function AINucleus({ isThinking }: { isThinking: boolean }) {
  return (
    <div className="relative mx-auto" style={{ width: 80, height: 80 }}>
      {/* Outermost ambient glow -- slow, deep breathing */}
      <motion.div className="absolute inset-[-30px] rounded-full pointer-events-none"
        animate={{ opacity: isThinking ? [0.15, 0.3, 0.15] : [0.03, 0.1, 0.03], scale: isThinking ? [1, 1.06, 1] : [1, 1.02, 1] }}
        transition={{ duration: isThinking ? 1.5 : 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25), rgba(59,130,246,0.08) 50%, transparent 75%)" }} />

      {/* Secondary glow ring -- offset phase */}
      <motion.div className="absolute inset-[-20px] rounded-full pointer-events-none"
        animate={{ opacity: [0.02, 0.07, 0.02] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.15), transparent 60%)" }} />

      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Outer perception ring -- slow pulse */}
        <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(139,92,246,0.06)" strokeWidth="0.4" strokeDasharray="3 8">
          <animate attributeName="stroke-dashoffset" values="0;40" dur="20s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.03;0.09;0.03" dur="6s" repeatCount="indefinite" />
        </circle>

        {/* Intelligence field rings -- three layers, breathing at different rates */}
        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(139,92,246,0.07)" strokeWidth="0.5">
          <animate attributeName="r" values="30;34;30" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.04;0.1;0.04" dur="5.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="40" r="25" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="0.4">
          <animate attributeName="r" values="23;27;23" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="40" r="18" fill="none" stroke="rgba(6,182,212,0.05)" strokeWidth="0.4">
          <animate attributeName="r" values="16;20;16" dur="3.3s" repeatCount="indefinite" />
        </circle>

        {/* Orbital intelligence particles -- 6 particles on different orbits */}
        {[
          { color: "#8b5cf6", radius: 30, dur: 9, size: 2, dir: 1 },
          { color: "#3b82f6", radius: 24, dur: 12, size: 1.8, dir: 0 },
          { color: "#06b6d4", radius: 18, dur: 7, size: 1.5, dir: 1 },
          { color: "#10b981", radius: 32, dur: 15, size: 1.3, dir: 0 },
          { color: "#ec4899", radius: 14, dur: 6, size: 1.5, dir: 1 },
          { color: "#f59e0b", radius: 27, dur: 10, size: 1.2, dir: 0 },
        ].map((p, i) => (
          <circle key={i} cx="40" cy="40" r={p.size} fill={p.color} opacity="0">
            <animateMotion dur={`${p.dur}s`} repeatCount="indefinite"
              path={`M0,0 A${p.radius},${p.radius} 0 1,${p.dir} 0.1,0`} />
            <animate attributeName="opacity" values="0;0.65;0.4;0.75;0" dur={`${p.dur}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Core glow fill */}
        <circle cx="40" cy="40" r="11" fill="rgba(139,92,246,0.04)" stroke="rgba(139,92,246,0.1)" strokeWidth="0.5">
          <animate attributeName="r" values="10;13;10" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.03;0.08;0.03" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Pulse ring -- radiating outward */}
        <circle cx="40" cy="40" r="11" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="0.7">
          <animate attributeName="r" values="11;28;11" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Connection lines -- faint neural threads from center to edge */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const x2 = 40 + Math.cos(rad) * 30
          const y2 = 40 + Math.sin(rad) * 30
          return (
            <line key={`thread-${i}`} x1="40" y1="40" x2={x2} y2={y2}
              stroke="rgba(139,92,246,0.04)" strokeWidth="0.3">
              <animate attributeName="stroke-opacity" values="0.02;0.07;0.02"
                dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            </line>
          )
        })}
      </svg>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={isThinking
            ? { rotate: 360, scale: [1, 1.15, 1] }
            : { rotate: [0, 6, -6, 0], scale: [1, 1.06, 1, 1.04, 1] }}
          transition={isThinking
            ? { rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }
            : { rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}>
          <Sparkles className="w-[18px] h-[18px] text-purple-300/80" />
        </motion.div>
      </div>
    </div>
  )
}

/* =================================================================
   UNIFIED SIGNAL ENTRY
   Combines a behavioral signal with its mapped conversation mode
   into one clickable entry point.
   ================================================================= */
function SignalEntry({ signal, index, onStartConversation }: {
  signal: BehaviorSignal
  index: number
  onStartConversation: (modeId: string, initialQuestion: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const catStyle = CATEGORY_STYLES[signal.category]
  const impactStyle = IMPACT_STYLES[signal.impact]
  const Icon = signal.icon
  const mode = CONVERSATION_MODES.find(m => m.id === signal.mapsToMode)
  const ModeIcon = mode?.icon || Brain

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.25 }}
      className={`rounded-xl border ${catStyle.border} bg-white/[0.008] overflow-hidden relative group/sig`}
    >
      {/* Subtle breathing border */}
      <motion.div className="absolute inset-0 rounded-xl pointer-events-none" style={{ border: "1px solid transparent" }}
        animate={{ borderColor: [`${catStyle.hex}06`, `${catStyle.hex}14`, `${catStyle.hex}06`] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 1.0 }} />

      {/* Header row -- always visible */}
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-3.5 py-3 relative">
        <div className="flex items-start gap-2.5">
          <div className="relative mt-0.5 shrink-0">
            <motion.div className="absolute inset-[-4px] rounded-full pointer-events-none"
              animate={{ opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
              style={{ backgroundColor: catStyle.hex, filter: "blur(5px)" }} />
            <Icon className="w-4 h-4 relative" style={{ color: `${catStyle.hex}80` }} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Category + Impact row */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-mono font-black uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-md ${catStyle.bg} ${catStyle.text}`}>
                {signal.category}
              </span>
              <div className="flex items-center gap-1">
                <motion.div className={`w-1.5 h-1.5 rounded-full ${impactStyle.dot}`}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: impactStyle.pulse, repeat: Infinity }} />
                <span className={`text-[9px] font-mono font-bold uppercase ${impactStyle.label}`}>{signal.impact}</span>
              </div>
            </div>

            {/* Title */}
            <h4 className="text-[11px] font-black text-white/80 leading-tight">{signal.title}</h4>

            {/* Trigger signal */}
            <div className="flex items-center gap-1.5 mt-1">
              <motion.div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: catStyle.hex }}
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[9px] font-mono text-white/35">{signal.trigger}</span>
            </div>

            {/* The core question -- this is the hook */}
            <p className="text-[10px] text-white/50 leading-relaxed mt-1.5">{signal.question}</p>
          </div>

          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-white/30 shrink-0 mt-1" />
          </motion.div>
        </div>
      </button>

      {/* Expanded detail + conversation launch */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-3.5 pb-3.5 space-y-2.5">
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Why this matters */}
              <div className="px-3 py-2.5 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Brain className="w-3 h-3 text-white/20" />
                  <span className="text-[9px] font-mono font-bold text-white/35 uppercase tracking-[0.1em]">Why this matters</span>
                </div>
                <p className="text-[10px] text-white/45 leading-[1.7]">{signal.reasoning}</p>
              </div>

              {/* Conversation mode it leads to */}
              {mode && (
                <div className="px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${mode.hex}10`, border: `1px solid ${mode.hex}18` }}>
                      <ModeIcon className="w-3 h-3" style={{ color: mode.hex }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-white/50">{mode.label}</span>
                        <span className="text-[9px] font-mono px-1.5 py-px rounded border border-white/[0.04]" style={{ color: `${mode.hex}60` }}>
                          {mode.aiMode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Start conversation button -- leads into guided flow */}
              <motion.button
                onClick={() => onStartConversation(signal.mapsToMode, signal.question)}
                whileTap={{ scale: 0.96 }}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border ${catStyle.border} ${catStyle.bg} hover:bg-opacity-80 transition-all group/ask relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/ask:translate-x-full transition-transform duration-500 pointer-events-none" />
                <Sparkles className="w-3.5 h-3.5 relative" style={{ color: `${catStyle.hex}70` }} />
                <span className={`text-[11px] font-bold relative ${catStyle.text}`}>Explore with AI</span>
                <ArrowRight className="w-3 h-3 relative group-hover/ask:translate-x-1 transition-transform" style={{ color: `${catStyle.hex}50` }} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* =================================================================
   CONVERSATION MODE TILE
   Clean, compact entry for starting a fresh conversation
   ================================================================= */
function ModeTile({ mode, index, onSelect }: {
  mode: ConversationMode; index: number; onSelect: (modeId: string) => void
}) {
  const Icon = mode.icon
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.04, type: "spring", stiffness: 400, damping: 30 }}
      className="w-full rounded-xl border border-white/[0.04] hover:border-white/[0.10] bg-white/[0.008] hover:bg-white/[0.02] transition-all text-left group/mt relative overflow-hidden"
    >
      {/* Background shimmer sweep */}
      <motion.div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
        <motion.div className="absolute inset-0"
          style={{ background: `linear-gradient(115deg, transparent 30%, ${mode.hex}05 50%, transparent 70%)`, backgroundSize: "300% 100%" }}
          animate={{ backgroundPositionX: ["-100%", "200%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: index * 2 }} />
      </motion.div>

      {/* Left accent edge */}
      <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full transition-all duration-400 group-hover/mt:opacity-100 opacity-40"
        style={{ backgroundColor: `${mode.hex}40` }} />

      {/* Main clickable area */}
      <div className="relative">
        <div className="px-3.5 py-3">
          {/* Top row: Icon + Title + AI badge + Expand toggle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative"
              style={{ backgroundColor: `${mode.hex}0c`, border: `1px solid ${mode.hex}18` }}>
              <motion.div className="absolute inset-[-4px] rounded-xl pointer-events-none"
                animate={{ opacity: [0.02, 0.08, 0.02] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                style={{ backgroundColor: mode.hex, filter: "blur(8px)" }} />
              <Icon className="w-[18px] h-[18px] relative" style={{ color: mode.hex }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-black text-white/70 group-hover/mt:text-white/90 transition-colors">{mode.label}</span>
                {/* AI personality badge */}
                <div className="flex items-center gap-1 px-1.5 py-px rounded-md border border-white/[0.05]"
                  style={{ backgroundColor: `${mode.hex}08` }}>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: mode.hex }} />
                  <span className="text-[7.5px] font-mono font-bold" style={{ color: `${mode.hex}80` }}>{mode.aiMode}</span>
                </div>
              </div>
              <p className="text-[10px] text-white/25 leading-snug group-hover/mt:text-white/40 transition-colors mt-0.5 line-clamp-1">{mode.desc}</p>
            </div>

            {/* Expand / Start controls */}
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
              >
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <ChevronDown className="w-3.5 h-3.5 text-white/15 group-hover/mt:text-white/30 transition-colors" />
                </motion.div>
              </motion.button>
              <motion.button
                onClick={() => onSelect(mode.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg transition-all hover:bg-white/[0.06]"
                style={{ color: `${mode.hex}60` }}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expandable detail panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="overflow-hidden"
            >
              <div className="px-3.5 pb-3.5 pt-0">
                {/* Divider */}
                <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, transparent, ${mode.hex}15, transparent)` }} />

                {/* ── Mode-Specific SVG Visualization ── */}
                {(() => {
                  const Viz = getModeVisualization(mode.id)
                  if (Viz) return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="mb-3"
                    >
                      <Viz />
                    </motion.div>
                  )
                  return null
                })()}

                {/* Full description */}
                <p className="text-[10.5px] text-white/35 leading-[1.7] mb-3">{mode.desc}</p>

                {/* Quick starters */}
                <div className="mb-2.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap className="w-3 h-3" style={{ color: `${mode.hex}50` }} />
                    <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-white/20">Quick Starters</span>
                  </div>
                  <div className="space-y-1.5">
                    {mode.starters.map((starter, si) => (
                      <motion.button
                        key={si}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + si * 0.04 }}
                        onClick={() => onSelect(mode.id)}
                        className="w-full flex items-start gap-2 px-2.5 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.025] transition-all group/starter text-left"
                      >
                        <MessageSquare className="w-3 h-3 shrink-0 mt-0.5 text-white/10 group-hover/starter:text-white/25 transition-colors" style={{ color: `${mode.hex}30` }} />
                        <span className="text-[10px] text-white/30 group-hover/starter:text-white/55 transition-colors leading-relaxed">{starter}</span>
                        <ArrowUpRight className="w-3 h-3 shrink-0 mt-0.5 opacity-0 group-hover/starter:opacity-100 transition-all" style={{ color: `${mode.hex}50` }} />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Start session button */}
                <motion.button
                  onClick={() => onSelect(mode.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all"
                  style={{
                    backgroundColor: `${mode.hex}08`,
                    borderColor: `${mode.hex}18`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: `${mode.hex}80` }} />
                  <span className="text-[11px] font-bold" style={{ color: `${mode.hex}90` }}>Start {mode.label} Session</span>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: `${mode.hex}50` }} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* =================================================================
   CONVERSATION HEADER
   ================================================================= */
function ConversationHeader({ thread, onBack, onClose }: {
  thread: ChatThread; onBack: () => void; onClose: () => void
}) {
  const tType = CONVERSATION_MODES.find(t => t.id === thread.typeId)
  if (!tType) return null
  const Icon = tType.icon
  const elapsed = Math.round((Date.now() - thread.createdAt) / 60000)
  const elapsedLabel = elapsed < 1 ? "Just now" : elapsed < 60 ? `${elapsed}m ago` : `${Math.round(elapsed / 60)}h ago`

  return (
    <div className="border-b border-white/[0.04] shrink-0">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <motion.button onClick={onBack} whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:border-purple-500/20 bg-white/[0.02] hover:bg-purple-500/[0.04] transition-all group/back">
          <motion.div animate={{ x: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowLeft className="w-3.5 h-3.5 text-white/30 group-hover/back:text-purple-400/70 transition-colors" />
          </motion.div>
          <span className="text-[10px] font-bold text-white/30 group-hover/back:text-purple-400/70 transition-colors">Home</span>
        </motion.button>

        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${tType.hex}12`, border: `1px solid ${tType.hex}25` }}>
            <Icon className="w-3 h-3" style={{ color: tType.hex }} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-black text-white/80 truncate block">{tType.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono px-1.5 py-px rounded border border-white/[0.04]" style={{ color: `${tType.hex}80` }}>{tType.aiMode}</span>
              <span className="text-[7px] font-mono text-white/15">{thread.messages.length} msgs</span>
              <span className="text-[7px] font-mono text-white/15">{elapsedLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <motion.div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ backgroundColor: `${tType.hex}06`, border: `1px solid ${tType.hex}12` }}>
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tType.hex }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-[8px] font-mono font-bold" style={{ color: `${tType.hex}90` }}>Live</span>
          </motion.div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/[0.04] transition-all">
            <X className="w-3.5 h-3.5 text-white/20 hover:text-white/40" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* =================================================================
   THREAD ONBOARDING -- AI asks intent-clarifying questions first
   ================================================================= */
function ThreadOnboarding({ thread, onSend }: { thread: ChatThread; onSend: (text: string) => void }) {
  const tType = CONVERSATION_MODES.find(t => t.id === thread.typeId)
  if (!tType) return null
  const Icon = tType.icon

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-6">
      <div className="text-center mb-5">
        <div className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center mb-3 relative"
          style={{ backgroundColor: `${tType.hex}08`, border: `1px solid ${tType.hex}15` }}>
          <motion.div className="absolute inset-[-4px] rounded-xl pointer-events-none"
            animate={{ opacity: [0.03, 0.1, 0.03] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundColor: tType.hex, filter: "blur(10px)" }} />
          <Icon className="w-6 h-6 relative" style={{ color: `${tType.hex}` }} />
        </div>
        <h3 className="text-[14px] font-black text-white/85">{tType.label}</h3>
        <p className="text-[11px] text-white/35 mt-1.5 max-w-[260px] mx-auto leading-relaxed">{tType.desc}</p>
      </div>

      <div className="mx-auto max-w-[280px] mb-5 px-4 py-3 rounded-xl border border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-3.5 h-3.5" style={{ color: `${tType.hex}60` }} />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.12em]" style={{ color: `${tType.hex}70` }}>{tType.aiMode} Mode</span>
        </div>
        <p className="text-[10px] text-white/30 leading-relaxed">
          {tType.aiMode === "Analyst" && "I will analyze market data objectively, focusing on structure, levels, and institutional behavior. No opinions -- just what the data shows."}
          {tType.aiMode === "Strategist" && "I will help you build and refine plans, challenge assumptions, and think through scenarios methodically before you commit."}
          {tType.aiMode === "Mirror" && "I will reflect your decisions back to you honestly, helping you see patterns in your behavior and extract learning from every trade."}
          {tType.aiMode === "Coach" && "I will hold you accountable, help you manage emotions, and keep you aligned with your process when discipline gets hard."}
        </p>
      </div>

      <div className="space-y-1.5 mx-auto max-w-[280px]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkle className="w-3 h-3" style={{ color: `${tType.hex}40` }} />
          <span className="text-[9px] font-mono text-white/25 uppercase tracking-[0.12em] font-bold">Choose to begin</span>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>
        {tType.starters.map((starter, i) => (
          <motion.button key={starter} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            onClick={() => onSend(starter)}
            className="w-full text-left px-3.5 py-3 rounded-xl border border-white/[0.04] hover:border-white/[0.10] bg-white/[0.008] hover:bg-white/[0.025] transition-all group/st relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent -translate-x-full group-hover/st:translate-x-full transition-transform duration-700 pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover/st:translate-x-0.5 group-hover/st:-translate-y-0.5 transition-transform" style={{ color: `${tType.hex}40` }} />
              </motion.div>
              <span className="text-[11px] text-white/45 group-hover/st:text-white/80 transition-colors leading-relaxed">{starter}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

/* =================================================================
   FOLLOW-UP SUGGESTIONS
   ================================================================= */
function FollowUpSuggestions({ threadTypeId, onSelect }: {
  threadTypeId: string; onSelect: (prompt: string) => void
}) {
  const suggestions = useMemo(() => {
    const answers: { prompt: string; label: string; desc: string }[] = []
    const tt = CONVERSATION_MODES.find(t => t.id === threadTypeId)

    if (tt) {
      if (tt.id === "coach-mode") {
        answers.push(
          { prompt: "Honestly, I'm struggling to trust my system today. I keep second-guessing entries.", label: "I'm second-guessing myself", desc: "Tell the AI about your confidence" },
          { prompt: "I feel focused and clear. I want to push myself to the next level.", label: "I'm feeling sharp today", desc: "Explore advanced growth areas" },
          { prompt: "I know my rules but I keep breaking them in the moment. I need help understanding why.", label: "I keep breaking rules", desc: "Uncover the root cause" },
          { prompt: "I had a great day yesterday but I'm scared I'll give it back today.", label: "Afraid of giving back gains", desc: "Work through outcome anxiety" }
        )
      } else if (tt.id === "scenario-lab") {
        answers.push(
          { prompt: "I see a breakout forming but I'm not sure if it's a trap. Walk me through both scenarios.", label: "Breakout or trap?", desc: "Map out both outcomes" },
          { prompt: "My bias says long but the data says short. Help me reconcile this.", label: "Conflicting bias", desc: "Work through conflicting signals" },
          { prompt: "What happens to my open positions if we get a major reversal here?", label: "Stress test my book", desc: "Run worst-case scenarios" }
        )
      } else if (tt.id === "journal-reflect") {
        answers.push(
          { prompt: "I took 3 trades today. 2 winners, 1 loser. But the loser was a revenge trade after the first win.", label: "Mixed day with a revenge trade", desc: "Break down the emotional chain" },
          { prompt: "I followed my plan perfectly today but still lost money. It's frustrating.", label: "Good process, bad outcome", desc: "Separate process from results" },
          { prompt: "I skipped trading today because I didn't feel right. Was that the right call?", label: "I sat out today", desc: "Evaluate your self-awareness" }
        )
      } else if (tt.id === "market-thinking") {
        answers.push(
          { prompt: "The market structure shifted and I'm unsure if my thesis is still valid.", label: "My thesis feels broken", desc: "Re-evaluate your directional bias" },
          { prompt: "I see the levels but I don't know which one matters most right now.", label: "Too many levels", desc: "Prioritize what matters" },
          { prompt: "I think the market is ranging but I keep trying to trade it like it's trending.", label: "Wrong market read", desc: "Align strategy to conditions" }
        )
      } else if (tt.id === "post-trade") {
        answers.push(
          { prompt: "I exited too early and left 2R on the table. I do this a lot.", label: "I always exit too early", desc: "Explore your fear of giving back" },
          { prompt: "I held through my stop and it worked out -- but I know that's bad discipline.", label: "I moved my stop", desc: "Confront stop-moving habit" },
          { prompt: "The trade went exactly as planned. Help me understand what I did right so I can repeat it.", label: "Perfect execution", desc: "Reinforce winning patterns" }
        )
      } else if (tt.id === "pre-market") {
        answers.push(
          { prompt: "I slept poorly and I'm not sure I should trade today. Help me decide.", label: "I'm tired today", desc: "Assess if you're fit to trade" },
          { prompt: "I have a strong bias today and I want to make sure I'm not forcing it.", label: "Strong bias -- am I forcing?", desc: "Check for confirmation bias" },
          { prompt: "Yesterday was rough. I need help approaching today with a clean slate.", label: "Coming off a bad day", desc: "Reset and start fresh" }
        )
      } else if (tt.id === "strategy-refine") {
        answers.push(
          { prompt: "My system works over 50 trades but I can't handle the 4-loss streaks emotionally.", label: "I can't handle drawdowns", desc: "Bridge the emotional-statistical gap" },
          { prompt: "I want to add a new setup type but I'm worried about diluting my edge.", label: "Thinking of adding setups", desc: "Evaluate expansion vs focus" },
          { prompt: "My win rate is fine but my reward-to-risk is terrible. I keep cutting winners.", label: "Poor R:R ratio", desc: "Fix the cut-winners habit" }
        )
      } else if (tt.id === "reset") {
        answers.push(
          { prompt: "I just had a bad trade and I can feel the anger building. Help me cool down before I do something stupid.", label: "I'm angry right now", desc: "Immediate emotional reset" },
          { prompt: "I've been staring at charts for 4 hours and I'm not thinking clearly anymore.", label: "Brain fog from screen time", desc: "Break the fatigue cycle" },
          { prompt: "I'm obsessing over P&L instead of process. Help me refocus.", label: "Stuck on P&L", desc: "Shift back to process focus" }
        )
      }
    }

    return answers.slice(0, 4)
  }, [threadTypeId])

  if (suggestions.length === 0) return null
  const tType = CONVERSATION_MODES.find(t => t.id === threadTypeId)
  const hex = tType?.hex || "#8b5cf6"

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.25 }}
      className="mt-3 space-y-1.5 px-1">
      <div className="flex items-center gap-2 mb-1.5">
        <MessageSquare className="w-3 h-3" style={{ color: `${hex}40` }} />
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.12em] font-bold">Your response</span>
        <div className="flex-1 h-px bg-white/[0.04]" />
        <span className="text-[7px] font-mono text-white/10">choose or type your own</span>
      </div>
      {suggestions.map((s, i) => (
        <motion.button key={s.prompt} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 + i * 0.06 }}
          onClick={() => onSelect(s.prompt)}
          className="w-full text-left px-3.5 py-3 rounded-xl border border-white/[0.04] hover:border-white/[0.10] bg-white/[0.008] hover:bg-white/[0.025] transition-all group/fu relative overflow-hidden">
          <motion.div className="absolute inset-0 rounded-xl pointer-events-none" style={{ border: "1px solid transparent" }}
            animate={{ borderColor: [`${hex}00`, `${hex}10`, `${hex}00`] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent -translate-x-full group-hover/fu:translate-x-full transition-transform duration-500 pointer-events-none" />
          <div className="flex items-start gap-3 relative">
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${hex}10`, border: `1px solid ${hex}15` }}>
              <MessageSquare className="w-2.5 h-2.5" style={{ color: `${hex}60` }} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-white/60 group-hover/fu:text-white/85 transition-colors block leading-snug">{s.label}</span>
              <span className="text-[9px] text-white/20 group-hover/fu:text-white/35 transition-colors block mt-0.5 leading-relaxed">{s.desc}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover/fu:opacity-40 transition-all relative mt-0.5" style={{ color: hex }} />
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}

/* =================================================================
   INPUT MODE SELECTOR
   ================================================================= */
function InputModeSelector({ mode, onChange }: { mode: string; onChange: (m: string) => void }) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null)
  const modes = [
    { id: "quick", label: "Quick", icon: Zap, desc: "Brief, focused answers. Best for yes/no questions and quick checks." },
    { id: "deep", label: "Deep", icon: Layers, desc: "Thorough analysis with data, context, and detailed reasoning." },
    { id: "guided", label: "Guided", icon: Compass, desc: "Step-by-step walkthroughs with follow-up questions to guide you." },
  ]
  return (
    <div className="relative">
      <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.04] bg-white/[0.01] p-0.5">
        {modes.map(m => {
          const MIcon = m.icon; const isActive = mode === m.id
          return (
            <button key={m.id} onClick={() => onChange(m.id)}
              onMouseEnter={() => setHoveredMode(m.id)} onMouseLeave={() => setHoveredMode(null)}
              className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all"
              style={{ backgroundColor: isActive ? "rgba(139,92,246,0.08)" : "transparent" }}>
              {isActive && <motion.div layoutId="inputMode" className="absolute inset-0 rounded-md border border-purple-500/20" />}
              <MIcon className="w-3 h-3 relative" style={{ color: isActive ? "#8b5cf6" : "rgba(255,255,255,0.2)" }} />
              <span className="text-[9px] font-bold relative" style={{ color: isActive ? "#a78bfa" : "rgba(255,255,255,0.2)" }}>{m.label}</span>
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {hoveredMode && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-0 right-0 mb-1.5 px-3 py-2 rounded-lg border border-white/[0.06] bg-[#0e0e14] shadow-xl z-20">
            <p className="text-[9px] text-white/40 leading-relaxed">{modes.find(m => m.id === hoveredMode)?.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* =================================================================
   THREAD SELECTOR (tabs)
   ================================================================= */
function ThreadSelector({ threads, activeId, onSelect, onNew }: {
  threads: ChatThread[]; activeId: string; onSelect: (id: string) => void; onNew: () => void
}) {
  const [showNewMenu, setShowNewMenu] = useState(false)
  return (
    <div className="border-b border-white/[0.04] px-3 py-2 shrink-0">
      <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {threads.map(t => {
          const tType = CONVERSATION_MODES.find(tt => tt.id === t.typeId)
          if (!tType) return null
          const TTIcon = tType.icon
          const isActive = t.id === activeId
          return (
            <button key={t.id} onClick={() => onSelect(t.id)}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all relative ${
                isActive ? "border-white/[0.08] bg-white/[0.03]" : "border-transparent hover:border-white/[0.04] hover:bg-white/[0.01]"}`}>
              {isActive && (
                <motion.div className="absolute bottom-0 left-2 right-2 h-px" layoutId="activeThread"
                  style={{ background: `linear-gradient(90deg, transparent, ${tType.hex}, transparent)` }} />
              )}
              <TTIcon className="w-3 h-3" style={{ color: isActive ? tType.hex : `${tType.hex}40` }} />
              <span className="text-[9px] font-bold" style={{ color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }}>{tType.label}</span>
              <span className="text-[7px] font-mono text-white/10">{t.messages.length}</span>
            </button>
          )
        })}
        <div className="relative">
          <button onClick={() => setShowNewMenu(!showNewMenu)}
            className="shrink-0 p-1.5 rounded-lg border border-dashed border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all">
            <Plus className="w-3 h-3 text-white/15 hover:text-white/30" />
          </button>
          <AnimatePresence>
            {showNewMenu && (
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-white/[0.06] bg-[#0c0c10] shadow-2xl z-30 py-1 overflow-hidden">
                {CONVERSATION_MODES.map((tt) => {
                  const TTIcon = tt.icon
                  return (
                    <button key={tt.id} onClick={() => { onNew(); setShowNewMenu(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.03] transition-all text-left">
                      <TTIcon className="w-3.5 h-3.5" style={{ color: `${tt.hex}60` }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-white/50 block">{tt.label}</span>
                        <span className="text-[7px] font-mono text-white/15 truncate block">{tt.aiMode}</span>
                      </div>
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* =================================================================
   MSG TYPE BADGE
   ================================================================= */
function msgTypeBadge(type?: string) {
  if (!type) return null
  const map: Record<string, { icon: typeof Target; label: string; color: string; border: string }> = {
    warning: { icon: AlertTriangle, label: "Warning", color: "text-amber-400/80", border: "border-amber-500/[0.08]" },
    insight: { icon: Lightbulb, label: "Insight", color: "text-blue-400/80", border: "border-blue-500/[0.08]" },
    analysis: { icon: Activity, label: "Analysis", color: "text-purple-400/80", border: "border-purple-500/[0.08]" },
    coaching: { icon: Award, label: "Coaching", color: "text-rose-400/80", border: "border-rose-500/[0.08]" },
  }
  return map[type] || null
}

/* =================================================================
   AMBIENT PARTICLES
   ================================================================= */
function AmbientParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: 1 + Math.random() * 1.5, dur: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      color: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#ec4899"][i % 5]
    })), [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: p.color }}
          animate={{ y: [0, -30, 10, -20, 0], x: [0, 15, -10, 8, 0], opacity: [0, 0.4, 0.2, 0.5, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
      ))}
    </div>
  )
}

/* =================================================================
   MAIN COPILOT AI VIEW
   ================================================================= */
export function CopilotAIView({ onSendMessage }: { onSendMessage?: (msg: string) => void }) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState("guided")
  const [homeSection, setHomeSection] = useState<"signals" | "modes">("signals")
  const [showAllModes, setShowAllModes] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [inputBarExpanded, setInputBarExpanded] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeThread = threads.find(t => t.id === activeThreadId) || null
  const criticalCount = BEHAVIOR_SIGNALS.filter(s => s.impact === "critical").length

  const createThread = useCallback((typeId: string, initialMessage?: string) => {
    const newThread: ChatThread = {
      id: `thread-${Date.now()}`, typeId, messages: [], createdAt: Date.now(),
      lastActive: Date.now(), title: CONVERSATION_MODES.find(t => t.id === typeId)?.label || "Chat",
    }

    if (initialMessage) {
      const userMsg: Message = { id: `msg-${Date.now()}`, role: "user", content: initialMessage, timestamp: Date.now() }
      newThread.messages.push(userMsg)
    }

    setThreads(prev => [...prev, newThread])
    setActiveThreadId(newThread.id)

    if (initialMessage) {
      setIsLoading(true)
      setTimeout(() => {
        const aiMsg: Message = {
          id: `msg-${Date.now() + 1}`, role: "assistant",
          content: generateResponse(initialMessage, typeId),
          timestamp: Date.now(), type: getResponseType(initialMessage)
        }
        setThreads(prev => prev.map(t => t.id === newThread.id ? { ...t, messages: [...t.messages, aiMsg], lastActive: Date.now() } : t))
        setIsLoading(false)
      }, 1200 + Math.random() * 800)
    }
  }, [])

  const handleSend = useCallback((text?: string) => {
    const msg = text || input.trim()
    if (!msg) return

    if (!activeThread) {
      createThread("market-thinking", msg)
      setInput("")
      return
    }

    const userMsg: Message = { id: `msg-${Date.now()}`, role: "user", content: msg, timestamp: Date.now() }
    setThreads(prev => prev.map(t => t.id === activeThread.id ? { ...t, messages: [...t.messages, userMsg], lastActive: Date.now() } : t))
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`, role: "assistant",
        content: generateResponse(msg, activeThread.typeId),
        timestamp: Date.now(), type: getResponseType(msg)
      }
      setThreads(prev => prev.map(t => t.id === activeThread.id ? { ...t, messages: [...t.messages, aiMsg], lastActive: Date.now() } : t))
      setIsLoading(false)
    }, 1200 + Math.random() * 800)

    onSendMessage?.(msg)
  }, [input, activeThread, onSendMessage, createThread])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }, [handleSend])

  const handleBackToHome = useCallback(() => { setActiveThreadId(null) }, [])
  const handleCloseThread = useCallback(() => {
    if (activeThread) {
      setThreads(prev => prev.filter(t => t.id !== activeThread.id))
      setActiveThreadId(null)
    }
  }, [activeThread])

  const handleCopy = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content); setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  useEffect(() => {
    if (scrollRef.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight }
  }, [activeThread?.messages.length, isLoading])

  const visibleModes = showAllModes ? CONVERSATION_MODES : CONVERSATION_MODES.slice(0, 4)

  return (
    <div className="flex flex-col h-full bg-[#0a0a0e] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139,92,246,0.04) 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }} />
        <motion.div className="absolute inset-0"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(139,92,246,0.06) 0%, transparent 60%)" }} />
        <motion.div className="absolute inset-0"
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ background: "radial-gradient(ellipse at 30% 70%, rgba(59,130,246,0.04) 0%, transparent 50%)" }} />
        <AmbientParticles />
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.15) transparent" }}>
        {/* Thread selector tabs */}
        {threads.length > 0 && activeThread && (
          <ThreadSelector threads={threads} activeId={activeThread.id}
            onSelect={setActiveThreadId} onNew={() => createThread("market-thinking")} />
        )}

        <AnimatePresence mode="wait">
          {!activeThread ? (
            /* ====== HOME VIEW -- INTELLIGENCE GATEWAY ====== */
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>

              <IntelligenceGateway homeSection={homeSection} setHomeSection={setHomeSection} />

              <IntelligenceBoard homeSection={homeSection} setHomeSection={setHomeSection} criticalCount={criticalCount} />

              {/* ══════════════════════════════════════════════════════
                  CONTENT LAYER
                  Each path has: explanation block -> section header -> content
                  ══════════════════════════════════════════════════════ */}
              <AnimatePresence mode="wait">
                {homeSection === "signals" ? (
                  /* ═══ BEHAVIORAL SCAN ═══ */
                  <motion.div key="signals" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                    className="px-3 pt-2 pb-4">

                    {/* Section header */}
                    <div className="flex items-center gap-2 px-1 mb-3">
                      <motion.div className="relative" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}>
                        <motion.div className="absolute inset-[-2px] rounded-full bg-amber-400/20 pointer-events-none"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.08, 0.25, 0.08] }}
                          transition={{ duration: 2, repeat: Infinity }} />
                        <Activity className="w-3.5 h-3.5 text-amber-400/70 relative" />
                      </motion.div>
                      <span className="text-[10px] font-bold text-amber-300/55 uppercase tracking-[0.12em]">
                        Active Patterns
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-amber-400/10 to-transparent" />
                      <span className="text-[9px] font-mono text-white/25">{BEHAVIOR_SIGNALS.length} detected</span>
                    </div>

                    {/* Signal feed */}
                    <div className="space-y-2">
                      {BEHAVIOR_SIGNALS.map((signal, i) => (
                        <SignalEntry
                          key={signal.id}
                          signal={signal}
                          index={i}
                          onStartConversation={(modeId, question) => createThread(modeId, question)}
                        />
                      ))}
                    </div>

                    {/* Bottom explainer */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      className="mt-3 px-3 py-2.5 rounded-lg border border-white/[0.03] bg-white/[0.01]">
                      <div className="flex items-start gap-2.5">
                        <Lightbulb className="w-3.5 h-3.5 text-white/15 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-white/30 leading-relaxed">
                          Signals are generated from session data, entry patterns, and emotional indicators. They update as your behavior changes. Each one leads to a focused AI conversation, not a generic response.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  /* ═══ START SESSION -- Advanced Intelligence Modes ═══ */
                  <motion.div key="modes" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                    className="px-3 pt-3 pb-4">

                    {/* Section header with intelligence context */}
                    <div className="px-1 mb-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="relative">
                          <Sparkle className="w-3.5 h-3.5 text-purple-400/60 relative" />
                          <motion.div className="absolute inset-[-2px] rounded-full pointer-events-none"
                            animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.15, 0.05] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            style={{ backgroundColor: "#8b5cf6", filter: "blur(4px)" }} />
                        </div>
                        <span className="text-[10px] font-bold text-purple-300/65 uppercase tracking-[0.12em]">
                          Intelligence Modes
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-400/10 to-transparent" />
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.04]">
                          <motion.div className="w-1 h-1 rounded-full bg-purple-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                          <span className="text-[8px] font-mono text-white/25">{CONVERSATION_MODES.length} available</span>
                        </div>
                      </div>
                      <p className="text-[9.5px] text-white/20 leading-relaxed pl-[22px]">
                        Each mode shapes how the AI thinks about your problem. Expand any card to see quick starters.
                      </p>
                    </div>

                    {/* Mode tiles */}
                    <div className="space-y-2">
                      {visibleModes.map((mode, i) => (
                        <ModeTile key={mode.id} mode={mode} index={i} onSelect={(modeId) => createThread(modeId)} />
                      ))}
                    </div>
                    {!showAllModes && CONVERSATION_MODES.length > 4 && (
                      <motion.button
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        onClick={() => setShowAllModes(true)}
                        className="w-full mt-3 flex items-center justify-center gap-2.5 py-3 rounded-xl border border-dashed border-purple-400/[0.08] hover:border-purple-400/20 hover:bg-purple-500/[0.02] transition-all group/more relative overflow-hidden"
                      >
                        {/* Shimmer on hover */}
                        <motion.div className="absolute inset-0 pointer-events-none"
                          style={{ background: "linear-gradient(115deg, transparent 30%, rgba(139,92,246,0.03) 50%, transparent 70%)", backgroundSize: "300% 100%" }}
                          animate={{ backgroundPositionX: ["-100%", "200%"] }}
                          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
                        <Plus className="w-3.5 h-3.5 text-purple-400/25 group-hover/more:text-purple-400/50 transition-colors relative" />
                        <span className="text-[10px] font-bold text-purple-400/30 group-hover/more:text-purple-400/60 transition-colors relative">
                          Unlock {CONVERSATION_MODES.length - 4} more intelligence modes
                        </span>
                        <ChevronDown className="w-3 h-3 text-purple-400/15 group-hover/more:text-purple-400/35 transition-colors relative" />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ====== CONVERSATION VIEW ====== */
            <motion.div key={`thread-${activeThread.id}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <ConversationHeader thread={activeThread} onBack={handleBackToHome} onClose={handleCloseThread} />

              {activeThread.messages.length === 0 ? (
                <ThreadOnboarding thread={activeThread} onSend={handleSend} />
              ) : (
                <div className="px-3 py-3 space-y-3">
                  {activeThread.messages.map((msg, msgIdx) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                      {msg.role === "user" ? (
                        <div className="flex justify-end">
                          <div className="max-w-[88%] px-3.5 py-2.5 rounded-xl bg-purple-500/[0.08] border border-purple-500/[0.12]">
                            <p className="text-[12px] text-white/85 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <div className="text-[8px] text-white/15 mt-1.5 text-right tabular-nums font-mono">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-start">
                          <div className={`max-w-[95%] px-3.5 py-3 rounded-xl border relative group/msg ${
                            msg.type === "warning" ? "bg-amber-500/[0.03] border-amber-500/[0.10]"
                              : msg.type === "insight" ? "bg-blue-500/[0.03] border-blue-500/[0.10]"
                              : msg.type === "analysis" ? "bg-purple-500/[0.03] border-purple-500/[0.10]"
                              : msg.type === "coaching" ? "bg-rose-500/[0.03] border-rose-500/[0.10]"
                              : "bg-white/[0.015] border-white/[0.05]"
                          }`}>
                            {(() => {
                              const badge = msgTypeBadge(msg.type)
                              if (!badge) return null
                              const BadgeIcon = badge.icon
                              return (
                                <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${badge.border}`}>
                                  <BadgeIcon className={`w-3.5 h-3.5 ${badge.color}`} />
                                  <span className={`text-[9px] font-black uppercase tracking-[0.12em] font-mono ${badge.color}`}>{badge.label}</span>
                                </div>
                              )
                            })()}
                            <div className="text-[12px] text-white/75 leading-[1.65] whitespace-pre-wrap">{msg.content}</div>
                            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.03]">
                              <span className="text-[8px] text-white/12 tabular-nums font-mono">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <button onClick={() => handleCopy(msg.id, msg.content)} className="opacity-0 group-hover/msg:opacity-100 p-1.5 rounded-md hover:bg-white/[0.04] transition-all">
                                {copied === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/20 hover:text-white/40" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {msg.role === "assistant" && msgIdx === activeThread.messages.length - 1 && !isLoading && (
                        <FollowUpSuggestions threadTypeId={activeThread.typeId} onSelect={(p) => handleSend(p)} />
                      )}
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="px-4 py-3.5 rounded-xl bg-white/[0.015] border border-white/[0.05]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-6 h-6">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="2" />
                              <motion.circle cx="12" cy="12" r="9" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="2"
                                strokeLinecap="round" strokeDasharray={2 * Math.PI * 9} strokeDashoffset={2 * Math.PI * 9 * 0.75}
                                animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                style={{ transformOrigin: "12px 12px" }} />
                              <circle cx="12" cy="12" r="3.5" fill="rgba(139,92,246,0.15)">
                                <animate attributeName="r" values="2.5;4.5;2.5" dur="1.5s" repeatCount="indefinite" />
                              </circle>
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              {[0, 150, 300].map(d => (
                                <motion.div key={d} className="w-1 h-1 bg-purple-400/40 rounded-full"
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 1, 0.2] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay: d / 1000 }} />
                              ))}
                            </div>
                            <span className="text-[9px] font-mono text-white/15 mt-1 block">Analyzing...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ====== INPUT BAR ====== */}
      {/* When on home view (no active thread), tuck it into a slim strip that expands on hover/focus.
          When inside a thread, show the full input bar permanently. */}
      {activeThread ? (
        /* ── FULL INPUT BAR (in-thread) ── */
        <div className="flex-shrink-0 border-t border-white/[0.04] px-3 pt-2.5 pb-2 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <InputModeSelector mode={inputMode} onChange={setInputMode} />
            {(() => {
              const tType = CONVERSATION_MODES.find(t => t.id === activeThread.typeId)
              if (!tType) return null
              const TIcon = tType.icon
              return (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ backgroundColor: `${tType.hex}06`, border: `1px solid ${tType.hex}12` }}>
                  <TIcon className="w-3 h-3" style={{ color: `${tType.hex}60` }} />
                  <span className="text-[8px] font-mono font-bold" style={{ color: `${tType.hex}60` }}>{tType.label}</span>
                </div>
              )
            })()}
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress}
                placeholder={`Continue ${CONVERSATION_MODES.find(t => t.id === activeThread.typeId)?.label || "conversation"}...`}
                className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-purple-500/25 rounded-xl px-3.5 py-2.5 pr-9 text-[12px] text-white/85 placeholder:text-white/15 focus:outline-none resize-none transition-all font-sans focus:bg-white/[0.03]"
                rows={1} style={{ minHeight: "38px", maxHeight: "80px" }} />
              <button className="absolute right-2.5 bottom-2 p-1 rounded-md hover:bg-white/[0.04] transition-all">
                <Paperclip className="w-3.5 h-3.5 text-white/12 hover:text-white/25 transition-colors" />
              </button>
            </div>
            <motion.button onClick={() => handleSend()} disabled={!input.trim() || isLoading} whileTap={{ scale: 0.92 }}
              className={`h-[38px] w-[38px] flex items-center justify-center rounded-xl border transition-all duration-200 ${
                input.trim() ? "bg-purple-500/15 border-purple-500/25 hover:bg-purple-500/25 hover:border-purple-500/35" : "bg-white/[0.015] border-white/[0.05] opacity-25 cursor-not-allowed"
              }`}>
              <Send className={`w-3.5 h-3.5 ${input.trim() ? "text-purple-400" : "text-white/20"}`} />
            </motion.button>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/[0.02] transition-all group/voice">
                <Mic className="w-3 h-3 text-white/10 group-hover/voice:text-white/25 transition-colors" />
                <span className="text-[8px] font-mono text-white/10 group-hover/voice:text-white/20 transition-colors font-bold">Voice</span>
              </button>
            </div>
            <span className="text-[8px] font-mono text-white/10 font-bold">
              {threads.length} thread{threads.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      ) : (
        /* ── TUCKED INPUT BAR (home view) ── */
        <div
          className="flex-shrink-0 relative z-10"
          onMouseEnter={() => setInputBarExpanded(true)}
          onMouseLeave={() => { if (!input.trim()) setInputBarExpanded(false) }}
        >
          <AnimatePresence mode="wait">
            {inputBarExpanded ? (
              <motion.div
                key="input-expanded"
                initial={{ height: 34, opacity: 0.8 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 34, opacity: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className="border-t border-white/[0.04] px-3 pt-2.5 pb-2 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <InputModeSelector mode={inputMode} onChange={setInputMode} />
                  <span className="text-[8px] font-mono text-white/10 font-bold">8 modes</span>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress}
                      onFocus={() => setInputBarExpanded(true)}
                      placeholder="Ask anything about your trading..."
                      className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-purple-500/25 rounded-xl px-3.5 py-2.5 pr-9 text-[12px] text-white/85 placeholder:text-white/15 focus:outline-none resize-none transition-all font-sans focus:bg-white/[0.03]"
                      rows={1} style={{ minHeight: "38px", maxHeight: "80px" }} />
                    <button className="absolute right-2.5 bottom-2 p-1 rounded-md hover:bg-white/[0.04] transition-all">
                      <Paperclip className="w-3.5 h-3.5 text-white/12 hover:text-white/25 transition-colors" />
                    </button>
                  </div>
                  <motion.button onClick={() => handleSend()} disabled={!input.trim() || isLoading} whileTap={{ scale: 0.92 }}
                    className={`h-[38px] w-[38px] flex items-center justify-center rounded-xl border transition-all duration-200 ${
                      input.trim() ? "bg-purple-500/15 border-purple-500/25 hover:bg-purple-500/25 hover:border-purple-500/35" : "bg-white/[0.015] border-white/[0.05] opacity-25 cursor-not-allowed"
                    }`}>
                    <Send className={`w-3.5 h-3.5 ${input.trim() ? "text-purple-400" : "text-white/20"}`} />
                  </motion.button>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/[0.02] transition-all group/voice">
                    <Mic className="w-3 h-3 text-white/10 group-hover/voice:text-white/25 transition-colors" />
                    <span className="text-[8px] font-mono text-white/10 group-hover/voice:text-white/20 transition-colors font-bold">Voice</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="input-tucked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="border-t border-white/[0.04] px-3 py-2 cursor-pointer"
                onClick={() => { setInputBarExpanded(true); setTimeout(() => inputRef.current?.focus(), 100) }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-purple-500/[0.06] border border-purple-500/[0.08]">
                    <Send className="w-3 h-3 text-purple-400/30" />
                  </div>
                  <span className="text-[11px] text-white/20 flex-1 font-sans">Ask anything about your trading...</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.04]">
                    <Mic className="w-2.5 h-2.5 text-white/10" />
                    <span className="text-[7px] font-mono text-white/10 font-bold">Voice</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

/* =================================================================
   HELPERS
   ================================================================= */
function generateResponse(msg: string, threadType: string): string {
  const lower = msg.toLowerCase()

  if (lower.includes("revenge") || lower.includes("loss") || lower.includes("tilt")) {
    return "I can see the emotional weight here. Let's pause and look at this objectively.\n\nYour last trade was a controlled loss within your risk parameters -- that's actually a sign of discipline, not failure. The urge to re-enter immediately is your brain's loss-aversion circuit activating.\n\nBefore your next entry, let's run through your checklist:\n1. Does the setup meet your minimum confluence score?\n2. Is this within your session's optimal window?\n3. Are you sizing according to your rules, not your emotions?\n\nTake a breath. The market will be here tomorrow.\n\n**Let me ask you this:** When you feel the pull to re-enter after a loss, what's the story you're telling yourself? Is it \"I need to make it back\" or \"the setup is genuinely there\"? Be honest with me -- recognizing which voice is talking is half the battle."
  }

  if (lower.includes("setup") || lower.includes("entry") || lower.includes("confluence")) {
    return "Let me break down the current setup quality:\n\n**Confluence Score: 4/5**\n- Higher TF alignment: Confirmed (bullish on 4H)\n- Key level reaction: Price at daily demand zone\n- Session timing: Within London killzone\n- Volume profile: Above average participation\n\n**Missing factor:** No clear displacement candle yet. Consider waiting for a break of structure on the 15M before entering.\n\nYour historical win rate improves by 18% when you wait for all 5 confluence factors.\n\n**Here's what I want to understand from you:** How do you typically handle the tension between waiting for confirmation and the fear of missing the move? Do you usually enter early, or can you sit on your hands when the 5th factor isn't there?"
  }

  if (lower.includes("risk") || lower.includes("exposure") || lower.includes("position")) {
    return "**Current Risk Assessment:**\n\nPortfolio heat is at 1.8% -- approaching your 2% threshold. Here's the breakdown:\n\n- EURUSD Long: 0.8% risk | Running +1.2R\n- USDJPY Short: 1.0% risk | At entry\n\n**Correlation alert:** These positions have a -0.3 correlation, which provides some natural hedging. However, if USD strengthens broadly, both could move against you.\n\n**Recommendation:** Move EURUSD stop to breakeven (+1.2R buffer) before adding new exposure.\n\n**I need to understand something:** When you see you're at 1.8% portfolio heat, does that make you want to scale down or does it feel comfortable? Your answer tells me a lot about whether your risk tolerance matches your risk rules -- sometimes they drift apart without us noticing."
  }

  if (lower.includes("discipline") || lower.includes("rule") || lower.includes("plan") || lower.includes("follow") || lower.includes("checklist") || lower.includes("skipping")) {
    return "Looking at your rule adherence data this week:\n\n**Discipline Score: 74%**\n- Pre-session planning: 5/5 days completed\n- Entry criteria followed: 6/8 trades (2 deviated)\n- Stop placement per rules: 7/8 trades\n- Session boundary respected: 3/5 days\n\nThe two deviations on entries happened during the NY overlap -- high volatility, lots of movement, maximum temptation.\n\n**Something I want to explore with you:** On the trades where you deviated from your rules, can you walk me through what was happening in your mind at that exact moment? Was it excitement, fear of missing out, or something else? The emotion that triggers the deviation is the real thing we need to address."
  }

  if (lower.includes("journal") || lower.includes("review") || lower.includes("log") || lower.includes("reflect") || lower.includes("pattern")) {
    return "I've pulled up your journal patterns from the past 2 weeks:\n\n**Entries logged:** 14 trades\n**Average quality score:** 7.2/10\n**Best day:** Wednesday -- you noted feeling calm and prepared\n**Worst day:** Friday -- you mentioned rushing before weekend\n\n**Pattern I've noticed:** Your highest quality trades happen when you write your pre-trade thesis BEFORE entering. When you skip the thesis, your hit rate drops from 68% to 41%.\n\n**Tell me about this:** On the days you skip journaling your thesis, what's different about your morning routine? Are you sleeping well, or starting the session already behind? I'm trying to understand the behavioral chain that leads to those skipped steps."
  }

  if (lower.includes("fomo") || lower.includes("miss") || lower.includes("chas")) {
    return "FOMO is one of the most dangerous emotions in trading because it disguises itself as opportunity.\n\n**Your FOMO pattern from data:**\n- Trades taken after initial move: 5 this month\n- Win rate on FOMO entries: 28% (vs your normal 62%)\n- Average loss on FOMO entries: -1.4R (vs normal -0.8R)\n\nThe numbers don't lie. Every time you chase, you're trading a different system with a negative edge.\n\n**I need you to answer this honestly:** When you see a move happening without you, what's the physical sensation? Chest tightening? Restlessness? Learning to recognize that physical signal is your early warning system. Describe it to me so we can build your interception protocol."
  }

  if (lower.includes("emotion") || lower.includes("feeling") || lower.includes("psych") || lower.includes("mental") || lower.includes("mind") || lower.includes("headspace")) {
    return "**Current Psychological Profile Assessment:**\n\nBased on your recent trading behavior and journal entries:\n\n- **Emotional baseline:** Slightly elevated arousal (common mid-week)\n- **Decision quality:** Strong in morning, declines after 3+ hours of screen time\n- **Bias detection:** You're showing slight confirmation bias on long setups\n- **Recovery speed:** After a loss, you're back to baseline within 12 minutes (healthy)\n\n**What I want to dig into:** How aware are you of your mental state BEFORE you open the charts? Do you have a way to check in with yourself, or do you go straight from waking up to analyzing? The 5 minutes before you start trading might be the most important 5 minutes of your session."
  }

  if (lower.includes("strategy") || lower.includes("edge") || lower.includes("system") || lower.includes("approach") || lower.includes("leak")) {
    return "**Edge Analysis from your last 50 trades:**\n\n- Expectancy: +0.34R per trade (positive -- your system works)\n- Profit Factor: 1.78\n- Sharpe Ratio: 1.42\n- Max consecutive losses: 4\n- Recovery time from max drawdown: 8 trades\n\nYour edge is real and statistically significant. The problem isn't your system -- it's the 15% of trades where you deviate from it.\n\n**Let me challenge you on something:** If someone handed you this data about another trader's system, would you trust it? Would you tell them to keep executing? So why is it harder to trust when it's YOUR system? What's the gap between knowing your edge intellectually and trusting it emotionally?"
  }

  if (lower.includes("calm") || lower.includes("breath") || lower.includes("reset") || lower.includes("angry") || lower.includes("cool down")) {
    return "I hear you. Let's slow everything down right now.\n\n**Step 1: Physical reset**\nClose your eyes. Take 4 deep breaths -- 4 seconds in, hold for 4, out for 6. Do this now before reading further.\n\n**Step 2: Distance from the screen**\nStand up. Walk away from your desk for 60 seconds. The charts will still be there.\n\n**Step 3: Reframe**\nThe trade is done. It's data now -- not a personal attack. Your job is to learn from the data, not relive the emotion.\n\n**When you're ready, tell me:** What triggered this moment? Was it the size of the loss, the way the trade played out, or something about the pattern that hit a nerve? Understanding the trigger is how we build your personal circuit breaker."
  }

  return "Based on your question, here's my analysis:\n\nLooking at your recent trading data and the current market context, there are several factors to consider. Your execution quality has been consistent this week, with a 82% timing accuracy on entries.\n\nYour process metrics are trending positive -- focus on maintaining that consistency rather than chasing outcomes.\n\n**Here's what I'd like you to reflect on:** What does a \"good trading day\" look like to you -- is it about P&L, or is it about following your process perfectly? Your answer reveals whether you're measuring the right things. Take a moment and tell me what matters most to you right now in your development as a trader."
}

function getResponseType(msg: string): Message["type"] {
  const lower = msg.toLowerCase()
  if (lower.includes("revenge") || lower.includes("tilt") || lower.includes("loss") || lower.includes("fomo") || lower.includes("angry") || lower.includes("calm")) return "warning"
  if (lower.includes("pattern") || lower.includes("insight") || lower.includes("learn") || lower.includes("journal") || lower.includes("review")) return "insight"
  if (lower.includes("setup") || lower.includes("analysis") || lower.includes("structure") || lower.includes("level") || lower.includes("risk") || lower.includes("exposure")) return "analysis"
  if (lower.includes("discipline") || lower.includes("focus") || lower.includes("help") || lower.includes("coach") || lower.includes("emotion") || lower.includes("psych")) return "coaching"
  return "analysis"
}
