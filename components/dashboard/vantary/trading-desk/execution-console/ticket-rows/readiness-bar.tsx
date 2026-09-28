"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION TICKET · ROW 6 — READINESS BAR (the go / no-go verdict)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The submit affordance + its honest verdict. When the draft is preview-ready
 *  it shows a full-width, breathing PLACE ORDER button in the mode accent.
 *  When blocked/incomplete/invalid it shows the single most important blocking
 *  reason inline and the button is disabled — the trader always knows the one
 *  thing standing between them and execution.
 *
 *  Phase boundary: PLACE ORDER is an ARMED affordance only — no broker call,
 *  no order is submitted. It surfaces the readiness summit; preview/confirm
 *  arrive in a later phase.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, ShieldAlert, ShieldCheck, CircleDot, Lock } from "lucide-react"

import { VANTARY } from "../../../vantary-theme"
import { CONSOLE_ACCENTS } from "../console-theme"
import { GlassButton } from "../glass-surface"
import { useTradeDraft } from "../trade-draft-context"
import { draftReadinessView } from "../trade-draft"

export const ReadinessBar = memo(function ReadinessBar({
  onReview,
}: {
  onReview?: () => void
}) {
  const reduce = useReducedMotion()
  const { mode, draft } = useTradeDraft()
  const accent = CONSOLE_ACCENTS[mode]
  const view = draftReadinessView(draft)

  const ready = draft.readiness === "preview-ready" || draft.readiness === "sim-ready"
  const locked = draft.readiness === "locked"
  const blocked = draft.readiness === "blocked" || draft.readiness === "invalid"

  const tone = blocked ? VANTARY.chartDown : ready ? accent.base : locked ? "#E5A93C" : VANTARY.ash
  const Icon = blocked ? ShieldAlert : ready ? ShieldCheck : locked ? Lock : CircleDot

  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {/* verdict line */}
      <div className="flex items-start gap-2">
        <Icon size={14} strokeWidth={2} color={tone} style={{ marginTop: 1, flexShrink: 0 }} />
        <div className="flex flex-col" style={{ minWidth: 0 }}>
          <span className="font-mono uppercase" style={{ fontSize: 9.5, letterSpacing: "0.1em", fontWeight: 600, color: tone }}>
            {view.headline}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={view.detail}
              initial={reduce ? false : { opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -2 }}
              transition={{ duration: 0.18 }}
              className="font-sans"
              style={{ fontSize: 10.5, color: VANTARY.ashSoft, lineHeight: 1.4 }}
            >
              {view.detail}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* the action — glass showpiece when armed-ready */}
      <GlassButton
        type="button"
        disabled={!ready}
        onClick={ready ? onReview : undefined}
        accent={ready ? accent.base : blocked ? VANTARY.chartDown : VANTARY.ash}
        tone={ready ? "active" : blocked ? "sell" : "idle"}
        selected={ready}
        showpiece={ready}
        radius={11}
        className="justify-center"
        style={{ width: "100%", padding: "12px 14px", gap: 8 }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11, letterSpacing: "0.14em", fontWeight: 600,
            color: ready ? accent.base : blocked ? VANTARY.chartDown : VANTARY.ashSoft,
          }}
        >
          {ready ? "PLACE ORDER" : locked ? "UNLOCK TO ARM" : blocked ? (draft.blocks[0]?.message ? "RESOLVE TO CONTINUE" : "BLOCKED") : "COMPLETE THE DRAFT"}
        </span>
        {ready && <ArrowRight size={13} strokeWidth={2.2} color={accent.base} />}
      </GlassButton>
    </div>
  )
})
