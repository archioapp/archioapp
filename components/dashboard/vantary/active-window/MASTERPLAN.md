# ARCHIO · ACTIVE WINDOW (DAY OS) — Masterplan

> The third pillar of the archio billion-dollar luxury system. Forecast popup established the language (borderless surfaces, accent halos, traveling sheens), Flight Deck wings refined it (breathing identity pills, layoutId morphs, glass material), and the ACTIVE WINDOW / DAY OS panel inherits and **extends** it into a living temporal cockpit.
>
> **Discipline.** Nothing decorative. Every micro-animation has a meaning. The panel must feel like it is *alive but never noisy* — the kind of restraint a $40,000 chronograph carries vs. a $40 quartz watch. If a value below could be deleted without losing information, it is deleted.

---

## 0 · WHAT IS BEING REDESIGNED

A vertical stack of three components inside `JarvisWelcomeBand → MarketIntelConsole` (in `components/dashboard/vantary/your-space.tsx`), currently rendered with hard 1px hairlines, segmented chip buttons, and bordered 2-cell grids.

| # | Component (current)                          | Visible in screenshot                                                        |
| - | -------------------------------------------- | ---------------------------------------------------------------------------- |
| 1 | `TemporalAnchorHeader`  (lines 1724–1806)    | `DAY OS · LIVE · WED 13 MAY · 21:25 UTC` strip                               |
| 2 | `DayPlaybookCompact`    (lines 4163+)        | `WED · TODAY · DAY PLAYBOOK · KEY DAY · MIDWEEK …` row + Wednesday body      |
| 3 | `ActiveSessionFocusCard` (lines 5024+)       | `ACTIVE WINDOW`, phase tabs, `POST-NY DEAD`, counters, FOCUS NOW, WHY/EXPECT, MICRO-PHASES |

Everything below the `JarvisWelcomeBand`'s cockpit/cartouche/4-rooms remains untouched.

---

## 1 · DESIGN LANGUAGE (the archio contract for this panel)

### 1.1 The five non-negotiables

1. **Zero hard borders.** No `border: 1px solid rule`. Every edge expressed by:
   - A long, low-opacity radial halo (outer box-shadow), OR
   - A single hairline gradient (`linear-gradient(90deg, transparent, accent 30%, transparent)`) used as a *seam* rather than a frame.
2. **One background ambient layer per section, never per element.** Currently every chip carries its own `background + border + borderRadius`. In the new design only the *section* carries an ambient tint; chips inside it inherit the surface and gain definition through typography weight, tracking, and color — not strokes.
3. **Type does the structural work.** Eyebrows at `letter-spacing: 0.34em` (was 0.22), font-weight 500, lowered opacity. Headlines at `letter-spacing: -0.03em` and `text-wrap: balance`. The contrast between eyebrow tracking and headline tracking IS the visual hierarchy.
4. **Motion is meaning, not decoration.** Every animation must answer one of three questions: *"what changed?"*, *"how much progress?"*, *"what's live?"*. If an animation answers none of those, it is cut.
5. **Reduced-motion is a first-class state, not an afterthought.** Every animated piece below specifies its reduced-motion fallback inline.

### 1.2 The accent system

Three accent tokens are used, mapped to the trader's *current relationship to the market*:

| Accent              | Token                                                    | When                                                            |
| ------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| `LIVE-EDGE` (amber) | `VANTARY.amber`                                          | Live KZ session + prime/key day — "earn money now"              |
| `LIVE-DEAD` (teal)  | `cartoucheAccent.hex` (whichever the active template uses) | Live but dead-zone window — "stay sharp, no money here"         |
| `PREVIEW` (paper-dim)| `VANTARY.paperDim`                                       | User has clicked a non-live tab — "you are studying, not trading"|

A single CSS custom-property `--aw-accent` (defined on the panel root) drives every animated element. Changing accent re-paints the entire panel in 320ms without any per-component prop drilling.

### 1.3 The atmospheric base layer

The whole panel sits on a single `<motion.div>` that paints a **very slow radial gradient breath** behind everything — accent at 4% alpha at the center, fading to transparent at the corners. The breath cycles 0.04 → 0.07 → 0.04 alpha over **8 seconds**. This is the panel's heartbeat: invisible if you look for it, but if you remove it the panel feels dead.

```
backgroundImage: `radial-gradient(120% 80% at 50% 0%, var(--aw-accent-wash), transparent 70%)`
animate:        { '--aw-breath-alpha': [0.04, 0.07, 0.04] }
transition:     { duration: 8, repeat: Infinity, ease: 'easeInOut' }
```

---

## 2 · THE THREE LAYERS, REDESIGNED

### 2.1 Layer A · `TemporalAnchorRail` (replaces `TemporalAnchorHeader`)

**Purpose:** anchor the trader in time before any market context loads.

**Current chrome to remove:** the 1px hairline frame, the inset background, the bordered LIVE chip, the vertical bar separators.

**New visual recipe:**
- Single horizontal row, no border, no background.
- Reading order remains `DAY OS · LIVE · WED 13 MAY · 21:25 UTC`.
- The live dot grows from a static 5px pulse to a **6px concentric ripple**: an inner solid amber dot + an outer ring that scales from `1→2.4` over 2.6s while fading 0.6→0 alpha. Reduced motion: solid dot only.
- The `LIVE` tag drops its border + background and becomes a **typographic stamp** — `font-mono uppercase, fontSize 9.5, letterSpacing 0.4em, color amber, textShadow 0 0 8px amber-halo`. Premium without chrome.
- The vertical bar `|` separators become **2px accent dots** with a 0.6 alpha glow. Editorial pacing instead of utility plumbing.
- A **bottom seam** — a single 1px gradient `linear-gradient(90deg, transparent 0%, accent 18%, accent 82%, transparent 100%)` at 22% alpha — visually marks the rail's bottom edge without enclosing it.

**Breathing micro-animation (the living piece):**
- The seam below the rail slowly *travels* a faint highlight across itself every 14 seconds (left → right). A 12% alpha pass, ease-in-out, then a 4-second rest. Reads as "the rail is alive."
- Every 60 real-time seconds the UTC clock digits **flash subtly** as the minute rolls over: each character's `color` ramps from `amber` to `paper` and back over 320ms. Anchors attention without yanking it.

### 2.2 Layer B · `DayPlaybookCanvas` (replaces `DayPlaybookCompact`)

**Purpose:** answer "what kind of day is this?" in a single luxurious editorial block, with the option to expand into the full intel.

**Current chrome to remove:** outer border, the 76×full-height day-badge cell with its `borderRight`, the eyebrow row's pipe separators, the bordered quality chip, the dashed `PREVIEW` chip, the bordered stat row.

**New visual recipe:**

The bar is now a **borderless editorial slab** divided into three horizontal regions by **breathing space alone** — no borders, no backgrounds. Reading rhythm:

```
   WED          DAY PLAYBOOK · KEY DAY · MIDWEEK INFLECTION              ▾
   TODAY        Wednesday · Midweek reversal zone. Weekly high or low
                often forms here.
                OPTIMAL  LONDON  NEW YORK     SIZE  FULL SIZE     RISK  DUAL-NATURED
```

- **Left day badge.** `WED` 16px mono uppercase, `TODAY` 7.5px mono below. NO background cell. The two stack vertically left-aligned, with the live pulse rendered as a 4px ripple-dot to the LEFT of `WED` (not to the upper-right corner of a chip). When the trader clicks a non-today tab, `TODAY` swaps to `PREVIEW` with a **cross-fade** (NOT instant). Width fixed at 64px to preserve column alignment across day swaps.

- **Middle verdict body.** Three vertical strata, each separated by 4px of breathing space:
  - **Row 1 — quality crumb:** `DAY PLAYBOOK · KEY DAY · MIDWEEK INFLECTION AND REVERSAL PHASE`. The dots are 2px accent dots glowing at 0.6 alpha. The quality (`KEY DAY`) is set in `color: var(--aw-accent), font-weight: 500`, no chip background, no border. Tracking 0.32em.
  - **Row 2 — verdict line:** `Wednesday · Midweek reversal zone.` 14px sans, `text-wrap: pretty`. The day name in `paper`, the rest in `paperDim`. NO bullet, just a softly-glowing 3px accent dot between them.
  - **Row 3 — stat trio (live day only):** `OPTIMAL` eyebrow + `LONDON · NEW YORK` paper-colored values, `SIZE` eyebrow + value, `RISK` eyebrow + value. Each pair separated by the same softly-glowing accent dot. No chips. No borders. No backgrounds. Just type.

- **Right chevron.** `▾ STUDY` (open) / `▴ FOLD` (close). Borderless. Mono uppercase 8.5px tracking 0.32em. On hover the entire row gains a single **shadow-only lift**: `boxShadow: 0 12px 32px rgba(0,0,0,0.32), 0 0 40px var(--aw-accent-wash)`. NO border change, NO background change. The whole row lifts about 1px on hover (`y: -1`).

- **The open/close transition.** When `expanded === true`, a **drawer-style downward reveal** unfolds the full intel panel below. The drawer is itself borderless — eyebrowed sections (`RECOMMENDATION`, `MANIPULATION PATTERN`, `HISTORICAL EDGE`, etc.) divided by `linear-gradient` seams identical to the rail above. The drawer enters with `height: 0 → auto`, `opacity: 0 → 1`, `y: -8 → 0` over 380ms with `ease: [0.22, 0.61, 0.36, 1]`. Sections inside stagger-in (0.045s × index) so the eye is led down.

**Breathing micro-animations (the living piece):**

1. **Day-quality accent breath.** The middle verdict's `KEY DAY` token ramps `text-shadow` blur from `8px → 14px → 8px` every 4 seconds. Subtle but ever-present — the day is *breathing*.
2. **Seam shimmer.** A 14s diagonal sheen pass across the top and bottom seams (same recipe as the pill seams in the Flight Deck — see §3.5 below).
3. **Hover-shift (mouse only).** As the cursor moves across the row, a 12% alpha accent radial spotlight follows the cursor's X position at 220ms ease-out. Reads as "the surface is reacting to me." Touch + reduced-motion: omitted.

### 2.3 Layer C · `ActiveWindowDossier` (replaces `ActiveSessionFocusCard`)

**Purpose:** the dossier of the live session — phase tabs, FOCUS NOW headline, WHY/EXPECT reasoning, micro-phase ladder.

This is the largest piece and gets a full sub-architecture below.

#### C-1 · The eyebrow rail

- `● ACTIVE WINDOW         21:25 UTC`
- The dot is a **2-ring concentric pulse** (same as the temporal rail's live dot but at 5px). Color uses `var(--aw-accent)`.
- `ACTIVE WINDOW` set in mono 9.5px, letter-spacing 0.34em, paper-dim color, font-weight 500. When `!isViewingLive` it swaps to `PREVIEW · NOT LIVE` with a **typed-on cross-fade** — the old label fades down 4px while the new label fades up 4px, 220ms.
- `21:25 UTC` set in mono tabular-nums 9.5px tracking 0.22em color `var(--aw-accent)`. Every minute rollover triggers the same digit flash as the temporal rail.
- The `SNAP TO LIVE` button (only visible when previewing) drops its border + background and becomes a **typographic chip** — `← LIVE` in mono 9px tracking 0.36em with a soft accent glow underneath. Hover: glow doubles.

#### C-2 · The phase-tab rail (the cinematic centerpiece)

This is the one element that **must** feel different from anything we've shipped before. The seven tabs (`PRE-LDN · LDN-KZ · LDN-NY · NY-KZ · LDN-CLS · POST-NY · OFF`) currently render as bordered pill buttons. New design:

**Tabs become typographic glyphs floating on a single shared baseline track.**

```
─────────●─────────────────────────────────────────────────────────────
 PRE-LDN   LDN-KZ   LDN-NY   NY-KZ   LDN-CLS   POST-NY   OFF
   ◌        ◌        ◌        ◌        ◌         ◯         ◌
─────────────────────────────────────────────────●─────────────────────
        ↑                                         ↑
   chronology marker bar                  live-phase indicator
```

- **A continuous baseline rail** — a 1px gradient seam — runs left-to-right behind all 7 tabs. No tab has its own border.
- Each tab is **only its label** in mono uppercase 9.5px tracking 0.32em. Vertical padding 8px. No background. No border. No border-radius.
- Below each label, a **5px circle indicator**: hollow for inactive tabs (1.5px stroke at 30% alpha), filled accent for the live tab (concentric ripple animation, same as temporal rail), filled paper for the user-selected non-live tab.
- The **live tab** also gets a **70% alpha radial halo behind its label** — `radial-gradient(60% 100% at 50% 50%, var(--aw-accent-wash), transparent)` at 12% alpha — that **breathes** 8→16% alpha every 3.4s. This is the panel's strongest "this is happening NOW" cue.
- The **active selection** (whatever tab the user has clicked, defaults to live) is bridged via `layoutId="aw-active-phase-underline"` — a 2px accent line that **slides** along the baseline rail when the user clicks a new tab. Same Framer Motion shared-layout trick as the Flight Deck pills. Duration 460ms, ease `[0.22, 0.61, 0.36, 1]`.
- **Hover state:** the hovered tab's label gains a 0.32 → 0.18em letter-spacing micro-tightening over 180ms (a luxurious typographic "stand up straight") and its indicator dot scales 1 → 1.4. NO color change, NO background change. The tightening alone signals "I am hoverable."
- **Reduced motion:** the slide is replaced by an instant snap; the breathing halo becomes a static 12% wash; hover tightening is omitted.

#### C-3 · The session nameplate

`POST-NY` huge sans 32px, `DEAD` tag. Currently `DEAD` is a bordered pill. New:

- Session name unchanged in size, but its color is now driven by `var(--aw-accent)` so amber/teal/dim swap cleanly when the user previews other windows.
- `DEAD` / `KZ` tag drops its border. Becomes mono 9.5px tracking 0.4em with `textShadow: 0 0 10px var(--aw-accent-halo)`. The textShadow itself breathes 8 → 14 → 8 px blur every 4 seconds.
- **The most expensive cue:** when the session is `DEAD`, the entire nameplate sits at `opacity: 0.78` and the breathing slows to 6s. When `KZ`, full opacity, breathing 3.4s. The trader feels the difference *in their peripheral vision* before reading it.

#### C-4 · Counters + progress bar

`325m elapsed | 35m remaining` row. The vertical bar separator becomes a 3px accent dot (same as everywhere else in the panel). Counters set in mono 11px tabular-nums.

The progress bar:
- Track: a single 2px line (was 4px) at 8% accent alpha. Bottom-positioned, full-width.
- Fill: same 2px line at full accent. **No box-shadow halo on the fill** (the halo migrates to the live-phase indicator dot above) — keeps the bar feeling fine-print, not heavy.
- Fill animates with `width: ${progress*100}%`, 600ms ease-out (unchanged).
- **NEW:** a 5px accent dot rides the leading edge of the fill — a tiny "playhead." It carries the same concentric ripple animation as the live tab indicator. As the session progresses through real-time minute ticks, the playhead slides forward visibly. Best visible at the boundary between filled and unfilled.

Below the bar: phase label (left) + percentage (right). Both at mono 8.5px paper-dim. No chrome.

#### C-5 · FOCUS NOW headline block (the most important block)

This is the magazine pull-quote that earns the entire panel.

Current chrome to remove: nothing structural — the design already removed most borders here. But the gradient hairline divider becomes the new archio seam (consistent with everywhere else).

New rhythm:

```
 ●     FOCUS NOW                                              2/2
 ════════════════════════════════════════════════════════════════
 Tomorrow Plan
 ─────────────────────────────────────────────  (gradient seam)
 Build tomorrow's bias. Identify the levels you'll watch on the
 next London open.
```

- The dot is the same 2-ring concentric pulse, 6px, accent.
- `FOCUS NOW` set in mono 11px tracking 0.4em (was 0.32) — premium magazine-cover energy. When `!isLivePhase` it swaps to `FOCUS PREVIEW` via the typed-on cross-fade.
- The 2/N counter on the right adopts the same accent-dot-as-separator treatment.
- The headline `Tomorrow Plan` retains its 32px sans treatment but the divider below it becomes the archio gradient seam.
- The headline **wraps itself in `layoutId="aw-focus-headline"`** so that when the user clicks a different micro-phase below, the OLD headline visibly *slides up and out* while the NEW headline *slides in from below*. Continuity of attention.
- Body copy increases line-height from 1.55 → 1.6 and adopts `text-wrap: pretty`.

#### C-6 · WHY / EXPECT pair

Currently a 2-cell grid wrapped in `border: 1px solid rule` with a vertical divider in the middle. New:

- **No outer border. No middle divider.** Replaced by 24px horizontal gap between the two cells.
- Each cell's eyebrow (`WHY` / `EXPECT`) sits at the top: mono 9px tracking 0.34em paper-ash. Below each eyebrow, a **micro-seam** — 1px gradient `linear-gradient(90deg, accent, transparent)` 40px wide at 60% alpha — which **breathes** width 40 → 56 → 40px every 4 seconds (subtle, only ever ~10% movement). This is the eyebrow's signature.
- Body copy at 12.5px paperDim line-height 1.6, `text-wrap: pretty`.
- Hover on either cell: the cell's micro-seam grows to 88px and the cell's text ramps from `paperDim` to `paper` over 220ms. Quiet, controlled.

#### C-7 · MICRO-PHASES ladder

Currently a `grid-template-columns: repeat(N, 1fr)` of bordered cells. New:

The ladder becomes a **horizontal stepper** matching the phase-tab rail aesthetic:

```
 MICRO-PHASES                                          TAP TO STUDY
 ──────────●────────────────●──────────────────●────────────●────────
  REVIEW         PLAN          PREP            EXECUTE        CLOSE
   ◌            ◌              ●                ◌              ◌
```

- A single baseline seam runs through. Each phase is its short label + its 5px indicator dot. The currently-active phase carries the accent ripple. Past phases carry a tiny solid paper-dim dot. Future phases are hollow rings.
- Clicking a phase slides the active indicator (shared `layoutId="aw-micro-active"`) along the baseline to its new home. Headline above updates via its own layoutId morph (C-5).
- **Reduced motion:** indicators snap, no slide.

---

## 3 · THE LIVING ECOSYSTEM (what changes every few seconds)

This is the trader's specific request: *"breathing living ecosystem."* The panel must feel alive at multiple cadences, all visible at once but never competing for attention.

### 3.1 Cadence map

| Layer                       | Cadence                | What pulses                       | Purpose                |
| --------------------------- | ---------------------- | --------------------------------- | ---------------------- |
| Atmospheric breath          | 8.0s                   | Panel base radial alpha            | Heartbeat              |
| Session nameplate halo      | 3.4s (KZ) / 6.0s (DEAD)| Tag textShadow blur                | Risk temperature       |
| Live tab radial wash        | 3.4s                   | Behind active phase tab           | "Live RIGHT NOW" anchor|
| Live dots (everywhere)      | 2.6s                   | Concentric ripples                | Liveness               |
| WHY/EXPECT seam             | 4.0s                   | Seam width 40↔56px                | Subliminal anchor      |
| Quality keyword breath      | 4.0s                   | `KEY DAY` textShadow blur         | Day-quality temperature|
| Seam shimmer                | 14.0s                  | Diagonal highlight across rails   | "The surface is alive" |
| Minute rollover             | 60s (synced to clock)  | UTC digits flash                  | Real-time anchor       |
| Phase progression playhead  | tick-driven            | 5px dot rides the bar             | Real-time movement     |
| Hover spotlight             | cursor-driven          | 12% radial follows X              | "I am responsive"      |

### 3.2 Synchronization rule

**Nothing animates on the same beat.** Periods chosen so the layers never line up:
- 8.0 + 3.4 + 2.6 + 4.0 + 14.0 = mutually irrational ratios within any 30s window.

This is the same principle as the Flight Deck pill sheens (9s and 11s) — the eye reads it as "organic," not "looped."

### 3.3 Variation over longer time

Some elements **change content** every few seconds, not just animate visually:

1. **Phase-tab label rotation (NEW):** on the LIVE tab only, the label cycles between its short name (`LDN-KZ`) and its short thesis (`SWEEP → DIRECTION`) every 9 seconds with a cross-fade. Reads like a Bloomberg ticker. Reduced motion: short name only.
2. **WHY/EXPECT body rotation (NEW):** for sessions with multiple paragraphs of context (LDN, NY), the body rotates between 2 framings every 14 seconds: the "tactical" framing (current `focusWhy`) and a "psychological" framing (new `focusPsych` content). Cross-fade 320ms. Only on live phase.
3. **Micro-phase ladder progression:** as real-time crosses a micro-phase boundary, the active indicator slides forward automatically. Same layoutId machinery as user-clicks.

### 3.4 Sound (deferred to a later work)

This panel is silent for now. A future work may add a 1.6s ambient "tick" at the minute rollover and a 240ms swell on session transitions. Out of scope here.

### 3.5 The archio seam shimmer (a reusable utility)

A single `<ArchioSeam orientation="horizontal" />` component, used as the visual divider everywhere in the panel:

```tsx
<ArchioSeam
  accent={accent}            // CSS color string
  width="100%"
  alpha={0.22}               // base alpha of the gradient line
  shimmer                    // enables the 14s traveling highlight pass
  shimmerCycle={14}          // seconds
/>
```

- Renders a 1px-tall absolutely-positioned element with a `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)` background.
- When `shimmer` is true, an inner `<motion.div>` carrying a small (10% width) brighter pass slides left → right over `shimmerCycle` seconds with a long idle at each end. Same recipe as the pill sheens.
- Reduced motion: render static.

This component is the single visual "joint" of the panel. Every section change is marked by a seam. The seams shimmer in offset cadences so the eye never settles into a metronome.

---

## 4 · INTERACTION CHOREOGRAPHY

### 4.1 Phase tab click

1. User clicks `LDN-KZ` (a non-live, non-selected tab).
2. `setSelectedKey('LDN')` fires.
3. The **active indicator dot** below the tab rail glides via `layoutId` from its old position to its new position (460ms, ease `[0.22, 0.61, 0.36, 1]`).
4. **In parallel:** the session nameplate cross-fades — old name fades down 6px while new fades in 6px up (260ms).
5. **In parallel:** the counters fade to `0.4` opacity (since they're not meaningful in preview mode), the progress bar collapses to `width: 0` over 240ms, and the preview banner unfolds (height 0→auto + opacity 0→1, 320ms).
6. **In parallel:** the FOCUS NOW headline (`layoutId="aw-focus-headline"`) slides up and out, then the new session's first-phase headline slides in (260ms each, slight overlap).
7. **In parallel:** the MICRO-PHASES ladder rebuilds — old indicator fades out, new ladder mounts, active indicator appears at the first phase via spring (no layoutId here because the ladder identity changed).

Total perceived duration ~500ms. Feels expensive because every change is choreographed, not abrupt.

### 4.2 Micro-phase click

1. User clicks `EXPAND` (a non-active micro-phase in the current session).
2. The active indicator slides along the baseline (layoutId, 360ms).
3. The FOCUS NOW headline morphs (layoutId, 360ms).
4. WHY / EXPECT body crossfades 220ms.

Total ~400ms. Cheaper than 4.1 because we stay within the same session.

### 4.3 Snap to live

1. User clicks `← LIVE`.
2. Identical choreography to 4.1, but the target is the live session.
3. Additional 220ms: the `PREVIEW · NOT LIVE` eyebrow cross-fades back to `ACTIVE WINDOW`, the snap-to-live chip fades out.

### 4.4 Day Playbook compact → expand

1. User clicks the playbook row (or presses Enter).
2. Row's hover spotlight settles to the click point and brightens to 0.32 alpha for 180ms (a "click confirm" pulse).
3. The drawer unfolds (height 0→auto, opacity 0→1, y -8→0, 380ms, ease `[0.22, 0.61, 0.36, 1]`).
4. Sections inside stagger in (0.045s × index, 6 sections = ~270ms total, completes ~50ms after the drawer settles).

Collapse is reverse, 280ms total (snap-back faster than open — same trick we use in the Ask Vantary state machine).

### 4.5 Day tab swap (inside the drawer)

Lifted directly from the existing `DayPlaybookPanel` — MON..FRI tabs, layoutId underline already in place. No change to behavior; only the chrome around it is restyled to match.

---

## 5 · IMPLEMENTATION PLAN

### 5.1 New files

| Path                                                                       | Purpose                                                                  | ~LoC |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---- |
| `components/dashboard/vantary/active-window/archio-seam.tsx`               | The shared seam-with-shimmer primitive                                   | 110  |
| `components/dashboard/vantary/active-window/archio-pulse-dot.tsx`          | Concentric-ripple live dot, configurable size/accent/cadence             | 80   |
| `components/dashboard/vantary/active-window/archio-rotating-label.tsx`     | The 9s cross-fading tab label and 14s cross-fading body                  | 120  |
| `components/dashboard/vantary/active-window/temporal-anchor-rail.tsx`      | New rail replacing `TemporalAnchorHeader`                                | 180  |
| `components/dashboard/vantary/active-window/day-playbook-canvas.tsx`       | New canvas replacing `DayPlaybookCompact`                                | 320  |
| `components/dashboard/vantary/active-window/active-window-dossier.tsx`     | New dossier replacing `ActiveSessionFocusCard`                           | 520  |
| `components/dashboard/vantary/active-window/index.tsx`                     | Barrel + the top-level `<ActiveWindowPanel/>` composing all three        | 90   |
| `lib/vantary/active-window-tokens.ts`                                      | The token map (cadences, accent triples, seam widths)                    | 60   |

### 5.2 Edits to existing files

- `components/dashboard/vantary/your-space.tsx`:
  - Replace `<TemporalAnchorHeader/>`, `<DayPlaybookCompact/>`, and `<ActiveSessionFocusCard/>` mount sites with the single `<ActiveWindowPanel/>` (which composes the three new components internally). The two old components stay defined as exports for any other consumer in the file; they just aren't mounted in this panel anymore. (We retire them in a follow-up after smoke-test.)
  - The `MarketIntelConsole` wrapper that currently provides the 12-col grid stays; the right-column slot mounts `<ActiveWindowPanel/>` instead of the old `<ActiveSessionFocusCard/>`.
- `components/dashboard/vantary/strategy-os/data.ts`: NOT touched — the rotating-body data lives in the new active-window tokens file instead (avoids cross-package coupling).

### 5.3 Data model addition

```ts
// In SESSIONS_INTEL → each MicroPhase gains:
interface MicroPhase {
  // … existing fields …
  /** Alternate "psychological framing" of the WHY copy — used by the
      14s rotating label to keep the dossier feeling alive. Voiced as a
      coach addressing the trader's state of mind, not the market's. */
  focusPsych?: string
}
```

If `focusPsych` is missing for a phase, the rotation falls back to a single static `focusWhy` (no rotation).

### 5.4 Token map (`lib/vantary/active-window-tokens.ts`)

```ts
export const AW_CADENCE = {
  panelBreath:        8.0,
  liveDot:            2.6,
  sessionTagPulse:    { kz: 3.4, dead: 6.0 },
  whyExpectSeam:      4.0,
  qualityKeyword:     4.0,
  seamShimmer:        14.0,
  tabLabelRotation:   9.0,
  bodyRotation:       14.0,
  hoverSpotlight:     0.22,    // ease-out duration on cursor follow
} as const

export const AW_LETTER = {
  eyebrow:            "0.34em",
  eyebrowPremium:     "0.40em",
  headline:           "-0.03em",
  tabLabel:           "0.32em",
  tabLabelHover:      "0.18em",
} as const

export const AW_SEAM = {
  baseAlpha:          0.22,
  shimmerAlpha:       0.18,
  shimmerWidthPct:    10,
  microSeamIdle:      40,
  microSeamHover:     88,
} as const
```

Everything in the panel reads from this map — there are zero magic numbers in the component files.

### 5.5 Reduced-motion contract

The shared utilities (`<ArchioSeam/>`, `<ArchioPulseDot/>`, `<ArchioRotatingLabel/>`) accept a `reduced?: boolean` prop. Each top-level component calls `useReducedMotion()` once and passes it down. When reduced:
- Seams render static (no shimmer).
- Pulse dots render as solid dots without ripple.
- Rotating labels render only their first variant.
- LayoutId morphs are replaced by instant snaps (still using layoutId so the API is uniform, but with `transition: { duration: 0 }`).
- Hover spotlight is omitted entirely.

### 5.6 Build order (the 8 steps to ship)

1. Token map + reduced-motion plumbing.
2. `<ArchioSeam/>` (with Storybook-style local test inside the file's docblock).
3. `<ArchioPulseDot/>`.
4. `<ArchioRotatingLabel/>`.
5. `<TemporalAnchorRail/>` (smallest piece, validates the language).
6. `<DayPlaybookCanvas/>` (medium piece, validates the expand-drawer).
7. `<ActiveWindowDossier/>` (largest piece, validates the choreographed transitions).
8. Mount `<ActiveWindowPanel/>` in `your-space.tsx`, remove old mounts, smoke-test all 7 phase tabs + reduced-motion + minute rollover.

Each step compiles and runs independently so any regression is local. The old components stay defined but unmounted in step 8 (we delete them in a follow-up ship after the new panel has been live for a session).

---

## 6 · ACCEPTANCE CHECKLIST

The redesign ships when ALL of these are true:

- [ ] Zero `border: 1px solid VANTARY.rule` declarations remain in the three components being replaced.
- [ ] The panel has exactly one ambient backdrop (the radial-breath layer).
- [ ] Every seam in the panel uses `<ArchioSeam/>` — no ad-hoc `borderTop`/`borderBottom` hairlines.
- [ ] Every "live"-state element uses `<ArchioPulseDot/>` with consistent cadence (2.6s for liveness, 3.4s for risk-temperature, 6.0s for dead-zone).
- [ ] The 8 distinct cadences from §3.1 are all present and read in inspection.
- [ ] All four transitions (phase tab, micro-phase, snap-to-live, playbook expand) complete in under 600ms perceived.
- [ ] Reduced-motion mode renders all content but no animation.
- [ ] Minute rollover triggers the digit flash on both the temporal rail and the dossier UTC clock.
- [ ] `focusPsych` rotation fires on the live phase after 14 real seconds.
- [ ] No `console.warn`, no React key warnings, no layoutId collisions.
- [ ] Lighthouse a11y stays ≥95.

---

## 7 · OUT OF SCOPE FOR THIS SHIP

Listed so they don't sneak in:

- The full `<DayPlaybookPanel/>` (the verbose 7-section version) is NOT redesigned here. The compact canvas + expanded drawer is the surface. The full panel remains accessible elsewhere (command palette / dedicated route) unchanged.
- Sound design (deferred to a later work; see §3.4).
- Mobile responsive breakpoints below 720px (the dashboard is currently desktop-first; mobile retreats to a stacked single-column layout with all animations preserved but no hover spotlight).
- The `<JarvisWelcomeBand/>` cockpit + cartouche + 4-rooms above this panel — untouched.
- The TradingView chart panel + chart-controls above the DAY OS panel — untouched.

---

## 8 · PRINCIPLE THAT GOVERNS EVERY DECISION

> A luxury cockpit shows the trader **what changed**, never **that it can change.** The wealth is in the absence of chrome. Every removed border, every replaced chip with raw type, every animation tied to a real event — these are the marks of confidence. The panel must feel less like an app and more like a Patek Philippe complication: every visible thing serves the time it tells.
