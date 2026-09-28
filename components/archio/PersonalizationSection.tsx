"use client"

import { motion, useReducedMotion } from "framer-motion"
import { PAINS, SEVERITY_CLASS, type PainId } from "./painMap"

interface Props {
  selected: PainId | null
  onSelect: (id: PainId) => void
}

/**
 * PersonalizationSection — "What breaks you?"
 *
 * Six clickable pain tiles. The chosen tile lifts into shared landing-page
 * state and drives the personalized SolutionSection directly below.
 */
export function PersonalizationSection({ selected, onSelect }: Props) {
  const reduce = useReducedMotion()

  return (
    <section
      id="personalize"
      aria-labelledby="personalize-title"
      className="relative border-t border-white/[0.05] bg-[#07080c] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">
            03 · WHAT BREAKS YOU?
          </p>
          <h2
            id="personalize-title"
            className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl"
          >
            Pick the one that hurts.
            <br />
            <span className="text-white/55">The rest of this page rewrites itself.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/55">
            Archio doesn&apos;t coach everyone the same way. Choose the pattern that keeps
            costing you, and the next section will show you — in real product — how the
            Cortex intercepts it.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Pick your primary trading problem"
          className="mt-12 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3"
        >
          {PAINS.map((p, i) => {
            const isActive = selected === p.id
            const sev = SEVERITY_CLASS[p.severity]
            const Icon = p.icon
            return (
              <motion.button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onSelect(p.id)}
                initial={reduce ? undefined : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className={[
                  "group relative overflow-hidden rounded-2xl border p-5 text-left outline-none transition sm:p-6",
                  "focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080c]",
                  isActive
                    ? "border-cyan-400/40 bg-gradient-to-b from-cyan-400/[0.08] to-white/[0.02] shadow-[0_10px_40px_-20px_rgba(34,211,238,0.55)]"
                    : "border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-white/[0.005] hover:border-white/20 hover:bg-white/[0.04]",
                ].join(" ")}
              >
                {/* severity dot top-right */}
                <span
                  aria-hidden
                  className={[
                    "absolute right-4 top-4 h-2 w-2 rounded-full",
                    sev.dot,
                    sev.ring,
                  ].join(" ")}
                />

                <div
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-lg border transition",
                    isActive
                      ? "border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-200"
                      : "border-white/10 bg-white/[0.03] text-white/60 group-hover:text-white/80",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>

                <p
                  className={[
                    "mt-5 text-[15px] font-medium leading-tight",
                    isActive ? "text-white" : "text-white/85",
                  ].join(" ")}
                >
                  {p.label}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/45">
                  {p.consequence}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span
                    className={[
                      "font-mono text-[10px] uppercase tracking-[0.22em]",
                      isActive ? "text-cyan-300/80" : "text-white/30",
                    ].join(" ")}
                  >
                    {isActive ? "Selected" : "Tap to select"}
                  </span>
                  <span
                    aria-hidden
                    className={[
                      "h-px w-8 bg-gradient-to-r transition",
                      isActive ? "from-cyan-300/60 to-transparent" : "from-white/10 to-transparent",
                    ].join(" ")}
                  />
                </div>

                {/* active ring */}
                {isActive && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-cyan-300/30"
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        <p className="mt-8 font-mono text-[11px] tracking-[0.18em] text-white/35">
          {selected
            ? "→ SOLUTION BELOW IS NOW PERSONALIZED"
            : "→ PICK ONE TO PERSONALIZE THE NEXT SCREEN"}
        </p>
      </div>
    </section>
  )
}
