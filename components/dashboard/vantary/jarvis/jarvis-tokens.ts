/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · FOUNDATION TOKENS
 *  ─────────────────────────────────────────────────────────────────────
 *  This file is the single source of truth for typography, tone, rule,
 *  rhythm, motion, cadence, and z-index for every component built under
 *  the JARVIS doctrine inside the Vantary trading dashboard.
 *
 *  THIS FILE INTRODUCES NO UI CHANGE BY ITSELF.
 *
 *  It is the *fuel*. Every surface (the Protagonist Band, the Pulse
 *  Strip, the Period Spine, the Story Panel, the Quiet Layer) reaches
 *  into this file and ONLY this file for its visual primitives. If a
 *  surface needs a value that is not here, the surface is wrong — or
 *  the doctrine needs to be amended, in which case we amend HERE first
 *  and the surface follows.
 *
 *  ──────────────────────────────────────────────────────────────────────
 *  THE EIGHT LAWS (encoded into the tokens below)
 *  ──────────────────────────────────────────────────────────────────────
 *  1. Layered information, not flattened.
 *  2. Three states per surface — idle / awakened / engaged.
 *  3. The card breathes when the trader doesn't (auto-rotation).
 *  4. One protagonist per zone.
 *  5. Type scale is locked, not chosen per-cell — five sizes, period.
 *  6. Hairlines, not boxes — borders are reserved for interactives.
 *  7. Motion is meaning, not decoration.
 *  8. Every card customizes itself (the fractal customize doctrine).
 *
 *  See the masterplan in chat history for the full architectural intent.
 * ════════════════════════════════════════════════════════════════════════ */

import { VANTARY } from "../vantary-theme"

/* ─────────────────────────────────────────────────────────────────────
 *  JARVIS_TX — the locked typographic scale
 *  ─────────────────────────────────────────
 *  FIVE sizes. THREE weights. Period.
 *
 *    eyebrow  →  9.5px  →  mono caps  →  the smallest mark — section
 *                                          labels, eyebrows above
 *                                          values ("WEEK", "EQUITY"),
 *                                          state markers ("LIVE")
 *    caption  →  11px   →  mono lower →  support text under values,
 *                                          deltas in chips, microcopy
 *    body     →  13px   →  sans       →  inline readable text — story
 *                                          panel paragraphs, table cells
 *    value    →  22px   →  sans tab   →  sub-protagonist numbers — the
 *                                          per-account balance, splitter
 *                                          ratio readout, secondary
 *                                          chart values
 *    headline →  38px   →  sans tab   →  THE protagonist of a card —
 *                                          one per card, never two
 *
 *  Anything that needs a size between two tokens is wrong. The card
 *  needs to be redesigned, not the scale stretched.
 *
 *  Letter-spacing has a precise rationale per token:
 *    - eyebrow uses 0.20em — the wide caps spacing that gives mono-
 *      uppercase its "label" quality (closer to architectural signage
 *      than to body text)
 *    - caption uses 0.06em — slight optical widening for tiny mono
 *      characters that would otherwise crush
 *    - body uses 0 — defer to the font's natural metrics
 *    - value uses -0.008em — premium tightening that signals "this is
 *      a number worth looking at" without crossing into editorial
 *    - headline uses -0.014em — editorial tightening borrowed from
 *      financial data terminals (Bloomberg, Refinitiv, Vantary)
 *
 *  Line-height ratios:
 *    - eyebrow 1.0  — caps don't need leading; tighter rows
 *    - caption 1.4  — readable at 11px
 *    - body    1.45 — comfortable inline reading
 *    - value   1.1  — tight to keep the rhythm vertical
 *    - headline 1.0 — the protagonist owns its row, no leading
 *
 *  Font family follows the spec from `vantary-theme.ts`:
 *    - mono → for eyebrow and caption (the data-terminal voice)
 *    - sans → for body, value, headline (the editorial voice)
 *
 *  Tabular numerals:
 *    - value and headline mandate `font-variant-numeric: tabular-nums`
 *      so that flickering numbers don't shift horizontally as digits
 *      change. This is the single biggest tell of "amateur trading
 *      UI" vs "professional terminal" — non-tabular numerals.
 * ─────────────────────────────────────────────────────────────────── */

export interface JarvisTxToken {
  fontSize:           number       // px
  lineHeight:         number       // unitless ratio
  letterSpacing:      string       // CSS string with em
  fontFamily:         "sans" | "mono"
  uppercase:          boolean
  tabularNumerals:    boolean
  /** What this size is FOR. Encoded into the type so future readers
   *  see the contract. Never use a size for a purpose that isn't in
   *  this list — that's the protagonist law. */
  intent:             string
}

export const JARVIS_TX = {
  eyebrow: {
    fontSize:        9.5,
    lineHeight:      1.0,
    letterSpacing:   "0.20em",
    fontFamily:      "mono",
    uppercase:       true,
    tabularNumerals: false,
    intent:          "Section label, eyebrow above a value, state marker (LIVE / IDLE / OFFLINE), period name (WEEK / MONTH / YEAR), category caption.",
  } as const satisfies JarvisTxToken,

  caption: {
    fontSize:        11,
    lineHeight:      1.4,
    letterSpacing:   "0.06em",
    fontFamily:      "mono",
    uppercase:       false,
    tabularNumerals: false,
    intent:          "Support text under a value, delta description (\"vs prior week\"), micro-explanation under a chart, hint copy.",
  } as const satisfies JarvisTxToken,

  body: {
    fontSize:        13,
    lineHeight:      1.45,
    letterSpacing:   "0em",
    fontFamily:      "sans",
    uppercase:       false,
    tabularNumerals: false,
    intent:          "Inline readable copy — story panel paragraphs, table cell content, list rows, hover-tooltip body text.",
  } as const satisfies JarvisTxToken,

  value: {
    fontSize:        22,
    lineHeight:      1.1,
    letterSpacing:   "-0.008em",
    fontFamily:      "sans",
    uppercase:       false,
    tabularNumerals: true,
    intent:          "Sub-protagonist number — per-account balance, pair P&L, splitter ratio readout, secondary chart value. Never the card's primary number — that is `headline`.",
  } as const satisfies JarvisTxToken,

  headline: {
    fontSize:        38,
    lineHeight:      1.0,
    letterSpacing:   "-0.014em",
    fontFamily:      "sans",
    uppercase:       false,
    tabularNumerals: true,
    intent:          "THE single protagonist number of a card — the account balance on Live Equity, the high-impact event count on News, the open-pair count on Active Windows. ONE per card. Never two.",
  } as const satisfies JarvisTxToken,
} as const

export type JarvisTxName = keyof typeof JARVIS_TX

/* ─────────────────────────────────────────────────────────────────────
 *  JARVIS_WEIGHT — the locked weight scale
 *  ───────────────────────────────────────
 *  THREE weights. Encoded as named tokens so consumers never write
 *  raw numbers. Adding a fourth weight (e.g. 700 / 800) crosses a
 *  visual threshold from "premium editorial" into "loud" and breaks
 *  the calm-trader aesthetic.
 * ─────────────────────────────────────────────────────────────────── */
export const JARVIS_WEIGHT = {
  /** Body copy, captions, eyebrows-at-rest, secondary supporting
   *  values. The default. */
  regular:  400,
  /** Active eyebrow, period-spine selected tab, sub-protagonist values
   *  (`value` size), the resting weight for `headline`. */
  medium:   500,
  /** Awakened state of an active selection (e.g. a focused period
   *  tab gains medium → semibold on hover, returns to medium when
   *  the cursor leaves), pulse-strip pinned metric, story panel
   *  pinned story title. */
  semibold: 600,
} as const

export type JarvisWeightName = keyof typeof JARVIS_WEIGHT

/* ─────────────────────────────────────────────────────────────────────
 *  JARVIS_TONE — the foreground color ladder
 *  ─────────────────────────────────────────
 *  THREE base tones (protag / support / quiet) for neutral text, plus
 *  TWO accent tones (positive / negative) for state-bearing values.
 *
 *  Concretely:
 *
 *    protag    → VANTARY.paper       — the brightest neutral. Used for
 *                                      the headline number, the active
 *                                      period tab, the pinned metric.
 *    support   → VANTARY.paperDim    — second tier. Sub-values, period
 *                                      names appearing inline beside
 *                                      the protagonist, table-row
 *                                      values.
 *    quiet     → VANTARY.ashSoft     — third tier. Eyebrows, captions,
 *                                      labels, microcopy, the
 *                                      whole "supporting cast."
 *    quietest  → VANTARY.ash         — barely-there tier. Placeholder
 *                                      copy, idle-state hint copy that
 *                                      only animates in on awakened.
 *
 *    positive  → VANTARY.amber       — the SINGLE accent that marks
 *                                      good things — winning P&L,
 *                                      active selection, hovered
 *                                      affordance, splitter drag.
 *                                      USED SPARINGLY. Each card
 *                                      should have at most ONE amber
 *                                      element at any moment.
 *    negative  → VANTARY.warnEdge    — the destructive edge. Drawdown
 *                                      values, hide-action confirm,
 *                                      offline state. USED EVEN MORE
 *                                      SPARINGLY than positive.
 * ─────────────────────────────────────────────────────────────────── */

export const JARVIS_TONE = {
  protag:   VANTARY.paper,
  support:  VANTARY.paperDim,
  quiet:    VANTARY.ashSoft,
  quietest: VANTARY.ash,
  positive: VANTARY.amber,
  negative: VANTARY.warnEdge,

  /* ── Accent aliases ───────────────────────────────────────────────
   *  These are NOT new colors — they alias existing VANTARY accent
   *  tokens into the JARVIS namespace so consumers don't have to
   *  reach across two systems for a single editorial moment.
   *
   *    amber      → same as `positive`. Aliased so chip / pin / tab
   *                 code reads `JARVIS_TONE.amber` semantically when
   *                 the role is "accent" rather than "P&L sign".
   *    amberHalo  → the boundary of an amber state. Used as the
   *                 border color of the delta chip when winning,
   *                 the underline of the active period tab, the
   *                 boundary of a pinned story.
   *    amberWash  → the fill of an amber state. Used as the
   *                 background of an awakened delta chip on a
   *                 winning period — gives the chip a quiet glow
   *                 without a heavy fill.
   *    warnEdge   → same as `negative`. Aliased symmetrically with
   *                 `amber` so the destructive ladder reads with the
   *                 same vocabulary.
   * ─────────────────────────────────────────────────────────────── */
  amber:     VANTARY.amber,
  amberHalo: VANTARY.amberHalo,
  amberWash: VANTARY.amberWash,
  warnEdge:  VANTARY.warnEdge,
} as const

export type JarvisToneName = keyof typeof JARVIS_TONE

/* ─────────────────────────────────────────────────────────────────────
 *  JARVIS_RULE — the hairline rule tokens
 *  ──────────────────────────────────────
 *  Law #6: hairlines, not boxes. A `Rule` in JARVIS is a single 1px
 *  line — horizontal between bands, vertical between cells of a strip,
 *  diagonal never. The rule has THREE states matching the three states
 *  of any surface:
 *
 *    idle      → the resting hairline. Visible enough that the eye
 *                registers structure, dim enough that it disappears
 *                when the trader is not asking the question.
 *    awakened  → the hover-state rule. Brightens to paper, gains
 *                slight opacity boost. Signals "you can interact with
 *                this band."
 *    engaged   → the active-state rule. Amber. Marks the active
 *                period in the spine, the dragged splitter, the
 *                pinned metric in the pulse strip.
 *
 *  Solid only. Dashed rules are reserved for *target lines* in charts
 *  (e.g. accuracy targets), never for layout. Dashed-as-decoration
 *  is the visual signature of cheap dashboards and we will not ship
 *  a single one.
 * ─────────────────────────────────────────────────────────────────── */

export interface JarvisRuleToken {
  color:   string
  opacity: number
}

export const JARVIS_RULE = {
  idle: {
    color:   VANTARY.rule,
    opacity: 0.55,
  } as const satisfies JarvisRuleToken,

  awakened: {
    color:   VANTARY.paper,
    opacity: 0.85,
  } as const satisfies JarvisRuleToken,

  engaged: {
    color:   VANTARY.amber,
    opacity: 1.0,
  } as const satisfies JarvisRuleToken,
} as const

export type JarvisRuleName = keyof typeof JARVIS_RULE

/* ─────────────────────────────────────────────────────────────────────
 *  JARVIS_RHYTHM — the locked whitespace scale
 *  ───────────────────────────────────────────
 *  FOUR gaps. Each gap is named for the *kind of separation* it makes,
 *  not for its size. This is intentional — when a future surface asks
 *  "how much space between these two things?" the answer is "how
 *  related are they?" and the answer maps to a name.
 *
 *    tight  →  6px  → within a single zone. Eyebrow-to-value,
 *                     value-to-delta, dot-to-dot.
 *    bay    → 12px  → between zones inside the same surface.
 *                     Pulse-strip cell to cell, period spine tab to
 *                     tab.
 *    band   → 22px  → between surfaces inside the same card.
 *                     Protagonist Band to Pulse Strip, Period Spine
 *                     to Story Panel.
 *    chasm  → 36px  → between cards in a row. Live Equity card to
 *                     Active Windows card. Section to section.
 *
 *  When in doubt, pick the SMALLER gap. Vantary's editorial discipline
 *  is "tight, then tighter." Wide gaps signal a CMS-style layout and
 *  break the trading-terminal density we are after.
 * ─────────────────────────────────────────────────────────────────── */

export const JARVIS_RHYTHM = {
  tight: 6,
  bay:   12,
  band:  22,
  chasm: 36,
} as const

export type JarvisRhythmName = keyof typeof JARVIS_RHYTHM

/* ─────────────────────────────────────────────────────────────────────
 *  JARVIS_MOTION — the locked motion presets
 *  ─────────────────────────────────────────
 *  THREE named curves. Each one answers a specific question:
 *
 *    silk    → 520ms / cubic-bezier(0.65, 0, 0.35, 1)
 *              For grand transitions — splitter snap, focus expand,
 *              card takeover, story panel cycle. The curve is the
 *              standard "ease-in-out" with extra patience at the
 *              start and end so the transition reads as "deliberate
 *              luxury" rather than "snappy app."
 *
 *    awaken  → 220ms / cubic-bezier(0.32, 0, 0.32, 1)
 *              For hover responses — rule brighten, dot reveal, chip
 *              hover, eyebrow brighten. Fast enough to feel alive,
 *              slow enough that the eye registers the change.
 *
 *    snap    → 120ms / cubic-bezier(0.4, 0, 0.6, 1)
 *              For state-confirmations — pulse-strip cell pinning,
 *              tab selection, customize-menu checkbox toggle. Brief
 *              acknowledgment, no decoration.
 *
 *  Both an array (for framer-motion `transition.ease`) and a string
 *  (for CSS `transition`) form are exported because we use both.
 * ─────────────────────────────────────────────────────────────────── */

export interface JarvisMotionToken {
  duration:  number          // ms
  easeArray: [number, number, number, number]  // for framer-motion
  easeCss:   string                             // for CSS transitions
  /** Plain-English description of what this preset is FOR. Encoded
   *  into the type so future readers don't pick the wrong curve. */
  intent:    string
}

export const JARVIS_MOTION = {
  silk: {
    duration:  520,
    easeArray: [0.65, 0, 0.35, 1],
    easeCss:   "cubic-bezier(0.65, 0, 0.35, 1)",
    intent:    "Grand transitions — splitter snap, focus expand, card takeover, story-panel cycle. Use when the trader's eye should follow the transformation across a meaningful distance.",
  } as const satisfies JarvisMotionToken,

  awaken: {
    duration:  220,
    easeArray: [0.32, 0, 0.32, 1],
    easeCss:   "cubic-bezier(0.32, 0, 0.32, 1)",
    intent:    "Hover responses — rule brighten, dot reveal, chip hover, eyebrow brighten. Fast enough to feel alive, slow enough to be noticed.",
  } as const satisfies JarvisMotionToken,

  snap: {
    duration:  120,
    easeArray: [0.4, 0, 0.6, 1],
    easeCss:   "cubic-bezier(0.4, 0, 0.6, 1)",
    intent:    "State-confirmations — pulse-strip pinning, tab selection, customize-menu toggle. Brief acknowledgment with no decoration.",
  } as const satisfies JarvisMotionToken,
} as const

export type JarvisMotionName = keyof typeof JARVIS_MOTION

/* ─────────────────────────────────────────────────────────────────────
 *  JARVIS_CADENCE — the auto-rotation timings
 *  ──────────────────────────────────────────
 *  Law #3 — the card breathes when the trader doesn't.
 *
 *  Three named cadences for three different rotation kinds:
 *
 *    pulse     → 7000ms — Pulse Strip cycles between metric pairs.
 *                          The fastest of the three because the strip
 *                          is small and the trader can absorb a new
 *                          metric pair in ~3 seconds of attention.
 *    story     → 9000ms — Story Panel cycles between stories. Slower
 *                          because each story has more density and
 *                          needs longer to read.
 *    heartbeat → 2000ms — Quiet Layer "alive" pulse. The small dot
 *                          in the corner that tells the trader the
 *                          stream is connected. Steady cardiac rhythm.
 *
 *  ALL rotations PAUSE when:
 *    - the cursor is over the rotating zone
 *    - any zone is in `engaged` (clicked / pinned) state
 *    - the card itself is in expanded takeover mode
 *    - the user has explicitly pinned a single story (storyPanelMode = "pin")
 *
 *  ALL rotations RESUME when:
 *    - the cursor leaves the zone AND no engaged state is active
 *
 *  These are not "nice to haves." They are the difference between
 *  "I'm a calm trader" and "I'm a TV in a hotel lobby." We respect
 *  the trader's stillness.
 * ─────────────────────────────────────────────────────────────────── */

export const JARVIS_CADENCE = {
  pulse:     7000,
  story:     9000,
  heartbeat: 2000,

  /* ── Headline ambient breath ─────────────────────────────────────
   *  4500ms — the rhythm at which the protagonist headline's
   *  text-shadow modulates between low-amplitude (idle) and high-
   *  amplitude (awakened) glows. Slower than `heartbeat` because the
   *  headline is a calm presence, not a vital sign — it should feel
   *  like a chest rising and falling in deep rest, not a pulse rate.
   * ─────────────────────────────────────────────────────────────── */
  breath:    4500,
} as const

export type JarvisCadenceName = keyof typeof JARVIS_CADENCE

/* ─────────────────────────────────────────────────────────────────────
 *  JARVIS_Z — the locked z-index stack
 *  ───────────────────────────────────
 *  Six named layers. Anything above 6 is wrong. The customize popover
 *  and the story-takeover overlay are at 5; only the splitter
 *  drag-tooltip lives at 6.
 *
 *  The numbers themselves are 1-indexed semantic tokens, NOT the
 *  underlying z-index integers — those are computed below as
 *  spaced-out values so we have headroom to insert future layers
 *  without renumbering.
 * ─────────────────────────────────────────────────────────────────── */

export const JARVIS_Z = {
  /** The card itself, in document flow. */
  base:        0,
  /** Hairline rules and dividers that paint above content but
   *  beneath chrome. */
  rule:        10,
  /** Hover affordances — gripper dots, hover hints. */
  hover:       20,
  /** State-engaged elements — pinned cells, active tabs. */
  engaged:     30,
  /** Card-scoped overlays — customize popover, story-takeover. */
  overlay:     50,
  /** The drag tooltip — must paint above the overlay. */
  tooltip:     60,
} as const

export type JarvisZName = keyof typeof JARVIS_Z

/* ─────────────────────────────────────────────────────────────────────
 *  HELPERS — pure functions over the tokens
 *  ────────────────────────────────────────
 *  These are NOT components. They are functions that produce the CSS
 *  object literal a consumer would otherwise hand-write from a token.
 *  Centralizing them here means:
 *    - typography rendering is consistent everywhere
 *    - migrating a token (e.g. tightening `value` letter-spacing) is
 *      a one-line change here
 *    - linting / type-checking surfaces every bad usage at compile
 *
 *  Consumers should generally use the <Tx/> primitive in
 *  jarvis-text.tsx — but for cases where a primitive can't reach
 *  (e.g. SVG <text> elements), these helpers are the escape hatch.
 * ─────────────────────────────────────────────────────────────────── */

/** Build the CSS style object for a Jarvis text token. Returns a
 *  React.CSSProperties so it spreads cleanly into `style={...}`. */
export function jarvisTextStyle(
  size:   JarvisTxName,
  tone:   JarvisToneName    = "support",
  weight: JarvisWeightName  = "regular",
): React.CSSProperties {
  const t = JARVIS_TX[size]
  return {
    fontSize:           t.fontSize,
    lineHeight:         t.lineHeight,
    letterSpacing:      t.letterSpacing,
    fontWeight:         JARVIS_WEIGHT[weight],
    color:              JARVIS_TONE[tone],
    textTransform:      t.uppercase ? "uppercase" : "none",
    fontVariantNumeric: t.tabularNumerals ? "tabular-nums" : "normal",
    /* The font family is selected via Tailwind `font-mono` / `font-sans`
     * classes set up in `app/layout.tsx`. We don't inline the family
     * because we want CSS variable resolution to handle it (so theme
     * swapping works later). The <Tx/> primitive picks the right
     * className based on `t.fontFamily`. */
  }
}

/** Build the CSS style object for a Jarvis rule token. Used by the
 *  <Rule/> primitive and by SVG-based renderers (e.g. chart axes). */
export function jarvisRuleStyle(
  state: JarvisRuleName,
): { background: string; opacity: number } {
  const r = JARVIS_RULE[state]
  return { background: r.color, opacity: r.opacity }
}

/** Build a framer-motion `transition` object from a JARVIS_MOTION
 *  preset. Use this everywhere instead of inline `{ duration, ease }`
 *  literals so motion stays consistent across the entire system. */
export function jarvisMotionTransition(name: JarvisMotionName): {
  duration: number
  ease:     [number, number, number, number]
} {
  const m = JARVIS_MOTION[name]
  return {
    duration: m.duration / 1000,
    ease:     m.easeArray,
  }
}

/** Resolve a numeric P&L value to the canonical tone name. Used by
 *  every surface that renders a delta — the Protagonist Band's chip,
 *  the Pulse Strip's pinned cell, the Story Panel's capital-story
 *  net-line. Centralizing this means a tone change (e.g. introducing
 *  a `caution` tier between flat and negative) is a one-line edit
 *  here, not a sweep across surfaces.
 *
 *    netRaw > 0  → "amber"      (positive territory)
 *    netRaw < 0  → "warnEdge"   (negative territory)
 *    netRaw = 0  → "support"    (flat — neutral, but still readable)
 *
 *  Returns a key of JARVIS_TONE so consumers can spread it directly
 *  into a tone prop or a style lookup. */
export function jarvisToneFor(netRaw: number): JarvisToneName {
  if (netRaw > 0) return "amber"
  if (netRaw < 0) return "warnEdge"
  return "support"
}

/** Magnitude / precision split — the signature Vantary numeric trick
 *  promoted into the JARVIS foundation so every surface that renders
 *  a hero numeral reads from one helper.
 *
 *    "$12,480"  → { lead: "$12,",  tail: "480" }
 *    "67.3%"    → { lead: "67",    tail: ".3%" }
 *    "+1,247R"  → { lead: "+1,",   tail: "247R" }
 *
 *  The lead is rendered in semibold protagonist tone; the tail in
 *  light quiet tone. The visual signature is "the first half of the
 *  number is loud, the precision tail is quiet" — gives instant
 *  magnitude recognition without losing the precision digits.
 *
 *  This helper is INTENTIONALLY string-in / string-out — number
 *  formatting (commas, currency, sign, suffix) is a domain concern
 *  resolved upstream. The split helper just bisects digit count. */
export function splitMagnitude(value: string): { lead: string; tail: string } {
  // Strip currency/sign chars off the front and parse out the digits.
  const m = value.match(/^([^\d-]*)([\d,]+)(.*)$/)
  if (!m) return { lead: value, tail: "" }
  const [, prefix, digits, suffix] = m
  // Bisect the digits roughly in half — first half bold, second half light.
  const half = Math.ceil(digits.replace(/,/g, "").length / 2)
  let walked = 0
  let cut = 0
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== ",") walked += 1
    if (walked >= half) { cut = i + 1; break }
  }
  // Ensure the cut lands AFTER a digit, not on the comma boundary.
  while (cut < digits.length && digits[cut] === ",") cut += 1
  return {
    lead: prefix + digits.slice(0, cut),
    tail: digits.slice(cut) + suffix,
  }
}

/* ─────────────────────────────────────────────────────────────────────
 *  END — JARVIS · FOUNDATION TOKENS
 *  ────────────────────────────────
 *  Surfaces 1 through 7 will consume these tokens and ONLY these
 *  tokens. The next file you should read is `jarvis-text.tsx`, which
 *  exports the <Tx/> primitive — the only sanctioned way to render
 *  text inside a JARVIS surface.
 * ─────────────────────────────────────────────────────────────────── */
