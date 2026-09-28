"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useState } from "react"
import { GraduationCap, TrendingUp, Crown, ArrowRight } from "lucide-react"
import { DeviceFrame } from "./DeviceFrame"

/* -----------------------------------------------------------
   Pathways — three tabs, each revealing a tailored pitch
   with two real product screenshots.
------------------------------------------------------------- */

type PathKey = "learn" | "grow" | "lead"

type Path = {
  icon: React.ElementType
  label: string
  caption: string
  heading: string
  subheading: string
  bullets: [string, string, string]
  primary: { src: string; alt: string; route?: string }
  secondary: { src: string; alt: string }
}

const PATHS: Record<PathKey, Path> = {
  learn: {
    icon: GraduationCap,
    label: "I'm learning to trade",
    caption: "Foundation",
    heading: "Learn inside a system, not a Discord.",
    subheading:
      "Structured execution, curated mentor rooms and a journal that teaches you your own patterns. No overwhelm. No fake gurus.",
    bullets: [
      "Guided Cortex sessions that walk you through one concept at a time",
      "Curated mentor rooms with verifiable track records, not screenshots",
      "Weekly psychology review so you see your real progress",
    ],
    primary: {
      src: "/archio/screens/04b-copilot-sessions.png",
      alt: "Archio Guided Sessions — step-by-step Cortex coaching for new traders.",
      route: "archio.app/copilot",
    },
    secondary: {
      src: "/archio/screens/09-communities.png",
      alt: "Archio Communities finder.",
    },
  },
  grow: {
    icon: TrendingUp,
    label: "I'm growing as a trader",
    caption: "Operator",
    heading: "Run a professional desk, solo.",
    subheading:
      "A command-driven execution terminal, probabilistic AI, catalysts and an automatic journal — all wired together so you stay in the trade, not the tabs.",
    bullets: [
      "Multi-asset terminal with confluence and liquidity overlays",
      "AI forecast engine that grades every setup you take",
      "Automatic journaling + psychology tags close the loop",
    ],
    primary: {
      src: "/archio/screens/12-execution-chart.png",
      alt: "Archio Trade Forge — unified execution chart with multi-broker accounts.",
      route: "archio.app/execute",
    },
    secondary: {
      src: "/archio/screens/03-copilot-psychology.png",
      alt: "Archio Neural Cortex — live psychology score.",
    },
  },
  lead: {
    icon: Crown,
    label: "I lead or mentor traders",
    caption: "Ecosystem",
    heading: "Run your room. Keep your signal. Own your economics.",
    subheading:
      "A mentor and operator layer with transparent performance, a room you control, and an ecosystem that rewards the value you actually create.",
    bullets: [
      "Curated mentor rooms with verifiable performance, visible drawdowns",
      "Shared watchlists, gameplans and whale-room broadcasts",
      "Transparent economic layer — your room, your terms, your data",
    ],
    primary: {
      src: "/archio/screens/06-intelligence.png",
      alt: "Archio Whale Room — Daily Gameplan, Weekly Outlook and Macro Drivers.",
      route: "archio.app/communities",
    },
    secondary: {
      src: "/archio/screens/08-hub.png",
      alt: "Archio Forecast Hub — analyst leaderboard and active calls.",
    },
  },
}

export function PathwaysSection() {
  const [active, setActive] = useState<PathKey>("grow")
  const reduced = useReducedMotion()
  const data = PATHS[active]

  return (
    <section id="pathways" className="relative px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            06 · Pathways
          </div>
          <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[44px]">
            Choose your path.
            <br />
            The system adapts.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/55 md:text-[16px]">
            Archio works differently depending on who you are. Select where you stand today.
          </p>
        </div>

        {/* Tab strip */}
        <div role="tablist" aria-label="Pathways" className="mb-6 flex flex-wrap gap-2 md:mb-8">
          {(Object.keys(PATHS) as PathKey[]).map((k) => {
            const p = PATHS[k]
            const on = active === k
            return (
              <button
                key={k}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(k)}
                className={`group relative flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] transition-all ${
                  on
                    ? "border-cyan-400/40 bg-cyan-400/[0.08] text-white"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                <p.icon className={`h-3.5 w-3.5 ${on ? "text-cyan-300" : "text-white/50"}`} />
                <span>{p.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content panel */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#0a0d18]/95 to-[#070a12]/95 p-6 md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 90% 0%, rgba(34,211,238,0.08), transparent 55%)",
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid gap-10 md:grid-cols-[1.05fr_1.1fr] md:gap-12"
            >
              {/* copy */}
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300/80">
                  {data.caption}
                </div>
                <h3 className="mt-3 text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.01em] text-white md:text-[34px]">
                  {data.heading}
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/60 md:text-[15.5px]">
                  {data.subheading}
                </p>

                <ul className="mt-6 space-y-3">
                  {data.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/70">
                      <span className="mt-1.5 h-1 w-3 rounded-full bg-cyan-400/70" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a
                    href="#join"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-[#05070f] transition-colors hover:bg-cyan-200"
                  >
                    Request access for this path
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* visuals */}
              <div className="relative">
                <div className="relative">
                  <DeviceFrame
                    src={data.primary.src}
                    alt={data.primary.alt}
                    variant="laptop"
                    route={data.primary.route}
                    aspect="aspect-[16/10]"
                    sizes="(max-width: 768px) 90vw, 45vw"
                    className="shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
                  />
                  <div className="pointer-events-none absolute -bottom-10 -right-6 hidden w-[54%] md:block">
                    <DeviceFrame
                      src={data.secondary.src}
                      alt={data.secondary.alt}
                      variant="bare"
                      aspect="aspect-[16/10]"
                      sheen={false}
                      sizes="(max-width: 768px) 40vw, 25vw"
                      className="border-white/10 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.95)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
