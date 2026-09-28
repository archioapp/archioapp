# VANTARY · DESIGN & ENGINEERING DOCTRINE

> The standard. Read this before you write a line of code in this tree.
> If a change does not honor this charter it does not ship.

This file is the law of the land for every component, hook, and surface
under `components/dashboard/vantary/**` and the trading-desk module
graph below it. It is referenced from the header of every primitive in
the deck and trading-desk surface. Future modules — Psychology OS,
Forecast, Analyze, Community — must inherit it.

---

## 1 · The standard

We are building a **flight deck for traders**. The instruments must be
calm, fast, and beautifully restrained. Every pixel earns its place.
Every interaction earns its hover. Nothing decorates. Everything
expresses.

The reference bars are Qclay (cinematic restraint), Pitch (typographic
hierarchy and dense data calm), and xClay (futuristic precision with
monospaced telemetry texture). When in doubt, ask: *would those teams
ship this?* If the honest answer is no, do not ship it.

---

## 2 · The five non-negotiables

### 2.1 · Hairline editorial language
Every surface uses the VANTARY editorial vocabulary already established
in `vantary-theme.ts`:

- 1px hairline borders (`VANTARY.rule`) — never thicker.
- Monospaced uppercase eyebrows at `letterSpacing: 0.22em` for context.
- Editorial display headlines for protagonists (`fontWeight: 500`,
  negative tracking around `-0.01em`).
- Tabular numerals for every numeric reading — `fontVariantNumeric:
  "tabular-nums"`.
- One warm accent (`VANTARY.amber`) reserved for live, focus, and
  activity. Never decorative.

### 2.2 · Earned motion
Every interactive element must answer the question *what does the
hover teach the user?* If the hover does not communicate state,
direction, or affordance, it is not earned and does not ship.

Approved patterns, all already proven in the codebase:

- **Accent rail** — a 1px line that fades in along the top edge on
  hover or focus. Communicates *this surface is now interactive.*
- **Shine sweep** — a single 600–900ms gradient pass across the
  surface on hover-enter. One pass only. Never loops. Communicates
  *fresh, alive.*
- **Micro-rotation** — gear rotates, plus rotates 45°, arrow nudges
  in its direction. The icon teaches the action.
- **Lift** — `translateY(-1px)` on hover for tappable cards. No
  shadow gymnastics.
- **Border brighten** — `VANTARY.rule` → `VANTARY.ash` on hover.
  Never use a colored border for a hover state outside of the warn
  edge case.
- **Warn edge** — destructive controls (hide, remove, reset) borrow
  the warn tint *only* in the hover state. The resting state stays
  neutral so the control does not shout.

Forbidden:

- No infinite loop animations on UI chrome. Pulsing dots for *live*
  data are the exception.
- No bounce easing. Use `cubic-bezier(0.65, 0, 0.35, 1)` (`EASE_V`)
  or `cubic-bezier(0.34, 1.56, 0.64, 1)` (`EASE_LIFT`) only.
- No transform-scale on text. Only on icons.

### 2.3 · Color discipline
The user controls color via the theme switcher in the top-left
(teal · cyber · neural · quantum · solar · light · obsidian). Every
component reads color through `VANTARY.*` which routes through CSS
variables and inherits the active theme automatically.

**You do not pick colors.** Ever. If a component needs a new color
slot, add it to `vantary-theme.ts` so every theme can express it.

The structural language (typography, hierarchy, spacing, motion,
component anatomy) is the same in every theme. The skin changes;
the bones do not.

### 2.4 · Honesty in placeholders
A placeholder must read as *under construction*, not as content. Use
the registry's `description` field to render the planned intent in
dim type, not lorem ipsum. Use a `readiness: "planned"` dot. Never
lie to the user about what is wired.

### 2.5 · Persistence and reconciliation
Every customizable surface persists to localStorage with a versioned
key (e.g. `vantary.trading-desk.v3`). Every persisted shape goes
through a reconciler against the canonical registry on load — unknown
ids are dropped, missing fields fall back to defaults, ranges are
clamped. The user must never see a corrupt save.

---

## 3 · Architecture rules

### 3.1 · Registry is the spine
Every module on the trading-desk surface declares itself in
`trading-desk/modules/registry.ts`. Adding a future module is one
registry entry plus one renderer — never a refactor.

### 3.2 · Provider owns state, components read selectors
Components must not own state that the provider could own. If two
components need to share a value, that value lives in the provider.
The provider exposes `state`, `actions`, `selectors`, and convenience
hooks. Selectors do the resolution work so renderers stay lean.

### 3.3 · Compose, do not branch
The bay (`<TradingDeskShell/>`) and the deck surface
(`<DeckSurface/>`) compose under a single `<TradingDeskProvider/>`
so they share state automatically. Adding a new placement (header
chip, split panel, deck below, flight-deck overlay) is a new reader
of the same registry, not a new state silo.

### 3.4 · No cross-cutting refactors hidden inside feature work
If a change touches more than three files, it gets called out in the
postamble. The user gets to see exactly what was touched and why.

---

## 4 · Quality bar per layer

Every layer (1.1, 1.2, 1.3, …) is a deep, focused prompt's worth of
work — written as if a senior front-end team is reviewing it line by
line:

- **Comments teach.** The next person who opens the file should be
  able to ship a related feature without re-deriving the logic.
- **Defensive but not paranoid.** Hydration heals corrupt state.
  Reducers refuse invalid moves. Renderers tolerate missing fields.
- **No magic numbers without a label.** Either name the constant or
  put a comment explaining what it represents.
- **Prefer the existing primitive.** If `<DeckCard/>` already exists,
  use it. Do not build a parallel surface.
- **Postamble must be honest.** Every prompt ends with a 2–4 sentence
  summary that names the files touched, the contract added, the open
  questions, and the next layer. No celebratory language about
  "successfully completing" something.

---

## 5 · The deck below the chart — design intent

The area below TradingView is **the trader's instrument cluster**.
It must be:

- **Customizable.** One Customize button anchored top-right. Hide
  any module. Reorder any module. Restore defaults in one click.
- **Persistent.** The trader's choices survive reload, theme swap,
  and sandbox restart.
- **Coherent.** Whether one module is visible or all of them, the
  layout must read as intentional, never as half-built.
- **Extensible.** Adding Psychology OS, Forecast, Community Search
  is one registry entry plus one renderer — no surface refactor.

The button itself is hairline and quiet. Its hover earns its place
(accent rail, shine sweep, icon micro-rotation). The dropdown is a
panel of toggles and reorder controls in editorial type. Everything
on the surface reads the registry and the deck state — never owns
its own copy.

---

## 6 · When in doubt

Read this file again. If the change you are about to ship would
violate any of the five non-negotiables, stop, ask, and re-design.
We do not lower the bar to ship faster. We slow down to ship
better.

— v0, on behalf of the VANTARY team
