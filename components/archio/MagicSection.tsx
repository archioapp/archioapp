"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useMemo, useRef, useState, type KeyboardEvent } from "react"
import { AlertOctagon, RotateCcw, Sparkles, Zap } from "lucide-react"

type TabId = "coach" | "edge" | "brain"

interface TabDef {
  id: TabId
  label: string
  hint: string
}

const TABS: TabDef[] = [
  { id: "coach", label: "Feel the coach", hint: "Intercept a live trade" },
  { id: "edge",  label: "Find your edge", hint: "Decompose a pair" },
  { id: "brain", label: "See your brain", hint: "Explore the topology" },
]

/* ---------- Tab A — FEEL THE COACH ---------------------------------- */

function CoachDemo() {
  const reduce = useReducedMotion()
  const [executed, setExecuted] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_1fr]">
      {/* Order ticket */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.005] p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Order ticket
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            Live
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/35">PAIR</p>
            <p className="mt-1 text-[17px] font-semibold tracking-tight text-white">EURUSD</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/35">SIZE</p>
            <p className="mt-1 text-[17px] font-semibold tracking-tight text-white">2.5 lots</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/35">TIMING</p>
            <p className="mt-1 text-[13px] text-white/70">18 min after a loss</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/35">CONTEXT</p>
            <p className="mt-1 text-[13px] text-white/70">Same pair, same session</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExecuted(true)}
            disabled={executed}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[13px] font-medium text-[#04121a] transition hover:bg-cyan-200 disabled:opacity-60"
          >
            <Zap className="h-4 w-4" />
            Execute
          </button>
          <button
            type="button"
            onClick={() => setExecuted(false)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-[12px] text-white/70 transition hover:border-white/25 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Cortex intercept card */}
      <div className="relative min-h-[240px]">
        <AnimatePresence mode="wait">
          {executed ? (
            <motion.div
              key="intercept"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-500/[0.08] to-white/[0.01] p-5"
              role="alert"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-rose-300">
                  <AlertOctagon className="h-3 w-3" />
                  Stop
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                  Cortex · Analyze 4/6
                </span>
              </div>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                Pattern
              </p>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-white">
                Revenge trading
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-rose-300/90">
                Severity · Critical
              </p>
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                  Coach
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-white/85">
                  &ldquo;Am I entering to recover my last loss, or because the setup is genuinely
                  valid?&rdquo;
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={reduce ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-6 text-center"
            >
              <Sparkles className="h-5 w-5 text-white/30" strokeWidth={1.4} />
              <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/45">
                Tap <span className="text-white/75">Execute</span> to feel the Cortex intercept the trade in real time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Tab B — FIND YOUR EDGE ---------------------------------- */

type Pair = "EURUSD" | "NAS100" | "BTCUSD"

interface EdgeData {
  hitRate: number
  rMultiple: number
  splits: { label: string; value: number; accent: string }[]
}

const EDGE: Record<Pair, EdgeData> = {
  EURUSD: {
    hitRate: 72,
    rMultiple: 2.4,
    splits: [
      { label: "SESSION · LONDON",   value: 84, accent: "bg-cyan-300" },
      { label: "SETUP · FVG + OB",   value: 71, accent: "bg-cyan-300/80" },
      { label: "PAIR · EUR-LED",     value: 63, accent: "bg-cyan-300/60" },
      { label: "TIME · 08:00–11:00", value: 58, accent: "bg-cyan-300/50" },
    ],
  },
  NAS100: {
    hitRate: 64,
    rMultiple: 3.1,
    splits: [
      { label: "SESSION · NY OPEN",  value: 79, accent: "bg-cyan-300" },
      { label: "SETUP · BREAKOUT",   value: 58, accent: "bg-cyan-300/80" },
      { label: "PAIR · INDEX MOM.",  value: 51, accent: "bg-cyan-300/60" },
      { label: "TIME · 09:30–11:30", value: 68, accent: "bg-cyan-300/50" },
    ],
  },
  BTCUSD: {
    hitRate: 55,
    rMultiple: 4.2,
    splits: [
      { label: "SESSION · ASIA",     value: 61, accent: "bg-cyan-300" },
      { label: "SETUP · LIQ. SWEEP", value: 67, accent: "bg-cyan-300/80" },
      { label: "PAIR · CRYPTO MAJ.", value: 54, accent: "bg-cyan-300/60" },
      { label: "TIME · 00:00–04:00", value: 49, accent: "bg-cyan-300/50" },
    ],
  },
}

function EdgeDemo() {
  const reduce = useReducedMotion()
  const [pair, setPair] = useState<Pair>("EURUSD")
  const data = EDGE[pair]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(EDGE) as Pair[]).map((p) => {
          const active = p === pair
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPair(p)}
              aria-pressed={active}
              className={[
                "rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.18em] outline-none transition",
                "focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080c]",
                active
                  ? "border-cyan-400/40 bg-cyan-400/[0.08] text-cyan-200"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white",
              ].join(" ")}
            >
              {p}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="HIT RATE" value={`${data.hitRate}%`} />
        <Stat label="R MULTIPLE" value={data.rMultiple.toFixed(1)} />
        <Stat label="SAMPLE" value="200+" />
        <Stat label="WINDOW" value="90D" />
      </div>

      <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
          Edge decomposition · {pair}
        </p>
        <div className="mt-3 space-y-3">
          {data.splits.map((s, i) => (
            <div key={s.label}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/55">
                  {s.label}
                </span>
                <span className="font-mono text-[11px] text-white/80">{s.value}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  key={`${pair}-${s.label}`}
                  initial={reduce ? { width: `${s.value}%` } : { width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full ${s.accent}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/40">{label}</p>
      <p className="mt-1.5 text-[18px] font-semibold tracking-tight text-white">{value}</p>
    </div>
  )
}

/* ---------- Tab C — SEE YOUR BRAIN ---------------------------------- */

interface Node {
  id: string
  label: string
  desc: string
  x: number
  y: number
  kind: "limbic" | "logic"
}

const NODES: Node[] = [
  { id: "impulse",    label: "IMPULSE",    desc: "Acts before it reads. Triggers revenge spirals.",                 x: 72, y: 22, kind: "limbic" },
  { id: "fear",       label: "FEAR",       desc: "Cuts winners early. Closes before the thesis plays out.",         x: 84, y: 48, kind: "limbic" },
  { id: "ego",        label: "EGO",        desc: "Refuses to be wrong. Averages down into broken setups.",          x: 78, y: 76, kind: "limbic" },
  { id: "volatility", label: "VOLATILITY", desc: "Swings with the tape. Over-reacts to normal noise.",              x: 58, y: 88, kind: "limbic" },
  { id: "patience",   label: "PATIENCE",   desc: "Waits for A+ confluence. Skips the C-tier trades.",               x: 42, y: 88, kind: "logic" },
  { id: "discipline", label: "DISCIPLINE", desc: "Sticks to size, stops, and rules regardless of streak.",          x: 22, y: 76, kind: "logic" },
  { id: "structure",  label: "STRUCTURE",  desc: "Reads the bigger frame. Respects liquidity and session logic.",   x: 16, y: 48, kind: "logic" },
  { id: "clarity",    label: "CLARITY",    desc: "Decides in one breath. No inner debate at the moment of entry.",  x: 28, y: 22, kind: "logic" },
]

function BrainDemo() {
  const reduce = useReducedMotion()
  const [hoverId, setHoverId] = useState<string | null>(null)
  const active = useMemo(() => NODES.find((n) => n.id === hoverId) ?? null, [hoverId])

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#05070f]">
        {/* ambient halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,0.10), transparent 65%), radial-gradient(70% 70% at 50% 50%, rgba(109,74,255,0.05), transparent 72%)",
          }}
        />
        {/* connection lines */}
        <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="brain-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(34,211,238,0)" />
              <stop offset="50%" stopColor="rgba(34,211,238,0.5)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
          </defs>
          {NODES.map((n) => (
            <line
              key={n.id}
              x1={n.x}
              y1={n.y}
              x2={50}
              y2={50}
              stroke="url(#brain-line)"
              strokeWidth="0.18"
              opacity={active ? (active.id === n.id ? 0.9 : 0.18) : 0.35}
            />
          ))}
          <circle cx="50" cy="50" r="1.8" fill="#22d3ee" opacity="0.9" />
          <circle cx="50" cy="50" r="3.5" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="0.2" />
        </svg>

        {/* nodes */}
        {NODES.map((n) => {
          const isHover = active?.id === n.id
          const isLimbic = n.kind === "limbic"
          return (
            <button
              key={n.id}
              type="button"
              onMouseEnter={() => setHoverId(n.id)}
              onMouseLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(n.id)}
              onBlur={() => setHoverId(null)}
              aria-label={`${n.label} — ${n.desc}`}
              className={[
                "group absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none",
                "focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070f]",
              ].join(" ")}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <span
                aria-hidden
                className={[
                  "block h-3 w-3 rounded-full transition",
                  isLimbic ? "bg-rose-400/70" : "bg-cyan-300/80",
                  isHover ? "scale-[1.6] shadow-[0_0_18px_rgba(34,211,238,0.55)]" : "",
                  reduce ? "" : "motion-safe:animate-pulse",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.22em] transition",
                  isHover ? "text-white" : isLimbic ? "text-rose-300/70" : "text-cyan-200/70",
                ].join(" ")}
              >
                {n.label}
              </span>
            </button>
          )
        })}

        {/* cortex label */}
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
          Neural topology · Cortex
        </span>
      </div>

      {/* description panel */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id ?? "idle"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              {active ? (active.kind === "limbic" ? "Limbic · emotional" : "Logic · executive") : "Hover a node"}
            </p>
            <p className="mt-3 text-[22px] font-semibold tracking-tight text-white">
              {active ? active.label : "Eight forces, one decision."}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-white/70">
              {active
                ? active.desc
                : "Every trade is the sum of eight internal forces. The Cortex names them, scores them, and shows which one is winning the moment you click Buy."}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            Logic
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            Limbic
          </span>
        </div>
      </div>
    </div>
  )
}

/* ---------- Composition ------------------------------------------- */

export function MagicSection() {
  const reduce = useReducedMotion()
  const [tab, setTab] = useState<TabId>("coach")
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    coach: null,
    edge: null,
    brain: null,
  })

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return
    e.preventDefault()
    const len = TABS.length
    let next = idx
    if (e.key === "ArrowRight") next = (idx + 1) % len
    if (e.key === "ArrowLeft") next = (idx - 1 + len) % len
    if (e.key === "Home") next = 0
    if (e.key === "End") next = len - 1
    const nextId = TABS[next].id
    setTab(nextId)
    tabRefs.current[nextId]?.focus()
  }

  return (
    <section
      id="magic"
      aria-labelledby="magic-title"
      className="relative border-t border-white/[0.05] bg-[#07080c] py-24 sm:py-32"
    >
      {/* ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 0%, rgba(34,211,238,0.6), transparent 65%), radial-gradient(60% 60% at 80% 100%, rgba(109,74,255,0.4), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">06 · FEEL IT</p>
          <h2
            id="magic-title"
            className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl"
          >
            Don&apos;t take our word for it.
            <br />
            <span className="text-white/55">Try the system right here.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/55">
            Three one-minute simulations. No signup, no data sent anywhere — just the
            actual moves the Cortex makes inside Archio, running live on this page.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Archio interactive demos"
          className="mt-10 flex flex-wrap gap-2 border-b border-white/[0.06] pb-3"
        >
          {TABS.map((t, i) => {
            const active = t.id === tab
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`magic-panel-${t.id}`}
                id={`magic-tab-${t.id}`}
                tabIndex={active ? 0 : -1}
                ref={(el) => {
                  tabRefs.current[t.id] = el
                }}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={[
                  "group relative rounded-xl border px-4 py-2.5 text-left outline-none transition",
                  "focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080c]",
                  active
                    ? "border-cyan-400/40 bg-cyan-400/[0.08] text-white"
                    : "border-white/10 bg-white/[0.02] text-white/65 hover:border-white/25 hover:text-white",
                ].join(" ")}
              >
                <span className="block text-[13.5px] font-medium">{t.label}</span>
                <span
                  className={[
                    "mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em]",
                    active ? "text-cyan-300/80" : "text-white/35",
                  ].join(" ")}
                >
                  {t.hint}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              role="tabpanel"
              id={`magic-panel-${tab}`}
              aria-labelledby={`magic-tab-${tab}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "coach" && <CoachDemo />}
              {tab === "edge" && <EdgeDemo />}
              {tab === "brain" && <BrainDemo />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
