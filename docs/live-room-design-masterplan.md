# LIVE ROOM — UI/UX Design Masterplan

**Scope:** Total reconstruction of the Discord section (the panel that slides in from the right: `components/community-panel/*`), starting with the Live Mentor Room. Same information architecture, same features, new design — inherited from the Forecast Atlas and the Flight Deck, then elevated into one smoother, glassier theme.

**Status:** Design canon. Nothing in this document is implemented yet.

---

## 0. The verdict on what exists

### 0.1 What the Discord section contains today (all of it is kept)

`components/community-panel/` — 15,681 lines across 12 files.

| File | Lines | What it is | Keep |
|---|---|---|---|
| `mentor-stage.tsx` | 3,867 | The Live Mentor Room: header bar, mentor card, session timeline, audience presence, room pulse, screen share, discussion (4 rooms), instruments in focus, room intelligence (4 lenses), stage tools (4 verbs), reorderable/collapsible sections persisted to localStorage | All features |
| `floating-community-hub.tsx` | 3,191 | The slide-in shell: DESKS rail (WR/CE/GM/NY/MH), server navigator (LIVE NOW card, Gameplan, Entries, Rankings, Call history, Dashboard, SIGNALS, WAR ROOMS, OPERATOR footer), view router | All features |
| `live-calls-dashboard.tsx` | 2,569 | Mentor analytics: expectancy, avg win/loss, R:R, consistency, curve smoothness, audience engagement, AI copilot | All |
| `daily-gameplan.tsx` | 1,239 | Daily levels board: daily EQ/FVG, H4 supply, key support, bias per instrument, in-play/completed/invalidated | All |
| `live-call-history.tsx` | 1,195 | Past sessions: events, highlights, peak viewers, net P&L, key moments | All |
| `community-primitives.tsx` | 1,150 | Old primitive kit | Retire (replaced) |
| `entry-room.tsx` | 980 | Entries board: LIVE/PENDING/TP HIT/SL HIT/CLOSED per member | All |
| `leaderboard.tsx` | 443 | Rankings: accuracy, win rate, avg RR, volume, "to top 5" | All |
| `community-archio-bridge.tsx` | 397 | Bridge to ARCHIO | All |
| `member-profile.tsx` | 274 | Member profile card | All |
| `notification-center.tsx` | 258 | Notifications | All |
| `header-community-trigger.tsx` | 118 | The floating left-edge live tab (red dot · broadcast icon · "6") | All — already on-brand |

### 0.2 Why it looks wrong (root causes, not taste)

1. **Off-theme palette.** Every section carries its own hard-coded RGB triplet: red `239,68,68` header, sky `56,189,248`, violet `139,92,246`, amber `245,158,11`, emerald. Eight accent hues on one screen. The rest of ARCHIO is one teal primary + two chart semantics. The room reads like a different product.
2. **White hairlines.** Borders are `rgba(255,255,255,0.04–0.06)`. The Flight Deck and Forecast rooms tint every hairline with the primary (`rgba(45,212,191,0.12)`), which is what makes them feel lit from inside.
3. **Illegible type.** Text sizes of 6, 6.5, 7, 7.5, 8px appear dozens of times. Below 9px nothing is readable; below 11px nothing is body.
4. **Gradient-fill cards.** Cards use `linear-gradient(160deg, rgba(color,0.05), rgba(0,0,0,0.3))` — opaque, heavy, no backdrop blur. The Forecast/Flight Deck cards are true glass: `blur(24–28px) saturate(150%)` over a translucent ink.
5. **No hierarchy of edges.** Every card has the same radius (xl) and the same border. The Flight Deck uses 20–22px radius on panes, 14px tight, 8px chips, plus corner brackets on primary panes only.
6. **Disconnected blocks.** Session Timeline, Room Intelligence and Stage Tools are three unrelated lists stacked vertically. Intelligence does not know which events produced it; tools do not know the phase; nothing points at the chart.
7. **Hydration error on load** ("Text content does not match server-rendered HTML", 1/4) — time/elapsed values rendered on the server differ from the client.

---

## 1. Design DNA — extracted from the sources we are copying

Everything below is the actual grammar in the code, not an interpretation.

### 1.1 Token system (single source of truth)

`components/dashboard/vantary/vantary-theme.ts` → `VANTARY` → CSS vars `--vt-*` written by `<VantaryThemeProvider/>`. Teal Glass defaults:

```
ink        #0A0E12        ink2 #141B21        ink3 #1A2329
paper      #EAEFF4        paperDim #C5CCD4
ash        #7B8894        ashSoft #5E6A75      ashGhost #3D4851
primary    #2DD4BF        primaryDeep #14B8A6  primaryInk #0D1E1C
primaryWash rgba(45,212,191,0.10)   primaryHalo rgba(45,212,191,0.20)
rule       rgba(45,212,191,0.12)   ruleSoft 0.06   ruleStrong 0.20
glass      rgba(16,23,28,0.60)     glassStrong rgba(14,20,26,0.80)   glassDeep rgba(10,14,18,0.88)
chipFill   rgba(45,212,191,0.06)   chipFillHi 0.12  chipBorder 0.18
chartUp    #10B981   chartDown #EF4444   chartNeutral #6B7280
glow       0 0 20px rgba(45,212,191,0.25), 0 0 40px rgba(45,212,191,0.10)
```

The Forecast room wraps this as `VT` (`forecast-vantary-tokens.ts`) and adds: `blur: blur(24px) saturate(150%)`, `cardRadius 20`, `cardRadiusTight 14`, `chipRadius 8`, `badgeRadius 6`, `cardShadow: 0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px rgba(0,0,0,0.32)`, `cardShadowHover: … 0 16px 40px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.04)`, `ease [0.22,1,0.36,1]`.

**Rule: the Live Room reads only from `VANTARY`/`VT`. Zero literal RGB triplets in components.** A theme switch (Amber / Cobalt / etc.) must recolor the whole room with no code change — exactly as the Forecast room does today.

### 1.2 Typography contract

| Role | Class / style | Size | Tracking | Color |
|---|---|---|---|---|
| Eyebrow | `font-mono uppercase font-medium` | 9 | 0.22em (0.24em in panel headers, 600 weight, primary color) | ashSoft / primary |
| Micro meta | `font-mono uppercase` | 8.5–9 | 0.18em | ashSoft |
| Numbers | `font-mono tabular-nums` | 12–24 | -0.01em | paper / semantic |
| Body | `font-sans` | 12.5–13 | -0.005em | paper / paperDim |
| Label | `font-sans` 500 | 14 | -0.005em | paper |
| Display | `font-sans` 600 | 32 | -0.025em, line-height 1 | paper |
| Welcome display | `font-sans` 600 | 44–56 | -0.025em | paper |
| Subtitle | `font-sans italic` | 15–18 | 0 | paperDim |

Hard floor for the Live Room: **9px eyebrows, 11px meta, 12.5px body.** Nothing smaller exists.

### 1.3 Surface recipe (the glass)

From `FdGlassPanel` and the Forecast card:

```
background:      VANTARY.glass                       (deep: glassDeep)
border:          1px solid VANTARY.rule
border-radius:   20 (pane) · 22 (feed card) · 14 (tight) · 8 (chip) · 999 (pill)
backdrop-filter: blur(28px) saturate(150%)           (feed card: 24px)
box-shadow:      VT.cardShadow → VT.cardShadowHover on hover
inner light:     radial-gradient(circle at top right, rgba(accent,0.06→0.11 on hover), transparent 65%)
top accent:      1px strip, linear-gradient(90deg, transparent, rgba(accent,0.55), transparent)
corner brackets: FdCorners inset 10 size 9, ashSoft @ 0.7  (primary panes only)
dashed rule:     repeating-linear-gradient(90deg, rule 0 4px, transparent 4px 8px)
```

### 1.4 Motion grammar

| Moment | Recipe | Source |
|---|---|---|
| Entrance | `opacity 0→1, x ±10–18, filter blur(6px)→0`, 0.34s, ease `[0.22,0.68,0.36,1]`, stagger 0.045–0.06s | your-space, hub |
| Hover lift | `whileHover={{ y: -2 }}` + shadow deepen + inner light 0.06→0.11 | forecast-feed |
| Room sheen | one-shot 55%-wide band `linear-gradient(110deg, transparent, rgba(accent,0.30), transparent)` blur 3px, `translateX(-110% → 220%)` 1.6s `cubic-bezier(0.22,0.61,0.36,1)`, mounted only while `selfHover`, plays once | your-space rooms |
| Champagne bubbles | 6 deterministic accent orbs rising while hovered; unmount on leave; skipped on reduced motion | your-space rooms |
| Live dot | breathing primary dot (FdLiveTick) | flight-deck-primitives |
| Swap | keyed rise + deblur 0.45s | dashboard |
| Spring nav | `spring stiffness 500 damping 35` | hub |

All motion respects `prefers-reduced-motion`.

### 1.5 Layout grammar

- 8px grid. Pane padding 16–20. Section gap 20. Column gap 16.
- Corner brackets mark the four "instrument" panes of a view; secondary cards have none.
- Header of a pane = `FdPanelHeader`: eyebrow (primary, 600) · dashed rule flex-1 · hint · UTC live tick · zero-padded count.
- Numbers are the hero of any stat: eyebrow above, value 18–32 below, sub-line 9px mono under.

---

## 2. The elevated theme — "Teal Glass · Obsidian Cut"

Not a new palette. The same Teal Glass, cut deeper. Defined as a **surface + light layer** on top of `VANTARY`, expressed as new tokens in `components/live-room/live-room-tokens.ts` and reusable by every room later.

### 2.1 Three glass depths

| Depth | Use | Background | Blur | Border |
|---|---|---|---|---|
| **Veil** | The room canvas behind everything; the slide-in shell itself | `rgba(10,14,18,0.42)` | `blur(36px) saturate(165%)` | none |
| **Pane** | Instrument panes: screen, timeline, intelligence, mentor | `VANTARY.glass` | `blur(28px) saturate(150%)` | `VANTARY.rule` |
| **Recess** | Cells inside a pane: stat wells, level rows, chips | `linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))` | none | `VANTARY.ruleSoft` |

Depth is communicated by translucency, not by darkness. A recess is lighter than its pane; a pane is lighter than the veil. The eye reads "carved glass", not "stacked boxes".

### 2.2 Light

- **Top light** on every pane: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,212,191,0.07), transparent 70%)`.
- **Accent thread**: one 1px gradient strip on the top edge of a pane, fading to transparent at both ends. Its color is the pane's semantic (primary by default; emerald for a winning position; rose for LIVE; amber for risk).
- **Edge glow on focus**: `VANTARY.glow` only on the pane the user is interacting with. Never two glows at once.
- **Specular hairline**: `inset 0 1px 0 rgba(255,255,255,0.04)` — the top-edge catchlight every card in the forecast room already has.

### 2.3 Semantic color — five, no more

| Meaning | Token | Where it may appear |
|---|---|---|
| Identity / interactive / primary | `VANTARY.amber` (= primary teal) | eyebrows, active states, hairlines, chips, thread |
| Long / win / positive P&L | `VANTARY.chartUp` | numbers, direction chips, entry nodes |
| Short / loss / LIVE | `VANTARY.chartDown` | numbers, direction chips, the LIVE dot and word, exits at loss |
| Risk / warning / pending | amber `#F59E0B` via `--vt-warn` extension | risk lens, warning events, expiring |
| Neutral | `ash` ladder | everything else |

Retired from the Live Room: violet, sky blue, indigo, the red header wash, the gold "PRO" ink. If a concept previously had its own hue (Room Intelligence = violet, Stage Tools = amber, Instruments = sky), it now gets a **glyph + eyebrow**, not a color. Color is reserved for meaning.

### 2.4 Type is the ornament

The room is quiet enough that the mono eyebrows, the tabular numbers and the -0.025em display headings do the decorating. There are no decorative icons that are not load-bearing.

---

## 3. The Live Mentor Room — reconstruction

### 3.1 Same skeleton, new bones

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ROOM HEADER  ● LIVE  NY Session Live Trading  [EXECUTING] 45:01  ~waveform~   XAU +0.42  EUR −0.18  847 ◔ ⊘ LEAVE │
├──────────────────────────────┬───────────────────────────────────────────────────────────┤
│ SESSION COLUMN (40%)         │ STAGE COLUMN (60%)                                        │
│                              │                                                           │
│ ┌ MENTOR PRESENCE ─────────┐ │ ┌ SCREEN ───────────────────────────────────────────────┐ │
│ │ A  Mentor Alex ♛ ●        │ │ │ XAU/USD +0.42 H L   1m 5m [15m] 1H 4H  Candles·Line   │ │
│ │    Senior Market Strat.   │ │ │                                                       │ │
│ │ WR 78 · ACC 92 · P&L +247K│ │ │            chart with mentor-focus crosshair          │ │
│ │ ◔◔◔◔ 847 · 142 active  ▲ │ │ │            + event markers from the timeline          │ │
│ └───────────────────────────┘ │ │                                          [A] REC ●    │ │
│                              │ │ Vol OI Delta Spread     RSI 58.4      MACD +0.12      │ │
│ ┌ PHASE RAIL ──────────────┐ │ └───────────────────────────────────────────────────────┘ │
│ │ OBSERVE ✓─SETUP ✓─EXECUTE ●─REVIEW │                                                  │
│ └───────────────────────────┘ │ ┌ STAGE TOOLS ─ phase-aware verb bar ──────────────────┐ │
│                              │ │ ✦ Oracle Summary · ◎ Forecast this · ⇄ Compare Plan · ≈ Order Flow │
│ ┌ ROOM INTELLIGENCE ───────┐ │ └───────────────────────────────────────────────────────┘ │
│ │ THESIS  │ WATCH           │ │                                                           │
│ │ RISK    │ BEHAVIOR        │ │ ┌ DISCUSSION ───────────────────────────────────────────┐ │
│ │ (each: derived from N ev.)│ │ │ ● Main Stage 89 · Q&A 34 · Trade Setups 42 · Flow 27 │ │
│ └───────────────────────────┘ │ │ ┌ PINNED INSIGHT · Mentor Alex · 2:28 PM ───────────┐ │ │
│                              │ │ └───────────────────────────────────────────────────┘ │ │
│ ┌ SESSION TIMELINE ────────┐ │ │  messages …                                          │ │
│ │ +$1,240 · 1 open 1 closed │ │ │                                                       │ │
│ │ ALL 16 MENTOR 14 TRADES 2 │ │ │ CHAT · @QUESTION · #SETUP   [ Chat with the audience… ] ➤ │
│ │ ● NOW 2:42 PM             │ │ └───────────────────────────────────────────────────────┘ │
│ │ 43m ▣ THESIS UPDATE …     │ │                                                           │
│ │ 42m ▣ EXIT +$1,240 …      │ │                                                           │
│ │ 41m ▣ KEY MOMENT …        │ │                                                           │
│ │ 39m ▣ ENTRY …             │ │                                                           │
│ │ 28m ▣ MODE CHANGE …       │ │                                                           │
│ └───────────────────────────┘ │                                                           │
└──────────────────────────────┴───────────────────────────────────────────────────────────┘
```

Left = **what is happening** (session). Right = **what you see and say** (stage). The user's request — timeline left, screen right, commenting under the screen — is preserved exactly. Two changes to the organization:

1. **Room Intelligence moves up**, directly under the phase rail, above the timeline. It is the *current state*; the timeline is its *history*. Reading order becomes: who (mentor) → where in the session (phase) → what it means now (intelligence) → how we got here (timeline).
2. **Stage Tools move to the stage column**, between the screen and the discussion. Tools act on what you see and post into what is said. They are no longer a list at the bottom of a scroll.

Audience Presence and Room Pulse collapse into one **Presence strip** inside the Mentor pane (avatars · 847 · 142 active · pulse sparkline · level). Instruments in Focus become the **instrument chips in the room header** (they were already duplicated there) plus a hover-card.

### 3.2 The interconnection model — one state, three views

This is the intelligence of the room. Session Timeline, Room Intelligence and Stage Tools are not three components; they are three projections of one `SessionState`.

```
                    ┌──────────────────────────────┐
                    │        SESSION TIMELINE        │   the ledger — an ordered log
                    │   events[] (typed, timestamped)│   of everything the mentor did
                    └──────────────┬─────────────────┘
                                   │ fold (selectors)
                                   ▼
                    ┌──────────────────────────────┐
                    │      ROOM INTELLIGENCE          │   the derived present —
                    │  4 lenses computed from events  │   each lens knows which
                    │  thesis · watch · risk · behavior│  events produced it
                    └──────────────┬─────────────────┘
                                   │ read
                                   ▼
                    ┌──────────────────────────────┐
                    │         STAGE TOOLS             │   the verbs — pre-filled
                    │  phase-aware actions that       │   from the lenses; their
                    │  read lenses and emit new events│   output becomes new events
                    └──────────────┬─────────────────┘
                                   │ emit
                                   └────────────▶ back into the ledger
```

**Timeline → Intelligence (derivation rules)**

| Lens | Derived from | Stamp shown on the lens |
|---|---|---|
| **Current Thesis** | latest `thesis-update` + open `entry` events not yet closed by `exit`; entry zone / target / invalidation / R:R come from the entry event's fields | "from THESIS UPDATE 2:43 PM · 3 events" |
| **What to Watch** | active `level-call` events whose level has not been swept/hit; ordered by proximity to price | "2 levels armed · from LEVEL CALL 2:31 PM" |
| **Current Risk** | active `warning` events + scheduled macro events within the session window + open position exposure (size × distance to stop) | "MEDIUM · FOMC in 2h · from WARNING 2:10 PM" |
| **Key Behavior** | pattern across `key-moment` + `bias-shift` events in the current phase; the most recent one is the headline | "Accumulation · 15m · from KEY MOMENT 2:41 PM" |

**Intelligence → Timeline (navigation)**

- Hover a lens → its source events **light up** in the timeline (node ring brightens to primary, card gets the accent thread), and the screen draws the lens's levels as horizontal lines on the chart.
- Click a lens → the timeline scrolls to the most recent source event and the filter chips temporarily select that event's category. Click again to release.
- Each lens carries a **freshness ring** (MicroRing primitive) that fills as time passes since the source event; a stale lens (>30 min in EXECUTE) fades to ashSoft. Freshness is the honest signal a live room needs.

**Timeline → Screen**

- Every event has a time; the chart is a time axis. Hovering an event places a **marker** on the chart at that candle (a 1px vertical hairline + the event glyph in the margin). Entry/exit markers stay permanently as small triangles with the fill color of the outcome.
- The `NOW` cursor at the top of the timeline is the same instant as the right edge of the chart. One clock.

**Phase → Tools (what is foregrounded)**

| Phase | Foregrounded tools | Why |
|---|---|---|
| OBSERVE | Oracle Summary · Forecast this | You are building a view; summarize what the mentor sees, convert it into a forecast card |
| SETUP | Compare Plan · Forecast this | You have a plan; check alignment with the mentor's thesis before execution |
| EXECUTE | Order Flow · Compare Plan | Trades are live; watch flow, keep checking divergence |
| REVIEW | Oracle Summary (recap) · Send to Journal | Session is closing; produce the debrief |

Non-foregrounded tools remain visible at reduced opacity and are still usable. The rail never hides an action; it ranks it.

**Tools → Timeline (what they write back)**

| Tool | Reads | Emits |
|---|---|---|
| **Oracle Summary** | the whole event log + lenses | a `system` event "Summary generated" + a summary card in Discussion (Main Stage) and a fifth, temporary lens **Catch Me Up** at the top of Intelligence |
| **Forecast this** | Current Thesis lens (symbol, direction, entry zone, target, invalidation → entry/stop/target/R:R) | opens the Forecast composer (the existing forecast contract) pre-filled; publishing emits `forecast-published` and drops a forecast card into Trade Setups |
| **Compare Plan** | Current Thesis + the viewer's Daily Gameplan (`daily-gameplan.tsx` data) | an alignment chip on the Thesis lens (ALIGNED / DIVERGENT with the reason) and a `system` event "Plan compared" |
| **Order Flow** | the Order Flow discussion room + screen | switches the screen overlay to flow mode; the Key Behavior lens starts reading flow deltas |

**Discussion ↔ Timeline**

- The mentor (or moderator) can **pin a message to the timeline**: it becomes a `key-moment` event with the message as body. This is how the discussion feeds the ledger.
- A question can **reference an event**: composing in @QUESTION mode with an event focused adds a "re: ENTRY 2:39 PM" chip to the message.
- Reactions on a timeline event ("52 reacted") are the same reactions as the discussion's; one count.

### 3.3 Pane-by-pane specification

#### Room header (sticky, 44px)

`● LIVE` (rose dot breathing + the word in mono 9/0.22em rose) · session name (font-sans 14/500 paper) · phase badge (mono 9, primary chip; EXECUTING gets emerald) · elapsed `45:01` (mono 12 tabular, ashSoft; client-only after mount) · audio waveform (5 bars, primary at 0.55) · flex-1 · instrument chips (`XAU/USD +0.42%` mono 10, emerald/rose by direction, chipFill background) · viewers `847` with Users glyph · mute · `LEAVE` ghost pill. One hairline below: `VANTARY.rule`. No gradient wash. The 2px red bar is retired; the LIVE state lives in the dot and the word only.

#### Mentor Presence pane (primary pane, corner brackets)

Avatar 44px (primary-ink square, 14px radius, initial in primary) with a small rose dot + mic glyph at the corner while speaking · name 16/600 with crown glyph and online dot · role 11 ashSoft · three stats to the right in the stat grammar (eyebrow `WR` / value `78%` mono 18; `ACC 92%`; `P&L +$247K` emerald) · star + bookmark ghost buttons. Second row = **Presence strip**: 4 overlapping avatar coins + `847` · `142 active` · flex-1 · pulse sparkline (TinySparkline, primary) · `HIGH` label. On hover, this pane plays the one-shot room sheen and the champagne bubbles — the only pane that does. It is the human in the room; it gets the life.

#### Phase rail

Four nodes joined by a 1px dashed rule. Completed = primary ring with check; active = filled primary node with a breathing halo (`VANTARY.glow`) and the label in paper; upcoming = ashGhost ring. Labels mono 9/0.22em. Beneath, a tiny mono line: `EXECUTE · 17m · trades are live`. The rail is derived from `mode-change` events; the active node is clickable and scrolls the timeline to the mode-change that started the phase.

#### Room Intelligence pane (primary pane, corner brackets)

`FdPanelHeader` eyebrow `ROOM INTELLIGENCE` · hint `DERIVED FROM 16 EVENTS` · live tick. Body: 2×2 lenses, each a **Recess** cell (radius 14):

- glyph in a 28px recess square (Target / Eye / AlertTriangle / Activity) · title 13/500 · confidence chip (`HIGH` primary chip, `MEDIUM` amber, `LOW` ash) top-right
- one-sentence body 12.5 paperDim, 2 lines max, text-pretty
- 2–3 fact rows: eyebrow left (`ENTRY ZONE`) · value right mono 11.5 paper (`2033.50 – 2035.80`), separated by `ruleSoft`
- footer: freshness MicroRing (12px) + `from THESIS UPDATE · 2:43 PM` mono 8.5 ashSoft

Hover: lift −2, inner light, and the cross-highlight into the timeline and chart described in 3.2. The **Current Risk** lens is the only one allowed an amber accent thread; it is the one that should interrupt.

When **Oracle Summary** runs, a fifth lens **Catch Me Up** appears above the grid full-width for the session (dismissible), with the summary in 3 bullets and a `GENERATED 2:44 PM` stamp.

#### Session Timeline pane (primary pane, corner brackets)

`FdPanelHeader` eyebrow `SESSION TIMELINE` · count `16` · trailing collapse chevron. Sub-header **ledger strip** (Recess): `RUNNING P&L +$1,240` (emerald, mono 18) · `1 OPEN · 1 CLOSED` · flex-1 · `16 events` · `5 key`. Filter chips: `ALL 16 · MENTOR 14 · TRADES 2 · LEVELS 4 · WARNINGS 1` — chipFill, active = chipFillHi + chipBorder.

The rail: a 44px left gutter holding relative time (`43m`, mono 9 ashSoft) and the **event node** — a 26px recess square with the event glyph, connected by a 1px dotted vertical rule (`ruleSoft`). Node accent by *meaning only*: entry = emerald, exit = emerald/rose by P&L, warning = amber, everything else = primary. No violet, no sky.

The event card (Recess, radius 14): `EVENT TYPE` eyebrow (mono 9/0.22em, node accent) · instrument chip · crown glyph if mentor-authored · time right (mono 9 ashSoft) · body 12.5 paper · optional fact rows (P&L well: mono 14 emerald in a chipFill well) · footer `52 reacted` + a thin reaction meter (primary at 0.35). Mode-change cards show `Setup ⇄ Execution` as two chips with an arrow.

The `● NOW 2:42 PM` head has a rose dot; the phase-boundary dividers (`SETUP PHASE · 28m`) are a centered mono chip on a dashed rule.

**New events arrive with a seal**: the node ring strokes in (0.3s), then the card rises +6→0 with blur 6→0. The ledger strip's P&L animates via `AnimatedStat`. Nothing else moves.

#### Screen pane (primary pane, corner brackets — the stage)

Header row: `SCREEN SHARE` eyebrow + `LIVE` rose chip · flex-1 · `XAU/USD 15m` mono · expand. Chart toolbar (Recess bar): symbol pill · `+0.42%` emerald · `H 2038.40 L 2029.10` · flex-1 · timeframe segmented control (`1m 5m [15m] 1H 4H`) · chart type (`Candles · Line · Heikin`) · indicator legend (EMA 9 / EMA 21 / VWAP — primary at three opacities, not three hues).

The chart itself keeps the existing `ScreenShareView` logic. Overlays: the mentor-focus crosshair with a `Mentor focus` chip; the timeline event markers (3.2); the lens level lines while a lens is hovered. Bottom-right: mentor cam coin (48px, primary ring, `● REC` mono 8.5 rose). Under the chart: the metrics rail `Vol 12.4K · OI +2.1K · Delta +340 · Spread 0.3` and two compact indicator wells (RSI bar segments in primary, MACD histogram in emerald/rose).

#### Stage Tools bar

A single Recess bar under the screen: four verbs as chips `✦ ORACLE SUMMARY · ◎ FORECAST THIS · ⇄ COMPARE PLAN · ≈ ORDER FLOW`, mono 9/0.18em, glyph 14px. Phase-foregrounded tools at full opacity with chipBorder; others at 0.55. Hover: lift −1 and a short hint under the bar (`Prefilled from Current Thesis · XAU/USD long 2034.20 → 2042`). Click opens the tool as an **inline sheet** that slides down between the bar and the discussion (0.34s, blur entrance) — never a modal, never leaves the room.

#### Discussion pane

Tabs as chips with live counts: `● Main Stage 89 · Q&A 34 · Trade Setups 42 · Order Flow 27`; the active tab gets chipFillHi and a 1px primary underline. Pinned insight = a Recess card with a left accent thread (primary), `PINNED INSIGHT` eyebrow, author row (avatar 22 · name · MENTOR chip · instrument chip · time), body 13. Messages: avatar 24 · name 12/500 · role chip · time mono 9 · body 12.5; mentor messages get the accent thread; questions get a `?` glyph; system lines are centered mono 9 ashSoft. Composer: mode chips `CHAT · @QUESTION · #SETUP` above a full-width pill input (glass, `VANTARY.rule` border, 44px) with a primary send button. When an event is focused, a `re: ENTRY 2:39 PM` chip sits inside the input.

### 3.4 Responsive rules

- ≥1280: 40/60 columns as drawn.
- 1024–1279 (the user's 1158 viewport): 42/58; Intelligence lenses stay 2×2; the screen toolbar wraps timeframe under symbol.
- <1024: single column in this order — header · screen · tools · intelligence (2×2) · timeline · discussion; the discussion composer is sticky at the bottom.
- <640: lenses stack 1×4; the timeline gutter shrinks to 36px; corner brackets are dropped.

---

## 4. The whole Discord section — organization of every block

Same shell logic; new skin and a cleaner hierarchy. Nothing is removed.

### 4.1 The slide-in shell

- The shell is a **Veil**: `rgba(10,14,18,0.42)` + `blur(36px) saturate(165%)`, so the app behind is felt, not seen — the same transparency the 4-rooms nav has.
- Entrance from the right: `x 24→0, opacity 0→1, blur 8→0`, 0.38s, ease `[0.22,0.68,0.36,1]`. The floating left-edge live tab (already correct) remains the trigger.
- Shell header (one row): `● LIVE · PREMIUM · 03 LIVE` eyebrows left · room name centered (`Whale Room ◇ PREMIUM`, font-sans 16/500) with `UTC · 00:34 · 142 ONLINE` mono under · notifications + close right. No gradient wash.

### 4.2 DESKS rail (72px)

Five 44px coins (WR / CE / GM / NY / MH), initials mono 12/600, primary-ink fill, `VANTARY.rule` ring; active desk = primary ring + `VANTARY.glow`; a live desk carries a rose dot. `+` ghost coin at the bottom. Hover shows the desk name as a tooltip chip to the right (existing spring 500/35).

### 4.3 Room navigator (260px)

Top card (**Pane**): `LIVE · INSTITUTIONAL FLOW · 01` eyebrow · `Whale Room ◇` 18/600 · `2,403 MEMBERS · 3 NEW` mono. Then the **LIVE NOW** card: `45m IN` mono 18 · session name 14/500 · `MENTOR ALEX` eyebrow · `847 LISTENING` · `JOIN ›` primary pill — the only filled button in the navigator.

Nav rows (`Gameplan 01 NEW · Entries 03 OPEN · Rankings · Call history 07 LOGGED · Dashboard PRO`): 36px rows, glyph 14 ashSoft → primary on active, label 13/500, trailing count in mono 9 primary. Active row = chipFill background + a 2px primary bar on the left edge. Section labels (`SIGNALS · 04 — 01`, `WAR ROOMS · 02 — 02`) are `FdEyebrow` with a dashed rule. War room channels (`# short-btc-scalp · 2h LEFT`) are the same rows with a `#` glyph and an amber time when <1h. `DEPLOY · Open a war room · LOCKED` is a ghost row.

Footer **OPERATOR** card (Recess): `OPERATOR · TIER 02 · 03 OPEN` eyebrow · `You` 14/500 + online dot · `LANE` · `72.4% WIN` / `+8.4% PNL` mono 14 · settings glyph.

### 4.4 The other views (same tokens, one pass each)

| View | Organization |
|---|---|
| **Daily Gameplan** | Instruments as Pane cards in a 2-col grid; each: symbol 18/600 · bias chip · `DAILY EQ / DAILY FVG / H4 SUPPLY / KEY SUPPORT` fact rows · `IN-PLAY / COMPLETED / INVALIDATED` status chips. Header = `FdPanelHeader` with the date and `COMPARE WITH LIVE THESIS` (this is the Compare Plan tool from the other side). |
| **Entries** | A ledger table in the forecast-card grammar: member · instrument · direction chip · entry/stop/target mono · status chip (`LIVE` emerald, `PENDING` primary, `TP HIT` emerald, `SL HIT` rose, `CLOSED` ash) · R. Row hover lift. |
| **Rankings** | Podium of 3 Pane cards, then rows; `ACCURACY / WIN RATE / AVG RR / VOLUME` as the stat grammar; `TO TOP 5` as a progress bar (ProgressBar primitive). |
| **Call history** | Past sessions as horizontal Pane cards: date · mentor · `NET P&L` mono 18 · `PEAK VIEWERS` · `EVENTS` · highlights as event chips (same node glyphs as the timeline) — clicking opens the recorded timeline in the Live Room layout, read-only. |
| **Dashboard** | The analytics blocks (`EXPECTANCY · AVG WIN · AVG LOSS · AVG R:R · CONSISTENCY · CURVE SMOOTHNESS · AUDIENCE ENGAGEMENT`) in the Flight Deck gadget grammar: eyebrow · value · sub · sparkline/ring. Trend words (`Improving / Balanced / Declining`) as chips. |
| **Member profile** | Already exists in the forecast grammar (screenshot 3); reuse `forecast-my-record.tsx` patterns directly: identity card · TRACK RECORD 2×2 · RECENT CALLS list. |
| **Notifications** | Rows in the timeline event-card grammar. |

---

## 5. Implementation architecture

### 5.1 New namespace, zero risk to the old files

`components/live-room/` (new). The old `community-panel/mentor-stage.tsx` is not edited; `floating-community-hub.tsx` swaps one import when the new room is ready. Old files are deleted only after the swap is verified.

```
components/live-room/
  live-room-tokens.ts        LR = Obsidian-cut tokens on top of VANTARY/VT (veil, pane, recess, thread, warn)
  live-room-primitives.tsx   LrPane · LrRecess · LrEyebrow · LrChip · LrStat · LrThread · LrFreshnessRing
                             (composes FdCorners, FdPanelHeader, FdDashedRule, MicroRing, TinySparkline)
  session-state.ts           SessionEvent types · SessionPhase · lens selectors (deriveThesis, deriveWatch,
                             deriveRisk, deriveBehavior, derivePhase) · tool registry (phase weights)
  session-store.tsx          <SessionProvider> · useSession() · useFocusedEvent() · useHoveredLens()
                             — the single shared state the three views project from
  room-header.tsx
  mentor-presence.tsx
  phase-rail.tsx
  intelligence-lenses.tsx
  session-timeline.tsx  ·  timeline-event.tsx
  stage-screen.tsx           (ports ScreenShareView; adds markers + level lines from the store)
  stage-tools.tsx  ·  tool-sheet.tsx
  stage-discussion.tsx  ·  stage-composer.tsx
  live-room.tsx              the composition (two columns, responsive rules)
```

### 5.2 Data

Phase 1 runs on the existing demo constants (`MENTOR`, `SESSION`, `SESSION_TIMELINE`, `FOCUS_BLOCKS`, `DISCUSSION_FEED`, `AUDIENCE`, `STAGE_TOOLS`) moved into `session-state.ts` as a seed — but the lenses are **computed from the events**, not hard-coded, so the moment real events arrive from a room transcript table the room is already correct. This aligns with the beta gap analysis: the room transcript/message table is a later milestone, and this design does not block on it.

### 5.3 Hydration

All clocks, elapsed timers and "x min ago" values render as a fixed placeholder on the server and tick only after mount (`useEffect` + `useSyncExternalStore` guard). This closes the current hydration error.

### 5.4 Accessibility

Panes are `<section aria-labelledby>`; the timeline is an `<ol>` with `aria-live="polite"` on the NOW region; lenses are buttons (they navigate); tool chips are `role="toolbar"`; the phase rail is a `<nav aria-label="Session phase">`. Reduced motion disables sheen, bubbles, breathing and blur entrances; layout is unaffected.

### 5.5 Phases

1. **Live Room** — tokens, primitives, store, and the full room (3.1–3.4). Swap into the hub for the `live-stage` view. Verify at 1158×937 and 390 wide.
2. **Shell** — veil, header, DESKS rail, navigator, OPERATOR (4.1–4.3).
3. **Views** — Gameplan, Entries, Rankings, Call history, Dashboard, Profile, Notifications (4.4), one per pass.
4. **Retire** — delete `community-primitives.tsx` and the old stage; confirm zero references.

### 5.6 Acceptance criteria (Phase 1)

- Zero literal RGB triplets in `components/live-room/*`; switching the Vantary theme recolors the room.
- No text below 9px; body ≥12.5px.
- Hover a lens → ≥1 timeline event highlights and ≥1 level line draws on the chart. Click a timeline event → the chart marker and its lens pulse.
- Phase change reorders tool emphasis; `Forecast this` opens prefilled from the Thesis lens.
- Pinning a discussion message creates a `key-moment` event in the timeline.
- No hydration warning on load; build passes; type errors in the new namespace = 0.
- Screenshots at 1158 and 390 show the two-column and single-column layouts as specified.

---

## 6. What I decided without asking (as instructed)

- Intelligence above the timeline, tools under the screen — because state should be read before history and verbs should sit on the stage they act on.
- One color per meaning, five meanings total; the violet/sky/red section identities are dead.
- Audience Presence + Room Pulse merged into the Mentor pane; Instruments merged into the header. Fewer panes, same information.
- The freshness ring on each lens — a live room must show how old its intelligence is.
- The `Catch Me Up` transient lens as the visible output of Oracle Summary.
- Event ↔ chart markers — the timeline and the screen share one clock, so they should share one axis.
- The hydration fix is in scope of Phase 1; a luxury room cannot open with an error banner.

---

# MASTERPLAN II — The Workspace (Sep 2026)

Owner directive: "the tool pop-ups open under the screen and I have to scroll — the room should be a workspace: one card on the left that swaps in place, the screen as the hero, draggable panes, nothing scrolls." Approved choices: chat = bottom dock under the screen · theater mode auto-on entering the room · <880px = slide-over drawer · layout remembered per device.

## 7. Shape

```
RoomHeader (48px · THEATER key · ⌘\)
└─ WorkspaceRoot (.lr-root · container lr · never scrolls)
   ├─ INSPECTOR  40% · min 300px · max 55%      ┃ draggable
   │  ├─ InspectorDeck   8 keys in two rows      ┃
   │  │    INSTRUMENTS  Breakdown 7/7 · Intelligence 04 · Timeline 16 · Anatomy +0.6R   (1–4)
   │  │    TOOLS        Order flow · Compare · Oracle · Forecast (phase-lit dot)          (Q W E R)
   │  │    status line · crown hairline lit under the pressed column
   │  └─ InspectorStage ONE card: HomeCard (mentor + phase + ledger) | instrument | ToolPanel
   └─ STAGE
      ├─ StageScreen  fills · chart takes every spare px · TransportBar 34px
      │                (LIVE/REPLAY clock · Pulse micro-bars · tape) → TransportDrawer
      │                slides UP OVER the chart: ReplayScrubber + PulseLane + RSI/MACD
      ┃ draggable (disabled while the dock is folded)
      └─ Talk dock    StageDiscussion dock (feed flex-1, composer pinned) | TalkHandle 44px
```

## 8. Store contract
- `inspector: { kind: "home" } | { kind: "instrument", id } | { kind: "tool", id }` + `inspectorOrigin` (slide direction). ONE action `{ type: "inspector", to, toggle? }` — same card again = home.
- Verbs: `openInstrument`, `openTool_`, `goHome`, `revealEvent(id)` (focus + open timeline + scroll to `[data-lr-event]`). `openTool` is still exposed (derived) for older readers.
- Cross-pulls: `toggleLens` → Intelligence card, `toggleNode` → Breakdown card, Oracle run → Intelligence, Forecast publish → Timeline. `scrollToEvent()` now dispatches `lr:reveal-event`; the room listens and opens the timeline card first.
- `react-resizable-panels` — `autoSaveId` `lr:split-h` / `lr:split-v` (+ `lr:talk-collapsed`, `lr:theater` booleans via `useLayoutMemory`). Double-click a divider = defaults (40/60 · 62/38).

## 9. Theater
`floating-community-hub.tsx`: `theaterOn = activeView === "live-stage" && theater` folds the DESKS rail (78→0) and the 244px navigator (244→0) with framer width tweens; the header THEATER key / ⌘\ toggles. Room gets the whole shell.

## 10. Narrow (< 880px container)
Inspector panel unmounts → `InstrumentRail` (44px, 8 icon keys + home) + `InspectorDrawer` portal (86% width ≤ 420px, scrim, ESC, focus trap, outside tap) sized to the ROOM rect (not the window — the hub is a transformed ancestor).

## 11. Measured
`inspect-spacing` on the deck: sibling gaps 8/8/8, group inner 4, key padding 0/8, badge 4/8 — every value on the 4-scale (before: 0/0/0/0/4 + off-scale 6/10). 1440 · 1728 · 1398-in-hub · 390: root scrollHeight == clientHeight, 0 horizontal overflow, 0 truncated key labels (compact labels under 400px deck). Screen header container queries: H/L ≥720, chart-type ≥880, eyebrow+LIVE chip hidden <520 (the transport bar says LIVE).
