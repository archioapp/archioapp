"use client"

import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * PainSection — Concept 2, the Problem.
 *
 * A centered emotional cycler. Six real trader-pain lines rotate every
 * 2.6s, with a muted product screenshot crossfading behind each one so
 * every pain is tied to the exact surface that would have caught it.
 */

interface PainLine {
  line: string
  screenshot: string
  alt: string
}

const LINES: PainLine[] = [
  {
    line: "Revenge-traded your last win back?",
    screenshot: "/archio/screens/11-copilot-right-rail.png",
    alt: "Cortex right rail flagging a revenge trading pattern as critical.",
  },
  {
    line: "Cut your winner at +5 and watched it run +80?",
    screenshot: "/archio/screens/02-dashboard.png",
    alt: "Performance dashboard showing win rate, discipline, and streak.",
  },
  {
    line: "Sized up on the one setup you shouldn't have?",
    screenshot: "/archio/screens/04-copilot-stages.png",
    alt: "AI Copilot pattern detection and guided session pipeline.",
  },
  {
    line: "Spent 3 hours in Discord and still don't have a plan?",
    screenshot: "/archio/screens/09-communities.png",
    alt: "Archio Communities radial ecosystem finder.",
  },
  {
    line: "Journal half-empty, P&L fully red?",
    screenshot: "/archio/screens/10-history-journal.png",
    alt: "History and journal overview with intelligence and next moves.",
  },
  {
    line: "Alone in front of six monitors?",
    screenshot: "/archio/screens/07-nexus.png",
    alt: "Nexus system-awake constellation mapping traders to the network.",
  },
]

export function PainSection() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((v) => (v + 1) % LINES.length), 2600)
    return () => clearInterval(t)
  }, [reduce])

  const current = LINES[i]

  return (
    <section
      aria-labelledby="pain-title"
      className="relative overflow-hidden border-t border-white/[0.05] bg-[#05070c] py-28 sm:py-36"
    >
      {/* muted screenshot backdrop, crossfading */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.screenshot}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current.screenshot}
              alt=""
              fill
              aria-hidden
              sizes="100vw"
              className="object-cover object-center"
              priority={false}
            />
          </motion.div>
        </AnimatePresence>
        {/* darken + vignette so the type stays dominant */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,7,12,0.6), rgba(5,7,12,0.94) 75%), linear-gradient(180deg, rgba(5,7,12,0.7), rgba(5,7,12,0.95))",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-mono text-[11px] tracking-[0.22em] text-white/40">
          02 · YOU KNOW THE FEELING
        </p>

        <h2
          id="pain-title"
          className="relative mt-8 min-h-[2.6em] text-balance text-[34px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[48px] md:text-[56px]"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={current.line}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {current.line}
            </motion.span>
          </AnimatePresence>
        </h2>

        {/* dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {LINES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show pain ${idx + 1} of ${LINES.length}`}
              className="group outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
            >
              <span
                className={[
                  "block h-1 rounded-full transition-all",
                  idx === i ? "w-6 bg-cyan-300" : "w-1.5 bg-white/20 group-hover:bg-white/40",
                ].join(" ")}
              />
            </button>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-pretty text-[15px] leading-relaxed text-white/60">
          If any of that hit — you&apos;re exactly who Archio was built for.
        </p>
      </div>
    </section>
  )
}
