# 14 — ARCHIO Master Cross-Reference

**Date:** 20 September 2026
**Kind:** OPERATIONAL CONTROL DOCUMENT (not governance). `11-founder-direction-2026-09-19.md`, `01-decision-ledger.md` and DL-018 remain authoritative. This file connects `12` (what the user sees) and `13` (what makes it work) so that one feature has **one name, one ID and one trace** across every AI and every person on the project. Where the connection exposes a contradiction, it is **flagged** (§3, §9) — nothing in `00`–`11` is changed by this file.
**Built by:** v0, from `12` and `13` (themselves built from commit `08f58a1`, branch `v0/fxp1casso-52674d7b`), from `01`, `09`, `11` and from `docs/qclay-dashboard-page-inventory-master.md` (the legacy QClay map). Nothing here was invented; where a link could not be established it says `UNKNOWN` or `NEEDS-V0-VERIFICATION`.
**Owners:** Luke + Kan. Only they set `LUKE REVIEW` / `KAN REVIEW` / `FOUNDER DECISION STATUS`.
**Companion files:** `12-product-design-control-center.md` · `13-technical-backend-control-center.md`.

> **The question this file answers:** *Given any ARCHIO feature, by any of its names, where is it on the map, what does it need, how finished is it, who decides next, and what does each AI need to know about it?*

---

## 0. If you are an AI reading this for the first time (AI-to-AI briefing)

Read this section, then §1, then the record you were asked about. Do not read the whole file to answer one question.

**What ARCHIO is.** A trading product being built by two founders, Luke and Kan. Its founder-approved scope (`11` §1, DL-017, DECIDED 19 Sep 2026) is *the connected environment around the trader's entire journey*. Inside it, one important potential intelligence engine is the intent → trade → compare → review → memory loop (`02`, `03`, `10`, `11` §7) — an engine *inside* ARCHIO, not the definition of the company. The old wording "system of record for trading intentions" is superseded. The product name is ARCHIO (DL-007); "Trading Pilot" and every aviation name are dead (`09` §2).

**What phase we are in.** STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN (`11` §8, DL-018). The working objective is to begin constructing the **ARCHIO System Bible**. In this phase nobody implements product code, nobody invents features, nobody renames things without evidence. Three Grok bots produce *inputs* to the Bible (Product Brain **maps** · Red Team **challenges** · Architect **grounds** — `09` §4–5); v0 **verifies against the repo and builds**; ChatGPT **drafts and relays** (DL-015, outside the ledger); Luke and Kan **decide** (DL-014).

**What exists.** One Next.js 14 / Supabase / Stripe / Polygon repo. 30 page routes, 37 API route files, ≈56 dialog-like components, one 132k-line dashboard tree. Real: Supabase Auth, a `profiles` table, real Polygon market routes, two LLM endpoints, a complete but UI-less orgs/rooms/billing backend, a `groups` discovery read. Demo: **every number the trader would think is theirs** — no trade, decision, forecast, plan, journal entry, progress or notification is persisted anywhere (`13` §2.10, §3). 483 TypeScript errors are hidden by the build config (`13` S10).

**The seven Level-1 systems (Structural Map v1, founder-given — filed as `15-structural-map-v1.md` on 20 Sep 2026, DL-019; its §2 carries the binding decisions DL-020 tenancy Model B · DL-021 Intent Loop design shape only · DL-022 Education combination):** Flight Deck (`FD`) · Intent Loop / Decision experience (`IL`) · Market Experience (`MX`) · Education (`ED`) · Community & Opportunity (`CO`) · Ask Archio (`AA`) · Account / Money (`AM`). Three Level-4 / VISION interfaces: Trading Passport / verified proof (`TP`) · Social / creator / marketplace (`SM`) · agents / workflows (`AG`). Plus the global shell (`SH`) and founder/marketing surfaces (`MK`) which are inventoried but are not the product. **The Structural Map v1 document is not in the repo** (§9 F-9) — the system list above is the founders' own wording from the 20 Sep request and is the only authority until the map is filed.

**How to talk about any feature.** Use its canonical ID from §1 (`<SYSTEM>-<TYPE>-<NNN>`) and its canonical name from §2. If someone uses another name, look it up in §3.1 (aliases) — do not create a new name. If you cannot find it, say `NOT IN REGISTER` and stop; do not describe it from memory.

**What you may not do.** Contradict a DECIDED ledger entry (`01`) · state a code fact without citing `08`, `12`, `13` or a dated v0 verification · mark anything APPROVED · resolve a naming conflict (§3) · design UI for the orgs/rooms/memberships backend because it exists (`01` rejected ideas; `12` F-8) · describe the loop as the company · paste this file into a bot context pack wholesale (§8).

**Standing facts to hold** (from `README`): Kan has no students and does not trade actively; whether Luke trades is unstated (DL-010). The repo has no trades / decisions / plans table and no broker connection. On the loop's ladder we stand at node 0 (CAPTURE) with no evidence for node 1. Kill criteria are per hypothesis (`02` §5), never one for the whole thesis.

---

## 1. Master ID index

Every control record in `12`, one line each, with the two statuses and the `13` foundations it depends on. `L` = Luke review, `K` = Kan review; both are `NOT REVIEWED` (`NR`) for every line in this first edition because no written approval exists for any surface. Foundations are `13` §4 IDs (F1–F15). Ranges (`001…026`) are one record covering many near-identical items.

### 1.1 `SH` — Global shell

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| SH-NAV-001 | Floating left-edge navigation | `(main)` layout | V0 DRAFT | FUNCTIONAL (client) | — | NR | NR |
| SH-NAV-002 | User button | `(main)` layout | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-NAV-003 | Providers mounted on every `(main)` page | `app/(main)/layout.tsx` | — | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-001 | Login | `/login` | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-002 | Register | `/register` · `components/auth/IdentityCreation.tsx` | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-003 | Forgot password | `/forgot-password` | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-004 | Reset password | `/reset-password` | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-005 | Verify email | `/verify-email` (inline page, 286 lines) | ROUGH | FUNCTIONAL | F1 | NR | NR |
| SH-STATE-001 | Auth callback (×2) | `/auth/callback`, `/api/auth/callback` | — | FUNCTIONAL · duplicate | F1 | NR | NR |
| SH-STATE-002 | Route protection | `lib/supabase/middleware.ts` | — | protects 8 non-existent routes (S7) | F2 | NR | NR |
| SH-STATE-003 | Global loading | `app/loading.tsx`, `app/login/loading.tsx` | ROUGH | effectively absent | — | NR | NR |
| SH-STATE-004 | Global error / not-found | none (0 `error.tsx`, 0 `not-found.tsx`) | NOT DESIGNED | — | — | NR | NR |
| SH-STATE-005 | Toasts | `components/ui/toaster` | V0 DRAFT | FUNCTIONAL | — | NR | NR |

### 1.2 `FD` — Flight Deck

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| FD-PAGE-001 | Flight Deck / Your Space | `/dashboard` · `vantary/your-space.tsx` (33,482 lines) | V0 DRAFT | MOCK DATA | F5 F8 F10 | NR | NR |
| FD-NAV-001 | Room Navigator (4 rooms × 4 doors) | `FLIGHT_DECK_ROOMS` | V0 DRAFT | FUNCTIONAL (nav) | — | NR | NR |
| FD-NAV-002 | Focus-rail dropdown | `vantary/focus-rail-dropdown.tsx` | V0 DRAFT | UI ONLY | — | NR | NR |
| FD-NAV-003 | Theme switcher (7 themes) | `vantary/theme-switcher.tsx` | V0 DRAFT | FUNCTIONAL (client) | F8 | NR | NR |
| FD-PANEL-001 | Flight Deck Hub (control room) | `cartouche/flight-deck-hub.tsx` | V0 DRAFT | UI ONLY | — | NR | NR |
| FD-PANEL-002 | Gadget inspector | `cartouche/gadget-inspector.tsx` | V0 DRAFT | UI ONLY | — | NR | NR |
| FD-PANEL-003 | Side detail rail | `vantary/side-detail-rail.tsx` | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| FD-MODAL-001 | Template picker | `cartouche/template-picker.tsx` | V0 DRAFT | UI ONLY | F8 | NR | NR |
| FD-SEARCH-001 | Command palette | `vantary/command-palette.tsx` | V0 DRAFT | FUNCTIONAL (client) | — | NR | NR |
| FD-WIDGET-001…026 | Living gadgets v1 | `cartouche/living-gadgets.tsx` | V0 DRAFT | MOCK DATA | F5 F6 F10 | NR | NR |
| FD-WIDGET-027…039 | Living gadgets v2 | `cartouche/living-gadgets-v2.tsx` | V0 DRAFT | MOCK DATA | F5 F6 F10 | NR | NR |
| FD-WIDGET-040…051 | Legacy dashboard modules (12) | `components/dashboard/modules/` | ROUGH | MOCK DATA | F5 F9 | NR | NR |
| FD-SECTION-001 | Active Window | `vantary/active-window/` | V0 DRAFT | MOCK DATA | F5 F6 | NR | NR |
| FD-SECTION-002 | Trading Desk | `vantary/trading-desk/` (40 files) | V0 DRAFT | PARTIAL (TradingView real) | F6 F10 | NR | NR |
| FD-SECTION-003 | Strategy OS | `vantary/strategy-os/` | V0 DRAFT | MOCK DATA | F5 F8 | NR | NR |
| FD-SECTION-004 | Jarvis surfaces | `vantary/jarvis/` | V0 DRAFT | MOCK DATA | F7 F8 | NR | NR |
| FD-SECTION-005 | Response-engine registry | `vantary/response-engine/registry.tsx` | V0 DRAFT | FUNCTIONAL | F7 | NR | NR |
| FD-SECTION-006 | Command Desk | `components/dashboard/command-desk/` | ROUGH | MOCK DATA | — | NR | NR |
| FD-TPL-001…010 | Flight Deck templates (10 files, 19 `warming()` stubs) | `vantary/flight-deck/templates/` | V0 DRAFT | MOCK DATA (community-hub fetches real) | F3 F8 | NR | NR |
| FD-STATE-001 | Session debrief overlay | `vantary/session-debrief.tsx` | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| FD-STATE-002 | First-run / onboarding | none | NOT DESIGNED | — | F8 | NR | NR |
| FD-STATE-003 | Empty state (zero trades) | none — **most important missing state** | NOT DESIGNED | — | F5 | NR | NR |
| FD-STATE-004 | Error state | `deck-stage-error-boundary.tsx` only | NOT DESIGNED (elsewhere) | — | — | NR | NR |
| FD-STATE-005 | Responsive / mobile | `hooks/use-mobile.tsx` | UNKNOWN | UNKNOWN | — | NR | NR |

### 1.3 `IL` — Intent Loop / Decision experience

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| IL-PAGE-001 | Forecast Hub | `/forecast` · `components/forecast-hub/` (24,417 lines) | V0 DRAFT | MOCK DATA | F5 F4 | NR | NR |
| IL-DRAWER-001 | Forecast submit drawer | forecast-hub | V0 DRAFT | UI ONLY (discards) | F5 | NR | NR |
| IL-DRAWER-002 | Forecast detail drawer | forecast-hub | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| IL-PANEL-001 | Forecast detail intelligence (13.5k lines) | forecast-hub | V0 DRAFT | MOCK DATA | F5 F7 | NR | NR |
| IL-TAB-001…004 | Feed / My Record / Leaderboard / Archive | forecast-hub | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| IL-MODAL-001 | Legacy forecast modals (10 loose components) | `components/*forecast*` | ROUGH | MOCK DATA · likely SUPERSEDED | F5 | NR | NR |
| IL-PAGE-002 | Execution Copilot | `/copilot` · `components/execution-copilot/` | V0 DRAFT | MOCK DATA | F5 F6 F10 | NR | NR |
| IL-PANEL-002 | Copilot "buddy" system (52 files) | `components/copilot/` | V0 DRAFT | MOCK DATA | F5 F4 | NR | NR |
| IL-DRAWER-003 | Copilot drawer | `CopilotDrawer.tsx` | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| IL-TAB-005…013 | Copilot tabs (9) | copilot rail | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| IL-MODAL-002 | Tutorial overlays (4) | copilot | V0 DRAFT | UI ONLY | F14 | NR | NR |
| IL-FLOW-001 | Copilot onboarding | `copilot/onboarding/` | V0 DRAFT | UI ONLY | F8 | NR | NR |
| IL-SECTION-001 | Live Room ledger | `live-room/session-store.tsx`, `session-state.ts` | — | client state (F4 shape) | F4 F11 | NR | NR |
| IL-SECTION-002 | Scenario system | `*scenario*`, `lib/scenario-store.ts` | ROUGH | MOCK DATA | F5 | NR | NR |
| IL-STATE-001 | Empty / first-decision state | none | NOT DESIGNED | — | F5 | NR | NR |
| IL-STATE-002 | Review after outcome | FD debrief + Post-Mortem door only | NOT DESIGNED (real) | — | F5 F7 | NR | NR |

### 1.4 `MX` — Market Experience

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| MX-PAGE-001 | Signal Terminal | `/` · `live-market-intelligence.tsx` | V0 DRAFT | MOCK DATA (`generateMockPriceData`) | F6 | NR | NR |
| MX-PAGE-002 | Macro Economic | `/intelligence` · `mrkt-intelligence-dashboard.tsx` | V0 DRAFT | PARTIAL | F6 | NR | NR |
| MX-PAGE-003 | Nexus | `/nexus` · `components/nexus/` | V0 DRAFT | MOCK DATA | F6 F7 | NR | NR |
| MX-SECTION-001 | Confluence system | `*confluence*`, `ultra-confluence/`, `lib/confluences.ts` | V0 DRAFT | PARTIAL | F6 | NR | NR |
| MX-SECTION-002 | Multi-timeframe (MTF) | `components/mtf/`, `lib/multi-timeframe-analysis.ts` | V0 DRAFT | PARTIAL | F6 | NR | NR |
| MX-SECTION-003 | Session / liquidity / range analysis | `session-analysis-display.tsx` (58 TS errors, dead `/api/market/stats`) | ROUGH | MOCK DATA + dead call | F6 | NR | NR |
| MX-SECTION-004 | Charts (TradingView embed + overlays) | `trading-view-widget.tsx`, `components/charts/` | V0 DRAFT | PARTIAL | F6 F10 | NR | NR |
| MX-SECTION-005 | Oracle | `components/oracle/`, `vantary/oracle-command-console.tsx` | V0 DRAFT | MOCK DATA | F6 F7 | NR | NR |
| MX-SECTION-006 | Analysis history & boxes | `analysis-*`, `lib/stores/useAnalysis.ts` | ROUGH | PARTIAL | F6 F15 | NR | NR |
| MX-STATE-001 | Market-closed / weekend state | — | UNKNOWN | UNKNOWN | F6 | NR | NR |
| MX-STATE-002 | Data-unavailable state | — | UNKNOWN | masked by mocks | F6 | NR | NR |

### 1.5 `ED` — Education

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| ED-PAGE-001 | The Cockpit (guided narrative) | `/cockpit` · `components/cockpit/` | V0 DRAFT | UI ONLY | F14 | NR | NR |
| ED-PAGE-002 | Student Collaboration Hub | `/hub` (only login-gated page) | ROUGH | MOCK DATA | F14 F3 | NR | NR |
| ED-SECTION-001 | Mentor method components (10) | `components/mentor/` | ROUGH | MOCK DATA | F14 | NR | NR |
| ED-SECTION-002 | Coach & tutorials | `copilot/coach/`, `lib/stores/coach.ts` | ROUGH | MOCK DATA | F14 | NR | NR |
| ED-MODAL-001 | Guide / education modals | `ProfessionalGuideModal`, `EducationPopup`, `ShortcutsOverlay` | V0 DRAFT | UI ONLY | F14 | NR | NR |
| ED-SECTION-003 | Glossary / explain-term | `live-room/glossary.ts`, `explain-term.tsx` | V0 DRAFT | FUNCTIONAL (static) | F14 F7 | NR | NR |
| ED-STATE-001 | Progress / completion | none | NOT DESIGNED | — | F14 | NR | NR |
| ED-STATE-002 | Curriculum browser / course / enrollment | none | NOT DESIGNED | — | F14 F13 | NR | NR |

### 1.6 `CO` — Community & Opportunity

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| CO-PAGE-001 | Community Discovery | `/communities` · `communities/DiscoveryEngine.tsx` | V0 DRAFT | PARTIAL (real `groups` + mock fallback) | F3 F15 | NR | NR |
| CO-PANEL-001 | Floating Community Hub (13 views) | `community-panel/floating-community-hub.tsx` (15,862 lines) | V0 DRAFT | MOCK DATA | F3 F11 | NR | NR |
| CO-PAGE-002 | Live Call History | `/history` | V0 DRAFT | MOCK DATA | F11 F13 | NR | NR |
| CO-PAGE-003 | Live Room | `/live-room` + hub `live-stage` · `components/live-room/` (23 files) | V0 DRAFT | MOCK DATA (scripted ledger) | F11 F4 | NR | NR |
| CO-DRAWER-001 | Inspector drawer (narrow) | live-room | V0 DRAFT | FUNCTIONAL (client) | — | NR | NR |
| CO-DRAWER-002 | Transport drawer (replay/pulse) | live-room | V0 DRAFT | MOCK DATA | F11 | NR | NR |
| CO-DRAWER-003 | Proof / Weakness drawers | `ProofDrawer`, `WeaknessDrawer` | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| CO-PANEL-002 | Leaderboards (×3) | community-panel, forecast-hub, `premium-leaderboard.tsx` | V0 DRAFT | MOCK DATA · duplication | F5 | NR | NR |
| CO-PANEL-003 | Notification center | `community-panel/notification-center.tsx` | V0 DRAFT | MOCK DATA | F9 | NR | NR |
| CO-PANEL-004 | Member profile hover/card | `member-profile.tsx`, `profile/ProfileHoverCard.tsx` | V0 DRAFT | MOCK DATA | F1 F2 | NR | NR |
| CO-TPL-001…007 | Community templates in Flight Deck | see FD-TPL | V0 DRAFT | MOCK (1 real) | F3 | NR | NR |
| CO-STATE-001 | Join / request / invite flow | backend exists, no UI | NOT DESIGNED | BACKEND-READY | F3 F2 | NR | NR |
| CO-STATE-002 | Create a community / mentor studio | `groups_insert_own` policy, no UI | NOT DESIGNED | BACKEND-READY | F3 | NR | NR |
| CO-STATE-003 | Community detail / preview page | `CommunityInspector` panel only | NOT DESIGNED (page) | — | F3 | NR | NR |

### 1.7 `AA` — Ask Archio

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| AA-AI-001 | Command layer (command bar) | `components/command/`, `lib/command/` → `POST /api/command` (gpt-5-mini) | V0 DRAFT | FUNCTIONAL (unauth, ungrounded) | F7 | NR | NR |
| AA-AI-002 | Grounded response engine | `POST /api/archio` (gpt-4.1-mini + Polygon), `lib/response-engine/`, `ask-answer-surface.tsx` | V0 DRAFT | FUNCTIONAL (General only; demo journal) | F7 F6 | NR | NR |
| AA-TPL-001 | Generated-template surfaces | `response-engine/registry.tsx` | V0 DRAFT | FUNCTIONAL | F7 | NR | NR |
| AA-AI-003 | Copilot chat (scripted) | `copilot/chat/CopilotChatPanel.tsx` → `/api/copilot/chat` (keyword matcher) | V0 DRAFT | MOCK (scripted) | — | NR | NR |
| AA-AI-004 | Oracle command console | `vantary/oracle-command-console.tsx` | V0 DRAFT | MOCK DATA | F7 | NR | NR |
| AA-AI-005 | Nexus AI synthesis panel | `nexus/nexus-ai-synthesis-panel.tsx` | V0 DRAFT | MOCK DATA | F7 | NR | NR |
| AA-AI-006 | Mentor AI chat | `mentor/MentorAIChat.tsx` | ROUGH | MOCK DATA | F7 | NR | NR |
| AA-AI-007 | Loose AI shells (8) | `ai-*.tsx`, `AIInsightPopup` | ROUGH | MOCK DATA | F7 | NR | NR |
| AA-AI-008 | Jarvis narration | see FD-SECTION-004 | V0 DRAFT | MOCK DATA | F7 F8 | NR | NR |
| AA-STATE-001 | Streaming / thinking state | `ask-answer-surface` | V0 DRAFT | FUNCTIONAL | F7 | NR | NR |
| AA-STATE-002 | AI error / refusal / rate-limit | — | UNKNOWN | no per-user limits (S5) | F7 F2 | NR | NR |
| AA-STATE-003 | Assistance style controls (quiet ↔ proactive) | none (`11` §5) | NOT DESIGNED | — | F8 | NR | NR |
| AA-STATE-004 | Consent / "what ARCHIO knows about you" | none (`11` §2) | NOT DESIGNED | — | F2 F8 | NR | NR |

### 1.8 `AM` — Account / Money

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| AM-PAGE-001 | Profile | `/profile` · `components/profile/` (10) | V0 DRAFT | MOCK DATA (demo-mentor toggle) | F1 F2 | NR | NR |
| AM-SECTION-001 | Accounts module | `dashboard/modules/accounts.tsx`, `useAccounts.ts` | ROUGH | MOCK DATA | F10 F5 | NR | NR |
| AM-STATE-001 | Settings | none (`/settings` protected but absent) | NOT DESIGNED | — | F1 F8 | NR | NR |
| AM-STATE-002 | Billing / plans / upgrade | backend complete (`plans`, `subscriptions`, 4 routes, webhook), 0 UI | NOT DESIGNED | BACKEND-READY | F12 | NR | NR |
| AM-STATE-003 | Organisation / room administration | backend complete (`orgs`, `rooms`, `memberships`, `invites`), 0 UI — **do not design** (`12` F-8) | NOT DESIGNED | BACKEND-READY | F3 | NR | NR |
| AM-STATE-004 | Connected accounts / broker | `ProfileConnections`, `execution-console` | V0 DRAFT | INTEGRATION BLOCKED | F10 | NR | NR |
| AM-STATE-005 | Data & privacy controls | none (`11` §2) | NOT DESIGNED | — | F2 | NR | NR |
| AM-STATE-006 | Delete account / export | none | NOT DESIGNED | — | F1 F2 | NR | NR |

### 1.9 `TP` · `SM` · `AG` — Level-4 / VISION

| ID | Canonical name | What exists | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| TP-SECTION-001 | Trading Passport / verified proof | "My Record" tab (IL-TAB-001…004 "My Record"), Proof drawer (CO-DRAWER-003), pitch slides | V0 DRAFT fragments | VISION ONLY | F5 F2 | NR | NR |
| SM-SECTION-001 | Social / creator / marketplace | Room Navigator door copy, pitch Act IV, legacy System 05 | NOT DESIGNED | VISION ONLY | F3 F12 F13 | NR | NR |
| AG-SECTION-001 | Agents / workflows | pitch "clone agents", legacy 05.5 | NOT DESIGNED | VISION ONLY | F4 F7 F8 | NR | NR |

### 1.10 `MK` — Founder, marketing, internal (not the product)

| ID | Route | Purpose | Note |
|---|---|---|---|
| MK-PAGE-001 | `/welcome` | landing (variant 1) | `12` F-12: two landings + QClay's |
| MK-PAGE-002 | `/archio` | landing (variant 2) | idem |
| MK-PAGE-003 | `/pitch` | 35-slide founder deck | narrative canon, not UI canon |
| MK-PAGE-004 | `/newpitch` | deck variant | UNKNOWN which is current |
| MK-PAGE-005 | `/owen`, `/owen/guide`, `/owen/presenter` | TradeLocker meeting decks | Owen ask = read-only only (DL-004) |
| MK-PAGE-006 | `/masterplan` | internal plan page | — |
| MK-PAGE-007 | `/design` | design-system page | reference for §3 design tokens |
| MK-PAGE-008 | `/backend-map` | internal backend map | must not be mistaken for `13` |
| MK-PAGE-009 | `/playground/glass-demo`, `/playground/glass-popup` | experiments | — |
| MK-PAGE-010 | `/docs/ultra-breakdown` | confluence explainer | closest thing to product docs |

**Flows** (`12` §9.2): `FLOW-001…012` are indexed there; §4 of this file traces them. **Design register** items are `12` §8.x. **Security flags** are `13` §7 S1–S10. **Audit flags** are `12` §12 F-1…F-15. **Foundations** are `13` §4 F1–F15. Decision-ledger entries are `01` DL-001…DL-018.

---

## 2. Master feature / system matrix

One record per system (the seven Level-1 systems, the shell, the three VISION interfaces, the MK surfaces). Every record has the same 24 fields in the same order. Field definitions are in Appendix A. `OWNER: PROPOSED` means v0's placement is arguable and a founder must confirm.

### 2.1 SH — Global shell

- **CANONICAL NAME:** Global shell
- **ALIASES / LEGACY NAMES:** "the app shell", "Global application shell" (QClay legacy §4), "(main) layout", "floating nav", "the rail"
- **STRUCTURAL MAP LEVEL:** outside the map — a prerequisite every Level-1 system inherits
- **OWNER SYSTEM:** none (shared). Auth pages are here because identity is a foundation, not a product system.
- **USER-FACING SURFACES:** SH-NAV-001/002/003 · SH-PAGE-001…005 · SH-STATE-001…005
- **IMPORTANT SUBFEATURES:** left-edge navigation · user button · five auth screens · route protection · loading / error / not-found · toasts
- **ROUTES / COMPONENTS:** `app/(main)/layout.tsx`, `app/layout.tsx`, `components/auth/*`, `/login /register /forgot-password /reset-password /verify-email /auth/callback`, `lib/supabase/middleware.ts`
- **ASSOCIATED DATA:** `auth.users` (Supabase), `profiles` (`001_auth_schema.sql`)
- **TECHNICAL FOUNDATIONS:** F1 Identity (REAL) · F2 Permissions (PARTIAL + flag)
- **AI DEPENDENCY:** none
- **INTEGRATION DEPENDENCY:** Supabase Auth (real). Email = Supabase's own auth mail only (`13` §3.5)
- **PRIVACY / PERMISSION SENSITIVITY:** **High** — `profiles_select_all USING (true)` makes bios/avatars public by default (S8); middleware gates only non-existent routes (S7)
- **CURRENT DESIGN STATUS:** V0 DRAFT (auth kit) · ROUGH (`/verify-email`) · NOT DESIGNED (error/not-found/first-run)
- **CURRENT FUNCTIONAL STATUS:** FUNCTIONAL (auth) · absent (states)
- **CURRENT BACKEND STATUS:** REAL (F1) · duplicate callback (`/auth/callback` + `/api/auth/callback`) · 8 `/api/auth/*` routes with zero UI callers
- **FOUNDER DECISION STATUS:** **DL-023 DECIDED (20 Sep 2026) — social-style configurable privacy model.** Public / marketing / auth / help surfaces may be signed-out; the personalised product requires login; a profile may have a shareable social-facing layer the user controls; connections never auto-expose private account / intelligence data; public-profile · connection-shared · private-account information are three separate tiers. **D1 scope = the public-vs-authenticated boundary only**; the social permission matrix is a future dedicated block. *Previously:* ~~none recorded~~ **Second session, 20 Sep 2026: DL-026 DECIDED (philosophy) — product-first exploration:** a signed-out visitor explores the real product environment (TradingView-like), never a login wall; identity is asked for at the moment of need (identity · persistence · personalisation · private data · community participation · personal AI context · account info · saved settings · deeper use); never another user's private data. **OPEN:** exact signed-out limits (route + action list = D1 output). **DL-027 DECIDED (direction):** login *and* registration land in the Dashboard / Flight Deck workspace (routes unchanged). **DL-029:** face scan = DEMO/SIMULATION · real secure auth (device biometrics / passkeys · email · codes · phone) = FOUNDER DIRECTION · KYC / account integrity = OPEN · five concepts separate. **DL-023 addendum:** Instagram-familiar configurable visibility recorded (public / connections / deliberately shared / never-shared private), matrix still a later block.
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy §4 "Global application shell" (4.1 persistent zones · 4.2 three presentation modes · 4.3 persistent Archio AI · 4.4 required global states). QClay's landing work is blocked on the dashboard shell existing.
- **GROK BOT RESPONSIBLE (planning):** Architect (which surfaces are private, F2 reframe) · Red Team (is a public profile a leak?)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §4 · `13` §2.4, §4 F1–F2, §7 S7–S8 · `08` auth section
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/SH/` — none yet
- **BLOCKERS:** none technical. ~~Decision-blocked on "which surfaces are private" (S7).~~ Boundary decided (DL-023); the concrete route list is a **D1 output** for founder review, not a further decision.
- **NEXT REQUIRED DECISION:** ~~*Which pages require login?* (fill in: `/dashboard` [ ] `/forecast` [ ] `/copilot` [ ] `/communities` [ ] `/profile` [ ] `/` [ ]) and *are profiles public by default?* [ ] yes [ ] no~~ **DECIDED 20 Sep 2026 (DL-023):** rule = personalised product behind login, public / marketing / auth / help signed-out; profiles have a public layer + user-controlled social layer + always-private account / intelligence layer. Next: D1 proposes the route-by-route list under that rule; founders tick it. **Refined by DL-026 (20 Sep, second session):** the list is a route **+ action** list — which public product surfaces are explorable signed-out and which actions trigger the login / register ask (Q-23). Also open: the fate of the face-scan UI (Q-27); KYC / account-integrity requirement (Q-25).

### 2.2 FD — Flight Deck

- **CANONICAL NAME:** Flight Deck — *as the `15` L1-1 document handle.* **The user-visible name is OPEN (DL-030, 20 Sep 2026):** the founders use **Dashboard · Flight Deck · Command Center** as related, unresolved terms; do not force one. **"Your Space" and "Trading Terminal" are not authoritative** product names (code / title identifiers only) unless the founders revive them.
- **ALIASES / LEGACY NAMES:** "Your Space" (`your-space.tsx` — **not authoritative**, DL-030), "the dashboard" (`/dashboard`), "Command Center" (tab title — a live founder term), "Trading Terminal" (site `<title>` — **not authoritative**, DL-030), "the cockpit surface" (`09` §2 — **not** `/cockpit`, which is Education), "Vantary" (component tree name), legacy QClay SYSTEM 01 (01.1 Workspace/Home · 01.2 Morning Brief · 01.3 Workspace Customizer · 01.4 Account & Execution Center · 01.5 Notifications & Interventions · 01.6 Archio AI Expanded Workspace), "Home Base" (dead), "Trader OS" (dead)
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Flight Deck
- **USER-FACING SURFACES:** FD-PAGE-001 · FD-NAV-001…003 · FD-PANEL-001…003 · FD-MODAL-001 · FD-SEARCH-001 · FD-WIDGET-001…051 · FD-SECTION-001…006 · FD-TPL-001…010 · FD-STATE-001…005
- **IMPORTANT SUBFEATURES:** Room Navigator (4 rooms × 4 doors = 16 doors: 9 href · 2 template · 4 Ask · 1 event) · living gadgets (≈26 v1 + 13 v2) · Active Window / day playbook · Trading Desk (chart + execution console) · Strategy OS (dna · exposure · rules · mirror · sync · intel) · Jarvis narration · 7 visual themes · command palette · templates · session debrief
- **ROUTES / COMPONENTS:** `/dashboard` → `components/dashboard/vantary/` (148 files) + `components/dashboard/modules/` (12) + `command-desk/` (3); `components/dashboard/` total 132,260 lines / 167 files
- **ASSOCIATED DATA:** **none of its own.** Every number is demo telemetry (`13` §2.10). Would need: trades / decisions (F5), broker fills (F10), layout & preferences (F8), notifications (F9)
- **TECHNICAL FOUNDATIONS:** F5 (MISSING) · F6 (REAL — used by trading desk) · F8 (MISSING) · F10 (MISSING) · F9 (MISSING)
- **AI DEPENDENCY:** Ask doors → AA-AI-002 (real) · Jarvis copy (mock) · generated templates via F7
- **INTEGRATION DEPENDENCY:** TradingView embed (real, no data back) · broker (none — DL-004 read-only in v2)
- **PRIVACY / PERMISSION SENSITIVITY:** **Highest once real** — it is the trader's whole record on one screen. Today none (all demo).
- **CURRENT DESIGN STATUS:** V0 DRAFT (most developed visual surface in the product) · NOT DESIGNED: first-run, empty, error, mobile
- **CURRENT FUNCTIONAL STATUS:** MOCK DATA end to end; navigation, themes, palette are FUNCTIONAL client state
- **CURRENT BACKEND STATUS:** MISSING for everything it displays
- **FOUNDER DECISION STATUS:** **DL-024 DECIDED (20 Sep 2026) — zero-data first open = GUIDED EMPTY STATE** (real Flight Deck, no fake personal numbers, useful and alive, guides first actions, exploration without mandatory onboarding, optional gradual configuration, explains what areas become with real information; a lightweight guide may support it — the onboarding system is not invented in D1). **DL-025 DECIDED — keep the four-category command-centre model for now:** the four areas are a **user navigation / command-centre abstraction**, not the seven systems; names MARKET FLOOR · STUDIO · MENTOR HALL · COLLECTIVE kept **provisionally**, D1 inspects name-fit; working term **zones** (not "rooms"); `/cockpit` collision recorded for a later rename (name open). Still open: theme count (`12` §8.14, Q-4). *Previously:* ~~none recorded. Open: theme count, room names (§3.1 N-7), what a zero-data trader sees (FD-STATE-003)~~ **Second session, 20 Sep 2026:** **DL-025 addendum — zone model DECIDED (kept, provisional); zone NAMES + placement of the 16 destinations OPEN for Product Brain review; do not rename / move yet; not rooms.** **DL-024 addendum — guided empty state reconfirmed; a short optional post-sign-in tutorial = FOUNDER DIRECTION; full tutorial design = OPEN / later block.** **DL-027 DECIDED (direction) — this workspace is the single destination after login and registration (routes unchanged).** **DL-030 — highly customisable trader workspace (chart · gadgets · controls beside / below the chart · themes · layout · quick settings · mentor-resold configurations = FUTURE/VISION) = FOUNDER DIRECTION; the name Dashboard / Flight Deck / Command Center = OPEN.** **DL-028 — Ask Archio guides exploration conversationally = FOUNDER DIRECTION.** **DL-026 — public product surfaces explorable signed-out; limits OPEN.** **22 Sep 2026 — DL-031 PROVISIONAL D1 DESIGN DIRECTION (Luke approves; Kan's asynchronous review pending — NOT joint approval; names reversible):** the four zones survive the Product Brain / Red Team reconciliation as **MARKET FLOOR** ("see what is happening in markets right now": Intelligence · Daily Brief · Live Calls, history = later sub-mode) · **TRADING DESK** (reversible; "work on my trading": **ONE** Forecasts entry · Copilot · Post-Mortem) · **THE ACADEMY** (reversible; "learn how to trade better": Education + honest Compare / Mentor AI shells; discipline is cross-cutting) · **THE COLLECTIVE** ("find people and participate": Communities · The Floor · Collab Hub; Marketplace = FUTURE home, not a door). Ask Archio, Nexus (absorption candidate, code kept), profile / account chrome and Flight Deck customisation are **global chrome, not zone doors**. Centralized / Decentralized multi-environment contexts = FUTURE/VISION, UX OPEN, not in D1 chrome. **D1 Block 2 opened the same day as design-definition** (`docs/lego/D1-block-2-first-use.md`): the signed-out product-first experience + the guided zero-data first Flight Deck experience, across three user states.
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** **Highest.** Legacy 01.1–01.6 map onto FD-PAGE-001, Active Window (≈01.2 Morning Brief), FD-MODAL-001/FD-PANEL-002 (≈01.3 Customizer), FD-SECTION-002 + AM-SECTION-001 (≈01.4), FD-WIDGET notifications (≈01.5), AA-AI-002 (≈01.6). QClay said the landing page cannot finish until these interfaces exist.
- **GROK BOT RESPONSIBLE (planning):** Product Brain (what problem the Flight Deck solves on day 1 with zero data) · Red Team (is a 33k-line demo a liability?) · Architect (F5/F8/F10 boundary)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.1, §8.14 · `13` §2.10, §8 · `11` §4 (Prepare) · `01` rejected "TradingView as centre" (F-7)
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/FD/` — none yet; `/pitch` Act III slides are narrative references only
- **BLOCKERS:** F5 + F10 for any real number; F8 for remembering layout; ~~founder decision on empty state~~ → decided (DL-024); the empty state is now a D1 design deliverable
- **NEXT REQUIRED DECISION:** ~~*What does a trader with zero trades see on first open?* [ ] guided empty state [ ] demo mode clearly labelled DEMO [ ] onboarding flow first~~ **DECIDED 20 Sep 2026 — GUIDED EMPTY STATE (DL-024).** Still open: *how many themes ship?* [ ] 1 [ ] 2 [ ] 7 (Q-4). After D1's inspection: *does each zone name fit what lives beneath it?* keep / rename-for-fit per zone (DL-025 follow-up) → **now routed to the Product Brain (Q-24): evaluate the four-zone organisation and the placement of all 16 destinations; founders decide after the Red Team challenge.** Also open: the visible name of this workspace (Q-26, DL-030); the tutorial design (later block, DL-024 addendum). **22 Sep 2026: Q-24 now has a PROVISIONAL answer (DL-031, Luke); Kan's asynchronous review = Q-28; N-21 (the zone "Trading Desk" vs the chart + execution surface "Trading Desk") must be resolved before any label reaches the UI. The decisions Block 2 needs before code are listed in `docs/lego/D1-block-2-first-use.md` §7.**

### 2.3 IL — Intent Loop / Decision experience

- **CANONICAL NAME:** Intent Loop / Decision experience
- **ALIASES / LEGACY NAMES:** "the loop", "the loop engine" (`11` §7), "Decision Desk" (legacy QClay SYSTEM 03, `09` nine systems), "Forecast Hub" (code), "Execution Copilot" (code), "Copilot" / "buddy", "Scenario", "trade plan", "Pre-Trade Contract" (legacy 03.5), "Decision Builder" (03.4), "Auto-Journal" (03.7), "Autopsy Replay" (03.9), "Trade Review" (ritual)
- **STRUCTURAL MAP LEVEL:** Level 1 (the *experience*); its data engine is the ladder nodes 0–4 (`10`)
- **OWNER SYSTEM:** Intent Loop / Decision experience — **OWNER: PROPOSED** for Forecast Hub (could be MX or TP), Scenario system (could be MX), Live Room ledger (could be CO)
- **USER-FACING SURFACES:** IL-PAGE-001/002 · IL-DRAWER-001…003 · IL-PANEL-001/002 · IL-TAB-001…013 · IL-MODAL-001/002 · IL-FLOW-001 · IL-SECTION-001/002 · IL-STATE-001/002
- **IMPORTANT SUBFEATURES:** forecast submit / detail / feed / record / leaderboard / archive · copilot 9 tabs (AI Copilot · Edge Tracker · Entry · Live Feed · Mentor Dashboard · Psychology · SL · Strategy OS · TP) · copilot onboarding · scenario create/edit · Live Room ledger (`SessionEvent`) · session debrief
- **ROUTES / COMPONENTS:** `/forecast` (`components/forecast-hub/`, 24,417 lines) · `/copilot` (`components/execution-copilot/` 35 files + `components/copilot/` 52 files / 38,053 lines) · 10 loose legacy forecast components · `lib/scenario-store.ts`
- **ASSOCIATED DATA:** **none persisted.** `forecast_groups` is an orphan join to a `forecasts` table that was never created (`13` §3.3); `copilot_events` is dead (`13` §3.2). Ledger objects that *should* exist: Decision Record (`decision_records`), `trades`, `decision_reviews` (Architect parked spec, `09` §4.3), `lock_lead_seconds` (DL-013), per-field provenance (DL-011)
- **TECHNICAL FOUNDATIONS:** F5 (MISSING) · F4 (MISSING, dead shape) · F10 (MISSING, CSV first) · F7 (REAL pattern, for the one Review call — DL-003)
- **AI DEPENDENCY:** by ledger exactly one call in v1: the Review (DL-003). Today: Post-Mortem door over a demo journal (AA-AI-002); copilot chat is scripted (AA-AI-003)
- **INTEGRATION DEPENDENCY:** broker fills for COMPARE — CSV import first, TradeLocker read-only later (DL-004)
- **PRIVACY / PERMISSION SENSITIVITY:** **Highest** — intentions before outcome are the most sensitive trader data; `11` §2 requires permission
- **CURRENT DESIGN STATUS:** V0 DRAFT (rich UI for the *shape* of a decision) · ROUGH (legacy modals) · NOT DESIGNED: first-decision empty state, real review, one-tap capture (DL-012)
- **CURRENT FUNCTIONAL STATUS:** MOCK DATA / UI ONLY — submit discards, plan does not save
- **CURRENT BACKEND STATUS:** MISSING. The bounded loop (DL-006) implementation stays **parked by decision** — **DL-021 (20 Sep 2026): this phase is DESIGN SHAPE ONLY**; `09` §4 loop tasks remain parked
- **FOUNDER DECISION STATUS:** DL-001, DL-003, DL-011, DL-012, DL-013 DECIDED for the *engine*; **DL-021 DECIDED for the phase — design the fit / UX / shape / flows and learn the data model, implement nothing**; the *experience* (which of Forecast Hub / Copilot / Scenario is the capture surface) is still undecided (Q-11). Contradiction `12` F-6 (long forms vs one tap).
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy SYSTEM 03 (03.1–03.9) is the closest map; **name conflict** Decision Desk ↔ Intent Loop (§3.1 N-1). Nothing here is ready for QClay: function is not approved.
- **GROK BOT RESPONSIBLE (planning):** Product Brain (parked: capture hypothesis) · Red Team (parked: "order is the intention"; weeks 1–4 value gap) · Architect (parked: three-table spec). **All parked by founders — do not resume without assignment.**
- **SOURCE-OF-TRUTH REFERENCES:** `02`, `03`, `10` (the loop) · `11` §7 · `01` DL-001/003/006/011/012/013 · `12` §5.2, §12 F-6 · `13` §3.2, §3.3, §4 F4–F5, §8
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/IL/` — none yet
- **BLOCKERS:** implementation parked by decision (DL-021) — design of the shape proceeds; F5 absent; three intent-shaped UIs with no canonical object (§3.1 N-11)
- **NEXT REQUIRED DECISION:** ~~*Un-park the bounded loop in this phase?* [ ] yes — assign the three parked bot tasks [ ] no — design the *experience* only, no persistence [ ] defer entirely until FLOWS phase is done~~ **DECIDED 20 Sep 2026 — DESIGN SHAPE ONLY (DL-021).** Next open: Q-11 — which UI, if any, becomes Decision-Record capture (D5).

### 2.4 MX — Market Experience

- **CANONICAL NAME:** Market Experience
- **ALIASES / LEGACY NAMES:** "Signal Terminal" (`/`), "Macro Economic" (`/intelligence`), "Nexus", "MARKET FLOOR" (Room Navigator room), `market-floor` (response-engine `RoomId`), "market intelligence", "Oracle", "confluence", "MTF"
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Market Experience — **OWNER: PROPOSED** for Oracle (could be AA), Nexus (could be AA), Charts (shared with FD Trading Desk)
- **USER-FACING SURFACES:** MX-PAGE-001…003 · MX-SECTION-001…006 · MX-STATE-001/002
- **IMPORTANT SUBFEATURES:** live prices / signals · macro dashboard · Nexus mindmap · confluence editor + modals + ultra-confluence · MTF · session / liquidity / range · TradingView charts + overlays · Oracle · analysis history
- **ROUTES / COMPONENTS:** `/`, `/intelligence`, `/nexus`, `/docs/ultra-breakdown`; ~40 loose analysis components; `components/mtf/`, `components/nexus/`, `components/oracle/`, `components/ultra-confluence/`, `lib/confluences.ts`, `lib/multi-timeframe-analysis.ts`, `lib/stores/useAnalysis.ts`
- **ASSOCIATED DATA:** none of the user's. Market data via `/api/polygon/*`, `/api/market/*` (3 + 2 routes, server-side, REAL). `/api/market/stats` is called twice and **does not exist**.
- **TECHNICAL FOUNDATIONS:** F6 (REAL, unauthenticated — S6) · F15 (PARTIAL, analysis history)
- **AI DEPENDENCY:** none required. Nexus AI panel and Oracle are mock; grounded questions go to AA-AI-002
- **INTEGRATION DEPENDENCY:** Polygon.io (real key), TradingView `tv.js` embed (real), `FINNHUB_KEY`/`ALPHAVANTAGE_KEY` referenced (`13` §9: production presence unverifiable)
- **PRIVACY / PERMISSION SENSITIVITY:** Low (public market data). Cost exposure via unauthenticated proxies (S6).
- **CURRENT DESIGN STATUS:** V0 DRAFT · ROUGH (session analysis, analysis boxes) · `mtf-theme.ts` is a second de-facto design system (`12` §8)
- **CURRENT FUNCTIONAL STATUS:** PARTIAL — real Polygon on `/dashboard` trading desk; **`/` still renders `generateMockPriceData`** (`12` F-11)
- **CURRENT BACKEND STATUS:** REAL and sufficient (F6). Nothing new needed to stop being demo (`13` §8).
- **FOUNDER DECISION STATUS:** none recorded. `01` rejects "TradingView as the centre" as differentiator; it is the centre of `/copilot` and the desk (`12` F-7 — "fine as a feature" clause may cover it)
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** no dedicated legacy system — market content lives inside legacy 01 Flight Deck and 03.2 "Create Forecast / Market Read". Charts are QCLAY POLISH LATER candidates once function is approved.
- **GROK BOT RESPONSIBLE (planning):** Red Team (is any of this differentiated vs TradingView's own AI copilot?) · Architect (F6 hardening: auth + cache)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.3, §12 F-7, F-11 · `13` §2.6, §2.7, §4 F6, §7 S6, §8 · `11` §3 (General intelligence: markets, instruments, sessions, events, news)
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/MX/` — none yet
- **BLOCKERS:** none technical. Honesty fix is cheap (swap mock for the existing snapshot route; delete dead `/api/market/stats` calls).
- **NEXT REQUIRED DECISION:** *What is `/` after login?* [ ] Signal Terminal with real data [ ] redirect to Flight Deck [ ] a lighter "today" page — and *keep TradingView as the chart?* [ ] yes (feature) [ ] replace later

### 2.5 ED — Education

- **CANONICAL NAME:** Education
- **ALIASES / LEGACY NAMES:** "The Cockpit" (`/cockpit` — a guided narrative, **not** the Flight Deck), "Student Hub" / "Student Collaboration Hub" (`/hub`), "mentor method", "MethodVault", "coach", "tutorials", "glossary", legacy 02.5 "Room Memory / Knowledge Library", 02.7 "Student Progress", "General ARCHIO Intelligence — education layer" (`11` §3)
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Education — **OWNER: PROPOSED** for tutorial overlays (also IL), mentor components (also CO), glossary (also AA)
- **USER-FACING SURFACES:** ED-PAGE-001/002 · ED-SECTION-001…003 · ED-MODAL-001 · ED-STATE-001/002
- **IMPORTANT SUBFEATURES:** guided narrative (7 sections) · student dashboard · mentor method vault / entry models · coach Q&A · guide/shortcut modals · glossary + explain-term (the one *contextual* pattern)
- **ROUTES / COMPONENTS:** `/cockpit` (`components/cockpit/`), `/hub` (`student-collaboration-hub.tsx`, `hub/`), `components/mentor/` (10), `copilot/coach/`, `live-room/glossary.ts` + `explain-term.tsx`
- **ASSOCIATED DATA:** **none.** No course, lesson, curriculum, enrollment, progress or content table; no storage bucket; no CMS (`13` §3.1). `community_mentors.total_students` is a seeded integer.
- **TECHNICAL FOUNDATIONS:** F14 (MISSING — undefined) · F13 (MISSING, media) · F7 (glossary → contextual intelligence)
- **AI DEPENDENCY:** potential — explain-term is the seed for contextual General intelligence (`11` §3). Today static.
- **INTEGRATION DEPENDENCY:** none
- **PRIVACY / PERMISSION SENSITIVITY:** Medium once progress exists (a student's progress visible to a mentor requires permission — `11` §2)
- **CURRENT DESIGN STATUS:** V0 DRAFT (cockpit) · ROUGH (hub, mentor, coach) · NOT DESIGNED: progress, curriculum, enrollment
- **CURRENT FUNCTIONAL STATUS:** UI ONLY / MOCK DATA throughout
- **CURRENT BACKEND STATUS:** **zero** (`13` §3.1 verdict)
- **FOUNDER DECISION STATUS:** **DL-022 DECIDED (20 Sep 2026) — COMBINATION:** a dedicated ARCHIO learning system (structured learning experiences · mentor-created educational content · student access / progression) **plus** educational content and intelligence surfacing contextually across Community, Ask Archio, Flight Deck, onboarding and other experiences. Creator / mentor knowledge feeding AI agents or marketplace products = VISION, not a commitment. *Previously:* ~~the system has no definition — what Education is in ARCHIO is unstated in `11`~~
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy 02.5 + 02.7 only. Nothing for QClay until defined.
- **GROK BOT RESPONSIBLE (planning):** **Product Brain first** (define the system: problem, journey position, connections) · then Red Team · then Architect (F14 shape)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.4 · `13` §3.1, §4 F14, §8 · `11` §3, §4 (Learn)
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/ED/` — none yet
- **BLOCKERS:** ~~definition~~ — resolved (DL-022). Now: the Education flows (learning-system side and contextual-surfacing side) must be mapped in the FLOWS phase before any ED screen is designed (D7); F14 shape follows those flows.
- **NEXT REQUIRED DECISION:** ~~*What is Education in ARCHIO?* [ ] structured courses [ ] mentor-authored method inside communities [ ] contextual explanations everywhere (glossary pattern) [ ] combination: ________~~ **DECIDED 20 Sep 2026 — COMBINATION (DL-022).** No further founder decision needed before the FLOWS-phase mapping; Product Brain maps the two sides, Red Team challenges, Architect grounds F14.

### 2.6 CO — Community & Opportunity

- **CANONICAL NAME:** Community & Opportunity
- **ALIASES / LEGACY NAMES:** "Community" (legacy SYSTEM 02; `09` nine systems), "COLLECTIVE" and "MENTOR HALL" (Room Navigator rooms), "Community Hub" (floating panel), "groups" (DB, ×3 DDL), "orgs / rooms / memberships" (DB, second tenancy model), "Live Room" / "live-stage" / "Live Call" / "War Room", "Mentor's Ledger" (DL-002 entry wedge), "cohort", "Social Network" (`09` — the feed, *separate* from Community), "Network / Marketplace" (founder discussion)
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Community & Opportunity — **OWNER: PROPOSED** for Live Room (also IL ledger, F11), leaderboards (also IL/TP), notification center (also SH/F9)
- **USER-FACING SURFACES:** CO-PAGE-001…003 · CO-PANEL-001…004 · CO-DRAWER-001…003 · CO-TPL-001…007 · CO-STATE-001…003
- **IMPORTANT SUBFEATURES:** discovery with dimension filters · floating hub with 13 views (5 hard-coded example rooms) · Live Room (resizable workspace, inspector deck, talk dock, theater mode) · live call history · leaderboards ×3 · notification center · member profile card · **missing:** join / request / invite, create community, community detail page
- **ROUTES / COMPONENTS:** `/communities` (`components/communities/`), `/history`, `/live-room`; `components/community-panel/` (15 files, 15,862 lines), `components/live-room/` (23 files, 6,440 lines), `community-hub-gate.tsx` on every `(main)` page
- **ASSOCIATED DATA:** `groups`, `group_members`, `group_invites`, `community_mentors` (Model A — `community-schema.sql`, `community.sql`, `create-community-tables.sql`, `005`, `006`) **and** `orgs`, `rooms`, `memberships`, `invites` (Model B — session-checked, Zod-validated routes, zero UI). `forecast_groups` (dead). `mentor_notifications` (one writer, no reader). Which `groups` DDL the live DB has: `CANNOT VERIFY LIVE DB FROM REPO`. **DL-020 (20 Sep 2026): Model B is the target structure; Model A is superseded for design — both table sets remain as repo facts until a migration is separately approved.**
- **TECHNICAL FOUNDATIONS:** F3 (PARTIAL, **duplicated** — founder decision) · F11 (MISSING — no realtime, no live transport) · F9 (MISSING) · F15 (PARTIAL — discovery filters) · F2
- **AI DEPENDENCY:** none required. Live Room "instruments" derive lenses deterministically from the `SessionEvent` ledger (good pattern for `13` §5).
- **INTEGRATION DEPENDENCY:** live audio/video/stream provider — **none chosen** (F11 "provider choice first")
- **PRIVACY / PERMISSION SENSITIVITY:** **High** — membership, mentor↔student visibility, live sessions recorded; `01` warns the repo's org/mentor shape is not evidence of demand
- **CURRENT DESIGN STATUS:** V0 DRAFT (discovery, hub, Live Room — the Live Room is the most *recently* designed surface, Masterplan II) · NOT DESIGNED: join, create, detail page
- **CURRENT FUNCTIONAL STATUS:** PARTIAL (discovery reads real `groups` with mock fallback — FLOW-005, **stops at "join"**) · MOCK elsewhere
- **CURRENT BACKEND STATUS:** two competing tenancy models, both partial; membership/invite backend exists with no front door (FLOW-011)
- **FOUNDER DECISION STATUS:** DL-002 (entry wedge = Mentor's Ledger, cohort) DECIDED; **DL-020 DECIDED (20 Sep 2026) — tenancy = Model B: organization / community → rooms / channels → memberships / access, one model; Model A `groups` superseded for design; Discord-familiar mental model, not a literal copy, no rooms invented from the example**; `01` rejected "letting repo architecture define the market" (still binds: the Model B API existing is not a reason to design admin UI, `12` F-8)
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy SYSTEM 02 (02.1 Discovery ≈ CO-PAGE-001 · 02.2 Detail/Preview ≈ CO-STATE-003 · 02.3 Live Room ≈ CO-PAGE-003 · 02.4 Catch Me Up = no UI · 02.5/02.7 → ED · 02.6 Mentor Studio ≈ CO-STATE-002). Discovery + Live Room are the two surfaces closest to "FOUNDER APPROVED FUNCTION / QCLAY VISUAL POLISH".
- **GROK BOT RESPONSIBLE (planning):** Architect (F3 — ground **Model B** `orgs → rooms → memberships → invites` against the real SQL now that it is decided, DL-020; name what a migration off `groups` would touch, **without scheduling it**) · Red Team (is the hub's 13-view scope justified? which of the 5 example rooms is real?) · Product Brain (Opportunity = what, exactly?)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.5, §9.2 FLOW-005/011/012, §12 F-8, F-13 · `13` §2.2, §3.4, §4 F3, F9, F11, §7 S1, S4, §8 · `01` DL-002, rejected ideas · `02` (org shape ≠ demand)
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/CO/` — none yet; `docs/live-room-design-masterplan.md` (Masterplan I + II)
- **BLOCKERS:** ~~F3 decision blocks join/create/detail design~~ — resolved (DL-020); join / room-entry design can proceed against Model B. Still blocking: D-1 collapse + migration discipline need a **separate** approval (B-6); F11 provider blocks anything live being real
- **NEXT REQUIRED DECISION:** ~~*One tenancy model:* [ ] Model A `groups` (community-first, discovery already reads it) [ ] Model B `orgs → rooms → memberships` (admin-first, full API, no UI) [ ] merge: ________~~ **DECIDED 20 Sep 2026 — Model B (DL-020).** Still open: *"Opportunity" means:* ________ (Q-7) · room names (Q-3).

### 2.7 AA — Ask Archio

- **CANONICAL NAME:** Ask Archio
- **ALIASES / LEGACY NAMES:** "Personal ARCHIO Intelligence" and "General ARCHIO Intelligence" (`11` §3 — these are *layers*, not surfaces), "Archio AI" / "Persistent Archio AI" (legacy §4.3, 01.6), "command bar" / "Command layer" (code `/api/command`), "response engine" / "grounded response engine" (code `/api/archio`), "Jarvis" (FD narration), "Oracle" (MX), "Copilot chat" (scripted), "Nexus AI", "Mentor AI", "AI Team" (dead)
- **STRUCTURAL MAP LEVEL:** Level 1 (the *surface*); the intelligence layers are cross-cutting (`11` §3)
- **OWNER SYSTEM:** Ask Archio — **OWNER: PROPOSED** for Oracle, Jarvis, Nexus AI (each could stay in its host system as a *consumer* of AA)
- **USER-FACING SURFACES:** AA-AI-001…008 · AA-TPL-001 · AA-STATE-001…004
- **IMPORTANT SUBFEATURES:** command bar (intent parser, capability matrix, streamed reply) · grounded answers (structured JSON → template registry: `trade-post-mortem`, `asset-deep-dive`, generic) · quick actions · streaming state · **missing:** assistance style (quiet ↔ proactive), consent / "what ARCHIO knows about you", error / refusal / rate-limit
- **ROUTES / COMPONENTS:** `POST /api/command` (`openai/gpt-5-mini`) · `POST /api/archio` (`streamObject`, `openai/gpt-4.1-mini`, `maxDuration 30`, real Polygon grounding) · `POST /api/copilot/chat` (keyword matcher — **not AI**) · `components/command/`, `lib/command/`, `lib/response-engine/` (`router.ts`, `contract.ts`, `journal.ts` = labelled demo book), `vantary/cartouche/ask-answer-surface.tsx`, `ask-quick-actions.tsx`, `archio-room/`
- **ASSOCIATED DATA:** reads **no user table**. `/api/archio` has no `.from()` call; its "journal" is a demo book. Personal grounding would need F4/F5/F8.
- **TECHNICAL FOUNDATIONS:** F7 (REAL — General only, unauthenticated) · F6 (grounding) · F8 (MISSING — personal memory) · F2 (quota/consent)
- **AI DEPENDENCY:** this *is* the AI surface. Two real LLM endpoints via AI Gateway model IDs; one scripted. Classification totals in `13` §6.2.
- **INTEGRATION DEPENDENCY:** Vercel AI Gateway (zero-config), Polygon for grounding
- **PRIVACY / PERMISSION SENSITIVITY:** **High** the moment personal grounding exists (`11` §2 "with the user's permission"); **Medium now** (cost — S5, no per-user quota)
- **CURRENT DESIGN STATUS:** V0 DRAFT · NOT DESIGNED: assistance style, consent, error/refusal · no rule yet that generated surfaces obey the design system (`12` §8.15)
- **CURRENT FUNCTIONAL STATUS:** FUNCTIONAL for General questions (FLOW-003, FLOW-004) · MOCK for every "personal" answer
- **CURRENT BACKEND STATUS:** REAL pattern to reuse; needs auth + quota (S5); personal layer MISSING
- **FOUNDER DECISION STATUS:** DL-003 (AI in v1 = one call, the Review) applies to the *loop engine*; `11` §3 names the two intelligence layers; which of the ~8 AI-labelled surfaces is *the* Ask Archio is undecided (§3.1 N-2, N-8). **DL-028 (20 Sep 2026) — FOUNDER DIRECTION, not a spec:** inside the Flight Deck, Ask Archio / the question bar guides users conversationally (*what are you? · what can you do? · where do I go? · how does this work?*) and may naturally encourage login / registration when a signed-out user reaches for identity- or persistence-bound features (DL-026). No assistant / onboarding logic is designed by it. **DL-031 (22 Sep 2026, provisional — Luke): Ask Archio is global Flight Deck chrome — never forced into a zone; Nexus is a likely legacy duplicate whose broad "all-knowing ARCHIO" job Ask Archio absorbs — absorption candidate, code kept (D-19).**
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy §4.3 "Persistent Archio AI" + 01.6 "Archio AI Expanded Workspace". QClay excluded "AI modules" from their quote — that exclusion now maps to hardening one existing pattern (F7), not inventing one (`13` §10).
- **GROK BOT RESPONSIBLE (planning):** Architect (F7 reuse; AI vs deterministic table per system — `13` §5) · Red Team (TradingView AI Chart Copilot, TradeZella agents — what is ours?) · Product Brain (what does "personal" mean before the model has data)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.6, §8.15, §9.2 FLOW-003/004 · `13` §2.3, §4 F7–F8, §5, §6, §7 S5 · `11` §2, §3, §5 · `01` DL-003
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/AA/` — none yet
- **BLOCKERS:** auth/quota (small); personal grounding blocked on F4/F5/F8; naming (N-2, N-8)
- **NEXT REQUIRED DECISION:** *Which surface is "Ask Archio"?* [ ] command bar (`/api/command`) [ ] grounded engine (`/api/archio`) [ ] one merged surface — and *Oracle / Jarvis / Nexus AI are:* [ ] the same thing under other names → retire names [ ] distinct features → each needs a definition

### 2.8 AM — Account / Money

- **CANONICAL NAME:** Account / Money
- **ALIASES / LEGACY NAMES:** "Profile", "Settings" (absent), "Accounts module" (FD), "Account & Execution Center" (legacy 01.4), "Portfolio" (legacy SYSTEM 06), "Net Worth" (legacy SYSTEM 07), "Connections & Wallets" (06.2), "My Money" (dead), "billing / plans / subscriptions" (DB), "orgs" (DB — **not** this system's UI to design)
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Account / Money — **OWNER: PROPOSED** for Accounts module (also FD), Connections (also F10)
- **USER-FACING SURFACES:** AM-PAGE-001 · AM-SECTION-001 · AM-STATE-001…006
- **IMPORTANT SUBFEATURES:** profile (header, stats, identity, badges, activity, mentor/student modules, connections) · accounts module · **missing:** settings, billing UI, connected broker, privacy controls, delete/export
- **ROUTES / COMPONENTS:** `/profile` (`components/profile/` 10 files, `lib/stores/useProfile.ts`), `dashboard/modules/accounts.tsx`, `lib/stores/useAccounts.ts`, `ProfileConnections`, `trading-desk/execution-console/`
- **ASSOCIATED DATA:** `profiles` (REAL, F1) · `plans`, `subscriptions` (REAL, `002_seed_plans.sql`, Stripe webhook handles `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated|deleted`) · `/api/subscriptions/checkout|portal|current|me`, `/api/users/*` — **all with zero UI callers** · broker accounts: none
- **TECHNICAL FOUNDATIONS:** F1 (REAL) · F12 (PARTIAL — backend real, no UI) · F10 (MISSING) · F2 · F13 (avatar upload — MISSING)
- **AI DEPENDENCY:** none
- **INTEGRATION DEPENDENCY:** Stripe (real backend; dashboard products vs `plans` seed unverifiable — `13` §9) · broker (none)
- **PRIVACY / PERMISSION SENSITIVITY:** **High** — money, identity, public-profile default (S8), export/delete are legal obligations
- **CURRENT DESIGN STATUS:** V0 DRAFT (profile) · ROUGH (accounts) · NOT DESIGNED: settings, billing, privacy, delete/export
- **CURRENT FUNCTIONAL STATUS:** MOCK DATA (profile has a demo-mentor toggle) · INTEGRATION BLOCKED (broker)
- **CURRENT BACKEND STATUS:** REAL and waiting (F1, F12) — "backend without a front door"
- **FOUNDER DECISION STATUS:** DL-004 (broker read-only in v2). Pricing appears only in pitch slides; no plan/price decision recorded. **Guard rail:** do not design org/room admin because the API exists (`12` F-8).
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy 01.4, SYSTEM 06 Portfolio (06.1–06.6), SYSTEM 07 Net Worth (07.1–07.2) — **name conflict** Portfolio ↔ Net Worth ↔ Account / Money (§3.1 N-4). Settings + billing are classic "FOUNDER APPROVED FUNCTION / QCLAY VISUAL POLISH" candidates once function is decided.
- **GROK BOT RESPONSIBLE (planning):** Architect (F12 wiring is cheap; F10 CSV-first) · Red Team (public profiles; who pays and for what) · Product Brain (does Account / Money include Portfolio and Net Worth, or are those separate systems?)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.7, §12 F-8 · `13` §2.2, §2.3, §4 F1, F10, F12, §7 S8, §8 · `01` DL-004, rejected ideas
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/AM/` — none yet
- **BLOCKERS:** none technical for profile/settings/billing UI; broker is DL-004-gated
- **NEXT REQUIRED DECISION:** *Does Account / Money absorb legacy Portfolio (06) and Net Worth (07)?* [ ] yes, as sections [ ] no, they are future Level-1 systems [ ] they are VISION — and *ship a real settings + billing page in this phase?* [ ] yes [ ] no

### 2.9 TP — Trading Passport / verified proof (Level 4 / VISION)

- **CANONICAL NAME:** Trading Passport / verified proof
- **ALIASES / LEGACY NAMES:** "Passport", "Verified Track Record", "AI Verified Track Record" (`09` nine systems), "My Record" (IL-TAB-001…004 "My Record"), "Proof drawer" (CO-DRAWER-003), "public record" (pitch Act III), "verified proof"
- **STRUCTURAL MAP LEVEL:** Level 4 / VISION
- **OWNER SYSTEM:** TP (VISION) — fragments live in IL and CO today
- **USER-FACING SURFACES:** TP-SECTION-001 (fragments only)
- **IMPORTANT SUBFEATURES:** none built as such. Concept: a shareable, verifiable record of decisions-before-outcome (depends on `lock_lead_seconds`, DL-013)
- **ROUTES / COMPONENTS:** none of its own
- **ASSOCIATED DATA:** would be a *read model* over F5 (decision records + trades + reviews) with F2 visibility rules
- **TECHNICAL FOUNDATIONS:** F5 (MISSING) · F2 · F13 (share images)
- **AI DEPENDENCY:** none required (verification is arithmetic — `13` §5)
- **INTEGRATION DEPENDENCY:** broker fills for verification (F10)
- **PRIVACY / PERMISSION SENSITIVITY:** **Highest** — public by definition; opt-in only
- **CURRENT DESIGN STATUS:** NOT DESIGNED (fragments V0 DRAFT)
- **CURRENT FUNCTIONAL STATUS:** VISION ONLY
- **CURRENT BACKEND STATUS:** MISSING (right of REVIEW on the ladder = VISION, `09` §2)
- **FOUNDER DECISION STATUS:** DL-013 makes `lock_lead_seconds` the honesty metric — the *seed* of proof is decided; the product is not
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** none of the seven legacy systems is this exactly; nearest legacy 03.3 "Forecast Detail / Resolution" and 04.7 "DNA History". Not for QClay in this phase.
- **GROK BOT RESPONSIBLE (planning):** none in this phase (VISION). Red Team when un-parked (Invo, Fomo — proof-as-product competitors, `09` §2).
- **SOURCE-OF-TRUTH REFERENCES:** `12` §6 · `10` (ladder) · `01` DL-013 · `09` §2
- **SCREENSHOTS / REFERENCE LINKS:** `/pitch` Act III "Verified Record" slide (narrative)
- **BLOCKERS:** everything left of it on the ladder
- **NEXT REQUIRED DECISION:** *canonical name:* [ ] Trading Passport [ ] Verified Track Record [ ] other: ________ (name only — no design)

### 2.10 SM — Social / creator / marketplace (Level 4 / VISION)

- **CANONICAL NAME:** Social / creator / marketplace
- **ALIASES / LEGACY NAMES:** "The Marketplace" (legacy SYSTEM 05: 05.1–05.7), "AI Agent Marketplace" (`09`), "Social Network" (`09` — the feed), "Network", "creator storefront", "Layout Publisher", "Creator Intelligence" (ladder), "Opportunity" (possibly — see CO)
- **STRUCTURAL MAP LEVEL:** Level 4 / VISION
- **OWNER SYSTEM:** SM (VISION) — boundary with CO "Opportunity" is **undefined** (§3.1 N-6)
- **USER-FACING SURFACES:** SM-SECTION-001 (none built)
- **IMPORTANT SUBFEATURES:** none built. Concept: creators publish agents / layouts / method; ARCHIO takes a share (pitch Act IV "GMV math")
- **ROUTES / COMPONENTS:** none; Room Navigator door copy and pitch slides only
- **ASSOCIATED DATA:** none. Would need F3 (creator = community owner?), F12 (payouts), F13 (assets)
- **TECHNICAL FOUNDATIONS:** F3 · F12 · F13 · F4 (all MISSING or partial)
- **AI DEPENDENCY:** agents (AG) if the marketplace sells agents
- **INTEGRATION DEPENDENCY:** Stripe Connect or equivalent for payouts — not present
- **PRIVACY / PERMISSION SENSITIVITY:** High (money to creators, public storefronts)
- **CURRENT DESIGN STATUS:** NOT DESIGNED
- **CURRENT FUNCTIONAL STATUS:** VISION ONLY
- **CURRENT BACKEND STATUS:** MISSING
- **FOUNDER DECISION STATUS:** none; `01` warns against letting repo architecture (orgs) define the market. **DL-031 (22 Sep 2026, provisional — Luke): Marketplace's conceptual long-term home = THE COLLECTIVE / Community & Opportunity family; NOT a D1 door, NOT approved for implementation; preserved in future architecture planning so the creator / opportunity vision is not lost. Not designed in D1 Block 2.**
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy SYSTEM 05 in full — **flag:** QClay's locked map has this as a core system; the Structural Map v1 has it as VISION. QClay must be told which map is current.
- **GROK BOT RESPONSIBLE (planning):** none in this phase
- **SOURCE-OF-TRUTH REFERENCES:** `12` §6 · `10` (right branch of the ladder) · `01` rejected ideas · `09` §2
- **SCREENSHOTS / REFERENCE LINKS:** `/pitch` Act IV slides
- **BLOCKERS:** VISION by decision
- **NEXT REQUIRED DECISION:** *Is "Opportunity" in "Community & Opportunity" the Level-1 seed of this system?* [ ] yes [ ] no — Opportunity means: ________

### 2.11 AG — Agents / workflows (Level 4 / VISION)

- **CANONICAL NAME:** Agents / workflows
- **ALIASES / LEGACY NAMES:** "AI agents", "clone agents" (pitch), "Agent Builder / Training Studio" (legacy 05.5), "AI Team" (dead), "PERSONALISED AI → AGENTS → WORKFLOWS" (ladder), "background agents" (TradeZella competitor framing)
- **STRUCTURAL MAP LEVEL:** Level 4 / VISION
- **OWNER SYSTEM:** AG (VISION)
- **USER-FACING SURFACES:** AG-SECTION-001 (none built)
- **IMPORTANT SUBFEATURES:** none. Governance constraint already decided: **agents never place orders** (`09` §4.3 Architect rules; DL-004)
- **ROUTES / COMPONENTS:** none
- **ASSOCIATED DATA:** would consume F4 (event spine) + F8 (personal memory)
- **TECHNICAL FOUNDATIONS:** F4 · F7 · F8 (MISSING)
- **AI DEPENDENCY:** total
- **INTEGRATION DEPENDENCY:** none until defined
- **PRIVACY / PERMISSION SENSITIVITY:** Highest (an agent acting on personal data)
- **CURRENT DESIGN STATUS:** NOT DESIGNED
- **CURRENT FUNCTIONAL STATUS:** VISION ONLY
- **CURRENT BACKEND STATUS:** MISSING
- **FOUNDER DECISION STATUS:** none beyond "never execute"
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy 05.2 Agent Listing, 05.5 Agent Builder. Not for QClay.
- **GROK BOT RESPONSIBLE (planning):** none in this phase
- **SOURCE-OF-TRUTH REFERENCES:** `12` §6 · `10` · `09` §4.3 · `01` DL-004
- **SCREENSHOTS / REFERENCE LINKS:** `/pitch` Act IV "clone agents"
- **BLOCKERS:** VISION by decision
- **NEXT REQUIRED DECISION:** none in this phase

### 2.12 MK — Founder, marketing and internal surfaces

- **CANONICAL NAME:** Founder / marketing / internal surfaces
- **ALIASES / LEGACY NAMES:** "the pitch", "Owen deck", "landing", "design page", "backend map", "playground"
- **STRUCTURAL MAP LEVEL:** outside the product
- **OWNER SYSTEM:** none (founders)
- **USER-FACING SURFACES:** MK-PAGE-001…010 — **not user-facing**; public only by URL
- **IMPORTANT SUBFEATURES:** two landings · two decks · Owen decks · masterplan · design page · backend map · playgrounds · ultra-confluence explainer
- **ROUTES / COMPONENTS:** `/welcome`, `/archio`, `/pitch`, `/newpitch`, `/owen*`, `/masterplan`, `/design`, `/backend-map`, `/playground/*`, `/docs/ultra-breakdown`
- **ASSOCIATED DATA:** none
- **TECHNICAL FOUNDATIONS:** none
- **AI DEPENDENCY:** none · **INTEGRATION DEPENDENCY:** none
- **PRIVACY / PERMISSION SENSITIVITY:** Medium — internal pages (`/backend-map`, `/masterplan`, `/owen/presenter`) are publicly routable; decide whether they should be
- **CURRENT DESIGN STATUS:** V0 DRAFT (decks are polished narrative; `/design` is a token showcase)
- **CURRENT FUNCTIONAL STATUS:** FUNCTIONAL as pages
- **CURRENT BACKEND STATUS:** n/a
- **FOUNDER DECISION STATUS:** none. `12` F-12: two landings + QClay's landing work = three
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** **direct** — QClay's landing page cannot finish until the product interfaces exist; `/welcome` and `/archio` overlap their work
- **GROK BOT RESPONSIBLE (planning):** none (bots do not see MK)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §7, §12 F-12 · memory files (Owen deck, pitch) are **not** bot inputs
- **SCREENSHOTS / REFERENCE LINKS:** none needed
- **BLOCKERS:** none
- **NEXT REQUIRED DECISION:** *Which landing survives?* [ ] `/welcome` [ ] `/archio` [ ] QClay's [ ] none until product exists — and *hide internal routes behind login?* [ ] yes [ ] no

---

## 3. Naming and duplication control

**Rule:** a name is *canonical* only if it appears in `11`, `01` (DECIDED), the Structural Map v1 as given by the founders, or the `12` register. Everything else is an alias until a founder rules. **v0 does not resolve these. It flags them.** A resolution is recorded in `01` as a DL entry, then mirrored here (status → `DECIDED`, alias table updated) and logged in §5.

### 3.1 Naming conflicts register

| # | Names in play | Evidence (where each name lives) | What is actually different | Status | Who rules |
|---|---|---|---|---|---|
| **N-1** | **Decision Desk** vs **Intent Loop / Decision experience** vs "the loop" vs Forecast Hub vs Execution Copilot | Decision Desk: QClay legacy SYSTEM 03, `09` §2 nine systems · Intent Loop / Decision experience: Structural Map v1 (founders, 20 Sep) · "the loop": `02`, `10`, `11` §7 · Forecast Hub / Execution Copilot: code | Decision Desk was a *page family* (03.1–03.9). Intent Loop is a *system*; "the loop" is its *engine*. Forecast Hub and Copilot are two *UIs* that each partially resemble 03.2/03.4. | **FLAGGED** — founders raised it | Luke + Kan |
| **N-2** | **Ask Archio** vs **Personal ARCHIO Intelligence** vs General ARCHIO Intelligence vs Archio AI vs Command layer vs response engine | Ask Archio: Structural Map v1, `09` daily rituals · Personal / General ARCHIO Intelligence: `11` §3 (layers) · Archio AI: legacy §4.3, 01.6 · Command layer: `components/command/`, `/api/command` · response engine: `lib/response-engine/`, `/api/archio` | `11` §3 names two intelligence *layers*; Ask Archio is the *surface*; the code has two *endpoints* that do not share a name with either. | **FLAGGED** — founders raised it | Luke + Kan; Architect grounds which endpoint is which layer |
| **N-3** | **DNA** vs **Personal Intelligence** vs Trading DNA vs Strategy OS `dna.tsx` vs Trader Model v0 | DNA / Trading DNA: legacy SYSTEM 04, `09` nine systems ("Trader OS + Psychology combined; Mind Check inside") · Personal Intelligence: `11` §3 · `dna.tsx`: `vantary/strategy-os/` · Trader Model v0: `09` §2 loop objects (six SQL aggregates) | Trading DNA was a *product system*; Personal Intelligence is a *layer*; Trader Model v0 is a *data object*; `dna.tsx` is a *mock panel*. | **FLAGGED** — founders raised it | Luke + Kan |
| **N-4** | **Portfolio** vs **Net Worth** vs Account / Money vs Accounts module | Portfolio: legacy SYSTEM 06 · Net Worth: legacy SYSTEM 07 · Account / Money: Structural Map v1 · Accounts module: `dashboard/modules/accounts.tsx` | Two legacy systems (positions vs total wealth) collapsed by the Structural Map into one Level-1 system whose name is about *account + billing*, not positions. | **FLAGGED** — founders raised it | Luke + Kan; Product Brain maps |
| **N-5** | **Passport** vs **Verified Track Record** vs AI Verified Track Record vs Trading Passport / verified proof vs My Record vs Proof | Passport / Trading Passport: Structural Map v1 (VISION) · (AI) Verified Track Record: `09` nine systems · My Record: IL-TAB-001…004 "My Record" · Proof drawer: CO-DRAWER-003 | Same concept, four names, two UI fragments. | **FLAGGED** — founders raised it | Luke + Kan (name only; VISION) |
| **N-6** | **Community** vs **Network / Marketplace** vs Community & Opportunity vs Social Network vs AI Agent Marketplace vs COLLECTIVE | Community: legacy SYSTEM 02 · Community & Opportunity: Structural Map v1 · Social Network + AI Agent Marketplace: `09` nine systems (feed "separate from Community") · COLLECTIVE: Room Navigator room · Network / Marketplace: founder discussion | `09` says the feed is *separate* from Community; the Structural Map puts "Opportunity" inside Community; the legacy map has Marketplace as its own system. Three maps, three cuts. | **FLAGGED** — founders raised it. **Narrowed 22 Sep 2026 (DL-031, provisional — Luke):** Marketplace's conceptual home is THE COLLECTIVE / CO family (not a door, not approved); "THE COLLECTIVE" stays the zone's working name; its D1 doors = Communities · The Floor · Collab Hub | Luke + Kan; Red Team challenges |
| **N-7** | **Flight Deck** vs Your Space vs dashboard vs **Cockpit** vs Vantary | Flight Deck: Structural Map v1, `09` ("the cockpit surface") · Your Space: `your-space.tsx` · `/dashboard`: route · `/cockpit`: **an Education narrative page** · Vantary: component tree | `09` calls Flight Deck "the cockpit surface" while `/cockpit` is a different page in a different system. An AI told "open the cockpit" will go to the wrong place. | **DIRECTION DECIDED — DL-025 (20 Sep 2026):** the Education `/cockpit` page will be **renamed later**; the replacement name is deliberately **not** chosen yet. Until then "Flight Deck" is the only name for `/dashboard`; do not call it "the cockpit" in new material. **Widened — DL-030 (20 Sep 2026, second session):** the *user-visible* name of `/dashboard` is **OPEN** — founders' live terms are **Dashboard · Flight Deck · Command Center** (tab title already says "Command Center"); **"Your Space" and "Trading Terminal" are NOT authoritative** unless revived. "Flight Deck" stays the `15` document handle only. Five names observed on the surface today (D1 sheet, KNOWN PROBLEM 5). **22 Sep 2026 (DL-031, provisional):** in the zone direction the `/cockpit` Education page is THE ACADEMY's **Education** destination — the route rename stays deferred | Luke + Kan (pick the replacement name when D7 / ED flows are mapped; pick the workspace's visible name — Q-26) |
| **N-8** | **Oracle** vs **Jarvis** vs Ask Archio vs Copilot vs Nexus AI vs Mentor AI | Oracle: `components/oracle/`, `oracle-command-console.tsx` · Jarvis: `vantary/jarvis/` · Copilot: `components/copilot/` (scripted chat) · Nexus AI: `nexus-ai-synthesis-panel.tsx` · Mentor AI: `mentor/MentorAIChat.tsx` | Six AI-labelled personas; two real endpoints; one scripted matcher. Which are *one thing wearing costumes* and which are features is unknown. | **FLAGGED** — found by audit. **22 Sep 2026 (DL-031, provisional — Luke):** Nexus / Nexus AI = likely legacy duplicate whose "all-knowing ARCHIO" job Ask Archio absorbs — absorption candidate, **code kept** (D-19); Ask Archio itself is global chrome, not a zone door | Luke + Kan; Architect lists what each calls |
| **N-9** | **Command palette** vs **Command bar** vs Command Desk vs Command layer | palette: `vantary/command-palette.tsx` (jump to doors) · bar/layer: `components/command/` (LLM) · Command Desk: `dashboard/command-desk/` (neural orb) | Three "command" surfaces; only one calls an LLM. | **FLAGGED** — found by audit | Luke + Kan |
| **N-10** | **Room** (×3) | Room Navigator rooms: MARKET FLOOR / STUDIO / MENTOR HALL / COLLECTIVE · response-engine `RoomId`: `studio`, `market-floor` · DB `rooms`: org sub-tenancy · **Live Room**: a live session surface | "Room" means a cockpit zone, a prompt-routing key, a tenancy record, and a live session. | **PARTLY RESOLVED — DL-025 + DL-020 (20 Sep 2026):** the four Flight Deck categories are **no longer called rooms** — working term **zones** (spaces / destinations acceptable) until founders pick final terminology; "room / channel" is reserved for Community tenancy (Model B). Remaining collisions: response-engine `RoomId` (code identifiers, untouched) · **Live Room** (a live session surface — still shares the word). **Reconfirmed 20 Sep second session (DL-025 addendum):** the four zones must not use Community "room" terminology; zone names + the 16-destination placement are OPEN for Product Brain review (Q-24). **22 Sep 2026: Q-24 → PROVISIONAL (DL-031, Luke; Kan review pending): MARKET FLOOR · TRADING DESK · THE ACADEMY · THE COLLECTIVE — still "zones", still not rooms; the code still says THE STUDIO / MENTOR HALL** | Luke + Kan (final zone term; Live Room naming); Architect for DB `rooms` |
| **N-11** | **Forecast** vs Market Read vs **Decision Record** vs Scenario vs trade plan vs Pre-Trade Contract | Forecast: IL-PAGE-001 · Market Read: legacy 03.2 · Decision Record: DL-001 (the ledger's core object) · Scenario: IL-SECTION-002 · trade plan: IL-PAGE-002 · Pre-Trade Contract: legacy 03.5 | Six names for "what the trader intends before the outcome". The ledger has decided the *object* name (Decision Record); the UIs predate it. | **FLAGGED** — `12` F-6 | Luke + Kan (which UI, if any, becomes capture) |
| **N-12** | **Mentor** vs creator vs community owner vs org owner vs `community_mentors` | mentor: `components/mentor/`, `/hub`, DL-002 · creator: `09` (Creator Intelligence), legacy 05.7 · owner: `groups.owner`/`orgs.owner_id` (`13` §2.2) | Role names differ by layer (product / ladder / DB). | **FLAGGED** — found by audit | Product Brain proposes; founders rule |
| **N-13** | **Student** vs member vs trader vs user | student: `/hub`, `ProfileStudentModule`, legacy 02.7 · member: `group_members`, `memberships`, `member-profile.tsx` · trader: `11` throughout · user: `profiles`, Supabase | Same person, four words. `11` uses *trader*. | **FLAGGED** — found by audit | Founders (recommend `11`'s word: trader) |
| **N-14** | **Journal** vs Auto-Journal vs private notes vs demo journal vs copilot journal tab | Auto-Journal: legacy 03.7 · private-notes: `dashboard/modules/private-notes` · demo journal: `lib/response-engine/journal.ts` (labelled demo) · journal tab: copilot | No journal is persisted; the "journal" the AI reads is a fixture. | **FLAGGED** — found by audit | Founders (is journal = Decision Record + review, or separate?) |
| **N-15** | **Review** vs Trade Review vs Post-Mortem vs Session debrief vs Autopsy Replay vs `decision_reviews` | Trade Review: `09` ritual · Post-Mortem: Ask door → `trade-post-mortem` template · Session debrief: FD-STATE-001 · Autopsy Replay: legacy 03.9 · `decision_reviews`: parked Architect spec | DL-003 says the Review is the one AI call. Five names for its surface. | **FLAGGED** — found by audit | Founders |
| **N-16** | **Morning Brief** vs Daily plan vs Active Window / Day Playbook vs session plan | Morning Brief: `09` ritual, legacy 01.2 · daily-plan: `dashboard/modules/daily-plan` · Active Window: FD-SECTION-001 · session plan: `09` loop objects | The "prepare" moment (`11` §4) has four names and one mock UI. | **FLAGGED** — found by audit | Founders |
| **N-17** | **Catch Me Up** vs Live Call History | Catch Me Up: `09` ritual, legacy 02.4, `/pitch` · `/history`: CO-PAGE-002 | Ritual named everywhere; no UI. `/history` is the nearest surface. | **FLAGGED** — found by audit | Founders (is `/history` Catch Me Up?) |
| **N-18** | **Template** (×3) | Flight Deck templates: FD-TPL · generated-template surfaces: AA-TPL-001 · Layout listing: legacy 05.3 | A saved layout, an AI-rendered answer shape, and a marketplace item. | **FLAGGED** — found by audit | Founders |
| **N-19** | **Hub** (×3) | Flight Deck Hub: FD-PANEL-001 · Community Hub: CO-PANEL-001 · Student Hub: ED-PAGE-002 | Three unrelated things called Hub. | **FLAGGED** — found by audit | Founders |
| **N-20** | **Structural Map v1** vs QClay "Locked product map" vs `09` "Nine systems (design canon)" vs Room Navigator rooms | Structural Map v1: **`15-structural-map-v1.md`** (filed 20 Sep) · Locked product map: `docs/qclay-dashboard-page-inventory-master.md` §3 · Nine systems: `09` §2 · rooms: `FLIGHT_DECK_ROOMS` | ~~Four maps of the same territory.~~ **One current map (`15`).** The QClay locked map is SUPERSEDED as a structural map (legacy page IDs kept for QCLAY RELEVANCE); the nine-system list is marked LEGACY in `09` §2 (aliases only); the rooms are a UI layer (Q-3 open). | **DECIDED — DL-019** (20 Sep 2026) | done: `15` filed, `09` §2 marked. Remaining: **tell QClay** `15` is the current map (D8 pack, `09` §4 prompt lines still cite the nine systems — identified, not rewritten) |
| **N-21** | **Trading Desk** (zone) vs **Trading Desk** (chart + execution surface) — and, smaller, **The Floor** (Collective door) beside **MARKET FLOOR** (zone) | zone: DL-031 working name for the former THE STUDIO ("work on my trading") · surface: `vantary/trading-desk/` (40 files), `12` FD-SECTION-002, D-9 ("FD Trading Desk vs `/copilot`") · The Floor: FD-NAV-001 Ask door | A navigation zone that groups Forecasts · Copilot · Post-Mortem vs the chart + execution console component that lives *inside* the workspace. An AI or a trader told "open the Trading Desk" cannot know which is meant; the two words "Floor" in one band read as one place. | **FLAGGED 22 Sep 2026** (v0, while recording DL-031). The zone name is explicitly **reversible** (Workbench / Studio are the historical alternatives); resolve **before any label reaches the UI**. Not a decision. | Luke + Kan (Kan review pending — Q-28) |

### 3.2 Duplication register (same thing built more than once)

| # | Duplicated thing | Instances (paths) | Consequence | Recommended handling (founder decides) |
|---|---|---|---|---|
| D-1 | `groups` / `group_members` DDL | `community-schema.sql`, `community.sql`, `create-community-tables.sql` (three definitions, different columns and policy names; `group_invites` twice) | Unknown which the live DB has (`13` §3.4) | collapse to one under migration discipline (`13` §10 unit 2) — **DL-020 does not approve this collapse; it needs its own approval** |
| D-2 | Community tenancy model | Model A `groups…` vs Model B `orgs → rooms → memberships → invites` | two half-systems; join UI cannot be designed | **DECIDED — Model B (DL-020, 20 Sep 2026).** Model A superseded for design / architecture; tables preserved until a separately approved migration |
| D-3 | Auth callback | `/auth/callback` (page) + `/api/auth/callback` (route) | `NEEDS-V0-VERIFICATION` which one production redirects to | keep one |
| D-4 | Auth implementation | `components/auth/*` kit (4 pages) vs `/verify-email` inline (286 lines) · UI uses Supabase client directly while 8 `/api/auth/*` routes exist unused | inconsistent visuals; dead routes | move verify-email into the kit; delete or document dead routes |
| D-5 | Copilot right rail | three variants (`12` F-13) | `NEEDS-V0-VERIFICATION` which is mounted | keep one |
| D-6 | Leaderboards | `community-panel/leaderboard.tsx`, `forecast-hub/forecast-leaderboard.tsx`, `premium-leaderboard.tsx` + `MonthlyMegaCard.tsx` | three ranking UIs over mock data, no ranking object | one leaderboard component, one data contract (after F5) |
| D-7 | Confluence modals | `confluence-modal.tsx`, `custom-confluence-modal.tsx`, `execution-copilot/bottom-panel/confluence-modal.tsx` (+ editor/selector/menu/panel) | three editors for one concept | one |
| D-8 | Gadget registries | `living-gadgets.tsx` (v1, ≈26) vs `living-gadgets-v2.tsx` (13, overlapping) | two definitions of "what a gadget is" | keep one registry |
| D-9 | Chart + execution surface | FD Trading Desk (`vantary/trading-desk/`) vs `/copilot` Execution Copilot | two cockpits for the same act | founder: which is *the* place a trade is planned |
| D-10 | "Command" surfaces | palette · bar/layer · Command Desk (N-9) | three | one keyboard entry point |
| D-11 | Landing pages | `/welcome`, `/archio`, QClay's | three landings | one (§2.12) |
| D-12 | Forecast UIs | Forecast Hub (12 files) vs 10 loose legacy forecast components (IL-MODAL-001) | `NEEDS-V0-VERIFICATION` which legacy ones are mounted | archive legacy |
| D-13 | Notification UIs | `community-panel/notification-center.tsx`, `dashboard/modules/notifications.tsx`, `ActivityNotifications.tsx` | three UIs, zero backend readers (`13` §3.5) | one, as an F9 consumer |
| D-14 | Design token systems | `vantary/theme-system.ts` (7 themes) vs `mtf/mtf-theme.ts` (imported by login + forecast) vs ≥5 other token files vs `live-room-tokens.ts` | no single design system (`12` §8) | founder picks the base; v0 consolidates |
| D-15 | Profile cards | `community-panel/member-profile.tsx` vs `profile/ProfileHoverCard.tsx` | two | one |
| D-16 | Hubs | Flight Deck Hub · Community Hub · Student Hub (N-19) | naming + purpose overlap | rename two |
| D-17 | Live Room mount | `/live-room` standalone + hub `live-stage` | **intentional** (same component, testable route) — not a defect | keep; document |
| D-18 | Market-data callers | `/api/polygon/*` + `/api/market/*` + dead `/api/market/stats` | one gateway, three call styles | one client helper over F6 |
| D-19 | The "all-knowing ARCHIO" surface | **Nexus** (`/nexus`, `components/nexus/` ×5 files, Nexus AI synthesis panel AA-AI-005, MX-PAGE-003) vs **Ask Archio** (AA-AI-001 command layer / AA-AI-002 grounded engine) | two surfaces claiming to synthesise everything; Nexus is mock-data mindmap + AI panel | **DL-031 (22 Sep 2026, provisional — Luke): Nexus = likely legacy duplicate absorbed by Ask Archio — absorption candidate; do NOT delete code yet (founder order).** Fate decided in D4 (One Ask Archio, N-8 / Q-8) |

### 3.3 How a name gets resolved

1. A founder writes the decision as a DL entry in `01` (name, aliases retired, date).
2. v0 updates the §3.1 row → `DECIDED (DL-0xx)`, updates every `ALIASES` field in §2 and the `12` records, adds a §5 change-log line.
3. ChatGPT includes the resolution in the next Context Delta (§7.2) so all three Grok bots stop using the retired name.
4. Code renames (routes, component names) are **separate** implementation work and are never done in this phase.

---

## 4. The trace chain — how to follow one feature end to end

Every feature can be read across this chain. The table says which document holds each link, so nobody re-derives it.

| Link | Question it answers | Where it lives | Field / ID form |
|---|---|---|---|
| **VISION** | Why does ARCHIO want this? | `11` (scope, journey, layers), `01` (DECIDED / REJECTED), `00`/`05` (background only) | `11` §n · DL-0xx |
| **SYSTEM** | Which Level-1 system owns it? | `12` §2–§3 · this file §2 | `FD` `IL` `MX` `ED` `CO` `AA` `AM` (+ `TP` `SM` `AG` `SH` `MK`) |
| **USER FLOW** | Where in the trader's journey; which steps? | `12` §9 (§9.1 founder journey, §9.2 real flows) | `FLOW-0nn` |
| **DESIGN** | What does it look like; how finished visually? | `12` record → `CURRENT VISUAL STATUS`, `DESIGN ISSUES`; `12` §8 design register | vocabulary `12` §1.1 |
| **COMPONENT** | Which files render it? | `12` record → route / component paths; this file §1 | path |
| **DATA** | Which tables / objects? | `13` §2.2 (tables), §2.10 (demo registry), §3 (five answers) | table name · `MISSING` |
| **BACKEND** | Which shared foundation; does it exist? | `13` §4 F1–F15, §8 | `F#` + `REAL / PARTIAL / MISSING` |
| **AI** | Does it call a model; should it? | `13` §5 (principle), §6 (inventory) | endpoint + model id · `deterministic` |
| **INTEGRATION** | External system needed? | `13` §2.6, §2.7, §4 F10–F12 | Polygon · TradingView · Stripe · Supabase Auth · broker (none) |
| **STATUS** | Functional truth today | `12` record → `CURRENT FUNCTIONAL STATUS` | vocabulary `12` §1.2 |
| **FOUNDER APPROVAL** | Has anyone said yes? | `12` record → `LUKE APPROVAL` / `KAN APPROVAL`; this file §2 → `FOUNDER DECISION STATUS` | `NOT REVIEWED / CHANGES REQUESTED / APPROVED` · DL-0xx |
| **QCLAY** | What QClay called it; what they get | this file §2 → `QCLAY RELEVANCE`; `docs/qclay-dashboard-page-inventory-master.md` | legacy `0N.n` |

### 4.1 Worked trace — a real flow: Community Discovery

VISION `11` §4 "Participate" · DL-002 entry wedge is a mentor's cohort → SYSTEM `CO` → FLOW `FLOW-005` discover with filters, **stops at "join"** → DESIGN `CO-PAGE-001` V0 DRAFT, `12` §8 (mtf tokens not used here) → COMPONENT `/communities`, `components/communities/DiscoveryEngine.tsx`, `CommunityObject.tsx`, `CommunityInspector.tsx`, `discovery-dimensions.ts` → DATA `groups` (which of three DDLs: `CANNOT VERIFY LIVE DB`), `community_mentors` seed → BACKEND `F3` PARTIAL (`/api/communities` logs "groups table not found, using mock data" on miss), `F15` PARTIAL → AI none (deterministic filters — correct per `13` §5) → INTEGRATION none → STATUS `PARTIAL` (real read + mock fallback) → APPROVAL NOT REVIEWED ×2 → QCLAY legacy `02.1 Community Discovery`. **Next link missing:** `CO-STATE-001` join (backend exists in Model B, not Model A) — blocked on F3 decision (§2.6).

### 4.2 Worked trace — a decided object with no UI: the Decision Record

VISION DL-001 (core object, locked before outcome), DL-011 (per-field provenance), DL-012 (one tap + optional one line), DL-013 (`lock_lead_seconds`) → SYSTEM `IL` → FLOW named in `12` §9.2 tail "capture a Decision Record" — **no FLOW ID because no UI exists** → DESIGN `NOT DESIGNED`; nearest UIs `IL-DRAWER-001` (long form) and `IL-PAGE-002` (plan) contradict DL-012 (`12` F-6) → COMPONENT none → DATA `decision_records` **MISSING**; `copilot_events` dead; `forecast_groups` orphan → BACKEND `F5` MISSING, `F4` MISSING → AI none for capture; one Review call later (DL-003) → INTEGRATION CSV import first (F10) → STATUS `BACKEND BLOCKED` + **parked** (`09` §4) → APPROVAL: the *object* is DECIDED, the *surface* is not → QCLAY legacy `03.4 Decision Builder` / `03.5 Pre-Trade Contract` (both long-form — same contradiction). **Next link:** founder decision §2.3.

### 4.3 The twelve real flows, traced to foundations

| FLOW | Chain summary | Real? | Foundation |
|---|---|---|---|
| FLOW-001 | register / login / reset → `profiles` | yes | F1 |
| FLOW-002 | open `/dashboard` → demo telemetry | renders; nothing is the user's | F5 F8 F10 missing |
| FLOW-003 | ask a grounded market question → `/api/archio` | yes (General) | F7 F6 |
| FLOW-004 | command bar → `/api/command` | yes (ungrounded) | F7 |
| FLOW-005 | discover communities → `groups` | yes, mock fallback, stops at join | F3 F15 |
| FLOW-006 | 16 doors navigation | yes (nav only) | — |
| FLOW-007 | watch scripted live session, resize workspace | demo | F11 missing |
| FLOW-008 | browse / "submit" forecast | submit discards | F5 missing |
| FLOW-009 | plan / "execute" trade | no save, no broker | F5 F10 missing |
| FLOW-010 | checkout → Stripe → webhook → `subscriptions` | backend yes, no UI entry | F12 |
| FLOW-011 | org → room → invite → accept | backend yes, no UI | F3 (Model B) |
| FLOW-012 | copy mentor entry → `mentor_notifications` | backend yes, unauthenticated, no reader | F9 · S1 |

---

## 5. Change log

Append-only. One line per meaningful change. Never edit an earlier line — supersede it. Format:

```
| yyyy-mm-dd | WHAT changed | WHY | APPROVED BY (Luke / Kan / both / none-operational) | AFFECTED DESIGNS (12 IDs) | AFFECTED BACKEND (13 F#/S#) | AFFECTED GROK CONTEXT (which bot, which pack section) | AFFECTED QCLAY HANDOFF | REF |
```

| Date | What changed | Why | Approved by | Affected designs | Affected backend | Affected Grok context | Affected QClay handoff | Ref |
|---|---|---|---|---|---|---|---|---|
| 2026-09-20 | Created `12-product-design-control-center.md` (678 lines): 120 control records across SH/FD/IL/MX/ED/CO/AA/AM/TP/SM/AG/MK, vocabularies, ID convention, design register, flow coverage, definition of done, counts, 15 flags | Founder request: inventory every user-facing surface before design work; eliminate ambiguity for QClay | none — operational; founders to review | all | — | none yet (packs not rebuilt by instruction) | none yet | commit `7b2aae0` |
| 2026-09-20 | Created `13-technical-backend-control-center.md` (541 lines): runtime, 14 tables, 37 routes with callers/auth posture, five Architect answers, F1–F15 foundations, AI inventory, S1–S10 security register, smallest-honest-version table, re-runnable verification method | Founder request: verify backend from code; make outside quotes decomposable | none — operational | — | all F#, S# | **Architect** must receive the five answers and the S1–S9 register (via `08` correction or a dated verification note — not yet done) | decomposition `13` §10 | commit `7b2aae0` |
| 2026-09-20 | Created this file `14-archio-master-cross-reference.md`: AI-to-AI briefing, master ID index, 12 system records × 24 fields, 20 naming conflicts, 18 duplications, trace chain, change log, 8-week runway, Lego protocol, cross-AI routing, open decisions, blockers | Founder request: connective tissue so v0 / ChatGPT / Grok / QClay stop naming the same thing differently | none — operational | — | — | all three bots: **glossary `09` §2 nine-system list is now a legacy alias set (N-20) — pending founder confirmation** | QClay must be told which map is current (N-20) | this commit |
| 2026-09-20 | ~~PROPOSED, not applied:~~ **APPLIED (DL-019, Luke + Kan, Q-21):** corrected `08` "copilot_events written from `app/api/copilot/chat`" → dead table, no writer; original wording struck through, header dated; re-verified from code (`persist.ts` sole insert, `CopilotProvider.tsx` lines 6/49 commented out) | audit finding `12` F-1 | Luke + Kan | — | `13` §3.2 | Architect pack cites `08` — now correct | — | `12` F-1 → APPLIED |
| 2026-09-20 | ~~PROPOSED, not applied:~~ **APPLIED (DL-019):** README gained "Operational control documents (not governance)" listing `12`/`13`/`14`; reading order + packs + standing facts updated | discoverability | Luke + Kan | — | — | — | — | — |
| 2026-09-20 | ~~PROPOSED, not applied:~~ **APPLIED (DL-019):** Structural Map v1 filed as **`15-structural-map-v1.md`** (Level 1 + Level 4 verbatim; §2 binding decisions; §3 superseded-map table). `09` §2 nine-system list marked LEGACY; `09` §3 all bots receive `15`; `12` §3 flag + F-9 resolved; N-20 → DECIDED | `12` F-9, N-20 | Luke + Kan | — | — | all bots (pack list) | QClay must be told `15` is current | `12` §3 |
| 2026-09-20 | **DL-020 recorded:** Community tenancy = **Model B** (organization / community → rooms / channels → memberships / access). §2.6 status / bot line / blockers / next decision, §3.2 D-1 + D-2, §6 wk 3, §9 Q-6, §10 B-2 updated. **`13` §4 F3 A/B labels were inverted vs this file — corrected in `13`** (code facts unchanged); `13` F3 VERDICT → DECIDED; `12` CO-PAGE-001 DESIGN ISSUES annotated. Repo facts preserved; no migration approved | founder decision Q-6 | Luke + Kan | CO-* | F3, D-1, D-2 | Architect: ground Model B, do not schedule migration | QClay: join / room flows designable | none new |
| 2026-09-20 | **DL-021 recorded:** Intent Loop this phase = **DESIGN SHAPE ONLY**. §2.3 backend status / decision status / blockers / next decision, §6 wk 5, §9 Q-10, §10 B-3 updated; `13` §4 F5 phase note. `09` §4 loop tasks stay parked as written | founder decision Q-10 | Luke + Kan | IL-* (design continues) | F4, F5 (no implementation) | all three: shape, not persistence | — | none new |
| 2026-09-20 | **DL-022 recorded:** Education = **COMBINATION** (dedicated learning system + contextual surfacing; creator knowledge → agents / marketplace = VISION). §2.5 status / blockers / next decision, §6 wk 7, §9 Q-15, §10 B-4 updated; `13` §4 F14 VERDICT → direction decided, shape follows FLOWS | founder decision Q-15 | Luke + Kan | ED-* (flows before screens) | F14 | Product Brain maps both sides first | — | none new |
| 2026-09-20 | **Identified, not rewritten (per founder instruction):** `09` §4 Product Brain prompt still says "the design canon (`09` §2 nine systems …)" as a source of system names; `09` §4 Architect prompt still tells the bot to "reuse … the `copilot_events` event-log pattern". Neither is *wrong* as a pattern reference, but both now point at legacy / dead material — the §2 LEGACY marker and the corrected `08` row travel with the packs, so the bots read the correction. Rewrite the prompt lines when the packs are next rebuilt | consequence of DL-019 | v0 (flag) | — | — | Product Brain, Architect | — | none new |
| 2026-09-20 | **DL-023 recorded:** public vs private = **social-style configurable privacy model**; D1 scope = public-vs-authenticated boundary only; social permission matrix = future dedicated block. §2.1 SH status / blockers / next decision, §3.1 (no change), §6 wk 1, §9 Q-1 updated; `12` SH-STATE-002 gains the rule; `13` §7 S7 / S8 owner column + §4 F2 verdict annotated. No middleware / RLS / route change | founder decision Q-1 | Luke + Kan | SH-STATE-002, SH-NAV-* | F2, S7, S8 | Architect: T1 reads S7/S8 under the boundary; Red Team: "is a public profile a leak?" now has a rule to test against | QClay: shell can assume login for the product | none new |
| 2026-09-20 | **DL-024 recorded:** zero-data first open = **GUIDED EMPTY STATE**; demo-as-yours and mandatory onboarding rejected (`01` rejected table). §2.2 FD status / blockers / next decision, §6 wk 1, §9 Q-2; `12` FD-STATE-002 / 003 → DECIDED, to be designed in D1 | founder decision Q-2 | Luke + Kan | FD-PAGE-001, FD-STATE-002/003 | — (no data model implied) | Product Brain: day-1 zero-data problem now framed | QClay: the missing state QClay's landing needed is now defined | none new |
| 2026-09-20 | **DL-025 recorded:** Flight Deck keeps the **four-category command-centre model**; the four are a navigation abstraction, **not** the seven systems and **not "rooms"** — working term **zones**; names provisional, D1 inspects fit; `/cockpit` rename deferred, name open. §2.2 FD, §3.1 N-7 → direction decided, N-10 → partly resolved, §6 wk 1, §9 Q-3; `12` FD-NAV-001 + F-10 annotated; `15` §3 Room Navigator row rewritten | founder decision Q-3 | Luke + Kan | FD-NAV-001, ED-PAGE-001 | — | all bots: say "zones" for the Flight Deck four, "rooms / channels" only for Community | QClay: legacy 01.x navigation names stay for now | none new |
| 2026-09-20 | **D1 opened as INSPECTION + DESIGN-DEFINITION** (founder order: no product code, no T1, no unrelated redesign). Lego Block 1 sheet filed at `docs/lego/D1-block-1-front-door.md` and issued in chat; screenshots to be preserved under `docs/screens/SH/` + `docs/screens/FD/`. **Two doc-drift corrections from the inspection:** `12` FD-NAV-001 + SH-STATE-002 said `/hub` was login-gated — its guard was removed July 2026 (code comment), verified 200 signed-out; zero existing routes are gated | D1 start | v0 → Luke + Kan | SH-NAV-*, FD-PAGE-001, FD-NAV-001, FD-STATE-002/003 | S7 (scope confirmed: nothing real is gated) | — | — | none new |
| 2026-09-20 (2nd session) | **Ledger vocabulary extended:** entries may tag lines DECIDED · OPEN · FOUNDER DIRECTION · DEMO/SIMULATION · FUTURE/VISION (`01` header). **DL-026 recorded:** signed-out = product-first exploration (TradingView-like), identity asked at the moment of need; philosophy DECIDED, exact limits OPEN; "login wall on arrival" → rejected table. §2.1 SH status / next decision; `12` SH-STATE-002 (boundary per action / data); `13` S7 fix column | founder answers to the D1 sheet, item 1 | Luke + Kan | SH-STATE-002, SH-NAV-* | S7 (rule refined; no change) | all three (D1 packs) | QClay: no login wall in the shell | none new |
| 2026-09-20 (2nd session) | **DL-027 recorded:** login and registration both land in the Dashboard / Flight Deck workspace — direction DECIDED, routes unchanged (today `/` and `/copilot`, re-verified). §2.1, §2.2; `12` SH-PAGE-001/002, FD-PAGE-001 | D1 sheet item 2 | Luke + Kan | SH-PAGE-001/002, FD-PAGE-001 | — | Product Brain, Red Team (journey), Architect (`?from` detail later) | — | none new |
| 2026-09-20 (2nd session) | **DL-024 addendum:** guided empty state reconfirmed; short optional post-sign-in tutorial = FOUNDER DIRECTION; full tutorial design = OPEN / later block. **DL-028 recorded (FOUNDER DIRECTION):** Ask Archio guides exploration conversationally; may encourage login / register at the moment of need. §2.2, §2.7; `12` FD-STATE-002, AA intro | D1 sheet items 3–4 | Luke + Kan | FD-STATE-002, AA-AI-001/002 | — | Product Brain (no onboarding design), Architect (no AI work scheduled) | — | none new |
| 2026-09-20 (2nd session) | **DL-029 recorded:** face scan = **DEMO/SIMULATION** (timers + `face-auth-user`, no session, re-verified); real secure authentication = FOUNDER DIRECTION; KYC / account integrity = OPEN; **five concepts never merged** (authentication · biometrics / passkeys · email / phone confirmation · KYC · duplicate-account prevention). §2.1; `12` SH-PAGE-001; `13` F1 note; rejected table ×2; inbox Q-25, Q-27 | D1 sheet item 5 | Luke + Kan | SH-PAGE-001 | F1 (no change) | Architect (auth direction, no implementation) | — | none new |
| 2026-09-20 (2nd session) | **DL-023 addendum:** Instagram-familiar configurable visibility recorded (public / connections / deliberately shared / never-shared private); permission matrix still a later block. §2.1 | D1 sheet item 6 | Luke + Kan | SH-*, AM-* | F2 (no change) | Red Team (privacy leak tests) | — | none new |
| 2026-09-20 (2nd session) | **DL-030 recorded:** workspace = highly customisable trader workspace (FOUNDER DIRECTION; mentor-resold configurations = FUTURE/VISION); name Dashboard / Flight Deck / Command Center = **OPEN**; "Your Space" / "Trading Terminal" not authoritative. §2.2 CANONICAL NAME annotated, §3.1 N-7 widened; `12` FD-PAGE-001; inbox Q-26 | D1 sheet item 7 | Luke + Kan | FD-PAGE-001 | — | all three: do not pick a name | QClay: no final name yet | none new |
| 2026-09-20 (2nd session) | **DL-025 addendum:** zone model DECIDED (kept, provisional); zone names + placement of the 16 destinations **OPEN for Product Brain review**; do not rename / move; not rooms. §2.2, §3.1 N-10, §9 Q-24, §10 B-11; `12` FD-NAV-001; `15` §2 | D1 sheet item 8 | Luke + Kan | FD-NAV-001 | — | **Product Brain next task; Red Team challenge** | — | none new |
| 2026-09-20 (2nd session) | **Grok packs rebuilt (v3, D1)** at `public/docs/grok/ARCHIO-GROK-STARTER-PACK/` — role-specific extracts instead of full copies of `12`/`13`/`14`: COMMON = governance · glossary · ledger · `11` · `15` · `08` · README index · **new `00-CURRENT-STATE-2026-09-20.md`** (phase, D1 status, DECIDED / OPEN / DIRECTION / DEMO tables, superseded maps); Product Brain + Red Team + Architect each get one D1 context extract; loop-era files (`02` `03` `10` `05` `06` `00` excerpts, three problems, Owen note, 16 Aug audit) moved to `04-PARKED-LOOP-REFERENCE/`. `09` §3 pack lists + §4 prompts re-set for D1 (19 Sep structural task = COMPLETED via `15`; 17 Sep loop tasks still parked). **Two outdated prompt lines corrected** (Product Brain "nine systems design canon" → `15`; Architect "reuse the `copilot_events` event-log pattern" → dormant / dead pattern). **§8 contradiction resolved:** the Architect now receives a dated extract of `13` §3 + §7 as its verification note | founder request | Luke + Kan (request) · v0 (build) | — | — | all three packs | QClay: none | `09` §3–4; `08` |
| 2026-09-22 | **DL-031 recorded — PROVISIONAL D1 DESIGN DIRECTION (new ledger label; Luke approves, Kan's asynchronous review pending — NOT joint approval).** Four zones survive the Product Brain / Red Team reconciliation: MARKET FLOOR (Intelligence · Daily Brief · Live Calls) · TRADING DESK (reversible; ONE Forecasts · Copilot · Post-Mortem) · THE ACADEMY (reversible; Education + honest Compare / Mentor AI shells) · THE COLLECTIVE (Communities · The Floor · Collab Hub; Marketplace = FUTURE home). Global chrome (Ask Archio · Nexus absorption candidate · account / avatar chrome · Flight Deck customisation) not forced into zones. Centralized / Decentralized = FUTURE/VISION, UX OPEN, no literal toggle. §2.2, §2.7, §2.10, §3.1 N-6 / N-7 / N-8 / N-10 + **N-21 (Trading Desk name collision)**, §3.2 **D-19 (Nexus vs Ask Archio)**, §6.1 D1, §9 Q-24 → provisional + **Q-28**; `12` FD-NAV-001 (surviving-direction table; code table kept), MX-PAGE-003, SM-SECTION-001; `15` §2 + §3; `09` §2, §3, §4.1 (Product Brain D1 task COMPLETED); README; `01` rejected table ×5. **No product code; `FLIGHT_DECK_ROOMS` untouched.** | founder statement 22 Sep after the bot reconciliation | Luke (approved) · Kan (async) | FD-NAV-001, FD-SECTION-002, MX-PAGE-003, SM-SECTION-001 | — | Product Brain: D1 zone task complete — do not re-run; Red Team: challenge N-21 + the honest-shell rule; Architect: none | QClay: zone labels are provisional — do not ship them | **none new — packs v3 STALE (zone names; Product Brain ★ NEXT TASK complete) but not materially incorrect about code; rebuild waits for a founder-approved reason (§7.2)** |
| 2026-09-22 | **D1 Lego Block 2 OPENED as DESIGN-DEFINITION** (Luke's order; no product code; T1 not started; no bot asked): `docs/lego/D1-block-2-first-use.md` — the signed-out product-first experience + the guided zero-data first Flight Deck experience, defined for three user states (A signed-out explorer · B brand-new signed-in zero-data · C returning signed-in with real data). Sheet carries: exact design target · the DECIDED / DIRECTION / PROVISIONAL / OPEN inputs · eight repo-grounded surfaces · five screenshots · must-not-touch · definition of done. `12` FD-STATE-002 / 003 + SH-STATE-002 gain pointers; Block 1 sheet DoD updated | D1 sequence (Block 1 inspection complete in substance) | Luke (order) · Kan (async) | SH-STATE-002, SH-PAGE-001/002, SH-NAV-001, FD-PAGE-001, FD-NAV-001, FD-STATE-002/003, AA-AI-001/002 | S7 (list being written; no change) | none sent — founder order | QClay: none | none new |

---

## 6. The 8-week founder runway

**What this is:** a practical *sequence* of Lego blocks for Luke + Kan working with v0, ChatGPT and the three Grok bots. **What it is not:** a schedule. Week numbers are a reading order, not a promise; a block that takes three days or three weeks is still the same block. Blocks run in two lanes — **D** (product/design) and **T** (technical learning) — and one D and one T block are open at a time, never more.

**Exit state at the end of the runway** (from the founders' brief, restated as checkable lines):

```
PRODUCT / DESIGN                                          TECHNICAL
[x] Structural Map v1 filed (15, DL-019) [ ] mature (L2–3)   [ ] every 13 §2 row re-verified once by founders reading it
[ ] FLOW-001…012 + the missing loop flows mapped           [ ] F1–F15 each has a founder-readable one-paragraph explanation
[ ] every 12 record has a dated screenshot                 [ ] major missing systems named (F4 F5 F8 F9 F10 F11 F14) with a founder yes/no/later
[ ] major missing screens listed (12 §9.2 tail + STATEs)   [ ] AI vs deterministic decided per system (13 §5 table filled)
[ ] design language: one token base chosen (D-14)          [ ] integration list fixed: Polygon · TradingView · Stripe · Supabase · broker=CSV
[ ] each Level-1 page worked once with v0 (D1–D7)          [ ] Owen/TradeLocker question sheet final (13 §10 a–d)
[ ] both approval columns set on every record              [ ] outside quote decomposed into 13 §10's nine units, each with a founder "in/out"
[ ] docs/screens/ organised by system                      [ ] S1–S9 either fixed or explicitly accepted
[ ] QClay pack = FOUNDER APPROVED FUNCTION / QCLAY VISUAL POLISH list
```

### 6.1 Block sequence

| Wk | Lane D — product / design block | Lane T — technical learning block | Founder decisions the week forces |
|---|---|---|---|
| **1** | **D1 · The Front Door** — `SH-NAV-001/002/003`, `FD-PAGE-001`, `FD-NAV-001`, `FD-STATE-002/003`: *what a real trader with zero data sees on first open* — **now fixed: GUIDED EMPTY STATE (DL-024)**. Also ~~rules on room names (N-7, N-10)~~ → **name-fit inspection of the four zones (DL-025: keep provisionally, inspect fit; `/cockpit` rename deferred)**. Runs as an INSPECTION + DESIGN-DEFINITION block first (Lego sheets), product code untouched until founders approve a sheet. | **T1 · The one real vertical slice** — `/register` → Supabase Auth → `profiles` row → `/api/users/me`: learn *table, row, policy, route, client* on the only slice that is real end to end (F1). Read S7, S8 with the DL-023 boundary in hand. **Not started (founder order).** | ~~Which pages need login? Public profiles? Empty state vs labelled demo? Room names.~~ → DL-023 / DL-024 / DL-025 (20 Sep). Now: tick the route-by-route login list D1 proposes; per-zone keep / rename-for-fit after inspection. **22 Sep: Block 1 inspection complete in substance; zone fit → DL-031 PROVISIONAL (Luke; Kan async, Q-28); Block 2 = first-use design-definition (signed-out explorer · zero-data new user · returning user) OPEN — `docs/lego/D1-block-2-first-use.md`. Still no code, no T1.** |
| **2** | **D2 · Market Experience honesty** — `MX-PAGE-001` (mock → the existing snapshot route), `MX-SECTION-003` (dead `/api/market/stats`), decide `/` after login, TradingView stance (F-7). | **T2 · What an API route costs** — F6 gateway: read `/api/polygon/*`, learn auth + cache, decide S5/S6 (auth on LLM + market proxies). | `/` after login? TradingView stays as a feature? Auth on proxies? |
| **3** | **D3 · Community: from discovery to join** — `CO-PAGE-001`, `CO-STATE-001` (join), `CO-STATE-003` (detail page); triage the 13 hub views + 5 example rooms (keep / kill). | **T3 · Tenancy** — F3 **Model B (decided, DL-020)** walkthrough on the real SQL: `orgs → rooms → memberships → invites`; what a migration off the three `groups` DDLs (D-1) would touch — **learning only, no migration until separately approved**; migration discipline (`13` §10 unit 2). | ~~The tenancy decision~~ → DL-020. What "Opportunity" means (N-6, Q-7). Room names (Q-3). |
| **4** | **D4 · One Ask Archio** — `AA-AI-001` vs `AA-AI-002` canon (N-2), retire or define Oracle / Jarvis / Nexus AI / Mentor AI (N-8), `AA-STATE-001…004` (streaming · error · assistance style · consent). | **T4 · Grounded AI pattern** — F7: read `/api/archio` router → contract → registry; fill the AI-vs-deterministic table (`13` §5) per system; quota design. | Which surface is Ask Archio? What is AI, what is arithmetic, per system. |
| **5** | **D5 · Intent Loop experience** — reconcile Forecast Hub / Copilot / Scenario (N-11, D-9, D-12) into one capture *shape* per DL-012 — **design only (confirmed: DL-021, design shape only this phase)**. `IL-STATE-001/002`. | **T5 · The loop's data, read-only** — F4/F5: what `decision_records` / `trades` / `decision_reviews` would be (Architect parked spec as reading material), `lock_lead_seconds`, provenance. **No implementation (DL-021).** | ~~Un-park the bounded loop?~~ → DL-021: no. Which UI, if any, becomes capture (Q-11). |
| **6** | **D6 · Account / Money** — real `/profile` over `profiles`, `AM-STATE-001` settings, `AM-STATE-002` billing UI decision, `AM-STATE-005/006` privacy + delete/export. **Guard rail F-8: no org admin UI.** | **T6 · Backend without a front door** — F12 billing + F1 wiring walkthrough; TS burn-down policy (S10: block new errors, schedule 483 → 0). | Portfolio / Net Worth inside AM? Ship settings + billing this phase? Plans and prices. |
| **7** | **D7 · Education flows + Live Room / hub triage** — `ED-*`: the definition is **decided (DL-022, combination)**; map the two sides (learning system · contextual surfacing) as flows before any screen; `CO-PAGE-003` Live Room approval pass; `CO-PANEL-003` notifications design as an F9 consumer. | **T7 · Live + notify requirements** — F11 provider question (audio/video/stream), F9 as F4 consumer, S1/S4 fixes; **finalize the Owen / TradeLocker question sheet** (`13` §10). | ~~What Education is~~ → DL-022. Live provider direction. Owen questions signed off. |
| **8** | **D8 · The Screens Book** — every `12` record has a dated screenshot and both approval columns set (APPROVED or CHANGES REQUESTED with reason); assemble the QClay pack: **FOUNDER APPROVED FUNCTION / QCLAY VISUAL POLISH** list + "not yet" list + which map is current (N-20). | **T8 · The quote, decomposed** — `13` §10's nine units, each with scope, foundation, founder in/out, and what QClay's "AI excluded" now means (harden F7). Architect grounding round complete. | Which units go outside; which stay with v0; what QClay is asked to polish. |

**Weekly rhythm (every week, both lanes):** Monday — pick the block, ChatGPT prepares the session sheet (§7.1) from these documents · mid-week — v0 does, founders answer fill-in-the-blanks · Friday — v0 updates the records, ChatGPT writes the Context Delta (§7.2), Luke pastes the ≤ 5 bullets to the bot that needs them (`09` §5 flow).

**Why D1 is the Front Door and not the biggest page.** The shell multiplies every inconsistency (`12` §4); the empty state is the single most important missing state (`FD-STATE-003`); the room names are the first naming decision that unblocks four others (N-7, N-9, N-10, N-19); and QClay's landing work is blocked on exactly this surface existing. It is also *small*: three nav records, one page record, one navigator, two states.

**Why T1 is the auth slice and not the security fixes.** Luke and Kan need to know what a table, a policy, a route and a client are *before* they can be quoted for nine units of them. FLOW-001 is the only place all four exist and work. The security fixes (S1–S9) come immediately after, as the first thing they watch v0 change (T2/T3/T7).

### 6.2 What the runway deliberately does not do

- It does not implement F4/F5/F8–F11 or the bounded loop. Those are decisions, not builds, in this phase (DL-018).
- It does not design UI for orgs/rooms/memberships (F-8).
- It does not rename routes or components (§3.3 step 4).
- It does not rebuild the three Grok context packs; it produces Context Deltas (§7.2) and *proposes* pack edits in §5.
- It does not touch `00`–`11` except through founder-approved DL entries.

---

## 7. Lego session protocol

### 7.1 Session sheet (ChatGPT prepares; v0 fills the "does" and "updated" lines; founders answer)

```
CURRENT BLOCK          D3 · Community: from discovery to join           (one block ID from §6.1)
WHAT WE ARE LOOKING AT CO-PAGE-001 /communities · components/communities/DiscoveryEngine.tsx ·
                       CO-STATE-001 (no UI) · 13 §4 F3 · 13 §2.2 groups (×3 DDL) · FLOW-005
WHAT FOUNDERS ANSWER   1. Tenancy model: [ ] A groups  [ ] B orgs/rooms  [ ] merge: ____
                       2. "Opportunity" means: ______________________
                       3. Of the 13 hub views, keep: [ ] … [ ] …   kill: [ ] … [ ] …
                       4. Join is: [ ] one tap  [ ] request → approve  [ ] invite only
WHAT V0 DOES NEXT      after answers: design CO-STATE-001 join state on the chosen model; write the
                       CO-STATE-003 detail page record; verify which groups DDL is live (needs DB access)
WHAT NEEDS SCREENSHOTS CO-PAGE-001 default + empty-results + mock-fallback (3) → docs/screens/CO/
WHAT GETS UPDATED      12 §5.5 records CO-PAGE-001, CO-STATE-001/003 · 13 §4 F3 status · 14 §2.6,
                       §3.1 N-6, §5 change log · Context Delta → Architect (F3), Red Team (hub scope)
DEFINITION OF DONE     tenancy decision recorded as DL-0xx · both founders set LUKE/KAN on CO-PAGE-001 ·
                       join flow has a record with a route and a sketch · screenshots attached · delta sent
```

Rules: one block open per lane · questions are fill-in-the-blank or accept/change, never essays · if a question cannot be answered, it becomes a **BLOCKER** (§10) and the block narrows, it does not stall · a session sheet never contains more than **five** founder questions.

### 7.2 Context Delta (written at the end of each completed block; ≤ 40 lines)

```
CONTEXT DELTA · <date> · block <ID> · written by ChatGPT from 12/13/14 · verified by v0
WHAT WAS LEARNED       facts found (cite 12/13 records or "v0 verified <date>")
WHAT CHANGED           records/statuses changed (IDs), decisions made (DL-0xx)
WHAT FOUNDERS DECIDED  the fill-in-the-blank answers, verbatim
WHAT REMAINS OPEN      questions carried to §9; new BLOCKERS in §10
SCREENSHOTS / FILES    paths under docs/screens/, files touched
WHAT EACH AI NEEDS     v0: … · Product Brain: … · Red Team: … · Architect: … · ChatGPT: … · QClay (later): …
```

The delta is the **only** thing pasted to a bot after a block. Packs (`09` §3) are rebuilt only when §5 accumulates a founder-approved reason.

---

## 8. Cross-AI routing — who needs what

| Reader | Receives | Never receives | Uses it to |
|---|---|---|---|
| **v0** | everything; owns `12`/`13`/`14` edits and `08` corrections | — | verify against code, build in later phases, keep records honest |
| **ChatGPT** (drafting assistant, DL-015, outside the ledger) | `14` §0, §1, the §2 record and §3 rows for the current block; `12`/`13` records named in the session sheet | founder approval authority; the whole of `12`/`13` at once | prepare the session sheet (§7.1), draft the Context Delta (§7.2), translate founder answers into DL-entry drafts for founders to paste |
| **Grok Product Brain** (maps) | `09` §3 pack + the delta; the §2 record for a system whose *definition* is open (ED, CO "Opportunity", AM scope, AA "personal") | `13` internals, code paths, MK | keep the structural map honest: problem · journey position · connections per system; propose alias resolutions for founders (never decide) |
| **Grok Red Team** (challenges) | `09` §3 pack + the delta; §3.1 and §3.2 in full (duplicates and disconnected features are its target); `12` §9 flows | approval status; MK | attack the map: pairs that are one thing under two names, systems with no problem, flows a trader would need that do not exist |
| **Grok Architect** (grounds) | `09` §3 pack + the delta; `13` §3 five answers, §4 F1–F15, §7 S1–S10 as a **dated v0 verification note**; the §2 DATA / BACKEND / AI / INTEGRATION fields | `12` visual fields; anything not in `08` or a dated note | ground the map: boundaries, objects, integrations, AI vs deterministic, exists vs demo, NEEDS-V0-VERIFICATION list |
| **Luke · Kan** | the session sheet; the §9 open-decisions list; screenshots | nothing withheld | decide; set approval columns; write DL entries |
| **QClay** (eventually) | `12` records marked FOUNDER APPROVED + their QCLAY POLISH ITEMS; the §1 index; the current map statement (N-20); `13` §10 decomposition | `13` security register, bot packs, `00`–`11`, memory files, anything NOT REVIEWED | polish approved function; quote decomposed units |

**Three rules that keep this from becoming context chaos:**
1. **Cite, don't paste.** A bot is told "`12` CO-PAGE-001 is PARTIAL (real `groups` read, mock fallback)" — not handed the file.
2. **One delta per block.** Nothing goes to a bot between deltas.
3. **Names come from §1/§2.** If a bot uses a §3.1 alias, ChatGPT corrects it in the next delta and does not propagate it.

**Contradiction with `09` §3 to be aware of:** the Architect's pack says its "only source of code facts is `08` and dated v0 verification notes". `13` is a dated v0 verification note in all but filename. Until founders decide whether `13` is *added* to the Architect pack or its findings are *copied into `08`*, the Architect should receive `13` §3 + §7 as a verification note titled `verifications/2026-09-20-backend-control-center.md` (a copy, not a new source). ~~**Proposed in §5; not done.**~~ **DONE 20 Sep 2026 (second session, pack v3):** the Architect pack carries `03-ARCHITECT/D1-TECHNICAL-CONTEXT-architect-2026-09-20.md`, a dated v0 verification extract of `13` §2–§4, §7 and §3.2 (tables, routes, F1–F15 verdicts, S1–S10, the `copilot_events` dormant-pattern rule) — a copy, not a new source; `08` remains the short-form authority.

---

## 9. Open decisions register (the founder inbox, ordered by what each unblocks)

Fill-in-the-blank. Each line names the block it unblocks and the record(s) it changes. Answered lines move to `01` as DL entries and are struck through here with the DL number.

| # | Decision | Unblocks | Changes | Form |
|---|---|---|---|---|
| ~~Q-1~~ | ~~Which pages require login; are profiles public by default?~~ **CLOSED → DL-023: social-style configurable privacy model** — personalised product behind login; public / marketing / auth / help may be signed-out; profile = public layer + user-controlled social layer + always-private account / intelligence layer; **D1 = boundary only**, permission matrix later. *Residual, not a decision:* founders tick the route-by-route list D1 proposes | D1, T1, S7, S8 | SH-STATE-002, F2 | **[x] configurable** — list of routes: D1 output |
| ~~Q-2~~ | ~~Zero-data first open: guided empty state / labelled demo / onboarding first?~~ **CLOSED → DL-024: GUIDED EMPTY STATE** (real Flight Deck, no fake personal numbers, optional gradual configuration, lightweight guide allowed, onboarding system not invented in D1) | D1, FD-STATE-002/003 | FD-PAGE-001 | **[x] guided** [ ] demo [ ] onboarding |
| ~~Q-3~~ | ~~Room names — keep MARKET FLOOR / STUDIO / MENTOR HALL / COLLECTIVE, or align to the seven systems? Rename `/cockpit`?~~ **CLOSED → DL-025: KEEP the four-category command-centre model for now** — a navigation abstraction, not the seven systems; names provisional, D1 inspects fit; working term **zones**, not rooms; `/cockpit` rename recorded for later, name open | D1, N-7, N-10 | FD-NAV-001, ED-PAGE-001 | **[x] keep (provisional)** · `/cockpit`: rename later, name ____ |
| Q-4 | `/` after login: Signal Terminal (real) / redirect to Flight Deck / lighter page? TradingView stays as the chart? | D2, F-7, F-11 | MX-PAGE-001, MX-SECTION-004 | [ ] [ ] [ ] · [ ] yes [ ] later |
| Q-5 | Auth + quota on LLM and market proxies now? | T2, S5, S6 | F6, F7 | [ ] yes [ ] accept risk until real users |
| ~~Q-6~~ | ~~**Tenancy: Model A `groups` / Model B `orgs → rooms` / merge?**~~ **CLOSED → DL-020: Model B** (organization / community → rooms / channels → memberships / access; Model A superseded for design; migration needs separate approval) | D3, T3, FLOW-005 join, CO-STATE-001/002/003 | F3, D-1, D-2 | [ ] A **[x] B** [ ] merge |
| Q-7 | What does "Opportunity" mean in Community & Opportunity; is it the seed of SM? | D3, N-6 | §2.6, §2.10 | ____ |
| Q-8 | Which surface *is* Ask Archio; are Oracle / Jarvis / Nexus AI / Mentor AI the same thing? | D4, N-2, N-8, N-9 | AA-AI-001…008 | [ ] bar [ ] engine [ ] merged · retire: ____ |
| Q-9 | AI vs deterministic per system (`13` §5 table) | T4 | every §2 AI DEPENDENCY | table |
| ~~Q-10~~ | ~~**Un-park the bounded loop in this phase?**~~ **CLOSED → DL-021: design shape only** (fit · UX / shape / flows · data-model learning; no persistence / backend implementation) | D5, T5, `09` §4 parked tasks | IL-*, F4, F5 | [ ] yes **[x] design shape only** [ ] defer |
| Q-11 | Which UI (if any) becomes Decision-Record capture: Forecast Hub / Copilot / Scenario / none? | D5, N-11, D-9, D-12, F-6 | IL-PAGE-001/002, IL-SECTION-002 | [ ] [ ] [ ] [ ] new one-tap |
| Q-12 | Does Account / Money absorb Portfolio (06) and Net Worth (07)? | D6, N-4 | §2.8 | [ ] sections [ ] future L1 [ ] VISION |
| Q-13 | Ship real settings + billing UI this phase? Plans and prices? | D6, T6 | AM-STATE-001/002, F12 | [ ] yes [ ] no · prices: ____ |
| Q-14 | Theme count: 1 / 2 / 7? One token base (D-14)? | D6–D8, `12` §8.14 | FD-NAV-003, every page | [ ] [ ] [ ] · base: ____ |
| ~~Q-15~~ | ~~**What is Education in ARCHIO?**~~ **CLOSED → DL-022: combination** (dedicated learning system + contextual surfacing across Community / Ask Archio / Flight Deck / onboarding; creator knowledge → agents / marketplace = VISION) | D7 | ED-*, F14 | [ ] courses [ ] mentor method [ ] contextual **[x] combination** |
| Q-16 | Live provider direction (audio / video / stream / none this year)? | T7, F11 | CO-PAGE-003 | ____ |
| Q-17 | Is `/history` "Catch Me Up"? Is Active Window "Morning Brief"? Is Session debrief "Trade Review"? | D7, N-15, N-16, N-17 | CO-PAGE-002, FD-SECTION-001, FD-STATE-001 | yes/no ×3 |
| Q-18 | Canonical names: Passport vs Verified Track Record; trader vs student/member/user; mentor vs creator | N-5, N-12, N-13 | aliases everywhere | ____ |
| Q-19 | Which landing survives; hide internal routes behind login? | D8, F-12 | MK-PAGE-001/002, MK-PAGE-006/008 | [ ] [ ] [ ] · [ ] yes [ ] no |
| ~~Q-20~~ | ~~File the Structural Map v1 in Source of Truth; mark `09` §2 nine systems as legacy; tell QClay which map is current~~ **CLOSED → DL-019** (filed as `15`; `09` §2 marked LEGACY). *Residual action, not a decision:* tell QClay `15` is current (D8 pack) | everything (N-20, F-9) | `09`, README, QClay | **[x] yes** |
| ~~Q-21~~ | ~~Approve the three PROPOSED housekeeping edits in §5 (`08` correction · README index · verification note for Architect)~~ **CLOSED → DL-019: all three applied** (`08` corrected · README section · Structural Map v1 filed as `15`) | Architect accuracy | `08`, README, `09` | **[x] yes** [ ] no |
| Q-22 | Which of `13` §10's nine units go outside (QClay/engineers) and which stay with v0? | T8 | quote | in / out ×9 |
| Q-23 | **Exact signed-out limits (DL-026):** which public product surfaces / gadgets are explorable signed-out, and which actions trigger the login / register ask? (D1 proposes the route + action list) | D1 Block 2, S7 | SH-STATE-002, FD-PAGE-001 | list — tick per surface / action |
| Q-24 | **Zone names + placement of the 16 destinations (DL-025 addendum):** after the Product Brain's evaluation and the Red Team's challenge — per zone keep / rename-for-fit; per door keep / move. **→ PROVISIONAL D1 DESIGN DIRECTION, DL-031 (Luke, 22 Sep 2026):** MARKET FLOOR (keep) · THE STUDIO → **TRADING DESK** (reversible) · MENTOR HALL → **THE ACADEMY** (reversible) · THE COLLECTIVE (keep); doors per `12` FD-NAV-001 second table (16 → 10 + 2 shells; Nexus / My Profile / Controls → chrome; Forecasts merged). **Not struck through:** Kan's review pending (Q-28); names reversible | D1 Block 2 | FD-NAV-001 | per zone **[x] provisional** · final tick after Kan: [ ] confirm [ ] change |
| Q-25 | **KYC / account-integrity requirement (DL-029):** is stronger identity verification required, for whom, and when? (separate from authentication, biometrics, email / phone confirmation) | later auth block | SH-PAGE-001, F1 | [ ] none now [ ] at signup [ ] at first payout / social feature [ ] other: ____ |
| Q-26 | **Visible name of the central workspace (DL-030):** Dashboard / Flight Deck / Command Center — one name for tab title, nav label, greeting? ("Your Space" / "Trading Terminal" are not options unless revived) | D1 Block 2, N-7 | FD-PAGE-001, SH-NAV-001 | [ ] Dashboard [ ] Flight Deck [ ] Command Center [ ] keep several with defined roles: ____ |
| Q-27 | **Fate of the face-scan UI (DL-029 classified it DEMO/SIMULATION; Lego Q3 left unticked):** remove from the front door until real / keep as a visual but disable the fake "verified" path / keep as is | D1 Block 2 | SH-PAGE-001 | [ ] remove [ ] disable fake path [ ] keep |
| Q-28 | **Kan's asynchronous review of DL-031 (four-zone PROVISIONAL D1 DESIGN DIRECTION) and of the D1 Block 2 opening:** confirm or change per zone — names explicitly reversible (TRADING DESK ↔ Workbench / Studio; THE ACADEMY ↔ an education-oriented alternative) — and resolve **N-21** (zone "Trading Desk" vs the chart + execution surface "Trading Desk"). Until ticked, every citation of DL-031 says *provisional (Luke)* | D1 Block 2 → the first code block | FD-NAV-001, FD-SECTION-002 | [ ] confirm as is [ ] change: ____ · N-21: [ ] rename the zone [ ] rename the surface [ ] accept both |

---

## 10. Blockers register

| # | Blocker | Blocks | Kind | Owner | Way through |
|---|---|---|---|---|---|
| ~~B-1~~ | ~~Structural Map v1 not in the repo~~ **RESOLVED 20 Sep 2026 — filed as `15` (DL-019).** Levels 2–3 still unwritten (maturity, not a blocker) | citation of levels; QClay alignment | governance | — | residual: tell QClay `15` is current (D8) |
| ~~B-2~~ | ~~Tenancy undecided (F3)~~ **RESOLVED — Model B (DL-020).** Join / create / detail design unblocked. *Not resolved by it:* D-1 collapse — a migration needs its own approval (B-6) | ~~join / create / detail design~~; D-1 collapse | decision → technical (B-6) | Luke + Kan (migration approval) | B-6 when the founders approve a migration |
| ~~B-3~~ | ~~Bounded loop parked~~ **RESOLVED as a decision — DL-021: design shape only this phase.** Implementation stays parked *by choice*, so it no longer blocks D5 (design) or T5 (read-only learning); it blocks only persistence, which is out of phase | ~~any IL persistence~~ (out of phase); Architect three-table spec remains reading material | decision | — | revisit after the FLOWS phase |
| ~~B-4~~ | ~~Education undefined~~ **RESOLVED — combination (DL-022).** ED screens now wait on the Education *flows* (D7), not on a definition | ~~every ED screen~~ → ED flows first | decision → design sequencing | Product Brain (map) → founders (review) | D7 |
| B-5 | Live DB state unverifiable from repo | which `groups` DDL is applied; whether `006` seed ran | access | v0 needs DB access (Supabase MCP or read query) | grant access; v0 writes a dated verification note |
| B-6 | No migration discipline | any schema change safely | technical | v0 (after Q-6) | `13` §10 unit 2 |
| B-7 | S1–S4 open writes | putting any real trader data in | security | v0 (small) | fix in T2/T3/T7; none touched by these documents |
| B-8 | 483 TS errors hidden | trusting "it renders" | technical debt | v0 | policy in T6 (block new; schedule burn-down) |
| B-9 | Broker data absent (F10) | every real number on Flight Deck; COMPARE | integration | CSV first (Architect rule); Owen read-only later | T7 question sheet |
| B-10 | No live transport (F11) | Live Room being real | integration | provider choice (Q-16) | T7 |
| B-11 | ~~Four naming layers (N-20)~~ **Reduced (DL-019):** one current map (`15`); nine-system list = legacy aliases; QClay map = legacy page IDs. Remaining layer: ~~Room Navigator rooms vs the seven systems (Q-3, N-7)~~ → zones are *not a map* by decision (DL-025); what remains is zone-fit (Q-24, Product Brain review) and the workspace's visible name (Q-26, DL-030) | every cross-AI conversation | naming | Luke + Kan | Q-24, Q-26; §3.3 |
| B-12 | No founder approval recorded anywhere | QClay handoff | process | Luke + Kan | D1 onward: set two columns per record |

---

## Appendix A — Matrix field definitions (§2)

| Field | Definition | Allowed values / form |
|---|---|---|
| CANONICAL NAME | the one name to use | from `11`, `01` DECIDED, Structural Map v1, or `12` |
| ALIASES / LEGACY NAMES | every other name seen for the same thing, with where it lives | free text; each alias traceable to §3.1 |
| STRUCTURAL MAP LEVEL | Level 1 (seven systems) · Level 4 / VISION · outside (SH, MK). Levels 2–3 are **not defined in any repo document** (B-1); sub-features are written as record IDs, not levels | L1 · L4/VISION · outside |
| OWNER SYSTEM | the one Level-1 system; `OWNER: PROPOSED` if arguable | system code |
| USER-FACING SURFACES | `12` record IDs | IDs |
| IMPORTANT SUBFEATURES | what a founder would list if asked "what's in it" | short list |
| ROUTES / COMPONENTS | exact paths | paths |
| ASSOCIATED DATA | tables that exist; objects that should | table names · `MISSING` |
| TECHNICAL FOUNDATIONS | `13` §4 F# with its status | F# (REAL / PARTIAL / MISSING) |
| AI DEPENDENCY | real endpoint + model, or `none`, or `should be deterministic` | per `13` §5–§6 |
| INTEGRATION DEPENDENCY | external systems | Polygon · TradingView · Stripe · Supabase Auth · AI Gateway · broker |
| PRIVACY / PERMISSION SENSITIVITY | Low / Medium / High / Highest, with the reason | scale + reason |
| CURRENT DESIGN STATUS | `12` §1.1 vocabulary, may list several | vocabulary |
| CURRENT FUNCTIONAL STATUS | `12` §1.2 vocabulary | vocabulary |
| CURRENT BACKEND STATUS | REAL / PARTIAL / MISSING / BACKEND-READY (exists, no UI) / dead | `13` §1 vocabulary |
| FOUNDER DECISION STATUS | DL entries that bind it; what is undecided | DL-0xx · "undecided: …" |
| LUKE REVIEW · KAN REVIEW | one column each | NOT REVIEWED · CHANGES REQUESTED · APPROVED |
| QCLAY RELEVANCE | legacy `0N.n` mapping and what QClay may receive | legacy IDs + note |
| GROK BOT RESPONSIBLE (planning) | which bot's *first task* (`09` §4) touches it | Product Brain · Red Team · Architect · none |
| SOURCE-OF-TRUTH REFERENCES | file + section | `NN` §n |
| SCREENSHOTS / REFERENCE LINKS | `docs/screens/<SYSTEM>/…` paths | paths · "none yet" |
| BLOCKERS | §10 items or free text | B-# |
| NEXT REQUIRED DECISION | one fill-in-the-blank question | form |

## Appendix B — Reading order for a new human

1. `README.md` standing facts → 2. `11` (scope + phase) → 3. this file §0 → 4. `12` §3 (map → code) and §11 (counts) → 5. `13` §2.10 (what is demo) and §4 (foundations at a glance) → 6. this file §6 (runway) and §9 (your inbox). Total: under an hour. Everything else is reference.

## Appendix C — Distribution (how these files travel between AIs)

The master copies are `docs/source-of-truth/*.md` in the repo. `scripts/bundle-source-of-truth.mjs` publishes read-only copies to `public/docs/source-of-truth/` so the whole folder moves in one download:

| Artifact | Path on any deployment / preview | Use |
|----------|----------------------------------|-----|
| Download page | `/docs/source-of-truth/index.html` | one screen, every link below |
| Whole folder | `/docs/source-of-truth/archio-source-of-truth.zip` | all 16 files, original names, plus both bundles |
| Control bundle | `/docs/source-of-truth/ARCHIO-CONTROL-CENTER-12-13-14.md` | `12` + `13` + `14` as ONE file — the object ChatGPT receives; each file begins at a `<!-- FILE: name -->` marker so `NN §n` references still resolve |
| Full bundle | `/docs/source-of-truth/ARCHIO-SOURCE-OF-TRUTH-ALL.md` | README + `00`…`14` as one file, for an AI that needs the governance layer too |

Rules. (1) The bundles are copies, never edited by hand — a change made in a bundle is lost at the next run. (2) Re-run the script after any edit to `docs/source-of-truth/`; the page shows its publish date, and a date older than the newest master file means the copies are stale. (3) The Grok starter pack (`public/docs/grok/ARCHIO-GROK-STARTER-PACK.zip`) is a *separate* artifact built from `09` §5 and is not regenerated by this script (see §5 PROPOSED items).
