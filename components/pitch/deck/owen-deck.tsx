"use client"

/* ═══════════════════════════════════════════════════════════════════════
   THE OWEN DECK — presentation shell
   ───────────────────────────────────────────────────────────────────────
   Replaces the 13-tab investor deck with thirty-four slides in five acts.
   Keeps the theme switcher (7 palettes), adds:
     ← → / space   navigate          N   presenter notes (say · read · ask)
     act curtain   crossing into a new act breathes its title over the stage
     F             fullscreen         1 2 3   open the app on the last slide
     Home / End    first / last
   ═══════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, MessageSquareText, Palette } from "lucide-react"
import { getTheme, ALL_THEMES, type ThemeId, type VantaryTheme } from "@/components/dashboard/vantary/theme-system"
import { useHoloPalette, withAlpha, glow, type HoloPalette } from "../holographic-kit"
import { ACTS, DECK, DECK_MINUTES, type DeckSlide, type AccentRole } from "./deck-data"
import { SlideFrame } from "./slide-frame"
import { CoverScene, NoiseScene, ScatterScene, ClonesScene, LiveCallScene } from "./act-world"
import { ProofScene, AccountsScene, NinetyScene } from "./act-world-2"
import { DayScene } from "./act-world-3"
import { useDossierFocus } from "./system-dossiers"
import { LoopScene, RecordScene, EightHundredScene, HindsightScene, GenericAiScene } from "./act-loop"
import { LoopIntroScene, WalkthroughScene } from "./act-loop-2"
import { DecisionScene, FlightDeckScene, CommunityScene, ForecastScene, ExecutionScene } from "./act-system"
import { SystemMapScene, GameplanScene, TradingDnaScene, PortfolioScene, ProofRecordScene } from "./act-system-2"
import { DoorsScene } from "./act-economy"
import { PrecedentScene, LanesScene, FlywheelScene, CityScene } from "./act-economy-2"
import { MentorMarketScene } from "./act-market"
import { BillScene, MarketScene, GmvScene } from "./act-money"
import { HonestScene } from "./act-close"

const THEME_ORDER: ThemeId[] = ["teal", "cyber", "neural", "quantum", "solar", "light", "obsidian"]
const THEME_KEY = "archio.pitch.theme"
const SLIDE_KEY = "archio.pitch.owen.slide"
const EASE = [0.22, 1, 0.36, 1] as const

function resolveAccent(theme: VantaryTheme, pal: HoloPalette, role: AccentRole): string {
  switch (role) {
    case "primary": return theme.primary
    case "secondary": return theme.secondary
    case "tertiary": return theme.tertiary ?? theme.primary
    case "chartUp": return pal.green
    case "danger": return pal.red
    case "amber": return pal.amber
  }
}

const SCENES: Record<DeckSlide["id"], (p: { pal: HoloPalette; accent: string }) => React.JSX.Element> = {
  cover: CoverScene,
  day: DayScene,
  noise: NoiseScene,
  scatter: ScatterScene,
  bill: BillScene,
  clones: ClonesScene,
  proof: ProofScene,
  livecall: LiveCallScene,
  accounts: AccountsScene,
  ninety: NinetyScene,
  loopintro: LoopIntroScene,
  loop: LoopScene,
  walkthrough: WalkthroughScene,
  record: RecordScene,
  eighthundred: EightHundredScene,
  hindsight: HindsightScene,
  genericai: GenericAiScene,
  decision: DecisionScene,
  systemmap: SystemMapScene,
  flightdeck: FlightDeckScene,
  community: CommunityScene,
  gameplan: GameplanScene,
  forecast: ForecastScene,
  execution: ExecutionScene,
  tradingdna: TradingDnaScene,
  portfolio: PortfolioScene,
  proofrecord: ProofRecordScene,
  precedent: PrecedentScene,
  market: MarketScene,
  lanes: LanesScene,
  gmv: GmvScene,
  agents: MentorMarketScene,
  flywheel: FlywheelScene,
  city: CityScene,
  honest: HonestScene,
  doors: DoorsScene,
}

const DOOR_HREFS = ["/dashboard", "/live-room", "/forecast"]

export function OwenDeck() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [themeId, setThemeId] = useState<ThemeId>("teal")
  const [full, setFull] = useState(false)
  const [notes, setNotes] = useState(false)
  const dossier = useDossierFocus()

  useEffect(() => {
    try {
      const t = window.localStorage.getItem(THEME_KEY)
      if (t && (THEME_ORDER as string[]).includes(t)) setThemeId(t as ThemeId)
      const s = Number(window.localStorage.getItem(SLIDE_KEY))
      if (Number.isFinite(s) && s >= 0 && s < DECK.length) setI(s)
    } catch {}
  }, [])
  useEffect(() => { try { window.localStorage.setItem(THEME_KEY, themeId) } catch {} }, [themeId])

  const theme = useMemo(() => getTheme(themeId), [themeId])
  const slide = DECK[i]
  const basePal = useHoloPalette(theme, theme.primary)
  const accent = resolveAccent(theme, basePal, slide.accentRole)
  const pal = useHoloPalette(theme, accent)

  const go = useCallback((n: number) => {
    setI((c) => {
      const next = Math.max(0, Math.min(DECK.length - 1, n))
      setDir(next >= c ? 1 : -1)
      try { window.localStorage.setItem(SLIDE_KEY, String(next)) } catch {}
      return next
    })
  }, [])
  const next = useCallback(() => go(i + 1), [go, i])
  const prev = useCallback(() => go(i - 1), [go, i])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next() }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev() }
      else if (e.key === "Home") { e.preventDefault(); go(0) }
      else if (e.key === "End") { e.preventDefault(); go(DECK.length - 1) }
      else if (e.key === "f" || e.key === "F") setFull((v) => !v)
      else if (e.key === "n" || e.key === "N") setNotes((v) => !v)
      else if (e.key === "Escape") { setFull(false); setNotes(false) }
      else if (slide.id === "doors" && ["1", "2", "3"].includes(e.key)) {
        window.open(DOOR_HREFS[Number(e.key) - 1], "_blank", "noopener")
      }
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [next, prev, go, slide.id])

  const Scene = SCENES[slide.id]
  const actIndex = ACTS.findIndex((a) => a.id === slide.act)
  const progress = (i + 1) / DECK.length

  /* act interstitial: when navigation crosses into a new act, the act's
     numeral + title breathe over the stage for a beat, then dissolve */
  const [curtain, setCurtain] = useState<string | null>(null)
  const prevAct = useRef(slide.act)
  useEffect(() => {
    if (prevAct.current === slide.act) return
    prevAct.current = slide.act
    if (reduce || slide.id === "cover") return
    setCurtain(slide.act)
  }, [slide.act, slide.id, reduce])
  /* the timer lives in its own effect so a re-run of the act effect can
     never cancel it (that left the curtain stuck over the stage) */
  useEffect(() => {
    if (!curtain) return
    const t = window.setTimeout(() => setCurtain(null), 1350)
    return () => window.clearTimeout(t)
  }, [curtain])
  const curtainAct = curtain ? ACTS.find((a) => a.id === curtain) : null
  const actSlides = DECK.filter((s) => s.act === slide.act)
  const actPos = actSlides.findIndex((s) => s.id === slide.id) + 1
  const elapsed = Math.round(DECK.slice(0, i).reduce((s, d) => s + d.beat, 0) / 60)

  return (
    <motion.div
      className={`${full ? "fixed inset-0 z-[9999]" : "min-h-screen"} relative flex flex-col overflow-hidden`}
      animate={{ background: theme.ink }}
      transition={{ duration: 0.45 }}
      style={{ background: theme.ink, color: pal.text }}
    >
      <Backdrop theme={theme} accent={accent} />

      {/* ── progress hairline ── */}
      <div className="relative z-20 h-0.5 w-full" style={{ background: pal.glassEdge }}>
        <motion.div className="h-full" style={{ background: accent, boxShadow: glow(accent, 0.6) }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
      </div>

      {/* ── top bar ── */}
      <header className="relative z-20 flex items-center justify-between gap-4 px-5 lg:px-8 py-3" style={{ borderBottom: `1px solid ${pal.glassEdge}` }}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.4)}` }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent, boxShadow: glow(accent, 0.7) }} />
          </span>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-sm font-black tracking-[0.12em]" style={{ color: pal.text }}>ARCHIO</span>
            <span className="text-xs truncate" style={{ color: pal.textDim }}>for Owen · TradeLocker</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeRail active={themeId} onPick={setThemeId} pal={pal} />
          <button
            onClick={() => setNotes((v) => !v)}
            aria-pressed={notes}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-md"
            style={{ background: notes ? withAlpha(accent, 0.16) : pal.glass, border: `1px solid ${notes ? withAlpha(accent, 0.5) : pal.glassEdge}`, color: notes ? accent : pal.textDim }}
            title="Presenter notes (N)"
          >
            <MessageSquareText style={{ width: 12, height: 12 }} /> Notes
          </button>
          <button
            onClick={() => setFull((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-md"
            style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}`, color: pal.textDim }}
            title="Fullscreen (F)"
          >
            {full ? <Minimize2 style={{ width: 12, height: 12 }} /> : <Maximize2 style={{ width: 12, height: 12 }} />}
          </button>
          <span className="text-[11px] tabular-nums pl-1" style={{ color: pal.textGhost, fontFamily: "var(--font-mono)" }}>{String(i + 1).padStart(2, "0")} / {DECK.length}</span>
        </div>
      </header>

      {/* ── act rail ── */}
      <nav className="relative z-20 flex items-center gap-1 px-5 lg:px-8 py-2 overflow-x-auto" aria-label="Acts" style={{ borderBottom: `1px solid ${pal.glassEdge}` }}>
        {ACTS.map((a, ai) => {
          const slides = DECK.map((s, si) => ({ s, si })).filter(({ s }) => s.act === a.id)
          const active = ai === actIndex
          const done = ai < actIndex
          return (
            <div key={a.id} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => go(slides[0].si)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] font-bold uppercase tracking-[0.18em] transition-colors"
                style={{ color: active ? accent : done ? pal.textDim : pal.textGhost, background: active ? withAlpha(accent, 0.12) : "transparent" }}
              >
                <span style={{ fontFamily: "var(--font-mono)" }}>{a.numeral}</span>
                <span>{a.title}</span>
              </button>
              <div className="flex items-center gap-1 pr-2">
                {slides.map(({ s, si }) => (
                  <button
                    key={s.id}
                    onClick={() => go(si)}
                    aria-label={s.label}
                    aria-current={si === i ? "step" : undefined}
                    title={s.label}
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: si === i ? 22 : 8, background: si === i ? accent : si < i ? withAlpha(accent, 0.45) : pal.glassEdgeHi, boxShadow: si === i ? glow(accent, 0.6) : "none" }}
                  />
                ))}
              </div>
              {ai < ACTS.length - 1 && <span className="w-px h-4 mr-1" style={{ background: pal.glassEdge }} aria-hidden />}
            </div>
          )
        })}
      </nav>

      {/* ── stage ── */}
      <main className="relative z-10 flex-1 flex items-center px-5 lg:px-8 py-4 lg:py-5 min-h-0">
        <div className="w-full max-w-[1280px] mx-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.section
              key={slide.id}
              custom={dir}
              initial={reduce ? false : { opacity: 0, x: dir * 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, x: dir * -20, filter: "blur(8px)" }}
              transition={{ duration: 0.42, ease: EASE }}
              aria-label={`${slide.eyebrow} — ${slide.headline}`}
            >
              <FitToStage>
                <SlideFrame pal={pal} accent={accent} eyebrow={slide.eyebrow} step={slide.step} headline={slide.headline} sub={slide.sub} layout={slide.layout}>
                  <Scene pal={pal} accent={accent} />
                </SlideFrame>
              </FitToStage>
            </motion.section>
          </AnimatePresence>
        </div>

        {/* ── act curtain ── */}
        <AnimatePresence>
          {curtainAct && (
            <motion.div
              key={curtainAct.id}
              className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.45 } }}
              transition={{ duration: 0.3 }}
              aria-hidden
            >
              <div className="absolute inset-0" style={{ background: withAlpha(theme.ink, 0.86), backdropFilter: "blur(14px)" }} />
              <motion.div
                className="relative flex flex-col items-center gap-3 text-center px-8"
                initial={{ y: 14, scale: 0.98, filter: "blur(6px)" }}
                animate={{ y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <span className="text-[11px] font-black uppercase tracking-[0.42em]" style={{ color: accent }}>Act {curtainAct.numeral}</span>
                <span className="text-[clamp(2.4rem,5vw,4rem)] font-black tracking-tight leading-none" style={{ color: pal.text }}>{curtainAct.title}</span>
                <motion.span className="h-px" style={{ background: accent, boxShadow: glow(accent, 0.7) }} initial={{ width: 0 }} animate={{ width: 160 }} transition={{ delay: 0.25, duration: 0.6, ease: EASE }} />
                <span className="text-[14px] max-w-[46ch] text-balance" style={{ color: pal.textDim }}>{curtainAct.line}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── footer controls ── */}
      <footer className="relative z-20 flex items-center justify-between px-5 lg:px-8 py-3" style={{ borderTop: `1px solid ${pal.glassEdge}` }}>
        <button onClick={prev} disabled={i === 0} className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-md disabled:opacity-30" style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}`, color: pal.textDim }}>
          <ChevronLeft style={{ width: 12, height: 12 }} /> Back
        </button>
        <div className="hidden md:flex items-center gap-4 text-[10.5px]" style={{ color: pal.textGhost }}>
          <span><Kbd pal={pal}>←</Kbd> <Kbd pal={pal}>→</Kbd> navigate</span>
          <span><Kbd pal={pal}>N</Kbd> notes</span>
          <span><Kbd pal={pal}>F</Kbd> fullscreen</span>
          {slide.id === "doors" && <span><Kbd pal={pal}>1</Kbd> <Kbd pal={pal}>2</Kbd> <Kbd pal={pal}>3</Kbd> open the app</span>}
          <span className="tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
            {ACTS[actIndex].title} {actPos}/{actSlides.length} · ~{elapsed} of {DECK_MINUTES} min
          </span>
        </div>
        <button onClick={next} disabled={i === DECK.length - 1} className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-md disabled:opacity-30" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.45)}`, color: accent }}>
          Next <ChevronRight style={{ width: 12, height: 12 }} />
        </button>
      </footer>

      {/* ── presenter notes drawer ── */}
      <AnimatePresence>
        {notes && (
          <motion.aside
            className="fixed right-4 bottom-16 z-[10000] w-[min(460px,calc(100vw-2rem))] max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl p-4 flex flex-col gap-2.5"
            style={{ background: withAlpha(theme.ink, 0.95), border: `1px solid ${withAlpha(accent, 0.45)}`, boxShadow: `${pal.shadowLg}, ${glow(accent, 0.3)}`, backdropFilter: "blur(16px)" }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: EASE }}
            aria-label="Presenter notes"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>Say · {slide.label}</span>
              <span className="text-[10px] tabular-nums" style={{ color: pal.textGhost, fontFamily: "var(--font-mono)" }}>{slide.beat}s · ~{Math.round(slide.say.split(" ").length / 2.4)}s spoken</span>
            </div>
            <p className="text-[13.5px] leading-relaxed" style={{ color: pal.text }}>{slide.say}</p>

            {dossier && slide.id === "systemmap" && (
              <div className="rounded-xl px-3 py-2.5 flex flex-col gap-1" style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.4)}` }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>Open now · {dossier.n} {dossier.name}</span>
                  <span className="text-[10px] tabular-nums" style={{ color: pal.textGhost, fontFamily: "var(--font-mono)" }}>~{Math.round(dossier.say.split(" ").length / 2.4)}s</span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: pal.text }}>{dossier.say}</p>
              </div>
            )}

            <div className="pt-2.5 flex flex-col gap-1.5" style={{ borderTop: `1px solid ${pal.glassEdge}` }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: pal.green }}>Read the screen · what you are looking at</span>
              <ol className="flex flex-col gap-1.5">
                {slide.read.map((r, k) => (
                  <li key={k} className="grid grid-cols-[18px_1fr] gap-1.5 text-[12.5px] leading-snug" style={{ color: pal.text }}>
                    <span className="font-black tabular-nums" style={{ color: pal.green, fontFamily: "var(--font-mono)" }}>{k + 1}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </div>

            {slide.ask && (
              <div className="pt-2.5 flex flex-col gap-1" style={{ borderTop: `1px solid ${pal.glassEdge}` }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: pal.amber }}>Ask Owen · then stop and listen</span>
                <p className="text-[13px] leading-relaxed italic" style={{ color: pal.text }}>&ldquo;{slide.ask}&rdquo;</p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── theme rail (the seven palettes) ─────────────────────────────────── */
function ThemeRail({ active, onPick, pal }: { active: ThemeId; onPick: (t: ThemeId) => void; pal: HoloPalette }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: pal.glass, border: `1px solid ${pal.glassEdge}` }}>
      <Palette style={{ width: 12, height: 12, color: pal.textGhost }} aria-hidden />
      {THEME_ORDER.map((id) => {
        const t = ALL_THEMES[id]
        const on = id === active
        return (
          <button
            key={id}
            onClick={() => onPick(id)}
            aria-label={`${t.name} palette`}
            aria-pressed={on}
            className="w-[18px] h-[18px] rounded-full relative overflow-hidden"
            style={{ boxShadow: on ? `0 0 0 2px ${pal.isLight ? "#fff" : "#000"}, 0 0 0 3.5px ${t.primary}, 0 0 14px ${withAlpha(t.primary, 0.5)}` : `0 0 0 1px ${pal.glassEdgeHi}` }}
          >
            <span className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.primary} 0 48%, ${t.secondary} 52% 100%)` }} />
          </button>
        )
      })}
    </div>
  )
}

/* ── FitToStage: if a slide is taller than the stage, scale it to fit ──
   Guarantees every slide sits inside the fold at any projector size. */
function FitToStage({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState<{ k: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const o = outer.current
    const n = inner.current
    if (!o || !n) return
    const main = o.closest("main")
    const measure = () => {
      if (!main) return
      /* main is flex-1 and grows with overflowing content, so the budget is
         taken from the viewport: everything below main's top edge minus the
         footer and main's own padding */
      const cs = getComputedStyle(main)
      const footer = main.nextElementSibling as HTMLElement | null
      const avail = window.innerHeight - main.getBoundingClientRect().top - (footer?.offsetHeight ?? 0)
        - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 2
      const need = n.scrollHeight
      if (need > avail && avail > 200) {
        const k = Math.max(0.62, avail / need)
        setFit({ k, h: need * k })
      } else setFit(null)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(n)
    if (main) ro.observe(main)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={outer} style={{ height: fit ? fit.h : undefined }}>
      <div ref={inner} style={fit ? { transform: `scale(${fit.k})`, transformOrigin: "top center" } : undefined}>
        {children}
      </div>
    </div>
  )
}

function Kbd({ children, pal }: { children: React.ReactNode; pal: HoloPalette }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded text-[10px] font-bold" style={{ background: pal.glassHi, border: `1px solid ${pal.glassEdge}`, color: pal.textDim, fontFamily: "var(--font-mono)" }}>
      {children}
    </kbd>
  )
}

/* ── backdrop: two slow pools in the slide's accent ─────────────────── */
function Backdrop({ theme, accent }: { theme: VantaryTheme; accent: string }) {
  const c2 = theme.secondary
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute rounded-full"
        style={{ width: 820, height: 820, left: "-14%", top: "-24%", filter: "blur(30px)" }}
        animate={{ background: `radial-gradient(circle, ${withAlpha(accent, 0.13)}, transparent 62%)`, x: [0, 30, 0], y: [0, 22, 0] }}
        transition={{ background: { duration: 0.8 }, x: { duration: 24, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }, y: { duration: 19, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 620, height: 620, right: "-10%", bottom: "-20%", filter: "blur(30px)" }}
        animate={{ background: `radial-gradient(circle, ${withAlpha(c2, 0.1)}, transparent 62%)`, x: [0, -24, 0], y: [0, -20, 0] }}
        transition={{ background: { duration: 0.8 }, x: { duration: 27, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }, y: { duration: 21, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
      />
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${withAlpha(theme.paper, 0.035)} 1px, transparent 1px)`, backgroundSize: "26px 26px", maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 78%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 40%, transparent 78%)" }} />
    </div>
  )
}
