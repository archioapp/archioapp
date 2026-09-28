"use client"

import { motion } from "framer-motion"
import { COCKPIT_PRINCIPLES } from "../cockpit-data"

/**
 * CockpitPrinciples
 * ----------------------------------------------------------------------------
 * Five immovable laws. Rendered as a single horizontal ledger row with the
 * index in mono, the name in editorial weight, the line in soft body.
 * On scroll-in, each law reveals with a subtle stagger.
 * ----------------------------------------------------------------------------
 */
export function CockpitPrinciples() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-title"
      className="relative border-y border-white/5 py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
              § 01 · Immovable laws
            </span>
            <h2
              id="principles-title"
              className="max-w-[22ch] text-balance font-sans text-[clamp(28px,4vw,48px)] font-light leading-[1.08] tracking-[-0.02em] text-white"
            >
              Five laws the product obeys before any feature does.
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-[1.7] text-white/55">
            Every decision from Stage I wireframes to L6 infrastructure must pass these five tests. If a feature breaks
            one of them, the feature is wrong — not the law.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/5 md:grid-cols-5">
          {COCKPIT_PRINCIPLES.map((p, i) => (
            <motion.article
              key={p.index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col gap-3 bg-[#07080b] p-5 transition-colors hover:bg-[#0a0c12]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">{p.index}</span>
              <h3 className="font-sans text-[17px] font-medium leading-[1.2] text-white">{p.name}</h3>
              <p className="text-[12.5px] leading-[1.6] text-white/55">{p.line}</p>
              <span
                aria-hidden
                className="absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#d4af37]/80 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
