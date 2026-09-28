"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Network,
  Users,
  Terminal,
  LineChart,
  MessageSquare,
  Link as LinkIcon,
  Target,
  Wrench,
  NotebookPen,
  Eye,
  Compass,
  Gamepad2,
  X,
  ArrowRight,
} from "lucide-react"
import { DeviceFrame } from "./DeviceFrame"

/**
 * PillarsScroller — horizontal mini-card rail for the 12 Archio pillars.
 *
 * Each card opens a lightweight drawer with a representative screenshot
 * and a one-sentence explanation. The copy is intentionally short — this
 * is a tour, not a spec sheet.
 */

type Pillar = {
  key: string
  title: string
  oneLiner: string
  body: string
  icon: React.ComponentType<{ className?: string }>
  screen: string
  screenAlt: string
}

const PILLARS: Pillar[] = [
  {
    key: "ecosystem",
    title: "Ecosystem",
    oneLiner: "Every surface, one graph.",
    body: "Every module shares context through a single event stream — not exports, not tabs, not copy-paste.",
    icon: Network,
    screen: "/archio/screens/07-nexus.png",
    screenAlt: "Archio Nexus system graph",
  },
  {
    key: "community",
    title: "Community",
    oneLiner: "Rooms that earn their seat.",
    body: "Mentor stages with verified performance, curated war rooms and weekly gameplans. No noise subscriptions.",
    icon: Users,
    screen: "/archio/screens/09-communities.png",
    screenAlt: "Archio communities finder",
  },
  {
    key: "execution",
    title: "Execution",
    oneLiner: "One terminal, every broker.",
    body: "Trade Forge unifies IC Markets, FTMO, Pepperstone and more behind a single order ticket.",
    icon: Terminal,
    screen: "/archio/screens/12-execution-chart.png",
    screenAlt: "Archio Trade Forge execution terminal",
  },
  {
    key: "analysis",
    title: "Analysis",
    oneLiner: "Institutional-grade multi-timeframe.",
    body: "Structure, liquidity, sessions, macro and levels laid over the same chart your Cortex is reading.",
    icon: LineChart,
    screen: "/archio/screens/05-forecast.png",
    screenAlt: "Archio multi-timeframe chart analysis",
  },
  {
    key: "chat",
    title: "Chat",
    oneLiner: "Copilot that knows your book.",
    body: "Voice or text. The Cortex answers using your journal, your positions and your live market context.",
    icon: MessageSquare,
    screen: "/archio/screens/02-dashboard.png",
    screenAlt: "Archio Copilot chat in Your Space",
  },
  {
    key: "connection",
    title: "Connection",
    oneLiner: "Nexus wires every layer.",
    body: "A pub/sub routing layer so forecast, execution, psychology and journal stay in lock-step automatically.",
    icon: LinkIcon,
    screen: "/archio/screens/07-nexus.png",
    screenAlt: "Archio Nexus connection layer",
  },
  {
    key: "strategy",
    title: "Application of strategy",
    oneLiner: "Your playbook, enforced.",
    body: "Your rules live inside the OS. Violations are flagged before the order, not in next week&apos;s review.",
    icon: Target,
    screen: "/archio/screens/11-copilot-right-rail.png",
    screenAlt: "Archio Copilot — active patterns and rule adherence",
  },
  {
    key: "refining",
    title: "Refining",
    oneLiner: "Compound on what works.",
    body: "Recovery, Cooldown and Neural Feedback loops turn every losing streak into a measurable intervention.",
    icon: Wrench,
    screen: "/archio/screens/03-copilot-psychology.png",
    screenAlt: "Archio Neural Cortex — refinement surfaces",
  },
  {
    key: "journaling",
    title: "Journaling",
    oneLiner: "Auto-captured, annotated.",
    body: "Every trade, every session, every voice note — tagged, searchable, and linked to the forecast that fired it.",
    icon: NotebookPen,
    screen: "/archio/screens/10-history-journal.png",
    screenAlt: "Archio Your Space — overview and next moves",
  },
  {
    key: "oversight",
    title: "AI oversight",
    oneLiner: "The Cortex watches.",
    body: "11 analytics engines run in parallel on every decision. It sees revenge, cut-winners, size escalation before you do.",
    icon: Eye,
    screen: "/archio/screens/11-copilot-right-rail.png",
    screenAlt: "Archio Copilot oversight — severity and active patterns",
  },
  {
    key: "ai-lead",
    title: "AI lead",
    oneLiner: "Let it drive.",
    body: "Hand the wheel: the Cortex runs the SCAN → DIAGNOSE → UNDERSTAND → ACT → TRACK workflow for you.",
    icon: Compass,
    screen: "/archio/screens/04-copilot-stages.png",
    screenAlt: "Archio Copilot — pattern detection pipeline",
  },
  {
    key: "lead-ai",
    title: "Lead the AI",
    oneLiner: "You drive, it assists.",
    body: "Pick the framework, set depth, scope and tone. Guided Sessions follow your lead across 8 intelligence modes.",
    icon: Gamepad2,
    screen: "/archio/screens/04b-copilot-sessions.png",
    screenAlt: "Archio Copilot — guided sessions",
  },
]

export function PillarsScroller() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<Pillar | null>(null)

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Twelve pillars. One workflow.
          </h3>
          <p className="mt-2 max-w-xl text-[14.5px] text-white/55">
            Every layer of a trader&apos;s day gets its own surface — and every surface shares the same brain.
          </p>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 md:block">
          tap any pillar →
        </div>
      </div>

      <div
        className="relative -mx-6 overflow-x-auto px-6 pb-4 lg:-mx-8 lg:px-8"
        style={{ scrollbarWidth: "thin" }}
      >
        <ul className="flex min-w-max gap-3 snap-x snap-mandatory">
          {PILLARS.map((p, i) => (
            <li key={p.key} className="snap-start">
              <motion.button
                type="button"
                onClick={() => setOpen(p)}
                initial={reduce ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className="group relative h-[180px] w-[260px] overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0c0e15] to-[#07080c] p-5 text-left transition hover:border-cyan-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "radial-gradient(80% 60% at 50% 0%, rgba(34,211,238,0.09), transparent 55%)" }}
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <p.icon className="h-4 w-4 text-cyan-300" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div className="text-[15px] font-medium tracking-tight text-white">{p.title}</div>
                    <div className="mt-1 text-[12.5px] leading-snug text-white/55">{p.oneLiner}</div>
                  </div>
                  <div className="pointer-events-none absolute bottom-4 right-4 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-cyan-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md md:items-center"
            onClick={() => setOpen(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pillar-drawer-title"
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-3xl overflow-hidden rounded-t-3xl border border-white/10 bg-[#0a0b0f] p-6 md:rounded-3xl md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <open.icon className="h-4.5 w-4.5 text-cyan-300" />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">
                    {open.key}
                  </div>
                  <div id="pillar-drawer-title" className="text-xl font-semibold tracking-tight text-white">
                    {open.title}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_1.1fr]">
                <div>
                  <div className="text-[15.5px] leading-relaxed text-white/75">
                    {open.oneLiner}
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/55">
                    {open.body}
                  </p>
                </div>
                <DeviceFrame
                  src={open.screen}
                  alt={open.screenAlt}
                  variant="laptop"
                  aspect="aspect-[16/10]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
