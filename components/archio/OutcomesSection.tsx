"use client"

import { motion, useReducedMotion } from "framer-motion"
import { DeviceFrame } from "./DeviceFrame"

interface Outcome {
  line: string
  src: string
  alt: string
  route: string
}

const OUTCOMES: Outcome[] = [
  {
    line: "You stop before the tilt trade.",
    src: "/archio/screens/11-copilot-right-rail.png",
    alt: "Cortex right rail surfacing a critical revenge pattern alert before execution.",
    route: "archio.app/copilot",
  },
  {
    line: "You see your edge in numbers, not vibes.",
    src: "/archio/screens/02-dashboard.png",
    alt: "Performance dashboard with balance, win rate, streak, and discipline.",
    route: "archio.app/dashboard",
  },
  {
    line: "You walk in Monday with a plan already stress-tested.",
    src: "/archio/screens/09-communities.png",
    alt: "Whale Room Daily Gameplan with weekly outlook and macro drivers.",
    route: "archio.app/communities",
  },
  {
    line: "You know why you won, so you can repeat it.",
    src: "/archio/screens/10-history-journal.png",
    alt: "History and journal overview with intelligence and next-move routing.",
    route: "archio.app/history",
  },
  {
    line: "You never trade alone again.",
    src: "/archio/screens/07-nexus.png",
    alt: "Nexus system-awake constellation mapping traders to mentors and rooms.",
    route: "archio.app/nexus",
  },
]

export function OutcomesSection() {
  const reduce = useReducedMotion()
  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-title"
      className="relative border-t border-white/[0.05] bg-[#07080c] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">
            05 · WHAT IT ACTUALLY DOES TO YOUR TRADING
          </p>
          <h2
            id="outcomes-title"
            className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl"
          >
            Not features.
            <br />
            <span className="text-white/55">Outcomes you can feel by Friday.</span>
          </h2>
        </div>

        <div className="mt-20 flex flex-col gap-24 md:gap-28">
          {OUTCOMES.map((o, i) => {
            const flip = i % 2 === 1
            return (
              <motion.article
                key={o.line}
                initial={reduce ? undefined : { opacity: 0, y: 28 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <div className={flip ? "lg:order-2 lg:col-span-5" : "lg:col-span-5"}>
                  <p className="font-mono text-[11px] tracking-[0.22em] text-cyan-400/85">
                    {String(i + 1).padStart(2, "0")} / 05
                  </p>
                  <h3 className="mt-3 text-balance text-[28px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[34px]">
                    {o.line}
                  </h3>
                </div>
                <div className={flip ? "lg:order-1 lg:col-span-7" : "lg:col-span-7"}>
                  <DeviceFrame
                    src={o.src}
                    alt={o.alt}
                    variant="laptop"
                    route={o.route}
                    aspect="aspect-[16/10]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
