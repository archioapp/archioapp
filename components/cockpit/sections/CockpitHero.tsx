"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown } from "lucide-react"

/**
 * CockpitHero
 * ----------------------------------------------------------------------------
 * The opening statement. Establishes tone in three beats:
 *   1. Rail sigil at top (mono chip with live pulse)
 *   2. Editorial headline with amber emphasis on the three verbs
 *   3. A live "spine" strip that visualises the five state objects
 *
 * No bloat, no stock hero imagery. Everything on screen is the idea itself.
 * ----------------------------------------------------------------------------
 */
export function CockpitHero() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="hero"
      aria-labelledby="cockpit-title"
      className="relative isolate overflow-hidden pt-32 md:min-h-[100svh] md:pt-36"
    >
      {/* Ambient field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(100% 70% at 50% 0%, rgba(34,211,238,0.10), transparent 60%), radial-gradient(80% 80% at 80% 90%, rgba(212,175,55,0.06), transparent 62%), linear-gradient(180deg, #05060a 0%, #07080b 100%)",
        }}
      />
      {/* Hairline grid with radial mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 80%)",
        }}
      />

      <div className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center gap-16 px-6 pb-24 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/65 backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
          F02 · The Cockpit · One Rail
        </motion.div>

        {/* Headline */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <motion.h1
            id="cockpit-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[18ch] text-balance font-sans text-[clamp(44px,7vw,96px)] font-light leading-[1.02] tracking-[-0.035em] text-white"
          >
            <span className="text-white/40">Three acts.</span>
            <br />
            <EmphasisCycle />
            <br />
            <span className="text-white">One cockpit.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md"
          >
            <p className="text-pretty font-sans text-[15px] leading-[1.7] text-white/70">
              Analysis, forecast, and execution are the same thought, held for three different moments of time. The
              Cockpit is the first product built to honour that — one rail, three stages,{" "}
              <span className="text-white">one spine of state</span> that survives every handoff between the thinking
              and the doing.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#rail"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white transition hover:border-white/30 hover:bg-white/[0.08]"
              >
                Enter the rail
                <ArrowDown className="h-3.5 w-3.5 transition group-hover:translate-y-0.5" />
              </a>
              <a
                href="#spine"
                className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/55 transition hover:text-white/90"
              >
                See the spine →
              </a>
            </div>
          </motion.div>
        </div>

        {/* Live hero spine strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
            <span>The spine · live</span>
            <span className="hidden sm:inline">thesis · confluence · risk · cortex · verdict</span>
          </div>
          <div className="relative h-[72px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
            <SpineTrack prefersReducedMotion={!!prefersReducedMotion} />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/35">
            <span>analyze</span>
            <span>forecast</span>
            <span>execute</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Emphasis — cycles Analyze / Forecast / Execute with gold underline          */
/* -------------------------------------------------------------------------- */

function EmphasisCycle() {
  return (
    <span className="relative inline-block">
      <span
        className="relative z-[1] italic"
        style={{
          background: "linear-gradient(90deg, #e0b449 0%, #d4af37 50%, #a97142 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Analyze · Forecast · Execute.
      </span>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/80 to-transparent"
      />
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* SpineTrack — five static nodes with a glowing photon looping through        */
/* -------------------------------------------------------------------------- */

function SpineTrack({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const nodes = ["thesis", "confluence", "risk", "cortex", "verdict"]

  return (
    <div className="relative flex h-full w-full items-center">
      {/* Connecting line */}
      <div
        aria-hidden
        className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      {/* Photon */}
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 6,
            height: 6,
            background: "#d4af37",
            boxShadow: "0 0 18px 4px rgba(212,175,55,0.55)",
          }}
          animate={{ left: ["6%", "94%"] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
            repeatDelay: 0.4,
          }}
        />
      )}
      {/* Nodes */}
      <div className="relative z-[2] flex w-full items-center justify-between px-6">
        {nodes.map((n, i) => (
          <div key={n} className="flex flex-col items-center gap-2">
            <span
              className="h-2 w-2 rounded-full border border-white/30 bg-[#07080b]"
              style={{
                boxShadow: i === 2 ? "0 0 0 3px rgba(212,175,55,0.12)" : undefined,
              }}
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">{n}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
