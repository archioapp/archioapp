"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { COCKPIT_ECOSYSTEM } from "../cockpit-data"

/**
 * CockpitEcosystem
 * ----------------------------------------------------------------------------
 * The organism. Six layers, from the act of trading (L1) out to the
 * infrastructure it lives on (L6). Rendered as a stacked interactive
 * stratigraphy — the reader hovers a layer to elevate it, its detail panel
 * replaces the default on the right.
 *
 * Principle: the cockpit is NOT the product — it is the heart of a six-layer
 * organism. This section makes that fact undeniable.
 * ----------------------------------------------------------------------------
 */
export function CockpitEcosystem() {
  const [active, setActive] = useState(COCKPIT_ECOSYSTEM[0].index)
  const activeLayer = COCKPIT_ECOSYSTEM.find((l) => l.index === active)!

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="relative border-y border-white/5 py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(34,211,238,0.04), transparent 80%)",
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
              § 05 · The organism
            </span>
            <h2
              id="ecosystem-title"
              className="max-w-[22ch] text-balance font-sans text-[clamp(28px,4vw,48px)] font-light leading-[1.08] tracking-[-0.02em] text-white"
            >
              The Cockpit is the heart. <span className="italic text-[#e0b449]">Six layers</span> hold it alive.
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-[1.7] text-white/55">
            From the trade itself (L1) out to the ground it runs on (L6). Every layer below exists so the layer above
            it can be a product, not a promise.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Stack */}
          <ul className="flex flex-col border border-white/10 bg-[#07080b]">
            {COCKPIT_ECOSYSTEM.map((layer) => {
              const isActive = active === layer.index
              return (
                <li key={layer.index}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(layer.index)}
                    onFocus={() => setActive(layer.index)}
                    onClick={() => setActive(layer.index)}
                    aria-pressed={isActive}
                    className="group relative flex w-full items-center gap-5 border-b border-white/5 px-6 py-5 text-left transition-colors last:border-b-0 hover:bg-white/[0.03] focus:bg-white/[0.03] focus:outline-none"
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300"
                      style={{
                        color: isActive ? "#d4af37" : "rgba(255,255,255,0.55)",
                        borderColor: isActive ? "#d4af37" : "rgba(255,255,255,0.15)",
                        background: isActive ? "rgba(212,175,55,0.06)" : "transparent",
                      }}
                    >
                      {layer.index}
                    </span>
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="font-sans text-[17px] font-medium leading-[1.2] text-white">{layer.name}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                        {layer.role}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="h-px w-10 transition-all duration-300"
                      style={{
                        background: isActive ? "#d4af37" : "rgba(255,255,255,0.15)",
                        width: isActive ? "56px" : "24px",
                      }}
                    />
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Detail panel */}
          <motion.article
            key={activeLayer.index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-[#07080b] p-10"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 60% at 100% 0%, rgba(212,175,55,0.08), transparent 70%)",
              }}
            />

            <div className="relative z-[1] flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d4af37]">
                  {activeLayer.index} · the organism
                </span>
              </div>
              <h3 className="font-sans text-[38px] font-light leading-[1.05] tracking-[-0.02em] text-white">
                {activeLayer.name}.
              </h3>
              <p className="font-sans italic text-[15px] leading-[1.55] text-white/75">{activeLayer.role}</p>
              <p className="max-w-[52ch] text-[14px] leading-[1.7] text-white/60">{activeLayer.description}</p>
            </div>

            {/* Surfaces */}
            <div className="relative z-[1] mt-10 border-t border-white/10 pt-6">
              <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                Surfaces in this layer
              </span>
              <div className="flex flex-wrap gap-2">
                {activeLayer.surfaces.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm border border-white/15 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-[#d4af37]/60 hover:text-[#d4af37]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
