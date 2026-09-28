/* ═══════════════════════════════════════════════════════════════════════════
   THE OWEN CALL — every word on every surface lives here.
   /owen = what Owen sees (four screens). /owen/presenter = what Kan and Luke
   see. /owen/guide = the same presenter guide, printable. Change copy here
   and every surface follows. OWEN_MEETING_PRESENTER_GUIDE.md at the repo
   root mirrors GUIDE + EMERGENCY word for word.
   ═══════════════════════════════════════════════════════════════════════════ */

export const GUEST = { first: "Owen" }

export type ScreenId = "gap" | "decision" | "today" | "session"

export type Screen = { id: ScreenId; title: string }

export const SCREENS: Screen[] = [
  { id: "gap", title: "The gap" },
  { id: "decision", title: "One decision" },
  { id: "today", title: "Where we are today" },
  { id: "session", title: "Working session" },
]

/* ── Screen 1 — THE GAP ──────────────────────────────────────────────── */

export const GAP = {
  headline: ["A trade has a record.", "The decision behind it usually doesn't."],
  chain: ["Context", "Thesis", "Decision", "Execution", "Review"],
  /** the one node that already has a record today */
  recorded: "Execution",
  thread: "ARCHIO keeps the record",
}

/* ── Screen 2 — ONE DECISION ─────────────────────────────────────────── */

export const DECISION = {
  headline: "One trade. One connected story.",
  steps: [
    { label: "Context", sub: "Mentor / information" },
    { label: "Thesis", sub: "What I believe" },
    { label: "Decision", sub: "Rules before action" },
    { label: "Execution", sub: "What I actually did" },
    { label: "Review", sub: "What happened and why" },
  ],
  footer: "The record gets smarter with every decision.",
}

/* ── Screen 3 — WHERE WE ARE TODAY ───────────────────────────────────── */

export const TODAY = {
  headline: "Where we are today",
  columns: [
    { id: "live", label: "Live", items: ["Accounts", "Community infrastructure", "AI engine", "Billing"] },
    { id: "built", label: "Built · demo state", items: ["Live Room", "Forecast", "Rule check", "Trade review"] },
    { id: "next", label: "Next", items: ["Connect the record", "Broker data", "Real trader history"] },
  ] as { id: "live" | "built" | "next"; label: string; items: string[] }[],
}

/* ── Screen 4 — WORKING SESSION ──────────────────────────────────────── */

export const SESSION = {
  headline: "What would you do from here?",
  questions: ["Is the problem real?", "What should a platform own — and what should a partner build?", "What would you prove next?"],
}

/* ── The presenter guide (Kan + Luke only) ───────────────────────────── */

export type GuideBlock = { who: "KAN" | "LUKE" | "TRANSITION" | "OPTIONAL"; lines: string[] }

export type DemoStep = { where: string; beat: string; do: string[]; say: string }

export type GuideScreen = {
  goal: string
  blocks: GuideBlock[]
  demo?: DemoStep[]
  aha?: string
  ask?: { label: string; lines: string[] }
  stop: string[]
  options?: string[]
}

export const GUIDE: Record<ScreenId, GuideScreen> = {
  gap: {
    goal: "Get Owen to understand the problem.",
    blocks: [
      {
        who: "KAN",
        lines: [
          "Quick hello / Mahdi connection.",
          "Ask naturally: “By the way, what does your timing look like? We can keep this tight.”",
          "“We started building because trading felt fragmented across a bunch of tools.”",
          "“The deeper we got, the more we realized the bigger problem wasn’t the number of tools. It was that the context gets lost between them.”",
          "“A trade has a record. The decision behind it usually doesn’t.”",
          "“That is really what ARCHIO has turned into.”",
        ],
      },
    ],
    ask: { label: "Ask", lines: ["“Does that problem make sense from what you’ve seen?”"] },
    stop: ["STOP TALKING.", "LET OWEN ANSWER."],
  },

  decision: {
    goal: "Show one journey instead of explaining the entire product.",
    blocks: [
      { who: "TRANSITION", lines: ["“Rather than walk you through twenty things, let us show you one decision going through it.”"] },
      { who: "KAN", lines: ["“Luke, pull it up.”"] },
      { who: "LUKE", lines: ["Run the live demo. Say the line BEFORE the click, every time."] },
    ],
    demo: [
      {
        where: "/live-room",
        beat: "CONTEXT",
        do: ["Press 3 → Timeline.", "Point at the mentor’s call on the timeline."],
        say: "“Scripted session, real interface.”",
      },
      {
        where: "same page",
        beat: "THESIS",
        do: ["Press R → Forecast (prefilled from the mentor’s thesis · XAU/USD long).", "Click Publish. It lands on the timeline next to the call."],
        say: "“What he believed, stamped before anything happens.”",
      },
      {
        where: "same page",
        beat: "DECISION",
        do: ["Press W → Compare plan.", "Read the alignment verdict."],
        say: "“The rule check before the ticket.”",
      },
      {
        where: "nowhere",
        beat: "EXECUTION",
        do: ["DO NOT CLICK ANY EXECUTION UI."],
        say: "“The fill is the platform event. We don’t have a broker connection today. That’s the missing middle.”",
      },
      {
        where: "/dashboard",
        beat: "REVIEW",
        do: ["In the ASK box type: Why did I lose yesterday?  → Enter.", "Wait for the verdict (~6 s). Read only the most powerful findings: the two R numbers, the oversize-after-loss line, the lesson."],
        say: "Before running: “The engine is real. The trade book is our demo journal, tagged with the rules each trade broke.”",
      },
    ],
    aha: "“It isn’t just telling him the market went against him. It’s telling him where his own behavior went against his plan.”",
    ask: { label: "Ask", lines: ["“Does separating strategy failure from rule failure matter in the world you see?”"] },
    stop: ["STOP TALKING.", "LET OWEN ANSWER."],
  },

  today: {
    goal: "Build trust by being completely honest.",
    blocks: [
      {
        who: "KAN",
        lines: [
          "“We want to be straightforward about where this is.”",
          "Point to LIVE: “These pieces are real.”",
          "Point to BUILT / DEMO: “These are working product experiences running on scripted or demo state.”",
          "Point to NEXT: “And this is the bridge we’re building next.”",
        ],
      },
      {
        who: "OPTIONAL",
        lines: ["“We know what we need to build. What we don’t want to do is make assumptions about how that integration layer should work from the outside.”"],
      },
    ],
    ask: { label: "Ask only if it feels natural", lines: ["“Are we building that next layer in the right order?”"] },
    stop: ["DO NOT apologize.", "DO NOT mention type errors.", "DO NOT mention person-weeks.", "DO NOT oversell."],
  },

  session: {
    goal: "GET HIS BRAIN. Do not pitch anymore.",
    blocks: [{ who: "KAN", lines: ["Pick ONE question based on where the conversation naturally went."] }],
    ask: { label: "Best default", lines: ["“If you were sitting where we are, what’s the one thing you’d prove next?”"] },
    options: [
      "“If TradeLocker already knows what happened in the account, how valuable is knowing the context behind it?”",
      "“Looking a few years out, what parts of this should TradeLocker own itself and where does it make more sense for partners to build?”",
      "“If this were going to become genuinely interesting to TradeLocker, what would we have to prove?”",
      "“If you look at FunderPro, how much trader failure comes from bad strategy versus breaking their own rules?”",
      "“Who should we be talking to that we don’t know we should be talking to?”",
    ],
    stop: ["ASK ONE QUESTION.", "THEN SHUT UP.", "DO NOT STACK QUESTIONS."],
  },
}

export const EMERGENCY: { q: string; a: string }[] = [
  {
    q: "“What do you want from me?”",
    a: "“First, your read on whether we’re attacking a real problem. If we are, we’d love to understand what you would prove next and how you would think about the integration side. Anything deeper than that we’re open-minded about.”",
  },
  {
    q: "“Who pays?”",
    a: "“Our current hypothesis is serious traders and mentor/operators first. The bigger question we’re still testing is whether brokers or prop firms ultimately capture enough value from better engagement, retention and rule behavior to become the larger buyer.”",
  },
  {
    q: "“Is this real?”",
    a: "“The accounts, community infrastructure, billing and AI engine are real. The room, forecast, rule check and review are built experiences using scripted or demo state. The record connecting the entire chain and broker ingestion are the next technical pieces.”",
  },
  {
    q: "“Why can’t TradeLocker build this?”",
    a: "“You absolutely could. That’s actually one of the reasons we wanted your perspective instead of pretending we know where that boundary belongs.”",
  },
  {
    q: "He offers help / an intro / a next step",
    a: "“We’d love that. What would make the most sense as the next step?”  — Do NOT negotiate equity, partnership economics or investment on this call.",
  },
]

export const TABS = ["/owen", "/live-room", "/dashboard"]
