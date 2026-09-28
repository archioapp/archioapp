"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { COCKPIT_STAGES, type StageId } from "../cockpit-data"

/**
 * CockpitRail
 * ----------------------------------------------------------------------------
 * The centrepiece. Three stage cards side-by-side with animated photon flow
 * between them. Clicking a stage expands a detail panel below with the full
 * module list for that stage. The active card glows with its stage accent.
 *
 * Design rules:
 *   - Flexbox for layout (spec compliant)
 *   - One accent per stage (cyan / amber / rose) — stays within 3–5 total
 *   - No gradient backgrounds; only thin accent borders and accent text
 *   - Hover subtly lifts the card; active stays up
 * ----------------------------------------------------------------------------
 */
export function CockpitRail() {
  const [active, setActive] = useState<StageId>("analyze")
  const activeStage = COCKPIT_STAGES.find((s) => s.id === active)!

  return (
    <section
      id="rail"
      aria-labelledby="rail-title"
      className="relative py-28"
    >
      {/* Section ambience */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, rgba(255,255,255,0.03), transparent 80%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
              § 02 · The rail
            </span>
            <h2
              id="rail-title"
              className="max-w-[22ch] text-balance font-sans text-[clamp(28px,4vw,48px)] font-light leading-[1.08] tracking-[-0.02em] text-white"
            >
              Three stages. In explicit sequence. Nothing is skipped.
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-[1.7] text-white/55">
            Click a stage below to inspect its modules. The stages always run in order — Stage III will refuse to arm
            without its upstream state. This is how discipline becomes architecture.
          </p>
        </motion.header>

        {/* THE RAIL — three stage cards with arrow photons between */}
        <div className="relative flex flex-col items-stretch gap-4 lg:flex-row lg:items-stretch lg:gap-0">
          {COCKPIT_STAGES.map((stage, i) => (
            <div key={stage.id} className="flex flex-1 flex-col lg:flex-row lg:items-stretch">
              <StageCard
                stage={stage}
                isActive={active === stage.id}
                onSelect={() => setActive(stage.id)}
              />
              {i < COCKPIT_STAGES.length - 1 && (
                <StageArrow
                  fromAccent={stage.accent.ink}
                  toAccent={COCKPIT_STAGES[i + 1].accent.ink}
                />
              )}
            </div>
          ))}
        </div>

        {/* DETAIL PANEL — expands below with module list for active stage */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-[#07080b]"
            >
              {/* Accent glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(60% 60% at 0% 0%, ${activeStage.accent.ink}14, transparent 70%)`,
                }}
              />

              <div className="relative grid grid-cols-1 gap-10 p-8 md:p-10 lg:grid-cols-[0.6fr_1fr]">
                {/* Left — stage rationale */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.24em]"
                      style={{ color: activeStage.accent.ink }}
                    >
                      Stage {activeStage.position} · {activeStage.sub}
                    </span>
                  </div>
                  <h3 className="font-sans text-[32px] font-light leading-[1.05] tracking-[-0.02em] text-white">
                    {activeStage.verb}.
                  </h3>
                  <p className="font-sans italic text-[15px] leading-[1.55] text-white/80">
                    {activeStage.question}
                  </p>
                  <p className="text-[13.5px] leading-[1.7] text-white/60">{activeStage.rationale}</p>
                  <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                    <span>{activeStage.modules.length} modules</span>
                    <span>·</span>
                    <span style={{ color: activeStage.accent.ink }}>
                      {activeStage.modules.filter((m) => m.isNew).length} new
                    </span>
                  </div>
                </div>

                {/* Right — module grid */}
                <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/5 sm:grid-cols-2 xl:grid-cols-3">
                  {activeStage.modules.map((m, i) => (
                    <motion.div
                      key={m.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                      className="group relative flex flex-col gap-1.5 bg-[#07080b] p-4 transition-colors hover:bg-[#0b0d12]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium leading-[1.2] text-white">{m.name}</span>
                        {m.isNew && (
                          <span
                            className="rounded-sm px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.15em]"
                            style={{
                              background: `${activeStage.accent.ink}22`,
                              color: activeStage.accent.ink,
                            }}
                          >
                            new
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] leading-[1.4] text-white/40">{m.hint}</span>
                      <span
                        aria-hidden
                        className="absolute bottom-0 left-4 right-4 h-px origin-left scale-x-0 bg-gradient-to-r from-current to-transparent opacity-50 transition-transform duration-300 group-hover:scale-x-100"
                        style={{ color: activeStage.accent.ink }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* StageCard — one of three cards on the rail                                  */
/* -------------------------------------------------------------------------- */

function StageCard({
  stage,
  isActive,
  onSelect,
}: {
  stage: (typeof COCKPIT_STAGES)[number]
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className="group relative flex flex-1 flex-col items-start gap-5 overflow-hidden rounded-xl border bg-[#07080b] p-7 text-left transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      style={{
        borderColor: isActive ? stage.accent.ink : "rgba(255,255,255,0.10)",
        boxShadow: isActive ? `0 0 0 1px ${stage.accent.ink}44, 0 40px 80px -40px ${stage.accent.ink}55` : "none",
      }}
    >
      {/* Top accent bar */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] origin-left transition-transform duration-500"
        style={{
          background: `linear-gradient(90deg, ${stage.accent.ink}, transparent)`,
          transform: isActive ? "scaleX(1)" : "scaleX(0.25)",
        }}
      />
      {/* Corner glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(50% 50% at 100% 0%, ${stage.accent.ink}1a, transparent 70%)`,
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Position ribbon */}
      <span
        className="relative z-[1] rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em]"
        style={{
          color: stage.accent.ink,
          background: isActive ? `${stage.accent.ink}18` : "transparent",
          border: `1px solid ${stage.accent.ink}55`,
        }}
      >
        Stage {stage.position}
      </span>

      {/* Sub label */}
      <span className="relative z-[1] font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
        {stage.sub}
      </span>

      {/* Verb — the big word */}
      <h3
        className="relative z-[1] font-sans text-[clamp(36px,4.2vw,56px)] font-light leading-[0.95] tracking-[-0.025em] text-white"
      >
        {stage.verb}.
      </h3>

      {/* Lede */}
      <p className="relative z-[1] max-w-[34ch] text-[13.5px] leading-[1.6] text-white/60">{stage.lede}</p>

      {/* Footer */}
      <div className="relative z-[1] mt-auto flex w-full items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
        <span>{stage.modules.length} modules</span>
        <span className="flex items-center gap-1 transition-colors" style={{ color: isActive ? stage.accent.ink : undefined }}>
          {isActive ? "active" : "inspect"}
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* StageArrow — photon flow between stages (horizontal on desktop)             */
/* -------------------------------------------------------------------------- */

function StageArrow({ fromAccent, toAccent }: { fromAccent: string; toAccent: string }) {
  return (
    <div
      aria-hidden
      className="relative flex shrink-0 items-center justify-center lg:mx-2 lg:w-10"
    >
      {/* Mobile: vertical dashed line */}
      <div className="flex h-10 items-center justify-center lg:hidden">
        <div className="h-full w-px bg-gradient-to-b from-white/20 to-white/5" />
      </div>

      {/* Desktop: horizontal rail with moving photon */}
      <div className="relative hidden h-px w-full lg:flex lg:items-center">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${fromAccent}66, ${toAccent}66)`,
            opacity: 0.4,
          }}
        />
        <motion.span
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            top: "50%",
            background: toAccent,
            boxShadow: `0 0 12px 3px ${toAccent}66`,
            y: "-50%",
          }}
          animate={{ left: ["-4%", "104%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 0.6 }}
        />
      </div>
    </div>
  )
}
