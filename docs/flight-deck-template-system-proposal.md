# Flight-Deck Template System — Proposal

**Status:** Draft for partner review (pre-approval)
**Author:** v0
**Surface:** Vantary Dashboard → Flight-Deck Cockpit (Market Floor / The Studio / Mentor Hall / Review Room)
**Anchors in current code:**
`components/dashboard/vantary/your-space.tsx` (rooms + destinations),
`components/dashboard/vantary/vantary-modules.tsx` (Oracle engine + answer deck),
`components/dashboard/vantary/oracle-data.ts` (mentors, peers, command catalog, smart-suggestion engine),
`components/dashboard/vantary/oracle-command-console.tsx` (input dropdown).

---

## 1. Executive summary

The Flight-Deck cockpit gives the trader sixteen entry points (four rooms × four destinations) and an "Ask Anything" console above them. Today, those sixteen buttons either route to nowhere or route into a single generic Oracle answer — they collapse the user's *intent* into one shape. That is the gap. We propose a **Template System**: sixteen reusable, structured templates — one per destination — that share a single visual grammar (the flight-deck doctrine we just shipped) but each carry their own inputs, slots, and result rendering.

The hero example is **Mentor Hall → Compare Mentors**. Today, clicking it dispatches the string `"compare mentors for me"` into the Oracle and returns a generic "top mentors ranked by fit" answer. We will replace that with a real *picker → context → answer* flow: choose 2–4 mentors (from your follow list, your group, or a search), choose comparison axes (time of day, swing vs day, instruments, win-rate band, archetype, R:R band, drawdown discipline, session focus), and the Oracle deck renders a comparison answer that **structures identically every time** the trader asks a comparison question — only the contents differ. This is the reusable contract we want to land on.

The core bet: **the templates are universal in shape, contextual in content.** That is what makes the Oracle answers feel deterministic, drillable, and trustworthy, instead of feeling like a chat surface where the user has to re-learn the layout every time. It is also what gives the AI a stable IO contract, which makes scoring, caching, and offline replay cheap later.

We will ship in three phases: T1 the contract + the marquee Compare Mentors template; T2 the remaining fifteen templates wired into the cockpit; T3 the personalisation layer (saved comparisons, pinned templates, share/export).

---

## 2. The problem we're solving

Three observed problems in the current build:

**2.1 The cockpit buttons are decorative.** The destinations in `FLIGHT_DECK_ROOMS` (`your-space.tsx` ~9614) define `onSelect` handlers but the production wiring is sparse. A trader who hovers "Compare Mentors" sees a tooltip ("Side-by-side performance and style audit") and a keyboard hint ("9"), and on click expects a real comparison flow — they get either nothing or a string fed into the Oracle.

**2.2 The Oracle has one shape for every question.** `generateOracleResult()` (`vantary-modules.tsx` ~10934) returns a single `OracleResult` shape with `framing / highlights / insight / evidence / nextMoves`. That is great as a *frame*, but every category (MENTOR, MACRO, STATISTICS, PSYCHOLOGY…) collapses into the same five-block render. There is no "compare two things" shape, no "checklist" shape, no "schedule" shape — the trader cannot tell from the layout alone what kind of answer they're looking at.

**2.3 No state survives the question.** A trader who compares Picasso vs Girard cannot pin that comparison, cannot share it, cannot return to it after a coffee, and cannot ask a *follow-up* without losing the previous frame. Each answer is a one-shot.

The Template System fixes all three by inverting the model: instead of "free text → generic answer," it becomes "**intent button → guided template → structured answer**" with the free-text Oracle still available for the unbounded case.

---

## 3. The proposal in one frame

> Every cockpit destination opens a **Template** — a small, named, well-typed scaffold that asks the trader for the exact inputs needed to produce a high-quality answer, then renders that answer through the Oracle deck using a category-specific layout.

Three properties make a template a template:

| Property        | What it means                                                             | Why it matters                                                                          |
| --------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Reusable**    | Same template handles every variant of the same question.                 | Picasso vs Girard, Cohen vs Takeda, four-way mentor compare — one template, three runs. |
| **Structured**  | Inputs are typed slots; output is a typed render plan.                    | The deck always looks the same, so the user learns it once.                             |
| **Composable**  | Templates can call sub-templates and emit follow-ups that open templates. | "Compare mentors" can drill into "Mentor profile" without leaving the deck.             |

The template is the contract. The Oracle is the engine. The flight-deck is the chrome.

---

## 4. The sixteen-destination template map

The four rooms keep their psychological flow (OBSERVE → CREATE → LEARN → REFLECT). Each destination becomes a named template with a stable id, an input schema, and a render hint that maps to one of six layout archetypes.

### 4.1 Market Floor — "What's happening right now"

| Destination        | Template id                | Input schema                                                                                                          | Layout archetype       | Output spine                                                                                              |
| ------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| **Signal Room**    | `tpl.market.signal_stream` | `{ scope: "all"\|"following"\|"group", filter?: { pairs[], sessions[], mentorIds[] } }`                               | `MISSION_FEED`         | Streaming list of live signals: mentor · pair · direction · entry · stop · target · age · status pip      |
| **Forecast Room**  | `tpl.market.forecast_grid` | `{ pairs?: string[], sessions?: string[], horizon?: "intraday"\|"swing"\|"position", confidence?: "low"\|"med"\|"hi" }` | `MISSION_GRID`         | Bento of forecast cards: pair · bias · confidence · invalidator · author · age                            |
| **Live Charts**    | `tpl.market.live_charts`   | `{ pairs: string[], timeframes: ("1m"\|"5m"\|"15m"\|"1h"\|"4h"\|"D")[], indicators?: string[] }`                       | `WORKSPACE`            | Chart workspace. No deck — opens the chart surface directly. (Template still owns the picker.)            |
| **News Wire**      | `tpl.market.news_wire`     | `{ scope: "watchlist"\|"all", impact?: "high"\|"med"\|"low", windowMin?: number }`                                    | `MISSION_FEED`         | Filtered news rail: time · impact · ccy · headline · expected vs actual · directional read               |

### 4.2 The Studio — "Make something today"

| Destination          | Template id                  | Input schema                                                                                                                 | Layout archetype | Output spine                                                                                |
| -------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| **Create Forecast**  | `tpl.studio.forecast_create` | `{ pair: string, bias: "long"\|"short"\|"neutral", entry?: number, stop?: number, target?: number, rationale: string, charts?: ChartRef[], visibility: "public"\|"group"\|"private" }` | `COMPOSER`       | Composer with chart picker, bias toggle, R:R calculator, rationale editor, audience picker. |
| **Publish Signal**   | `tpl.studio.signal_publish`  | `{ pair, direction, entry, stop, target, sizing?: number, lifecycle: "scalp"\|"intraday"\|"swing", visibility }`             | `COMPOSER`       | Composer + R:R preview + broadcast preview ("how it will look in the Signal Room").         |
| **Journal Entry**    | `tpl.studio.journal`         | `{ entryType: "decision"\|"reflection"\|"setup_review"\|"mistake_log", linkedTrade?: TradeRef, linkedSignal?: SignalRef, body: string, mood?: 1-5, sleep?: 1-5 }` | `COMPOSER`       | Free-form composer + emotional state sliders + auto-link to today's open positions.         |
| **Build Setup**      | `tpl.studio.setup_builder`   | `{ name, archetype: "ICT"\|"SMC"\|"Wyckoff"\|"PA"\|"Macro", entryRules: Rule[], exitRules: Rule[], filters: Filter[], examples?: ChartRef[] }` | `BUILDER`        | Stepper that compiles a setup spec, can backtest later.                                     |

### 4.3 Mentor Hall — "Learn from the best"

| Destination          | Template id              | Input schema                                                                                                                                                                                                                         | Layout archetype | Output spine                                                                                |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------- |
| **Compare Mentors**  | `tpl.mentor.compare`     | `{ subjects: MentorRef[2..4], axes: ComparisonAxis[], scope: "all"\|"following"\|"group"\|"search", since?: ISODate }`                                                                                                              | `COMPARISON`     | The marquee. See §6.                                                                        |
| **Mentor Library**   | `tpl.mentor.library`     | `{ filters: { archetype?, sessions?, pairs?, winRateBand?, tier?, languages? }, sort: "fit"\|"winrate"\|"mentees"\|"newest", scope: "all"\|"following"\|"group" }`                                                                  | `DIRECTORY`      | Searchable index card grid: monogram · name · archetype · win-rate · session · "follow" CTA |
| **Replay Sessions**  | `tpl.mentor.replays`     | `{ mentorIds?: string[], pairs?: string[], sessionType?: ("call"\|"breakdown"\|"live")[], windowDays?: number }`                                                                                                                    | `MISSION_FEED`   | Replay list with thumbnail · title · mentor · duration · key moments timestamps             |
| **Insights Vault**   | `tpl.mentor.insights`    | `{ scope: "mine"\|"following"\|"all", topic?: string, mentorIds?: string[], format?: ("quote"\|"clip"\|"chart"\|"checklist")[] }`                                                                                                  | `MISSION_GRID`   | Curated insights bento: quote/clip/chart card with attribution and "save" CTA               |

### 4.4 Review Room — "Look at yourself"

| Destination            | Template id                 | Input schema                                                                                                                                              | Layout archetype | Output spine                                                                                |
| ---------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| **Today's Stats**      | `tpl.review.today`          | `{ accountIds?: string[], includeOpen?: boolean }`                                                                                                        | `DASHBOARD`      | Day card: PnL · #trades · win-rate · best/worst · session breakdown · open exposure         |
| **Performance Audit**  | `tpl.review.performance`    | `{ window: "7d"\|"30d"\|"90d"\|"YTD"\|"custom", accountIds?: string[], by?: "pair"\|"session"\|"setup"\|"hour" }`                                         | `DASHBOARD`      | Deep audit: PF · DD · expectancy · MAE/MFE · time-in-market · leakage by axis              |
| **Risk Audit**         | `tpl.review.risk`           | `{ window, accountIds?: string[] }`                                                                                                                       | `DASHBOARD`      | Drawdown profile · exposure stack · max-loss-day · streak risk · correlation cluster       |
| **Schedule Review**    | `tpl.review.schedule`       | `{ mentorId?: string, slotPreference?: "morning"\|"midday"\|"after-close", reviewType: "trade"\|"week"\|"month"\|"setup" }`                              | `BOOKING`        | Calendar picker · mentor selector · review-type picker · confirm + ICS export               |

### 4.5 The six layout archetypes

Every template renders through one of these six archetypes. This is what gives the system its "I've seen this layout before" property:

1. **`MISSION_FEED`** — vertical list of items with route IDs, status pips, time stamps. Used for streams (signals, news, replays).
2. **`MISSION_GRID`** — bento of cards with magnitude/precision numerals + dashed top edges. Used for lookup-style answers (forecasts, insights).
3. **`COMPARISON`** — N-column matrix with axis rows. Used for compare-X-to-Y answers (mentors, peers, sessions, weeks).
4. **`DIRECTORY`** — searchable, filterable index. Used for browsing (Mentor Library).
5. **`COMPOSER`** — input-heavy create surface with preview pane. Used for studio templates.
6. **`DASHBOARD`** — multi-tile audit surface (telemetry quad + advisory sheets + schedule matrix). The default Oracle deck.

Plus two specialised archetypes:

7. **`WORKSPACE`** — opens an external surface (charts). Template owns input picker only.
8. **`BOOKING`** — calendar-driven; has its own state machine.

---

## 5. Universal template anatomy

Every template, regardless of archetype, decomposes into the same seven concerns. This is the contract surface.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TEMPLATE ANATOMY                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  1. IDENTITY      id, room, label, archetype, hotkey                    │
│  2. PRELUDE       eyebrow, mission line, live tick on/off               │
│  3. INPUTS        typed input schema + defaults + validators            │
│  4. PICKER UI     the form surface that collects inputs                 │
│  5. RESOLVER      pure (inputs, world) → RenderPlan                     │
│  6. RENDER PLAN   the typed output shape consumed by the deck           │
│  7. FOLLOW-UPS    template_id + inputs of the suggested next templates  │
└─────────────────────────────────────────────────────────────────────────┘
```

**5.1 Identity** is a 5-field record kept in `templates/registry.ts`. The id is dotted (`tpl.mentor.compare`) so we can group, log, and route by prefix.

**5.2 Prelude** is the cockpit briefing strip — eyebrow code, optional query echo, optional live tick. This is the Mission Briefing Panel we already shipped, parameterised.

**5.3 Inputs** are typed via `zod` schemas. Every template exports `inputSchema: z.ZodSchema<TInput>`. Defaults are derived from the trader's current state (`DAILY_PLAN.focusPairs`, `accountIds`, etc.). Validators run on submit and inline as the user fills the picker.

**5.4 Picker UI** is the form surface that fills the inputs. This is the surface that pops up when the user hovers and clicks. It can be:
- a popover docked under the destination button (small templates, e.g. News Wire impact filter),
- a modal overlay (medium templates, e.g. Performance Audit window picker),
- a full-bleed sheet (large templates, e.g. Compare Mentors with multi-mentor search).

The picker is itself a flight-deck surface — same dashed rules, same magnitude/precision numerals, same corner registration marks. This keeps the chrome continuous.

**5.5 Resolver** is a pure function `resolve(inputs, world) → RenderPlan` that runs in `lib/templates/resolvers/*`. It pulls from the same data layer the Oracle already uses (ACCOUNTS, DAILY_PLAN, MENTORS, PERFORMANCE) plus any new sources we add. It does *no* I/O at MVP — purely synchronous over in-memory data. We can swap that out for an async resolver against a real API later without changing any UI.

**5.6 Render plan** is a discriminated union keyed by archetype:

```ts
type RenderPlan =
  | { kind: "MISSION_FEED";  prelude: Prelude; rows: FeedRow[]; followUps: FollowUp[] }
  | { kind: "MISSION_GRID";  prelude: Prelude; cards: GridCard[]; followUps: FollowUp[] }
  | { kind: "COMPARISON";    prelude: Prelude; subjects: Subject[]; axes: ComparisonAxisRow[]; verdict?: Verdict; followUps: FollowUp[] }
  | { kind: "DIRECTORY";     prelude: Prelude; items: IndexCard[]; facets: Facet[]; followUps: FollowUp[] }
  | { kind: "COMPOSER";      prelude: Prelude; fields: Field[]; preview?: PreviewPane; followUps: FollowUp[] }
  | { kind: "DASHBOARD";     prelude: Prelude; mission: MissionBriefing; quad: TelemetryQuad; advisory: AdvisorySheet[]; matrix: ScheduleMatrix; bay: DestinationBay; followUps: FollowUp[] }
  | { kind: "WORKSPACE";     prelude: Prelude; surfaceUrl: string; followUps: FollowUp[] }
  | { kind: "BOOKING";       prelude: Prelude; calendar: CalendarSpec; mentors: MentorRef[]; followUps: FollowUp[] }
```

The `DASHBOARD` archetype's spine is exactly the Oracle deck we just shipped (Mission Briefing → Telemetry Quad → Advisory Sheets → Schedule Matrix → Destination Bay → Drill-Forward Rail). That deck *is* a render plan.

**5.7 Follow-ups** are typed pointers to other templates with pre-filled inputs:

```ts
type FollowUp = { templateId: string; inputs: unknown; label: string }
```

Example: from `tpl.mentor.compare`, the resolver emits:

```ts
followUps = [
  { templateId: "tpl.mentor.replays",   inputs: { mentorIds: ["cohen","alvarez"] },         label: "Replay both" },
  { templateId: "tpl.review.performance", inputs: { window: "30d", by: "pair" },              label: "My 30d by pair" },
  { templateId: "tpl.market.signal_stream", inputs: { scope: "following", filter: { mentorIds: ["cohen"] } }, label: "Cohen's live signals" },
]
```

So drilling forward never breaks the cockpit grammar — every drill is itself a template.

---

## 6. Deep-dive: `tpl.mentor.compare` (the marquee)

This is the template the partner needs to feel viscerally. It is the proof that the system works.

### 6.1 Trigger surfaces

The same template is reachable through three paths:

1. **Cockpit click** — Mentor Hall → Compare Mentors → opens picker sheet.
2. **Quick prompt** — `Cmd+K → "compare mentors"` → opens picker sheet.
3. **Free-text Oracle** — typing "compare picasso vs girard" → router parses subjects → opens template with subjects pre-filled, picker shows just axis selection.

All three paths converge on the same picker, the same resolver, and the same render plan. That convergence is the whole point.

### 6.2 Picker sheet layout

A full-bleed sheet that opens with a flight-deck slide. Three bands top-to-bottom:

```
┌─ MISSION BRIEFING ───────────────────────────────────────── UTC 14:23:11 ─┐
│ COMPARE MENTORS                                                            │
│ Pick 2–4 mentors, choose what you care about, get a structured side-by-    │
│ side. Defaults read your live focus pairs and sessions.                    │
├─ BAND 1 · SUBJECTS ────────────────────────────────────────────────────────┤
│  [Following ▾] [Group ▾] [All Library ▾] [Search ↗]                         │
│                                                                            │
│  Selected (2 of 4):                                                        │
│   ┌─[DC] Daniel Cohen ─ ICT ─ 71% WR ─────── ✕ ┐                          │
│   ┌─[MA] Mateo Álvarez ─ SMC ─ 68% WR ─────── ✕ ┐                          │
│  + Add another                                                             │
├─ BAND 2 · AXES ────────────────────────────────────────────────────────────┤
│  Suggested for you (reads your state):                                     │
│   [✓] Time-of-day overlap   [✓] Session focus   [✓] Pairs traded           │
│   [✓] Win-rate band         [ ] Avg R:R         [ ] Sample size            │
│   [ ] Style archetype       [ ] Mentee scale    [ ] Tier                   │
│                                                                            │
│  Or pick a preset:                                                         │
│   [Style audit] [Schedule fit] [R:R + risk] [Edge by pair]                  │
├─ BAND 3 · SCOPE ───────────────────────────────────────────────────────────┤
│  Window: [Last 30d ▾]   Confidence: [Verified only ▾]                       │
│  Render as: [Side-by-side] [Layered overlay] [Tournament]                   │
├────────────────────────────────────────────────────────────────────────────┤
│ [Cancel]                                                  [Run comparison] │
└────────────────────────────────────────────────────────────────────────────┘
```

Visual treatment carries the doctrine: dashed rules between bands, route IDs (B01, B02, B03) on each band, breathing pip on the active band, magnitude/precision numerals on the win-rate readouts on selected mentor chips. Calibration corners frame the whole sheet.

### 6.3 The four sources for "Subjects"

The picker exposes four clearly-labelled scopes, each backed by a different data view:

| Scope         | Data source                                                                                  | Default sort               |
| ------------- | -------------------------------------------------------------------------------------------- | -------------------------- |
| **Following** | The trader's followed mentor list (currently a derived selection over `MENTORS`).            | Most-engaged-with first    |
| **Group**     | The trader's community group's mentor roster (joins through the community membership table). | Group-pinned first         |
| **All Library** | The full `MENTORS` list, with paging.                                                       | Fit score (`mentorFitScore`) |
| **Search**    | Text-fuzzy search across name, archetype, signature, pairs, sessions.                        | Relevance                  |

Each scope shows the same `MentorIndexCard` chip — monogram, name, archetype, win-rate, sample-size, "follow" status pip. Selecting a chip moves it into the "Selected" tray. Constraints: minimum 2, maximum 4 (the matrix renders best at 2/3/4 columns; 1 just opens the single-mentor profile template instead).

The scope tabs are *additive*: a trader can grab one mentor from Following, one from Group, and search a third by typing "girard" — the selected tray collects them all.

### 6.4 The eight comparison axes (v1)

| Axis id          | Label                | What it produces in the matrix                                          | Source                                          |
| ---------------- | -------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| `time_of_day`    | Time-of-day overlap  | UTC heatmap row per mentor, with the trader's hour band overlaid        | mentor session telemetry (proxy: `specialitySessions`) |
| `session_focus`  | Session focus        | London / NY AM / NY PM / Tokyo split as bar row                         | `specialitySessions`                            |
| `pairs_traded`   | Pairs traded         | Pair chips per mentor, common pairs highlighted                         | `specialityPairs`                               |
| `win_rate`       | Win-rate band        | Magnitude/precision numeral + sample-size disclosure                    | `winRate`, `sampleSize`                         |
| `avg_rr`         | Average R:R          | Magnitude numeral with delta vs trader's R:R                            | `averageRR`                                     |
| `style`          | Style archetype      | Archetype chip (ICT, SMC, Wyckoff, Macro, PA, Algo) with one-line desc  | `archetype`, `signature`                        |
| `scale`          | Mentee scale         | Mentee count with growth pip                                            | `mentees`                                       |
| `tier`           | Subscription tier    | free / pro / premium chip                                                | `tier`                                          |

We pick eight to start because we already have eight fields on `MentorProfile`. Adding new axes later is purely additive — declare an `AxisDef` and the matrix renders it. A v2 set adds `swing_vs_day` (derived), `instrument_class` (FX/indices/metals/crypto, derived from `specialityPairs`), `discipline_score` (derived), `live_signal_density` (per-day signal volume), `replay_depth` (replay count and avg length), `community_pull` (engagement rate).

### 6.5 The "auto-populate" presets

Four named presets that pre-tick a curated axis set + scope. These map to the natural sentences a trader would say:

- **Style audit** → axes `style + win_rate + avg_rr + pairs_traded`, scope All Library, render Side-by-side. The "what's the difference between an ICT trader and a Wyckoff trader" preset.
- **Schedule fit** → axes `time_of_day + session_focus`, scope Following, render Layered overlay. "Who fits my hours."
- **R:R + risk** → axes `avg_rr + win_rate + scale`, render Tournament. "Who wins the math."
- **Edge by pair** → axes `pairs_traded + win_rate + session_focus`, render Side-by-side. "Who's the EUR/USD specialist."

These are the templates *within* the template — they teach the trader how to think about comparison without forcing them to know the axis taxonomy.

### 6.6 The render plan for `COMPARISON`

```ts
type ComparisonRenderPlan = {
  kind: "COMPARISON"
  prelude: { eyebrow: "MENTOR · COMPARE"; query?: string; liveTick: true }
  subjects: Array<{
    ref: { id: string; name: string; monogram: string }
    accent: string                  // amber / teal / chartUp / chartDown — assigned by index
    headline: { value: string; suffix?: string; tone?: "ok"|"warn"|"bad" }  // win-rate hero
    chips: Chip[]                   // archetype, tier, mentees…
  }>
  axes: Array<{
    axisId: string
    label: string                   // "TIME-OF-DAY OVERLAP"
    cells: Array<{
      subjectIdx: number            // 0..n
      kind: "magnitude" | "chips" | "bar" | "heatmap" | "delta" | "verdict"
      payload: unknown              // typed per kind
      tone?: "ok"|"warn"|"bad"
      anchorCrossKey?: string       // pair anchors light up across the deck
    }>
  }>
  verdict?: {
    title: string                   // "Best fit for your London / EUR-USD focus: Daniel Cohen"
    body: string                    // 1–2 sentences
    runner: string                  // "Mateo Álvarez within 6%"
    confidence: number              // 0–100
  }
  followUps: FollowUp[]             // see §5.7
}
```

The deck renders this as: prelude header → subject row (one column per mentor with its accent) → axis rows (each axis is a hairline-separated row, like Schedule Matrix) → verdict ribbon at the bottom in the brick-red/amber-wash advisory style → drill-forward rail. Visually it is the cockpit grammar with one new piece — the subject row at the top.

### 6.7 The natural-language path

When a trader types `"compare my current mentor picasso to girard"` into the Oracle bar, we route through a thin intent parser:

```ts
parse(query) → {
  templateId: "tpl.mentor.compare",
  inputs: {
    subjects: [matchMentor("picasso"), matchMentor("girard")],   // fuzzy match against MENTORS + group + library
    axes: defaultAxesForUser(),                                  // from getSmartSuggestions state
    scope: subjects.every(found) ? "following" : "all",
  }
}
```

The parser already has the building blocks: `fuzzyScore` in `oracle-data.ts` handles the name match; the smart-suggestion engine in `getSmartSuggestions` handles the default axes; the rest is glue. The Oracle then opens the picker with the inputs pre-filled and the picker auto-runs after 600ms unless the trader edits — same UX as the current console, just deterministic.

### 6.8 Why this is the marquee

Because it lights up every property of the system at once: multi-source picker, typed inputs, preset curation, deterministic resolver, structured render plan, follow-ups that drill forward, natural-language entry, and a layout that feels native to the cockpit. If we get this one right, the other fifteen templates are pattern-matching against it.

---

## 7. Data model and file layout

```
components/dashboard/vantary/templates/
  registry.ts                    // id → TemplateDef, used by router + cockpit
  types.ts                       // Template, RenderPlan, FollowUp, axes, archetypes
  router.ts                      // free-text → templateId + inputs (NL parser)
  resolvers/
    mentor/
      compare.ts                 // tpl.mentor.compare — pure resolver
      library.ts                 // tpl.mentor.library
      replays.ts                 // tpl.mentor.replays
      insights.ts                // tpl.mentor.insights
    market/
      signal-stream.ts
      forecast-grid.ts
      live-charts.ts
      news-wire.ts
    studio/
      forecast-create.ts
      signal-publish.ts
      journal.ts
      setup-builder.ts
    review/
      today.ts
      performance.ts
      risk.ts
      schedule.ts
  pickers/
    PickerShell.tsx              // common sheet/popover/modal frame with cockpit chrome
    AxisChips.tsx                // reusable axis multi-select
    ScopeTabs.tsx                // Following / Group / All / Search tabs
    MentorPickerSheet.tsx        // tpl.mentor.compare picker
    WindowPicker.tsx             // 7d/30d/90d/YTD/custom (used by review templates)
    AccountFilter.tsx
  archetypes/
    ComparisonDeck.tsx           // renders RenderPlan{kind:"COMPARISON"}
    MissionFeedDeck.tsx
    MissionGridDeck.tsx
    DirectoryDeck.tsx
    ComposerDeck.tsx
    DashboardDeck.tsx            // wraps the existing Oracle deck
    WorkspaceDeck.tsx
    BookingDeck.tsx
```

`templates/types.ts` is the single source of truth. Every resolver is a pure function exported as default. Every picker is a controlled React component that emits `onRun(inputs)`. Every archetype deck consumes a `RenderPlan` and nothing else.

Boundaries:

- **Resolvers know about data, not React.** They live in `lib/`-style territory inside `templates/resolvers/`. They can be tested with plain unit tests; no DOM needed.
- **Pickers know about React, not data heuristics.** They render the input form and call `resolve(inputs)` on submit.
- **Archetype decks know about layout, not inputs.** They consume `RenderPlan` only.

This separation is what lets the Oracle's natural-language parser, the cockpit's button click, and the `Cmd+K` console all converge on the same render — they share resolvers and decks, only the picker differs.

---

## 8. Wiring into the existing flight deck

Three integration points; all surgical.

**8.1 Cockpit destinations.** Each entry in `FLIGHT_DECK_ROOMS` (`your-space.tsx` ~9614) gains a `templateId: string` field. The `onSelect` handler becomes:

```ts
onSelect: () => openTemplate(templateId, { source: "cockpit" })
```

`openTemplate(id, ctx)` is a hook (`useTemplateRouter`) that mounts the picker for that id, computes default inputs from world state, and on submit hands the result plan to the deck.

**8.2 Oracle Command Console.** Each `CommandItem` in `COMPARE_COMMANDS / ANALYZE_COMMANDS / QUICK_COMMANDS` (`oracle-data.ts`) gains an optional `templateId`. When present, clicking the row opens the picker instead of submitting the raw query string. Items without a `templateId` keep the existing free-text Oracle behaviour, so we ship templates incrementally.

**8.3 Free-text submit.** `submit(q)` in `vantary-modules.tsx` (~11433) gains a router pre-pass:

```ts
function submit(q: string) {
  const route = templateRouter.parse(q)
  if (route) return openTemplate(route.templateId, { source: "oracle", inputs: route.inputs })
  // fall back to the legacy generic Oracle answer
  setResult(generateOracleResult(q))
}
```

The router is opt-in: any query that doesn't match a registered intent falls through to the legacy engine. We never lose the unbounded "ask anything" behaviour.

The deck shell stays exactly as we just rebuilt it. The Oracle deck (`OracleBody`) becomes the renderer for the `DASHBOARD` archetype only; the other seven archetypes get their own decks (`ComparisonDeck`, `MissionFeedDeck`, etc.). All seven decks share the same primitives — `FdCorners`, `FdLiveTick`, `FdMagnitude`, `FdRangeRing`, `FdPanelHeader`. No new design vocabulary.

---

## 9. Design language inheritance

Templates inherit the cockpit doctrine wholesale. No new tokens, no new fonts, no new accents. Specifically:

- **Fonts:** the same two — sans for body and titles, mono for eyebrows, route IDs, ticks, status codes. No third.
- **Magnitude/precision numerals** for every hero number in every archetype.
- **Dashed rules** between every band, every section, every header.
- **Calibration corners** on every panel-shell surface (picker sheets, decks, modal overlays).
- **Live UTC tick** on every header; second-tick driven by the shared `useUTCSecondClock`.
- **Route IDs** on every list (S01, R01, B01…) — picker bands also get them so the cockpit grammar carries through input collection, not just output.
- **Breathing status pips** on anything that's "live" — selected mentor chips, live signal rows, active band.
- **VANTARY tokens** unchanged. Color picker on the upper-left still drives every accent.

The only new piece of vocabulary is the **subject row** in `COMPARISON` decks — N columns of subject identity at the top. Each subject gets one accent assigned from `[amber, teal, chartUp, chartDown]` in selection order, so the trader can scan the whole matrix by colour.

---

## 10. Phased build plan

We propose three short phases. Each phase ends with something demoable.

### Phase T1 — Contract + Marquee (the spine)

Goal: prove the system on one template, end-to-end.

- `templates/types.ts` + `registry.ts` + `router.ts` (core contract).
- `pickers/PickerShell.tsx` + `pickers/MentorPickerSheet.tsx` + `pickers/AxisChips.tsx` + `pickers/ScopeTabs.tsx`.
- `resolvers/mentor/compare.ts` (pure, against `MENTORS`).
- `archetypes/ComparisonDeck.tsx`.
- Cockpit wiring: `Mentor Hall → Compare Mentors` opens the new picker.
- Oracle wiring: free-text "compare X to Y" parses to the template.

**Demo:** click Compare Mentors, pick Cohen + Álvarez + the "Schedule fit" preset, see the `COMPARISON` deck render with the cockpit grammar. Then type *"compare cohen to takeda on R:R"* into the Oracle and watch it open the same picker pre-filled.

### Phase T2 — The other fifteen (breadth)

Goal: every cockpit destination becomes a template.

- The remaining four archetype decks (`MISSION_FEED`, `MISSION_GRID`, `DIRECTORY`, `DASHBOARD`).
- Composer surfaces (`COMPOSER`) — re-uses the existing Studio composers, refactored to consume `RenderPlan{kind:"COMPOSER"}`.
- Resolvers for Market Floor (4), Studio (4), Mentor Hall (3 remaining), Review Room (4).
- Pickers per template — each one is small (window picker, account filter, scope tabs).
- Oracle command catalog gets `templateId` on every applicable item.

**Demo:** every cockpit button opens a picker. Every picker resolves to a deck. The trader can navigate the whole platform without typing once.

### Phase T3 — Personalisation + persistence (polish)

Goal: make templates feel like the trader's own.

- Saved comparisons (pin a `tpl.mentor.compare` instance with subjects + axes).
- Pinned templates on the cockpit ("most-used last 7d" appears as a fifth row).
- Share/export a deck (image + permalink).
- Telemetry on template usage — drives future smart-suggestion ranking.

**Demo:** trader pins their weekly "Cohen vs Álvarez on R:R" comparison; it shows up under the cockpit as a one-click re-run.

---

## 11. Risks, open questions, and decisions for partner

**11.1 Router false positives.** The natural-language parser will sometimes mis-route ("compare apples to oranges" → mentor compare with no subjects found). Mitigation: when the parser matches a template id but cannot satisfy the input schema, we open the picker with whatever it could resolve and let the user finish the inputs — never run a half-resolved template.

**11.2 Axis explosion.** Eight axes for compare-mentors in v1; we have a v2 set of six more. Risk: the picker becomes a wall of checkboxes. Mitigation: presets first, "more axes" disclosure second; never show all axes flat.

**11.3 Group / following data.** We currently have `MENTORS` only — we do not yet have a "your group" or "you follow these" data layer. Decision needed: is that data fabricated for now (dashboard-data.ts gets a `FOLLOWED_MENTORS = ["mentor.cohen", "mentor.alvarez"]`) or do we stand up the persistence skill first? Recommend: fabricate for T1, stand up Supabase tables for T2 — keeps the first demo fast.

**11.4 Workspace + booking archetypes.** `Live Charts` (`WORKSPACE`) and `Schedule Review` (`BOOKING`) don't render through the Oracle deck. They are templates in the sense that the picker collects inputs, but the output is a different surface (chart workspace, calendar). Decision needed: do we treat those as full templates (registry-tracked) or as cockpit-direct shortcuts that bypass the system? Recommend: full templates, because the picker still lives in the cockpit grammar — only the output surface is different.

**11.5 Naming.** "Template" is a generic word. We may want a brandable name for the system — e.g. "Vantary Briefings", "Decks", "Missions". Recommend deferring naming until T1 demo; the user-facing word will reveal itself.

**11.6 Performance.** Resolvers are synchronous over in-memory data at MVP. Risk: when we move to async (real APIs), the picker has to handle pending state. Mitigation: render plan can include a `loading` flag; decks already have a flight-deck telemetry-scan loader (the one we shipped) — drop it into any deck during fetch.

**11.7 Versioning.** As soon as we ship templates, we have a contract surface that other systems consume. Risk: changing axis ids or input schemas later breaks pinned comparisons. Mitigation: `tpl.mentor.compare@v1` notation in registry, with a migrator from old → new schemas.

**11.8 Mobile.** Picker sheets at 768px and below. Recommend: Compare Mentors picker collapses to a vertical stack with the bands stacked, the matrix renders 1-column-per-mentor scrollable horizontally with dashed left edge to suggest more is off-screen.

---

## 12. What we need from partner

- **Sign-off on the sixteen-destination map (§4)** — names, ids, and which archetype each maps to.
- **Sign-off on the eight-axis v1 set (§6.4)** — additions, removals, renames before we lock the schema.
- **Decision on §11.3 (group/following data)** — fabricate vs persist.
- **Decision on §11.4 (workspace/booking)** — registry-tracked vs cockpit-direct.
- **Naming preference (§11.5)** — "Templates" stays internal, what's the user-facing word.
- **Approval to start T1.**

If T1 lands by next review, T2 is mostly mechanical and T3 is product-led. The whole system ships in three short cycles and replaces every dead button on the cockpit with a real, structured surface that reads like the rest of the flight deck.

---

## Appendix A — Example utterances → template routing table

| Trader types …                                                  | Routes to                       | Inputs filled from query                                     | Picker shows                              |
| --------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| "compare my current mentor picasso to girard"                   | `tpl.mentor.compare`            | `subjects: [picasso, girard]`                                | Axis selection only                       |
| "who's the best mentor for my london sessions"                  | `tpl.mentor.compare`            | `axes: [session_focus, win_rate]`, `scope: "all"`            | Subject selection only                    |
| "show me cohen and takeda on R:R"                               | `tpl.mentor.compare`            | `subjects: [cohen, takeda]`, `axes: [avg_rr]`                | Confirm + run                             |
| "compare this week to last week"                                | `tpl.review.performance`        | `window: "7d"`, with comparison flag                         | Account picker only                       |
| "today's stats"                                                 | `tpl.review.today`              | (defaults)                                                   | Auto-runs                                 |
| "live signals"                                                  | `tpl.market.signal_stream`      | `scope: "following"`                                         | Auto-runs                                 |
| "live signals only ICT mentors"                                 | `tpl.market.signal_stream`      | `scope: "all"`, `filter: { archetype: ["ICT"] }`             | Auto-runs                                 |
| "publish a long EUR/USD signal"                                 | `tpl.studio.signal_publish`     | `pair: "EUR/USD"`, `direction: "long"`                       | Composer with pair + direction pre-filled |
| "book a setup review with cohen next tuesday"                   | `tpl.review.schedule`           | `mentorId: "cohen"`, `reviewType: "setup"`, slot date hint   | Calendar with mentor + type pre-filled    |
| "anything I should know about EUR/USD this week"                | (no match)                      | —                                                            | Falls through to legacy Oracle            |

The legacy Oracle remains the catch-all. Every utterance that can be matched to a template benefits from the structure; everything else still gets the unbounded answer.

---

## Appendix B — TypeScript contract sketch

```ts
// templates/types.ts

export type Archetype =
  | "MISSION_FEED" | "MISSION_GRID" | "COMPARISON"
  | "DIRECTORY" | "COMPOSER" | "DASHBOARD"
  | "WORKSPACE" | "BOOKING"

export interface TemplateDef<TInput, TOutput extends RenderPlan> {
  id: string                          // "tpl.mentor.compare"
  room: "market" | "studio" | "mentors" | "review"
  label: string                       // "Compare Mentors"
  hotkey?: string                     // "9"
  archetype: Archetype
  inputSchema: ZodSchema<TInput>
  defaults: (world: WorldState) => TInput
  resolve: (inputs: TInput, world: WorldState) => TOutput
  Picker: React.FC<{ inputs: TInput; onChange: (i: TInput) => void; onRun: () => void; onCancel: () => void }>
}

export type RenderPlan =
  | MissionFeedPlan | MissionGridPlan | ComparisonPlan
  | DirectoryPlan | ComposerPlan | DashboardPlan
  | WorkspacePlan | BookingPlan

export interface FollowUp {
  templateId: string
  inputs: unknown
  label: string
}
```

```ts
// templates/registry.ts
import { compareMentors } from "./resolvers/mentor/compare"
// …

export const TEMPLATES = {
  "tpl.mentor.compare":  compareMentors,
  "tpl.mentor.library":  mentorLibrary,
  "tpl.mentor.replays":  replays,
  "tpl.mentor.insights": insights,
  // … 12 more
} as const

export type TemplateId = keyof typeof TEMPLATES
```

```ts
// templates/router.ts
export function parse(query: string): { templateId: TemplateId; inputs: unknown } | null {
  const q = query.toLowerCase()
  if (/(compare|vs|versus|side[\s-]by[\s-]side).*(mentor|coach|teacher)|\b\w+\s+vs\s+\w+\b/.test(q)) {
    const subjects = extractMentorRefs(q)
    return { templateId: "tpl.mentor.compare", inputs: { subjects, axes: defaultAxesForUser(), scope: "all" } }
  }
  if (/today|today's stats|today's pnl/.test(q)) return { templateId: "tpl.review.today", inputs: {} }
  // …
  return null   // legacy Oracle handles the rest
}
```

The router is small, pure, and additive. New rules are one line each.

---

*End of proposal. Ready for partner review.*
