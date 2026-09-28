"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ShieldCheck, Eye, GitBranch, Lock } from "lucide-react"

/* -----------------------------------------------------------
   Trust / Realness Section
   Four credibility statements with an underlying principle.
------------------------------------------------------------- */

const principles = [
  {
    icon: ShieldCheck,
    kicker: "Systems over smoke",
    title: "Built to replace fragmented workflows — not inflate them.",
    body:
      "Archio started from audits of real traders’ desks. Every surface you see exists because the scattered alternative was failing them.",
  },
  {
    icon: Eye,
    kicker: "Transparency over hype",
    title: "Real performance. Real psychology. Real numbers.",
    body:
      "Mentor rooms show verifiable track records. AI grades are shown with confidence. Drawdowns are surfaced, not hidden.",
  },
  {
    icon: GitBranch,
    kicker: "Decision quality first",
    title: "Designed for disciplined decision-making.",
    body:
      "The point isn’t to trade more — it’s to trade better. Every module is measured against the quality of decisions it produces.",
  },
  {
    icon: Lock,
    kicker: "Your data, your rails",
    title: "No data brokerage. No off-platform selling.",
    body:
      "Your journal, your trades and your psychology stay yours. Archio is paid for by its users — never by who it sells them to.",
  },
]

export function TrustSection() {
  const reduced = useReducedMotion()

  return (
    <section id="manifesto" className="relative px-5 py-24 sm:px-8 md:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,211,238,0.25), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div className="max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">07 · Manifesto</div>
            <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[44px]">
              Serious software for serious traders.
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-white/55 md:text-[16px]">
            Trading is a category that has been polluted by hype for a decade. Archio is built for the
            people who are tired of that and are trying to do real work.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {principles.map((p, i) => (
            <motion.article
              key={p.kicker}
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#0a0d18]/90 to-[#070a12]/90 p-6 md:p-8"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.03] ring-1 ring-white/[0.08]">
                  <p.icon className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/80">{p.kicker}</div>
              </div>
              <h3 className="mt-5 text-balance text-[19px] font-medium leading-snug tracking-tight text-white md:text-[22px]">
                {p.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
