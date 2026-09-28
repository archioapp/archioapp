"use client"

/**
 * LIVE ROOM — THE BREAKDOWN
 *
 * The mentor's causal chain as a glass spine:
 *   CONTEXT → NARRATIVE → LEVEL → TRIGGER → ENTRY → MANAGE → OUTCOME
 *
 * Seven nodes folded from the ledger (deriveBreakdown). One thread runs
 * through them: solid up to the frontier (the furthest non-pending node),
 * dashed beyond it. A light travels the solid thread and rests on the
 * frontier — the rating-monument grammar, a light between facts.
 *
 * Hover a node → its evidence lights in the timeline and its level draws
 * on the chart. Pin a node → the Dossier opens beneath the spine with the
 * full reasoning, the "so what", the evidence list, the invalidation
 * hairline and the confluence strata.
 *
 * Everything derives at viewMin, so scrubbing the replay walks the spine.
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Compass, Route, Flag, Zap, ArrowUpRight, ShieldCheck, Trophy, CornerDownRight, type LucideIcon } from "lucide-react"
import { LR, lrMix, toneColor, type LrTone } from "./live-room-tokens"
import { LrPane, LrPaneHeader, LrRecess, LrEyebrow, LrChip, LrLiveDot, useReducedMotion } from "./live-room-primitives"
import { useSession } from "./session-store"
import { NODE_ROLES, EVENT_META, clockLabel, type BreakdownNode, type NodeRole } from "./session-state"
import { Prose, Meaning } from "./explain-term"
import { ConfluenceStrata, InvalidationLine } from "./trade-bits"
import { termsIn, GLOSSARY } from "./glossary"
import { scrollToEvent } from "./phase-rail"

const GLYPH: Record<NodeRole, LucideIcon> = {
  context: Compass, narrative: Route, level: Flag, trigger: Zap, entry: ArrowUpRight, manage: ShieldCheck, outcome: Trophy,
}

const PULSING = new Set(["armed", "live", "forming"])

/* ── status coin ───────────────────────────────────────────────────────── */
function StatusCoin({ node }: { node: BreakdownNode }) {
  const c = toneColor(node.tone)
  const pending = node.status === "pending"
  return (
    <span className="inline-flex items-center gap-1.5 shrink-0" aria-hidden>
      {PULSING.has(node.status) ? (
        <LrLiveDot tone={node.tone} size={6} />
      ) : (
        <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: pending ? "transparent" : c, border: `1px solid ${pending ? LR.ashSoft : c}`, boxShadow: pending ? "none" : `0 0 6px ${lrMix(c, 0.5)}` }} />
      )}
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: pending ? LR.ashSoft : c, fontWeight: 600 }}>{node.statusLabel}</span>
    </span>
  )
}

/* ── node tile ─────────────────────────────────────────────────────────── */
const NodeTile = React.forwardRef<HTMLDivElement, { node: BreakdownNode; index: number; tabbable: boolean; rail: boolean; onArrow: (dir: 1 | -1 | "home" | "end") => void }>(
  function NodeTile({ node, index, tabbable, rail, onArrow }, ref) {
    const s = useSession()
    const reduce = useReducedMotion()
    const Glyph = GLYPH[node.role]
    const c = toneColor(node.tone)
    const hovered = s.hoveredNode === node.role
    const active = s.activeNode === node.role
    const lit = hovered || active
    const pending = node.status === "pending"
    const frontier = s.frontier === index
    const meta = NODE_ROLES[index]

    const pin = () => {
      const turningOn = s.activeNode !== node.role
      s.dispatch({ type: "toggleNode", role: node.role })
      if (turningOn) {
        const stamp = [...node.evidenceIds].map((id) => s.events.find((e) => e.id === id)).filter(Boolean).sort((a, b) => b!.at - a!.at)[0]
        if (stamp) { s.focusEvent(stamp.id); window.setTimeout(() => scrollToEvent(stamp.id), 80) }
      } else s.focusEvent(null)
    }

    return (
      <motion.div
        ref={ref}
        role="radio"
        aria-checked={active}
        aria-label={`${meta.label}: ${node.claim}. ${node.statusLabel}. ${meta.question}`}
        tabIndex={tabbable ? 0 : -1}
        data-lr-node={node.role}
        className="lr-node relative min-w-0 focus:outline-none"
        initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: pending && !lit ? 0.62 : 1, y: lit ? -2 : 0, filter: "blur(0px)" }}
        transition={{ duration: 0.38, ease: LR.ease, delay: 0.06 * index + 0.1 }}
        onMouseEnter={() => s.dispatch({ type: "hoverNode", role: node.role })}
        onMouseLeave={() => s.dispatch({ type: "hoverNode", role: null })}
        onFocus={() => s.dispatch({ type: "hoverNode", role: node.role })}
        onBlur={() => s.dispatch({ type: "hoverNode", role: null })}
        onClick={pin}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pin() }
          else if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); onArrow(1) }
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); onArrow(-1) }
          else if (e.key === "Home") { e.preventDefault(); onArrow("home") }
          else if (e.key === "End") { e.preventDefault(); onArrow("end") }
        }}
      >
        {rail ? (
          /* RAIL ROW — the spine runs down the left; one row per node, the
             claim and status on one line. The vertical thread is drawn by
             SpineThreads through the coins at x = 13. */
          <div
            className="relative flex items-center gap-2.5 rounded-[10px] pl-2 pr-2.5 cursor-pointer"
            style={{ height: 38, background: lit ? lrMix(c, 0.06) : "transparent", border: `1px solid ${lit || active ? lrMix(c, 0.22) : "transparent"}`, transition: "background 200ms ease, border-color 200ms ease" }}
          >
            <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: 10, height: 10 }}>
              {frontier && !reduce && (
                <motion.span aria-hidden className="absolute rounded-full" style={{ inset: -4, border: `1px solid ${lrMix(c, 0.5)}` }} animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.15, 0.9] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
              )}
              <span aria-hidden className="inline-block rounded-full" style={{ width: 6, height: 6, background: pending ? "transparent" : c, border: `1px solid ${pending ? LR.ashSoft : c}`, boxShadow: pending ? "none" : `0 0 6px ${lrMix(c, 0.55)}` }} />
            </span>
            <Glyph size={10} strokeWidth={1.7} color={pending ? LR.ashSoft : c} className="shrink-0" />
            <span className="font-mono uppercase shrink-0" style={{ width: 62, fontSize: 8.5, letterSpacing: "0.2em", color: pending ? LR.ashSoft : c, fontWeight: 500 }}>{meta.label}</span>
            <span className={`${/^[+\-−$\d]/.test(node.claim) ? "font-mono tabular-nums" : "font-sans"} flex-1 min-w-0 truncate`} style={{ fontSize: 12, fontWeight: 500, color: pending ? LR.paperDim : LR.paper, letterSpacing: "-0.005em" }}>{node.claim}</span>
            <span className="font-mono uppercase shrink-0" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: pending ? LR.ashSoft : c, fontWeight: 500 }}>{node.statusLabel}</span>
            {node.stampAt !== undefined && <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 9, color: LR.ashSoft, width: 46, textAlign: "right" }}>{clockLabel(node.stampAt)}</span>}
          </div>
        ) : (
        <LrRecess
          tone={node.tone === "neutral" ? "primary" : node.tone}
          lit={lit}
          thread={lit || frontier}
          interactive
          className="lr-node-tile h-full flex flex-col gap-1.5 px-2.5 pt-2.5 pb-2 cursor-pointer"
          style={{ minHeight: 96, outline: active ? `1px solid ${lrMix(c, 0.4)}` : "none", outlineOffset: 1 }}
        >
          {/* frontier halo */}
          {frontier && !reduce && (
            <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-[14px]" style={{ boxShadow: `0 0 0 1px ${lrMix(c, 0.3)}, 0 0 22px ${lrMix(c, 0.16)}` }}
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
          )}

          {/* header — Flight Deck capsule grammar: dot · glyph · NN LABEL */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span aria-hidden className="inline-block rounded-full shrink-0" style={{ width: 4, height: 4, background: pending ? "transparent" : lrMix(c, 0.85), border: `1px solid ${pending ? LR.ashSoft : c}`, boxShadow: pending ? "none" : `0 0 6px ${lrMix(c, 0.5)}` }} />
            <Glyph size={10} strokeWidth={1.7} color={pending ? LR.ashSoft : c} className="shrink-0" />
            <span className="font-mono uppercase whitespace-nowrap truncate" style={{ fontSize: 8.5, letterSpacing: "0.2em", color: pending ? LR.ashSoft : c, fontWeight: 500 }}>
              {meta.label}
            </span>
          </div>

          <span
            className={`${/^[+\-−$\d]/.test(node.claim) ? "font-mono tabular-nums" : "font-sans"} text-pretty`}
            style={{ fontSize: node.claim.length > 16 ? 12 : 13.5, fontWeight: 500, color: pending ? LR.paperDim : LR.paper, letterSpacing: "-0.01em", lineHeight: 1.2, transition: "color 300ms ease" }}
          >
            {node.claim}
          </span>

          <div className="flex items-center gap-1.5 mt-auto pt-0.5 min-w-0">
            <span className="font-mono uppercase truncate" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: pending ? LR.ashSoft : c, fontWeight: 500 }}>{node.statusLabel}</span>
            <span className="flex-1" />
            {node.stampAt !== undefined && (
              <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 8.5, letterSpacing: "0.06em", color: LR.ashSoft }}>{clockLabel(node.stampAt)}</span>
            )}
          </div>
        </LrRecess>
        )}
      </motion.div>
    )
  },
)

/* ── threads — one path through the node tops, solid to the frontier ─── */
function SpineThreads({ rects, frontier, host, rail }: { rects: (DOMRect | null)[]; frontier: number; host: DOMRect | null; rail: boolean }) {
  const reduce = useReducedMotion()
  if (!host || rects.some((r) => !r)) return null
  const segs: { d: string; solid: boolean }[] = []
  let litPath: string | null = null

  if (rail) {
    // vertical: a thread through the coins (x = 8 + 1 + 5 → the coin centre), row to row
    const cx = 8 + 1 + 5
    const cy = rects.map((r) => r!.top - host.top + r!.height / 2)
    for (let i = 0; i < cy.length - 1; i++) segs.push({ d: `M ${cx} ${cy[i] + 6} L ${cx} ${cy[i + 1] - 6}`, solid: i < frontier })
    if (frontier > 0) litPath = `M ${cx} ${cy[0]} L ${cx} ${cy[frontier]}`
  } else {
    const pts = rects.map((r) => ({ left: r!.left - host.left, right: r!.right - host.left, y: r!.top - host.top + 22, top: r!.top - host.top }))
    const singleRow = pts.every((p) => Math.abs(p.top - pts[0].top) < 4)
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1]
      const solid = i < frontier
      if (Math.abs(a.top - b.top) < 4) segs.push({ d: `M ${a.right} ${a.y} L ${b.left} ${b.y}`, solid })
      else segs.push({ d: `M ${a.right} ${a.y} l 8 0 M ${b.left - 8} ${b.y} l 8 0`, solid })
    }
    // the light rides the solid thread from the first node to the frontier, across the gaps only
    if (singleRow && frontier > 0) litPath = pts.slice(0, frontier).map((a, i) => { const b = pts[i + 1]; return `${i === 0 ? "M" : "L"} ${a.right} ${a.y} L ${b.left} ${b.y}` }).join(" ")
  }
  const P = LR.primary
  return (
    <div aria-hidden className="lr-spine-threads pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 overflow-visible" width={host.width} height={host.height}>
        {segs.map((sg, i) => (
          <path key={i} d={sg.d} fill="none" stroke={sg.solid ? lrMix(P, 0.7) : lrMix(LR.ashSoft, 0.55)} strokeWidth={1} strokeDasharray={sg.solid ? undefined : "3 4"} strokeLinecap="round" />
        ))}
      </svg>
      {litPath && !reduce && (
        <motion.span
          className="absolute rounded-full"
          style={{ width: 6, height: 6, marginLeft: -3, marginTop: -3, background: P, boxShadow: `0 0 8px ${P}, 0 0 16px ${lrMix(P, 0.5)}`, offsetPath: `path("${litPath}")`, offsetRotate: "0deg" } as React.CSSProperties}
          animate={{ offsetDistance: ["0%", "100%", "100%"], opacity: [0, 1, 1, 0.9, 0] }}
          transition={{ duration: 6.4, times: [0, 0.5, 0.9, 1], repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
        />
      )}
    </div>
  )
}

/* ── dossier — the pinned node, opened beneath the spine ──────────────── */
function Dossier({ node }: { node: BreakdownNode }) {
  const s = useSession()
  const c = toneColor(node.tone)
  const meta = NODE_ROLES[node.index]
  const evidence = node.evidenceIds.map((id) => s.events.find((e) => e.id === id)).filter(Boolean).sort((a, b) => a!.at - b!.at) as NonNullable<ReturnType<typeof s.events.find>>[]
  const terms = Array.from(new Set([...termsIn(node.body), ...termsIn(node.detail), ...termsIn(node.meaning)]))
  const Glyph = GLYPH[node.role]
  return (
    <motion.div
      key={node.role}
      initial={{ opacity: 0, height: 0, y: -6 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -4 }}
      transition={{ duration: 0.36, ease: LR.ease }}
      className="overflow-hidden"
    >
      <div
        className="lr-dossier relative mt-2.5 px-3 pt-2.5 pb-3 flex flex-col gap-3"
        style={{
          borderRadius: 14,
          background: `linear-gradient(180deg, ${lrMix(c, 0.06)} 0%, transparent 60%), ${lrMix(LR.recess.bg, 0.7)}`,
          border: `1px solid ${lrMix(c, 0.2)}`,
          boxShadow: `${LR.specular}, 0 10px 30px ${lrMix(c, 0.06)}`,
        }}
      >
        <span aria-hidden className="pointer-events-none absolute top-0 left-5 right-5" style={{ height: 1, background: LR.thread(c, 0.75) }} />

        {/* header — capsule grammar */}
        <div className="flex items-center gap-2 min-w-0">
          <span aria-hidden className="inline-block rounded-full shrink-0" style={{ width: 4, height: 4, background: lrMix(c, 0.85), boxShadow: `0 0 6px ${lrMix(c, 0.55)}` }} />
          <Glyph size={11} strokeWidth={1.6} color={c} className="shrink-0" />
          <span className="font-mono uppercase shrink-0" style={{ fontSize: 9, letterSpacing: "0.22em", color: c, fontWeight: 500 }}>{String(node.index + 1).padStart(2, "0")} · {meta.label}</span>
          <span aria-hidden className="flex-1 min-w-[12px] h-px" style={{ background: LR.dashed(lrMix(c, 0.3)) }} />
          <StatusCoin node={node} />
          {node.stampAt !== undefined && <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 9, letterSpacing: "0.08em", color: LR.ashSoft }}>{clockLabel(node.stampAt)}</span>}
          <button type="button" aria-label="Close dossier" onClick={() => s.dispatch({ type: "toggleNode", role: node.role })} className="inline-flex items-center justify-center rounded-md focus:outline-none shrink-0" style={{ width: 20, height: 20, color: LR.ashSoft, border: `1px solid ${LR.recess.border}` }}>
            <X size={10} />
          </button>
        </div>

        <span className="font-sans text-pretty" style={{ fontSize: 13, fontWeight: 500, color: LR.paper, letterSpacing: "-0.005em", lineHeight: 1.3 }}>{meta.question}</span>

        <div className="lr-dossier-grid grid gap-3">
          {/* reasoning */}
          <div className="flex flex-col gap-2.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.2em", color: LR.ashSoft }}>The mentor&apos;s reasoning</span>
              <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
            </div>
            {node.body ? (
              <Prose text={node.body} style={{ fontSize: 11.5, lineHeight: 1.5, color: LR.paperDim }} />
            ) : (
              <p className="m-0 font-sans" style={{ fontSize: 11.5, lineHeight: 1.5, color: LR.paperDim }}>Nothing has been said about this yet. The node fills in as the mentor speaks.</p>
            )}
            {node.meaning && <Meaning text={node.meaning} size={11} />}
            {node.invalidation && <InvalidationLine inv={node.invalidation} compact />}
            {terms.length > 0 && (
              <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
                <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: LR.ashSoft }}>Vocabulary</span>
                {terms.map((t, i) => (
                  <React.Fragment key={t}>
                    {i > 0 && <span aria-hidden style={{ width: 1, height: 10, background: LR.rule }} />}
                    <span className="font-sans" title={GLOSSARY[t].short} style={{ fontSize: 10.5, color: LR.paperDim, borderBottom: `1px dotted ${lrMix(LR.primary, 0.5)}` }}>{GLOSSARY[t].term}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* evidence + confluence */}
          <div className="flex flex-col gap-2.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.2em", color: LR.ashSoft }}>Evidence · {evidence.length}</span>
              <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed() }} />
            </div>
            {evidence.length ? (
              <ol className="m-0 p-0 flex flex-col" style={{ listStyle: "none" }}>
                {evidence.map((e, i) => {
                  const lit = s.focusedEvent === e.id || s.hoveredEvent === e.id
                  return (
                    <li key={e.id} style={{ borderTop: i > 0 ? `1px solid ${LR.recess.border}` : "none" }}>
                      <button
                        type="button"
                        onClick={() => { s.focusEvent(e.id); window.setTimeout(() => scrollToEvent(e.id), 40) }}
                        onMouseEnter={() => s.dispatch({ type: "hoverEvent", id: e.id })}
                        onMouseLeave={() => s.dispatch({ type: "hoverEvent", id: null })}
                        className="w-full text-left flex items-center gap-2 py-[6px] focus:outline-none"
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                      >
                        <span aria-hidden className="inline-block rounded-full shrink-0" style={{ width: 4, height: 4, background: lit ? LR.primary : lrMix(LR.ashSoft, 0.7), boxShadow: lit ? `0 0 6px ${LR.primary}` : "none", transition: "background 200ms" }} />
                        <span className="font-mono uppercase shrink-0" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: lit ? LR.primary : LR.ashSoft, width: 62, transition: "color 200ms" }}>{EVENT_META[e.type].label}</span>
                        <span className="font-sans text-pretty flex-1 min-w-0" style={{ fontSize: 11, lineHeight: 1.35, color: lit ? LR.paper : LR.paperDim, transition: "color 200ms" }}>{e.title}</span>
                        <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 9, color: LR.ashSoft }}>{clockLabel(e.at)}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <p className="m-0 font-sans" style={{ fontSize: 11.5, color: LR.paperDim }}>No events yet.</p>
            )}
            {node.confluence && node.confluence.length > 0 && (
              <div className="pt-0.5"><ConfluenceStrata strata={node.confluence} compact /></div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── the pane ──────────────────────────────────────────────────────────── */
export function BreakdownSpine({ delay = 0 }: { delay?: number }) {
  const s = useSession()
  const gridRef = React.useRef<HTMLDivElement>(null)
  const tileRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const [rects, setRects] = React.useState<(DOMRect | null)[]>([])
  const [host, setHost] = React.useState<DOMRect | null>(null)
  const [focusIdx, setFocusIdx] = React.useState(0)
  const [rail, setRail] = React.useState(true)
  const frontierNode = s.breakdown[Math.max(0, s.frontier)]

  const measure = React.useCallback(() => {
    const g = gridRef.current
    if (!g) return
    // the grid decides the layout (container query); we read it back so the threads match
    setRail(getComputedStyle(g).gridTemplateColumns.split(" ").length < 7)
    setHost(g.getBoundingClientRect())
    setRects(tileRefs.current.map((el) => el?.getBoundingClientRect() ?? null))
  }, [])

  React.useEffect(() => {
    measure()
    const g = gridRef.current
    if (!g) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(g)
    const t = window.setTimeout(measure, 700) // after the entrance stagger settles
    return () => { ro.disconnect(); window.clearTimeout(t) }
  }, [measure, s.activeNode])

  const onArrow = (dir: 1 | -1 | "home" | "end") => {
    const n = s.breakdown.length
    const next = dir === "home" ? 0 : dir === "end" ? n - 1 : (focusIdx + dir + n) % n
    setFocusIdx(next)
    tileRefs.current[next]?.focus()
  }

  return (
    <LrPane labelledBy="lr-breakdown-title" delay={delay} deep glow>
      <LrPaneHeader
        id="lr-breakdown-title"
        eyebrow="The breakdown"
        hint={`${s.breakdown.filter((n) => n.status !== "pending").length} of ${s.breakdown.length} · ${s.knownEvents.length} events`}
        trailing={
          <span className="inline-flex items-center gap-2 min-w-0">
            {s.replaying && <LrChip tone="warn" active size={9}>replay · {clockLabel(s.viewMin)}</LrChip>}
            <span className="lr-hide-xs inline-flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden className="inline-block rounded-full" style={{ width: 4, height: 4, background: toneColor(frontierNode?.tone ?? "primary"), boxShadow: `0 0 6px ${toneColor(frontierNode?.tone ?? "primary")}` }} />
              <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.2em", color: LR.ashSoft }}>Frontier</span>
              <span className="font-sans" style={{ fontSize: 11, fontWeight: 500, color: LR.paperDim }}>{frontierNode?.label ?? "—"} <span style={{ color: toneColor(frontierNode?.tone ?? "primary") }}>· {frontierNode?.statusLabel ?? ""}</span></span>
            </span>
          </span>
        }
      />
      <div className="px-3 pb-3">
        <div className="relative">
          <SpineThreads rects={rects} frontier={s.frontier} host={host} rail={rail} />
          <div
            ref={gridRef}
            role="radiogroup"
            aria-label="The breakdown — the mentor's causal chain"
            className="lr-spine-grid relative grid"
            data-rail={rail ? "" : undefined}
          >
            {s.breakdown.map((n, i) => (
              <NodeTile key={n.role} ref={(el) => { tileRefs.current[i] = el }} node={n} index={i} tabbable={i === focusIdx} rail={rail} onArrow={onArrow} />
            ))}
          </div>
        </div>
        <AnimatePresence initial={false}>{s.activeNodeData && <Dossier key={s.activeNodeData.role} node={s.activeNodeData} />}</AnimatePresence>
      </div>
    </LrPane>
  )
}
