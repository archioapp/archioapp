"use client"

/**
 * LIVE ROOM — Explain layer
 *
 * `<Prose>` renders authored copy that carries {{term}} tokens. Each term
 * becomes a `<Term>`: a dotted-underline span that opens a glass card on
 * hover / focus with the definition, why it matters in this room, and a
 * 48×24 micro-diagram. Cards are portaled to <body> and flip above when
 * they would clip the viewport. The whole layer switches off with the
 * store's `explain` flag — copy renders as plain text.
 */

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LR, lrMix } from "./live-room-tokens"
import { LrEyebrow, useMounted, useReducedMotion } from "./live-room-primitives"
import { GLOSSARY, splitTerms, type TermDiagram } from "./glossary"
import { useSession } from "./session-store"

/* ── micro-diagrams — one hue, stroke only ─────────────────────────────── */
function Diagram({ kind }: { kind: TermDiagram }) {
  const c = LR.primary
  const dim = lrMix(LR.paper, 0.35)
  const common = { fill: "none", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" aria-hidden className="shrink-0">
      {kind === "cross" && (
        <>
          <line x1="2" y1="9" x2="46" y2="9" stroke={dim} strokeDasharray="2 3" {...common} />
          <path d="M2 20 L14 16 L22 18 L30 4 L36 12 L46 8" stroke={c} {...common} />
          <circle cx="30" cy="4" r="2" fill={c} />
        </>
      )}
      {kind === "gap" && (
        <>
          <rect x="4" y="14" width="6" height="8" rx="1" stroke={dim} {...common} />
          <rect x="16" y="3" width="6" height="19" rx="1" stroke={c} fill={lrMix(c, 0.18)} strokeWidth={1.4} />
          <rect x="28" y="2" width="6" height="7" rx="1" stroke={dim} {...common} />
          <rect x="10" y="9" width="24" height="5" fill={lrMix(c, 0.14)} stroke={c} strokeDasharray="2 2" strokeWidth={1} />
        </>
      )}
      {kind === "diverge" && (
        <>
          <path d="M2 6 L14 12 L24 10 L36 18 L46 14" stroke={dim} {...common} />
          <path d="M2 20 L14 16 L24 17 L36 10 L46 8" stroke={c} {...common} />
          <circle cx="36" cy="18" r="1.8" fill={dim} />
          <circle cx="36" cy="10" r="1.8" fill={c} />
        </>
      )}
      {kind === "ladder" && (
        <>
          <line x1="8" y1="2" x2="8" y2="22" stroke={dim} {...common} />
          {[4, 9, 14, 19].map((y, i) => <line key={y} x1="8" y1={y} x2={i === 1 ? 40 : 28} y2={y} stroke={i === 1 ? c : dim} {...common} />)}
          <circle cx="40" cy="9" r="2" fill={c} />
        </>
      )}
      {kind === "pulse" && (
        <>
          <line x1="2" y1="14" x2="46" y2="14" stroke={dim} strokeDasharray="2 3" {...common} />
          {[6, 12, 18, 24, 30, 36, 42].map((x, i) => <rect key={x} x={x - 2} y={14 - [4, 7, 5, 11, 6, 9, 4][i]} width="4" height={[4, 7, 5, 11, 6, 9, 4][i]} fill={i === 3 ? c : lrMix(c, 0.35)} rx="0.8" />)}
        </>
      )}
    </svg>
  )
}

/* ── card ──────────────────────────────────────────────────────────────── */
function TermCard({ id, anchor, cardId }: { id: string; anchor: DOMRect; cardId: string }) {
  const term = GLOSSARY[id]
  const reduce = useReducedMotion()
  const W = 272
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200
  const vh = typeof window !== "undefined" ? window.innerHeight : 800
  const left = Math.max(8, Math.min(vw - W - 8, anchor.left + anchor.width / 2 - W / 2))
  const spaceBelow = vh - anchor.bottom
  const flip = spaceBelow < 150
  const top = flip ? anchor.top - 8 : anchor.bottom + 8
  if (!term) return null
  return (
    <motion.div
      id={cardId}
      role="tooltip"
      initial={reduce ? false : { opacity: 0, y: flip ? 2 : -2, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: flip ? 2 : -2, filter: "blur(3px)" }}
      transition={{ duration: 0.16, ease: LR.ease }}
      className="fixed z-[200] pointer-events-none"
      style={{
        left, top, width: W,
        transform: flip ? "translateY(-100%)" : undefined,
        background: `linear-gradient(180deg, ${lrMix(LR.paper, 0.06)} 0%, ${lrMix(LR.paper, 0.02)} 100%), ${LR.pane.bgDeep}`,
        backdropFilter: LR.pane.blur, WebkitBackdropFilter: LR.pane.blur,
        border: `1px solid ${lrMix(LR.primary, 0.26)}`,
        borderRadius: 14,
        boxShadow: `${LR.shadowHover}, ${LR.specular}, 0 0 0 1px ${lrMix(LR.primary, 0.06)}`,
        padding: "12px 13px 12px",
      }}
    >
      <span aria-hidden className="pointer-events-none absolute top-0 left-4 right-4" style={{ height: 1, background: LR.thread(LR.primary, 0.7) }} />
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <LrEyebrow tone="primary" size={9}>{term.term}</LrEyebrow>
            <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed(lrMix(LR.primary, 0.3)) }} />
          </div>
          <p className="m-0 font-sans text-pretty" style={{ fontSize: 12.5, lineHeight: 1.5, color: LR.paper }}>{term.short}</p>
        </div>
        <Diagram kind={term.diagram} />
      </div>
      <div className="flex items-start gap-2 mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${LR.recess.border}` }}>
        <span aria-hidden className="font-mono shrink-0" style={{ fontSize: 10, color: LR.primary, lineHeight: "17px" }}>›</span>
        <p className="m-0 font-sans text-pretty" style={{ fontSize: 12, lineHeight: 1.45, color: LR.paperDim, fontStyle: "italic" }}>
          <span className="not-italic font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: LR.ashSoft, marginRight: 6 }}>in this room</span>
          {term.why}
        </p>
      </div>
    </motion.div>
  )
}

/* ── term span ─────────────────────────────────────────────────────────── */
let seq = 0
export function Term({ id, children, tone = "paper" }: { id: string; children: React.ReactNode; tone?: "paper" | "dim" }) {
  const s = useSession()
  const mounted = useMounted()
  const ref = React.useRef<HTMLSpanElement>(null)
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  const cardId = React.useMemo(() => `lr-term-${++seq}`, [])
  const term = GLOSSARY[id]
  if (!term || !s.explain) return <>{children}</>

  const open = () => { if (ref.current) setRect(ref.current.getBoundingClientRect()) }
  const close = () => setRect(null)

  return (
    <>
      <span
        ref={ref}
        tabIndex={0}
        aria-describedby={rect ? cardId : undefined}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onKeyDown={(e) => { if (e.key === "Escape") close() }}
        className="lr-term cursor-help rounded-[3px] focus:outline-none"
        style={{
          color: tone === "dim" ? LR.paperDim : LR.paper,
          textDecoration: "underline dotted",
          textDecorationColor: rect ? LR.primary : lrMix(LR.primary, 0.55),
          textDecorationThickness: 1,
          textUnderlineOffset: 3,
          transition: "text-decoration-color 200ms ease, background 200ms ease",
          background: rect ? lrMix(LR.primary, 0.08) : "transparent",
        }}
      >
        {children}
      </span>
      {mounted && createPortal(
        <AnimatePresence>{rect && <TermCard key={id} id={id} anchor={rect} cardId={cardId} />}</AnimatePresence>,
        document.body,
      )}
    </>
  )
}

/* ── prose renderer ────────────────────────────────────────────────────── */
export function Prose({ text, tone = "paper", className = "", style, as: Tag = "p" }: {
  text: string
  tone?: "paper" | "dim"
  className?: string
  style?: React.CSSProperties
  as?: "p" | "span"
}) {
  const segs = React.useMemo(() => splitTerms(text), [text])
  return (
    <Tag className={`m-0 font-sans text-pretty ${className}`} style={style}>
      {segs.map((seg, i) => seg.kind === "text" ? <React.Fragment key={i}>{seg.text}</React.Fragment> : <Term key={i} id={seg.id} tone={tone}>{seg.text}</Term>)}
    </Tag>
  )
}

/* ── meaning line — the "so what" with its tick ────────────────────────── */
export function Meaning({ text, size = 12.5, className = "" }: { text: string; size?: number; className?: string }) {
  return (
    <div className={`flex items-start gap-2 min-w-0 ${className}`}>
      <span aria-hidden className="font-mono shrink-0" style={{ fontSize: 10, color: LR.primary, lineHeight: `${Math.round(size * 1.5)}px` }}>›</span>
      <Prose text={text} tone="dim" style={{ fontSize: size, lineHeight: 1.5, color: LR.paperDim, fontStyle: "italic" }} />
    </div>
  )
}
