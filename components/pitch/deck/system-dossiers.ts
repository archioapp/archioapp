/* ═══════════════════════════════════════════════════════════════════════
   THE NINE SYSTEMS — one dossier each, in the canon order.
   Source of truth: ARCHIO Dashboard Design Specification v1.0 (QClay).
   Every field is written to be READ ALOUD by a founder to a founder:
     what      what it IS, in plain words, one breath
     analogy   the thing Owen already understands
     inside    the real pages/modules (from the spec), in the order a trader meets them
     replaces  the app he uses today for this, and why it fails
     kills     which Act I problem this system answers
     how       how it actually solves it, two sentences, no marketing
   ═══════════════════════════════════════════════════════════════════════ */

import { useSyncExternalStore } from "react"
import {
  LayoutPanelTop, Users, Target, Dna, Bot, PieChart, Landmark, ShieldCheck, Rss,
  type LucideIcon,
} from "lucide-react"

export type DossierStatus = "real" | "demo" | "planned"

export interface DossierPage { name: string; does: string; status?: DossierStatus }
export interface DossierReplace { app: string; fails: string }

export interface SystemDossier {
  n: string
  id: string
  name: string
  icon: LucideIcon
  status: DossierStatus
  /** the trader's pain, in his words */
  quote: string
  what: string
  analogy: string
  inside: DossierPage[]
  replaces: DossierReplace[]
  /** Act I problem numbers + names */
  kills: { n: string; name: string }[]
  loop: string
  feeds: string[]
  how: string
  /** the sentence to say when this card is open */
  say: string
}

export const PROBLEMS = {
  noise: { n: "01", name: "Noise" },
  blind: { n: "02", name: "Blind tools" },
  bill: { n: "03", name: "The bill" },
  fakes: { n: "04", name: "Fakes" },
  screenshots: { n: "05", name: "Screenshots" },
  lostcalls: { n: "06", name: "Lost calls" },
  chaos: { n: "07", name: "Account chaos" },
  ninety: { n: "08", name: "The 90%" },
} as const

export const DOSSIERS: SystemDossier[] = [
  {
    n: "01",
    id: "flightdeck",
    name: "Flight Deck",
    icon: LayoutPanelTop,
    status: "demo",
    quote: "One place that actually knows me.",
    what: "The window everything else lives in. Chart in the centre, the mentor's room slides in from the left, the order ticket and your accounts sit on the right, and Archio drops down from the top when you talk to it.",
    analogy: "A cockpit. You never leave your seat — the instruments come to you.",
    inside: [
      { name: "Workspace", does: "Chart-centred. Community slides in left, execution rail right, Archio bar top. Opening any system never loses the chart.", status: "demo" },
      { name: "Morning Brief", does: "Five lines when you sit down: overnight impact, contracts near invalidation, unresolved work, what the room said, today's calendar, one next action. 'Start my day' turns it into the plan.", status: "demo" },
      { name: "Ask Archio", does: "Text, voice or select-on-chart. It knows the object on screen. Shows sources and confidence. Writes the answer back into the right system.", status: "real" },
      { name: "Account & Execution Center", does: "Every connected account with live / prop / demo / wallet labels, read-only vs trading permission, the order ticket, and the Pre-Trade Contract state before you confirm.", status: "demo" },
      { name: "Workspace Customizer", does: "Edit mode: drag, resize, add modules from Market · Decisions · Risk · Community · Journal · AI. Save, version, and publish a privacy-safe copy to the Marketplace.", status: "planned" },
      { name: "Notifications & Interventions", does: "Market alerts, rule interventions, room updates, verification events — each with source, severity and one direct action.", status: "planned" },
    ],
    replaces: [
      { app: "Nine browser tabs", fails: "Chart here, mentor there, rules somewhere else. Nothing shares context." },
      { app: "TradingView layouts", fails: "Great chart. Knows nothing about your rules, your room or your account." },
      { app: "ChatGPT", fails: "Knows markets. Has never seen your trades, your rules, or what your mentor said." },
    ],
    kills: [PROBLEMS.blind, PROBLEMS.bill],
    loop: "Every step — it is where the loop runs",
    feeds: ["every other system"],
    how: "You don't navigate software. You ask, and the right room opens next to the chart. Because everything opens inside one window on one record, the AI on top of it actually knows you.",
    say: "This is the window. Chart in the middle. Mentor slides in from the left. Ticket and accounts on the right. Archio drops from the top when you ask it something. You never leave. Everything the other eight systems do happens inside this one screen.",
  },
  {
    n: "02",
    id: "community",
    name: "Community",
    icon: Users,
    status: "demo",
    quote: "My mentor went live. I missed everything.",
    what: "Verified rooms with memory. A mentor passes KYC, his record goes on the door, and every live call lands on a timeline you can catch up on — next to the chart, not in another app.",
    analogy: "Skool, Whop, Discord and Zoom in one room — except the room remembers, and the host is proven.",
    inside: [
      { name: "Discovery", does: "Search rooms by type, live status, price, verified host, schedule and 'why this fits you'. No fake servers — the host's record is on the card.", status: "demo" },
      { name: "Room Detail", does: "Purpose, verified host and record, schedule, curriculum, rules, pricing, a sample Catch Me Up — before you pay.", status: "demo" },
      { name: "Live Room", does: "The mentor's stream or shared chart is the stage. Timeline of calls, pinned thesis, verified host plate, locked forecasts, Ask the Room's Brain, Catch Me Up. Turn his thesis into your forecast — with attribution.", status: "demo" },
      { name: "Catch Me Up", does: "Late? One button: opening thesis, what changed, the important calls, open questions, where the room agrees and disagrees. Every line jumps to the source moment.", status: "demo" },
      { name: "Mentor Gameplan", does: "The week the mentor wrote on Sunday: news to trade, bias per instrument, the read, the rules. Sits beside the chart all week.", status: "demo" },
      { name: "Room Memory", does: "Searchable archive of sessions, transcripts, theses and what happened after. Who said it, when, in what market.", status: "planned" },
      { name: "Mentor Studio", does: "Tiers, scheduling, curriculum, moderators, AI answer review, room-agent config, members, refunds, analytics, earnings.", status: "planned" },
    ],
    replaces: [
      { app: "Discord", fails: "The call happens, then it's 4,000 messages up. No memory, no proof of who the host is." },
      { app: "Skool", fails: "Course plus community — with no chart, no track record on the teacher, no idea what his students actually do." },
      { app: "Whop", fails: "Sells the room. Shows a member count. Shows no record." },
      { app: "Zoom / Google Meet", fails: "The live call ends and it's gone. Nobody can catch up." },
      { app: "Telegram · WhatsApp", fails: "Signals from a name that might be fake. Nothing verified, nothing recorded." },
    ],
    kills: [PROBLEMS.noise, PROBLEMS.fakes, PROBLEMS.lostcalls],
    loop: "01 Context",
    feeds: ["Decision Desk (the mentor's thesis)", "Track Record (the mentor's calls)"],
    how: "KYC on the host and his record on the door — so the fake maze dies. Every call stamped on a timeline with Catch Me Up — so the lost call dies. And it all happens beside the chart, so the mentor's thesis becomes your forecast in one click.",
    say: "This replaces Discord, Skool, Whop and the Zoom call at once. The host is KYC'd, his record is on the door. When he goes live the room slides in next to your chart. Every call is stamped. If you walk in late, Catch Me Up. And his thesis becomes your forecast with his name attached.",
  },
  {
    n: "03",
    id: "decisiondesk",
    name: "Decision Desk",
    icon: Target,
    status: "demo",
    quote: "I made six trades today. I couldn't tell you why.",
    what: "Three things, in order. Forecast: say what you think will happen, before it happens. Decision: trade, don't trade, or simulate — with the reasons. Contract: lock the entry, the invalidation, the size and the exit, and check your own rules before the ticket.",
    analogy: "A pre-flight checklist. Pilots don't skip it because they're experienced — they do it because they are.",
    inside: [
      { name: "Forecast", does: "Direction, level, invalidation, time horizon, why. Locked with a timestamp and a chart snapshot. Public or private. Nothing can be edited after the lock.", status: "demo" },
      { name: "Decision Builder", does: "Turn a forecast into trade / no-trade / simulate. Setup, reasons, alternatives, risk, expected value, rule checks, 'why now'. Doing nothing is a valid, recorded decision.", status: "planned" },
      { name: "Pre-Trade Contract", does: "Lock entry, invalidation, target, size, time condition and exit. Your rules show green / yellow / red before you confirm. At invalidation the contract resurfaces and demands an action.", status: "demo" },
      { name: "Active Decisions", does: "Upcoming, active, breached, expired, completed — with timers, status reasons and the next required action.", status: "planned" },
      { name: "Auto-Journal", does: "The entry writes itself from the forecast, the contract, the fill and the result. You add reflection and emotion. Nothing overwrites the source events.", status: "demo" },
      { name: "Daily & Weekly Review", does: "Preparation, rule adherence, execution and review quality scored separately from P&L. Repeated patterns. Recommended rule changes.", status: "demo" },
      { name: "Autopsy Replay", does: "Replay thesis → chart → decision → contract → fill → emotion → outcome, and the exact point the process broke.", status: "planned" },
    ],
    replaces: [
      { app: "His head", fails: "The thesis lived there. It changed after the outcome. Nobody can prove what he believed at 08:31." },
      { app: "A Notion page of rules", fails: "Written once, never opened at the ticket. The rule was in another tab." },
      { app: "Tradezella · TraderSync", fails: "A journal written after the result, by the person who lost. Hindsight is a terrible database." },
      { app: "Excel", fails: "P&L only. It records what happened, never what was decided." },
    ],
    kills: [PROBLEMS.screenshots, PROBLEMS.ninety],
    loop: "02 Thesis · 03 Decision · 05 Review",
    feeds: ["Track Record (every locked forecast)", "Trading DNA (every rule check)"],
    how: "The forecast is stamped before the outcome exists, so nobody can claim after the fact. The rules are checked in front of the ticket, not in a tab somewhere. And the journal writes itself from those two, so the review is honest.",
    say: "Three things. Forecast — say it before the trade, locked. Decision — trade, no-trade, or simulate, with reasons. Contract — entry, invalidation, size, exit, and your own rules checked before you're allowed to click. Then the journal writes itself. That is the whole loop, made conscious.",
  },
  {
    n: "04",
    id: "tradingdna",
    name: "Trading DNA",
    icon: Dna,
    status: "demo",
    quote: "Why do I keep breaking my own rules?",
    what: "Your trading passport. Built from your own record — not typed by you — it shows your edge, your limits, your best sessions, your worst triggers, and how well you follow your own rules. Tied to your KYC identity, so it travels with you.",
    analogy: "A credit score for how you trade. Nobody asks you to describe yourself; the record describes you.",
    inside: [
      { name: "DNA Overview", does: "Edge, risk limits, setups, session performance, calibration, confidence, rule adherence, psychology triggers, recent changes. Every conclusion links to the evidence.", status: "demo" },
      { name: "Mind Check", does: "The current trigger, the matching historical pattern, what it cost last time, and a small set of options: wait, reduce size, paper mode, ask the mentor, or override on the record.", status: "planned" },
      { name: "Rules & Playbook", does: "Active, experimental and retired rules. Evidence for each. Explicit override history and its effect on decision quality.", status: "demo" },
      { name: "Pattern Explorer", does: "Filter by market, setup, session, result, emotional state, adherence, time. Always shows sample size and confidence.", status: "planned" },
      { name: "Cold Streak Protocol", does: "Temporary size caps, paper mode, fewer markets, support prompts, exit criteria — with your explicit consent.", status: "planned" },
      { name: "Shadow Mode", does: "Run your decisions beside a mentor's. Timing, risk, outcome. Compatibility over a real sample size.", status: "planned" },
      { name: "DNA Evolution", does: "A dated timeline of how you changed. Rules adopted and retired. Not personality as destiny.", status: "planned" },
    ],
    replaces: [
      { app: "Nothing", fails: "There is no product for this. A psychology book, a coach at $500 an hour, or a spreadsheet nobody keeps." },
      { app: "Myfxbook", fails: "Shows the balance curve. Knows nothing about which rule broke, or when." },
      { app: "The mentor's opinion of you", fails: "Honest, sometimes. Unmeasured, always." },
    ],
    kills: [PROBLEMS.ninety, PROBLEMS.screenshots],
    loop: "03 Decision · 05 Review",
    feeds: ["Decision Desk (the rules at the ticket)", "Track Record (the public passport)", "Marketplace (what agents may read)"],
    how: "It is computed from the record — forecasts, contracts, fills, reviews — so it cannot be faked or flattered. It sits in front of the ticket as Mind Check, and it becomes the public passport other traders trust.",
    say: "Think of a credit score. You don't write your own. It's computed from what you actually did. Trading DNA is that for traders: built from the record, tied to KYC, shown as a passport. And before the next ticket it taps you on the shoulder — 'you break this rule after a loss; you're after a loss.'",
  },
  {
    n: "05",
    id: "marketplace",
    name: "AI Agent Marketplace",
    icon: Bot,
    status: "planned",
    quote: "An analyst, a risk manager, a coach — all AI.",
    what: "Two things, and only two. Agents: install the way someone THINKS — a mentor's clone, trained on his calls and rules, that works on your record 24/7. Layouts: install the way someone WORKS — a pro's Flight Deck, one click. Not indicators. Not bots.",
    analogy: "The App Store, for judgment. You don't buy a script; you hire how a proven person thinks, and it runs on your own data.",
    inside: [
      { name: "Discovery", does: "Two product classes: Agents and Layouts. Fit, compatibility, verified creator, proof, pricing, updates. No indicators, no signal groups.", status: "planned" },
      { name: "Agent Listing", does: "Purpose, creator's verified record, what it was trained on, citations, what it may read and do, sample outputs, limits, version, price, refund.", status: "planned" },
      { name: "Layout Listing", does: "Live preview, module map, requirements, private-data stripped, one-click install into a new workspace version.", status: "planned" },
      { name: "Agent Builder · Training Studio", does: "A mentor picks his sources — sessions, calls, rules — defines purpose and forbidden actions, tests it, inspects citations, sets permissions, publishes. His clone.", status: "planned" },
      { name: "Layout Publisher", does: "Strip personal data, package the workspace, set license and price, publish an installable version.", status: "planned" },
      { name: "Installed Library", does: "Activation, permissions, updates, versions, billing, rollback. Your data stays yours; the creator's assets stay theirs.", status: "planned" },
      { name: "Creator Storefront & Earnings", does: "Verified identity, catalogue, proof, reviews, revenue, fees, refunds, payouts.", status: "planned" },
    ],
    replaces: [
      { app: "TradingView scripts · MQL5 bots", fails: "An indicator draws a line. A bot follows a formula. Neither knows your rules or the mentor's reasoning." },
      { app: "Gumroad courses · PDF strategies", fails: "Static. You read it once. It does not sit next to your chart at 3 AM." },
      { app: "Fiverr 'mentorship'", fails: "A stranger, unverified, paid up front." },
    ],
    kills: [PROBLEMS.bill, PROBLEMS.fakes],
    loop: "How method spreads — from one record to a thousand",
    feeds: ["Flight Deck (installed layouts)", "Decision Desk (agents at the ticket)", "the economy (every sale)"],
    how: "A clone is trained only on sources the mentor chose, runs only on the record the buyer allowed, and cites what it read. A layout installs a proven way of working in one click. Both are sold by a verified creator with a public record — so proof, not promises, sets the price.",
    say: "Not indicators. Not bots. Two things: install the way someone thinks, and install the way someone works. A mentor trains a clone on his own calls and rules — it answers his students at 3 AM, on their own record. A pro publishes his Flight Deck — you install how he works in one click. Verified creators, public proof, and Archio takes a percentage of every sale.",
  },
  {
    n: "06",
    id: "portfolio",
    name: "Portfolio",
    icon: PieChart,
    status: "planned",
    quote: "What happens if BTC drops 30%?",
    what: "Every account, exchange and wallet in one truth — read-only keys, your custody. Positions, leverage, liquidation distance, fees, concentration and correlation across all of them, with the freshness of each source shown honestly.",
    analogy: "The one screen a fund's risk desk has, that a retail trader has never had.",
    inside: [
      { name: "Portfolio Overview", does: "Connected accounts, wallets, positions, leverage, liquidation distance, fees, concentration, correlation, data freshness. Verified values separated from manual ones.", status: "planned" },
      { name: "Connections & Wallets", does: "Connect, revoke, test, resync brokers, exchanges and wallets. Read-only vs trade permission. Last sync, errors, gaps — in plain language.", status: "planned" },
      { name: "Position Detail", does: "History, the linked forecast and contract, fills and fees, margin state, correlations, portfolio impact, current thesis.", status: "planned" },
      { name: "What If Scenario Lab", does: "First-order and cascade effects across spot, perps, wallets and correlated positions. Assumptions and confidence shown. Ranked possible actions — never guaranteed advice.", status: "planned" },
      { name: "Pre-Trade Impact Preview", does: "What this ticket does to concentration, leverage, liquidation and drawdown — written back into the Contract before you confirm.", status: "planned" },
      { name: "Transaction Ledger", does: "Orders, fills, transfers, fees, funding, adjustments — one ledger, each line linked to its decision and journal entry.", status: "planned" },
    ],
    replaces: [
      { app: "Four broker apps", fails: "Four balances, four P&Ls, none of them aware of the others." },
      { app: "Binance · Bybit · MetaMask", fails: "Crypto in three places, leverage in two. No one sees the whole exposure." },
      { app: "A spreadsheet updated on Sunday", fails: "Stale by Monday. Wrong by Tuesday." },
    ],
    kills: [PROBLEMS.chaos],
    loop: "04 Execution · 05 Review",
    feeds: ["Decision Desk (impact preview at the ticket)", "Net Worth (the one number)", "Track Record (verified fills)"],
    how: "Read-only keys into every account and wallet, one ledger, one exposure map. Decentralised in the right way: your custody, your keys — one truth about what you actually hold and what it does to you if the market moves.",
    say: "Every broker, every exchange, every wallet — read-only, your keys — in one place. Not to trade from. To know. What happens to everything you hold if BTC drops thirty percent? Today nobody in retail can answer that. Here it's a button.",
  },
  {
    n: "07",
    id: "networth",
    name: "Net Worth",
    icon: Landmark,
    status: "planned",
    quote: "I trade every day. I still don't know what I'm worth.",
    what: "The private layer. Your whole financial life — accounts, property, income, debt — as one number with its source quality and liquidity, private by default. It feeds the size limit on every ticket, so risk is measured against what you actually have.",
    analogy: "The number a wealth manager keeps for a client — for someone who has never had a wealth manager.",
    inside: [
      { name: "Net Worth Overview", does: "Total, change, source quality, liquidity, protected capital, private / public state. Estimates never shown as verified balances.", status: "planned" },
      { name: "Exposure Map", does: "Common drivers and correlated risks across holdings and income. Direct, linked and inferred exposure shown differently.", status: "planned" },
      { name: "Runway Planner", does: "Baseline and stressed survival horizon from liquidity, obligations and income. Assumptions and protected capital editable.", status: "planned" },
      { name: "Assets · Liabilities · Income", does: "Categorised inventory, ownership, valuation date, confidence, recurring income, debt terms, privacy controls.", status: "planned" },
      { name: "Life What If", does: "Editable scenarios — a move, a purchase, a bad quarter — and their downstream effect on future risk limits. Planning, not advice.", status: "planned" },
    ],
    replaces: [
      { app: "Budgeting apps", fails: "Built for salaries and groceries. They have never heard of a prop challenge or a perp." },
      { app: "The bank app", fails: "One account. Not the six others." },
      { app: "Nothing", fails: "Most traders simply don't know. The trading account is the only number they watch." },
    ],
    kills: [PROBLEMS.chaos],
    loop: "03 Decision (risk measured against worth)",
    feeds: ["Decision Desk (the size limit)", "Trading DNA (risk vs worth)"],
    how: "Private by default, one number, sourced honestly. Once the size limit on the ticket knows what you are actually worth, 'risk 1%' finally means one percent of something real.",
    say: "Private. Nobody sees this but you. Everything you own and owe as one number. And that number quietly sets the size limit on every ticket — so one percent risk means one percent of your life, not one percent of a demo account.",
  },
  {
    n: "08",
    id: "trackrecord",
    name: "AI Verified Track Record",
    icon: ShieldCheck,
    status: "demo",
    quote: "Everyone claims. Here, everything is proven.",
    what: "The spine under everything. One KYC'd identity. Every forecast locked before the outcome, every fill linked, every claim audited by the system — not typed by the person. A private record centre, and a public passport you choose what to show on.",
    analogy: "The credit bureau of trading. You don't get to write your own history — but you decide who sees it.",
    inside: [
      { name: "Private Record Center", does: "Entries, metrics, provenance, visibility, pending verdicts, disputes, connected sources, public eligibility. Append-only.", status: "demo" },
      { name: "Public Trader Passport", does: "Verified username, markets and style, public forecast record, roles, badges, selected metrics, products, posts. Never private DNA, exact balances or unselected history.", status: "demo" },
      { name: "Record Entry · Audit Trail", does: "The locked source object, timestamps, market data, chart, AI verdict, confidence, updates, dispute history, final resolution.", status: "demo" },
      { name: "Verification & KYC Center", does: "Consent, vendor handoff, pending / approved / failed / appeal. Identity verification kept separate from performance verification.", status: "planned" },
      { name: "Permissions & Privacy", does: "Default visibility, per-object overrides, agent access, community sharing, Marketplace training permission, export, deletion.", status: "planned" },
      { name: "AI Verdict · Dispute Review", does: "The verdict, its confidence, source data, method, the disputed field, your evidence, reviewer state — without silently rewriting the original.", status: "planned" },
      { name: "Proof-of-Skill Challenges", does: "Free locked-forecast challenges with rules, scoring, AI audit, anti-cheat and badges. Earn a record before you have capital.", status: "planned" },
    ],
    replaces: [
      { app: "Screenshots", fails: "Cropped, undated, unverifiable — and the only proof retail trading has ever had." },
      { app: "Myfxbook · FXBlue", fails: "Balance curves. They verify the account, not the decision, and they can be gamed with a fresh account." },
      { app: "'Trust me bro'", fails: "The current standard." },
    ],
    kills: [PROBLEMS.fakes, PROBLEMS.screenshots],
    loop: "05 Review → Prove",
    feeds: ["Community (the host's record on the door)", "Social Network (every post carries proof)", "Marketplace (creator proof)"],
    how: "Identity is verified once. Every forecast is locked before the outcome exists and audited by the system when it resolves. So a track record here is not something you type — it is something that happened, that you can show.",
    say: "This is the spine. One KYC'd identity. Every forecast locked before the result, every trade linked, audited by the system. The private centre is yours; the public passport shows only what you choose. Screenshots are dead. This is the proof layer the whole industry has been missing.",
  },
  {
    n: "09",
    id: "social",
    name: "Social Network",
    icon: Rss,
    status: "planned",
    quote: "A feed for money — not for likes.",
    what: "Where the next trader finds the real mentor. A feed where every post carries the poster's verified record, a forecast is a living object you can follow to its resolution, and ranking rewards proof — not engagement. Replaces the fintwit noise with a network you can trust.",
    analogy: "X for traders — if every account had a credit score on it and nobody could post a screenshot.",
    inside: [
      { name: "Proof Feed", does: "Living charts, locked forecasts, record plates, room clips, autopsies, questions, products — each with source, timestamp, current state and proof status.", status: "planned" },
      { name: "Post Composer", does: "Text, living chart, forecast, room clip, autopsy, question, product. Privacy, attribution and record linkage shown before you publish.", status: "planned" },
      { name: "Post Detail · Discussion", does: "The source object, its current state, the author's proof, an AI summary of the arguments, conversion into your own forecast.", status: "planned" },
      { name: "Following & Discovery", does: "Verified status, mutual context, why this was recommended. No opaque engagement ranking.", status: "planned" },
      { name: "Autopsy Post", does: "Publish the timeline, the break point, the chart, the lesson and the rule change — with privacy checks first.", status: "planned" },
      { name: "Company · Institution Profile", does: "KYC / KYB, official people, claims vs verified data, products, public records, disclosures.", status: "planned" },
      { name: "Messages & Collaboration", does: "Conversations, object sharing, room invitations, permissions, safety, retention.", status: "planned" },
    ],
    replaces: [
      { app: "X · fintwit", fails: "Screenshots, deleted losers, twenty accounts wearing one mentor's name. Ranked by outrage." },
      { app: "Instagram P&L", fails: "A green number on a phone. Proves nothing. Sells everything." },
      { app: "YouTube 'gurus'", fails: "Great production. No record. Never wrong, because never stamped." },
      { app: "Telegram broadcasts", fails: "One-way. Unverified. The fake maze's front door." },
    ],
    kills: [PROBLEMS.noise, PROBLEMS.fakes, PROBLEMS.screenshots],
    loop: "01 Context — where the loop begins for the next trader",
    feeds: ["Community (the room behind the post)", "Marketplace (the product behind the post)", "Track Record (the proof on every post)"],
    how: "You cannot post a screenshot; you post a locked forecast, and the feed shows how it resolved. Every account carries its passport. So the network ranks people by what actually happened — and the fake maze has nowhere to stand.",
    say: "Last one. Where the next trader finds the real mentor. A feed where you can't post a screenshot — you post a forecast, and everyone watches it resolve. Every account carries its record. It ranks proof, not engagement. That is how the noise from slide one finally ends.",
  },
]

export const DOSSIER_BY_ID = Object.fromEntries(DOSSIERS.map((d) => [d.id, d])) as Record<string, SystemDossier>

/* ── focus store ─────────────────────────────────────────────────────────
   The System Map publishes which dossier is open; the presenter drawer
   (press N) reads it and prints that system's exact `say` line under the
   slide script. A tiny external store so neither side owns the other.   */
let focusedId: string | null = null
const listeners = new Set<() => void>()
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
export function setDossierFocus(id: string | null) {
  if (focusedId === id) return
  focusedId = id
  listeners.forEach((fn) => fn())
}
export function useDossierFocus(): SystemDossier | null {
  const id = useSyncExternalStore(subscribe, () => focusedId, () => null)
  return id ? (DOSSIER_BY_ID[id] ?? null) : null
}
