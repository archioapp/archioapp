# ArchioAI Live Execution Console — Master Plan

> The place where a trader analyzes, prepares, risk-checks, and executes a live entry —
> powered by TradeLocker and ArchioAI execution intelligence. A billion-dollar AI trading
> cockpit, not a basic broker order ticket.

**Status:** Architecture & design specification. **No live order execution is built or
faked until** the architecture, simulation mode, safety rules, and TradeLocker contract in
this document are approved.

---

## 0. Grounding — what already exists (verified in code)

This plan is built on top of the platform that is already shipping, not a greenfield guess.

| Existing system | File(s) | What it gives us |
|---|---|---|
| **Trading Desk bay** (chart + side slot + resize/peek/pin) | `components/dashboard/vantary/trading-desk/{shell,side-slot,provider,data}.tsx` | The full-bleed chart envelope, a `SideSlot` that already swaps between 10 module variants, `split / chart-only / stacked / minimized` layouts, draggable resize, hover-peek, pin-to-split, and `localStorage` persistence (`vantary.trading-desk.v3`). |
| **Side-slot module library** | `trading-desk/data.ts` → `TdSideSlot` union + `TD_SIDE_SLOT_*` maps + `modules/registry.ts` | A typed registry of slot modules with `implemented` flags, favorites, deck order. `ai-copilot`, `pending-orders`, `risk-meter`, `daily-max` are already declared as (stubbed) slots — the Execution Console is the natural "real" implementation of this family. |
| **Active Window panel** | `active-window/index.tsx` (+ dossier, playbook, temporal rail) | The current right-rail content (session/day intelligence). The Execution Console becomes a *peer* of this panel, not a replacement — switchable via the rail tab registry. |
| **Trade Forge prototype** | `components/copilot/trade/TradeExecutionPanel.tsx` (599 lines) | A working static order ticket: buy/sell, order type, lot stepper, SL/TP pips, RR presets, broker account cards, risk %. **We harvest its logic, not its visual language** (it uses a different `#070910`/emerald palette, not VANTARY teal-glass). |
| **Flight Deck inspector + instruments** | `cartouche/{gadget-inspector,instruments}.tsx`, `inspectors/*` | A verified premium pattern: portal overlay at `z=60`, `RadialGauge / AreaSpark / VaultNumber / Donut / Heatstrip / KillzoneClock`, reduced-motion-safe. The Execution Console reuses this instrument kit so it reads as one system. |
| **VANTARY theme** | `vantary-theme.ts` (`VANTARY.{amber,teal,paper,ink,rule,ashSoft,amberHalo,amberWash}`) | The single source of truth for the institutional dark + teal-glass language. Every new surface uses these tokens — no new palette. |
| **Telemetry / risk data** | `dashboard-data.ts` (`DAILY_PLAN`, `PERFORMANCE`, `ACCOUNTS`, `RECENT_TRADES`), `useTraderTelemetry()` | Mock account equity, FTMO drawdown (4.2% of 10% max → 5.8% headroom), daily plan (trades used/max, loss used/max), goals. The risk engine reads these the same way the Risk Envelope / Daily Plan gadgets already do. |
| **DB + auth** | Supabase (integration connected) | Where audit logs, order journal events, and broker-token references live. |

**Design consequence:** the Execution Console is not bolted on. It is the long-promised
"real" version of the `pending-orders` / `risk-meter` / `ai-copilot` side-slot family,
expressed through the Flight Deck inspector grammar and the VANTARY theme, mounted inside
the existing chart shell's right rail.

---

## 1. Product concept — the Execution Console

### 1.1 What problem it solves
A trader's worst money is made in the **last 10 seconds before clicking buy/sell**: wrong
lot size, no stop, risk too big, revenge after a loss, trading into news, breaking the prop
firm's daily limit. Charts and analytics tell you *what* is happening; nothing on the
platform governs the *moment of execution*. The Execution Console is the **risk-first
gate** between intent and a live order — it computes the math, runs an AI setup/behavior
check, enforces hard guardrails, and only then unlocks the execute button.

### 1.2 Why it belongs in the right-side sliding panel
- The chart is the analysis surface; the right rail is the **action surface**. Keeping the
  ticket beside the chart (never overlapping it) means the trader never leaves price.
- It must be **switchable** with Active Windows / Positions / Risk / Journal so the trader
  flows analyze → execute → manage → log without context switching or modals.
- The rail already supports resize / collapse / pin / peek — a serious order ticket needs
  exactly those affordances, and they exist.

### 1.3–1.8 How it connects
- **To the chart:** reads the bay's `currentSymbol` + `currentInterval` from the
  trading-desk provider; offers "use chart symbol" and (Phase 8+) drag-SL/TP-from-chart.
- **To TradeLocker:** through server-only API routes (Section 6). The panel never talks to
  the broker directly; it talks to our routes, which hold the JWT and `accNum`.
- **To the AI system:** the AI Trade Check card calls an ArchioAI endpoint that fuses
  setup quality, session/trend alignment, and the trader's live psychology/discipline
  signals (the Order-Layer truth inventory: revenge risk, overtrading, stability index).
- **To account/risk data:** equity, margin, daily-loss-used, trade-cap, drawdown headroom
  come from `dashboard-data.ts` today (sim) and from `/api/broker/accounts/:id` later (live).
- **To the journal:** on fill, the console posts a structured execution event to
  `/api/journal/from-execution`, which writes a journal row + (Phase 9) triggers AI review.
- **To Flight Deck gadgets:** the console **shares the same risk model** as the Risk
  Envelope, Daily Plan, and Discipline gadgets — one `useExecutionRisk()` selector feeds
  both, so a guardrail block in the console and a red gadget face always agree.

### 1.9–1.12 Behavior by state
- **Before broker connection:** fully usable in **Simulation** — local equity, sim fills,
  sim positions. A persistent "SIM" badge. A "Connect broker" affordance in the account
  selector. Nothing is grayed-out into uselessness; sim is a first-class mode.
- **After broker connection:** account selector lists real TradeLocker accounts; equity,
  margin, symbols, and quotes are live; preview is server-validated.
- **Paper/sim mode:** clearly labeled teal "SIM" everywhere; fills are synthesized at
  current mid; positions live in a local sim store; no network submit. Always available
  even when a broker is connected (sim/live is a per-session toggle).
- **Live mode:** red "LIVE" badge, stronger confirmation (hold-to-execute), server-side
  re-validation of every guardrail before submit, idempotency key to prevent dupes.

---

## 2. Right-rail modular architecture

Today the right side renders one thing (`ActiveWindowPanel`). We make it a **registry of
panels** with a thin shell, mirroring how `SideSlot` already dispatches module variants and
how `gadget-inspector` already uses a registry.

```
components/dashboard/vantary/right-rail/
  right-rail-shell.tsx        // RightRailShell — header, tab strip, body, resize/collapse/pin
  right-rail-registry.ts      // RIGHT_RAIL_TABS: ordered [{id,label,icon,Panel,badge?}]
  right-rail-provider.tsx     // activeTab, pinned, collapsed, width — persisted
  panels/
    active-windows-panel.tsx  // wraps existing <ActiveWindowPanel/> (no behavior change)
    execution-console-panel.tsx
    position-manager-panel.tsx
    risk-control-panel.tsx
    journal-capture-panel.tsx
    ai-assist-panel.tsx
```

### Tab model
| # | Tab id | Label | Panel | Phase |
|---|---|---|---|---|
| 1 | `active-windows` | Active / Session | existing `ActiveWindowPanel` | 1 |
| 2 | `execute` | Execute Entry | `ExecutionConsolePanel` | 2 |
| 3 | `positions` | Open Positions | `PositionManagerPanel` | 8 |
| 4 | `risk` | Risk Control | `RiskControlPanel` | 3 |
| 5 | `journal` | Journal | `JournalCapturePanel` | 9 |
| 6 | `ai-review` | AI Trade Review | `AIAssistPanel` | 9 |

### Shell contract
```ts
interface RightRailState {
  activeTab: RightRailTabId
  pinned: boolean        // pinned = always-split; unpinned = peek/overlay
  collapsed: boolean     // collapsed = hairline strip with tab glyphs only
  widthPx: number        // clamped 320..560, persisted
}
```
- **Never overlaps the chart incorrectly:** pinned ⇒ real flex squeeze of the chart pane
  (exactly the existing split-mode behavior); unpinned ⇒ peek overlay that auto-collapses —
  reusing the trading-desk peek mechanics rather than reinventing them.
- Persistence key `vantary.right-rail.v1` (separate from the bay's v3 key).
- **Integration point:** the trading-desk `SideSlot` gets one new variant
  `"execution-console"` whose body is `<RightRailShell defaultTab="execute" />`, so the
  console is reachable from the chart toolbar, the side-slot chip strip, and the customize
  popover with zero new mounting plumbing. Active Windows can therefore be *replaced* by the
  console in the slot, satisfying the acceptance criterion.

---

## 3. Execution Console UI — section-by-section

One vertical, scroll-on-overflow column inside the rail. Header is sticky; the execute
confirmation bar is sticky to the bottom. All surfaces use VANTARY teal-glass: layered
inset highlights, 1px `VANTARY.rule` hairlines, `amberWash`/teal washes for state, no cheap
neon. Typography: `font-mono` uppercase micro-labels (`9–10.5px`, `letterSpacing 0.18–0.22em`),
`font-sans` for body, tabular-nums for every number.

### 3.1 Account Selector — `ExecutionAccountSelector`
Selected broker · TradeLocker account · equity · available margin · **LIVE/SIM badge** ·
connection status dot · account-health micro-bar (equity vs balance vs drawdown). Horizontal
card rail (harvested from Trade Forge's broker cards, re-skinned to teal-glass). Breathes
softly when a live account is connected and healthy.

### 3.2 Symbol / Market Context — `ExecutionSymbolHeader`
Current pair (defaults to chart symbol, "use chart" link) · spread · session (from the
clock-spine) · volatility tier · next news event countdown · AI market warning chip ·
current chart timeframe. Bid/ask ladder mirrors Trade Forge.

### 3.3 Direction Selector — `DirectionToggle` + `OrderTypeSelector` + `EntryPriceControl`
Buy/Sell (teal vs warm-red, never the emerald/red of the prototype) · market/limit/stop ·
entry price (disabled for market, live bid/ask shown) · slippage warning when spread or
distance is abnormal.

### 3.4 Risk Engine — `RiskEngineCard`
Risk percent + risk amount · **max allowed risk** · daily loss limit + used · trade cap
remaining · drawdown headroom · discipline warning (pulls Order-Layer psychology signals).
This is the heart: a `RadialGauge` (from the instrument kit) shows **budget remaining** (full
green ring = healthy, matching the Risk Envelope gadget convention) and pulses softly when
inputs change.

### 3.5 SL / TP / RR Builder — `SLTPBuilder` + `RRVisualizer` + `LotSizeCalculator`
SL price + distance (pips/points) · TP price + distance · RR ratio · **auto lot size** ·
reward amount · loss amount · a **visual RR ladder** (entry in the middle, SL below, TP
above, proportional bars that animate when SL/TP change). Lot size uses
`risk_amount / (stop_distance × pip_value)` with instrument contract specs.

### 3.6 AI Trade Check — `AITradeCheckCard`
Setup quality · session alignment · trend alignment · liquidity warning · news warning ·
overtrading warning · emotional-state warning · a single **APPROVE / CAUTION / BLOCK**
verdict that gates the execute button. BLOCK can hard-lock; CAUTION requires an
acknowledgement tap.

### 3.7 Execution Preview — `ExecutionPreviewCard`
A read-only summary before send: account · symbol · direction · entry · SL · TP · risk · RR
· lot · est. loss · est. profit · margin impact · order type · journal tag.

### 3.8 Confirmation Flow — `ExecuteConfirmationBar` + `ExecutionGuardrails`
Sticky bottom bar. One-click **Preview** → second-step **Confirm** → optional
**hold-to-execute** (700ms press, ring fills) in live mode. Live-account warning, final
risk re-check, execution animation, and success / pending / rejected states.

### 3.9 Post-Execution — `OrderStatusTimeline`
Order ID · position status · entry fill · SL/TP line status · live PnL · manage buttons ·
journal button · AI follow-up review entry point. A vertical timeline (submitted → accepted
→ filled) reusing the inspector section grammar.

### 3.10 Position Management — `PositionManagementActions` (Phase 8)
Move SL → BE · partial close · close full · trail stop · adjust TP · cancel pending ·
duplicate setup · journal result.

---

## 4. Component architecture (frontend)

All under `components/dashboard/vantary/execution-console/`. Each is a client component,
themed via VANTARY, reduced-motion-safe, and reads from a single
`ExecutionConsoleProvider` (reducer + context) so no prop-drilling and a single source of
truth for the order draft.

| Component | Responsibility | Key props | State source | Loading | Error | Mobile | Motion |
|---|---|---|---|---|---|---|---|
| `ExecutionConsolePanel` | Orchestrates sections, owns scroll + sticky bars | `defaultSymbolId` | provider | skeleton sections | inline banner | single column, full-width | slide-in blade |
| `ExecutionConsoleProvider` | Reducer for the order draft + mode + status | `children` | local + selectors | — | — | — | — |
| `ExecutionAccountSelector` | Pick account, show equity/margin/health | `accounts`, `selectedId`, `onSelect` | `/api/broker/accounts` (live) or fixtures (sim) | shimmer cards | "reconnect" CTA | horizontal scroll | breathe when connected |
| `BrokerConnectionBadge` | LIVE/SIM/disconnected pill | `status`, `mode` | provider | — | red disconnected state | inline | pulse dot |
| `ExecutionSymbolHeader` | Pair, spread, session, news, AI warning | `symbol`, `quote` | bay provider + `/api/broker/quotes` | spread "—" | stale-quote flag | wraps | none |
| `DirectionToggle` | Buy/Sell | `value`, `onChange` | provider | — | — | full-width pair | color shift |
| `OrderTypeSelector` | market/limit/stop/stop-limit | `value`, `onChange` | provider | — | — | segmented | none |
| `EntryPriceControl` | Entry price for limit/stop | `value`, `bid`, `ask`, `onChange` | provider + quote | disabled while no quote | invalid-price hint | stepper | none |
| `RiskEngineCard` | Risk %/amount, limits, caps, headroom | `risk`, `limits` | `useExecutionRisk()` | gauge spins to value | over-limit red | stacks | gauge pulse |
| `SLTPBuilder` | SL/TP price + distance | `sl`,`tp`,`onChange` | provider | — | "SL required" | steppers | — |
| `RRVisualizer` | Visual RR ladder | `entry`,`sl`,`tp`,`side` | derived | — | — | scales | ladder animates |
| `LotSizeCalculator` | Auto lot from risk + stop | `riskAmount`,`stopDist`,`specs` | derived | — | "no spec" | inline | vault-roll number |
| `AITradeCheckCard` | Setup/behavior verdict | `draft` | `/api/ai/trade-check` | thinking shimmer | "check unavailable → CAUTION" | stacks | verdict glow |
| `ExecutionPreviewCard` | Pre-send summary | `draft`,`computed` | provider | — | — | full | reveal |
| `ExecuteConfirmationBar` | Preview→Confirm→hold-to-execute | `state`,`onExecute` | provider | spinner on submit | inline reason | sticky bottom | controlled energy + hold ring |
| `ExecutionGuardrails` | Computes locked/unlocked + reasons | `draft`,`risk`,`account`,`ai` | selector | — | lists blocking reasons | — | lock shake |
| `OrderStatusTimeline` | Submitted→accepted→filled→PnL | `orderId`,`status` | `/api/broker/orders/:id` poll | pending dots | rejected reason card | full | step pulse |
| `PositionManagementActions` | BE/partial/close/trail | `positionId` | `/api/broker/positions` | per-action spinner | per-action error | grid | tap feedback |
| `ExecutionJournalBridge` | Posts execution → journal | `execution` | `/api/journal/from-execution` | toast | retry toast | — | — |

### Order draft (single state shape)
```ts
interface OrderDraft {
  mode: "sim" | "live"
  accountId: string | null
  symbolId: string
  tradableInstrumentId: number | null   // resolved from broker instruments
  side: "buy" | "sell"
  orderType: "market" | "limit" | "stop" | "stop-limit"
  entryPrice: number | null              // null ⇒ market
  riskPct: number
  slPrice: number | null
  tpPrice: number | null
  lotSize: number | null                 // computed, user-overridable
  journalTag: string | null
}
type ExecPhase = "draft" | "previewing" | "confirming" | "submitting"
               | "pending" | "filled" | "rejected" | "error"
```

---

## 5. Motion system (alive, not cartoon)

- Panel slides in like a **glass blade** (x + opacity + subtle blur settle), spring, ~260ms.
- Account selector **breathes** (scale 1↔1.01 / soft halo) only when a live account is
  connected and healthy.
- Risk meter **pulses softly** when risk inputs change (one breath, not a loop).
- RR ladder **animates** bar heights when SL/TP change (spring, GPU transforms).
- Lot size **rolls** via `VaultNumber` odometer.
- Warning states **glow carefully** (border + wash, never full-screen flash).
- Execute button has a **controlled energy** resting state; **hold-to-execute** fills a ring.
- Success = clean terminal confirmation (check draws in + order id types in).
- Rejected = **clear reason text**, not a bare red error.
- `useReducedMotion()` everywhere ⇒ fades/instant states only. (This is a hard project
  convention; keyframe arrays must have resolved `initial` to avoid the dev error-toast bug.)

---

## 6. Backend / TradeLocker integration contract (real, not faked)

TradeLocker is JWT-based. Base URLs: `https://demo.tradelocker.com/backend-api/` and
`https://live.tradelocker.com/backend-api/`. Auth = `POST /auth/jwt/token` with
{email, password, server} → access/refresh JWT. Trade calls require an `accNum` header
(from `/auth/jwt/all-accounts`) and a `routeId` (`TRADE` for orders, `INFO` for quotes/
history) resolved per-instrument via `/trade/accounts/{accountId}/instruments`.

### Data we need from TradeLocker
Accounts (id, accNum, currency, balance, equity, margin, leverage, env) · instruments
(`tradableInstrumentId`, symbol, contract size, pip/tick, min/max/step lot, TRADE+INFO
routeIds) · quotes (bid/ask) · orders + status · positions · `/trade/config` (field names,
rate limits).

### Symbol mapping
TradeLocker instruments ↔ our `TdSymbol` bank (`data.ts`) via a `brokerSymbolMap` keyed by
our `symbolId` → broker `tradableInstrumentId`, built once per account from `/instruments`
and cached. The chart's TradingView symbol stays independent (display only).

### Proposed API routes (Next.js route handlers, server-only)
```
GET  /api/broker/accounts                  → list connected accounts (+ equity/margin)
GET  /api/broker/accounts/:id/symbols      → instruments + routeIds + specs for the account
GET  /api/broker/quotes?account=&instr=    → live bid/ask (proxy; short cache)
POST /api/broker/orders/preview            → server validates draft, returns computed
                                              risk/margin/lot + guardrail verdict
POST /api/broker/orders/submit             → places order (idempotency key required)
GET  /api/broker/orders/:id                → order status
GET  /api/broker/positions?account=        → open positions
POST /api/broker/positions/:id/modify      → SL/TP/partial/close/trail
POST /api/journal/from-execution           → write journal row from a fill
```

### Order status, errors, positions, dedupe, audit, secrets, sim vs live
- **Status tracking:** submit returns an order id; client polls `/orders/:id` (Phase 6) →
  upgrade to the **Streams API (WebSocket)** for fills/positions in Phase 8.
- **Errors:** broker error → mapped to a typed `ExecutionError {code, humanReason}` so the
  UI shows a real sentence, never a raw payload.
- **Duplicate submits:** every submit carries a client-generated `idempotencyKey`; the
  route rejects a repeat within a window; the button locks on `submitting`.
- **Audit logs + journal:** Supabase tables (Section below) — every preview, submit,
  accept, reject, modify is appended with user, account, draft snapshot, server response.
- **Secrets:** TradeLocker email/password/server and JWTs live **only server-side**
  (Supabase encrypted column or Vercel env per deployment); tokens are refreshed server-side;
  the browser only ever sees account ids and quotes. No broker secret is ever sent to the client.
- **Disconnected broker:** routes return `503 broker_disconnected`; UI drops to a clear
  reconnect state and **cannot execute** (guardrail).
- **Sim vs live separation:** `mode` is part of the draft and the route path branch; sim
  never touches `/api/broker/*`, it uses a local sim engine + sim position store. Live mode
  re-validates every guardrail server-side before the broker call.

### Supabase schema (proposed — for approval before any DB work)
```
broker_connections(id, user_id, provider, server, account_label, env, token_ref, status, created_at)
execution_audit(id, user_id, account_id, mode, phase, draft jsonb, response jsonb, idempotency_key, created_at)
journal_entries(... existing/extended ..., source 'execution', execution_id, symbol, side,
                entry, sl, tp, risk_pct, rr, lot, result, created_at)
```
RLS on by default; every query scoped by `user_id`.

---

## 7. Risk & safety rules (hard, enforced both client + server)

Execute is **locked** (with a human reason) unless ALL pass:
- account connected (live) or sim mode active
- symbol available + instrument resolved
- SL present and valid relative to side/entry
- computed risk ≤ max allowed risk
- daily loss limit not reached
- trade cap remaining > 0
- not inside a blocked news window (unless explicit user override toggle)
- no in-flight submit (idempotency lock)
- live mode ⇒ confirmation step + (optional) hold-to-execute completed
- AI verdict ≠ BLOCK (CAUTION requires acknowledgement)

`ExecutionGuardrails` returns `{ canExecute: boolean, reasons: GuardReason[] }`; the same
function runs server-side in `/orders/submit` so the client can never bypass it. Sim is
always clearly labeled; all actions are logged to `execution_audit`.

---

## 8. User flow

**Happy path:** open rail → choose **Execute Entry** → system detects chart symbol → choose
account (equity/margin load) → buy/sell → enter SL/TP (or drag from chart, Phase 8) →
system computes lot + RR → AI checks setup → guardrails approve/caution/block → **Preview**
→ **Confirm** (hold-to-execute in live) → submit → status timeline → trade logged →
Position Manager unlocks.

**Failure flows (each has a designed state, not a generic error):** broker disconnected ·
token expired (silent server refresh, retry; if still failing → reconnect state) · quote
unavailable (entry disabled, "waiting for price") · invalid SL/TP (inline hint) ·
insufficient margin (preview blocks) · order rejected (reason card + keep draft) · market
closed (locked + next-open countdown) · duplicate submit blocked (button already locked).

---

## 9. Implementation phases

| Phase | Deliverable | Live risk |
|---|---|---|
| **1** | RightRail modular architecture — registry, shell, switchable tabs; Active Windows wrapped unchanged; `execution-console` side-slot variant wired | none |
| **2** | Execution Console **static premium UI** — all 10 sections, VANTARY teal-glass, mock/safe data, motion system | none |
| **3** | Risk engine + RR/lot/SL/TP **math** working locally (`useExecutionRisk`, shared with gadgets) | none |
| **4** | **Simulation mode** — fake submit, sim fills, sim position store, full status timeline | none |
| **5** | TradeLocker **integration contract** — all `/api/broker/*` routes + Supabase tables, **live execution feature-flagged OFF** | none |
| **6** | **Live broker connection** — real accounts, quotes, symbols, server-validated **preview** (no submit yet) | read-only |
| **7** | **Live execution with guardrails** — submit enabled only after preview/confirm/logs/safety all pass + server re-validation | gated |
| **8** | **Position management** — modify SL/TP, partial/full close, BE, trail; Streams API for fills | live |
| **9** | **Journal + AI review bridge** — auto journal entry + AI post-trade analysis | none |
| **10** | **QA + responsive** — desktop/laptop/tablet/mobile, collapsed rail, chart split, all failure states, reduced-motion, `agent-browser` verification | none |

Each phase ends with `tsc` (against the known ~28 pre-existing `your-space.tsx` baseline
errors) + `agent-browser` verification, per project convention.

---

## 10. Acceptance criteria (the definition of done)

- Looks like part of the premium Flight Deck system (VANTARY teal-glass, instrument kit).
- Does **not** look like copied TradingView; does **not** break or incorrectly overlap the chart.
- Opens from the right menu / chart toolbar / customize popover.
- Can **replace** the current Active Windows panel in the slot.
- Pin / collapse / resize.
- Runs in **simulation first**; account selection; SL/TP/RR/risk calculation; AI trade check.
- **Preview before execution**; **confirmation before live submit**; safe **locked states**.
- Beautiful loading / error / success states.
- **Ready for TradeLocker integration without faking live execution.**

---

## 11. File map (new + touched)

```
NEW
  components/dashboard/vantary/right-rail/right-rail-shell.tsx
  components/dashboard/vantary/right-rail/right-rail-registry.ts
  components/dashboard/vantary/right-rail/right-rail-provider.tsx
  components/dashboard/vantary/right-rail/panels/{active-windows,execution-console,
       position-manager,risk-control,journal-capture,ai-assist}-panel.tsx
  components/dashboard/vantary/execution-console/*       // ~18 components (Section 4)
  components/dashboard/vantary/execution-console/execution-console-provider.tsx
  lib/execution/{risk-engine,lot-size,rr,guardrails,sim-engine,broker-symbol-map}.ts
  lib/execution/types.ts
  app/api/broker/{accounts,quotes,orders,positions}/...route.ts   // Phase 5+
  app/api/journal/from-execution/route.ts
  lib/tradelocker/{client,auth,map,errors}.ts                     // server-only, Phase 5+
TOUCHED (additive, backwards-compatible)
  trading-desk/data.ts        // add "execution-console" to TdSideSlot + labels/impl maps
  trading-desk/side-slot.tsx  // dispatch "execution-console" → <RightRailShell/>
  trading-desk/modules/registry.ts // register the module
  (no behavior change to ActiveWindowPanel — it is wrapped, not modified)
```

---

## 12. Open questions for sign-off (before Phase 1)
1. **Rail vs side-slot:** mount the new RightRail as a *replacement* for the current side
   slot, or as a new `execution-console` slot variant alongside the existing ones?
   (Recommendation: new variant — zero regression, switchable, satisfies "can replace".)
2. **TradeLocker creds model:** per-user connect flow (email/password/server stored
   encrypted) vs platform-level OAuth-style? (Affects the Supabase `broker_connections` shape.)
3. **Sim equity source:** keep using `dashboard-data.ts` FTMO fixtures for sim, or seed a
   dedicated sim account in Supabase?
4. **AI Trade Check depth in Phase 2:** static heuristic verdict first, or wire the real
   ArchioAI endpoint immediately?
