"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { COCKPIT_FLOW } from "../cockpit-data"

/**
 * CockpitFlow
 * ----------------------------------------------------------------------------
 * A scroll-driven day-in-the-life narrative: Marco, GBP/USD, 13 minutes
 * across three stages. Each step reveals on scroll with its timestamp,
 * stage badge, headline, body, and confluence tags.
 *
 * A vertical progress line on the left fills as the reader scrolls.
 * ----------------------------------------------------------------------------
 */
export function CockpitFlow() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  // Progress line height, from 0 → 100%
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section
      id="flow"
      aria-labelledby="flow-title"
      className="relative py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
              § 04 · Unified flow
            </span>
            <h2
              id="flow-title"
              className="max-w-[22ch] text-balance font-sans text-[clamp(28px,4vw,48px)] font-light leading-[1.08] tracking-[-0.02em] text-white"
            >
              One session, one trade. <span className="italic text-[#e0b449]">Thirteen minutes</span> across three stages.
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-[1.7] text-white/55">
            Marco trades GBP/USD. Seven moments. The same state object carried end to end — from a chart reading at
            09:14 to a replayable record at 11:12.
          </p>
        </motion.header>

        <div ref={containerRef} className="relative grid grid-cols-[48px_1fr] gap-6 md:grid-cols-[120px_1fr] md:gap-10">
          {/* Progress rail on the left */}
          <div aria-hidden className="relative">
            <div className="sticky top-24 flex h-[calc(100svh-12rem)] justify-center">
              <div className="relative h-full w-px bg-white/10">
                <motion.div
                  className="absolute inset-x-0 top-0 origin-top"
                  style={{
                    height: progressHeight,
                    background: "linear-gradient(180deg, transparent, #d4af37 25%, #d4af37 80%, transparent)",
                    boxShadow: "0 0 14px 3px rgba(212,175,55,0.35)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol className="flex flex-col gap-16 md:gap-24">
            {COCKPIT_FLOW.map((step, i) => (
              <FlowStep key={step.time + step.headline} step={step} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* FlowStep                                                                    */
/* -------------------------------------------------------------------------- */

function FlowStep({
  step,
  index,
}: {
  step: (typeof COCKPIT_FLOW)[number]
  index: number
}) {
  const ref = useRef<HTMLLIElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 20%"],
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1])
  const y = useTransform(scrollYProgress, [0, 1], [24, 0])

  const stageColor = step.stage.includes("I →") || step.stage.includes("II →")
    ? "#d4af37"
    : step.stage.includes("I ")
      ? "#22d3ee"
      : step.stage.includes("II")
        ? "#e0b449"
        : step.stage.includes("III")
          ? "#fb7185"
          : "rgba(255,255,255,0.5)"

  return (
    <motion.li
      ref={ref}
      style={{ opacity, y }}
      className="group relative flex flex-col gap-4 md:gap-5"
    >
      {/* Top meta row */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-[24px] font-light leading-none tracking-[-0.02em] text-white/90">
          {step.time}
        </span>
        <span
          className="rounded-sm px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.22em]"
          style={{ color: stageColor, border: `1px solid ${stageColor}55` }}
        >
          {step.stage}
        </span>
        <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/30 md:inline">
          step · {String(index + 1).padStart(2, "0")} of {String(COCKPIT_FLOW.length).padStart(2, "0")}
        </span>
      </div>

      {/* Headline */}
      <h3 className="max-w-[32ch] text-balance font-sans text-[clamp(22px,2.8vw,34px)] font-light leading-[1.1] tracking-[-0.02em] text-white">
        {step.headline}
      </h3>

      {/* Body */}
      <p className="max-w-[68ch] text-[14.5px] leading-[1.7] text-white/60">{step.body}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-1">
        {step.tags.map((t) => (
          <span
            key={t.label}
            className="rounded-sm px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em]"
            style={{
              color: t.hot ? "#d4af37" : "rgba(255,255,255,0.55)",
              border: t.hot ? "1px solid rgba(212,175,55,0.55)" : "1px solid rgba(255,255,255,0.12)",
              background: t.hot ? "rgba(212,175,55,0.05)" : "transparent",
            }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </motion.li>
  )
}
