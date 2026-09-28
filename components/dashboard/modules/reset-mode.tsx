"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW } from "@/components/mtf/mtf-theme"
import type { ResetModeState, PsychologyState, PrivateNote } from "../dashboard-types"
import { ShieldCheck, X, BookOpen, Brain, Sparkles, LogOut } from "lucide-react"

interface Props {
  state: ResetModeState
  onDeactivate: () => void
  psychology: PsychologyState
  notes: PrivateNote[]
}

export function ResetModeOverlay({ state, onDeactivate, psychology, notes }: Props) {
  const [phase, setPhase] = useState<"breathing" | "reflection" | "exit">("breathing")
  const reflectionNotes = notes.filter(n => n.type === "reflection")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: `rgba(10,12,21,0.97)` }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${ACCENT.amber.rgb},0.04), transparent 70%)`,
        }}
      />

      <div className="relative max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: `rgba(${ACCENT.amber.rgb},0.1)`,
              border: `1px solid rgba(${ACCENT.amber.rgb},0.2)`,
              boxShadow: GLOW.med(ACCENT.amber.rgb),
            }}
          >
            <ShieldCheck className="w-6 h-6" style={{ color: ACCENT.amber.hex }} />
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">Reset Mode</h2>
            <p className={TYPE.caption}>Step back. Breathe. Reset.</p>
          </div>
        </div>

        {/* Phases */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {(["breathing", "reflection", "exit"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPhase(p)}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-150"
              style={{
                background: phase === p ? `rgba(${ACCENT.amber.rgb},0.12)` : SURFACE.recess,
                border: `1px solid rgba(${ACCENT.amber.rgb},${phase === p ? 0.3 : 0.06})`,
                color: phase === p ? ACCENT.amber.hex : `rgba(255,255,255,0.4)`,
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Phase content */}
        {phase === "breathing" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              className="w-32 h-32 mx-auto rounded-full mb-6"
              style={{
                background: `rgba(${ACCENT.amber.rgb},0.05)`,
                border: `2px solid rgba(${ACCENT.amber.rgb},0.15)`,
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-center h-full">
                <span className="text-white/50 text-sm font-mono">Breathe</span>
              </div>
            </motion.div>
            <p className="text-[13px] leading-relaxed max-w-sm mx-auto" style={{ color: `rgba(255,255,255,0.5)` }}>
              Close your eyes. Inhale for 4 seconds, hold for 7, exhale for 8. Repeat until you feel the tension release. The market will be here when you return.
            </p>
          </motion.div>
        )}

        {phase === "reflection" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4" style={{ color: `rgba(${ACCENT.amber.rgb},0.6)` }} />
              <span className="text-white text-xs font-semibold">Your past reflections</span>
            </div>
            {reflectionNotes.length > 0 ? reflectionNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl"
                style={{ background: SURFACE.card, border: `1px solid rgba(${ACCENT.amber.rgb},0.06)` }}
              >
                <p className="text-[12px] leading-relaxed" style={{ color: `rgba(255,255,255,0.6)` }}>{note.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  {note.tags.map(t => (
                    <span key={t} className="text-[9px] font-mono" style={{ color: `rgba(${ACCENT.amber.rgb},0.4)` }}>#{t}</span>
                  ))}
                </div>
              </div>
            )) : (
              <p className="text-center py-6" style={{ color: `rgba(255,255,255,0.3)` }}>
                No reflections yet. Write one in your private notes.
              </p>
            )}

            {/* AI behavioral patterns */}
            {psychology.patterns.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4" style={{ color: `rgba(${ACCENT.purple.rgb},0.6)` }} />
                  <span className="text-white text-xs font-semibold">Behavioral patterns to remember</span>
                </div>
                {psychology.patterns.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg mb-1" style={{ background: `rgba(${ACCENT.purple.rgb},0.04)` }}>
                    <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.purple.rgb},0.4)` }} />
                    <p className="text-[10px] leading-relaxed" style={{ color: `rgba(255,255,255,0.5)` }}>{p}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {phase === "exit" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-[13px] leading-relaxed mb-6 max-w-sm mx-auto" style={{ color: `rgba(255,255,255,0.5)` }}>
              Before you return, confirm that you have reviewed your plan and feel ready to trade with discipline. The market rewards patience.
            </p>
            <button
              onClick={onDeactivate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
              style={{
                background: `rgba(${ACCENT.emerald.rgb},0.12)`,
                border: `1px solid rgba(${ACCENT.emerald.rgb},0.3)`,
                color: ACCENT.emerald.hex,
                boxShadow: GLOW.med(ACCENT.emerald.rgb),
              }}
            >
              <LogOut className="w-4 h-4" />
              I am ready to return
            </button>
          </motion.div>
        )}

        {/* Close button */}
        <button
          onClick={onDeactivate}
          className="absolute -top-12 right-0 p-2 rounded-lg transition-all duration-150 hover:scale-110"
          style={{ background: `rgba(${ACCENT.slate.rgb},0.1)` }}
        >
          <X className="w-4 h-4" style={{ color: `rgba(255,255,255,0.3)` }} />
        </button>
      </div>
    </motion.div>
  )
}
