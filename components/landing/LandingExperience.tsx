"use client"

/* =====================================================================
   LANDING EXPERIENCE — ORCHESTRATOR
   Assembles all 12 cinematic scenes into a single scroll-driven
   narrative. Provides a global progress bar, chapter navigator,
   persistent top-bar CTA, and a final footer. This is the conductor
   of the full ArchioAI landing story.
   ===================================================================== */

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ArrowUp, Menu, X } from "lucide-react"

import SceneHero from "./scenes/SceneHero"
import SceneToolChaos from "./scenes/SceneToolChaos"
import SceneGuruBetrayal from "./scenes/SceneGuruBetrayal"
import SceneIsolation from "./scenes/SceneIsolation"
import { ScenePsychology } from "./scenes/ScenePsychology"
import { SceneIgnition } from "./scenes/SceneIgnition"
import { SceneEcosystem } from "./scenes/SceneEcosystem"
import { SceneCopilot } from "./scenes/SceneCopilot"
import { ScenePsychOS } from "./scenes/ScenePsychOS"
import { SceneCommunity } from "./scenes/SceneCommunity"
import { SceneTransformation } from "./scenes/SceneTransformation"
import { SceneCTA } from "./scenes/SceneCTA"

import { PALETTE } from "./LandingShared"

/* ---------- Chapter Map ---------- */

const CHAPTERS = [
  { id: "scene-hero", label: "The Trader", act: "I — The Chaos" },
  { id: "scene-chaos", label: "Tool Sprawl", act: "I — The Chaos" },
  { id: "scene-guru", label: "Broken Trust", act: "I — The Chaos" },
  { id: "scene-isolation", label: "The Isolation", act: "I — The Chaos" },
  { id: "scene-psychology", label: "The Mind Loop", act: "I — The Chaos" },
  { id: "scene-ignition", label: "The Arrival", act: "II — The Turn" },
  { id: "scene-ecosystem", label: "One Platform", act: "III — The Platform" },
  { id: "scene-copilot", label: "Living Copilot", act: "III — The Platform" },
  { id: "scene-psych-os", label: "Psychology OS", act: "III — The Platform" },
  { id: "scene-community", label: "Live Rooms", act: "III — The Platform" },
  { id: "scene-transformation", label: "Before & After", act: "IV — The Promise" },
  { id: "scene-cta", label: "The Invitation", act: "IV — The Promise" },
] as const

/* ---------- Top Fixed Progress Bar + Nav ---------- */

function TopProgressBar() {
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.3 })
  const width = useTransform(smoothProgress, [0, 1], ["0%", "100%"])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div
        className="h-[2px] w-full"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <motion.div
          className="h-full origin-left"
          style={{
            width,
            background: `linear-gradient(90deg, ${PALETTE.chaosCrimson} 0%, ${PALETTE.transitionPurple} 45%, ${PALETTE.resolutionCyan} 100%)`,
            boxShadow: `0 0 18px ${PALETTE.transitionPurpleGlow}`,
          }}
        />
      </div>
    </div>
  )
}

/* ---------- Top Persistent Nav Bar ---------- */

function TopNav({ onOpenChapters }: { onOpenChapters: () => void }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 60))
  }, [scrollY])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
    >
      <div
        className="flex items-center justify-between px-8 py-4 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(5,5,10,0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(180%)" : "none",
          borderBottom: scrolled ? `1px solid ${PALETTE.border}` : "1px solid transparent",
        }}
      >
        {/* Wordmark */}
        <Link href="#scene-hero" className="flex items-center gap-3 group">
          <div className="relative" style={{ width: 26, height: 26 }}>
            <svg viewBox="0 0 26 26" className="w-full h-full">
              <defs>
                <linearGradient id="nav-mark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={PALETTE.resolutionCyan} />
                  <stop offset="100%" stopColor={PALETTE.transitionPurple} />
                </linearGradient>
              </defs>
              <motion.circle
                cx="13" cy="13" r="11.5"
                fill="none"
                stroke="url(#nav-mark)"
                strokeWidth="1.5"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ originX: "13px", originY: "13px" }}
              />
              <circle cx="13" cy="13" r="4.5" fill="url(#nav-mark)" opacity="0.9" />
              <circle cx="13" cy="13" r="2" fill={PALETTE.ink} />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[13px] font-bold tracking-[0.18em]"
              style={{ color: PALETTE.ink, fontFamily: "Inter, system-ui, sans-serif" }}
            >
              ARCHIO
            </span>
            <span
              className="text-[11px] tracking-[0.2em]"
              style={{ color: PALETTE.inkMuted, fontWeight: 300 }}
            >
              AI
            </span>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Ecosystem", target: "scene-ecosystem" },
            { label: "Copilot", target: "scene-copilot" },
            { label: "Psychology", target: "scene-psych-os" },
            { label: "Community", target: "scene-community" },
          ].map((link) => (
            <Link
              key={link.target}
              href={`#${link.target}`}
              className="px-4 py-1.5 text-[11px] tracking-[0.18em] uppercase font-mono transition-colors"
              style={{ color: PALETTE.inkMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.ink)}
              onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.inkMuted)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChapters}
            className="flex items-center gap-2 px-3 py-1.5 transition-all md:hidden"
            style={{
              border: `1px solid ${PALETTE.border}`,
              color: PALETTE.inkMuted,
              background: "rgba(255,255,255,0.02)",
            }}
            aria-label="Open chapter navigator"
          >
            <Menu className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/register"
            className="hidden sm:flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.18em] uppercase font-mono transition-all group"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.resolutionCyan}, ${PALETTE.transitionPurple})`,
              color: PALETTE.ink,
              boxShadow: `0 0 24px ${PALETTE.transitionPurpleGlow}`,
            }}
          >
            Get Access
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.header>
  )
}

/* ---------- Chapter Navigator (side rail) ---------- */

function ChapterRail({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const handler = () => {
      const sections = CHAPTERS.map((c) => document.getElementById(c.id))
      const viewportCenter = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      sections.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const mid = rect.top + rect.height / 2
        const dist = Math.abs(mid - viewportCenter)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActiveIdx(best)
    }
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <>
      {/* Desktop dot rail — always visible */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3 pointer-events-none">
        {CHAPTERS.map((chapter, i) => {
          const isActive = i === activeIdx
          return (
            <Link
              key={chapter.id}
              href={`#${chapter.id}`}
              className="group relative flex items-center justify-end gap-3 pointer-events-auto"
            >
              <span
                className="text-[9px] font-mono tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                style={{ color: PALETTE.inkMuted }}
              >
                {chapter.label}
              </span>
              <motion.div
                className="rounded-full border transition-all"
                animate={{
                  scale: isActive ? 1 : 0.7,
                  borderColor: isActive ? PALETTE.resolutionCyan : PALETTE.borderStrong,
                  backgroundColor: isActive ? PALETTE.resolutionCyan : "transparent",
                }}
                style={{ width: 8, height: 8 }}
              />
            </Link>
          )
        })}
      </div>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(5,5,10,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between p-6">
              <span
                className="text-[11px] tracking-[0.3em] font-mono uppercase"
                style={{ color: PALETTE.inkMuted }}
              >
                Chapters
              </span>
              <button onClick={onClose} aria-label="Close menu">
                <X className="w-5 h-5" style={{ color: PALETTE.ink }} />
              </button>
            </div>
            <nav className="px-6 space-y-1 pt-4">
              {CHAPTERS.map((chapter, i) => {
                const prevAct = i > 0 ? CHAPTERS[i - 1].act : null
                const showActHeader = i === 0 || chapter.act !== prevAct
                return (
                  <div key={chapter.id}>
                    {showActHeader && (
                      <div
                        className="pt-6 pb-2 text-[9px] tracking-[0.3em] font-mono uppercase"
                        style={{ color: PALETTE.transitionPurple }}
                      >
                        {chapter.act}
                      </div>
                    )}
                    <Link
                      href={`#${chapter.id}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-3 border-b transition-colors"
                      style={{ borderColor: PALETTE.border, color: PALETTE.ink }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-[10px] font-mono"
                          style={{ color: PALETTE.inkMuted }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[14px]">{chapter.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5" style={{ color: PALETTE.inkMuted }} />
                    </Link>
                  </div>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---------- Act Transitions (palette bridge between scenes) ---------- */

function ActTransition({
  from,
  to,
  label,
  act,
}: {
  from: string
  to: string
  label: string
  act: string
}) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "50vh",
        background: `linear-gradient(to bottom, ${from} 0%, ${to} 100%)`,
      }}
    >
      {/* Decorative horizontal beam */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center gap-8 px-12">
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${PALETTE.borderStrong}, transparent)`,
          }}
        />
        <div className="text-center">
          <div
            className="text-[10px] tracking-[0.4em] font-mono uppercase mb-2"
            style={{ color: PALETTE.inkDim }}
          >
            {act}
          </div>
          <motion.div
            className="text-[22px] md:text-[26px] font-light"
            style={{ color: PALETTE.ink, letterSpacing: "-0.01em" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {label}
          </motion.div>
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${PALETTE.borderStrong}, transparent)`,
          }}
        />
      </div>
    </section>
  )
}

/* ---------- Back-to-top button ---------- */

function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on("change", (y) => setVisible(y > 1200))
  }, [scrollY])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center group"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            border: `1px solid ${PALETTE.borderStrong}`,
            background: "rgba(5,5,10,0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" style={{ color: PALETTE.ink }} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ---------- Footer ---------- */

function LandingFooter() {
  return (
    <footer
      className="relative w-full pt-24 pb-10 px-8 overflow-hidden"
      style={{ background: PALETTE.chaosBackground }}
    >
      {/* Top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${PALETTE.transitionPurple}, ${PALETTE.resolutionCyan}, transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Top row: wordmark + CTA echo */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 pb-14 border-b" style={{ borderColor: PALETTE.border }}>
          <div className="flex items-center gap-4">
            <div className="relative" style={{ width: 40, height: 40 }}>
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <defs>
                  <linearGradient id="footer-mark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={PALETTE.resolutionCyan} />
                    <stop offset="100%" stopColor={PALETTE.transitionPurple} />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="20" r="18" fill="none" stroke="url(#footer-mark)" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="7" fill="url(#footer-mark)" opacity="0.9" />
                <circle cx="20" cy="20" r="3" fill={PALETTE.ink} />
              </svg>
            </div>
            <div>
              <div
                className="text-[18px] font-bold tracking-[0.2em]"
                style={{ color: PALETTE.ink }}
              >
                ARCHIO <span style={{ color: PALETTE.inkMuted, fontWeight: 300 }}>AI</span>
              </div>
              <div
                className="text-[10px] tracking-[0.3em] font-mono uppercase mt-1"
                style={{ color: PALETTE.inkDim }}
              >
                The operating system for traders
              </div>
            </div>
          </div>
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 text-[12px] tracking-[0.18em] uppercase font-mono transition-all group"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.resolutionCyan}, ${PALETTE.transitionPurple})`,
              color: PALETTE.ink,
            }}
          >
            Enter the Ecosystem
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14">
          <FooterCol
            title="Product"
            links={[
              { label: "Copilot", href: "#scene-copilot" },
              { label: "Psychology OS", href: "#scene-psych-os" },
              { label: "Live Rooms", href: "#scene-community" },
              { label: "Ecosystem", href: "#scene-ecosystem" },
            ]}
          />
          <FooterCol
            title="Platform"
            links={[
              { label: "For Traders", href: "/register" },
              { label: "For Mentors", href: "/register" },
              { label: "Integrations", href: "#" },
              { label: "Changelog", href: "#" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "Manifesto", href: "#" },
              { label: "Investors", href: "/pitch" },
              { label: "Careers", href: "#" },
              { label: "Contact", href: "#" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Security", href: "#" },
              { label: "Risk Disclosure", href: "#" },
            ]}
          />
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: PALETTE.border }}
        >
          <div
            className="text-[10px] tracking-[0.2em] font-mono uppercase"
            style={{ color: PALETTE.inkDim }}
          >
            © {new Date().getFullYear()} Archio Systems — All rights reserved
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: PALETTE.resolutionGreen }}
            />
            <span
              className="text-[10px] tracking-[0.2em] font-mono uppercase"
              style={{ color: PALETTE.inkDim }}
            >
              Systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <div
        className="text-[10px] tracking-[0.3em] font-mono uppercase mb-5"
        style={{ color: PALETTE.transitionPurple }}
      >
        {title}
      </div>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13px] transition-colors"
              style={{ color: PALETTE.inkMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = PALETTE.ink)}
              onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.inkMuted)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Main Orchestrator ---------- */

export default function LandingExperience() {
  const [navOpen, setNavOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Smooth scroll for anchor links
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = ""
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: PALETTE.chaosBackground,
        color: PALETTE.ink,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <TopProgressBar />
      <TopNav onOpenChapters={() => setNavOpen(true)} />
      <ChapterRail open={navOpen} onClose={() => setNavOpen(false)} />
      <BackToTop />

      {/* ACT I — THE CHAOS (each Scene emits its own <section id="..." />) */}
      <SceneHero />
      <SceneToolChaos />
      <SceneGuruBetrayal />
      <SceneIsolation />
      <ScenePsychology />

      {/* Bridge from Act I → Act II (chaos → turn) */}
      <ActTransition
        from={PALETTE.chaosBackgroundDeep}
        to="#120821"
        label="The moment everything changes"
        act="Act II — The Turn"
      />

      {/* ACT II — THE TURN */}
      <SceneIgnition />

      {/* Bridge from Act II → Act III (turn → platform) */}
      <ActTransition
        from="#120821"
        to="#041820"
        label="One platform. Every layer connected."
        act="Act III — The Platform"
      />

      {/* ACT III — THE PLATFORM */}
      <SceneEcosystem />
      <SceneCopilot />
      <ScenePsychOS />
      <SceneCommunity />

      {/* Bridge from Act III → Act IV (platform → promise) */}
      <ActTransition
        from="#041820"
        to="#050510"
        label="The same trader. A different life."
        act="Act IV — The Promise"
      />

      {/* ACT IV — THE PROMISE */}
      <SceneTransformation />
      <SceneCTA />

      <LandingFooter />
    </div>
  )
}
