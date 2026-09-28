"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Brain, Activity, Layers, ShieldCheck } from "lucide-react"
import { DeviceFrame } from "./DeviceFrame"
import { PillarsScroller } from "./PillarsScroller"

/**
 * BrainSpotlightSection — the emotional centerpiece.
 *
 * Dedicates a full band to the Psychology OS. This is the "trading buddy
 * with a brain" pitch: an anatomical Cortex that sees every other module
 * and coaches the trader in real time.
 */

const STAGES = [
  { k: "01", name: "SCAN" },
  { k: "02", name: "DIAGNOSE" },
  { k: "03", name: "UNDERSTAND" },
  { k: "04", name: "ACT" },
  { k: "05", name: "TRACK" },
] as const

const ENGINES = [
  "EmotionalTopology",
  "PersonalityProfiler",
  "BiasesDetector",
  "CrossLayer",
  "CauseEffect",
  "EmotionChapters",
  "Recovery",
  "Cooldown",
  "NeuralFeedback",
  "ScoreEvolution",
  "Journal",
]

export function BrainSpotlightSection() {
  const reduce = useReducedMotion()

  return (
    <section
      id="brain"
      aria-labelledby="brain-title"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      {/* ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(34,211,238,0.06), transparent 60%), radial-gradient(80% 60% at 50% 100%, rgba(109,74,255,0.06), transparent 70%), linear-gradient(180deg, #07080b, #05060a)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* eyebrow */}
        <div className="flex items-center justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
            03 · The Brain
          </div>
          <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/70 md:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            Psychology OS · live
          </div>
        </div>

        {/* heading + layout */}
        <div className="mt-6 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT: laptop-framed Cortex screenshot */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-10 -z-10 rounded-[32px]"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 40%, rgba(34,211,238,0.20), transparent 65%)",
                  filter: "blur(24px)",
                }}
              />
              <DeviceFrame
                src="/archio/screens/03-copilot-psychology.png"
                alt="Archio Psychology OS — anatomical Neural Cortex with Logic and Limbic hemispheres and interactive Neural Topology"
                variant="laptop"
                aspect="aspect-[16/10]"
                route="/copilot"
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="border-white/10 shadow-[0_40px_100px_-30px_rgba(34,211,238,0.25)]"
              />
              {/* stage rail overlay pill */}
              <div className="absolute -left-4 top-8 hidden rounded-xl border border-white/10 bg-[#0a0b0f]/80 p-2 backdrop-blur-md md:block">
                <div className="flex flex-col gap-1.5">
                  {STAGES.map((s, i) => (
                    <div
                      key={s.k}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${
                        i === 0 ? "bg-cyan-400/10 text-cyan-300" : "text-white/45"
                      }`}
                    >
                      <span className="w-4 opacity-60">{s.k}</span>
                      <span>{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* supporting sub-screenshot */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 grid grid-cols-2 gap-4"
            >
              <DeviceFrame
                src="/archio/screens/04-copilot-stages.png"
                alt="Archio Copilot — Pattern Detection behavioral streams pipeline"
                variant="bare"
                aspect="aspect-[16/10]"
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="border-white/10"
              />
              <DeviceFrame
                src="/archio/screens/04b-copilot-sessions.png"
                alt="Archio Copilot — Guided Sessions engine architecture"
                variant="bare"
                aspect="aspect-[16/10]"
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="border-white/10"
              />
            </motion.div>
          </motion.div>

          {/* RIGHT: copy */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <h2
              id="brain-title"
              className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl"
            >
              A brain that sees{" "}
              <span className="bg-gradient-to-br from-white via-white to-cyan-200 bg-clip-text text-transparent">
                every module,
              </span>{" "}
              and coaches in real time.
            </h2>
            <p className="mt-5 text-pretty text-[15.5px] leading-relaxed text-white/65">
              Archio&apos;s Psychology OS is the Cortex. An anatomical view of
              your Logic and Limbic hemispheres, an interactive Neural
              Topology of every trading trait, and a five-stage workflow
              that moves you from noticing a pattern to actually breaking it —
              before the trade is already live.
            </p>

            <ul className="mt-8 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                  <Brain className="h-3.5 w-3.5 text-cyan-300" />
                </span>
                <span className="text-[14.5px] leading-relaxed text-white/75">
                  <span className="text-white">Anatomical Cortex view</span> —
                  hemispheres, cerebellum, sulci. The brain looks like a brain,
                  not a dashboard icon.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                  <Activity className="h-3.5 w-3.5 text-cyan-300" />
                </span>
                <span className="text-[14.5px] leading-relaxed text-white/75">
                  <span className="text-white">11 analytics engines</span> —
                  Emotional Topology, Personality Profiler, Biases Detector,
                  Cross-Layer, Cause-Effect, Recovery, Cooldown and more,
                  running in parallel on every trade.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                  <Layers className="h-3.5 w-3.5 text-cyan-300" />
                </span>
                <span className="text-[14.5px] leading-relaxed text-white/75">
                  <span className="text-white">5-stage workflow</span> — SCAN,
                  DIAGNOSE, UNDERSTAND, ACT, TRACK. A sticky rail keeps you
                  moving from insight to behavior change.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                </span>
                <span className="text-[14.5px] leading-relaxed text-white/75">
                  <span className="text-white">Intervention Verdict</span> —
                  the Cortex issues a STOP, REDUCE or CONTINUE call before
                  you execute, grounded in your own historical patterns.
                </span>
              </li>
            </ul>

            {/* engines chip row */}
            <div className="mt-8 flex flex-wrap gap-1.5">
              {ENGINES.map((e) => (
                <span
                  key={e}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/60"
                >
                  {e}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#join"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-medium text-[#04121a] transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              >
                Join early access
              </a>
              <a
                href="#pillars"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2.5 text-sm text-white/80 transition hover:border-white/25 hover:bg-white/[0.05]"
              >
                Tour the 12 pillars
              </a>
            </div>
          </motion.div>
        </div>

        {/* 12 pillars mini-scroller lives directly below the Brain */}
        <div id="pillars" className="mt-24">
          <PillarsScroller />
        </div>
      </div>
    </section>
  )
}
