"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  FLIGHT DECK REVEAL  ·  scroll-driven dashboard chrome system
 *  ───────────────────────────────────────────────────────────────────────
 *  The dashboard's editorial preface (Welcome / Ask-Me-Anything / Flight
 *  Deck Cockpit, all wrapped inside <JarvisWelcomeBand/>) is OPEN by
 *  default — that's what greets the trader on load. As they begin to
 *  scroll DOWN, the deck collapses smoothly and the institutional
 *  signal terminal (TradingView bay) rises into focus, filling the
 *  viewport. Scrolling back UP at the top of the page brings the deck
 *  back, with the same hero animation.
 *
 *  The choreography:
 *
 *    Page load           Deck rendered open. No mount animation.
 *    Scroll DOWN at top  → conceal()
 *                          · deck collapses (height 0, opacity fades)
 *                          · page smooth-scrolls to top so the trading
 *                            desk lifts into the viewport without a jolt
 *                          · ticker strip FLIPs from above-deck to
 *                            above-desk via shared layoutId
 *    Scroll UP at top    → reveal()
 *                          · search bar pulses amber (portal of origin)
 *                          · vertical beam descends from search bar
 *                          · horizontal hairline races across deck top
 *                          · deck height expands (0 → auto, cubic ease)
 *                          · inner content lifts in (y -18 → 0)
 *                          · ticker strip FLIPs back above the deck
 *    Ctrl/Cmd+Shift+F    → toggle (treats search bar as portal)
 *    Escape              → conceal if open
 *
 *  Reduced-motion users get a simple opacity crossfade.
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion"
/* (ChevronDown import removed — its only consumer was the deleted
 *  CollapseHandle / "FOCUS DESK · ESC" pill.) */
import { VANTARY, EASE_V } from "./vantary-theme"

/* ─────────────────────────────────────────────────────────────────────────
 *  CONTEXT  ·  open/close state + search-portal pulse signal
 *  ────────────────────────────────────────────────────────────────────── */

type FlightDeckRevealCtx = {
  /** Whether the deck (Welcome + Flight Deck + AskAI band) is expanded. */
  open: boolean
  /** Whether the header search bar should be visually pulsing right now
   *  to suggest it as the portal-of-origin for the deck. Set to true for
   *  ~1.2s after every open() call. */
  pulsing: boolean
  /** Imperative open. */
  reveal: () => void
  /** Imperative close. */
  conceal: () => void
  /** Toggle. */
  toggle: () => void
  /** When true, scroll-triggered conceal is DISABLED. Used by surfaces
   *  that own their own scroll (template viewers, gadget catalog
   *  popover, etc.) so a scroll-down inside the popup doesn't collapse
   *  the deck under it. The user can still close via ESC or the
   *  explicit close button. */
  scrollLocked: boolean
  setScrollLocked: (locked: boolean) => void
}

const Ctx = createContext<FlightDeckRevealCtx | null>(null)

export function useFlightDeckReveal(): FlightDeckRevealCtx {
  const ctx = useContext(Ctx)
  if (!ctx) {
    // Defensive: callers outside the provider get a no-op so that
    // the dashboard never crashes if the provider isn't mounted.
    return {
      open:    false,
      pulsing: false,
      reveal:  () => {},
      conceal: () => {},
      toggle:  () => {},
      scrollLocked:    false,
      setScrollLocked: () => {},
    }
  }
  return ctx
}

/* ─────────────────────────────────────────────────────────────────────────
 *  PROVIDER  ·  owns state + global gesture/keyboard listeners
 *  ────────────────────────────────────────────────────────────────────── */

export function FlightDeckRevealProvider({
  children,
  /** Defaults to TRUE — the Welcome band greets the trader on load.
   *  Scrolling down collapses it and brings the Trading Desk into focus. */
  initialOpen = true,
}: {
  children: ReactNode
  initialOpen?: boolean
}) {
  const [open,    setOpen]    = useState(initialOpen)
  const [pulsing, setPulsing] = useState(false)
  /** When true, scroll-triggered conceal is disabled — the user is
   *  viewing a template/popup and needs to scroll inside it. */
  const [scrollLocked, setScrollLocked] = useState(false)
  const pulseTimerRef = useRef<number | null>(null)
  const cooldownRef   = useRef<number>(0)

  /* clear any in-flight pulse timer when the provider unmounts */
  useEffect(() => {
    return () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current)
      }
    }
  }, [])

  /* startPulse — fires the search-bar amber pulse for ~1.2s. Reused by
   *  reveal() and toggle() so all open paths share a consistent visual. */
  const startPulse = useCallback(() => {
    setPulsing(true)
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current)
    }
    pulseTimerRef.current = window.setTimeout(() => setPulsing(false), 1200)
  }, [])

  const reveal = useCallback(() => {
    setOpen(true)
    startPulse()
  }, [startPulse])

  const conceal = useCallback(() => {
    setOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setOpen(o => {
      const next = !o
      if (next) startPulse()
      return next
    })
  }, [startPulse])

  /* ── Scroll gesture coupling · INSTITUTIONAL-GRADE LOCK SYSTEM ─────
   *
   *  This is a complete rewrite of the wheel/touch coupling.  It fixes
   *  four compounding pathologies that produced the "goes down then
   *  returns up" close animation users described:
   *
   *  ▸ FIX 1 · macOS REBOUND AUTO-REVEAL.
   *    On macOS, a rapid wheel-down gesture continues firing events
   *    for 1–2 seconds after the fingers lift (momentum scroll).  Once
   *    the deck has already concealed and the page is pinned at
   *    scrollY = 0, the browser's rubber-band rebound at the scroll
   *    edge generates *negative* deltaY events.  The previous reveal
   *    trigger (`!open && e.deltaY < -6 && scrollY <= 4`) would fire
   *    on those rebound events, *re-opening the deck* literally
   *    moments after the user closed it — exactly the "returns up"
   *    behaviour they reported.
   *
   *    Cure: a DIRECTION-LOCKED cooldown.  After every conceal we
   *    forbid `reveal()` for 1500 ms regardless of incoming wheel
   *    events; after every reveal we forbid `conceal()` for the same
   *    window.  The directional ban is independent of the wheel-event
   *    suppression below — it's a hard semantic guard at the state
   *    layer.
   *
   *  ▸ FIX 2 · COOLDOWN LEAK.
   *    The previous handler returned out of the cooldown branch
   *    *without* preventDefault, so wheel events between lock-end
   *    (560 ms) and cooldown-end (900 ms) scrolled the page
   *    naturally — visible jolt at the tail of the close.
   *
   *    Cure: cooldown branch now ALSO preventDefaults events whose
   *    velocity profile matches momentum scroll (|deltaY| < 32, no
   *    deltaMode change).  Real new gestures (|deltaY| ≥ 32) are
   *    allowed through so the trader can immediately scroll the desk.
   *
   *  ▸ FIX 3 · LOCK AUTO-EXTENSION.
   *    Original lock was a fixed 560 ms window; if the user's
   *    momentum tail was longer than that, late events leaked through.
   *
   *    Cure: while the lock is active and we're still seeing wheel
   *    events with |deltaY| > 2, we extend the lock by another
   *    180 ms (capped at 1800 ms total).  The lock dies the moment
   *    momentum dies — never sooner, never later.
   *
   *  ▸ FIX 4 · NO MID-CLOSE SCROLL.
   *    The previous engageLock() called scrollTo(0, 0) once.  We now
   *    re-pin to 0 on every blocked wheel/touch event during the
   *    transition, and we explicitly clear `scrollBehavior` so any
   *    inherited `smooth` doesn't fight us. ───────────────────── */
  const lockUntilRef    = useRef<number>(0)
  const lockMaxRef      = useRef<number>(0)
  const banRevealUntil  = useRef<number>(0)
  const banConcealUntil = useRef<number>(0)

  /* ── STRONG-SWIPE REVEAL GATE ──────────────────────────────────────
   *  The deck must only re-open on a DELIBERATE, forceful upward swipe
   *  at the very top — never on the gentle scrolling a trader does
   *  inside a popup (Execute console, template viewer, etc.).
   *
   *  We accumulate upward wheel delta while pinned at the page top and
   *  only fire reveal once that accumulation crosses a high threshold
   *  within a tight time window.  The accumulator resets the instant the
   *  user pauses (gap > 200 ms) or reverses direction, so casual,
   *  intermittent up-scrolls never add up to a trigger. */
  const revealAccumRef  = useRef<number>(0)
  const revealLastTsRef = useRef<number>(0)
  /** Accumulated upward wheel px needed for a "really strong swipe". */
  const REVEAL_STRONG_WHEEL = 260
  /** Single-gesture touch travel (px) needed for a strong upward swipe. */
  const REVEAL_STRONG_TOUCH = 140

  useEffect(() => {
    if (typeof window === "undefined") return

    /* innerScrollCanConsumeUp — walk up from the wheel/touch target and
     * return true if ANY ancestor is a vertically-scrollable element that
     * still has room to scroll UP (scrollTop > 0). When true, the user is
     * scrolling INSIDE a popup (Execute console, template viewer, gadget
     * catalog…) and the deck must keep its hands off entirely. The deck
     * only ever reveals once every inner surface is pinned at its own top
     * AND the trader makes a deliberate strong swipe. */
    const innerScrollCanConsumeUp = (target: EventTarget | null): boolean => {
      let el = target as HTMLElement | null
      while (el && el !== document.body && el !== document.documentElement) {
        if (el.scrollHeight > el.clientHeight + 1) {
          const oy = getComputedStyle(el).overflowY
          if ((oy === "auto" || oy === "scroll" || oy === "overlay") && el.scrollTop > 1) {
            return true
          }
        }
        el = el.parentElement
      }
      return false
    }

    /* innerScrollCanConsumeDown — the DOWNWARD twin. Walk up from the
     * wheel/touch target; return true if ANY ancestor is a vertically-
     * scrollable element that still has room to scroll DOWN (it isn't yet
     * pinned at its own bottom). When true, the trader is reading further
     * INTO an open-deck surface — e.g. scrolling down inside the expanded
     * Forecast room to see more of its content — so the deck must keep its
     * hands off and let that inner surface scroll. The deck only ever
     * conceals once every inner surface is pinned at its own bottom. */
    const innerScrollCanConsumeDown = (target: EventTarget | null): boolean => {
      let el = target as HTMLElement | null
      while (el && el !== document.body && el !== document.documentElement) {
        if (el.scrollHeight > el.clientHeight + 1) {
          const oy = getComputedStyle(el).overflowY
          if (
            (oy === "auto" || oy === "scroll" || oy === "overlay") &&
            el.scrollTop + el.clientHeight < el.scrollHeight - 1
          ) {
            return true
          }
        }
        el = el.parentElement
      }
      return false
    }

    /* engageLock — open the suppression window, pin scroll to 0,
     * and clear any inherited smooth-scroll behaviour. */
    const engageLock = (durationMs: number) => {
      const now = Date.now()
      lockUntilRef.current = now + durationMs
      lockMaxRef.current   = now + 1800
      window.scrollTo(0, 0)

      /* Cancel any in-flight smooth scroll so nothing fights the
       * close animation.  Restore on lock release below. */
      const html = document.documentElement
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = "auto"
      window.setTimeout(() => {
        html.style.scrollBehavior = prev
      }, durationMs + 60)
    }

    /* maybeExtendLock — called from inside the lock window every time
     * momentum keeps arriving.  Extends by 180 ms slices so the lock
     * exactly tracks the trailing edge of momentum, no longer no
     * shorter, capped at lockMaxRef. */
    const maybeExtendLock = (deltaY: number) => {
      if (Math.abs(deltaY) <= 2) return
      const now = Date.now()
      const next = Math.min(now + 180, lockMaxRef.current)
      if (next > lockUntilRef.current) lockUntilRef.current = next
    }

    /* the wheel listener is non-passive so we can preventDefault */
    const onWheel = (e: WheelEvent) => {
      const now = Date.now()

      /* PHASE A · LOCK WINDOW
       * Eat every wheel event, re-pin scroll to 0, and feed momentum
       * back into the lock so it extends until the gesture truly dies. */
      if (now < lockUntilRef.current) {
        e.preventDefault()
        if (window.scrollY !== 0) window.scrollTo(0, 0)
        maybeExtendLock(e.deltaY)
        return
      }

      /* PHASE B · COOLDOWN WINDOW
       * Suppress momentum-tail events but pass real new gestures
       * through.  Threshold of 32 is empirical: macOS momentum tails
       * decay below ~30, intentional flicks start at ~50+. */
      if (now < cooldownRef.current) {
        if (Math.abs(e.deltaY) < 32) {
          e.preventDefault()
          if (open && window.scrollY !== 0) window.scrollTo(0, 0)
        }
        return
      }

      /* PHASE C · ACTIVE GESTURE DETECTION */

      // Downward wheel while deck is open → CONCEAL.
      // Direction ban: cannot conceal if we just revealed (Fix 1).
      // SCROLL LOCK: when a template/popup is active, we skip scroll-
      // triggered conceal entirely — the user needs to scroll inside the
      // viewport without the deck closing. They can still close via the
      // explicit close button or Escape key.
      // INNER-SCROLL GUARD: if the wheel landed over a surface inside the
      // open deck that still has room to scroll DOWN (e.g. the expanded
      // Forecast room), this is the trader reading further into it — let
      // that inner surface scroll and DON'T conceal. The deck only closes
      // once the inner content is pinned at its own bottom.
      if (
        open &&
        e.deltaY > 6 &&
        now >= banConcealUntil.current &&
        !scrollLocked &&
        !innerScrollCanConsumeDown(e.target)
      ) {
        e.preventDefault()
        cooldownRef.current     = now + 1100
        banRevealUntil.current  = now + 1500
        conceal()
        engageLock(750)
        return
      }

      // Upward wheel while deck is closed AND we're at top → REVEAL.
      // Direction ban: cannot reveal if we just concealed (Fix 1) —
      // this is the single line that kills macOS rebound auto-reveal.
      //
      // STRONG-SWIPE GATE: a single gentle up-scroll must NEVER re-open
      // the deck. Two guards:
      //   (a) If the wheel happened over an inner scroll container that
      //       can still scroll UP (the Execute console, a template
      //       viewer, etc.), this is the user reading content — let it
      //       scroll, accumulate nothing, and bail. The deck only ever
      //       reveals when the inner surface is itself pinned at its top.
      //   (b) Otherwise accumulate upward delta; only fire once the
      //       trader crosses REVEAL_STRONG_WHEEL within a tight, gap-
      //       reset window — i.e. one deliberate, forceful flick.
      if (
        !open &&
        e.deltaY < 0 &&
        window.scrollY <= 4 &&
        now >= banRevealUntil.current
      ) {
        // (a) defer to any inner scroller that still has headroom upward.
        if (innerScrollCanConsumeUp(e.target)) {
          revealAccumRef.current = 0
          return
        }

        // (b) accumulate — reset on pause (>200 ms) or direction change.
        if (now - revealLastTsRef.current > 200) revealAccumRef.current = 0
        revealLastTsRef.current = now
        revealAccumRef.current += -e.deltaY

        // Keep the page pinned while the trader is building the swipe so
        // the rubber-band edge doesn't jitter, but DON'T reveal yet.
        if (window.scrollY !== 0) window.scrollTo(0, 0)

        if (revealAccumRef.current >= REVEAL_STRONG_WHEEL) {
          e.preventDefault()
          revealAccumRef.current  = 0
          cooldownRef.current     = now + 1300
          banConcealUntil.current = now + 1500
          reveal()
          engageLock(850)
        }
        return
      }
    }

    /* touch (iOS/Android) — same four-phase logic. */
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const now = Date.now()
      const dy  = (e.touches[0]?.clientY ?? 0) - touchStartY

      if (now < lockUntilRef.current) {
        e.preventDefault()
        if (window.scrollY !== 0) window.scrollTo(0, 0)
        maybeExtendLock(-dy)
        return
      }
      if (now < cooldownRef.current) {
        if (Math.abs(dy) < 80) e.preventDefault()
        return
      }

      // SCROLL LOCK: skip scroll-triggered conceal when viewing a template.
      // INNER-SCROLL GUARD: also defer to an open-deck surface (e.g. the
      // expanded Forecast room) that can still scroll down.
      if (
        open &&
        dy < -40 &&
        now >= banConcealUntil.current &&
        !scrollLocked &&
        !innerScrollCanConsumeDown(e.target)
      ) {
        e.preventDefault()
        cooldownRef.current     = now + 1100
        banRevealUntil.current  = now + 1500
        conceal()
        engageLock(750)
        return
      }
      if (
        !open                       &&
        window.scrollY <= 4         &&
        dy > REVEAL_STRONG_TOUCH    &&
        now >= banRevealUntil.current &&
        !innerScrollCanConsumeUp(e.target)
      ) {
        e.preventDefault()
        cooldownRef.current     = now + 1300
        banConcealUntil.current = now + 1500
        reveal()
        engageLock(850)
        return
      }
    }

    /* Belt-and-braces: any scroll event during lock snaps back to 0. */
    const onScroll = () => {
      if (Date.now() < lockUntilRef.current && window.scrollY !== 0) {
        window.scrollTo(0, 0)
      }
    }

    window.addEventListener("wheel",      onWheel,      { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true  })
    window.addEventListener("touchmove",  onTouchMove,  { passive: false })
    window.addEventListener("scroll",     onScroll,     { passive: true  })
    return () => {
      window.removeEventListener("wheel",      onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove",  onTouchMove)
      window.removeEventListener("scroll",     onScroll)
    }
  }, [open, reveal, conceal, scrollLocked])

  /* ── Keyboard:  Ctrl/Cmd+Shift+F  ·  Escape ────────────────────────
   *  Ctrl+Shift+F mirrors the search-bar shortcut hint and is the
   *  primary keyboard portal into the deck. Escape collapses if open.
   *  We swallow the browser's native "Find in page" via preventDefault.
   *  ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return

    const onKey = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey
      if (isMeta && e.shiftKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault()
        if (open) {
          conceal()
        } else {
          // If the user pressed Ctrl+Shift+F deep in a long page, ensure
          // the deck reveal is visible by scrolling to top first.
          if (window.scrollY > 4) {
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          reveal()
        }
        return
      }
      if (e.key === "Escape" && open) {
        conceal()
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, reveal, conceal])

  const value = useMemo<FlightDeckRevealCtx>(
    () => ({ open, pulsing, reveal, conceal, toggle, scrollLocked, setScrollLocked }),
    [open, pulsing, reveal, conceal, toggle, scrollLocked],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/* ─────────────────────────────────────────────────────────────────────────
 *  REVEAL SHELL  ·  the collapsing wrapper around <JarvisWelcomeBand/>
 *
 *  Single source of truth: ONE motion.div whose `height` + `opacity` are
 *  directly animated based on the boolean `open`. The closed-state
 *  pull-down handle is rendered SEPARATELY beneath the deck, animated
 *  in/out with AnimatePresence — no `mode="wait"`, no keyed remounts of
 *  the deck itself, so there's no race between exit and entrance.
 *
 *  Why this is more reliable than the previous keyed-AnimatePresence
 *  approach: with `mode="wait"`, the closed handle had to wait for the
 *  open deck's exit animation to finish before mounting; combined with
 *  user-driven scroll input mid-collapse, it created perceptible jitter.
 *  Now the deck collapses in-place via plain Framer Motion `animate=`,
 *  which is the smoothest path the library offers.
 *  ────────────────────────────────────────────────────────────────────── */

export function FlightDeckRevealShell({
  children,
}: {
  children: ReactNode
}) {
  const { open, conceal, reveal, pulsing } = useFlightDeckReveal()
  const reduce = useReducedMotion()

  return (
    <div className="relative">
      {/* ─────────── DECK CONTAINER ─────────────────────────────────
          Always mounted. Height & opacity animate based on `open`.
          Children stay rendered so the FLIP-style page reflow under
          the deck (trading desk lifting up) is driven by THIS
          element's measured height, not by a remount of children. */}
      <motion.div
        animate={
          reduce
            ? { opacity: open ? 1 : 0 }
            : { height: open ? "auto" : 0, opacity: open ? 1 : 0 }
        }
        initial={false}
        transition={
          reduce
            ? { duration: 0.2 }
            : {
                /* CLOSE TIMING — the masterpiece curve:
                 *   • height 0.5 s, ease [0.4, 0, 0.2, 1] (Material
                 *     "decelerate-accelerate" — a confident push out
                 *     followed by a soft landing at zero)
                 *   • opacity 0.34 s, no delay (the deck FADES while
                 *     it shrinks, so by the time it's almost gone
                 *     visually, the spatial collapse is finishing)
                 *
                 * OPEN TIMING — unchanged "confident landing":
                 *   • height 0.62 s, ease [0.22, 1, 0.36, 1] (cubic
                 *     ease-out — fast initial, gentle finish)
                 *   • opacity 0.36 s with 120 ms delay so the content
                 *     only appears once the container has room. */
                height:  {
                  duration: open ? 0.62 : 0.5,
                  ease:     open ? [0.22, 1, 0.36, 1] : [0.4, 0, 0.2, 1],
                },
                opacity: {
                  duration: open ? 0.36 : 0.34,
                  delay:    open ? 0.12 : 0,
                  ease:     [0.32, 0, 0.32, 1],
                },
              }
        }
        style={{
          overflow:   "hidden",
          willChange: "height, opacity",
          /* `pointerEvents: none` while collapsed prevents stray focus or
              hover events on the (visually-hidden) band content. */
          pointerEvents: open ? "auto" : "none",
        }}
        className="relative"
      >
        {/* Vertical beam + hairline race fire only on REVEAL — they're
         * the visual signature of the deck ARRIVING.  The new exit
         * hairline race below is the matching signature of the deck
         * DEPARTING. */}
        {!reduce && pulsing && open && <RevealBeam />}
        {!reduce && pulsing && open && <RevealHairlineRace />}

        {/* INNER CONTENT WRAPPER — single mount, state-driven motion.
         *
         * Critical change: removed `key={open ? "open" : "closed"}`.
         * The previous remount on close was the source of two bugs:
         *
         *   1. Flash/flicker — heavy children (Welcome band, AI band,
         *      Flight Deck cockpit chart) re-initialised mid-close,
         *      reading as a "settling shudder."
         *
         *   2. Lost mid-flight state — any in-flight component-local
         *      animations were torn down and re-mounted, so they
         *      played from the beginning instead of cleanly fading.
         *
         * Now a SINGLE motion.div animates y/opacity based on `open`,
         * so React's tree is stable across the transition and only
         * the transform/opacity values morph.
         *
         * The `pt-8` lives inside the shell so the breathing room
         * above the welcome band exists ONLY while the deck is
         * visible; the moment the shell collapses (height:0,
         * overflow:hidden), this padding disappears with it, leaving
         * the docked TickerStrip flush against the VantaryHeader.
         *
         * On CLOSE the inner translates upward by 28 px AND fades —
         * the deck appears to LIFT AWAY rather than being chopped
         * from the bottom.  The trading desk below simultaneously
         * rides up into the vacated space (driven by the outer
         * height collapse), producing the premium "deck departs
         * upward, desk arrives upward" parallax. */}
        <motion.div
          initial={false}
          animate={
            reduce
              ? { opacity: open ? 1 : 0 }
              : { y: open ? 0 : -28, opacity: open ? 1 : 0 }
          }
          transition={
            reduce
              ? { duration: 0.18 }
              : open
                ? {
                    /* OPEN — hold, then drop in (matches old behaviour). */
                    y:       { duration: 0.5, ease: EASE_V,           delay: 0.18 },
                    opacity: { duration: 0.4, ease: [0.32, 0, 0.32, 1], delay: 0.18 },
                  }
                : {
                    /* CLOSE — lift away.  No delay, slightly faster
                     * than the outer height so the content is gone
                     * before the spatial collapse finishes — exactly
                     * the inverse of OPEN's "make room first, then
                     * land content." */
                    y:       { duration: 0.36, ease: [0.32, 0, 0.32, 1] },
                    opacity: { duration: 0.32, ease: [0.32, 0, 0.32, 1] },
                  }
          }
          style={{ willChange: "transform, opacity" }}
          /* Was `pt-8` (32px) — trimmed to `pt-2` (8px) per trader
             directive ("cut the space from the top to 4 rooms"): with
             the eyebrow rail hidden and the rooms band promoted to the
             first tier, the deck opens nearly flush under the session
             ticker. Padding stays INSIDE the shell so the collapsed
             state remains flush as documented above. */
          className="pt-2"
        >
          {children}
        </motion.div>

        {/* DEPART HAIRLINE — visual signature of the deck leaving.
         * Mirrors RevealHairlineRace but plays only when the deck
         * starts closing (open === false AND height still > 0). */}
        {!reduce && !open && <DepartHairlineRace />}

        {/* The "FOCUS DESK · ESC" collapse pill has been removed at the
         * user's request — the deck still closes via the ESC key
         * shortcut and via any external `conceal()` caller, but the
         * in-deck affordance is gone. */}
      </motion.div>

      {/* (closed-state pull-handle rail intentionally removed — the
          header search bar now serves as the single, more elegant
          portal affordance for the closed state. See <VantaryHeader/>
          in your-space.tsx, where the search pill morphs into a
          "PULL · SCROLL UP · ⌃⇧F" inscription with a breathing chevron
          whenever the deck is collapsed.) */}
    </div>
  )
}

/* (PullDownHandle component removed — its affordance was migrated into
 *  the header search bar, which now displays a "PULL · SCROLL UP · ⌃⇧F"
 *  inscription with breathing chevron + amber under-glow whenever the
 *  deck is collapsed. See <VantaryHeader/> in your-space.tsx for the
 *  three-state crossfade implementation.) */

/* ────────────────────────────────────────────────────────────────────��────
 *  COLLAPSE HANDLE  ·  visible when the deck is open
 *
 *  Bottom-right chevron-up that snaps the deck closed. Subtle by design —
 *  the deck's own contents are the focus; this is a quiet exit ramp.
 *  ────────────────────────────────────────────────────────────────────── */

/* (CollapseHandle removed — the in-deck "FOCUS DESK · ESC" pill has
 *  been deleted at the user's request. The deck still closes via the
 *  global ESC key shortcut and via any external `conceal()` caller.) */

/* ─────────────────────────────────────────────────────────────────────────
 *  REVEAL BEAM  ·  vertical light beam from search bar down into deck
 *
 *  Anchored at the top-center of the deck. The beam ascends out of the
 *  deck (translate-y negative) up to ~120px above its top edge, which
 *  visually merges with the search bar's vertical position. It fades
 *  in, holds briefly, and fades out — a single ~900ms gesture.
 *  ─────────────────────────────────────────────────────────��──────────── */

function RevealBeam() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        top:      -110,
        left:     "50%",
        width:    1.5,
        height:   140,
        marginLeft: -0.75,
        background: `linear-gradient(180deg,
                       transparent 0%,
                       ${VANTARY.amberHalo} 18%,
                       ${VANTARY.amber} 60%,
                       ${VANTARY.amberHalo} 92%,
                       transparent 100%)`,
        boxShadow:  `0 0 16px ${VANTARY.amber}, 0 0 36px ${VANTARY.amberHalo}`,
        transformOrigin: "top center",
        zIndex:    2,
      }}
      initial={{ scaleY: 0,    opacity: 0 }}
      animate={{
        scaleY: [0, 1, 1, 1],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.0,
        times:    [0, 0.28, 0.6, 1],
        ease:     "easeOut",
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  REVEAL HAIRLINE RACE  ·  horizontal line that races outward from
 *                          the beam's anchor along the top edge of the
 *                          deck. Reads as "the seal cracking open."
 *  ────────────────────────────────────────────────────────────────────── */

function RevealHairlineRace() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        top:        0,
        left:       "50%",
        height:     1,
        width:      "60%",
        marginLeft: "-30%",
        background: `linear-gradient(90deg,
                       transparent 0%,
                       ${VANTARY.amberHalo} 30%,
                       ${VANTARY.amber} 50%,
                       ${VANTARY.amberHalo} 70%,
                       transparent 100%)`,
        zIndex:     2,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX:  [0, 1, 1],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 0.9,
        times:    [0, 0.5, 1],
        ease:     EASE_V,
        delay:    0.16,
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  DEPART HAIRLINE RACE · the visual signature of the deck LEAVING
 *  ──────────────────────────────────────────────────────────────────
 *  Mirrors <RevealHairlineRace/> but plays on CLOSE.  A 1 px amber
 *  hairline contracts inward from the top edge of the (closing) deck
 *  while fading — reading as "the deck releasing its seal and
 *  lifting away."
 *
 *  Plays once per close because it's only mounted while
 *  `open === false`; the parent re-mounts this child on every
 *  state flip via React's normal conditional render.  No exit
 *  animation needed — once the parent height hits 0 the whole
 *  subtree is visually gone. ─────────────────────────────────── */
function DepartHairlineRace() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        top:        0,
        left:       "50%",
        height:     1,
        width:      "60%",
        marginLeft: "-30%",
        background: `linear-gradient(90deg,
                       transparent 0%,
                       ${VANTARY.amberHalo} 30%,
                       ${VANTARY.amber} 50%,
                       ${VANTARY.amberHalo} 70%,
                       transparent 100%)`,
        zIndex:     2,
      }}
      initial={{ scaleX: 1, opacity: 1 }}
      animate={{
        scaleX:  [1, 1, 0],
        opacity: [1, 0.9, 0],
      }}
      transition={{
        duration: 0.42,
        times:    [0, 0.4, 1],
        ease:     [0.32, 0, 0.32, 1],
      }}
    />
  )
}

/* ──��──────────────────────────────────────────────────────────────────────
 *  SEARCH-PORTAL PULSE  ·  hook for the header search bar
 *
 *  Returns the live `pulsing` flag from context. Components can wrap the
 *  result in a motion variant to apply the amber halo + amber border
 *  while the deck is being revealed.
 *
 *  Usage:
 *    const pulsing = useSearchPortalPulse()
 *    <motion.div animate={{
 *      borderColor: pulsing ? VANTARY.amber : VANTARY.chipBorder,
 *      boxShadow:   pulsing ? `0 0 0 1px ${VANTARY.amber}, 0 0 24px ${VANTARY.amberHalo}` : "none",
 *    }} />
 *  ───────────────────���────────────────────────────────────────────────── */

export function useSearchPortalPulse(): boolean {
  return useFlightDeckReveal().pulsing
}

/* ═══════════════════════════════════════════════════════════════���═══════════
 *  TICKER STRIP DOCK  ·  shared-element FLIP between two anchor points
 *  ───────────────────────────────────────────────────────────────────────
 *  The 6-capsule status strip (SESSION · OPENS IN · PLAN · RISK USED ·
 *  FOCUS · NEWS) lives in TWO logical positions, picked at runtime by
 *  the flight deck's open state:
 *
 *    OPEN   → docked above the Welcome / Ask-Me-Anything band — the
 *             classic dashboard-header position. The strip is part of
 *             the editorial preface to the flight deck.
 *
 *    CLOSED → docked between the (collapsed) flight deck handle and
 *             the Trading Desk bay — so when the trader is in
 *             "institutional signal terminal" focus mode, the live
 *             status capsules sit just above the chart, like a
 *             professional terminal's ticker rail.
 *
 *  Animating between the two positions is the centrepiece of the
 *  scroll-up-to-reveal interaction. We use Framer Motion's shared-element
 *  layout transition (`<LayoutGroup>` + matching `layoutId`):
 *
 *    1. The user passes the SAME ticker JSX to both <TickerStripSlot>
 *       instances; only one renders at a time based on `open`.
 *    2. The active slot wraps its children in `motion.div layoutId=…`.
 *    3. When `open` flips, Framer Motion sees the layoutId disappear in
 *       one position and reappear in another — it morphs the visual
 *       element (FLIP: First, Last, Invert, Play) along a spring path.
 *    4. The element appears to physically fly between the two slots
 *       — translating, with a subtle scale dip mid-flight for that
 *       "morphing through space" feel.
 *
 *  The wrapping <TickerDockGroup> is a thin <LayoutGroup id="ticker-dock">
 *  scope so the layoutId only matches inside this dock — preventing
 *  false matches with any other shared-element transitions on the page.
 *  ─────────────────────────────────────────────────────────────────── */

/** Wrap the section of your tree containing both <TickerStripSlot/>
 *  instances in this group so the FLIP animation works correctly. */
export function TickerDockGroup({ children }: { children: ReactNode }) {
  return <LayoutGroup id="vantary-ticker-dock">{children}</LayoutGroup>
}

export interface TickerStripSlotProps {
  /** Which dock anchor this slot represents.
   *    "above" = above the flight deck (visible when deck is OPEN).
   *    "below" = above the trading desk (visible when deck is CLOSED). */
  position: "above" | "below"
  /** The actual ticker strip JSX. Pass the SAME element to both slots —
   *  only one slot renders it at a time, the other returns null. */
  children: ReactNode
}

/** A docking anchor for the 6-capsule status strip. Renders its
 *  children only when this slot's `position` matches the current open
 *  state of the flight deck; otherwise renders null.
 *
 *  History note (important for anyone tempted to re-add a FLIP):
 *  This used to run a shared-`layoutId` FLIP between the two slots
 *  with a spring (k=320, c=34, m=1.05). That spring is slightly
 *  underdamped (ζ≈0.93), which produced a tiny visible oscillation
 *  on arrival — the user described it as "shakey, doesn't look
 *  professional". We removed the FLIP entirely because the two
 *  slots resolve to nearly the SAME on-screen Y (the deck collapsing
 *  pulls the desk up by exactly the deck's height, leaving the
 *  ticker visually parked at the same viewport position). With no
 *  visible motion to interpolate, a FLIP just adds spring jitter for
 *  no benefit. A clean opacity fade is the correct premium answer. */
export function TickerStripSlot({ position, children }: TickerStripSlotProps) {
  const { open } = useFlightDeckReveal()
  const reduced  = useReducedMotion()

  /* "above" is active when the deck is OPEN (sits between header and
   *  flight deck). "below" is active when the deck is CLOSED (sits
   *  just above the trading desk in focus mode). */
  const isActive = position === "above" ? open : !open

  if (!isActive) return null

  return (
    <motion.div
      /* Pure opacity fade. No `layout`, no `layoutId`, no spring,
       *  no y-translate — all of which were jitter sources. The strip
       *  appears in its final document position with a 220ms ease-out
       *  fade and stays put. Crisp. Premium. No shake. */
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
      }
      style={{ position: "relative", zIndex: 3 }}
      data-ticker-slot={position}
    >
      {children}
    </motion.div>
  )
}
