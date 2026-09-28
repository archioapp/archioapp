"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useState, type FormEvent } from "react"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { ConvergenceField } from "./ConvergenceField"

/**
 * FinalCTASection — Concept 8, the value-anchored CTA.
 *
 * Updated copy ("Unlock your Cortex"), updated sub, added proof strip
 * below the form. Form states unchanged: idle → submitting → ok.
 */
export function FinalCTASection() {
  const reduced = useReducedMotion()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "submitting" | "ok">("idle")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const v = email.trim()
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError("Please enter a valid email")
      return
    }
    setError(null)
    setState("submitting")
    setTimeout(() => setState("ok"), 650)
  }

  return (
    <section id="join" className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.5]">
        <div className="mx-auto h-full max-w-6xl">
          <div className="pointer-events-none h-full w-full">
            <ConvergenceField />
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,7,16,0.4), rgba(5,7,16,0.92) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/65 backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          Private early access
        </motion.div>

        <motion.h2
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[56px]"
        >
          Unlock your
          <br />
          <span className="text-cyan-300">Cortex.</span>
        </motion.h2>

        <motion.p
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 md:text-[16.5px]"
        >
          Free for 14 days. No card. Two-minute setup. Your first intervention tonight.
        </motion.p>

        <motion.form
          onSubmit={onSubmit}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-9 flex w-full max-w-md flex-col gap-2"
        >
          <div className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 pl-4 backdrop-blur-md transition-colors focus-within:border-cyan-400/40 focus-within:bg-white/[0.05]">
            <input
              type="email"
              required
              placeholder="you@desk.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(null)
                if (state === "ok") setState("idle")
              }}
              disabled={state === "submitting" || state === "ok"}
              className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-white placeholder:text-white/35 focus:outline-none disabled:opacity-60"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={state === "submitting" || state === "ok"}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#05070f] transition-colors hover:bg-cyan-200 disabled:opacity-70"
            >
              {state === "ok" ? (
                <>
                  <Check className="h-4 w-4" />
                  You&apos;re on the list
                </>
              ) : state === "submitting" ? (
                <>
                  <span className="h-3 w-3 animate-pulse rounded-full bg-[#05070f]/50" />
                  Sending
                </>
              ) : (
                <>
                  Unlock your Cortex
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {error ? (
            <div className="text-left text-[12px] text-rose-400">{error}</div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-[12px] text-white/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              No spam. Early access updates only.
            </div>
          )}
        </motion.form>

        {/* proof strip */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45"
        >
          <span>11 analytics modules</span>
          <span className="text-white/20">·</span>
          <span>5-stage workflow</span>
          <span className="text-white/20">·</span>
          <span>built from 100+ real desk audits</span>
        </motion.div>
      </div>
    </section>
  )
}
