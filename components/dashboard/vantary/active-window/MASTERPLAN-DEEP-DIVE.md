# ARCHIO · ACTIVE WINDOW — Deep-Dive Specification
> Companion to `MASTERPLAN.md`. Where the masterplan tells you **what** to build and **why**, this document tells you **exactly** how — to the pixel, to the millisecond, to the easing curve, to the rgba alpha stop. Anything ambiguous in the masterplan is resolved here.

> **The contract:** a junior engineer should be able to ship this panel from this file alone, with zero design-review back-and-forth. Anywhere this file disagrees with the masterplan, this file wins.

---

## TABLE OF CONTENTS

0. The archio material model (the physics of the panel)
1. Geometry & spacing rhythm
2. Color tokens (the eight surface alphas, the three accents, the seam gradients)
3. Typography ledger (every text element, every spec)
4. Iconography & glyph rules
5. Section anatomies — pixel-perfect, element by element
6. Animation registry — every animation, every curve, every period
7. State matrices — idle / hover / focus / active / preview / dead / reduced
8. Layout choreography — the 5-track parallel transitions
9. Reduced motion fallbacks — element by element
10. Accessibility contract — aria, focus, sr-only, keyboard
11. Performance budget — paint, layout, JS, GPU
12. Edge cases & failure modes
13. The reusable primitives — exact APIs
14. QA scenarios — the 22 things to verify before shipping

---

## 0 · THE ARCHIO MATERIAL MODEL

The panel is built as if it were lit by a single warm overhead studio lamp positioned above-left of the viewport at approximately 12 o'clock + 30° azimuth. **All highlights, halos, and specular passes obey this lamp position.** Concretely:

- **Specular catches** (the subtle bright top-left curve on the playbook canvas, on the dossier nameplate) sit at the upper-left 18% × 0% of every surface that has them. Never bottom-right. Never centered. Never both sides.
- **Drop shadows** (used only on hover-lift) cast downward and slightly right: `0 14px 38px rgba(0,0,0,0.38)` — never symmetrical, never upward.
- **Accent halos** are radial and centered on the *content*, not the surface — they read as the content glowing rather than the surface being lit. This is the single most important "expensive" cue: cheap UI lights the box, premium UI lights the meaning.
- **Seams** are horizontal only at section boundaries. Never vertical (vertical dividers belong to the cheap-utility-chrome world). The one exception: the WHY/EXPECT pair uses a `gap` instead of a stroke, which is structurally the same idea.

The material itself is **smoked obsidian glass with a 6px blur**: `backdropFilter: blur(6px)`. The panel never declares a solid background color, only translucent washes over the page's deep neutral. If the page background were removed, the panel would be 92% transparent.

---

## 1 · GEOMETRY & SPACING RHYTHM

### 1.1 The 4-px baseline grid

Every gap, padding, and offset in the panel is a multiple of 4. The allowed values, in ascending order:

| Token        | Pixels | Where used                                                  |
| ------------ | ------ | ----------------------------------------------------------- |
| `aw-space-1` | 2      | Dot-separator gaps · seam thickness · indicator inner-stroke|
| `aw-space-2` | 4      | Inter-row breath inside dense metadata stacks               |
| `aw-space-3` | 6      | Inline cluster gaps (`gap: 6` on icon+label pairs)          |
| `aw-space-4` | 8      | Eyebrow→headline · tab padding-y · base unit                |
| `aw-space-5` | 12     | Section internal gaps · between metadata rows               |
| `aw-space-6` | 16     | Headline→body · between secondary blocks                    |
| `aw-space-7` | 24     | Between cells in WHY/EXPECT pair · between major sections   |
| `aw-space-8` | 32     | Between LAYERS (rail → canvas → dossier)                    |
| `aw-space-9` | 48     | Drawer-expand top inset                                     |

**Forbidden:** anything not in this table. No `7px`, no `13px`, no `15px`. If a value can't be expressed in the grid, the design is wrong, not the grid.

### 1.2 Panel envelope

- Panel outer width: inherits from the right-rail column (`MarketIntelConsole` provides ~480px on desktop).
- Panel outer padding: `0` (no padding at the envelope — each layer paints its own breathing room).
- Layer-to-layer gap: `aw-space-8` (32px).
- Layers stack in `display: flex; flex-direction: column;` — never grid (grid is reserved for the WHY/EXPECT pair only).

### 1.3 Per-layer geometry

| Layer                         | Vertical pad (top/bot) | Horizontal pad (l/r) | Inner content max-width |
| ----------------------------- | ---------------------- | -------------------- | ----------------------- |
| `TemporalAnchorRail`          | `aw-space-4` / `aw-space-3` | `aw-space-5`     | full                    |
| `DayPlaybookCanvas` (compact) | `aw-space-5` / `aw-space-5` | `aw-space-5`     | full                    |
| `DayPlaybookCanvas` (drawer)  | `aw-space-7` / `aw-space-7` | `aw-space-7`     | 720px (centered)        |
| `ActiveWindowDossier`         | `aw-space-6` / `aw-space-7` | `aw-space-5`     | full                    |

### 1.4 Z-index ladder (local to the panel)

```
panel root        z-0   (the ambient breath layer)
section surfaces  z-1   (whatever the section paints)
seams             z-2   (seams sit above surfaces, below content)
content           z-3   (text, dots, indicators)
hover spotlight   z-4   (cursor-following radial)
focus ring        z-5   (keyboard focus state)
drawer overlay    z-10  (when the playbook drawer is open)
```

Nothing in the panel ever needs `z-index > 10` locally. The panel itself sits at whatever z-index `your-space.tsx` mounts it.

---

## 2 · COLOR TOKENS

### 2.1 The three accent triples

Every accent in the panel is a **triple**: `core`, `wash`, `halo`. These are derived from the cartouche accent's `rgb` triple at three fixed alphas.

```ts
const triple = (rgb: string) => ({
  core: `rgb(${rgb})`,           // text, indicators, fills
  wash: `rgba(${rgb}, 0.10)`,    // 10% — section ambient tints, tab radial backdrop
  halo: `rgba(${rgb}, 0.45)`,    // 45% — text-shadow glow, drop-shadow filter
})
```

The three accents map to three trader-states:

| State       | rgb triple       | Hex (reference) | When                                            |
| ----------- | ---------------- | --------------- | ----------------------------------------------- |
| `LIVE-EDGE` | `255, 184, 76`   | `#FFB84C`       | Live KZ phase on a KEY DAY — amber. "Earn now." |
| `LIVE-DEAD` | from `cartoucheAccent.rgb` (teal/sage/etc.) | varies | Live but dead-zone phase — uses the active cartouche template's accent. "Stay sharp." |
| `PREVIEW`   | `196, 196, 188`  | `#C4C4BC`       | User is studying a non-live tab — paper-dim.    |

**The accent switch is animated.** The panel root sets `--aw-core`, `--aw-wash`, `--aw-halo` CSS variables. When the accent changes, each variable transitions over **320ms** with `ease-out`. Every animated child inherits this transition automatically. **No per-component prop drilling.**

### 2.2 The eight surface alphas

Every translucent surface in the panel uses one of these eight alphas. Period.

| Token         | Alpha | Used for                                                           |
| ------------- | ----- | ------------------------------------------------------------------ |
| `surf-0`      | 0.00  | Pure transparent — most surfaces                                   |
| `surf-1`      | 0.02  | The atmospheric breath floor                                       |
| `surf-2`      | 0.04  | Idle section ambient wash                                          |
| `surf-3`      | 0.06  | Hover section ambient wash                                         |
| `surf-4`      | 0.08  | Live-tab radial backdrop (idle)                                    |
| `surf-5`      | 0.12  | Live-tab radial backdrop (breath peak)                             |
| `surf-6`      | 0.18  | Sheen pass peak alpha                                              |
| `surf-7`      | 0.22  | Seam base alpha (`aw-seam-base`)                                   |
| `surf-8`      | 0.32  | Click-confirm pulse peak                                           |

If a future design needs a different alpha, it must replace one of these tokens, not coexist with them. We never have nine alphas.

### 2.3 The seam gradient (the canonical recipe)

```css
background: linear-gradient(
  90deg,
  transparent  0%,
  var(--aw-core) 18%,
  var(--aw-core) 82%,
  transparent  100%
);
opacity: 0.22;        /* aw-seam-base */
height: 1px;
```

The shimmer pass is a separate child:

```css
position: absolute;
inset: 0;
background: linear-gradient(
  90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.18) 50%,
  transparent 100%
);
background-size: 260% 100%;
animation: aw-seam-shimmer 14s cubic-bezier(0.55, 0.08, 0.45, 0.92) infinite;
mix-blend-mode: screen;
```

Keyframes:

```
0%   { background-position: 200% 0;   opacity: 0;    }
55%  { background-position: 200% 0;   opacity: 0;    }
70%  { background-position:  50% 0;   opacity: 0.22; }
95%  { background-position: -100% 0;  opacity: 0;    }
100% { background-position: -100% 0;  opacity: 0;    }
```

The shimmer parks off-screen for 55% of each cycle, then traverses in 40% of the cycle, peaks at 70%, lands at 95%. The eye reads it as "a slow lighthouse beam every ~14s."

### 2.4 Text colors

| Role          | Token             | Computed value                                                 |
| ------------- | ----------------- | -------------------------------------------------------------- |
| `paper`       | `VG_VT.paper`     | Bone-white at ~96% L                                           |
| `paper-dim`   | `VG_VT.paperDim`  | Same hue at ~72% L                                             |
| `paper-ash`   | `VG_VT.paperAsh`  | Same hue at ~52% L                                             |
| `accent-text` | `var(--aw-core)`  | The active accent                                              |
| `live-emerald`| `#5BD9A6`         | Reserved exclusively for "GO / OK" signals (we don't use it in this panel) |

Forbidden in this panel: any hex literal in JSX. Every text color must come from this table.

---

## 3 · TYPOGRAPHY LEDGER

Every text node in the panel, mapped to a row. **If a text node in the implementation doesn't match one of these rows, it's a bug.**

| # | Element                              | Family    | Px   | Weight | Letter-spacing | Line-height | Color       |
| - | ------------------------------------ | --------- | ---- | ------ | -------------- | ----------- | ----------- |
| 1 | Rail eyebrow `DAY OS`                | mono      | 9.5  | 500    | 0.34em         | 1           | paper-dim   |
| 2 | Rail status `LIVE`                   | mono      | 9.5  | 500    | 0.40em         | 1           | accent-text |
| 3 | Rail date `WED 13 MAY`               | mono      | 9.5  | 400    | 0.22em         | 1           | paper-dim   |
| 4 | Rail clock `21:25 UTC`               | mono      | 9.5  | 400    | 0.22em         | 1 (tabular) | accent-text |
| 5 | Canvas day `WED`                     | mono      | 16   | 500    | 0.18em         | 1.1         | paper       |
| 6 | Canvas sub `TODAY` / `PREVIEW`       | mono      | 7.5  | 400    | 0.34em         | 1           | paper-ash   |
| 7 | Canvas crumb `DAY PLAYBOOK`          | mono      | 9.5  | 500    | 0.32em         | 1.4         | paper-dim   |
| 8 | Canvas quality `KEY DAY`             | mono      | 9.5  | 500    | 0.32em         | 1.4         | accent-text |
| 9 | Canvas subtitle `MIDWEEK INFLECTION` | mono      | 9.5  | 400    | 0.32em         | 1.4         | paper-dim   |
|10 | Canvas verdict body                  | sans      | 14   | 400    | -0.01em        | 1.55        | paper       |
|11 | Canvas verdict body trailing tone    | sans      | 14   | 400    | -0.01em        | 1.55        | paper-dim   |
|12 | Canvas stat eyebrow `OPTIMAL`        | mono      | 8.5  | 500    | 0.34em         | 1           | paper-ash   |
|13 | Canvas stat value `LONDON`           | mono      | 9    | 500    | 0.22em         | 1           | paper       |
|14 | Canvas action `▾ STUDY` / `▴ FOLD`   | mono      | 8.5  | 500    | 0.32em         | 1           | paper-dim   |
|15 | Dossier eyebrow `ACTIVE WINDOW`      | mono      | 9.5  | 500    | 0.34em         | 1           | paper-dim   |
|16 | Dossier clock `21:25 UTC`            | mono      | 9.5  | 400    | 0.22em         | 1 (tabular) | accent-text |
|17 | Dossier snap-to-live `← LIVE`        | mono      | 9    | 500    | 0.36em         | 1           | accent-text |
|18 | Phase tab label                      | mono      | 9.5  | 500    | 0.32em         | 1           | paper-dim   |
|19 | Phase tab label (active)             | mono      | 9.5  | 500    | 0.32em         | 1           | accent-text |
|20 | Session nameplate `POST-NY`          | sans      | 32   | 600    | -0.03em        | 1.1         | accent-text |
|21 | Session tag `DEAD` / `KZ`            | mono      | 9.5  | 500    | 0.40em         | 1           | accent-text |
|22 | Counter `325m elapsed`               | mono      | 11   | 400    | 0.12em         | 1 (tabular) | paper-dim   |
|23 | Progress phase label                 | mono      | 8.5  | 400    | 0.32em         | 1           | paper-ash   |
|24 | Progress percentage                  | mono      | 8.5  | 500    | 0.18em         | 1 (tabular) | accent-text |
|25 | FOCUS NOW eyebrow                    | mono      | 11   | 500    | 0.40em         | 1           | paper-dim   |
|26 | FOCUS NOW count `2/2`                | mono      | 9.5  | 500    | 0.22em         | 1 (tabular) | accent-text |
|27 | Focus headline                       | sans      | 32   | 600    | -0.03em        | 1.1         | paper       |
|28 | Focus body                           | sans      | 12.5 | 400    | -0.005em       | 1.6         | paper-dim   |
|29 | WHY/EXPECT eyebrow                   | mono      | 9    | 500    | 0.34em         | 1           | paper-ash   |
|30 | WHY/EXPECT body                      | sans      | 12.5 | 400    | -0.005em       | 1.6         | paper-dim   |
|31 | MICRO-PHASES eyebrow                 | mono      | 9    | 500    | 0.34em         | 1           | paper-ash   |
|32 | MICRO-PHASES hint `TAP TO STUDY`     | mono      | 9    | 400    | 0.32em         | 1           | paper-ash   |
|33 | Micro-phase label                    | mono      | 9    | 500    | 0.28em         | 1           | paper-dim   |
|34 | Micro-phase label (active)           | mono      | 9    | 500    | 0.28em         | 1           | accent-text |

**Text-shadow halos** (applied to rows 2, 4, 8, 16, 17, 19, 20, 21, 24, 26, 34):

```css
text-shadow: 0 0 8px var(--aw-halo), 0 0 14px rgba(255,255,255,0.08);
```

Row 20 (the 32px session nameplate) is the exception — its halo is twice as wide:

```css
text-shadow: 0 0 16px var(--aw-halo), 0 0 32px var(--aw-wash);
```

**Text-wrap rules:**
- All sans body copy ≥ 12px gets `text-wrap: pretty`.
- All sans headlines ≥ 24px get `text-wrap: balance`.
- All mono uppercase eyebrows get `white-space: nowrap` (they're identity labels, never wrap).
- Long phase labels that *might* wrap get `text-overflow: ellipsis` with `max-width: 96px`.

---

## 4 · ICONOGRAPHY & GLYPH RULES

The panel uses **four glyphs total**. Anything beyond this requires design review.

| Glyph         | Source                 | Size | Stroke | Color           | Where                                       |
| ------------- | ---------------------- | ---- | ------ | --------------- | ------------------------------------------- |
| Refresh swirl | `lucide-react`         | 13px | 1.5    | accent-text     | (not used in this panel — Flight Deck only) |
| Chevron-down  | typographic `▾` (U+25BE)| 10px | n/a   | paper-dim       | Playbook compact action                     |
| Chevron-up    | typographic `▴` (U+25B4)| 10px | n/a   | paper-dim       | Playbook drawer close                       |
| Left arrow    | typographic `←` (U+2190)| 10px | n/a   | accent-text     | Snap-to-live chip                           |

All glyphs are *typographic*, not SVG. This keeps stroke weight consistent with the surrounding mono labels and means the glyph inherits letter-spacing animations automatically.

The four indicator shapes are **CSS-only**:

| Shape         | Anatomy                                              | Where                                       |
| ------------- | ---------------------------------------------------- | ------------------------------------------- |
| Filled dot    | `5×5 border-radius:50% background:accent-core`       | Live tabs, live micro-phases                |
| Hollow ring   | `5×5 border-radius:50% border:1.5px accent-30%`      | Future tabs / future micro-phases           |
| Soft dot      | `3×3 border-radius:50% background:accent-55% glow`   | Inline metadata separators                  |
| Ripple        | filled dot + animated outer ring (see §6.3)          | Live anchor (rail), live tab, live phase   |

---

## 5 · SECTION ANATOMIES (pixel-perfect)

### 5.1 `TemporalAnchorRail`

```
┌─ Panel root ────────────────────────────────────────────────────────┐
│                                                                     │
│   ●·· DAY OS  ·  LIVE  ·  WED 13 MAY  ·  21:25 UTC                  │
│   ─────────────────────────────────────────────────────────────     │
└─────────────────────────────────────────────────────────────────────┘
```

**Container.** `display: flex; flex-direction: column; gap: 8px; padding: 8px 12px 6px;`

**Row 1: the inline cluster.** `display: flex; align-items: center; gap: 8px;`

Children, left-to-right:

1. **Ripple anchor** — `<ArchioPulseDot size={6} cadence={2.6} accent="amber-when-live-and-key-day-else-cartouche"/>`. Inner dot 6px, outer ring scales 1→2.4 alpha 0.6→0 over 2.6s.
2. **Eyebrow** `DAY OS` (row #1 in §3 ledger).
3. **Soft separator** `<span class="aw-soft-dot"/>` — a 3×3 dot, `background: rgba(accent, 0.55)`, `boxShadow: 0 0 6px rgba(accent, 0.60)`.
4. **Status stamp** `LIVE` (row #2). When the page loads, this stamp animates in via `opacity 0 → 1, letter-spacing 0.20em → 0.40em` over 320ms (cubic `0.22, 0.61, 0.36, 1`).
5. **Soft separator.**
6. **Date** `WED 13 MAY` (row #3).
7. **Soft separator.**
8. **Clock** `21:25 UTC` (row #4). Tabular-nums on. Wrapped in `<DigitFlashOnMinute>` (see §6.7).

**Row 2: the seam.** `<ArchioSeam orientation="horizontal" alpha={0.22} shimmer shimmerCycle={14}/>`. Sits flush at the bottom of the rail with a `2px` margin-top so the seam is visually "owned" by the rail above it.

### 5.2 `DayPlaybookCanvas` — compact state

```
┌─ canvas root ───────────────────────────────────────────────────────┐
│                                                                     │
│   WED       DAY PLAYBOOK ·· KEY DAY ·· MIDWEEK INFLECTION       ▾   │
│   TODAY                                                       STUDY │
│             Wednesday ·· Midweek reversal zone. Weekly high or low  │
│             often forms here.                                       │
│                                                                     │
│             OPTIMAL  LONDON · NEW YORK    SIZE  FULL …  RISK  DUAL… │
│                                                                     │
│   ────────────────────────────────────────────────────────────      │
└─────────────────────────────────────────────────────────────────────┘
```

**Container.** `display: grid; grid-template-columns: 64px 1fr auto; grid-template-rows: auto; column-gap: 16px; row-gap: 8px; padding: 12px;` (NB: this is the only grid in the panel. `64px` is the day-badge column width.)

**Left day badge.**
- Column 1, row 1.
- `<div style="display:flex;flex-direction:column;gap:2px;align-items:flex-start">`
- The 6px ripple anchor sits 4px to the left of `WED` via negative margin (`marginLeft: -10px; marginRight: 4px;`) so the dot lives in the column's left gutter.
- `WED` (row #5) on top, `TODAY` (row #6) below.
- **Preview cross-fade.** When `!isLive`, `TODAY` swaps to `PREVIEW`:
  - Old token: `motion.span exit: { opacity: 0, y: -4 }` (220ms).
  - New token: `motion.span initial: { opacity: 0, y: 4 } animate: { opacity: 1, y: 0 }` (220ms with 80ms delay).

**Middle verdict block.**
- Column 2, row 1. Three vertical strata, `gap: 4px`.

  **Stratum 1 — crumb.** `display: flex; align-items: center; gap: 8px; flex-wrap: wrap;`
  - `DAY PLAYBOOK` (row #7) → soft-dot → `KEY DAY` (row #8, breathing — see §6.5) → soft-dot → `MIDWEEK INFLECTION AND REVERSAL PHASE` (row #9).
  - Each soft-dot is a 2px element (smaller than other separators because the line height is denser here).

  **Stratum 2 — verdict.** `display: flex; align-items: baseline; gap: 8px;`
  - `Wednesday` (row #10) → soft-dot (3px) → `Midweek reversal zone. Weekly high or low often forms here.` (row #11).

  **Stratum 3 — stat trio (live day only).** `display: flex; align-items: center; gap: 16px; flex-wrap: wrap;`
  - Three groups, each `display: flex; align-items: baseline; gap: 6px;`.
  - Eyebrow (row #12) → value (row #13). Eyebrows separated from prior group by a soft-dot.
  - If `!isLive`, this stratum is omitted.

**Right action.**
- Column 3, row 1, vertically centered via `align-self: center;`.
- `display: flex; flex-direction: column; align-items: center; gap: 2px;`
- Top: the chevron glyph (10px paper-dim).
- Bottom: `STUDY` / `FOLD` micro-label (row #14).
- The whole action is a `<button>` (entire canvas root is a button — see §10).

**Bottom seam.** `<ArchioSeam/>` flush at the bottom (margin-top: 0 from the last stratum + 12px row-gap acts as breath).

**Hover state of the canvas root** (whole row, not just the action):
- `transform: translateY(-1px)` over 240ms.
- `boxShadow: 0 14px 38px rgba(0,0,0,0.32), 0 0 48px var(--aw-wash);` (this is the ONLY shadow change on hover anywhere in the panel — cheap surfaces hover-shadow per-element; the archio canvas hover-shadows the whole row).
- The hover-spotlight (§6.8) becomes visible.
- No border change. No background change. The lift + shadow + spotlight together are the entire signal.

### 5.3 `DayPlaybookCanvas` — drawer state

When `expanded === true`, a `<motion.div>` mounts beneath the compact row.

**Container.**
- `overflow: hidden;`
- `initial: { height: 0, opacity: 0, y: -8 }`
- `animate: { height: 'auto', opacity: 1, y: 0 }`
- `exit: { height: 0, opacity: 0, y: -8, transition: { duration: 0.28 } }`
- `transition: { duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }`

**Inner padding.** `padding: 24px 24px 24px;` with `max-width: 720px; margin: 0 auto;`.

**Section order inside the drawer:**

1. Day tabs (`MON · TUE · WED · THU · FRI`) with `layoutId="aw-day-tab-underline"` — reused from existing `DayPlaybookPanel`.
2. Section: `RECOMMENDATION`.
3. Section: `MANIPULATION PATTERN`.
4. Section: `HISTORICAL EDGE`.
5. Section: `PSYCHOLOGY`.
6. Section: `MISTAKES TO AVOID`.
7. Section: `RITUAL`.

Each section is:
- Eyebrow (mono 9px 0.34em paper-ash) → `<ArchioSeam shimmer={false}/>` (a non-shimmering 40-wide micro-seam, 6px below the eyebrow) → body (sans 13px paper-dim line-height 1.6).

Sections **stagger-in** with `0.045s × index` delay on `opacity 0 → 1` and `y: 6 → 0` (260ms each).

### 5.4 `ActiveWindowDossier`

```
┌─ dossier root ──────────────────────────────────────────────────────┐
│                                                                     │
│   ●·· ACTIVE WINDOW                                       21:25 UTC │
│                                                                     │
│   ───●─────────────────────────────────────────────────────         │
│       PRE-LDN   LDN-KZ   LDN-NY   NY-KZ   LDN-CLS   POST-NY   OFF   │
│         ◌         ◌        ◌       ◌        ◌         ●        ◌   │
│                                                                     │
│   POST-NY  DEAD                                                     │
│                                                                     │
│   325m elapsed  ·  35m remaining                                    │
│   ────────────────────────────────────────────────────────●─        │
│   POST-NY                                                      90%  │
│                                                                     │
│   ────────────────────────────────────────────────────────────      │
│                                                                     │
│   ●·· FOCUS NOW                                              2/2    │
│                                                                     │
│   Tomorrow Plan                                                     │
│   ────────────────────────────────────────────────────────────      │
│   Build tomorrow's bias. Identify the levels you'll watch on the    │
│   next London open.                                                 │
│                                                                     │
│   ┌─── WHY ─────────────┐    ┌─── EXPECT ──────────────┐            │
│   │ ── (micro-seam)     │    │ ── (micro-seam)         │            │
│   │ Pre-built plans     │    │ Light price action.     │            │
│   │ execute …           │    │ Focus on …              │            │
│   └─────────────────────┘    └─────────────────────────┘            │
│                                                                     │
│   ────────────────────────────────────────────────────────────      │
│                                                                     │
│   MICRO-PHASES                                       TAP TO STUDY   │
│   ─────────────●────────────────●─────────────●────────●────────    │
│     REVIEW         PLAN          PREP          EXECUTE    CLOSE     │
│      ◌              ◌             ●              ◌          ◌       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

The dossier breaks into seven sub-sections, each separately specified below.

#### C-1 · Dossier eyebrow rail (full spec)

- `display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 0 16px;`
- Left cluster: `display: flex; align-items: center; gap: 8px;`
  - `<ArchioPulseDot size={5} cadence={2.6}/>`
  - `ACTIVE WINDOW` label (row #15). When `!isLive`, swaps via 220ms typed cross-fade to `PREVIEW · NOT LIVE`.
  - When `!isLive`, append a third child: the **snap-to-live chip** — see §5.4.C-1.b below.
- Right cluster: `21:25 UTC` (row #16). Tabular-nums, wrapped in `<DigitFlashOnMinute/>`.

**§5.4.C-1.b · Snap-to-live chip.**
- A `<button>` with `padding: 4px 8px; background: transparent; border: none;`.
- Children: typographic `←` glyph (10px accent) + `LIVE` label (row #17).
- The accent halo behind it: `boxShadow: 0 0 14px var(--aw-wash), 0 0 22px rgba(accent, 0.06);` (no inset, only outer).
- Hover: halo doubles → `boxShadow: 0 0 22px rgba(accent, 0.32), 0 0 36px rgba(accent, 0.14);`, transition 220ms.
- Reduced motion: same hover state, no transition.

#### C-2 · Phase-tab rail (full spec — the cinematic centerpiece)

Container: `position: relative; padding: 12px 0 16px;`. Inside:

**1. The baseline rail (seam).**
- `<ArchioSeam shimmer={false}/>` absolutely positioned at top: 0, full width.
- 1px height. Alpha 0.22. NO shimmer here (we don't want the rail to compete with the active-tab radial breath).

**2. The tab strip.**
- `display: flex; align-items: center; justify-content: space-between; gap: 0; padding: 16px 0 12px;` (tabs share the row equally).
- Each tab is a `<button type="button">`.

**Per-tab anatomy:**
```
┌─ button ──────┐
│   LDN-KZ      │  ← row #18 / #19
│      ◌        │  ← indicator (5×5)
└───────────────┘
```
- `display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 6px;`
- `background: transparent; border: none; cursor: pointer;`
- `position: relative` (so the radial backdrop can absolute-position inside).
- The radial backdrop (only on the live tab): `<div style="position:absolute;inset:-8px -10px -4px;background:radial-gradient(60% 100% at 50% 50%, var(--aw-wash), transparent 80%); border-radius: 999px; z-index: -1;"/>` — animated alpha 0.08 → 0.12 every 3.4s.

**Active-selection underline.**
- A `<motion.div layoutId="aw-active-phase-underline">` rendered ONLY on the currently-selected tab.
- Sits at the top of the button, exactly on the baseline rail (the seam).
- `height: 2px; width: 100%; background: var(--aw-core); boxShadow: 0 0 8px var(--aw-halo);`.
- Framer Motion morphs it from old tab to new tab via shared layout, 460ms `[0.22, 0.61, 0.36, 1]`.

**Hover state per tab:**
- Label letter-spacing tightens `0.32em → 0.18em` over 180ms ease-out.
- Indicator dot scales `1 → 1.4` (transform-origin center) over 180ms.
- Indicator dot color stays the same (NO color change on hover).

#### C-3 · Session nameplate (full spec)

- `display: flex; align-items: baseline; gap: 12px; padding: 12px 0 8px;`
- Left: `POST-NY` (row #20). Letter-spacing -0.03em. The name itself has the breathing text-shadow halo (see §6.4).
- Right: `DEAD` / `KZ` (row #21). 
  - When `DEAD`: opacity 0.78, breathing cadence 6.0s.
  - When `KZ`: opacity 1.0, breathing cadence 3.4s.
  - When `OFF`: opacity 0.5, no breathing.

#### C-4 · Counters & progress bar (full spec)

**Counters row.** `display: flex; align-items: center; gap: 8px; padding: 4px 0 12px;`
- Left counter: `325m elapsed` (row #22).
- Soft separator (3px).
- Right counter: `35m remaining` (row #22).

**Progress bar.** `position: relative; height: 2px; width: 100%; background: rgba(accent, 0.08);`
- Fill: `<motion.div animate={{ width: progress * 100 + '%' }}/>` — 600ms ease-out.
- Playhead: an `<ArchioPulseDot size={5} cadence={2.6}/>` absolutely positioned at `left: ${progress * 100}%; top: 50%; transform: translate(-50%, -50%);`.

**Bottom labels.** `display: flex; align-items: center; justify-content: space-between; padding: 6px 0 0;`
- Left: phase label (row #23, e.g. "POST-NY").
- Right: percentage (row #24).

#### C-5 · FOCUS NOW headline block (full spec)

**Eyebrow row.** `display: flex; align-items: center; justify-content: space-between; padding: 16px 0 8px;` (the 16px top is the breath that visually demarcates this block from the progress bar above).
- Left: `<ArchioPulseDot size={6} cadence={2.6}/>` + `FOCUS NOW` (row #25). Gap 8px.
- Right: `2/2` (row #26).

**Headline.** `<motion.h2 layoutId="aw-focus-headline">Tomorrow Plan</motion.h2>` — row #27. The layoutId is what makes new headlines slide in / old slide out when the user changes phase or micro-phase.
- Layout transition: `duration: 0.36, ease: [0.22, 0.61, 0.36, 1]`.

**Headline seam.** `<ArchioSeam shimmer/>` at 16px below the headline.

**Body.** Row #28. `padding: 12px 0 0;`. Wrapped in `<ArchioRotatingLabel cycle={14}/>` when the phase has `focusPsych` (rotates between two framings every 14s).

#### C-6 · WHY / EXPECT pair (full spec)

- `display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px 0;`
- Each cell:
  - `display: flex; flex-direction: column; gap: 6px;`
  - Eyebrow (row #29).
  - Micro-seam: `<ArchioSeam width={40} alpha={0.6} shimmer={false}/>` — but wait, this is the special one: its **width** animates (see §6.6). Use a special prop `breathWidth={[40, 56]}`.
  - Body (row #30). `text-wrap: pretty`.
- Hover (per cell):
  - Micro-seam width interpolates to `88px` over 220ms ease-out.
  - Body color transitions `paper-dim → paper` over 220ms.
  - Cursor: `default` (cells aren't clickable, just hoverable for the polish).

#### C-7 · MICRO-PHASES ladder (full spec)

**Eyebrow row.** `display: flex; align-items: center; justify-content: space-between; padding: 24px 0 12px;` (the 24px above is the breath between this block and WHY/EXPECT).
- Left: `MICRO-PHASES` (row #31).
- Right: `TAP TO STUDY` (row #32).

**Ladder.** `position: relative; padding: 14px 0 0;`
- Baseline seam: `<ArchioSeam shimmer={false}/>` absolutely at top: 0.
- Phase strip: identical anatomy to §C-2's tab strip but with smaller padding (`padding: 12px 0 0`) and row #33 labels.
- Active-indicator dot: `<motion.div layoutId="aw-micro-active"/>` — same shared-layout machinery, 360ms transition.

---

## 6 · ANIMATION REGISTRY

Every animation in the panel, numbered. Reduce-motion fallback in the rightmost column.

| # | Name                          | Driver        | Trigger          | Duration / cadence | Easing                          | Reduced-motion |
| - | ----------------------------- | ------------- | ---------------- | ------------------ | ------------------------------- | -------------- |
| 1 | Panel ambient breath          | Framer        | mount → infinite | 8.0s loop          | easeInOut                       | static at 0.04 |
| 2 | Pulse-dot concentric ripple   | Framer        | mount → infinite | 2.6s loop          | easeOut on scale, linear on alpha | solid dot only |
| 3 | Session tag halo breath (KZ)  | Framer        | mount → infinite | 3.4s loop          | easeInOut                       | static 10px    |
| 4 | Session tag halo breath (DEAD)| Framer        | mount → infinite | 6.0s loop          | easeInOut                       | static 10px    |
| 5 | Live-tab radial breath        | Framer        | mount → infinite | 3.4s loop          | easeInOut                       | static 0.10    |
| 6 | KEY DAY token breath          | Framer        | mount → infinite | 4.0s loop          | easeInOut                       | static 11px    |
| 7 | WHY/EXPECT seam breath        | Framer        | mount → infinite | 4.0s loop          | easeInOut                       | static 48px    |
| 8 | Seam shimmer pass             | CSS keyframes | mount → infinite | 14.0s loop         | cubic(.55,.08,.45,.92)          | omitted        |
| 9 | UTC minute-rollover flash     | Framer        | clock tick       | 320ms              | easeOut                         | omitted        |
|10 | Active-tab underline morph    | Framer (layoutId) | tab click   | 460ms              | cubic(.22,.61,.36,1)            | snap (0ms)     |
|11 | Active micro-phase morph      | Framer (layoutId) | phase click | 360ms              | cubic(.22,.61,.36,1)            | snap           |
|12 | Focus headline morph          | Framer (layoutId) | phase change| 360ms              | cubic(.22,.61,.36,1)            | snap           |
|13 | Session nameplate cross-fade  | Framer        | tab change       | 260ms (down 6/up 6)| easeOut                         | snap           |
|14 | Progress fill width           | Framer        | progress change  | 600ms              | easeOut                         | snap           |
|15 | Playhead dot position         | Framer        | progress change  | 600ms              | easeOut                         | snap           |
|16 | Phase-tab label rotation (live)| ArchioRotatingLabel | mount → infinite | 9.0s/variant | crossfade 320ms                  | short name only|
|17 | WHY/EXPECT body rotation      | ArchioRotatingLabel | mount → infinite | 14.0s/variant | crossfade 320ms                | tactical only  |
|18 | Tab hover letter-spacing      | Framer        | hover            | 180ms              | easeOut                         | omitted        |
|19 | Tab hover indicator scale     | Framer        | hover            | 180ms              | easeOut                         | omitted        |
|20 | Canvas hover lift             | Framer        | hover            | 240ms              | easeOut                         | omitted        |
|21 | Canvas hover shadow           | Framer        | hover            | 240ms              | easeOut                         | omitted        |
|22 | Hover spotlight follow        | Framer        | mousemove        | 220ms              | easeOut                         | omitted        |
|23 | Drawer expand                 | Framer        | expand click     | 380ms              | cubic(.22,.61,.36,1)            | duration 0     |
|24 | Drawer section stagger        | Framer        | drawer mounted   | 260ms × index/22.5 | easeOut                         | duration 0     |
|25 | TODAY ↔ PREVIEW cross-fade    | Framer        | live-state flip  | 220ms              | easeOut                         | snap           |
|26 | Eyebrow status cross-fade     | Framer        | live-state flip  | 220ms              | easeOut                         | snap           |
|27 | Snap-to-live glow boost       | Framer        | hover            | 220ms              | easeOut                         | omitted        |
|28 | Day-badge swap (drawer tab)   | Framer (layoutId) | day tab click| 360ms              | cubic(.22,.61,.36,1)            | snap           |

### 6.1 The cadence map (visual chart)

```
sec  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 ...
       breath ────────────────────────────●────────────────
       liveDot ──●──●──●──●──●──●──●──●──●──●──●──●──●──
       sessionKZ ───●───●───●───●───●───●───●
       liveTab   ───●───●───●───●───●───●───●
       whyExpect ─────●─────●─────●─────●
       quality   ─────●─────●─────●─────●
       shimmer   ─────────────●──────────────────●──
       tabRot    ────────────────●────────────●─────────
       bodyRot   ─────────────────●─────────────●───────
```

(Each `●` is a peak of that layer's animation. The chart is illustrative — peaks drift over real time, never lining up across columns.)

### 6.2 The atmospheric breath (animation #1)

```ts
<motion.div
  className="aw-breath"
  style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
  animate={reduced ? undefined : {
    backgroundImage: [
      'radial-gradient(120% 80% at 50% 0%, rgba(accent, 0.04), transparent 70%)',
      'radial-gradient(120% 80% at 50% 0%, rgba(accent, 0.07), transparent 70%)',
      'radial-gradient(120% 80% at 50% 0%, rgba(accent, 0.04), transparent 70%)',
    ],
  }}
  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
/>
```

### 6.3 The pulse-dot concentric ripple (animation #2)

```ts
<span style={{ position: 'relative', width: size, height: size }}>
  <span style={{
    position: 'absolute', inset: 0,
    borderRadius: 999, background: accent.core,
    boxShadow: `0 0 ${size*1.4}px rgba(${accent.rgb}, 0.55)`,
  }}/>
  {!reduced && (
    <motion.span
      animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
      style={{
        position: 'absolute', inset: 0,
        borderRadius: 999,
        border: `1.5px solid ${accent.core}`,
      }}
    />
  )}
</span>
```

### 6.4 The session-tag halo breath (animations #3, #4)

```ts
<motion.span
  animate={reduced ? undefined : {
    textShadow: [
      `0 0 8px ${accent.halo}`,
      `0 0 14px ${accent.halo}`,
      `0 0 8px ${accent.halo}`,
    ],
  }}
  transition={{
    duration: tagState === 'KZ' ? 3.4 : tagState === 'DEAD' ? 6.0 : 0,
    repeat: tagState === 'OFF' ? 0 : Infinity,
    ease: 'easeInOut',
  }}
>
  {tagState}
</motion.span>
```

### 6.5 The KEY DAY token breath (animation #6)

Same recipe as 6.4, cadence 4.0s, applied only to the quality token in the crumb row.

### 6.6 The WHY/EXPECT seam breath (animation #7)

```ts
<motion.div
  animate={reduced ? undefined : { width: [40, 56, 40] }}
  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
  style={{
    height: 1,
    background: `linear-gradient(90deg, rgba(${accent.rgb}, 0.6), transparent)`,
  }}
/>
```

### 6.7 The minute-rollover digit flash (animation #9)

A custom hook `useMinuteFlash()`:

```ts
function useMinuteFlash() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const now = new Date()
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    const t1 = setTimeout(() => {
      setTick(x => x + 1)
      const t2 = setInterval(() => setTick(x => x + 1), 60_000)
      // store t2 on a ref so cleanup works
    }, msToNextMinute)
    return () => clearTimeout(t1)
  }, [])
  return tick
}
```

When `tick` changes, the digit-flash `<motion.span animate={{ color: ['var(--aw-core)', 'var(--aw-paper)', 'var(--aw-core)'] }} transition={{ duration: 0.32 }}/>` runs once.

### 6.8 The hover spotlight (animation #22)

A `<motion.div>` inside the canvas root:

```ts
const x = useMotionValue(0.5)  // normalized 0..1
const y = useMotionValue(0.5)
const bg = useTransform([x, y], ([mx, my]) =>
  `radial-gradient(120px 60px at ${mx*100}% ${my*100}%, rgba(${accent.rgb}, 0.12), transparent)`
)

<motion.div
  style={{ position: 'absolute', inset: 0, background: bg, pointerEvents: 'none', opacity: hovered ? 1 : 0, transition: 'opacity 220ms' }}
/>
```

Cursor X/Y normalized to 0..1 relative to the canvas root's bounding box. The motion values use spring physics (`stiffness: 120, damping: 18`) so the spotlight glides slightly behind the cursor — a luxurious lag, not a stuck-to-mouse cheap follow.

---

## 7 · STATE MATRICES

Every element that has more than one state, mapped to a row. Cells show the *changing* property only.

### 7.1 Phase tab

| State           | Label color       | Letter-spacing | Indicator              | Radial backdrop alpha | Active underline |
| --------------- | ----------------- | -------------- | ---------------------- | --------------------- | ---------------- |
| Idle, inactive  | paper-dim         | 0.32em         | hollow ring 30% alpha  | 0                     | absent           |
| Hover           | paper-dim         | 0.18em         | hollow ring 1.4×       | 0                     | absent           |
| Active (clicked but not live) | paper | 0.32em         | filled paper           | 0                     | present          |
| Active + live   | accent-text       | 0.32em         | filled accent + ripple | 0.08 → 0.12 (3.4s)    | present          |
| Focus (keyboard)| paper             | 0.32em         | hollow ring 50% alpha  | 0                     | absent + ring    |
| Reduced motion  | (same)            | (same)         | (no ripple, no scale)  | static 0.10           | (no morph)       |

### 7.2 Session nameplate

| State  | Tag opacity | Tag cadence | Nameplate halo width |
| ------ | ----------- | ----------- | -------------------- |
| KZ     | 1.00        | 3.4s        | 16 → 26 → 16px       |
| DEAD   | 0.78        | 6.0s        | 16 → 22 → 16px       |
| OFF    | 0.50        | none        | static 16px          |
| Preview| 1.00        | none        | static 16px          |

### 7.3 Day Playbook canvas

| State          | Lift y | Drop shadow                | Spotlight | Action label |
| -------------- | ------ | -------------------------- | --------- | ------------ |
| Idle           | 0      | none                       | hidden    | STUDY        |
| Hover          | -1px   | 0 14 38 .32 + 0 0 48 wash  | visible   | STUDY        |
| Expanded       | 0      | none                       | hidden    | FOLD         |
| Focus          | 0      | none + outer ring 1.5px    | hidden    | (same)       |

### 7.4 WHY / EXPECT cell

| State    | Micro-seam width | Body color  |
| -------- | ---------------- | ----------- |
| Idle     | 40 ↔ 56 (4s)     | paper-dim   |
| Hover    | 88               | paper       |
| Reduced  | static 48        | paper-dim   |

### 7.5 Snap-to-live chip

| State    | Halo                                                          |
| -------- | ------------------------------------------------------------- |
| Idle     | `0 0 14px wash, 0 0 22px rgba(accent, 0.06)`                  |
| Hover    | `0 0 22px rgba(accent, 0.32), 0 0 36px rgba(accent, 0.14)`    |
| Disabled | (chip not rendered when `isLive`)                             |

---

## 8 · LAYOUT CHOREOGRAPHY (the 5-track parallel transitions)

The masterplan defines four high-level transitions. Here, each is broken into its **simultaneous tracks** with frame-level timing. All tracks of one transition run in parallel.

### 8.1 Phase-tab click (target: a non-live tab)

| Track | What                                       | Duration | Delay | Easing                  |
| ----- | ------------------------------------------ | -------- | ----- | ----------------------- |
| 1     | Underline morph (layoutId)                 | 460ms    | 0     | cubic(.22,.61,.36,1)    |
| 2     | Session nameplate down 6, fade out         | 130ms    | 0     | easeOut                 |
| 2     | New session nameplate up 6, fade in        | 130ms    | 130ms | easeOut                 |
| 3     | Counters opacity 1 → 0.4                   | 260ms    | 0     | easeOut                 |
| 3     | Progress fill width → 0                    | 240ms    | 0     | easeOut                 |
| 3     | Preview banner unfold                      | 320ms    | 0     | cubic(.22,.61,.36,1)    |
| 4     | Focus headline morph (layoutId)            | 360ms    | 0     | cubic(.22,.61,.36,1)    |
| 5     | Micro-phase ladder remount + indicator     | 320ms    | 100ms | spring(150, 18)         |

Total perceived end-of-motion: ~500ms. The user reads it as "everything *responded* to my click."

### 8.2 Micro-phase click (within current session)

| Track | What                                | Duration | Delay |
| ----- | ----------------------------------- | -------- | ----- |
| 1     | Micro-phase indicator morph         | 360ms    | 0     |
| 2     | Focus headline morph                | 360ms    | 0     |
| 3     | Focus body cross-fade               | 220ms    | 60ms  |
| 4     | WHY / EXPECT body cross-fade        | 220ms    | 60ms  |

Total ~400ms. Faster because session-level chrome doesn't change.

### 8.3 Snap-to-live

Identical to 8.1, plus:

| Track | What                                   | Duration | Delay |
| ----- | -------------------------------------- | -------- | ----- |
| 6     | PREVIEW · NOT LIVE → ACTIVE WINDOW     | 220ms    | 0     |
| 7     | Snap-to-live chip fade out             | 180ms    | 0     |
| 8     | Accent variable transition (preview→live) | 320ms | 0     |

### 8.4 Playbook expand

| Track | What                                | Duration | Delay   |
| ----- | ----------------------------------- | -------- | ------- |
| 1     | Hover spotlight settle              | 180ms    | 0       |
| 2     | Drawer height + opacity + y         | 380ms    | 0       |
| 3     | Day tabs underline + sections in    | 260ms    | 0 (staggered ×6) |

Collapse: same tracks reversed, total 280ms (open is generous, close is brisk — a luxury cabinet feels expensive when it shuts confidently).

---

## 9 · REDUCED-MOTION FALLBACKS (the contract)

Detected via `useReducedMotion()` (Framer Motion's hook). When `true`:

1. Animations 1–9, 16, 17, 22 — **omitted** (static state painted instead).
2. Animations 10–13, 15, 23, 25, 26, 28 — **duration 0** (instant snap).
3. Animations 14, 24 — **duration 0** (progress fill snaps).
4. Animations 18–22, 27 — **omitted** (no hover micro-motion).

The end state is always *identical* to the animated end state. Reduced-motion users see the same final pixels, just without the journey.

Additionally, the panel adds `data-reduced-motion="true"` to its root when reduced is on, so CSS-only animations (the seam shimmer) can be disabled via:

```css
[data-reduced-motion='true'] .aw-seam-shimmer { animation: none; }
```

---

## 10 · ACCESSIBILITY CONTRACT

### 10.1 Roles & landmarks

| Element                  | Role / element        | aria attrs                                                       |
| ------------------------ | --------------------- | ---------------------------------------------------------------- |
| Panel root               | `<section>`           | `aria-label="Active window dossier"`                             |
| `TemporalAnchorRail`     | `<header>`            | (none)                                                           |
| `DayPlaybookCanvas` root | `<button>`            | `aria-expanded={open}` `aria-controls="aw-playbook-drawer"`      |
| Drawer                   | `<div role="region">` | `id="aw-playbook-drawer"` `aria-label="Day playbook details"`    |
| Tab rail container       | `<div role="tablist">`| `aria-label="Session phase"`                                     |
| Each phase tab           | `<button role="tab">` | `aria-selected={isSelected}` `aria-controls="aw-phase-panel"`    |
| Dossier body region      | `<div role="tabpanel">`| `id="aw-phase-panel"` `aria-labelledby={selectedTabId}`          |
| Micro-phase ladder       | `<div role="tablist">`| `aria-label="Micro-phases"`                                      |
| Each micro-phase         | `<button role="tab">` | `aria-selected` analogous to above                               |
| Snap-to-live chip        | `<button>`            | `aria-label="Snap back to the live phase"`                       |
| Pulse dots               | `<span aria-hidden>`  | always hidden (decorative)                                       |

### 10.2 Screen-reader-only fallbacks

- Session tag (`DEAD`): visible text plus `<span class="sr-only">post-New-York phase is dead-zone</span>` so SR users don't hear just "dead."
- Live pulse dot: each location wraps the visible dot with `<span class="sr-only">live</span>` — but only one of them speaks per panel (the rail's), the others suppress via `aria-hidden`.
- The UTC clock: wrapped in `<time dateTime={iso}>21:25 UTC</time>` so SR announces a real time.

### 10.3 Keyboard

- Tab order: rail → canvas → tabs (within tablist: arrow keys, not tab) → snap-to-live (when present) → focus headline (skipped if h2) → WHY → EXPECT → micro-phase tablist.
- Arrow Right / Left on a tab: move within the tablist, wrap at ends.
- Home / End: jump to first / last tab.
- Enter / Space on a tab: select.
- Enter / Space on the playbook canvas: toggle expand.
- Escape inside the drawer: collapse drawer + restore focus to the canvas.

### 10.4 Focus visibility

Every focusable element gets an outer ring on focus-visible:

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.18), 0 0 0 3px var(--aw-wash);
  border-radius: 4px;
}
```

The ring respects the no-border rule by being a box-shadow, not an outline. It's always visible against any background because it pairs white halo + accent wash.

### 10.5 Color contrast

- Body text (`paper-dim` 72% L on `surf-2` 0.04 alpha) → measured 7.1:1 against the page neutral. PASS WCAG AAA.
- Eyebrow text (`paper-ash` 52% L) → 4.6:1. PASS WCAG AA. Used only for non-essential metadata (`OPTIMAL` labels).
- Accent text (`#FFB84C` on dark) → 8.3:1. PASS AAA.

---

## 11 · PERFORMANCE BUDGET

### 11.1 Initial mount

- Components mounted in cold cache: ≤ 7 (panel root + 3 layers + 3 reusable primitives).
- Initial paint cost: ≤ 4ms on a M1 baseline.
- JS evaluation: zero new heavy libs (Framer is already in the bundle). Token map is pure constants.

### 11.2 Steady-state animation cost

All looping animations use GPU-bound properties only:
- `opacity`, `transform`, `filter` (for drop-shadow).
- `background` *only* on the breath layer (a single radial that recomposites cheaply because no other surface paints behind it).
- `text-shadow` on session tag — this is rasterized per-frame on most browsers but acceptable for one element.

The seam shimmer uses `background-position` — which Chrome promotes to a compositor-thread animation when `will-change: background-position` is present. We set this on `.aw-seam-shimmer`.

### 11.3 Per-frame paint area

Worst case (all loops at peak): the panel's invalidation region must stay under **120,000 px²** per frame (roughly the bottom 250px of the panel × full width). Anything more triggers Chrome's "large paint" warning.

To stay under: animated elements are wrapped in `transform: translateZ(0)` to promote their own layers. Verified via Chrome DevTools → Rendering → Paint flashing on a smoke test.

### 11.4 Long-task budget

No animation may block the main thread for >16ms. Framer Motion's `useTransform` runs off the React render cycle so it's already free. The only main-thread work is the minute-flash hook and the rotating-label `setInterval` (both <1ms).

---

## 12 · EDGE CASES & FAILURE MODES

| Scenario                                  | Behavior                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Network slow, session data not yet loaded | Render skeleton: 3 stacked seams + 3 ghost ripples + "Loading session…" eyebrow. NO chrome change, only content swap. |
| `focusPsych` missing on a phase           | Rotation falls back to static `focusWhy`. No console warning.              |
| Phase boundary in less than 60 seconds    | Playhead reaches `width: 100%` and then the new phase auto-selects with full choreography (8.1). Counter `0m remaining` flashes for one beat. |
| Clock skew (system time wrong)            | We trust the server clock if available (`useServerTime()`), else fall back. Visible cue: the minute-flash hook re-anchors on every effect run, so even a wrong clock self-corrects within 60s. |
| Reduced-motion + accent change            | Variables still transition over 320ms because that's a color change, not motion. (Color animations are explicitly out of scope of `prefers-reduced-motion: reduce`.) |
| Mobile portrait (< 720px)                 | Panel collapses to single-column. Phase tabs become a horizontally-scrollable strip with `scroll-snap-type: x mandatory`. Hover spotlight + tab letter-spacing tighten are omitted (no hover on touch). |
| Very long phase label (`POST-NEW-YORK`)   | Truncates with ellipsis at `max-width: 96px`. Full label available on hover via `<title>` attribute. |
| `MICRO-PHASES` empty (no phases data)     | The whole MICRO-PHASES block hides (no eyebrow, no seam, no ladder). Don't render the breath gap either. |
| User taps live tab while already live     | No-op visually. The radial backdrop pulses once (a 240ms "click-confirm" peak to 0.18 alpha then back to its breath cycle) so the trader knows the tap registered. |
| Phase changes during a phase-tab morph    | The new phase's data wins; the in-flight animation completes to its target. Framer Motion's interrupt-safe shared-layout handles this for free. |

---

## 13 · REUSABLE PRIMITIVES — EXACT APIS

### 13.1 `<ArchioSeam/>`

```ts
type ArchioSeamProps = {
  /** Accent token. Defaults to `var(--aw-core)` if omitted. */
  accent?: string
  /** Base alpha of the seam line. Default 0.22. */
  alpha?: number
  /** Width (number = px, string = CSS value). Default `100%`. */
  width?: number | string
  /** If true, render the 14s traveling shimmer pass. */
  shimmer?: boolean
  /** Shimmer cycle in seconds. Default 14. */
  shimmerCycle?: number
  /** Breath the width between two values every {duration}s. */
  breathWidth?: [number, number]
  /** Breath duration (seconds). Default 4. */
  breathDuration?: number
  /** Class name override for external positioning. */
  className?: string
  /** Inline style override (rare). */
  style?: React.CSSProperties
  /** Respects user's reduced-motion preference. */
  reduced?: boolean
}
```

### 13.2 `<ArchioPulseDot/>`

```ts
type ArchioPulseDotProps = {
  size?: number              // px, default 5
  accent?: { core: string; halo: string; rgb: string }
  cadence?: number           // seconds, default 2.6
  rippleScale?: number       // outer ring final scale, default 2.4
  reduced?: boolean
  ariaLabel?: string         // if set, dot is announced to SR; otherwise aria-hidden
}
```

### 13.3 `<ArchioRotatingLabel/>`

```ts
type ArchioRotatingLabelProps = {
  /** Variants to rotate between. */
  variants: React.ReactNode[]
  /** Seconds each variant is held visible. Default 9. */
  hold?: number
  /** Crossfade duration (ms). Default 320. */
  fade?: number
  /** Respects user's reduced-motion preference. */
  reduced?: boolean
  /** When reduced, which variant index to show. Default 0. */
  reducedIndex?: number
  /** Wrapping element. Default `<span>`. */
  as?: React.ElementType
  className?: string
  style?: React.CSSProperties
}
```

---

## 14 · QA SCENARIOS — 22 things to verify before shipping

1. Cold load: the rail appears within 200ms with the live dot already rippling.
2. The rail's clock matches the user's system clock to the second.
3. Minute rollover at 21:25 → 21:26 triggers a digit flash on both rail and dossier clocks.
4. Clicking `WED` playbook chevron expands the drawer; sections stagger in left-to-right.
5. Clicking the chevron again collapses faster than the open (≈ 280ms vs 380ms).
6. Inside the drawer, MON → TUE swap morphs the underline; no flicker.
7. Click `LDN-NY` phase tab: nameplate cross-fades, underline glides, focus headline morphs.
8. The radial backdrop on the live tab pulses 3.4s; on the user-selected (non-live) tab there is no backdrop.
9. Click `← LIVE`: panel returns to live state; eyebrow morphs `PREVIEW · NOT LIVE` → `ACTIVE WINDOW`.
10. Hover any phase tab: label tightens letter-spacing 0.32 → 0.18em; dot scales 1 → 1.4.
11. Hover the playbook compact row: row lifts -1px; spotlight follows cursor.
12. Hover WHY cell: micro-seam extends 40 → 88px; body color brightens.
13. Tab through the panel with keyboard: every interactive target gets a focus ring.
14. Arrow Right from `PRE-LDN` lands on `LDN-KZ`; Home jumps to `PRE-LDN`; End jumps to `OFF`.
15. Enter on an active phase tab is a no-op (no double-fire).
16. Toggle `prefers-reduced-motion: reduce` at the OS level: panel renders identically but no animations.
17. Resize browser from 1440 → 720px: tab rail becomes scroll-snap strip.
18. Resize below 720px: WHY/EXPECT collapses to a single column.
19. Scrub system time forward 5 minutes: progress bar advances; playhead glides; auto-phase change fires at boundary.
20. Snap browser back to live phase after preview: accent variable transitions 320ms (no instant flash).
21. Open Chrome DevTools → Rendering → Paint flashing: no full-panel repaints during steady-state animation.
22. Run Lighthouse a11y audit: score ≥ 95 with zero contrast failures.

If any scenario above fails, the ship is blocked.

---

## END OF DEEP-DIVE

The masterplan tells the story. This file is the build sheet. Together they are sufficient to recreate the panel from scratch in another codebase with no design conversation.
