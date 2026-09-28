"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · ASK QUICK ACTIONS · v3 · LUXE GLASS
   ───────────────────────────────────────────────────────────────────────────

   The component that sits between the TraderCartouche and the
   FlightDeckCockpit (4 rooms). It morphs based on the Ask Vantary
   state machine into one of two visual modes — there is NO idle chip
   rail. The space below the cartouche stays clean until the trader
   explicitly engages the bar.

     ┌────────────────────────────────────────────────────────────────────┐
     │  MODE A · SUGGESTING                                                 │
     │  ────────────────────────────────────────────────                   │
     │  Two floating "pair-cards" rise out above the rooms below — but    │
     │  the card chrome is GONE. There is no border, no background, no    │
     │  surface — just a luxurious column of glassy prompt rows floating  │
     │  on the page background. The axis identity (EXECUTION /            │
     │  DEVELOPMENT) is folded into the bottom cycler bar:                │
     │                                                                      │
     │      ◇  Liquidity map · EUR/USD heading into London          ●○ →  │
     │            Buy-side draws · Asia range · session high/low          │
     │      ◇  DXY structure · dollar strength continuing?          ●○ →  │
     │            Bullish continuation · distribution · reversal read     │
     │      ◇  Next 30-min decision · XAU/USD                       ●○ →  │
     │            Trigger · invalidation · risk envelope                  │
     │                                                                      │
     │      ╭───────────────────────────────────────────────────────╮     │
     │      │  ⟲   EXECUTION  ·  Read tape, build today  ·  1 / 2  │     │
     │      ╰───────────────────────────────────────────────────────╯     │
     │             ●                                  ●                   │
     │            ⤓ breathing wire                   ⤓ breathing wire     │
     │         ROOM 1 (Market Floor)            ROOM 2 (Studio)           │
     │                                                                      │
     │  The cycler bar IS the axis identity AND the AI-recommendation     │
     │  shuffler. Auto-cycles every 5.5s; manual click cycles immediately.│
     │  The two breathing anchors at the bottom drop into the rooms below │
     │  with continuously-flowing accent wires.                            │
     └────────────────────────────────────────────────────────────────────┘

     ┌────────────────────────────────────────────────────────────────────┐
     │  MODE B · COLLAPSED                                                  │
     │  ──────────────────────────────────────────────                     │
     │  All non-suggesting states (idle / armed / submitted / answering)  │
     │  collapse the surface to height 0.                                  │
     └────────────────────────────────────────────────────────────────────┘
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw } from "lucide-react"

import { useAskVantaryState } from "./ask-vantary-state-context"
import { useOracleArmed } from "@/lib/oracle/oracle-armed-context"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"

/* ─────────────────────────────────────────────────────────────────────────
   Type model
   ─────────────────────────────────────────────────────────────────────── */
export interface PromptDef {
  /** Short verb-first card title — primary line. */
  label:  string
  /** One-line subtext rendered BELOW the label in a smaller, dimmer
      typeface. Telegraphs what kind of answer the trader will receive
      (key dimensions, comparisons, framing) — gives the prompt the
      "AI recommendation card" feel rather than a generic chip. */
  detail: string
  /** Full prompt body posted to Ask Vantary on click. */
  prompt: string
  /** Topic eyebrow rendered above the live answer surface. */
  topic:  string
  /** Which side of the pair this prompt feeds — `"a"` is the LEFT room
      of the pair, `"b"` is the RIGHT room. We deliberately avoid naming
      the rooms here; the visual indicator on the prompt is just two
      dots, with the side dot lit. The card's own position in the grid
      already telegraphs which two rooms are meant. */
  side:   "a" | "b"
}

/** A pair-card definition — collapses TWO rooms into one wider card. */
export interface PairCardDef {
  /** Conceptual axis label rendered as the small caps-mono eyebrow.
      Static — this NEVER changes. It's the durable identity of the
      pair (EXECUTION / DEVELOPMENT). */
  axis:    string
  /** STATIC second-part phrase, rendered in the SAME accent color
      and caps-mono treatment as `axis` itself — so the pill reads as
      a single typographic ribbon (e.g. "EXECUTION · TRADE THE
      SESSION") rather than a "label + rotating subtitle" pair.

      Per direct trader directive: the previous rotating WHITE
      tagline that cross-faded every 4.5s "changed all the time" and
      pulled the eye away from the durable axis identity. It has
      been replaced with one strong phrase per axis that names the
      trader's job spanning the two rooms beneath the pill:
        · EXECUTION  → TRADE THE SESSION   (Market Floor + Studio)
        · DEVELOPMENT → MASTER THE EDGE    (Mentor Hall + Collective)
      Static = no useEffect, no AnimatePresence, no cross-fade — the
      eye lands on it once and never has to re-read. The pill itself
      is also wider so the longer ribbon sits comfortably without
      ellipsis. */
  axisStatic: string
  /** Curated prompts spanning both halves of the pair. We supply 6 so
      the card can paginate 3-at-a-time and the trader can hit
      "Suggest more" or wait 5.5s for auto-cycle to surface fresh
      combinations. */
  prompts: readonly PromptDef[]
}

/** How many prompts each card displays at a time. */
const PROMPTS_PER_PAGE = 3

/* ─────────────────────────────────────────────────────────────────────────
   Catalog · 2 pair-cards × 6 detailed trader prompts each
   ─────────────────────────────────────────────────────────────────────────
   Each prompt now has a `detail` companion line: a short, real,
   trader-grade preview of what the answer will contain. Designed
   together with the label so the two-line stack reads like a curated
   AI recommendation card.                                              */
/* ── EXPORTED so the cartouche wings in `your-space.tsx` can mount the
      `<AxisIdentityPill/>` for each pair when ASK is in `suggesting`
      state. The wing pill renders the EXACT same axis identity (axis
      label + static ribbon) sourced from this catalog — single source
      of truth, no duplication. */
export const PAIR_CARDS: readonly PairCardDef[] = [
  {
    axis:    "Execution",
    /* Single durable phrase that names what a trader DOES across the
       two rooms feeding this pill (Market Floor + Studio). Rendered
       in the same accent caps-mono treatment as the axis label, so
       "EXECUTION · TRADE THE SESSION" reads as one continuous
       typographic ribbon. */
    axisStatic: "Trade the session",
    prompts: [
      {
        label:  "Liquidity map · EUR/USD heading into London",
        detail: "Buy-side draws · Asia range · session high/low overlays",
        prompt: "Show me where liquidity is sitting on EUR/USD right now — buy-side and sell-side draws on the 1H, marked with the most recent session high/low and Asia range.",
        topic:  "Liquidity",
        side:   "a",
      },
      {
        label:  "DXY structure · is dollar strength continuing?",
        detail: "Continuation, distribution, or reversal — read with confluence",
        prompt: "What is the current DXY structure telling me heading into London — bullish continuation, distribution, or a reversal setup? Confluences across DXY, US10Y, and EUR/USD inverse.",
        topic:  "DXY",
        side:   "a",
      },
      {
        label:  "Next 30-min decision · XAU/USD",
        detail: "Trigger price · invalidation level · R-multiple budget",
        prompt: "What's the next 30-minute decision point on XAU/USD — the exact trigger price, the invalidation level, and my R-multiple budget if it plays out.",
        topic:  "Decision",
        side:   "a",
      },
      {
        label:  "Tag my last 20 trades by setup",
        detail: "ORB · FVG · sweep · MSS — win rate, R, expectancy per tag",
        prompt: "Tag my last 20 trades by setup type (ORB, FVG, liquidity sweep, MSS) and show win rate, average R, and expectancy per tag, sorted by edge.",
        topic:  "Tags",
        side:   "b",
      },
      {
        label:  "Why I lost Wednesday · full post-mortem",
        detail: "Every entry · time-of-day · news context · journal note",
        prompt: "Walk me through why I lost money last Wednesday — every entry, exit, time-of-day, news context, and emotional note from my journal, ranked by which factor cost me the most.",
        topic:  "Post-mortem",
        side:   "b",
      },
      {
        label:  "Backtest London ORB · last 90 days",
        detail: "Sharpe · max DD · worst losing streak · realistic slippage",
        prompt: "Backtest my London ORB setup on EUR/USD over the last 90 days using my actual entry rules and risk-per-trade — give me Sharpe, max DD, the worst losing streak, and assume realistic slippage.",
        topic:  "Backtest",
        side:   "b",
      },
    ],
  },
  {
    axis:    "Development",
    /* Single durable phrase that names what a trader DOES across the
       two rooms feeding this pill (Mentor Hall + Collective). Same
       accent caps-mono ribbon grammar as EXECUTION above. */
    axisStatic: "Master the edge",
    prompts: [
      {
        label:  "ICT Silver Bullet · NY open, annotated",
        detail: "Entry · stop · target · why the 10–11 AM window holds edge",
        prompt: "Walk me through ICT's Silver Bullet setup for the New York open with a fully annotated example from the last week — entry, stop, target, and why the 10–11 AM window holds a statistical edge.",
        topic:  "Mentor",
        side:   "a",
      },
      {
        label:  "Why my highest-R setup actually works",
        detail: "Underlying inefficiency · regime sensitivity · failure modes",
        prompt: "Statistically, why does my highest-R setup work? Identify the underlying market inefficiency it's exploiting, which regimes amplify it, and the specific failure modes that break it down.",
        topic:  "Setup edge",
        side:   "a",
      },
      {
        label:  "0.5R losses → Phase 2 payout failure",
        detail: "The compounding curve · smallest risk change that breaks it",
        prompt: "Show me how a series of 0.5R losses compounds into a Phase 2 payout failure given my current risk model, then suggest the smallest change to risk-per-trade that breaks the chain — with the math.",
        topic:  "Risk math",
        side:   "a",
      },
      {
        label:  "Top Sharpe · EUR pairs this month",
        detail: "Trader · pair coverage · holding period · avg R",
        prompt: "Who has the highest Sharpe on EUR pairs in the community this month, what pairs they're trading, their average holding period, and their average R-per-trade — anonymised handles.",
        topic:  "Leaderboard",
        side:   "b",
      },
      {
        label:  "Funded traders' top setups this week",
        detail: "Highest hit-rate · grouped by session · pair · risk-per-trade",
        prompt: "What setups have funded traders run this week with the highest hit rate, broken down by session, pair, and average risk-per-trade. Surface only setups with ≥30 trades in the sample.",
        topic:  "Funded plays",
        side:   "b",
      },
      {
        label:  "Best-passing mentor cohort · FTMO Phase 2",
        detail: "Highest pass rate · shared methodology · risk profile",
        prompt: "Which mentor's students are passing FTMO Phase 2 at the highest rate this quarter, the common methodology across the passers, and the average risk-per-trade their cohort runs.",
        topic:  "Mentor outcomes",
        side:   "b",
      },
    ],
  },
] as const

/* ─────────────────────────────────────────────────────────────────────────
   Public component
   ─────────────────────────────────────────────────────────────────────── */
export function AskQuickActions({ accent }: { accent: ThemeAccent }) {
  const askState    = useAskVantaryState()
  const oracleArmed = useOracleArmed()
  const state       = askState.state

  /* `suggesting` → EXPAND pair-card grid. Everything else collapses. */
  const mode: "panel" | "collapsed" =
    state === "suggesting" ? "panel" : "collapsed"

  /* Reduced-motion preference — strips spring-y entrances. */
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  /* Submit a prompt — both the cartouche state machine AND the legacy
     Oracle pipeline (so the AskAnswerSurface renders an answer). */
  const fire = React.useCallback((p: PromptDef) => {
    askState.submit(p.prompt, p.topic)
    oracleArmed.submit(p.prompt)
  }, [askState, oracleArmed])

  /* ── PROMPT-FIRE BUS ────────────────────────────────────────────────
        The wing-mounted <AxisWingPanel/> components live in a sibling
        React subtree (rendered from your-space.tsx inside the cartouche
        wings), so they cannot call `fire` directly. They dispatch
        `archio:prompt:fire` on the window with the PromptDef in
        detail; this hook forwards each event to `fire(p)` so the
        center-column path and the wing-column path are identical from
        the state machine's perspective. */
  React.useEffect(() => {
    function onWingFire(e: Event) {
      const detail = (e as CustomEvent<{ prompt?: PromptDef }>).detail
      if (detail && detail.prompt) {
        fire(detail.prompt)
      }
    }
    window.addEventListener("archio:prompt:fire", onWingFire as EventListener)
    return () => window.removeEventListener("archio:prompt:fire", onWingFire as EventListener)
  }, [fire])

  /* Esc handler when the panel is open. */
  React.useEffect(() => {
    if (mode !== "panel") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") askState.clear()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, askState])

  return (
    <motion.div
      initial={false}
      /* ── OUTER VERTICAL MARGINS · TIGHTENED ────────────────────────
            Per direct trader directive ("MORE CLOSED to THE FLIGHT
            DECK"): pull the 4-room navigator UP toward the ASK bar
            by removing dead vertical space this region was
            contributing to the layout chain.

            Previously (suggesting mode):
              · marginTop: 4    → tiny breathing band above pair-cards
              · marginBottom: 18 → 18px gap to the cockpit below

            Now (suggesting mode):
              · marginTop: 0    → pair-card cycler pill sits flush
                under the ASK bar so the visual handoff from ASK →
                EXECUTION/DEVELOPMENT pills is continuous (no air
                band between them).
              · marginBottom: 0 → the FLAME BREATHING COLUMN hanging
                44px below the cycler pill is now the ONLY thing
                between the pill and the 4-room navigator. Reads as
                "the flame burns INTO the rooms' top hairline" —
                exactly the metaphor the trader described.

            `overflow: visible` is preserved so the flame column can
            extend past this region's bounding box into the cockpit's
            top zone without being clipped. */
      animate={
        mode === "collapsed"
          ? { height: 0, opacity: 0, marginTop: 0, marginBottom: 0 }
          : { height: "auto", opacity: 1, marginTop: 0, marginBottom: 0 }
      }
      transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ overflow: "visible" }}
      role="region"
      aria-label="Ask quick actions"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === "panel" ? (
          <PairCardGrid
            key="panel"
            accent={accent}
            reduced={reduced}
            onSubmit={fire}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   PAIR CARD GRID · 2 chrome-less columns, each spanning 2 of the 4 room
   columns. No background, no border on the wrapper — the columns sit
   directly on the page so the prompts read as floating recommendations.
   ─────────────────────────────────────────────────────────────────── */
function PairCardGrid({
  accent, reduced, onSubmit,
}: {
  accent:   ThemeAccent
  reduced:  boolean
  onSubmit: (p: PromptDef) => void
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      className="grid relative"
      style={{
        /* 4-column track to match the rooms; each pair-card spans 2. */
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 18,
      }}
    >
      {PAIR_CARDS.map((pair, pi) => (
        <PairCard
          key={pair.axis}
          pair={pair}
          pi={pi}
          accent={accent}
          reduced={reduced}
          onSubmit={onSubmit}
        />
      ))}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   PAIR CARD · chrome-stripped column
   ───────────────────────────────────────────────────────────────────────
   Previously a heavily-styled card with a gradient surface and a
   border. NOW: just a positioning context for the prompt rail, the
   identity-bearing cycler bar, and the two breathing wire anchors
   beneath. No background, no border, no breathing border halo — the
   only visible surfaces are the prompt rows themselves and the cycler
   chip. This is the "remove the bullshit chrome" pass.
   ─────────────────────────────────────────────────────────────────── */
function PairCard({
  pair, pi, accent, reduced, onSubmit,
}: {
  pair:     PairCardDef
  pi:       number
  accent:   ThemeAccent
  reduced:  boolean
  onSubmit: (p: PromptDef) => void
}) {
  const cardEnterDelay  = 0.04 + pi * 0.08
  const wireDrawDelay   = cardEnterDelay + 0.22
  const promptBaseDelay = cardEnterDelay + 0.10

  /* ── ASK-STATE AWARENESS ─────────────────────────────────────────────
        When the ASK bar is engaged (state === "suggesting"), the inline
        EXECUTION / DEVELOPMENT pill at the bottom of this card LIFTS
        UP into the cartouche wing on its side (left wing for pi=0,
        right wing for pi=1) to flank "Welcome back, Marcus." This is
        achieved with a shared `layoutId` on both the inline pill
        (rendered below) and the wing pill (rendered in your-space.tsx
        as <AxisIdentityPill/>). Framer Motion will animate the
        position morph automatically when one unmounts and the other
        mounts with the same layoutId. */
  const { state: askVantaryState } = useAskVantaryState()
  const isPillLifted = askVantaryState === "suggesting"
  const pillLayoutId = `archio-axis-pill-${pi}`

  /* ── PAGINATION ─────────────────────────────────────────────────── */
  const totalPages = Math.max(1, Math.ceil(pair.prompts.length / PROMPTS_PER_PAGE))
  const [pageIndex, setPageIndex] = React.useState(0)
  const pageStart = (pageIndex % totalPages) * PROMPTS_PER_PAGE
  const visiblePrompts = pair.prompts.slice(pageStart, pageStart + PROMPTS_PER_PAGE)

  const cyclePage = React.useCallback(() => {
    setPageIndex((i) => (i + 1) % totalPages)
  }, [totalPages])

  /* ── AUTO-CYCLE TIMER ───────────────────────────────────────────────
        Auto-advance every 5.5s. Paused while the cursor is over the
        card so the trader can read. Manual click via the cycler bar
        also fires `cyclePage`. */
  const pausedRef = React.useRef(false)
  React.useEffect(() => {
    if (reduced || totalPages <= 1) return
    const intervalMs = 5500
    const id = window.setInterval(() => {
      if (pausedRef.current) return
      setPageIndex((i) => (i + 1) % totalPages)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [reduced, totalPages])

  /* ── WING-PILL CYCLE BUS ────────────────────────────────────────────
        Per trader directive, the EXECUTION / DEVELOPMENT identity pill
        no longer sits at the bottom of each pair-card here — it has
        been lifted UP into the cartouche wings (rendered by
        `<AxisIdentityPill/>` mounted inside the left/right wings in
        `your-space.tsx`) so it flanks Marcus when ASK is engaged.
        That decouples the pill from this card's React subtree.

        To preserve manual cycling: when the wing pill is clicked it
        dispatches an `archio:axis-pill:cycle` CustomEvent with the
        `pi` of the pair-card it represents. Each pair-card here
        listens for that event and advances its own page index when
        the `pi` matches. Auto-cycle (5.5s timer above) continues to
        run independently. */
  React.useEffect(() => {
    function onCycleEvent(e: Event) {
      const detail = (e as CustomEvent<{ pi?: number }>).detail
      if (detail && detail.pi === pi) {
        setPageIndex((i) => (i + 1) % totalPages)
      }
    }
    window.addEventListener("archio:axis-pill:cycle", onCycleEvent as EventListener)
    return () => window.removeEventListener("archio:axis-pill:cycle", onCycleEvent as EventListener)
  }, [pi, totalPages])

  /* ── TAGLINE · STATIC (rotator removed per trader directive) ─────────
        Previously this block hosted an independent 4.5s cross-fade
        timer that cycled four white "facet" taglines through the
        pill. The trader removed it: a white phrase that mutates
        every 4.5s competes with the durable axis identity and pulls
        the eye. The pill now displays a SINGLE accent-colored phrase
        (`pair.axisStatic`) in the same caps-mono treatment as the
        axis label, so "EXECUTION · TRADE THE SESSION" reads as one
        typographic ribbon. No useState, no useEffect, no
        AnimatePresence — `activeTagline` is just a derived constant
        so the JSX template below required no structural change. */
  const activeTagline = pair.axisStatic

  /* Unique keyframe id so multiple cards never collide on wire/breathe
     animations. */
  const kfId = React.useId().replace(/:/g, "")

  return (
    <motion.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.46, delay: cardEnterDelay, ease: [0.22, 0.61, 0.36, 1] }}
      onMouseEnter={() => { pausedRef.current = true  }}
      onMouseLeave={() => { pausedRef.current = false }}
      className="relative"
      style={{
        /* Span 2 of the 4 columns. */
        gridColumn: "span 2",
        /* ── CHROME-LESS CARD CONTAINER ───────────────────────────────
              No background, no border, no shadow at the CARD level. The
              card is just a layout context for three independently
              hoverable prompt bubbles. The bubble + shimmer chrome
              lives at the per-row level (PromptRow) so each suggestion
              gets its own hover/unhover animation in isolation —
              hovering one row never affects the others. */
        background: "transparent",
        border:     "none",
        boxShadow:  "none",
        /* Top padding is minimal so the first prompt bubble sits close
           to the gadget bar above the card. The cycler bar at the
           bottom gets a slightly larger margin via its own `marginTop`
           below. */
        padding:    "4px 8px 6px",
        display:    "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 0,
      }}
    >
      {/* ──────────────────────────────────────────────────────────────
            STACK ORDER (per trader directive — pill ABOVE prompts)
            ──────────────────────────────────────────────────────────
              1. Inline EXECUTION / DEVELOPMENT identity pill  (top)
              2. Three paginated prompt rows                    (below)

            The pill anchors the card's identity FIRST, and the
            recommended questions read as a direct continuation of
            that identity — "EXECUTION · TRADE THE SESSION" then
            three EXECUTION-flavoured prompts, etc. When ASK is
            engaged the pill lifts to the wing (shared `layoutId`)
            and the prompts naturally close the gap. */}
      {/* ── INLINE CYCLER PILL REMOVED ─────────────────────────────────
            Per trader directive: the EXECUTION / DEVELOPMENT identity
            pill that used to sit at the bottom of each pair-card has
            been LIFTED into the cartouche wings (mounted by
            `<AxisIdentityPill/>` inside the wing wrappers in
            `your-space.tsx`) so the two pills flank "Welcome back,
            Marcus." when ASK is engaged. The wing widgets unmount
            simultaneously to make space.

            What lived here previously:
              · the rotating refresh glyph + breathing dot + axis
                label + vertical rule + static ribbon cluster
                (now inside the wing pill — single source of truth)
              · the two "reception" radial glows on the pill's
                underside that bridged to the rooms below (removed
                because the wing pill is too far from the rooms for
                those glows to read as a connection — the bridging
                role is now played by the per-room ignition embers
                rising from each room's top edge)
              · the local `aqa-reception` keyframe (now dead, removed
                — see below where the <style> block used to live)

            What remains in this pair-card: pure prompt rail (3
            paginated rows) with no chrome under it. The card's
            identity is communicated by the wing pill above; the
            rows here are pure typographic recommendations. */}
      {/* ── INLINE PAIR-CARD PILL ───────────────────────────────────────
            The EXECUTION / DEVELOPMENT identity pill lives at the
            bottom of each pair-card in IDLE state (its default, anchor
            position — directly above the 4-room navigator, visually
            "feeding" the two rooms below). When ASK is engaged, this
            instance UNMOUNTS via AnimatePresence and a matching pill
            with the SAME `layoutId` simultaneously mounts inside the
            cartouche wing (see <AxisIdentityPill/>). Framer Motion's
            shared-layout system animates the position morph from
            card-bottom → wing-center automatically — the pill is
            never duplicated, only relocated.

            `mode="wait"` is intentionally omitted here so the wing
            mount can be received WHILE this one is exiting,
            otherwise Framer cannot bridge the two via layoutId. */}
      <AnimatePresence initial={false}>
      {!isPillLifted && (
      <motion.button
        key="inline-pill"
        layoutId={pillLayoutId}
        type="button"
        onClick={cyclePage}
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.36, delay: cardEnterDelay + 0.28, ease: [0.22, 0.61, 0.36, 1] }}
        whileHover={reduced ? undefined : { y: -1 }}
        whileTap={{ scale: 0.995 }}
        className="font-sans relative inline-flex items-center justify-center w-full self-center"
        style={{
          maxWidth: 380,
          margin:   "0 auto",
          gap:      12,
          /* Slightly more vertical breathing for the heavier glass treatment. */
          padding:  "11px 18px",
          height:   42,
          borderRadius: 999,
          /* ── BILLION-LUXURY GLASS PILL ──────────────────────────────
                A three-stop top-down gradient with a very subtle inner
                bright band gives the pill a specular highlight at the
                top edge — like light reflecting off polished glass.
                The hairline border is now a hair brighter, paired with
                inner-shadow rings (one bright at the top, one dark at
                the bottom) so the pill reads as a CARVED object with
                depth, not a flat chip. The outer accent halo is
                slightly larger (28px vs 22px) for that "this object
                holds energy" feel. */
          background:
            `linear-gradient(180deg, ` +
            `${vgRgba(accent.rgb, 0.22)} 0%, ` +
            `${vgRgba(accent.rgb, 0.10)} 26%, ` +
            `${vgRgba(accent.rgb, 0.045)} 100%)`,
          /* ── HARD OUTER BORDER REMOVED ─────────────────────────────
                Previously had `border: 1px solid accent` which read as
                a competing "main border on all sides" wrapping around
                the inner glass character (gradient + top sheen + inset
                rings). The trader sees those inner elements as the
                real high-quality surface, so the hard outer outline
                is gone. The pill's edge is now defined ONLY by the
                inset shadow rings (top bright specular line, bottom
                dark line, 1px white inset ring) — giving a softer,
                more carved-from-glass appearance with no harsh
                lasso around the outside. */
          border:     "none",
          boxShadow:
            `0 1px 0 ${vgRgba(accent.rgb, 0.28)} inset, ` +   // top specular line
            `0 -1px 0 rgba(0,0,0,0.30) inset, ` +              // bottom shadow line
            `0 0 0 1px rgba(255,255,255,0.04) inset, ` +
            `0 8px 24px rgba(0,0,0,0.34), ` +
            `0 0 28px ${vgRgba(accent.rgb, 0.18)}`,
          color:      VG_VT.paper,
          cursor:     "pointer",
          /* Drop `border-color` from the transition list — no border to animate. */
          transition: "background 240ms, box-shadow 240ms, transform 240ms",
          overflow:   "hidden",
        }}
        onMouseEnter={(e) => {
          const t = e.currentTarget
          t.style.background =
            `linear-gradient(180deg, ` +
            `${vgRgba(accent.rgb, 0.30)} 0%, ` +
            `${vgRgba(accent.rgb, 0.14)} 26%, ` +
            `${vgRgba(accent.rgb, 0.06)} 100%)`
          t.style.boxShadow =
            `0 1px 0 ${vgRgba(accent.rgb, 0.38)} inset, ` +
            `0 -1px 0 rgba(0,0,0,0.34) inset, ` +
            `0 0 0 1px rgba(255,255,255,0.05) inset, ` +
            `0 10px 28px rgba(0,0,0,0.40), ` +
            `0 0 38px ${vgRgba(accent.rgb, 0.30)}`
        }}
        onMouseLeave={(e) => {
          const t = e.currentTarget
          t.style.background =
            `linear-gradient(180deg, ` +
            `${vgRgba(accent.rgb, 0.22)} 0%, ` +
            `${vgRgba(accent.rgb, 0.10)} 26%, ` +
            `${vgRgba(accent.rgb, 0.045)} 100%)`
          t.style.boxShadow =
            `0 1px 0 ${vgRgba(accent.rgb, 0.28)} inset, ` +
            `0 -1px 0 rgba(0,0,0,0.30) inset, ` +
            `0 0 0 1px rgba(255,255,255,0.04) inset, ` +
            `0 8px 24px rgba(0,0,0,0.34), ` +
            `0 0 28px ${vgRgba(accent.rgb, 0.18)}`
        }}
      >
        {/* ── TOP SPECULAR SHEEN · REMOVED ────────────────────────────��
              Previously a `position: absolute; top: 0; left: 8%; right: 8%;
              height: 42%; border-radius: 999px 999px 0 0` highlight
              lived here as a "polished glass" sheen. Because it was
              inset 8% from each side AND had rounded top corners, the
              two gaps on either side framed it like rounded brackets
              `( )` — exactly the inner cloud the trader called out as
              redundant against the outer pill silhouette. Removed
              entirely. The pill keeps its glass character via:
                · the existing top-down gradient fill
                · the inset specular line (`0 1px 0 inset`)
                · the bottom inset shadow line
                · the 1px white inset ring
              — all of which span the FULL pill width with the same
              999px border-radius, so there is no longer any inner
              shape competing with the outer border. */}
        {/* Refresh icon · slow continuous rotation. */}
        <span
          aria-hidden
          className="inline-flex items-center justify-center"
          style={{
            width: 22, height: 22, borderRadius: 999,
            background: vgRgba(accent.rgb, 0.18),
            border:     `1px solid ${vgRgba(accent.rgb, 0.36)}`,
            color:      accent.hex,
            flexShrink: 0,
          }}
        >
          <motion.span
            animate={reduced ? undefined : { rotate: 360 }}
            transition={reduced ? undefined : { duration: 14, repeat: Infinity, ease: "linear" }}
            style={{ display: "inline-flex" }}
          >
            <RefreshCw size={11} strokeWidth={1.9} />
          </motion.span>
        </span>

        {/* ── IDENTITY CLUSTER · CENTERED ──────────────────���─────────
              The cluster of breathing dot · AXIS · vertical separator ·
              tagline is now a NATURAL-WIDTH inline group (no `flex:1`
              fill) so it sits centered inside the button's `justify-
              center` axis. The old `1 / 2` counter chip that used to
              be pinned to the right edge has been removed entirely —
              page progress is communicated by the slowly-rotating
              refresh icon on the left (continuous spin reads as
              "live AI cycling") and by the page-swap animation on
              each cycle, not by a numeric counter. */}
        <span className="flex items-center min-w-0" style={{ gap: 7 }}>
          <motion.span
            aria-hidden
            animate={reduced ? undefined : { opacity: [0.55, 1, 0.55], scale: [1, 1.18, 1] }}
            transition={reduced ? undefined : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 6, height: 6, borderRadius: 999,
              background: accent.hex,
              boxShadow: `0 0 8px ${vgRgba(accent.rgb, 0.75)}`,
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.32em",
              color: accent.hex,
              textShadow: `0 0 6px ${vgRgba(accent.rgb, 0.45)}`,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {pair.axis}
          </span>
          <span
            aria-hidden
            style={{
              width: 1, height: 11,
              background: vgRgba(accent.rgb, 0.34),
              flexShrink: 0,
            }}
          />
          {/* ── STATIC SECOND-PART RIBBON · matches axis label exactly ─
                Per trader directive: the previous cross-fading WHITE
                tagline (`color: VG_VT.paperDim`, fontSize: 11.5,
                font-sans, AnimatePresence with vertical drift) is
                gone. It pulled the eye every 4.5s and broke the
                durable identity. The replacement renders the static
                phrase (`activeTagline`) in the EXACT same treatment
                as the axis label to the left — caps-mono, accent
                color, 0.32em letter-spacing, accent textShadow — so
                "EXECUTION · TRADE THE SESSION" lands as one
                continuous typographic ribbon in the trader's
                accent. No animation, no AnimatePresence, no
                state-driven rerender on this surface anymore. */}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.32em",
              color: accent.hex,
              textShadow: `0 0 6px ${vgRgba(accent.rgb, 0.45)}`,
              whiteSpace: "nowrap",
              flexShrink: 0,
              lineHeight: 1.3,
            }}
          >
            {activeTagline}
          </span>
        </span>
      </motion.button>
      )}
      </AnimatePresence>

      {/* ── PILL UNDERSIDE · DUAL RECEPTION GLOWS ────────────────────
            REDESIGN per direct trader directive: "remove horizontal
            burning on execution and development tab! can you please
            make the fire to come from the top hbar of the
            marketfloor and studio. like border to burn realistically
            and have some breathing energetic connection." The flame
            source has MOVED from beneath this pill down to the
            TOP BORDER of the 4 rooms (see
            `FlightDeckRoomIgnitionOverlay` rendered in
            `FlightDeckCockpitWithCustomizer` in `your-space.tsx`).

            What remains here on the pill is the RECEPTION layer —
            the visual evidence that THIS pill is being fed by the
            two rooms beneath it. Two small accent reception glows
            sit on the pill's underside, NOT centered but positioned
            at ~22% and ~78% of the pill's width, so each glow
            visually aligns with one of the two rooms below
            (room 1 left, room 2 right, for the EXECUTION pill on
            the left pair-card; room 3 left, room 4 right, for the
            DEVELOPMENT pill on the right pair-card). Each reception
            glow breathes on a slow 2.4s cycle, mirroring the
            room-flame breathing below — the eye reads the pill as
            DRINKING from those two specific rooms, not floating
            above an undifferentiated flame column.

            ANCHORED to the rooms below: each reception glow is
            positioned at a fixed % of the pill's width (~22% and
            ~78%) — these positions approximate the centers of the
            two rooms beneath the pair-card (rooms 0+1 below the
            left pair-card, rooms 2+3 below the right pair-card).
            Since the pill is the narrower child of a pair-card that
            spans 1/2 of the cartouche width, the pill itself
            bridges the two rooms below it; ~22% and ~78% of the
            pill's width fall close to each room's horizontal center.

            EACH RECEPTION GLOW is a small radial that:
              · sits on the pill's bottom lip (`bottom: -2`)
              · breathes via opacity + scaleX on a 2.4s cycle
              · uses `mix-blend-mode: screen` so it adds light to
                the pill's existing gradient fill rather than
                painting opaquely
              · is staggered with a 0.6s delay between left and
                right so the two spots never peak together — the
                eye reads the pill as drinking from both rooms but
                on each room's own rhythm. */}
      {/* ── RECEPTION GLOWS · STRUCTURALLY HIDDEN ────────────────────
            With the identity pill lifted into the wings, the underside
            reception glows that visually fed the in-card pill from
            the two rooms below it have no anchor anymore. The IIFE
            below is wrapped in `false && (...)` so it never executes
            and its DOM nodes never mount. Kept inline (rather than
            deleted) for symmetry with the inline-pill block above. */}
      {false && ((() => {
        const SPOTS = [
          { x: 22, delay: 0.0, label: "room-left"  },
          { x: 78, delay: 0.6, label: "room-right" },
        ]
        return (
          <>
            {SPOTS.map((s) => (
              <motion.span
                key={`reception-${s.label}`}
                aria-hidden
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: wireDrawDelay, ease: [0.22, 0.61, 0.36, 1] }}
                style={{
                  position: "absolute",
                  left: `${s.x}%`,
                  bottom: -1,
                  transform: "translateX(-50%)",
                  width: 38,
                  height: 11,
                  background:
                    `radial-gradient(ellipse 70% 100% at 50% 0%, ` +
                    `${vgRgba(accent.rgb, 0.82)} 0%, ` +
                    `${vgRgba(accent.rgb, 0.42)} 35%, ` +
                    `${vgRgba(accent.rgb, 0.12)} 70%, ` +
                    `transparent 92%)`,
                  filter: "blur(2.5px)",
                  pointerEvents: "none",
                  mixBlendMode: "screen",
                  zIndex: 4,
                  animation: reduced ? undefined : `aqa-reception-${kfId} 2.4s ${s.delay}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </>
        )
      })())}

      {/* Local keyframes — kept inert (the reception keyframe is
          unreachable now that the glows IIFE is wrapped in
          `false &&`, but we keep the <style> block alive so
          `kfId` continues to be referenced and any future
          re-enabling of the in-card variant remains low-effort). */}
      {false && !reduced && (
        <style>{`
          @keyframes aqa-reception-${kfId} {
            /* Slow 2.4s breathing — the reception glow gently
               brightens + widens, then settles. Synced (by ear, no
               JS) with the flame breathing on the rooms below via
               matched 2.4–3.5s cadences, so the eye reads the two
               systems as ONE living energy circuit. */
            0%   { opacity: 0.45; transform: translateX(-50%) scaleX(0.88); }
            100% { opacity: 1;    transform: translateX(-50%) scaleX(1.10); }
          }
        `}</style>
      )}

      {/* ── PROMPT LIST · centered, paginated (3 at a time) ───────────
            Sits DIRECTLY below the EXECUTION / DEVELOPMENT pill in
            idle state. When ASK is engaged (`isPillLifted` === true)
            the entire prompt list UNMOUNTS — the prompts re-mount in
            the cartouche wings via <AxisWingPanel/> (one panel per
            wing), directly beneath the lifted EXECUTION / DEVELOPMENT
            bars. This keeps the center column free for the welcome
            stack + ASK bar while ASK is the focus, and avoids
            duplicate prompt surfaces. */}
      <AnimatePresence mode="wait" initial={false}>
        {!isPillLifted && (
          <motion.div
            key={pageIndex}
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.26, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col items-center"
            style={{ gap: 6, width: "100%", marginTop: 6 }}
          >
            {visiblePrompts.map((p, idx) => (
              <PromptRow
                key={`${pageIndex}-${p.label}`}
                prompt={p}
                index={idx + 1}
                isLast={idx === visiblePrompts.length - 1}
                accent={accent}
                reduced={reduced}
                delay={pageIndex === 0 ? promptBaseDelay + idx * 0.07 : idx * 0.06}
                onClick={() => onSubmit(p)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   PROMPT ROW · editorial-luxe, chrome-less
   ───────────────────────────────────────────────────────────────────────
   Total rewrite of the prompt surface based on direct trader feedback:

     "remove the background to be this big... I would remove that and
      express something different. Looks really funny. I want to
      express the UI UX of the suggestions differently — high quality
      billion dollar luxury archio glassy design."

   The new pattern strips ALL the chip / card chrome that made the
   previous rows feel boxy:

     ✗ no rectangular background
     ✗ no border
     ✗ no drop shadow
     ✗ no diamond glyph on the left
     ✗ no upward arrow on the right

   In its place: an editorial spread composition — like a Vogue feature
   page or an Hermès magazine module. Each prompt is a centered
   typographic block:

     ┌────────────────────────────��──────────────────────┐
     │                                                   │
     │                     · 01 ·                        │   ← caps-mono
     │                                                   ��      accent index
     │           Tag my last 20 trades by setup          │   ← 14px label
     │      ORB · FVG · sweep · MSS — win rate, R…       │   ← 11px caption
     │                                                   │
     │                  ─────────────                    │   ← hairline that
     │                                                   │      DRAWS inward
     └───────────────────────────────────────────────────┘      on hover

   The hover sequence is what carries the "billion dollar" feel
   (preserved from prior version, but now without the box around it):

     1. The diagonal SHIMMER sheen sweeps across the text (still loved
        by the user — kept and amplified now that there's no box to
        compete with).
     2. The label color brightens by ~10%, the caption color shifts
        from `paperDim` toward an accent-tinted warm.
     3. The index number `01` brightens from dim to accent-glow.
     4. The thin accent HAIRLINE beneath the row scales from width 0
        out to its full width via a center-anchored `scaleX` transform —
        feels like an underline being drawn live.
     5. Whole row lifts `y: -1`.

   Row dividers (the soft hairline ABOVE every row except the first)
   are rendered by the parent column layout — not the row itself — so
   the row stays a pure typographic surface.
   ─────────────────────────────────────────────────────────────────── */
function PromptRow({
  prompt, index, isLast, accent, reduced, delay, onClick,
}: {
  prompt:  PromptDef
  index:   number
  /** Reserved for future divider-style variations (currently unused —
      retained on the prop contract so the parent can stay unchanged). */
  isLast:  boolean
  accent:  ThemeAccent
  reduced: boolean
  delay:   number
  onClick: () => void
}) {
  /* Side-aware entry — preserved from prior version. Room-A prompts
     ghost in from the left, room-B prompts from the right. */
  const enterDx = prompt.side === "b" ? 10 : -10
  const [hover, setHover] = React.useState(false)
  /* 2-digit zero-padded index for the editorial marker. */
  const indexLabel = String(index).padStart(2, "0")

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: enterDx }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.36, delay, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -1 }}
      whileTap={{ scale: 0.997 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="font-sans relative"
      style={{
        /* ── CHROME-LESS PROMPT ROW ────────────────────────────────────
              ALL bubble chrome has been moved out — no background,
              no border, no shadow, no shimmer overlay. The flashy
              sheen now lives at the room-label level (see
              `FlightDeckRoom` in your-space.tsx) which is where the
              trader wanted it. The prompt is pure editorial
              typography that lights up its index marker, label,
              caption, and accent hairline on hover. */
        width:    "100%",
        maxWidth: 580,
        padding:  "9px 22px 11px",
        background: "transparent",
        border:    "none",
        boxShadow: "none",
        color:     VG_VT.paper,
        cursor:    "pointer",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {/* ── INDEX MARKER · "· 01 ·" ──���─────────────────────────────────
            Editorial caps-mono index. Surrounded by two thin accent
            mini-dashes that read like a "drop cap" treatment in a
            print magazine. Dim at idle, brightens to accent + soft
            glow on hover. */}
      <span
        aria-hidden
        className="font-mono uppercase inline-flex items-center"
        style={{
          gap: 8,
          fontSize: 9.5,
          letterSpacing: "0.34em",
          color: hover ? accent.hex : vgRgba(accent.rgb, 0.55),
          textShadow: hover ? `0 0 8px ${vgRgba(accent.rgb, 0.55)}` : "none",
          transition: "color 280ms, text-shadow 280ms",
          marginBottom: 2,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 14,
            height: 1,
            background: hover ? vgRgba(accent.rgb, 0.6) : vgRgba(accent.rgb, 0.28),
            transition: "background 280ms",
          }}
        />
        <span>{indexLabel}</span>
        <span
          aria-hidden
          style={{
            width: 14,
            height: 1,
            background: hover ? vgRgba(accent.rgb, 0.6) : vgRgba(accent.rgb, 0.28),
            transition: "background 280ms",
          }}
        />
      </span>

      {/* ── LABEL · the verb-first headline ──────────────────────────
            Largest type in the row. Slight tracking applied because
            sans-serif at 14-15px reads more editorial with a tiny
            negative letter-spacing (-0.011em). On hover it gently
            warms toward a near-white luminance (no aggressive color
            shift — the shimmer + hairline do the heavy lifting). */}
      <span
        className="font-sans"
        style={{
          fontSize: 14.5,
          fontWeight: 500,
          lineHeight: 1.3,
          letterSpacing: "-0.011em",
          textAlign: "center",
          color: hover ? "#FFFFFF" : VG_VT.paper,
          textShadow: hover ? `0 0 14px ${vgRgba(accent.rgb, 0.22)}` : "none",
          transition: "color 240ms, text-shadow 240ms",
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {prompt.label}
      </span>

      {/* ── CAPTION · the answer-preview detail ──────────────────────
            One-line preview of what the AI's answer will cover. Stays
            in `paperDim` at idle but warms toward an accent-tinted
            value on hover. Italic NOT used (kept clean for trader
            readability). */}
      <span
        className="font-sans"
        style={{
          fontSize: 11.5,
          lineHeight: 1.45,
          letterSpacing: "-0.003em",
          textAlign: "center",
          color: hover ? vgRgba(accent.rgb, 0.92) : VG_VT.paperDim,
          opacity: hover ? 1 : 0.78,
          transition: "color 280ms, opacity 280ms",
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {prompt.detail}
      </span>

      {/* ── ACCENT HAIRLINE · draws on hover ──────────────────────────
            A 1px accent rule beneath the caption. Center-anchored
            `scaleX` transform takes it from 0 → 1 on hover for that
            "live underline drawing" feel. At idle it's invisible so
            the row reads as pure typography — no chrome at all. */}
      <span
        aria-hidden
        style={{
          marginTop: 6,
          width: 72,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${accent.hex} 50%, transparent 100%)`,
          boxShadow: hover ? `0 0 8px ${vgRgba(accent.rgb, 0.6)}` : "none",
          transform: hover ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "center center",
          transition: "transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 280ms",
        }}
      />

      {/* Inter-row hairline divider was removed — each row now owns
          a visible rounded bubble, so a divider underneath every
          row would compete with the bubble's own border. The 6px
          gap on the parent flex column handles list rhythm. */}
    </motion.button>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   <AxisIdentityPill/>
   ───────────────────────────────────────────────────────────────────────────
   The EXECUTION · TRADE THE SESSION / DEVELOPMENT · MASTER THE EDGE
   identity pill — lifted out of the pair-card body so the cartouche
   wings in `your-space.tsx` can mount it when ASK enters `suggesting`
   state. The wings unmount their gadget widgets at the same time, so
   the two pills land beside "Welcome back, Marcus." (one per wing)
   exactly as the trader requested.

   PROPS
     pi:      0 (EXECUTION → left wing) | 1 (DEVELOPMENT → right wing)
     pair:    catalog entry from PAIR_CARDS[pi]
     accent:  ThemeAccent — palette for the glass gradient + halo
     reduced: optional reduced-motion override

   CYCLE INTEGRATION
     Clicking the pill dispatches a window-level
     `archio:axis-pill:cycle` CustomEvent with `{ pi }`. The matching
     `<PairCard pi={pi}/>` (rendered inside `<PairCardGrid/>` below
     the cartouche) listens for that event and advances its own
     pageIndex. This keeps PairCard pagination state local while the
     pill lives in a totally separate React subtree.

   STYLING
     Pixel-identical to the legacy in-card pill (glass gradient, inset
     specular line, inset shadow line, 1px white ring, outer accent
     halo, 14s slow refresh-glyph spin, breathing dot, caps-mono
     ribbon "AXIS · RIBBON" with vertical separator). Width tuned for
     the cartouche wing (340px max, was 380 in the card) so the pill
     fits comfortably inside the wing's column without crowding.

   ENTRY / EXIT
     Fades + slides 6px down on enter, 4px up on exit. The wing
     wrapper handles the parent AnimatePresence — this component only
     declares its own initial/animate/exit and Framer Motion does the
     crossfade with the outgoing widget surface above.
═════════════════════════════════════════════════════════════════════════════ */
export function AxisIdentityPill({
  pi,
  pair,
  accent,
  reduced = false,
}: {
  pi:       number
  pair:     PairCardDef
  accent:   ThemeAccent
  reduced?: boolean
}) {
  const handleClick = React.useCallback(() => {
    if (typeof window === "undefined") return
    window.dispatchEvent(
      new CustomEvent("archio:axis-pill:cycle", { detail: { pi } }),
    )
  }, [pi])

  return (
    <motion.button
      /* ── SHARED LAYOUT BRIDGE ────────────────────────────────────────
            Same layoutId used by the inline pair-card pill (which
            unmounts when ASK is engaged). Framer Motion will treat
            this newly-mounted pill as the continuation of that
            element and animate the position morph from the pair-card
            footer up to here in the wing — a single smooth, GPU-
            accelerated transition with no double-render. */
      layoutId={`archio-axis-pill-${pi}`}
      type="button"
      onClick={handleClick}
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout:  { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
        opacity: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] },
      }}
      whileHover={reduced ? undefined : { y: -1 }}
      whileTap={{ scale: 0.995 }}
      className="font-sans relative inline-flex items-center justify-center"
      style={{
        /* ── BORDERLESS / BACKGROUNDLESS LUXURY VARIANT ───────────────
              Per trader directive: "remove the border and background
              of the bars EXECUTION and DEVELOPMENT." The pill is now
              pure typography + glyph + a single breathing dot, floating
              in space with no chip, no fill, no stroke, no inset ring.
              All depth comes from the type itself (tracking, weight,
              soft text-shadow) and a tiny ambient drop-shadow under
              the glyph — the most expensive look is always the one
              that removes the most chrome. */
        maxWidth: 340,
        width: "100%",
        margin: "0 auto",
        gap: 12,
        padding: "8px 14px",
        height: "auto",
        background: "transparent",
        border: "none",
        boxShadow: "none",
        color: VG_VT.paper,
        cursor: "pointer",
        transition: "transform 240ms, filter 240ms",
        overflow: "visible",
      }}
    >
      {/* Refresh glyph · borderless, just the accent-tinted icon with
          a soft drop-shadow so it reads as a piece of LIGHT rather
          than a UI chip. */}
      <span
        aria-hidden
        className="inline-flex items-center justify-center"
        style={{
          width: 16, height: 16,
          color: accent.hex,
          flexShrink: 0,
          filter: `drop-shadow(0 0 6px ${vgRgba(accent.rgb, 0.55)})`,
        }}
      >
        <motion.span
          animate={reduced ? undefined : { rotate: 360 }}
          transition={reduced ? undefined : { duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ display: "inline-flex" }}
        >
          <RefreshCw size={13} strokeWidth={1.6} />
        </motion.span>
      </span>

      {/* Identity cluster · breathing dot · axis · separator · ribbon */}
      <span className="flex items-center min-w-0" style={{ gap: 7 }}>
        <motion.span
          aria-hidden
          animate={reduced ? undefined : { opacity: [0.55, 1, 0.55], scale: [1, 1.18, 1] }}
          transition={reduced ? undefined : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 6, height: 6, borderRadius: 999,
            background: accent.hex,
            boxShadow: `0 0 8px ${vgRgba(accent.rgb, 0.75)}`,
            flexShrink: 0,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.32em",
            color: accent.hex,
            textShadow: `0 0 6px ${vgRgba(accent.rgb, 0.45)}`,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {pair.axis}
        </span>
        <span
          aria-hidden
          style={{
            width: 1, height: 11,
            background: vgRgba(accent.rgb, 0.34),
            flexShrink: 0,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.32em",
            color: accent.hex,
            textShadow: `0 0 6px ${vgRgba(accent.rgb, 0.45)}`,
            whiteSpace: "nowrap",
            flexShrink: 0,
            lineHeight: 1.3,
          }}
        >
          {pair.axisStatic}
        </span>
      </span>
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   AXIS WING PANEL · pill + 3 prompts, stacked vertically
   ───────────────────────────────────────────────────────────────────────
   Mounted inside each cartouche wing (left = pi 0, right = pi 1) when
   ASK is engaged. Renders the EXECUTION / DEVELOPMENT axis pill at the
   top and the three paginated prompts DIRECTLY UNDERNEATH — per trader
   directive: "questions to be below the bars on the left and right."

   Self-contained pagination state, with the SAME 5.5s auto-cycle timer
   and `archio:axis-pill:cycle` event listener used by <PairCard/>, so
   both surfaces (this wing panel + the inline pair-card mirror) stay
   advancing in lockstep. Prompt clicks dispatch `archio:prompt:fire`
   on the window — <AskQuickActions/> listens for it and forwards to
   the shared `fire(p)` handler that drives the cartouche state machine
   and the legacy oracle pipeline.

   The pill keeps the same `layoutId` (`archio-axis-pill-{pi}`) as the
   inline pill in <PairCard/>, so Framer Motion morphs its position
   from the card-footer into this wing slot whenever the panel mounts.
   ─────────────────────────────────────────────────────────────────── */
export function AxisWingPanel({
  pi, pair, accent, reduced,
}: {
  pi:      number
  pair:    PairCardDef
  accent:  ThemeAccent
  reduced: boolean
}) {
  /* Pagination — TWO prompts per page in the wing (per trader
     directive: "make only 2 suggestion answers, remove the number 3").
     The center pair-cards (idle mode) still show 3 — only the
     wing-mounted ASK panel is tightened to a cleaner two-row stack
     so it fits comfortably above the 4-room navigator without
     overlap. */
  const WING_PROMPTS_PER_PAGE = 2
  const totalPages = Math.max(1, Math.ceil(pair.prompts.length / WING_PROMPTS_PER_PAGE))
  const [pageIndex, setPageIndex] = React.useState(0)
  const pageStart      = (pageIndex % totalPages) * WING_PROMPTS_PER_PAGE
  const visiblePrompts = pair.prompts.slice(pageStart, pageStart + WING_PROMPTS_PER_PAGE)

  /* Auto-advance every 5.5s — paused while hovered. */
  const pausedRef = React.useRef(false)
  React.useEffect(() => {
    if (reduced || totalPages <= 1) return
    const id = window.setInterval(() => {
      if (pausedRef.current) return
      setPageIndex((i) => (i + 1) % totalPages)
    }, 5500)
    return () => window.clearInterval(id)
  }, [reduced, totalPages])

  /* Listen to the shared cycle bus so clicking ANY pill anywhere on
     screen advances this wing's prompts too. */
  React.useEffect(() => {
    function onCycle(e: Event) {
      const detail = (e as CustomEvent<{ pi?: number }>).detail
      if (detail && detail.pi === pi) {
        setPageIndex((i) => (i + 1) % totalPages)
      }
    }
    window.addEventListener("archio:axis-pill:cycle", onCycle as EventListener)
    return () => window.removeEventListener("archio:axis-pill:cycle", onCycle as EventListener)
  }, [pi, totalPages])

  return (
    <div
      onMouseEnter={() => { pausedRef.current = true  }}
      onMouseLeave={() => { pausedRef.current = false }}
      className="flex flex-col items-center"
      /* gap:0 → the bare-typography pill and the first prompt row now
         hug, separated only by the pill's own internal vertical
         padding (8px). Per trader directive: "move questions more
         closer to it." */
      style={{ gap: 0, width: "100%", maxWidth: 380, padding: "0 8px" }}
    >
      {/* Pill — same layoutId as the inline pair-card pill so Framer
          Motion morphs the position smoothly when this panel mounts /
          unmounts. */}
      <AxisIdentityPill
        pi={pi}
        pair={pair}
        accent={accent}
        reduced={reduced}
      />

      {/* Prompt rail — three glass surfaces directly beneath the pill.
          Page swaps cross-fade in place; row click → fire bus. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pageIndex}
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.26, ease: [0.22, 0.61, 0.36, 1] }}
          className="flex flex-col items-center"
          /* Negative top-margin pulls the first row up under the pill's
             bottom padding line — visually anchors the questions as a
             direct continuation of the EXECUTION / DEVELOPMENT axis.
             gap:2 → prompt rows nearly touch, reading as one tight,
             premium typographic block instead of three loose chips. */
          style={{ gap: 2, width: "100%", marginTop: -2 }}
        >
          {visiblePrompts.map((p, idx) => (
            <PromptRow
              key={`${pi}-${pageIndex}-${p.label}`}
              prompt={p}
              index={idx + 1}
              isLast={idx === visiblePrompts.length - 1}
              accent={accent}
              reduced={reduced}
              delay={idx * 0.06}
              onClick={() => {
                /* Cross-component submit bus — <AskQuickActions/>
                   listens and calls `fire(p)`. */
                window.dispatchEvent(
                  new CustomEvent("archio:prompt:fire", { detail: { prompt: p } })
                )
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
