"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { DeviceFrame } from "./DeviceFrame"
import { PAINS, SOLUTIONS, type PainId } from "./painMap"

interface Props {
  selected: PainId | null
}

/**
 * SolutionSection — Concept 4, the Personalized Solution.
 *
 * Exactly one panel renders at a time, driven by the `selected` pain id
 * lifted from PersonalizationSection above. When nothing is selected yet
 * we default softly to the revenge panel and surface a hint.
 */
export function SolutionSection({ selected }: Props) {
  const reduce = useReducedMotion()
  const active = selected ?? "revenge"
  const sol = SOLUTIONS[active]
  const activePain = PAINS.find((p) => p.id === active)

  return (
    <section
      id="system"
      aria-labelledby="solution-title"
      className="relative border-t border-white/[0.05] bg-[#07080c] py-24 sm:py-32"
    >
      {/* ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 10%, #6d4aff 0%, transparent 55%), radial-gradient(circle at 10% 90%, #22d3ee 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">
            04 · HERE&apos;S WHAT HAPPENS NEXT TIME
          </p>
          <h2
            id="solution-title"
            className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl"
          >
            Your answer, in real product.
            <br />
            <span className="text-white/55">
              {selected ? "Built for the pain you picked." : "Preview of the personalized answer."}
            </span>
          </h2>
          {!selected && (
            <p className="mt-5 max-w-2xl text-[13.5px] leading-relaxed text-white/45">
              <span className="text-cyan-300/90">Pick a pain above</span> to personalize this panel.
              Until then, here&apos;s the one we see the most often.
            </p>
          )}
        </div>

        <div className="mt-14 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.article
              key={sol.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
            >
              {/* copy */}
              <div className="lg:col-span-5">
                {activePain && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    Personalized for · {activePain.label}
                  </div>
                )}
                <h3 className="mt-5 text-balance text-[30px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[38px]">
                  {sol.title}
                </h3>
                <p className="mt-5 text-pretty text-[15.5px] leading-relaxed text-white/65">
                  {sol.body}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Live in the Cortex
                </div>
              </div>

              {/* visual */}
              <div className="lg:col-span-7">
                <DeviceFrame
                  src={sol.screenshot}
                  alt={sol.alt}
                  variant="laptop"
                  route="archio.app/cortex"
                  aspect="aspect-[16/10]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
