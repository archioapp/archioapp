"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

/**
 * CockpitClose
 * ----------------------------------------------------------------------------
 * The sign-off. Restates the thesis in one sentence, offers two exits:
 *   - primary: enter the rail (links to /forge or /cockpit demo when ready)
 *   - secondary: read the masterplan (links to /archio-brief anchor)
 * ----------------------------------------------------------------------------
 */
export function CockpitClose() {
  return (
    <section
      id="close"
      aria-labelledby="close-title"
      className="relative overflow-hidden py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 50%, rgba(212,175,55,0.08), transparent 70%), linear-gradient(180deg, #07080b 0%, #05060a 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
        }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/60"
        >
          <span className="h-1 w-1 rounded-full bg-[#d4af37]" />
          End of section · F02
        </motion.span>

        <motion.h2
          id="close-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[22ch] text-balance font-sans text-[clamp(40px,6vw,80px)] font-light leading-[1.02] tracking-[-0.03em] text-white"
        >
          This is <span className="italic text-[#e0b449]">the rail.</span>
          <br />
          Everything else <span className="text-white/40">supports it.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[56ch] text-[15px] leading-[1.7] text-white/60"
        >
          The masterplan has twelve more prompts in its queue. Each one inherits the five laws above and ships one more
          scaffold of the organism. The ambition is simple: bring order to the financial decisions of three hundred
          million traders, one rail at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5"
        >
          <Link
            href="/forecast"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#d4af37] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#07080b] transition hover:bg-[#e0b449]"
          >
            Enter the cockpit
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="/archio-brief.html"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.02] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-white transition hover:border-white/30"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Read the masterplan
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-white/30"
        >
          Analyze · Forecast · Execute — one thought held for three moments.
        </motion.p>
      </div>
    </section>
  )
}
