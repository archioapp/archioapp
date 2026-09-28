# THE FLIGHT DECK · v3 Master Plan
**Codename: "Living Ecosystem"**
**Budget: ~165 credits across 15 milestones**

> The Flight Deck is not a panel. It is a living instrument that breathes
> even when the trader is still. The deck must SPEAK through design —
> communicate market state, trader state, and next-decision pressure to
> the eye in under 3 seconds, before any mouse moves, before any click.

---

## 0 · THE MANIFESTO — "Design that speaks"

A trader landing on the deck must know, without scrolling, without
hovering, without thinking:

  1. **Where am I in my program?**           → DAY / PHASE / FIRM / TIME LEFT
  2. **Am I trusted? Am I on track?**         → EQUITY / WIN / VERIFIED state
  3. **What does the market want from me?**   → NEXT EVENT / SESSION / VOLATILITY pulse
  4. **What is the room doing right now?**    → 4 room taglines cycling, MARKET pulse strongest
  5. **Where do I click next?**               → the one room whose tagline is currently the loudest

Each of those answers is paired with at least one micro-motion. Motion
is not decoration — motion IS the answer. If the deck is removed of
motion, it must still be readable; if it is removed of content, the
motion must still tell the trader the deck is awake.

This is the **Two-Channel Communication Rule**:
  · Channel A — typography & numbers     (the literal data)
  · Channel B — motion, glow, period     (the felt state)

When both channels agree, the trader trusts the deck instantly.

---

## 1 · TRADER'S 5-SECOND DECISION FLOW (eye-tracking storyboard)

Modeling on F-pattern + Gestalt focal points + Hick's-law-minimized
choice architecture. The deck is designed so that the trader's eye
travels this exact path on first landing:

```
  T+0.0s   Pulsing accent diamond top-left  ── "the deck is alive"
  T+0.4s   THE FLIGHT DECK eyebrow rail     ── "this is the command surface"
  T+0.8s   Welcome back, Marcus.            ── "this is yours"
  T+1.2s   LEFT rail: EQUITY $113,866       ── "you are trusted with this much"
  T+1.6s   RIGHT rail: WIN 67% · MTD +18.3% ── "this is how you are performing"
  T+2.0s   ECB 08:30 chip top-right         ── "the next obstacle is timed"
  T+2.4s   Cockpit centroid: 4 rooms        ── "these are your choices"
  T+3.0s   The room whose tagline crossfades right now wins attention
  T+4.0s   Trader's hand reaches the keyboard or trackpad
  T+5.0s   First interaction
```

Every motion period in §4 is tuned so that **no two layers reach a
peak in the same 0.4s window of the storyboard above.** Attention is
guided, not scattered.

---

## 2 · INFORMATION ARCHITECTURE — psychology-first hierarchy

### 2A · The Welcome Band — `<WelcomeBandTier2 v3/>`

Layout: **absolutely-centered headline** with `position: absolute;
left: 50%; transform: translateX(-50%)`. The headline lives in a
self-shrinking flex column; the left and right stat rails sit in a
3-column grid with `gridTemplateColumns: 1fr min-content 1fr` AND the
center cell hosts an invisible spacer of `min-content` width = headline
width + 2× breathing gutter. This guarantees true visual centering
regardless of any imbalance in rail content.

**LEFT RAIL · "WHO MARCUS IS"** (identity / trust signals)

Reads right-to-left, terminating at the headline. Right-aligned text,
accent dot, mono-caps label. 4 rows, ordered by Maslow-for-traders:

| #  | Value          | Label   | Why this slot                          |
| -- | -------------- | ------- | -------------------------------------- |
| L1 | `$113,866`     | EQUITY  | First thing eye lands on — "trusted with $113k" |
| L2 | `FTMO 50K · P2`| FIRM    | The arena — who you fight in           |
| L3 | `4Y · 1,247S`  | TENURE  | Verified survival — 4 yrs, 1,247 sessions |
| L4 | `VANTARY · LIVE` | VERIFIED | Identity proof — VAN-stamped live    |

Each row carries a 1-frame **scintillation cycle** (period 3.2–4.8s,
randomized per row) — the value letterspacing minutely expands then
contracts. The eye reads it as "this number is alive, this is right
now," not stale.

**RIGHT RAIL · "WHERE MARCUS IS HEADED"** (performance / next-decision)

Reads left-to-right, terminating at the headline. Left-aligned, mono.

| #  | Value         | Label    | Why this slot                          |
| -- | ------------- | -------- | -------------------------------------- |
| R1 | `67% · 90D`   | WIN      | Edge confidence — primary KPI          |
| R2 | `+18.3%`      | MTD      | Current run rate — is this month working? |
| R3 | `0.8R / 2R`   | RISK     | How loaded am I right now? (per-day risk used) |
| R4 | `EUR/USD · 13:30` | NEXT  | Where Marcus is pointed next — bridges to ECB chip |

Same scintillation behavior, **offset by π** from left rail so the
two sides breathe in counterpoint (left-row-1 dim when right-row-1
peaks, etc.). Felt-effect: a chest rising and falling.

**Source of truth**: a new `useTraderProfile()` hook backed by a single
`profile` object — same source the Forecast Hover popup will read,
ensuring deck and popover never contradict each other.

### 2B · Top-Right Toolbar — `<FlightDeckTopRight/>`

Mounted absolute on the cockpit shell, top-right corner, inside the
shell padding. Cluster of 2 chips with a hairline divider:

```
  [ ⚙  CUSTOMIZE ]   │   [ ◐ ECB 08:30  +127m ]
       ⌘K hint            (hover → news popover)
```

**Chip 1 — Customize**: 28px tall pill. Gear icon idle-rotates at
360°/100min (almost imperceptible — but the trader catches it in
peripheral vision once every few minutes). Hover lifts to 1.5°/s.
Click rotates 90° and opens the customizer panel below the cockpit.
⌘K kbd hint chip on the right edge.

**Chip 2 — Next News**: 28px tall. Half-filled circle icon (red folder
analog) tinted by impact (HIGH = red, MED = amber, LOW = green).
Body: `ECB 08:30` + countdown `+127m`. Countdown ticks in mono-tabular
every minute. **Hover → reuse the global news popover** so trader sees
the same brief here that they see in the global header. Single source
of truth.

### 2C · Top-Left Theme Anchor — `<FlightDeckTopLeft/>`

Mounted absolute on the cockpit shell, top-left. Stops floating.

```
  [ ◆  TEAL GLASS ]
```

Diamond glyph breathes at 2.6s in accent color (period 2 in §4).
Text is the active theme name (Teal Glass / Cyber Neon / Neural Dark
/ Quantum Field / Solar Flare / Light Paper / Obsidian), mono-caps,
12.5px, letterspacing 0.18em. Click cycles theme (existing keyboard
shortcut still works). On theme change, diamond does a soft 360° rotate
and the entire cockpit retints over 320ms — the deck breathes the new
color through every layer in §4.

### 2D · Eyebrow Rail — Reduced

Today's rail says "THE FLIGHT DECK · YOUR COMMAND SURFACE · FOUR ROOMS
· ONE PROMPT". v3 reduces it to **"THE FLIGHT DECK"** ONLY — one
crystal-clear protagonist label. The hairlines on either side gain a
new motion: the **photon traveler** (period 7 in §4).

### 2E · Cockpit Centroid — 4 Rooms

Today the cockpit has 5 rooms. v3 keeps 5 if MENTOR HALL is part of
the brief, OR collapses to 4 (MARKET · STUDIO · COLLECTIVE · MY RECORD)
if user wants a tighter Hick's-law profile. **Open question H1.**

### 2F · Strategy OS strip

Already exists below the cockpit. v3 does not touch it.

---

## 3 · THE LIVING ECOSYSTEM ENGINE

A new React context: `<FlightDeckMotionOrchestrator/>` wraps the entire
`<YourSpaceSection/>`. It is the master clock.

### 3A · Why one orchestrator

- Determinism: every animation phase is derived from a single
  `Date.now()`-locked master clock so reloads stay coherent
- Tab-blur pause: when the tab loses focus, the entire deck freezes
  (saves CPU & battery; the trader is not looking)
- Reduced-motion: a single switch disables all layers at once
- Debug overlay: dev-mode keystroke `⌥⇧M` shows a phase visualizer

### 3B · The clock

```ts
const masterPhase = (Date.now() - epoch) / 1000 // seconds since mount
```

Each layer derives its own phase by `(masterPhase / period + offset) % 1`.

### 3C · Incommensurable periods

The key mathematical principle: **no two periods share a rational
ratio.** If two layers have periods 4s and 6s, they re-sync every 12s
and the eye locks onto the 12s beat. We pick periods like
`3.7s · 5.3s · 7.1s · 11.4s` — pairwise irrational ratios mean **the
system never repeats**. This is the same technique used in real-world
chaotic-but-pleasant environments (forest sounds, ocean waves).

### 3D · Reduced-motion contract

`useReducedMotion()` from framer-motion. When true:
- All periods become Infinity (no motion)
- All animated values snap to their resting state
- Crossfades become hard cuts on a 12s timer (so taglines still
  rotate but never animate)
- Aurora field becomes a single static radial gradient

---

## 4 · THE 12 MOTION LAYERS (exhaustive)

| # | Layer | Period | Where | Function | Theme-tinted? |
|---|-------|--------|-------|----------|---------------|
| 1 | **Aurora field** | 37.4s + 53.1s drift, two superposed | Cockpit shell background | Atmosphere — "the deck has weather" | Yes (accent + secondary) |
| 2 | **Top-left diamond breath** | 2.6s | Top-left chip | Heartbeat — "the deck is alive" | Yes |
| 3 | **Headline shimmer** | 6.8s, 1.4s offset between THE FLIGHT DECK & Welcome back, Marcus. | Eyebrow + welcome headline | Protagonist scintillation — eye attractor #1 | Yes |
| 4 | **Eyebrow pulse pips** | 2.4s, opposite phase | Eyebrow rail | Heartbeat #2 — bilateral symmetry | Yes |
| 5 | **Stat-card scintillation** | 3.2-4.8s, randomized per row × 8 rows | Welcome band L+R rails | 8 humans breathing — desync = humanity | Yes (when "strong") |
| 6 | **Headline counterpoint breath** | 11.7s, π-offset between L and R rails | Welcome band | Chest rising/falling — emotional anchor | Yes |
| 7 | **Hairline photon traveler** | 9.3s, 0–100% sweep | Eyebrow rail + every room-header hairline | A packet of light flowing through the veins | Yes |
| 8 | **Room tagline crossfade** | 4.8s hold + 0.45s fade, 1.6s stagger between rooms | 5 room columns | Ecosystem is never silent — always one room "speaking" | No (paper / paperDim only) |
| 9 | **Room icon idle tilt** | 8.2-9.7s, staggered, ±2° amplitude | Each room header | Living symbols — the rooms are awake | Yes |
| 10 | **Customize gear rotation** | 6000s = 100min (one full rev) | Top-right chip | Almost subliminal — "the machine is alive" | Yes |
| 11 | **ECB countdown tick** | 60s (mono digit replace) | Top-right news chip | Time is moving — pressure | Yes (impact-tinted) |
| 12 | **Cursor parallax halo** | Cursor-bound, 18px max translate | Cockpit interior | Soft 3D field — "the deck is in front of you" | Yes |

### 4A · Special motion: Theme-change cascade

When user cycles theme (top-left click): a 320ms wave sweeps L→R
across the cockpit, retinting layer-by-layer with a 40ms stagger
between layers. The deck "drinks" the new color.

### 4B · Special motion: First-mount unfurl

On initial render: layers come online in order
`shell → eyebrow → headline → rails → cockpit → motion-orchestrator`,
each 80ms apart. Total = 480ms. The deck **assembles itself in front
of the trader.**

### 4C · Special motion: Tab-blur freeze + re-bloom

Tab blurs → all motion freezes mid-phase. Tab regains focus → 200ms
re-bloom (slight scale-in 0.99→1, opacity 0.7→1). The deck welcomes
you back.

---

## 5 · THEME COUPLING GRAMMAR

Every pixel must retint. Audit checklist for v3:

- [ ] Cockpit shell border, background gradient, top gleam — DONE in v2
- [ ] Column dividers (vertical + mobile horizontal) — DONE in v2
- [ ] Room-header feeder hairlines — DONE in v2
- [ ] Room interior bottom hairline — DONE in v2
- [ ] Welcome band stat dots — DONE in v2
- [ ] **Eyebrow rail hairlines** — done v2, but verify all 7 themes
- [ ] **Top-left diamond + theme name** — new in v3
- [ ] **Top-right customize chip border + glow** — new in v3
- [ ] **Top-right ECB chip border + countdown digits** — new in v3 (countdown digits = accent.hex)
- [ ] **Headline shimmer mask** — new in v3, MUST retint
- [ ] **Stat-card scintillation glow** — new in v3
- [ ] **Hairline photon traveler color** — new in v3
- [ ] **Aurora field** — new in v3, two superposed radial gradients in accent + secondary
- [ ] **Global brand mark** (outside the deck, top of dashboard) — currently neutral, must retint

**No-Neutral-Gray Rule**: comment marker `// vg:no-neutral` on every
hard-coded white-alpha so we can grep for regressions.

---

## 6 · THE 15 MILESTONES

Each milestone is 8–12 credits of work, including motion wiring, theme
coupling, accessibility, and acceptance.

### **M1 · Motion Orchestrator Foundation** (~12c)
Build `<FlightDeckMotionOrchestrator/>` context. Master clock,
`useFlightDeckPhase(period, offset)` hook, tab-blur pause via
`document.visibilitychange`, reduced-motion override, debug overlay
(dev only). Wire context provider into `<YourSpaceSection/>`.

### **M2 · Theme Coupling Audit + Brand Mark Retint** (~7c)
Grep every `rgba(255,255,255,...)` in the deck region. Replace with
`vgRgba(accent.rgb, ...)`. Audit the global brand mark; retint to
accent. Add `// vg:no-neutral` markers.

### **M3 · Welcome Band v3 — Anchor + Identity Rail (LEFT)** (~12c)
Rebuild `<WelcomeBandTier2/>` with absolute-center headline anchor.
Build LEFT identity rail (4 rows: EQUITY · FIRM · TENURE · VERIFIED).
Hook to `useTraderProfile()` (new). Mono typography, dot separators,
scintillation cycle on each row.

### **M4 · Welcome Band v3 — Performance Rail (RIGHT)** (~10c)
Build RIGHT performance rail (4 rows: WIN · MTD · RISK · NEXT). Bind
to same `useTraderProfile()`. Apply π-offset breath relative to LEFT
rail. RISK row uses a tiny accent progress hairline beneath
"0.8R / 2R" — visualizes how loaded the trader is.

### **M5 · Headline Shimmer + Counterpoint Breath** (~10c)
Apply layer 3 (headline shimmer) to THE FLIGHT DECK eyebrow text and
Welcome back, Marcus. headline. 1.4s phase offset between them. Layer
6 (counterpoint breath) between L and R rails. Verify the storyboard
in §1 — no two peaks in same 0.4s window.

### **M6 · Top-Right Toolbar** (~10c)
Build `<FlightDeckTopRight/>` cluster, mounted absolute on cockpit
shell, top-right inside padding. Compact CUSTOMIZE chip with gear
rotation (layer 10). Compact ECB news chip with countdown (layer 11).
Hairline divider between. Both chips re-themed.

### **M7 · ECB Chip → Reuse Global News Popover** (~9c)
Wire ECB chip hover state to the existing global news popover. Single
source of truth for next-event data. Verify popover positions
correctly anchored to the chip (offset 12px below, right-aligned).

### **M8 · Top-Left Theme Anchor** (~9c)
Build `<FlightDeckTopLeft/>` cluster. Breathing diamond (layer 2),
theme name, click-to-cycle. On cycle, trigger the theme-change cascade
(§4A) — 320ms L→R wave with 40ms layer stagger.

### **M9 · Eyebrow Rail Reduction + Photon Traveler** (~10c)
Trim eyebrow to "THE FLIGHT DECK" only. Implement layer 7 (photon
traveler) sweeping the eyebrow hairlines and every room-header
hairline. Photon is a single 30px-wide bright-accent gradient
travelling 0→100% over 9.3s.

### **M10 · Room Headers — Whitespace Surgery + Idle Tilt** (~10c)
Move the room bottom hairline INSIDE the collapsible to balance top
and bottom whitespace (today bottom > top). Apply layer 9 (icon idle
tilt) to each room icon, staggered 0–4s between rooms. True
math-centering verified with grid `1fr min-content 1fr`.

### **M11 · Room Tagline Rotator — 20 Phrases** (~12c)
Build `useTaglineRotator(roomId)` hook. Write 4 phrases × 5 rooms = 20
phrases:

- **MARKET**: "What's happening right now" · "The pulse of the world" · "Where capital is moving" · "Today's price storyline"
- **STUDIO**: "Make something today" · "Your prep, your edge" · "Build the next trade" · "The thinking room"
- **MENTOR HALL**: "Learn from the best" · "Borrow their lens" · "Stand on their shoulders" · "The wisdom vault"
- **MY RECORD**: "Your story so far" · "Every trade is a brick" · "The proof of your work" · "Receipts that compound"
- **COLLECTIVE**: "Find your ecosystem" · "The room of rooms" · "Your tribe is here" · "Where outliers gather"

Crossfade 0.45s, hold 4.8s, stagger 1.6s between rooms. Reduced-motion: hard cuts on a 12s timer.

### **M12 · Aurora Field + Cursor Parallax Halo** (~11c)
Implement layer 1 (aurora field) as two superposed radial gradients
(accent + secondary) drifting on periods 37.4s and 53.1s. Implement
layer 12 (cursor parallax halo) — soft 18px-amplitude follow of the
mouse position inside the cockpit, applied to a single accent radial
gradient with 30% alpha.

### **M13 · First-mount Unfurl + Tab-blur Re-bloom** (~8c)
Implement §4B (first-mount unfurl) — `shell → eyebrow → headline →
rails → cockpit` with 80ms stagger. Implement §4C (tab-blur freeze
+ re-bloom on focus). Use `AnimatePresence` mode='wait' for the
unfurl orchestration.

### **M14 · Accessibility + Reduced-Motion Pass** (~7c)
Audit prefers-reduced-motion everywhere. ARIA labels on every stat
row, room header, chip. Keyboard nav: Tab order = top-left theme →
eyebrow → top-right customize → top-right ECB → welcome → 5 rooms.
Screen-reader announcement on theme change.

### **M15 · Visual QA Across 7 Themes + Performance Pass** (~8c)
Generate 7 screenshots — Teal Glass · Cyber Neon · Neural Dark ·
Quantum Field · Solar Flare · Light Paper · Obsidian. Verify no
neutral-gray bleed-through anywhere. Profile paint counts; if any
layer is >2ms/frame, coalesce to transform-only or move to canvas.
Mobile breakpoint check at 375px and 768px.

**Total: ~145c** (estimates round up; expect 150–165c in practice).

---

## 7 · TRADER MENTAL MODEL — how the deck "speaks"

### 7A · The state grammar (what each motion means)

| Motion property | Trader reads it as | Mapped to |
|-----------------|--------------------|-----------|
| Pulse-pip period faster | Market more active | Session activity (London open = 2.0s, off-hours = 3.0s) |
| Stat-card scintillation amplitude up | This number changed today | Last-updated < 4h |
| Headline shimmer slower | Calmer regime | VIX-equivalent volatility |
| RISK rail bar fills | Day's risk envelope spending | live R-multiple sum |
| Photon traveler accelerates | News window approaching | T-15min to red folder |
| Tagline lingers longer on one room | That room has fresh content | New unread count > 0 |

Most of these mappings can be wired in this build; some are
"reserved" hooks that ship in v3.1 once the data layer catches up.
**Open question H2.**

### 7B · The breath rule

Every "alive" component must have at least ONE motion property that
breathes — period > 2s, never sharp. Sharp motions only happen on
user input. This is the "no twitching" rule. Twitching = stress.
Breath = confidence.

### 7C · The retint rule

When the trader changes theme, EVERY breathing element retints in the
same 320ms wave. The deck must never have a "stale layer" still in
the old palette after the wave ends. This is enforced by deriving
every animated color from the orchestrator's `accent` snapshot
captured at render-time.

---

## 8 · ACCEPTANCE TESTS

Before we mark v3 done, all must pass:

1. **5-second glance test** — naive viewer can answer §1's five
   questions after 5 seconds of looking at the static deck.
2. **Idle motion test** — a 10-second screen recording with zero mouse
   movement shows ≥4 distinct motion layers active.
3. **No-twitching test** — no animation < 2s period except (a) the
   ECB countdown tick (once per minute, allowed because it's data),
   and (b) user-input-triggered transitions.
4. **No-neutral-gray test** — `grep -E "rgba\(255,255,255" your-space.tsx`
   in the deck region returns zero hits.
5. **Reduced-motion test** — `prefers-reduced-motion: reduce`
   produces a static deck where taglines still rotate via hard cuts
   on a 12s timer, and everything else is frozen at rest state.
6. **7-theme visual QA** — all 7 themes pass screenshot review.
7. **Mobile test** — 375px and 768px renders without horizontal
   overflow.
8. **Performance test** — total paint cost in the deck region is
   < 8ms/frame on a 4-year-old laptop.

---

## 9 · REDUCED-MOTION PACT

We never penalize reduced-motion users. Their deck is **just as
information-rich** — taglines still rotate via 12s hard cuts (because
otherwise the trader misses content), but every continuous animation
is frozen at its mid-amplitude rest position so the visual COMPOSITION
is the same. The breath rule becomes "implied breath" — colors are
slightly more saturated to compensate for absent shimmer.

---

## 10 · OPEN QUESTIONS

- **H1**: 4 rooms or 5 rooms in the cockpit? (Hick's-law says 4 is
  faster; current code ships 5. Default to 5 unless you say
  otherwise — fewer changes.)
- **H2**: How many of the §7A "live state" mappings ship in v3?
  Default: pulse-pip session activity, stat-card freshness shimmer,
  photon-traveler news proximity. RISK bar ships if the data exists,
  else cosmetic.
- **H3**: Top-right toolbar chips — anchored to cockpit shell or
  to the welcome band above? Default: cockpit shell.

---

## 11 · FILES TOUCHED

- `components/dashboard/vantary/your-space.tsx` — major surgery, 60% of work
- `components/dashboard/vantary/theme-system.ts` — add `getThemeName()`, `getThemeId()`
- `components/dashboard/vantary/use-trader-profile.ts` — NEW
- `components/dashboard/vantary/flight-deck-motion.tsx` — NEW (orchestrator)
- `components/dashboard/vantary/flight-deck-top-rail.tsx` — NEW (top-left + top-right clusters)
- `components/dashboard/dashboard.tsx` — minor: brand mark retint
- `app/globals.css` — minor: prefers-reduced-motion utility classes

**No new dependencies.** All motion via framer-motion (already
installed).

---

## 12 · ROLLOUT ORDER

M1 → M2 (foundation) → M3 + M4 + M5 (welcome band — the centerpiece) →
M6 + M7 + M8 (the top rail — the chrome) → M9 + M10 + M11 (the rooms
— the conversation) → M12 + M13 (the atmosphere) → M14 + M15 (the
polish). Each milestone shippable independently; deck remains usable
mid-rollout.

— End of plan —
