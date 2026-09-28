"use client"

/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · <Tx/> — the canonical text primitive
 *  ─────────────────────────────────────────────────────────────────────
 *  THIS IS THE ONLY SANCTIONED WAY TO RENDER TEXT INSIDE A JARVIS
 *  SURFACE.
 *
 *  Why a primitive instead of just inline styles?
 *
 *    1. CONSISTENCY. Every consumer reaches into the same five sizes,
 *       three weights, three tones. There is no path for someone to
 *       hand-roll `fontSize: 13.5` because it "looked nicer" — there
 *       is no fontSize prop. There is only `size`.
 *
 *    2. ACCESSIBILITY. The primitive picks the right semantic HTML
 *       tag automatically (h2 for headlines, span for inline values)
 *       and forwards `aria-*` props correctly. Screen readers
 *       inherit a coherent document outline without each surface
 *       having to think about it.
 *
 *    3. THEMING HEADROOM. When (not if) we add a light-mode pass,
 *       this is the single component that needs to read a different
 *       tone token. No grep across the codebase.
 *
 *    4. MOTION HEADROOM. The headline number rolls when it updates,
 *       the eyebrow brightens on awakened, the caption fades in on
 *       hover. The primitive owns those motions so consumers don't
 *       reinvent them per-surface.
 *
 *  Usage:
 *
 *    <Tx size="eyebrow" tone="quiet">WEEK</Tx>
 *    <Tx size="headline" tone="protag" weight="medium" tabular>
 *      $24,847.32
 *    </Tx>
 *    <Tx size="caption" tone="support" mono>
 *      vs prior week
 *    </Tx>
 *
 *  Props:
 *    - size       (required)            One of: eyebrow / caption /
 *                                       body / value / headline.
 *    - tone       default "support"     The foreground color tier.
 *    - weight     default "regular"     One of: regular / medium /
 *                                       semibold.
 *    - as         default <span>        Override the rendered HTML
 *                                       tag. Use h1/h2/h3 sparingly
 *                                       and ONLY for the protagonist
 *                                       of a card.
 *    - tabular    default = size's      Override tabular numerals
 *                 default                (rarely needed — `value` and
 *                                       `headline` are already tabular).
 *    - balance    default false         Apply text-balance for
 *                                       multi-line headlines.
 *    - className                        Escape hatch for layout
 *                                       Tailwind classes ONLY. Never
 *                                       for typography.
 *
 *  ANTI-USAGE:
 *    - DO NOT pass a `style={{ fontSize: ... }}` prop. The primitive
 *      ignores any typography styles in the inline style object.
 *    - DO NOT use <Tx/> for chart-internal SVG text. Use the
 *      `jarvisTextStyle()` helper instead and render an <svg:text/>.
 * ═══════════════════════════════════════════════════════════════════════ */

import type { ReactNode, CSSProperties } from "react"
import {
  JARVIS_TX,
  JARVIS_TONE,
  JARVIS_WEIGHT,
  type JarvisTxName,
  type JarvisToneName,
  type JarvisWeightName,
} from "./jarvis-tokens"

/* ─────────────────────────────────────────────────────────────────────
 *  Component props
 * ─────────────────────────────────────────────────────────────────── */

export interface TxProps {
  /** The locked size token. Required. There is no `fontSize` escape
   *  hatch — that's the doctrine. */
  size: JarvisTxName

  /** Foreground color tier. Defaults to `support` because most text
   *  is supporting. Promote to `protag` only for the headline of a
   *  zone. */
  tone?: JarvisToneName

  /** Weight token. Defaults to `regular`. */
  weight?: JarvisWeightName

  /** Override the rendered HTML tag. Defaults to `span` for inline
   *  composition; pass `h1`/`h2`/`h3`/`p` for document-outline
   *  semantics when the text is genuinely a heading or paragraph. */
  as?:
    | "span" | "div" | "p"
    | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    | "label" | "figcaption" | "time"

  /** Override tabular numerals. By default, `value` and `headline`
   *  already render tabular; passing `tabular={false}` is rarely
   *  right (only for things like prose paragraphs that happen to
   *  contain occasional digits). */
  tabular?: boolean

  /** When true, applies the CSS `text-wrap: balance` layout. Use for
   *  multi-line headlines that otherwise produce ragged or top-heavy
   *  line breaks. */
  balance?: boolean

  /** When true, truncates with an ellipsis on overflow. Useful for
   *  tight strip cells where a long value would otherwise wrap. */
  truncate?: boolean

  /** Layout-only Tailwind classes. NEVER typography classes — those
   *  fight the locked scale. */
  className?: string

  /** Inline style. Typography keys (`fontSize`, `lineHeight`,
   *  `letterSpacing`, `fontWeight`, `color`, `textTransform`,
   *  `fontVariantNumeric`) are STRIPPED before render — pass them
   *  via the `size`/`tone`/`weight` props instead. */
  style?: CSSProperties

  /** Standard ARIA forwarding. */
  "aria-label"?:        string
  "aria-hidden"?:       boolean | "true" | "false"
  "aria-live"?:         "off" | "polite" | "assertive"
  "aria-atomic"?:       boolean | "true" | "false"
  role?:                string
  id?:                  string

  /** Tooltip text (HTML `title`). Use sparingly — most explanations
   *  belong in the awakened state, not in a native tooltip. */
  title?: string

  children: ReactNode
}

/* ─────────────────────────────────────────────────────────────────────
 *  The keys in `style` we strip — typography is managed by `size`,
 *  `tone`, `weight`. Layout / positioning keys pass through.
 * ─────────────────────────────────────────────────────────────────── */
const STRIP_TYPOGRAPHY_KEYS = new Set<keyof CSSProperties>([
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "fontWeight",
  "color",
  "textTransform",
  "fontVariantNumeric",
  "fontFamily",
])

function stripTypographyStyles(style: CSSProperties | undefined): CSSProperties {
  if (!style) return {}
  const out: CSSProperties = {}
  for (const k of Object.keys(style) as (keyof CSSProperties)[]) {
    if (!STRIP_TYPOGRAPHY_KEYS.has(k)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(out as any)[k] = (style as any)[k]
    }
  }
  return out
}

/* ─────────────────────────────────────────────────────────────────────
 *  The primitive
 * ─────────────────────────────────────────────────────────────────── */

export function Tx({
  size,
  tone     = "support",
  weight   = "regular",
  as       = "span",
  tabular,
  balance  = false,
  truncate = false,
  className,
  style,
  children,
  ...rest
}: TxProps) {
  const t = JARVIS_TX[size]
  /* Pick the font family Tailwind class. The two classes resolve to
   * `font-sans` (Inter — the editorial voice) and `font-mono` (the
   * data-terminal voice). These are the only two we ever use. */
  const familyClass = t.fontFamily === "mono" ? "font-mono" : "font-sans"

  /* Compose the typography style object. We do this inline rather
   * than via `jarvisTextStyle()` so we can apply per-prop overrides
   * (the `tabular` prop, for example) without an extra function
   * call. The end shape is identical. */
  const typoStyle: CSSProperties = {
    fontSize:           t.fontSize,
    lineHeight:         t.lineHeight,
    letterSpacing:      t.letterSpacing,
    fontWeight:         JARVIS_WEIGHT[weight],
    color:              JARVIS_TONE[tone],
    textTransform:      t.uppercase ? "uppercase" : "none",
    fontVariantNumeric:
      (tabular ?? t.tabularNumerals) ? "tabular-nums" : "normal",
    /* `text-wrap: balance` improves multi-line layouts but is a
     * relatively new property — fall through gracefully on older
     * engines (browsers that don't support it ignore the value, no
     * shim needed). */
    textWrap: balance ? "balance" : undefined,
  }

  /* Truncation is a layout concern; we apply it via inline style
   * (rather than a Tailwind class) so consumers don't have to know
   * which className survives. */
  const truncateStyle: CSSProperties = truncate
    ? {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        // For block-level tags, also set max-width: 100% so
        // truncation triggers reliably inside flex children.
        maxWidth: "100%",
      }
    : {}

  /* Merge the typography → truncation → consumer (sanitized) styles
   * in that order so the consumer can override layout but cannot
   * touch typography. */
  const merged: CSSProperties = {
    ...typoStyle,
    ...truncateStyle,
    ...stripTypographyStyles(style),
  }

  /* Render with the requested tag. We use a small switch instead of
   * dynamic JSX (`<Component/>`) because dynamic JSX with discriminated
   * union props doesn't typecheck cleanly across all valid HTML tags.
   * The switch is small, exhaustive, and tree-shakes equally. */
  switch (as) {
    case "h1": return <h1 className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</h1>
    case "h2": return <h2 className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</h2>
    case "h3": return <h3 className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</h3>
    case "h4": return <h4 className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</h4>
    case "h5": return <h5 className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</h5>
    case "h6": return <h6 className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</h6>
    case "p":  return <p  className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</p>
    case "div":         return <div className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</div>
    case "label":       return <label className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</label>
    case "figcaption":  return <figcaption className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</figcaption>
    case "time":        return <time className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</time>
    case "span":
    default:
      return <span className={`${familyClass}${className ? ` ${className}` : ""}`} style={merged} {...rest}>{children}</span>
  }
}

/* ─────────────────────────────────────────────────────────────────────
 *  PRESET COMPONENTS — convenience wrappers around <Tx/>
 *  ────────────────────────────────────────────────────
 *  These exist because the eyebrow / caption / value patterns repeat
 *  hundreds of times across the surfaces we'll build. Naming them
 *  makes consumer code read as semantic intent rather than as
 *  prop-soup.
 *
 *  Internally they ALL just delegate to <Tx/>. There is no logic in
 *  the presets — they are pure shorthand.
 * ─────────────────────────────────────────────────────────────────── */

/** A mono-caps eyebrow — the protagonist label that sits above a
 *  value or a section. Defaults to `quiet` tone. */
export function TxEyebrow(props: Omit<TxProps, "size">) {
  return <Tx size="eyebrow" tone={props.tone ?? "quiet"} {...props} />
}

/** A mono caption — small support text under a value or a chart. */
export function TxCaption(props: Omit<TxProps, "size">) {
  return <Tx size="caption" tone={props.tone ?? "support"} {...props} />
}

/** Inline readable body copy — story panel paragraphs, list rows. */
export function TxBody(props: Omit<TxProps, "size">) {
  return <Tx size="body" tone={props.tone ?? "support"} {...props} />
}

/** A sub-protagonist value — per-account balance, splitter ratio. */
export function TxValue(props: Omit<TxProps, "size">) {
  return <Tx size="value" tone={props.tone ?? "protag"} weight={props.weight ?? "medium"} {...props} />
}

/** THE protagonist of a card. Use ONCE per card. The default `as`
 *  is `h2` because the headline is the document outline of the
 *  card; the parent surface should not also wrap it in another
 *  heading. */
export function TxHeadline(props: Omit<TxProps, "size">) {
  return <Tx
    size="headline"
    tone={props.tone ?? "protag"}
    weight={props.weight ?? "medium"}
    as={props.as ?? "h2"}
    balance={props.balance ?? true}
    {...props}
  />
}
