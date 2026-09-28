"use client"

import { motion, useReducedMotion } from "framer-motion"
import { COCKPIT_SPINE } from "../cockpit-data"

/**
 * CockpitSpine
 * ----------------------------------------------------------------------------
 * The five state objects that survive every handoff between stages. Rendered
 * as a horizontal rail of five nodes with a photon continuously travelling
 * through them left-to-right. Each node has name · role · description.
 *
 * This visualises the single most important invariant of the product:
 * one record, five fields, carried end-to-end.
 * ----------------------------------------------------------------------------
 */
export function CockpitSpine() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="spine"
      aria-labelledby="spine-title"
      className="relative border-y border-white/5 py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 50%, rgba(212,175,55,0.05), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
              § 03 · The spine
            </span>
            <h2
              id="spine-title"
              className="max-w-[22ch] text-balance font-sans text-[clamp(28px,4vw,48px)] font-light leading-[1.08] tracking-[-0.02em] text-white"
            >
              Five state objects. <span className="italic text-[#e0b449]">One record.</span> Survives every handoff.
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-[1.7] text-white/55">
            The spine is what makes the three stages one feature and not three pages. It is written once, enriched
            across the stages, and audited before the order leaves.
          </p>
        </motion.header>

        {/* The photon rail */}
        <div className="relative">
          {/* Background line */}
          <div
            aria-hidden
            className="absolute left-4 right-4 top-[22px] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:top-[28px]"
          />

          {/* Photon travelling end-to-end */}
          {!prefersReducedMotion && (
            <motion.span
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 8,
                height: 8,
                top: "22px",
                marginTop: -4,
                background: "#d4af37",
                boxShadow: "0 0 22px 5px rgba(212,175,55,0.55)",
              }}
              animate={{ left: ["2%", "98%"] }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
                repeatDelay: 0.4,
              }}
            />
          )}

          {/* Five nodes */}
          <div className="relative grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-0">
            {COCKPIT_SPINE.map((node, i) => (
              <motion.article
                key={node.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-4 px-3 text-center"
              >
                {/* Node dot */}
                <span
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#07080b] font-mono text-[10px] uppercase tracking-[0.2em] text-white/55"
                  style={{
                    boxShadow:
                      node.originStage === "all"
                        ? "0 0 0 4px rgba(212,175,55,0.06), inset 0 0 0 1px rgba(212,175,55,0.2)"
                        : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  0{i + 1}
                </span>

                <div className="flex flex-col items-center gap-1">
                  <h3 className="font-sans text-[18px] font-medium leading-[1.1] text-white">
                    <span className="italic text-[#e0b449]">{node.label}</span>
                  </h3>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/40">{node.role}</p>
                </div>

                <p className="max-w-[24ch] text-[12px] leading-[1.55] text-white/60">{node.description}</p>

                <span
                  className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em]"
                  style={{
                    color:
                      node.originStage === "analyze"
                        ? "#22d3ee"
                        : node.originStage === "forecast"
                          ? "#e0b449"
                          : node.originStage === "execute"
                            ? "#fb7185"
                            : "rgba(255,255,255,0.4)",
                  }}
                >
                  {node.originStage === "all" ? "live · all stages" : `origin · ${node.originStage}`}
                </span>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Footer caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 text-center text-[13px] leading-[1.7] text-white/40"
        >
          Every pixel you see on the rail above reads from — and writes to — this spine. The chart does not forget. The
          thesis does not forget. The discipline does not forget.
        </motion.p>
      </div>
    </section>
  )
}
