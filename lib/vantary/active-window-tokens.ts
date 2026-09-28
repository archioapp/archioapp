/* ═══════════════════════════════════════════════════════════════════════════
 *  ARCHIO · ACTIVE WINDOW · TOKEN MAP
 *  ─────────────────────────────────────────────────────────────────────────
 *  Every literal value the new Active Window components consume — cadences,
 *  letter-spacings, seam widths, easing curves, halo blurs — lives here.
 *  The discipline is simple: zero magic numbers in the component files. A
 *  designer can re-tune the entire living ecosystem from this one file
 *  without re-reading 1500 lines of JSX.
 *
 *  Why a tokens module instead of inlining?
 *  ────────────────────────────────────────
 *  The Active Window is the **third pillar** of the archio language
 *  (Forecast popup and Flight Deck wings came first). Each pillar has to
 *  feel consistent with the others — same cadences, same easing curves,
 *  same letter-spacings. The token map makes that consistency mechanical
 *  rather than reviewer-enforced.
 *
 *  Reading order of this file:
 *    1. AW_CADENCE — every breathing / pulse cycle, in seconds
 *    2. AW_DUR     — every short transition duration, in seconds
 *    3. AW_EASE    — the two cubic-bezier curves used across the panel
 *    4. AW_LETTER  — letter-spacing values (tracking is doing structural work)
 *    5. AW_SIZE    — pixel sizes for type, dots, halos, seams
 *    6. AW_SEAM    — seam alpha + shimmer parameters
 *    7. AW_OPACITY — opacity scales for state contrast
 *    8. AW_ROTATING — content rotation tables (live tab thesis + body psych)
 *
 *  Cadence design rule
 *  ───────────────────
 *  The panel's "alive but never noisy" feel depends on **no two cadences
 *  sharing a beat in any 30-second window**. 8.0, 3.4, 2.6, 4.0, 14.0,
 *  9.0 — all mutually irrational. If you add a new cadence, run the
 *  multiples and pick a value that doesn't align with any existing one
 *  inside 30s. The eye reads non-aligned cadences as "organic," aligned
 *  ones as "looped."
 * ═══════════════════════════════════════════════════════════════════════ */

/* ── 1. CADENCES ─────────────────────────────────────────────────────────
   Every repeating animation in the panel reads its duration from here.
   Values are in seconds (Framer Motion's native unit for transitions). */
export const AW_CADENCE = {
  /** The panel's heartbeat — radial backdrop alpha breathes 0.04↔0.07. */
  panelBreath:        8.0,
  /** Concentric live-dot ripple cycle (2.6s = "calm aliveness"). */
  liveDot:            2.6,
  /** Session nameplate halo blur cycle. KZ sessions feel faster. */
  sessionTagPulse:    { kz: 3.4, dead: 6.0 },
  /** WHY/EXPECT eyebrow micro-seam width breathing 40↔56px. */
  whyExpectSeam:      4.0,
  /** Day-quality keyword (KEY DAY, CAUTION, etc.) textShadow breathing. */
  qualityKeyword:     4.0,
  /** Diagonal sheen pass across every horizontal seam. Long cadence so
   *  the eye never settles into a metronome. */
  seamShimmer:        14.0,
  /** Live tab label rotation: short name ↔ short thesis. */
  tabLabelRotation:   9.0,
  /** WHY/EXPECT body rotation: tactical ↔ psychological framing. */
  bodyRotation:       14.0,
  /** Live tab radial halo wash breathing 8%↔16% alpha. */
  liveTabHalo:        3.4,
  /** UTC clock minute-rollover digit flash. Synced to real-time minute
   *  ticks (not a loop) — the value here is the single-pass duration. */
  minuteRolloverFlash: 0.32,
} as const

/* ── 2. SHORT TRANSITION DURATIONS ───────────────────────────────────────
   One-shot durations for transitions and choreography beats. Seconds. */
export const AW_DUR = {
  /** Layout shifts triggered by user clicks (tab swap, micro-phase
   *  swap). Long enough to feel expensive, short enough to feel
   *  responsive. */
  layoutShift:        0.46,
  /** Headline morph via layoutId (matches Flight Deck pill swap). */
  headlineMorph:      0.36,
  /** Cross-fade between rotating labels / bodies. */
  rotateCrossfade:    0.32,
  /** Generic content fade-in / fade-out. */
  contentFade:        0.22,
  /** Drawer open from compact → expanded canvas. */
  drawerOpen:         0.38,
  /** Drawer close — slightly faster than open (snap-back trick). */
  drawerClose:        0.28,
  /** Stagger interval between drawer sections on open. */
  drawerStagger:      0.045,
  /** Hover spotlight follow ease-out duration. */
  hoverFollow:        0.22,
  /** Tab label letter-spacing tightening on hover (luxurious settle). */
  letterTightening:   0.18,
} as const

/* ── 3. EASING CURVES ────────────────────────────────────────────────────
   Two custom-eases govern the whole panel:
   - `aw` — the in-out luxury curve used everywhere user-driven motion
     happens (tab swap, headline morph, drawer open).
   - `breath` — gentle in-out used for ambient breathing (textShadow,
     opacity, radial alpha). easeInOut works fine, kept as a named
     constant so future tweaks have one place to land. */
export const AW_EASE = {
  /** [0.22, 0.61, 0.36, 1] — the archio luxury curve. Decelerates with
   *  a soft anticipation. Used for every transition the user triggers. */
  aw: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  /** Ambient breathing curve. Symmetrical, calm. */
  breath: "easeInOut" as const,
} as const

/* ── 4. LETTER SPACING (the structural worker) ───────────────────────────
   In this panel, tracking does the work that borders used to do. The
   contrast between eyebrow tracking (very wide) and headline tracking
   (very tight, even negative) IS the visual hierarchy. Values match the
   masterplan §1.1 contract. */
export const AW_LETTER = {
  /** Standard eyebrow — `letterSpacing: 0.34em`. Wider than before. */
  eyebrow:            "0.34em",
  /** Premium eyebrow — `FOCUS NOW`, the most important label in the
   *  panel. 0.40em is the maximum that still reads as type rather
   *  than spaced-out characters. */
  eyebrowPremium:     "0.40em",
  /** Headline (session name, phase label, day name). Negative tracking
   *  is the modernist tell — confidence to break the default kerning. */
  headline:           "-0.03em",
  /** Body copy (verdict, FOCUS NOW prose). Just shy of default; gives
   *  the copy a slightly tighter, more editorial feel. */
  body:               "-0.005em",
  /** Phase-tab labels at rest. */
  tabLabel:           "0.32em",
  /** Phase-tab labels on hover — the typographic "stand up straight"
   *  micro-tightening that signals hover without any color change. */
  tabLabelHover:      "0.18em",
  /** UTC clock + tabular numerics. */
  numeric:            "0.20em",
} as const

/* ── 5. PIXEL SIZES (type, dots, halos, seams) ───────────────────────────
   Every pixel-precise dimension in the panel reads from here. Renamed
   from the original masterplan's loose "8.5px" mentions to a structured
   table the components hand off as inline style props. */
export const AW_SIZE = {
  /* Type */
  eyebrowFontSize:    9.5,
  premiumEyebrowSize: 11,
  sessionNameSize:    32,
  dayNameSize:        24,
  verdictBodySize:    14,
  focusBodySize:      14,
  whyExpectSize:      12.5,
  microPhaseLabel:    8.5,
  utcClockSize:       10,
  numericSmall:       11,

  /* Live dots */
  liveDotCore:        6,    // inner solid dot
  liveDotRippleMax:   2.4,  // outer ring scales to 2.4× during ripple
  liveDotMini:        4,    // smaller secondary live indicators
  microPhaseDot:      5,    // dot under each micro-phase label

  /* Seams */
  seamHeight:         1,
  seamShimmerWidth:   "10%", // CSS width of the traveling highlight
  microSeamIdleW:     40,
  microSeamHoverW:    88,

  /* Halos */
  liveDotHaloPx:      6,    // box-shadow blur
  textHaloIdle:       8,    // textShadow blur at rest
  textHaloBreath:     14,   // textShadow blur at peak
} as const

/* ── 6. SEAM ALPHAS (the gradient hairline parameters) ──────────────────
   The "seam" is the panel's signature divider — a low-alpha horizontal
   gradient that visually marks a section boundary without enclosing it.
   These alphas control how present the seam feels at rest, and how
   bright the traveling shimmer pass reads against it. */
export const AW_SEAM = {
  /** Base alpha of the seam itself (the gradient line at rest). */
  baseAlpha:          0.22,
  /** Alpha of the traveling shimmer pass at its brightest point. */
  shimmerAlpha:       0.55,
  /** Width of the shimmer pass relative to the seam length. 10% means
   *  the highlight covers 10% of the seam's width at any moment. */
  shimmerWidthPct:    10,
  /** Fraction of the cycle the shimmer is "idle" at each end before
   *  starting the next pass. 0.28 of 14s ≈ 4s rest at each end. */
  shimmerIdleFrac:    0.28,
} as const

/* ── 7. OPACITY SCALES ──────────────────────────────────────────────────
   Quiet contrast steps used to express "is live", "is dead", "is
   previewing". The panel has no "is hovered" tier — hover is expressed
   through letter-spacing tightening + seam width, never opacity. */
export const AW_OPACITY = {
  /** Nameplate at rest when its session is KZ. */
  kzNameplate:        1.0,
  /** Nameplate at rest when its session is DEAD (peripheral cue). */
  deadNameplate:      0.78,
  /** Inactive phase-tab labels. */
  inactiveTab:        0.62,
  /** The 0→peak alpha range of the radial breath layer. */
  panelBreathMin:     0.04,
  panelBreathMax:     0.07,
  /** Live tab radial halo wash range. */
  liveTabHaloMin:     0.08,
  liveTabHaloMax:     0.16,
  /** Live-dot ripple ring fade. */
  rippleAlphaStart:   0.6,
  rippleAlphaEnd:     0.0,
} as const

/* ── 8. ROTATING CONTENT (live-tab thesis + body psychological framing) ─
   The masterplan §3.3 introduces content rotation — the live tab label
   cycles between short name and short thesis every 9s, and the
   WHY/EXPECT body rotates between tactical and psychological framings
   every 14s. These tables back that rotation without polluting the
   source-of-truth SESSIONS_INTEL data in your-space.tsx.

   Keys are SessionKey strings (PRE-LDN / LDN / LDN-NY / NY / LDN-CLS
   / POST-NY / OFF) and MicroPhase ids (e.g. `ldn-1`, `ny-3`). Anything
   missing falls back to the static short-name / focusWhy from the
   source data — no rotation, just static label. */

/** Short, all-caps thesis to alternate with the session short-name on
 *  the LIVE phase-tab label. Reads like a Bloomberg ticker. */
export const AW_TAB_THESIS: Record<string, string> = {
  "PRE-LDN":   "MARK ASIA · LOCK BIAS",
  "LDN":       "SWEEP → DIRECTION",
  "LDN-NY":    "DRIFT · WAIT FOR NY",
  "NY":        "PRIME EXECUTION",
  "LDN-CLS":   "REVERSAL WINDOW",
  "POST-NY":   "REVIEW · PLAN",
  "OFF":       "MARKETS QUIET",
}

/** Per-micro-phase second framing of the WHY copy — voiced as a coach
 *  addressing the trader's state of mind rather than the market's.
 *  Missing entries fall back to a single static `focusWhy` (no rotation). */
export const AW_BODY_PSYCH: Record<string, string> = {
  // PRE-LDN
  "p1":         "Calm before noise. Your discipline now is the entire reason London works for you later.",
  "p2":         "Reactive traders walk into London. Prepared traders walk THROUGH London. Pick a side.",

  // LDN
  "ldn-1":      "The first 30 minutes are designed to test your patience. Don't take the bait.",
  "ldn-2":      "Trust what you see. Hesitation here costs more than wrong entries — it costs the whole session.",
  "ldn-3":      "If you missed the open, this is your second chance. Don't fumble it by widening stops out of fear.",
  "ldn-4":      "Hands off the working trade. Your only job right now is to let the position do its work.",
  "ldn-5":      "Greed at the end of a session is how a winning day becomes a flat day. Bank what's there.",
  "ldn-6":      "The session is finished. Your discipline now is to leave it that way and walk away clean.",

  // LDN-NY
  "g1":         "There's no edge here. Sitting on hands is the trade.",
  "g2":         "Bias re-validation, not entries. If London's read was wrong, NY will tell you in 30 minutes.",

  // NY
  "ny-1":       "Don't trade the noise of the open. Wait for the open to settle into the day.",
  "ny-2":       "Confirmation isn't slow. It's earned. The traders who wait outperform the traders who guess.",
  "ny-3":       "This is the cleanest hour of the day. Trust your setups. Don't second-guess yourself.",
  "ny-4":       "Volume is gone. Trading here is trading hope. Step back.",
  "ny-5":       "Quality. Quality. Quality. One more A+ setup beats five mediocre ones.",
  "ny-6":       "The day is done. Close out, journal, walk away. Tomorrow needs a rested you.",

  // LDN-CLS
  "lc-1":       "Profit-taking, not new intent. Don't confuse them.",
  "lc-2":       "If the setup hasn't materialised, accept it. Forcing trades into a closing window is account suicide.",

  // POST-NY
  "p1_review":  "Audit your process, not your P&L. Tomorrow's improvements come from today's honesty.",
  "p2_plan":    "A pre-built plan executes. A reactive plan capitulates. Be the trader who executes.",

  // OFF
  "off-1":      "No edge means no trades. Use the silence to prepare.",
}
