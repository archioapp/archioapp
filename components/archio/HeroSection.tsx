"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { ConvergenceField } from "./ConvergenceField"

/**
 * HeroSection — Concept 1, the Hook.
 *
 * Direct, founder-written headline. No rotating tagline. The convergence
 * visual on the right does the "one surface, one mind" argument — the
 * words focus purely on the emotional hook.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-24 md:min-h-[100svh]"
    >
      {/* base vignette + subtle cyan-violet wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(34,211,238,0.09), transparent 60%), radial-gradient(100% 100% at 80% 100%, rgba(109,74,255,0.06), transparent 62%), linear-gradient(180deg, #0a0b0f 0%, #07080b 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 80%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-24 md:min-h-[calc(100svh-6rem)] md:grid-cols-12 md:gap-10 md:pb-16 lg:px-8">
        {/* LEFT — hook */}
        <div className="md:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/65 backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            The Trading OS · Early access
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-sans text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl"
          >
            Stop losing money to
            <br />
            <span className="bg-gradient-to-br from-white via-white to-cyan-200 bg-clip-text text-transparent">
              your own brain.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg"
          >
            The first trading OS that sees your psychology, your edge, and your
            execution in one surface — and coaches you through the moments that
            actually move your curve.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#join"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-cyan-400 px-6 py-3 text-sm font-medium text-[#04121a] shadow-[0_10px_40px_-10px_rgba(34,211,238,0.6)] outline-none transition hover:bg-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0f]"
            >
              <Sparkles className="h-4 w-4" />
              Unlock your Cortex
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#magic"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-medium text-white/85 outline-none backdrop-blur transition hover:border-white/25 hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-white/30"
            >
              See it work
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40"
          >
            11 analytics engines · 5-stage workflow · one cortex
          </motion.p>
        </div>

        {/* RIGHT — convergence field */}
        <div className="md:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <ConvergenceField />
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#07080b]"
      />
    </section>
  )
}
