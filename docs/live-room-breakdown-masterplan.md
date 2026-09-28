# Live Room — THE BREAKDOWN · Masterplan v2

> Successor to `docs/live-room-design-masterplan.md`. That plan built the *architecture* (one
> `SessionEvent` ledger → derived lenses → phase-aware tools). This plan builds the *expression*:
> how the room explains itself. Everything below sits on the same ledger. Nothing is hard-coded
> in a view; every sentence, node, level and pulse is folded from events.

---

## 0. Diagnosis — why the room reads "basic"

Screenshots at 1408 × 937 (dark) and 390 × 844 were audited pane by pane.

| Symptom | Where | Root cause |
|---|---|---|
| Sentences end in `…` | Every lens body, lens titles | `-webkit-line-clamp: 2` on prose that is the *point* of the card |
| Events read like log lines | Timeline titles: "Thesis updated — remaining position targeting 2042 with trail at 2036" | One `title` string carries what / why / consequence at once |
| The mentor's *reasoning* is invisible | Whole room | The ledger stores conclusions (entry, exit, level) but not the causal chain that produced them |
| Jargon is unexplained | "sweep", "displacement", "delta divergence", "accumulation", "trail" | No explain layer; the room assumes an ICT-literate reader |
| Everything is the same weight | Every pane | Mono small-caps eyebrow → 12.5px sans body → fact rows, repeated 11 times; nothing is *the* thing to look at |
| Right column ends at ~900px, left scrolls to ~2400px | ≥ 1280 | Timeline is unbounded inside a 40% column; the 60% column has three panes |
| No sense of *time as a dimension* | Chart + timeline | The chart's x-axis is time, the timeline is time, but the viewer cannot *move through* time |
| Numbers are labels, not instruments | Entry / Target / Trail rows | A trade is a live geometry (price vs. entry vs. stop vs. target); rows of numbers hide the geometry |

**One sentence:** the room *records* the session well and *explains* it badly.

---

## 1. The information-logic model — "Claim · Evidence · Consequence"

Every unit of information in the room is rewritten to carry three layers. This is the copy
contract, enforced by the schema, not by discipline.

```
title     WHAT happened            verb-first · ≤ 64 chars · one clause · no "—" chains
body      WHY the mentor did it    mentor's voice · 1–2 sentences · references a level or a prior event
meaning   SO WHAT for the viewer   1 sentence · starts with a verb or "You…" · never restates the title
evidence  WHERE it came from       event ids + level refs; renders as provenance chips / threads
invalidation  WHAT KILLS IT        price + timeframe + condition; renders as the red hairline
```

Example — the same event, before and after:

```
BEFORE  title: "Thesis updated — remaining position targeting 2042 with trail at 2036"
        body:  "Half is banked. The remaining 50% runs to 2042 with the trail lifted to 2036 — below the sweep, above entry."

AFTER   title:        Trail lifted to 2036 — the runner is now risk-free
        body:         Half is banked at 2038.40. The remaining 50% runs to the 2042 draw on liquidity.
                      The trail sits at 2036 — below the swept 2035.50 so a retest does not stop us
                      out, above 2034.20 entry so the worst case is a smaller win.
        meaning:      You can stop managing risk on this trade. What is left is patience.
        evidence:     te-15 (partial exit) · te-14 (sweep) · te-13 (entry)
        invalidation: 15m close below 2036 → runner closes at +1.8 R, thesis intact.
```

The contract applies to: events, lenses, breakdown nodes, tool outputs, Oracle bullets.

---

## 2. The signature — THE BREAKDOWN spine

One element the room is remembered by. A horizontal glass spine across the full width, directly
under the header, that decomposes the mentor's live thesis into its causal chain:

```
  CONTEXT ──── NARRATIVE ──── LEVEL ──── TRIGGER ──── ENTRY ──── MANAGE ──── OUTCOME
  HTF bias      Draw on         2035.50    Displacement  2034.20    Trail 2036   TP1 +$1,240
  DXY / 10Y     liquidity       sweep      + delta div.  half size  50% runs     2042 open
  ● confirmed   ● confirmed     ● swept    ● confirmed   ● live     ● protected  ◐ 1 of 2
```

### 2.1 Why this shape
This is how the mentor actually thinks (HTF bias → draw on liquidity → PD array → displacement →
entry → management → target). It is also the first thing a new viewer needs: *what is the plan
and how far along are we?* The phase rail (Observe / Setup / Execute / Review) says where the
*session* is; the spine says where the *trade* is.

### 2.2 Derivation (pure function of the ledger, `deriveBreakdown(events, cutoff)`)
| Node | Folded from | Status logic |
|---|---|---|
| Context | `focus-change`, `bias-shift`, INSTRUMENTS context symbols | `confirmed` once a bias-shift exists, else `forming` |
| Narrative | latest `thesis-update` `body` + its `target` level | `confirmed` if a bias-shift agrees with its direction |
| Level | latest `level-call` on the primary instrument | `armed` → `swept` when a key-moment names the price |
| Trigger | `key-moment`s in setup/execute (displacement, delta divergence) | `pending` → `confirmed` when ≥1 exists after the level call |
| Entry | latest `entry` | `live` / `closed` / `none` |
| Manage | exits + trail moves on the open position | `unmanaged` → `banked` (partial) → `protected` (stop ≥ entry for longs) |
| Outcome | realised P&L + targets hit vs. remaining | `open` / `1 of 2` / `complete` |

Each node exposes `{ claim, detail, status, evidenceIds, level?, invalidation?, terms[] }`.

### 2.3 Anatomy of a node (glass tile, 7 across ≥ 1024, 2 × 4 grid < 1024, horizontal scroll < 640)
```
┌──────────────────────────────┐
│ 03 · LEVEL            ● SWEPT│  eyebrow: index + role · status coin (tone by status)
│ 2035.50                      │  claim: the single number or 3-word claim, 20px mono/sans
│ Liquidity above Asia high    │  detail: ≤ 2 lines, sans 12.5
│ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │  provenance thread (dashed) → lights on hover
│ ⌐ 2 events · 2:10 PM         │  evidence stamp
└──────────────────────────────┘
```
Between nodes: a 1px thread. Confirmed→confirmed segments are solid primary; segments into a
pending node are dashed ash. One *light* travels the confirmed portion every 6 s (the rating-
monument grammar — a light between facts), pausing at the current frontier node.

### 2.4 Interaction contract
- **Hover node** → its `evidenceIds` light in the timeline (reuses `litEvents`), its level draws
  on the chart (reuses `chartLens` via a synthetic lens), the node lifts 2px, the thread segment
  into it brightens.
- **Click node** → pins it (same as lens pin): focuses the stamp event, scrolls the timeline,
  opens the node's **Dossier** drawer below the spine: full body, meaning, invalidation hairline,
  evidence list with time stamps, glossary terms.
- **Keyboard**: nodes are a `radiogroup` with roving focus (←/→, Home/End), Enter/Space pins.
- **Replay**: the spine is derived at `cutoffMin`; scrubbing back turns nodes to `pending` and
  the frontier light moves left. This is the "teaching mode" — *what did the room know at 2:28?*

---

## 3. Decision Replay — time as a dimension

A scrubber inside the screen pane, under the chart, aligned to the chart's x-axis (x = at / now).

```
2:00 PM  ·····•····•··•••·•·•·••···◉─────────────────────────── NOW 2:45
         mode  thesis lvl  ...  entry sweep exit trail        ▲ drag / ← → / Home End
```
- Ticks = events (importance ≥ 3 get a taller tick, mentor events primary, warnings amber).
- Dragging sets `cutoffMin`. **Everything derives at the cutoff**: lenses, breakdown, positions,
  P&L strip, timeline (future events render ghosted at 28% with a "not yet" eyebrow), chart
  (candles after the cutoff fade, the price tag shows the cutoff price, a vertical hairline marks
  the replay head), pulse lane.
- `LIVE` pill in the header turns to `REPLAY · 2:28 PM` (amber) while `cutoffMin < nowMin`;
  a `Return to live` ghost button appears in the scrubber.
- Snap: releasing the handle snaps to the nearest event tick within 6px, so the viewer lands on
  decisions, not between them.
- Clock stays one number: `viewMin = cutoffMin ?? nowMin`; every `nowMin` read in a view becomes
  `viewMin`. The live clock keeps ticking underneath; returning to live is instant.

---

## 4. Trade Anatomy — the open position as geometry

Replaces the "Entry / Target / Trail / R:R" fact rows in the thesis lens with a vertical price
ladder inside its own pane (left column, under the phase rail):

```
   TARGET  2042.00 ┬──────────────────────  +2.7 R
                   │  ░░░░░░░░░░░░░░░░░░░░  open   ← remaining reward, hatched
   PRICE   2037.98 ┼━━━━━━━━━━━━━━━━━━━━━━  +1.3 R   ← live marker, moves with the tape
   TP1     2038.40 ┼──────────────────────  banked +$1,240
   TRAIL   2036.00 ┼──────────────────────  +0.6 R  protected
   ENTRY   2034.20 ┼──────────────────────  0 R
   STOP    2028.00 ┴──────────────────────  −1 R   (original, retired)
```
- Scale is *R*, not price: entry = 0, original stop = −1. The ladder is the same for every trade,
  so a viewer learns one geometry.
- Live numbers: R now, MFE (max favourable excursion), MAE, time in trade, size, "risk state"
  (`at risk` → `banked` → `protected` → `risk-free`).
- Hover a rung → the corresponding level draws on the chart and its source event lights.
- Derived from `deriveOpenPositions` + candle series (MFE/MAE come from the chart's high/low
  since entry). When flat, the pane shows the last closed trade's anatomy with an `archived`
  eyebrow.

### 4.1 Confluence strata (inside the LEVEL node dossier and level-call cards)
A level is a *stack* of reasons. Render each reason as a glass stratum with a weight bar:
```
2035.50  ▮▮▮▮▮ Asia session high (liquidity)
         ▮▮▮▮  Equal highs 2035.4 / 2035.6
         ▮▮▮   15m fair value gap 2033.5 – 2035.8
         ▮▮    Daily EQ + 0.5 ATR
```
Strata come from `level-call.confluence[]` on the event. Total weight → the node's confidence.

---

## 5. Explain layer — glossary + `<Term>`

`components/live-room/glossary.ts`: ~24 terms (sweep, displacement, draw on liquidity, fair value
gap, order block, delta, delta divergence, absorption, accumulation, trail, break-even, R multiple,
MFE/MAE, FOMC, DXY, PD array, equal highs, invalidation, partial, runner, HTF bias, VWAP, EMA,
market structure shift). Each: `{ term, short (≤ 90 chars), why (≤ 110 chars, "here" context),
glyph }`.

`<Term id="sweep">sweep</Term>` renders a dotted underline in ash; hover/focus opens a glass card
(portal, 260px, positioned by `getBoundingClientRect`, flips above when clipped): term · short ·
"in this room" line · a 48×24 micro-diagram (SVG, 3 kinds: level-cross, gap, divergence).
Copy in events/lenses/nodes is authored with `{{sweep}}` tokens; `renderTerms()` splits into
text + `<Term>` at render time so the ledger stays plain strings.

Setting: header gains an `EXPLAIN` toggle (default on). Off → underlines vanish, tooltips off.

---

## 6. Room Pulse — the audience as a lane

Under the scrubber: a 28px lane on the same x-axis. Every event's `reactions` becomes a soft bar;
hover an event anywhere → its bar brightens; the lane is also how the viewer sees *where the room
cared*. Mentor events primary, audience/system ash. In replay, bars after the cutoff ghost.

---

## 7. Layout — recomposed for 1408 and 390

```
≥ 1280                                  < 1024                     < 640
┌─ header ───────────────────────────┐  header                     header
├─ THE BREAKDOWN spine (full width) ─┤  spine (2×4 grid)           spine (h-scroll)
├─ left 40% ────┬─ right 60% ────────┤  screen + replay + pulse    screen
│ mentor        │ screen             │  tools                      replay/pulse
│ phase rail    │  replay scrubber   │  trade anatomy              tools
│ trade anatomy │  pulse lane        │  mentor · phase             anatomy
│ intelligence  │ tools              │  intelligence               mentor · phase
│ timeline ▼    │ discussion (sticky │  timeline                   intelligence
│  (max-h,      │  top, own scroll)  │  discussion                 timeline
│   own scroll) │                    │                             discussion
```
- The timeline gets `max-height: calc(100vh − 220px)` with its own scroll at ≥ 1024 so the two
  columns end together; the ledger strip + filters stay pinned at its top.
- Discussion becomes `position: sticky; top: 72px` at ≥ 1280 with `max-height` so the chat is
  always reachable while the left scrolls.

---

## 8. Typography & glass — the hierarchy fix

Two families stay (sans + mono). What changes is *role*:
- **Claims** (spine node claim, anatomy price, P&L): 18–22px, mono tabular for numbers, sans 500
  for words, `letter-spacing −0.01em`. These are the only large things.
- **Prose** (body/meaning): sans 13/1.55, `text-pretty`, **never clamped** — long copy expands
  with a "more" affordance only in the timeline (default open: 3 lines + fade, click to expand).
- **Meaning** lines: italic sans 12.5, paperDim, prefixed by a 10px primary tick `›`.
- **Eyebrows** stay 9px mono; **fact labels** stay 11px.
- Glass: the spine pane is `deep` (glassDeep) with the veil visible through it; node tiles are
  `recess` with a 1px inner top light; the dossier drawer is a *second* recess depth
  (`color-mix(glassRecess 70%, transparent)`) — three visible depths on one screen, no darker
  fills anywhere.

---

## 9. Motion contract
- Spine: nodes rise+deblur staggered 60ms on mount; frontier light every 6 s (pauses on hover and
  under reduced motion — at rest it sits on the frontier node).
- Replay: scrubbing is direct (no easing); on release, a 240ms settle of the chart fade + node
  status recolor. Ghosted timeline cards use opacity only.
- Anatomy: price marker moves with `spring(500, 35)`; R text rolls with `animate()`.
- Term cards: 140ms fade+2px rise; no motion under reduced motion.
- Nothing animates `filter` with `forwards` on an element that also carries a drop-shadow (canon).

---

## 10. Accessibility
- Spine = `radiogroup`; scrubber = `role="slider"` with `aria-valuetext="2:28 PM · 11 events"`,
  arrow keys move one event, Home/End jump; ghosted timeline cards carry `aria-label="Not yet —
  happens at 2:41 PM"`; Term cards are `role="tooltip"` bound by `aria-describedby`; live regions:
  the REPLAY pill (`aria-live=polite`).
- Contrast floors: prose ≥ 4.5:1 on the resolved pane; ghosted cards are `aria-hidden` unless
  focused.

---

## 11. Build order (this session)
1. **Model** — schema (`meaning`, `evidence`, `invalidation`, `confluence`, `terms` via tokens),
   `glossary.ts`, seed rewrite (all 16 events, all messages that quote events), `deriveBreakdown`,
   `deriveAnatomy`, `derivePulse`, `atCutoff()`.
2. **Store** — `cutoffMin`, `viewMin`, `hoveredNode/activeNode`, derived-at-cutoff, `explain` flag.
3. **Explain** — `<Term>` + `renderTerms()`.
4. **Spine** — `breakdown-spine.tsx` (+ dossier drawer).
5. **Screen** — replay scrubber + pulse lane + cutoff-aware canvas.
6. **Anatomy** — `trade-anatomy.tsx` (+ confluence strata component reused by timeline).
7. **Re-ink** — lenses (no clamp, meaning line, provenance chips) · timeline (three layers,
   ghosting, confluence, terms) · header (REPLAY pill, EXPLAIN toggle).
8. **Layout** — sticky discussion, bounded timeline, spine band; verify 1408 / 1024 / 390.

## 12. Verification checklist
- [ ] Every seed event has `title ≤ 64`, `body`, `meaning`; zero `…` clamps in lenses.
- [ ] Hover any spine node → ≥1 timeline card lights and the chart draws its level.
- [ ] Scrub to 2:28 → OUTCOME/MANAGE/ENTRY nodes read `pending`, P&L strip reads `$0`, entry
      triangle disappears, 6 timeline cards ghost, header pill reads `REPLAY · 2:28 PM`.
- [ ] Return to live restores the seeded state exactly (no drift).
- [ ] Anatomy marker moves with the live tape; R rolls; `protected` once trail ≥ entry.
- [ ] `<Term>` opens on hover and focus, closes on Esc/blur, flips above when near the bottom.
- [ ] 1408: both columns end within 80px of each other; 390: no horizontal overflow (scrollW = 390).
- [ ] `prefers-reduced-motion`: light static on frontier, no scrub settle, no term motion.
