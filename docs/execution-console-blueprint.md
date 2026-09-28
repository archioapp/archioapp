# ArchioAI Live Execution Console — Product & Design Blueprint

> **Document type:** Senior product/design specification (the "why" behind every pixel).
> **Companion to:** `docs/execution-console-masterplan.md` (the architectural/engineering plan).
> **Status:** Blueprint for approval. **No code until Phase 1 is approved. No live order
> execution until simulation, safety, and the TradeLocker contract are signed off.**
>
> **Confirmed product decisions (locked):**
> 1. Mounts as a new `execution-console` right-side slot **variant** — Active Windows stays;
>    Console is modular enough to *become* the default rail later.
> 2. **Per-user** broker connections, encrypted, server-only. Live execution is
>    **feature-flagged** and guarded.
> 3. Simulation runs on a **real dedicated sim-account model**, not just fixtures
>    (fixtures only seed the first demo).
> 4. AI Trade Check ships behind a **clean heuristic + interface contract** so the real
>    ArchioAI endpoint plugs in later with **zero UI refactor**.

---

## 0. Grounding — what already exists (verified in code)

This blueprint is built on shipping infrastructure, not a greenfield guess.

| Existing system | File(s) | What it gives us |
|---|---|---|
| **Trading Desk bay** | `vantary/trading-desk/{shell,side-slot,provider,data}.tsx` | Chart envelope + `SideSlot` that already swaps 10 module variants, `split / chart-only / stacked / minimized` layouts, drag-resize, hover-peek, pin-to-split, `localStorage` persistence. |
| **Side-slot registry** | `trading-desk/data.ts`, `modules/registry.ts` | Typed module registry with `implemented` flags, favorites, deck order. `ai-copilot`, `pending-orders`, `risk-meter`, `daily-max` already declared as stubs — the Console is their real implementation. |
| **Active Window panel** | `active-window/index.tsx` | Current rail content (session/day intelligence). Console becomes a **peer**, switchable via rail tabs. |
| **Trade Forge prototype** | `copilot/trade/TradeExecutionPanel.tsx` (599 lines) | A working static ticket (buy/sell, lot stepper, SL/TP pips, RR presets, account cards, risk %). **We harvest the logic, not the visual language.** |
| **Flight Deck instrument kit** | `cartouche/{gadget-inspector,instruments}.tsx`, `inspectors/*` | Verified premium grammar: portal overlay, `RadialGauge / AreaSpark / VaultNumber / Donut / Heatstrip / KillzoneClock`, reduced-motion-safe. Console reuses it so it reads as one system. |
| **VANTARY theme** | `vantary-theme.ts` | Single source of truth for institutional dark + teal-glass. No new palette. |
| **Telemetry / risk** | `dashboard-data.ts`, `useTraderTelemetry()` | Equity, FTMO drawdown headroom, daily plan (trades/loss used vs max), goals. Risk engine reads these like the Risk Envelope gadget already does. |
| **DB + auth** | Supabase (connected) | Broker-token references, sim accounts, order journal, audit log. |

**Design consequence:** the Console is the long-promised *real* version of the
`pending-orders / risk-meter / ai-copilot` slot family, expressed through the Flight Deck
grammar and VANTARY theme, mounted in the existing chart shell's right rail.

---

## 1. Product North Star

### 1.1 One sentence
**The Execution Console is the single surface where a trader turns an idea into a live,
risk-correct order — and the moment ArchioAI stops being an analytics dashboard and becomes
a trading cockpit.**

### 1.2 Why it matters
Every other screen in ArchioAI is *retrospective or observational* — it tells the trader
what happened or what is happening. The Console is the only **forward-acting** surface: it
is where money is actually committed. That makes it:

- **The highest-stakes screen in the product.** A bug here costs real capital, not a
  re-render. The entire design is therefore risk-first, not feature-first.
- **The strongest retention hook.** A trader who *executes* from ArchioAI lives inside
  ArchioAI. Analytics can be replicated; the execution+intelligence loop is the moat.
- **The proof of the brand promise.** "AI trading cockpit" is marketing until the trader
  can feel an AI co-pilot sitting between their impulse and their broker.

### 1.3 The core belief
> A trader's worst money is made in the **last ten seconds before the click** — wrong size,
> no stop, revenge after a loss, trading into news, breaching a prop limit. Charts tell you
> *what*. The Console governs the *whether, how big, and are-you-sure*.

So the product's job is not "place orders fast." It is **"place only good orders, calmly,
with full awareness of consequence."** Speed is a feature; restraint is the product.

### 1.4 What success feels like
The trader opens the Console and feels three things in sequence:
1. **Gravity** — "this is the real thing, money is about to move."
2. **Control** — "the system already knows my account, my limits, my plan; I am not doing
   mental math under pressure."
3. **Partnership** — "something intelligent looked at this with me before I committed."

If we nail those three feelings, we win. Everything below serves them.

---

## 2. Final UX Philosophy

### 2.1 Five design laws (every decision defers to these)

1. **Risk is the protagonist, price is the supporting actor.**
   On a TradingView ticket, price/quantity dominate and risk is an afterthought you compute
   yourself. We invert it. The **risk envelope is the largest, most alive element**;
   quantity is *derived from* risk, not typed in. You don't choose lots — you choose how
   much you're willing to lose, and the Console computes the lots.

2. **Calm by default, dangerous on demand.**
   The resting state is quiet, dark, breathing slowly. Danger (oversize, no stop, breach,
   live mode) is the *only* thing allowed to use heat, motion, and saturation. Because calm
   is the baseline, danger is impossible to miss — it is the only loud thing on screen.

3. **Progressive disclosure of consequence.**
   Show what's needed to make *this* decision; hide the rest until it's relevant. An empty
   draft shows account + symbol. A sized draft reveals the risk engine. A risk-valid draft
   unlocks preview. Live execution is hidden behind a deliberate, physical gesture. Nothing
   dangerous is ever one stray click away.

4. **The interface earns trust by refusing.**
   A console that lets you do anything is a dumb tool. Ours **says no** — greys out execute,
   locks the live toggle, blocks on breach — and *always explains why in one human
   sentence*. Refusal with a reason is the most premium, most institutional behavior we can
   ship. It is the difference between a toy and a desk.

5. **One material, one light source.**
   Everything is the same teal-tinted smoked glass lit from a single soft top-left source.
   No competing card styles, no second accent family. Coherence *is* the luxury signal.

### 2.2 How it protects the trader (the safety psychology)
- **Friction is placed surgically**, not everywhere. Browsing, sizing, and previewing are
  frictionless. The *single* high-friction moment is the live commit — a hold-to-execute
  gesture that forces a half-second of presence. Friction where it matters reads as
  seriousness, not as a slow app.
- **The system carries the cognitive load.** Position size, R-multiple, % of account, daily
  headroom, and breach proximity are all computed and shown. The trader is freed to make the
  *judgment* (is this a good trade?) instead of the *arithmetic* (how many lots?). Removing
  arithmetic under pressure is the single biggest mistake-reducer we can build.
- **Loss is always expressed in money first, then everything else.** "$420" lands harder
  and truer than "0.42 lots" or "1.0%". Dollars are the unit of consequence; we lead with
  them everywhere.
- **The plan is present but not preachy.** The trader's own pre-committed daily plan (max
  trades, max loss) sits in the periphery and only steps forward when about to be violated.
  We enforce the trader's *own* rules, not ours — which makes the enforcement feel like
  self-discipline, not nannying.

### 2.3 How it fits ArchioAI
The Console adopts three existing ArchioAI signatures so it never feels like a third-party
bolt-on: the **Flight Deck instrument kit** (same gauges/numbers), the **inspector overlay
grammar** (same portal/scrim/tab choreography for the full-screen confirm), and the
**VANTARY teal-glass theme** (same material). A user who has used the dashboard will feel
instantly at home — and a user who starts at the Console will recognize the dashboard.

---

## 3. Right Rail Experience

### 3.1 Mounting model (decision #1, locked)
The Console is registered as a new module in the existing side-slot registry:
`execution-console`. It does **not** remove Active Windows. The right rail gains a slim
**module switcher** (a vertical or top tab strip) so the same physical rail can show either
*Active Windows* (observe) or *Execution Console* (act), plus the other slot variants.

Rationale: zero regression, fully reversible, and it satisfies "modular enough to replace
Active Windows later" — promotion is just changing the default `slotId`.

### 3.2 Opening it
- **From the chart bay:** the rail is already present in `split` layout. The user taps the
  **Execute** tab in the module switcher; the current rail content cross-fades to the
  Console (200ms, glass-blade slide from the right edge). The chart does not move or resize —
  the rail simply re-skins its contents. This is the key anti-regression promise: **switching
  to Execute never reflows the chart.**
- **From a gadget / symbol:** clicking "Trade this" on a symbol-aware surface opens the rail
  in Execute mode pre-seeded with that symbol. The Console animates in already knowing the
  instrument — instant "it understood me" moment.
- **From keyboard:** a single shortcut (e.g. `E`) toggles Execute mode when the bay is
  focused. Power users never touch the mouse to arm the Console.

### 3.3 Living beside the chart (layout choreography — reuses existing mechanics)
- **Split** (default): chart left, Console right, draggable divider. The Console has a
  comfortable min-width so the risk engine never crushes; below that the divider snaps.
- **Peek:** when the rail is minimized, hovering the right edge slides the Console out as a
  translucent overlay *above* the chart without committing layout — a glance, not a move.
  Mouse-leave retracts it. Great for "what's my headroom right now?" without losing chart.
- **Pin:** the user pins the peek to convert it into a committed split. Pin state persists.
- **Minimize / chart-only:** the Console collapses to a thin spine showing only the **state
  pip** (a single colored dot: grey disconnected / teal sim / amber live-ready / red blocked)
  and live P&L if a position is open. The trader can run chart-only and still see, in their
  peripheral vision, the one fact that matters: am I safe, and am I up or down.
- **Mobile / narrow:** the rail becomes a bottom sheet with the same vertical section order;
  the chart sits above. Hold-to-execute maps to a long-press. The state machine is identical.

### 3.4 Persistence
Layout, pinned state, last active module, and the divider position persist via the existing
`vantary.trading-desk.v3` store. The Console adds its own namespaced keys for draft drafts
and connection preference. Reopening the desk restores the trader exactly where they left.

### 3.5 The rail's emotional job
The Active Windows panel is **contemplative** (study the session). The Console is
**operative** (commit to a trade). Switching tabs should feel like switching *posture* —
from leaning back to leaning in. We signal this with a subtle shift: when Execute is active,
the rail's ambient motion slows and deepens (a heartbeat), the header gains a thin
top-edge light, and the background tints almost imperceptibly toward the live/sim accent.
The room doesn't change; the *mood* does.

---

## 4. Execution Console Screen Design (top → bottom)

The Console is a single vertical column of "stations." Each station is a glass plate. The
trader descends the column the way a pilot descends a pre-flight checklist — and stations
below the current decision are visually *dimmed and locked* until earned.

### Station 0 — The Status Crown (always visible, pinned top)
A slim header band that is the **single source of truth for mode and safety**. It carries:
- **Mode token**: `DISCONNECTED` / `SIMULATION` / `LIVE` — a pill whose color *is* the
  Console's entire accent for that session (grey / teal / amber-gold). The whole panel's
  highlights inherit this color, so the trader's environment literally changes color when
  they go live. You always know, peripherally, which world you're in.
- **Account identity**: name, balance, and a breathing equity micro-spark.
- **The safety pip**: the one dot that survives even in minimized mode.
- **Live arming control** (locked by default — see §6).

Feeling: *orientation*. Before anything else, "where am I and is it safe."

### Station 1 — Account Selector
A horizontally-scrollable set of account cards (live broker accounts + the sim account),
each showing balance, currency, drawdown headroom as a thin `RadialGauge` arc, and a
connection health dot. The selected card breathes gently; others are quiet.
- Switching account **re-derives everything below** (position size, headroom, limits).
- The sim account is visually distinct (teal hatch edge) so it can never be confused with
  live money.

Feeling: *grounding*. "This is the capital I'm working with."

### Station 2 — Instrument & Direction
- **Symbol selector**: searchable, with the current bid/ask and spread shown live, plus a
  tiny sparkline of the last N minutes. Spread is shown because spread is a cost the trader
  forgets — surfacing it is a small act of honesty.
- **Direction**: two large segmented controls, **BUY** (teal) and **SELL** (rose). They are
  intentionally big and tactile — direction is a decision, not a dropdown. Selecting one
  warms that side and cools the other.

Feeling: *intent*. "Here is the instrument and the side I believe in."

### Station 3 — The Risk Engine (the protagonist, largest station)
This is the heart. It does **not** ask "how many lots?" It asks **"how much are you willing
to lose?"** and computes the rest.
- **Primary input = risk**, expressed two ways that stay in sync: a **dollar amount** (lead)
  and a **% of account** (secondary). A short row of presets (0.25% / 0.5% / 1% / 2%) plus a
  fine stepper.
- **Stop distance** drives the math: the trader sets the stop (by price, by pips, or by
  dragging on the chart later). Risk ÷ stop distance ÷ contract value = **position size**,
  shown as a **`VaultNumber`** that rolls when it changes. The lot size is an *output*,
  rendered slightly smaller than the risk input — a deliberate hierarchy statement.
- **The live risk meter**: a large `RadialGauge` showing this trade's risk against the
  trader's *remaining daily loss headroom* (from their daily plan). As risk grows, the arc
  fills and warms; crossing thresholds (e.g. >50% of remaining headroom) shifts it amber,
  >100% slams it red and **locks execution**. This gauge pulses subtly when it is in a
  warning zone — the only element allowed to demand attention.

Feeling: *consequence made tangible*. "I can see, physically, how much of my safety budget
this one trade consumes."

### Station 4 — Stop / Target / R-Multiple Ladder
- **SL and TP** inputs (price or distance), each showing the **dollar value at that level**
  ("-$420" / "+$840") next to it — never just a number.
- **The RR ladder**: a vertical scale with entry in the middle, SL below, TP above, drawn to
  scale. The R-multiple (e.g. **2.0R**) is the headline. Dragging TP animates the ladder and
  re-prices the reward in real time. RR presets (1:1, 1:2, 1:3) snap the TP.
- A quiet line of truth: *"Risking $420 to make $840."* Symmetry of language with the risk
  station, so the trade reads as a sentence, not a form.

Feeling: *proportion*. "Is what I stand to gain worth what I'm risking?"

### Station 5 — AI Trade Check (see §7 for full UX)
A calm, collapsed-by-default plate that, when expanded, shows the AI's read: a **posture**
(Aligned / Caution / Conflicted — never "BUY NOW"), 2–4 concrete observations tied to the
trader's *own* data (plan, streak, session, recent behavior), and a confidence band. It is
advisory and clearly labeled as such.

Feeling: *partnership, not permission*. "Someone smart looked at this with me."

### Station 6 — Order Preview (gated; locked until risk-valid)
Until the draft is risk-valid (stop set, size computed, no breach), this station is **dimmed
and locked** with a one-line reason ("Set a stop loss to preview"). When valid, it
illuminates and summarizes the complete order as a clean institutional confirmation card:
account, side, symbol, size, entry, SL/TP with dollar values, est. cost/spread, R, and the
dollar risk in the largest type on the card. This is the *last calm read* before commitment.

Feeling: *clarity before commitment*. "Everything in one honest sentence."

### Station 7 — The Commit Control
- In **simulation**: a normal (but satisfying) **Execute (Sim)** button. Frictionless,
  because sim has no consequence — we *want* practice reps.
- In **live**: a **hold-to-execute** control. The button reads "Hold to send live order."
  A radial progress ring fills over ~700ms as the trader holds; releasing early cancels.
  Completion triggers a decisive haptic/visual "commit" pulse. This single gesture is the
  product's central safety ritual — it makes live execution a *deliberate physical act*, not
  a reflex click. (Reduced-motion users get a two-step confirm instead.)

Feeling: *gravity, then resolve*. "I am choosing this, with my hand, on purpose."

### Station 8 — Status & Result
After commit: an **executing** state (the order in flight, optimistic, with a calm
indeterminate pulse), resolving to **filled** (fill price, slippage vs expected, a brief
teal confirm bloom and a journaled entry) or **rejected** (see §6.4 — never a red wall of
shame; a calm, specific, recoverable message).

Feeling: *truthful resolution*. "I know exactly what happened and what to do next."

### Station 9 — Position Management (future; designed now so nothing is rebuilt)
Once a position is open, the Console's top transforms into a **live position cockpit**:
running P&L as a `VaultNumber`, the SL/TP ladder now showing distance-to-stop and
distance-to-target as live bars, partial-close and breakeven/trail controls, and a
"close position" that uses the same hold-to-execute ritual. The risk engine inverts: it now
protects *open* risk, warning as price approaches the stop. (Built in Phase 8 — but the
layout reserves its space from day one so the transition is a reveal, not a redesign.)

Feeling: *stewardship*. "The trade is alive and I am tending it, not gambling on it."

---

## 5. State Machine

The Console is a finite state machine. Every state has a **distinct visual identity, a
distinct accent, a distinct set of allowed actions, and a one-line human caption.** No state
is ambiguous. (Full diagram lives in the engineering masterplan; this is the experiential
spec.)

| State | Accent / mood | What the trader sees & can do | One-line caption |
|---|---|---|---|
| **Disconnected** | Grey, still | No account. A single calm CTA: connect a broker or enter simulation. Everything below locked. | "Connect an account to begin." |
| **Simulation** | Teal, breathing | Full console, sim account, frictionless execute. Teal hatch marks remind it isn't real. | "Simulation — practice freely." |
| **Live-ready** | Amber-gold | Connected live account, draft valid, no breach. Live arming available. Calm but *charged*. | "Live account armed." |
| **Building** | Inherits mode | Draft incomplete; lower stations dim, each showing what's missing. | "Set a stop to continue." |
| **Blocked** | Red, firm (not frantic) | A specific rule is violated (oversize, breach, no stop, news lock). Execute disabled, reason shown, fix suggested. | "Risk exceeds daily headroom — reduce size." |
| **Preview** | Inherits mode, brightened | Order valid and summarized; commit control live. The "deep breath" state. | "Review and commit." |
| **Executing** | Inherits, pulsing | Order in flight. Controls lock to prevent double-send. Optimistic, calm. | "Sending…" |
| **Filled** | Teal confirm bloom | Fill price, slippage, journaled. Transitions toward position management. | "Filled at 1.0842." |
| **Rejected** | Amber-rose, recoverable | Specific reason, original draft preserved, clear next action. Never destructive. | "Rejected: market closed. Retry when London opens." |
| **Managing position** | Live accent, vigilant | Position cockpit (§4 Station 9): live P&L, manage controls, open-risk guard. | "Position live — +$312, stop 18 pips away." |

**The golden rule:** the trader can name their current state in under one second, from
peripheral vision, by color alone.

---

## 6. Risk and Safety UX

### 6.1 The three guard layers
1. **Soft guidance (always on):** the risk meter, dollar-first loss framing, spread
   disclosure, and the plan-headroom context. These shape behavior without blocking.
2. **Hard blocks (cannot be clicked through):** no stop loss; size = 0; risk > remaining
   daily loss headroom; FTMO/prop max-drawdown breach; trade count over daily plan max;
   (optional) news-window lock. Each disables execute and shows the reason.
3. **The live ritual:** even a perfectly valid live order requires the hold-to-execute
   gesture. Validity earns the *right* to commit; the ritual is the *act* of committing.

Critically, **every hard block is enforced server-side as well** (see §8). The UI guard is
for the human; the server guard is for the truth. A client that lies cannot place a bad
order.

### 6.2 How danger is communicated (the grammar of warning)
- **Color escalation:** teal (safe) → amber (caution, >50% headroom) → red (blocked, breach).
  Color is the first and fastest signal.
- **Motion escalation:** safe elements are still or breathe slowly; caution introduces a slow
  pulse; blocked introduces a sharper, attention-grabbing pulse on the *specific* offending
  element only (the risk gauge, the missing-stop field) — never the whole panel. Localized
  motion points the eye at the problem.
- **Language escalation:** captions move from neutral ("2.0R") to directive ("Reduce size to
  stay within headroom") to imperative ("Stop loss required"). The system always tells the
  trader *what to do*, not just that something is wrong.

### 6.3 The anti-impulse design
- **Revenge-trade dampener:** if the trader is on a losing streak or has just taken a loss
  (read from telemetry), the Console surfaces a quiet, non-blocking note in the AI Check
  ("Two losses in a row — this is when discipline matters most") and, optionally, nudges the
  default risk preset down. We never block a valid trade for emotional reasons — but we make
  the emotion *visible* to the trader, which is often enough.
- **No "max size" shortcut.** There is deliberately no one-tap "all-in." Size is always a
  consequence of risk. The hardest impulsive mistake to make is the one the UI won't help you
  make.
- **The cooldown breath:** the hold-to-execute duration is the cooldown. ~700ms is long
  enough to interrupt a reflex, short enough to never annoy a disciplined trader.

### 6.4 The failure-state experience (rejections, errors, disconnects)
Failure is where most trading apps feel cheap and panic-inducing. Ours stays **calm,
specific, and recoverable** — this is a signature differentiator.
- **Never a generic red error.** Every failure names the cause in plain language and what to
  do next. "Order rejected — market closed. Retry when London opens in 2h 14m."
- **The draft is sacred.** A rejection or disconnect **never destroys the trader's draft.**
  Size, SL, TP, symbol all persist. They fix one thing and retry. Losing a carefully-sized
  draft to an error is an unforgivable UX sin in a money app.
- **Connection loss is honest, not hidden.** If the broker connection drops, the Status Crown
  goes grey, open positions show a "last known" timestamp with a clear "reconnecting" state,
  and execution locks. We never let the trader believe they're live when they're not.
- **Idempotency is felt as trust.** Double-clicks, retries after timeout, and flaky networks
  never produce a duplicate order (see §8) — so the trader can retry without fear, which is
  itself a calming, premium feeling.
- **Errors apologize with information, not emotion.** No "Oops!" No shame. Just: here's what
  happened, here's the state of your money, here's the one button that fixes it.

---

## 7. AI Trade Check UX

### 7.1 The product stance
The AI Check is the feature that makes ArchioAI's console *not a TradeLocker clone.* But it
is also the easiest feature to get dangerously wrong. So the stance is firm:

> **The AI is a co-pilot, never an oracle.** It reflects the trader's own context back to
> them with intelligence. It never says "buy now," never implies a guaranteed outcome, and
> never blocks a valid trade. It earns trust by being *specific and honest*, not by being
> confident.

### 7.2 What it shows
- **A posture, not a signal:** **Aligned** (teal) / **Caution** (amber) / **Conflicted**
  (rose). These describe the relationship between *this draft* and the trader's *context* —
  not a market prediction.
- **2–4 concrete observations**, each tied to real data the trader can verify:
  - *Plan:* "This is your 3rd of 3 planned trades today."
  - *Risk:* "At 2%, this is double your usual 1% sizing."
  - *Behavior:* "You're on a 2-loss streak; your win rate after losses drops to 38%."
  - *Session/timing:* "London close in 20m — your edge here is historically lower."
  - *Structure:* "Your 2.0R is in line with your profitable setups."
- **A confidence band**, explicitly framed as "how much context I had," not "how likely you
  are to win." Low data → visibly lower confidence. Honesty about uncertainty *is* the trust.

### 7.3 How it feels
- **Collapsed by default**, so it never nags. It shows a one-line posture chip. The trader
  expands it when they want a second opinion — the AI waits to be asked.
- **Never decorative.** Every observation references real numbers from the trader's own
  account. If the AI has nothing specific to say, it says so ("Nothing notable — clean
  setup") rather than inventing filler. Empty honesty beats fake insight.
- **Visually it is the calmest station** — soft, low-contrast, almost whispering. Intelligence
  reads as quiet confidence, not flashing lights. The risk gauge is allowed to shout; the AI
  speaks softly.

### 7.4 The contract (decision #4, locked)
The UI binds to a stable interface — `TradeCheckInput` (the draft + context) →
`TradeCheckResult` (posture, observations[], confidence, dataCoverage). **Phase 2 ships a
local heuristic** that produces real results from telemetry. **A later phase swaps the
implementation** for the ArchioAI endpoint behind the *identical* interface. The UI never
knows or cares which brain answered — so the real model lands with zero visual refactor.

---

## 8. TradeLocker Integration Strategy

### 8.1 Principles
- **Secrets never touch the client.** Broker credentials and tokens live server-side only.
  The browser talks to *our* API routes; our server talks to TradeLocker. The client never
  sees a broker token, ever.
- **Per-user, encrypted connections (decision #2).** Each user connects their own broker
  account; credentials are encrypted at rest in Supabase, decrypted only in the server
  runtime for the duration of a call.
- **Live execution is feature-flagged and guarded.** A flag gates the *entire* live path.
  With the flag off (default for everyone initially), the Console is fully usable in
  simulation; live arming is invisible. We turn it on per-user/cohort, deliberately.
- **Simulation and live share one code path, one state machine, one UI.** The *only*
  difference is the adapter behind the order interface (sim engine vs TradeLocker). This
  guarantees that practice reps train the exact muscle memory used live.

### 8.2 The order lifecycle (server-mediated)
1. **Connect** → exchange user broker credentials for a TradeLocker JWT (server), store an
   encrypted reference + account metadata. Surface only health + account info to the client.
2. **Hydrate** → server fetches accounts, instruments, route IDs, and live quotes; maps
   ArchioAI symbols ↔ TradeLocker `tradableInstrumentId` + `routeId`.
3. **Preview/validate** → client sends a draft; **server independently re-runs every hard
   risk rule** (size, stop, headroom, breach, count) against fresh account state. The server
   is the source of truth, not the client. Returns a signed, short-lived "preview token."
4. **Submit** → client sends the preview token + an **idempotency key**. Server verifies the
   token is still valid (price/headroom haven't moved out of tolerance), then places the
   order with TradeLocker. The idempotency key guarantees a retry never double-fills.
5. **Status** → server reports fill/reject/pending; client reflects it in the state machine.
   Every transition is written to the order journal + audit log.

### 8.3 Audit & journal (trust infrastructure)
- **Audit log:** every connect, preview, submit, fill, reject, block, and disconnect is
  recorded server-side with timestamp, account, draft snapshot, and outcome. This is both a
  compliance asset and a debugging lifeline — when a trader says "it placed the wrong order,"
  we have the truth.
- **Order journal:** filled orders flow into the trader's journal automatically, pre-tagged
  with the AI posture and risk context at time of entry — closing the loop back into
  ArchioAI's analytics. The Console *feeds* the dashboard.

---

## 9. Data Model & API Plan

### 9.1 Supabase tables (per-user, RLS-scoped)
- `broker_connections` — `id, user_id, provider, encrypted_credentials, account_meta,
  health, created_at, last_verified_at`. One row per connected broker account.
- `sim_accounts` — `id, user_id, label, base_currency, starting_balance, equity,
  daily_loss_used, daily_loss_max, trades_used, trades_max, drawdown_used, drawdown_max,
  created_at`. The **real sim-account model** (decision #3) — seeded from fixtures for the
  first demo, but a true persisted account thereafter.
- `order_drafts` — optional server-side draft persistence for cross-device continuity.
- `orders` — `id, user_id, account_ref, mode(sim|live), symbol, side, size, entry, sl, tp,
  risk_usd, risk_pct, r_multiple, ai_posture, status, broker_order_id, idempotency_key,
  fill_price, slippage, created_at, resolved_at`. The journal source.
- `execution_audit` — append-only event log (every lifecycle event, immutable).

All tables RLS-scoped to `user_id`. Encrypted credentials never selectable to the client.

### 9.2 API routes (all server-only secrets)
- `POST /api/broker/connect` · `DELETE /api/broker/disconnect` · `GET /api/broker/health`
- `GET /api/broker/accounts` · `GET /api/broker/instruments` · `GET /api/broker/quote`
- `POST /api/execution/preview` (server-side validation → preview token)
- `POST /api/execution/submit` (preview token + idempotency key → order)
- `GET /api/execution/status` · `GET /api/positions` · `POST /api/positions/close`
- `POST /api/ai/trade-check` (heuristic now, ArchioAI endpoint later — same contract)

### 9.3 Shared types (the contracts everything binds to)
`OrderDraft`, `RiskComputation`, `OrderPreview`, `OrderResult`, `BrokerAccount`,
`SimAccount`, `TradeCheckInput`, `TradeCheckResult`, `ConsoleState`. Defined once, shared by
client and server, so sim/live and heuristic/AI are pure adapter swaps.

---

## 10. Implementation Roadmap (with design quality gates)

Each phase ends at a **gate** — it cannot proceed until the gate's criteria are met. Gates
are how we keep a 40k-line build from drifting.

| Phase | Deliverable | Quality gate (must pass to proceed) |
|---|---|---|
| **1. Rail architecture** | `execution-console` slot variant + module switcher; Console mounts beside chart without reflow; persists. | Switching Active↔Execute never moves the chart; layout/peek/pin/minimize all work; verified in browser. |
| **2. Static Console + state machine** | All 9 stations rendered in VANTARY glass; full state machine with mock data; AI Check heuristic + contract. | Every state is visually unambiguous by color alone; progressive disclosure works; reduced-motion clean. |
| **3. Risk engine (real math)** | Risk→size derivation, RR ladder, live risk meter vs daily headroom, all hard blocks (client). | Bad orders are *impossible* to preview; dollar-first framing everywhere; gauges accurate. |
| **4. Simulation engine** | Real `sim_accounts` model + sim order adapter; full execute→fill→journal loop in sim. | A trader can run unlimited realistic practice reps end-to-end; sim is visibly never confused with live. |
| **5. Supabase + audit/journal** | All tables, RLS, audit log, journal feed into dashboard. | Every sim action is journaled + audited; RLS verified; no client secret exposure. |
| **6. TradeLocker connect (read-only)** | Per-user encrypted connect, accounts, instruments, live quotes, health. | Real account data flows; secrets server-only; disconnect/health states honest. |
| **7. Live execution (flagged)** | Server-side validation, preview token, idempotent submit, hold-to-execute, status. | Server re-validates every rule; idempotency proven; flag off by default; live ritual feels serious. |
| **8. Position management** | Live position cockpit, partial close, breakeven/trail, open-risk guard. | Open trades feel *tended*, not abandoned; close uses the same ritual. |
| **9. AI endpoint swap** | Replace heuristic with ArchioAI endpoint behind the same contract. | Zero UI changes required; confidence honesty preserved. |
| **10. Polish & hardening** | Motion finesse, mobile sheet, accessibility, error-injection testing, perf. | Feels like the signature feature; survives chaos testing; a11y + reduced-motion complete. |

**Hard rule:** Phases 1–5 ship with **no live execution path even present**. Live (6–7) is
gated behind simulation completeness, server validation, and the feature flag.

---

## 11. Phase 1 Build Plan

**Goal:** prove the Console can live in the right rail as a modular, switchable, persistent
slot variant **without disturbing the chart or Active Windows** — the structural foundation
everything else sits on. No order logic yet.

**What I will implement in Phase 1 (and only this):**
1. **Register `execution-console`** in the side-slot registry (`trading-desk/data.ts` +
   `modules/registry.ts`) with an `implemented` flag, label, and icon — alongside, not
   replacing, the existing variants.
2. **Module switcher in the rail** — a slim tab/segment strip letting the user switch the
   rail between *Active Windows* and *Execution Console* (and other declared slots). Selection
   persists in the existing `vantary.trading-desk.v3` store.
3. **`ExecutionConsoleShell`** — the Console's outer glass container that fills the side slot,
   with the **Status Crown** (Station 0) rendered in its three modes (disconnected / sim /
   live) driven by a local mock `ConsoleState`, plus dimmed placeholders for Stations 1–9 so
   the full vertical rhythm is visible and approved early.
4. **Layout integrity** — confirm split/peek/pin/minimize and the minimized **state pip**
   all behave, and that switching to Execute mode performs the cross-fade **without reflowing
   the chart**.
5. **Theme conformance** — everything in VANTARY teal-glass using the Flight Deck instrument
   primitives, so the shell already reads as ArchioAI, not a prototype.

**Explicitly NOT in Phase 1:** risk math, real accounts, Supabase, TradeLocker, AI Check
logic, any execute path. Those are Phases 2+.

**Phase 1 quality gate:** with the Console mounted, switching Active↔Execute never moves the
chart; peek/pin/minimize/persist all work; the Status Crown is unambiguous in all three
modes; verified live in the browser with a screenshot.

---

## Approval requested

This blueprint takes full ownership of the product, UX, safety psychology, visual language,
and engineering contract for the Execution Console, and locks your four decisions into the
architecture.

**May I begin Phase 1 — the modular right-rail architecture and the Console shell with the
Status Crown — exactly as scoped in §11?** I will not write any code until you approve.
