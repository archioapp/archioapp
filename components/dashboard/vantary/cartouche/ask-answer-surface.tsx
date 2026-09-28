"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · ASK VANTARY · ANSWER SURFACE
   ───────────────────────────────────────────────────────────────────────────
   The framed home for the Oracle's response. Mounted below the four rooms
   (NOT between Ask bar and rooms — that's the suggestion panel). Wraps the
   existing slim <VantaryOracle/> so it inherits all current answer-render
   capability (Universal Template viewport + free-text answer body), while
   adding:

     · A top eyebrow rail showing the prompt the user submitted
     · An accent-tinted hairline seam above
     · A footer rail with [Clear] and [Ask Again] actions
     · Animated mount/unmount tied to AskVantaryState (submitted | answering)
     · A loading shimmer in `submitted` state, replaced by the Oracle when
       the state advances to `answering`

   The surface is mounted UNCONDITIONALLY so that the slim Oracle's own
   submit-handler registration via OracleArmedContext stays alive even when
   the surface is visually collapsed. The animated wrapper handles the
   reveal/conceal with `height: auto ↔ 0` + opacity, never unmounting the
   inner children.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, RotateCw, X } from "lucide-react"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import { useAskVantaryState } from "./ask-vantary-state-context"

const EASE_V = [0.22, 1, 0.36, 1] as const

/* ────────────────────────────────────────────────────────────────────────
   Public component
   ──────────────────────────────────────────────────────────────────────── */
export interface AskAnswerSurfaceProps {
  /** Active accent for hairlines, eyebrow, button glow. */
  accent: ThemeAccent
  /** The slim Oracle (or any answer-renderer) provided as children. We
   *  always render it so it keeps its submit handler registered. */
  children: React.ReactNode
  /** Optional "Ask Again" handler. If omitted, the button is hidden. */
  onAskAgain?: () => void
}

export function AskAnswerSurface({ accent, children, onAskAgain }: AskAnswerSurfaceProps) {
  const state = useAskVantaryState()
  const visible    = state.isAnswering
  const loading    = state.state === "submitted"
  const prompt     = state.prompt
  const topic      = state.answerTopic || derivePromptTopic(prompt)

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* The wrapper is always in the DOM so its children (the slim Oracle)
          keep their submit handler registered with the OracleArmedContext.
          When `visible` is false, we collapse to height 0 + opacity 0. */}
      <motion.div
        aria-hidden={!visible}
        initial={false}
        animate={{
          height:   visible ? "auto" : 0,
          opacity:  visible ? 1      : 0,
          y:        visible ? 0      : -6,
          marginTop: visible ? 14    : 0,
        }}
        transition={{
          height:   { duration: visible ? 0.34 : 0.22, ease: EASE_V },
          opacity:  { duration: visible ? 0.32 : 0.18, ease: EASE_V },
          y:        { duration: visible ? 0.30 : 0.18, ease: EASE_V },
          marginTop:{ duration: visible ? 0.34 : 0.22, ease: EASE_V },
        }}
        style={{
          overflow: "hidden",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div
          role="region"
          aria-label="Vantary answer"
          style={{
            position: "relative",
            padding: "12px 16px 14px",
            borderRadius: 14,
            background:
              `radial-gradient(120% 80% at 50% 0%, ${vgRgba(accent.rgb, 0.06)} 0%, transparent 60%),`
            + `rgba(8, 12, 16, 0.55)`,
            border: `1px solid ${vgRgba(accent.rgb, 0.20)}`,
            boxShadow: `0 0 20px ${vgRgba(accent.rgb, 0.10)}, inset 0 0 16px ${vgRgba(accent.rgb, 0.04)}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* ── Top hairline seam ─────────────────────────────────── */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0, left: 16, right: 16, height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${vgRgba(accent.rgb, 0.45)} 50%, transparent 100%)`,
              opacity: 0.7,
            }}
          />

          {/* ── Header rail ───────────────────────────────────────── */}
          <AnswerHeader
            accent={accent}
            prompt={prompt}
            topic={topic}
            loading={loading}
            onClear={state.clear}
            onAskAgain={onAskAgain}
          />

          {/* ── Body ─────────────────────────────────────────────── */}
          <div style={{ position: "relative", marginTop: 8 }}>
            {/* Loading shimmer overlay — only during `submitted`. */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  key="shimmer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit   ={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: EASE_V }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(8, 12, 16, 0.70)",
                    backdropFilter: "blur(2px)",
                    borderRadius: 8,
                    minHeight: 72,
                  }}
                >
                  <AnswerShimmer accent={accent} prompt={prompt} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* The actual Oracle answer renderer (slim VantaryOracle).
                Stays mounted at all times — only the wrapper collapses. */}
            <div style={{ position: "relative", zIndex: 1 }}>
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   AnswerHeader — eyebrow with the prompt + actions
   ──────────────────────────────────────────────────────────────────────── */
function AnswerHeader({
  accent, prompt, topic, loading, onClear, onAskAgain,
}: {
  accent:     ThemeAccent
  prompt:     string
  topic:      string
  loading:    boolean
  onClear:    () => void
  onAskAgain?:() => void
}) {
  return (
    <div className="flex items-start justify-between" style={{ gap: 12 }}>
      <div className="flex flex-col" style={{ gap: 3, minWidth: 0, flex: 1 }}>
        <div
          className="font-mono uppercase inline-flex items-center"
          style={{
            fontSize: 9,
            letterSpacing: "0.28em",
            color: accent.hex,
            opacity: 0.85,
            gap: 8,
            whiteSpace: "nowrap",
          }}
        >
          <span>Vantary · Answer</span>
          {topic && (
            <>
              <span style={{ opacity: 0.42 }}>·</span>
              <span style={{ color: VG_VT.paperDim }}>{topic.slice(0, 36)}</span>
            </>
          )}
          {loading && (
            <motion.span
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-flex", marginLeft: 4 }}
            >
              <Loader2 size={10} strokeWidth={2} />
            </motion.span>
          )}
        </div>
        {prompt && (
          <p
            className="font-sans"
            style={{
              fontSize: 13,
              lineHeight: 1.45,
              color: VG_VT.paper,
              margin: 0,
              letterSpacing: "-0.005em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            } as React.CSSProperties}
          >
            <span style={{ opacity: 0.55 }}>You asked: </span>
            <span>{prompt}</span>
          </p>
        )}
      </div>

      <div className="flex items-center" style={{ gap: 6 }}>
        {onAskAgain && (
          <button
            type="button"
            onClick={onAskAgain}
            className="inline-flex items-center gap-1.5 font-mono uppercase rounded-full"
            style={{
              height: 22,
              padding: "0 9px",
              fontSize: 8.5,
              letterSpacing: "0.22em",
              color: accent.hex,
              background: vgRgba(accent.rgb, 0.10),
              border: `1px solid ${vgRgba(accent.rgb, 0.32)}`,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <RotateCw size={9} strokeWidth={1.8} />
            Ask Again
          </button>
        )}
        <button
          type="button"
          aria-label="Clear answer"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 font-mono uppercase rounded-full"
          style={{
            height: 22,
            padding: "0 9px",
            fontSize: 8.5,
            letterSpacing: "0.22em",
            color: VG_VT.paperDim,
            background: "transparent",
            border: `1px solid ${vgRgba(accent.rgb, 0.20)}`,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <X size={9} strokeWidth={1.8} />
          Clear
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   AnswerShimmer — the "Vantary is thinking" treatment shown in `submitted`
   ──────────────────────────────────────────────────────────────────────── */
function AnswerShimmer({ accent, prompt }: { accent: ThemeAccent; prompt: string }) {
  return (
    <div className="flex flex-col items-center" style={{ gap: 6, padding: "10px 16px" }}>
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        style={{
          color: accent.hex,
          opacity: 0.7,
          filter: `drop-shadow(0 0 6px ${vgRgba(accent.rgb, 0.65)})`,
        }}
      >
        <Loader2 size={20} strokeWidth={1.6} />
      </motion.div>
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.28em",
          color: VG_VT.paperDim,
        }}
      >
        Vantary is thinking
      </span>
      {prompt && (
        <span
          className="font-sans"
          style={{
            fontSize: 11,
            color: VG_VT.paperDim,
            maxWidth: 360,
            textAlign: "center",
            lineHeight: 1.4,
            opacity: 0.75,
          }}
        >
          {prompt.slice(0, 80)}{prompt.length > 80 ? "…" : ""}
        </span>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   derivePromptTopic — crude topic extractor for the eyebrow chip. Picks
   the first capitalised proper-noun-like token, or falls back to the
   first 3 words.
   ──────────────────────────────────────────────────────────────────────── */
function derivePromptTopic(prompt: string): string {
  if (!prompt) return ""
  const trimmed = prompt.trim()
  /* Look for ALLCAPS tokens (tickers) or Capitalised words longer than 3 chars. */
  const tickerMatch = trimmed.match(/\b([A-Z]{3,}(?:\/[A-Z]{3,})?)\b/)
  if (tickerMatch) return tickerMatch[1]
  const properMatch = trimmed.match(/\b([A-Z][a-z]{3,})\b/)
  if (properMatch) return properMatch[1]
  const words = trimmed.split(/\s+/).slice(0, 3).join(" ")
  return words.length > 36 ? words.slice(0, 33) + "…" : words
}
