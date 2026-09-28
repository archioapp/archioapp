"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Check } from "lucide-react"

interface Step {
  time: string
  line: string
}

const STEPS: Step[] = [
  { time: "0:10", line: "You describe your last trade in one sentence." },
  { time: "0:20", line: "The Cortex classifies the pattern and surfaces the coach card." },
  { time: "0:30", line: "You have a one-line rule for next time, pinned to your dashboard." },
]

export function QuickWinSection() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  })
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="quickwin"
      aria-labelledby="quickwin-title"
      className="relative border-t border-white/[0.05] bg-[#07080c] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">
            07 · YOUR FIRST 30 SECONDS
          </p>
          <h2
            id="quickwin-title"
            className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl"
          >
            Your first win isn&apos;t a trade.
            <br />
            <span className="text-white/55">It&apos;s the rule you&apos;ll never break again.</span>
          </h2>
        </div>

        <div ref={ref} className="relative mt-16 pl-10 sm:pl-14">
          {/* rail */}
          <div
            aria-hidden
            className="absolute left-3 top-2 h-[calc(100%-1rem)] w-px overflow-hidden bg-white/[0.08] sm:left-5"
          >
            <motion.div
              style={{ scaleY: reduce ? 1 : railScale, transformOrigin: "top" }}
              className="h-full w-px bg-gradient-to-b from-cyan-300 via-cyan-400/60 to-cyan-300/10"
            />
          </div>

          <ol className="flex flex-col gap-10 sm:gap-12">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.time}
                initial={reduce ? undefined : { opacity: 0, x: -10 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* check marker */}
                <motion.span
                  aria-hidden
                  initial={reduce ? { backgroundColor: "rgba(34,211,238,1)" } : { backgroundColor: "rgba(10,11,15,1)" }}
                  whileInView={{ backgroundColor: "rgba(34,211,238,1)" }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 + 0.1 }}
                  className="absolute -left-10 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/60 sm:-left-14"
                >
                  <Check className="h-3.5 w-3.5 text-[#04121a]" strokeWidth={3} />
                </motion.span>

                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300/85">
                  {s.time}
                </p>
                <p className="mt-2 text-[20px] font-medium leading-snug tracking-tight text-white sm:text-[22px]">
                  {s.line}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        <p className="mt-12 max-w-xl text-[14px] leading-relaxed text-white/50">
          The first session isn&apos;t a tour. It&apos;s a deposit into the rulebook you&apos;ll trade
          by for the next decade.
        </p>
      </div>
    </section>
  )
}
