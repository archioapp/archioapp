/* ═══════════════════════════════════════════════════════════════════════
   ARCHIO · THE OWEN DECK — NARRATIVE REGISTRY (rev4 · the story + dossiers)
   ───────────────────────────────────────────────────────────────────────
   Five acts, thirty-five slides, one idea per slide. Built to be SPOKEN.
   Every slide carries four things for the presenter window (press N):

     say   — the exact words, spoken language, no slideware
     read  — HOW TO READ THE SCREEN: what each visual element is, where to
             point, what the colours mean. Written for someone who has never
             seen the slide. This is the "I don't understand what I'm looking
             at" fix.
     ask   — the ONE question to hand Owen, then stop and listen
     beat  — target seconds on this slide

   The five acts are one argument, not five topics:
     I   THE WORLD    one trader's Tuesday first (the story), then the
                      problems it contains — noise, blind tools, the bill,
                      fakes, screenshots-as-proof, lost live calls, account
                      chaos — and the number that proves it: most lose    (10)
     II  THE LOOP     WHY they lose — every trade is five decisions run
                      unconsciously, in five places, so context dies        (7)
     III THE SYSTEM   the same loop built consciously — nine systems in the
                      canon order, each one answering a problem from Act I  (10)
     IV  THE ECONOMY  what happens to the $300/month when the loop lives in
                      one place — the precedent, the floor, the lanes, the
                      marketplace math, agents & clones, the city of roles  (6)
     V   THE APP      where we really are, then one decision live          (2)

   Every dollar figure in Act IV is an explicit assumption and is spoken as
   one. Never present them as facts. Never claim the broker chain is live.
   ═══════════════════════════════════════════════════════════════════════ */

export type AccentRole =
  | "primary"
  | "secondary"
  | "tertiary"
  | "chartUp"
  | "danger"
  | "amber"

export type ActId = "world" | "loop" | "system" | "economy" | "close"

export interface DeckAct {
  id: ActId
  numeral: string
  title: string
  /** one line shown on the act interstitial */
  line: string
}

export const ACTS: DeckAct[] = [
  { id: "world", numeral: "I", title: "The World", line: "The problems every trader lives with. All of them, at once." },
  { id: "loop", numeral: "II", title: "The Loop", line: "Why they lose. Five decisions, five places, context dies." },
  { id: "system", numeral: "III", title: "The System", line: "The same loop, built consciously. Nine systems, one record." },
  { id: "economy", numeral: "IV", title: "The Economy", line: "The largest profession never bundled. Three lanes, one rail, a city where traders work." },
  { id: "close", numeral: "V", title: "The App", line: "Where we really are. Then one decision, live." },
]

export type SceneId =
  /* I */
  | "cover" | "day" | "noise" | "scatter" | "bill" | "clones" | "proof" | "livecall" | "accounts" | "ninety"
  /* II */
  | "loopintro" | "loop" | "walkthrough" | "record" | "eighthundred" | "hindsight" | "genericai"
  /* III */
  | "decision" | "systemmap" | "flightdeck" | "community" | "gameplan" | "forecast" | "execution" | "tradingdna" | "portfolio" | "proofrecord"
  /* IV */
  | "precedent" | "market" | "lanes" | "gmv" | "agents" | "flywheel" | "city"
  /* V */
  | "honest" | "doors"

export interface DeckSlide {
  id: SceneId
  act: ActId
  /** short label for the navigation rail */
  label: string
  /** small line above the headline */
  eyebrow: string
  /** which step of the loop / which system this slide serves — shown as a chip */
  step?: string
  /** the ONE idea — max ~9 words */
  headline: string
  /** one or two supporting sentences, spoken-language */
  sub: string
  /** presenter script */
  say: string
  /** how to read the screen — numbered, where to point, what colours mean */
  read: string[]
  /** the question to hand to Owen — then stop and listen */
  ask?: string
  /** target seconds */
  beat: number
  accentRole: AccentRole
  /** "split" = words left, visual right · "stack" = words top, visual below */
  layout: "split" | "stack"
}

export const DECK: DeckSlide[] = [
  /* ═══════════════════════════ COVER ═══════════════════════════ */
  {
    id: "cover",
    act: "world",
    label: "Cover",
    eyebrow: "Archio · prepared for Owen · TradeLocker",
    headline: "Bringing order to finance.",
    sub: "The trading world runs on noise. We built the one place that has structure, memory and proof — and a way for everyone on it to get paid.",
    say: "Owen, thanks for the time. We both came into this from the trader side. This is not an investor pitch; it is how we think about the problem, what we built for it, and your honest read on whether we see it correctly. Five parts. The world: the problems, all of them. The loop: why traders actually lose. The system: what we built, piece by piece. The economy: what happens to the money. Then the app, live. Interrupt me anywhere.",
    read: [
      "The five cards on the right are the agenda. Point at them in order once, then move on — do not read them out.",
      "The pulsing dot next to the eyebrow is just the deck's heartbeat; it appears on every slide.",
    ],
    ask: "Before we start — how much have you already seen of what we're building?",
    beat: 40,
    accentRole: "primary",
    layout: "stack",
  },

  /* ═══════════════════════════ ACT I · THE WORLD ═══════════════════════════ */
  {
    id: "day",
    act: "world",
    label: "One Tuesday",
    eyebrow: "Act I · The world · the story",
    headline: "One trader. One Tuesday. Nine apps.",
    sub: "Before we name the problems, watch a normal day. X at 06:30, the mentor's Discord, the calendar, TradingView, a Telegram VIP, the broker, ChatGPT, Notion. Every app does its job. Not one of them knows the other eight exist.",
    say: "Before I name a single problem, let me show you a normal Tuesday. Six-thirty, he wakes up inside X: forty threads on gold, one of them with a cropped P&L and forty thousand likes. Seven-fifteen, the mentor's Discord — the gameplan was posted at six, two hundred messages ago; he finds half of it. Seven-fifty, the calendar: CPI at eight-thirty, and he remembers the mentor said half size on news days. Eight, TradingView, levels drawn from memory. Eight twenty-nine, a Telegram VIP shouts buy. Eight thirty-one, the broker: his rules are in Notion, closed; he buys one and a half lots. Eight forty-one, stopped out, minus eight hundred. Noon, he asks ChatGPT why gold dumped — it explains gold, not him. Ten at night, Notion: 'bad luck, stop hunted'. Nine apps. Each one did its job. Not one of them knew the other eight existed. Every problem in this act is one hour of this day.",
    read: [
      "The rail across the top is his day, left to right: nine stops, each one an app with its time. The stop with the red ✕ (08:41) is the loss.",
      "CLICK a stop, or press 'next hour': the panel below opens that hour. GREEN column = what he does there — the app's honest job. RED column = what that app cannot know and silently loses.",
      "The red chip on the right of the panel — 'becomes 06 Lost calls', etc. — is the problem slide this hour turns into. You name them one by one next; here you only point.",
      "Walk it in order from 06:30 to 08:41. From 12:00 on, summarise. End on the red bar at the bottom: nine apps, none knew the others existed.",
    ],
    ask: "Does that Tuesday look like the traders you see on TradeLocker?",
    beat: 75,
    accentRole: "danger",
    layout: "stack",
  },
  {
    id: "noise",
    act: "world",
    label: "The noise",
    eyebrow: "Act I · The world · problem 01",
    headline: "Every trader lives inside noise.",
    sub: "Discord, Telegram, WhatsApp, X, YouTube — and now Whop and Skool selling the room itself. No structure. No filter. Nobody accountable. Three thousand unread. Zero verified.",
    say: "This is a normal Tuesday for a retail trader. Dozens of rooms, hundreds of messages, everyone selling something. A Whop room for a hundred and forty-nine a month with no track record shown. A Skool course with forty-eight lessons and nothing verified. A Telegram promising ninety-seven percent win rate. He cannot tell a signal from a scam because nothing here is structured and nothing here is verified. This is the water every trader swims in, and it is where every bad decision starts.",
    read: [
      "The grid is a live feed: each card is one message from one platform (icon top-left = Discord, Telegram, WhatsApp, X, YouTube, Whop, Skool).",
      "Cards outlined in RED with the warning triangle are scams or impostors. Point at two of them.",
      "The three counters on the left — unread, platforms, verified — say the whole slide: thousands of messages, zero proof.",
      "Let it run for a second. The cards keep arriving on purpose: the noise never stops.",
    ],
    beat: 45,
    accentRole: "danger",
    layout: "stack",
  },
  {
    id: "scatter",
    act: "world",
    label: "The blind tools",
    eyebrow: "Act I · The world · problem 02",
    headline: "Ten tools. None of them know you.",
    sub: "Chart in one app, mentor in another, rules in a note, ticket at the broker, journal never. The problem is not too many apps — it is that none of them share the same context, and none of them know the trader.",
    say: "Ten windows, ten kitchens. Good specialised tools should exist. The problem is they do not share context. What he learned at eight-thirty has no connection to what he thought at nine, which has no connection to the trade at ten, which has no connection to the rule he was supposed to follow. Not one tool knows his rules, yesterday's mistake, or which account he is on. The tools are not bad. They are blind.",
    read: [
      "The ring of icons is his tool stack: chart, mentor, rules note, broker, journal, calendar, news, AI, spreadsheet, prop dashboard.",
      "YOU is the trader in the centre. The dashed ring means: nobody has a picture of him.",
      "Every line from a tool toward YOU stops short and ends in a RED ✕. That ✕ is the point — the information never arrives.",
      "The caption under YOU lists what none of them can see: his rules, his history, his risk.",
    ],
    ask: "Does that match what you've seen — traders have enough tools, but the information around their decisions is still disconnected?",
    beat: 50,
    accentRole: "danger",
    layout: "split",
  },
  {
    id: "bill",
    act: "world",
    label: "The bill",
    eyebrow: "Act I · The world · problem 03",
    headline: "$3,600 a year. Seven bills. Zero shared context.",
    sub: "Charts, community, signals, journal, data, AI, prop fees. The average active trader already pays around $300 a month — to seven companies that never talk to each other. Whop and Skool sell the room. None of it knows the trade.",
    say: "And he pays for all of it. TradingView for the chart. A Whop or a Skool or a Discord for the community. A Telegram VIP for signals. A journal. Data. ChatGPT. Prop challenges on top. Call it three hundred a month, thirty-six hundred a year — and not one dollar of it connects to another dollar. Hold that number. The money is already moving. It is just moving to seven different companies that know nothing about each other. We come back to this exact number in Act Four.",
    read: [
      "The receipt on the right is one trader's monthly stack; each line is a real category with a typical price.",
      "The total at the bottom — about $300 a month — is the number to remember. Say '×12' out loud; the yearly figure appears next to it.",
      "'Shared context: 0' under the total is the whole problem in one line.",
      "The Whop and Skool lines are highlighted because we will absorb exactly those two later.",
    ],
    ask: "Does three hundred a month sound low or high for the traders you see?",
    beat: 45,
    accentRole: "amber",
    layout: "split",
  },
  {
    id: "clones",
    act: "world",
    label: "Nothing verified",
    eyebrow: "Act I · The world · problem 04",
    headline: "One mentor. Twenty Telegrams.",
    sub: "No KYC. No identity layer. Anyone can wear a real mentor's name and a screenshot. The student pays the wrong person — and blames trading.",
    say: "The trust problem. Every known mentor has twenty impostors. There is no identity layer and no verified record, so a name and a profile picture are enough. The student sends money to the wrong person, gets nothing, and concludes that trading is a scam. In any other financial product this would be illegal. Here it is the norm.",
    read: [
      "The wall is one mentor's name repeated. Exactly ONE card is real — the green VERIFIED tag. Every other card is an impostor (red).",
      "The counter on the right: one real, fourteen fakes, zero ways to tell. Point at the zero.",
      "Do not name a real mentor. 'Marcus Reed' is invented.",
    ],
    ask: "From the platform side, how much of this trust problem reaches you?",
    beat: 35,
    accentRole: "danger",
    layout: "split",
  },
  {
    id: "proof",
    act: "world",
    label: "Screenshots as proof",
    eyebrow: "Act I · The world · problem 05",
    headline: "The proof is a screenshot.",
    sub: "Track records are Photoshop. Win rates are self-reported. A $48,000 month is a cropped image. In the largest retail financial community on earth there is no audited, time-stamped, public record of anyone's calls.",
    say: "Even the real mentors have a problem: they cannot prove they are real. The only currency of credibility in this industry is a screenshot — a cropped account balance, a self-reported win rate, a highlighted chart after the move. Nobody can audit it. Nobody time-stamps the call before the outcome. So the honest mentor and the scammer look identical, and the student has no way to choose. There is no verified track record anywhere in retail trading. That is a missing piece of infrastructure, not a feature gap.",
    read: [
      "Left column: what proof looks like today — a screenshot, a cropped P&L, a highlighted chart drawn after the move. Each carries a red 'unverifiable' tag.",
      "Right column, dimmed and locked: what proof should be — calls stamped before the outcome, resolved automatically, audited, public. The lock says nobody has this yet.",
      "The line under the columns is the claim to say out loud: 'a real mentor and a scammer are indistinguishable'.",
    ],
    ask: "If a mentor could prove every call with a time stamp, would traders pay more for him?",
    beat: 45,
    accentRole: "danger",
    layout: "split",
  },
  {
    id: "livecall",
    act: "world",
    label: "The lost live call",
    eyebrow: "Act I · The world · problem 06",
    headline: "Your mentor went live. You missed everything.",
    sub: "Live calls happen in Discord and Zoom with no memory. Education ends at 'here is what you should do'. Nobody follows the trader afterward to see if he applied it — or entered the wrong way.",
    say: "Education does not follow the trader. A student joins ten minutes late and the call is gone forever. And even when he hears the lesson, nothing checks whether he applied it, misunderstood it, or went short when the mentor said long. Knowing something is not the same as doing it. Hold the button on the right — Catch Me Up. We come back to it in the system.",
    read: [
      "The timeline is one live session: the mentor's calls are the dots along the line.",
      "The RED hatched zone is the twenty-eight minutes the student was not there. That gap is gone forever in Discord.",
      "The button under it — Catch Me Up — is greyed with a red tag: 'does not exist in Discord'. Point at it and say we come back to it.",
    ],
    ask: "Is there a gap between how much education traders consume and anyone's ability to see whether they apply it?",
    beat: 40,
    accentRole: "amber",
    layout: "stack",
  },
  {
    id: "accounts",
    act: "world",
    label: "Account chaos",
    eyebrow: "Act I · The world · problem 07",
    headline: "Three accounts. Two prop firms. No scoreboard.",
    sub: "A funded account, a challenge, a personal broker, a crypto wallet. Four logins, four P&Ls, four rule sets. He trades every day and cannot tell you what he is worth or which account is bleeding.",
    say: "One more that nobody talks about. The modern retail trader is not one account. He has a funded prop account with its own drawdown rules, a challenge he is trying to pass, a personal broker account, maybe a crypto wallet. Four logins, four dashboards, four different rule sets — and no place that adds it up. Ask him what he is worth today and he opens four tabs. Ask him which account is bleeding and he guesses. The most important number in his financial life does not exist anywhere.",
    read: [
      "Four account cards, four different colours, four different brokers/firms. Each shows its own P&L and its own rules (max daily loss, drawdown).",
      "The big '?' card at the end is the total. It is empty on purpose: no tool computes it.",
      "The red tag on the challenge account — 'breached' — is the kind of thing he finds out too late.",
    ],
    ask: "How many accounts does a typical TradeLocker user actually run across firms?",
    beat: 40,
    accentRole: "danger",
    layout: "split",
  },
  {
    id: "ninety",
    act: "world",
    label: "Why they lose",
    eyebrow: "Act I · The world · the number",
    headline: "Most retail traders lose. Not because they don't know enough.",
    sub: "Brokers must disclose it: roughly 70–90% of retail accounts lose money. Everyone blames strategy. But the seven problems you just saw are not strategy problems. They are structure problems — and nobody is solving structure.",
    say: "Here is the number the whole industry is built on. Regulators make brokers print it: seventy to ninety percent of retail accounts lose money. Everyone's answer is more education, more signals, better indicators. But look at the seven problems again: noise, blind tools, seven bills, fakes, screenshots, lost calls, account chaos. Not one of them is a strategy problem. They are all structure problems. Nobody is solving structure, because structure is not a feature — it is a place. That is Archio. Now let me show you what actually happens inside the trader, because that is where the money is lost.",
    read: [
      "The big figure — 70–90% — is a regulatory disclosure range (ESMA/FCA-style CFD warnings). Say 'brokers have to print this', do not argue the exact number.",
      "Under it, the seven problems reappear as a row of small cards. Each has a label of what kind of problem it is: every one says STRUCTURE, none says STRATEGY.",
      "The last chip — 'nobody solves structure' — is the bridge. Click Next straight after saying it.",
    ],
    ask: "When you look at why your traders lose, how much of it is strategy and how much is everything around the strategy?",
    beat: 50,
    accentRole: "danger",
    layout: "stack",
  },

  /* ═══════════════════════════ ACT II · THE LOOP ═══════════════════════════ */
  {
    id: "loopintro",
    act: "loop",
    label: "Five decisions",
    eyebrow: "Act II · The loop · the idea",
    headline: "A trade is not one decision. It is five.",
    sub: "What is happening? What do I think will happen? Should I take it, and how big? Did I do what I decided? What did I learn? Every trader answers all five, every trade — most of them without noticing.",
    say: "Here is the idea that changed how we build. A trade looks like one click. It is actually five decisions in a row. What is happening — the context. What do I think will happen — the thesis. Should I take it and how big — the decision. Did I actually do what I decided — the execution. And what did I learn — the review. Every trader answers all five on every trade. Almost none of them know they are doing it. That is the loop. The next slides show what happens to it today.",
    read: [
      "Five plain questions, left to right, in the trader's own words. Read them out slowly — this is the simplest slide in the deck and the most important.",
      "Under each question is its formal name in small caps: CONTEXT, THESIS, DECISION, EXECUTION, REVIEW. Use the plain words when talking, the names when pointing.",
      "The loop arrow at the end goes back to the start: tomorrow the trader runs it again with whatever he learned — or did not.",
    ],
    beat: 45,
    accentRole: "primary",
    layout: "stack",
  },
  {
    id: "loop",
    act: "loop",
    label: "Where it lives today",
    eyebrow: "Act II · The loop · today",
    headline: "Five decisions. Five places. Context dies at every arrow.",
    sub: "Context lives in Discord. Thesis in his head. Decision in his head. Execution at the broker. Review in Notion — or nowhere. Nothing carries from one step to the next.",
    say: "Now look where each of those five decisions lives today. The context is in Discord and on X. The thesis is in his head. The decision — size, risk, rule — also in his head. The execution is at the broker; that is the only step anyone records. The review is in Notion, or nowhere. Between every step there is an arrow, and at every arrow the context dies. The broker has no idea what the mentor said. The journal has no idea what the rule was. Then tomorrow starts from zero.",
    read: [
      "Five cards, same order as the previous slide. The TOP of each card is the step; the BOTTOM line in small text is WHERE it lives today (Discord · his head · his head · the broker · Notion/nowhere).",
      "Between the cards are arrows with a RED ✕ and the words 'context dies'. Point at each ✕ as you say the sentence.",
      "The EXECUTION card is the only one with a green tick — that is the only step that gets recorded today, by the broker. Say: 'that is your data, Owen'.",
    ],
    ask: "Does the loop make sense as a way to describe what a trader actually does?",
    beat: 55,
    accentRole: "primary",
    layout: "stack",
  },
  {
    id: "walkthrough",
    act: "loop",
    label: "One trade, walked",
    eyebrow: "Act II · The loop · one real trade",
    headline: "Tuesday, 08:31. Gold. Watch the context die.",
    sub: "A mentor call in Discord. A thesis nobody wrote down. A rule that said half size. A ticket at double size. A journal entry that says 'bad luck'. Same trader, same trade, five places — read it left to right.",
    say: "Let me walk one trade through it so it stops being abstract. Eight-thirty, Tuesday, CPI day. The mentor says in Discord: gold long above twenty-four ten, invalid below twenty-three eighty-eight, half size on news. That is the context. The trader thinks: he is right, but I want more. That is his thesis — in his head. His own rule says half a percent on news days. His decision: one and a half percent. Nobody sees it. He fills at the broker: entry, size, time — the broker records this and only this. Gold whips through his stop. Minus eight hundred. That night he writes: bad luck, stop hunted. Five places. The only thing recorded is the fill. Everything that explains the loss is gone.",
    read: [
      "Five columns, left to right = the five steps. Each column is a 'place': a Discord message, a thought bubble, a rule note, a broker ticket, a journal line.",
      "Read the GREEN text in each column first — that is what actually happened at that step.",
      "The RED text is the contradiction: mentor said half size → rule said 0.5% → ticket says 1.5%. Trace that with your finger.",
      "The bottom bar is what the broker keeps: only the fill. Everything above it is lost. That is the slide.",
    ],
    ask: "Where in that chain would you have wanted to see the trader stopped?",
    beat: 70,
    accentRole: "danger",
    layout: "stack",
  },
  {
    id: "record",
    act: "loop",
    label: "Trade vs decision",
    eyebrow: "Act II · The loop · what gets recorded",
    step: "Steps 03 → 04",
    headline: "The broker records the trade. Nobody records the decision.",
    sub: "Entry, exit, size, time, P&L — that tells you what happened. It cannot tell you why he entered, what he believed, which rule applied, or whether the trade was fine and the execution was bad.",
    say: "This is the formal version of the last slide. Once a trade happens we know entry, exit, size, instrument, time, P&L. That is what happened. It does not tell us why he entered, what his thesis was, whether his mentor agreed, whether he had already hit his daily limit, whether he was supposed to risk half a percent and risked one and a half. Was the trade bad, or was the trade fine and the execution bad? Completely different questions. Archio is not a better trade log. It is the record around the decision.",
    read: [
      "Left panel: the broker's record — six fields, all filled, all green. This is complete and it is what every platform has.",
      "Right panel: the decision record — six boxes, all EMPTY, dashed. Read two of the labels out loud: 'why he entered', 'which rule applied'.",
      "The sentence between them: 'what happened' vs 'why'. That is the only distinction this slide makes.",
    ],
    ask: "From execution data alone, how much of the trader's actual decision process can you understand today?",
    beat: 45,
    accentRole: "secondary",
    layout: "split",
  },
  {
    id: "eighthundred",
    act: "loop",
    label: "−$800",
    eyebrow: "Act II · The loop · strategy vs behaviour",
    step: "Steps 03 → 05",
    headline: "−$800 doesn't explain why.",
    sub: "Traders usually know their rules. They just don't follow them. Strategy failure and behaviour failure look identical on the account — and need completely different fixes.",
    say: "The strangest thing about trading: a trader can know exactly what to do and still not do it. His rules: three trades max, half a percent, no size after a loss. Then emotion enters. Trade four, trade five, size doubled, stop moved. The account says minus eight hundred. It cannot say whether the strategy was wrong, the market was abnormal, or he abandoned his own process. A profitable strategy followed sixty percent of the time looks like a losing strategy. The question is not did you win. It is: did you do what you said you would do?",
    read: [
      "Top-left 'HE KNEW': his three rules, written in his own words, all green. He is not ignorant.",
      "Top-right 'HE DID': what actually happened — trade 4, trade 5, size doubled, stop moved — all red.",
      "The big −$800 in the middle with THREE possible causes underneath: bad strategy / abnormal market / broke his process. Say: 'the account cannot tell these apart'.",
      "Bottom bar: 60% adherence. A good strategy followed 60% of the time looks like a bad strategy. That bar is the whole coaching problem.",
    ],
    ask: "From what you've seen with prop traders, how much failure is bad strategy versus traders breaking rules they already know?",
    beat: 55,
    accentRole: "danger",
    layout: "stack",
  },
  {
    id: "hindsight",
    act: "loop",
    label: "Hindsight",
    eyebrow: "Act II · The loop · the review is broken",
    step: "Step 05",
    headline: "Hindsight is a terrible database.",
    sub: "Journaling happens after the outcome, so memory rewrites the story. A good outcome is not always a good decision, and a bad outcome is not always a bad one. Grade only P&L and you teach the wrong lesson.",
    say: "Even the traders who review are reviewing wrong. Traditional journaling is written after the result. He loses and writes 'I knew that setup was weak'. Did he know that at the time? He wins and writes 'exactly to plan'. Was it, or did a terrible trade happen to work? Trading has variance: you can execute perfectly and lose, trade terribly and win. If the system grades only P&L it teaches the wrong lesson. So we stamp the record before the outcome exists — forecast, rules, planned risk — and the review compares what he said to what he did.",
    read: [
      "Left: two journal entries, both written AFTER the result. Red one after a loss ('I knew it was weak'), green one after a win ('exactly to plan'). Both are memory rewriting history.",
      "Right: a 2×2 grid. Columns = good decision / bad decision. Rows = won / lost. The two LIT cells are the dangerous ones: good decision that lost (variance) and bad decision that won (luck). P&L-only grading gets both wrong.",
      "Bottom chip: 'stamp before the outcome' — forecast, rules, risk. That is what fixes the grid.",
    ],
    ask: "Do you see value in separating decision quality from trade outcome? A profitable trade can still be a terrible decision.",
    beat: 50,
    accentRole: "amber",
    layout: "stack",
  },
  {
    id: "genericai",
    act: "loop",
    label: "AI doesn't know you",
    eyebrow: "Act II · The loop · intelligence",
    step: "The whole loop",
    headline: "AI knows markets. It doesn't know you.",
    sub: "Any model can explain RSI or analyse gold — that is commoditised. The valuable questions are personal, and they need a structured history of the trader that nobody has. Which is exactly what the loop produces.",
    say: "Last one. Putting ChatGPT next to a chart is not enough; market analysis is commoditised. The interesting questions are personal: why do I keep losing, which rule do I break most, do I size up when I am emotional, which setups work when I actually follow my plan. Those need a structured history of the trader — his trades, his rules, his decisions, what he repeatedly does. Nobody has that history, because nobody records the loop. If you record the loop, you get it for free. That is the difference between AI that talks about trading and AI that helps a trader understand himself.",
    read: [
      "Left column: generic questions any model answers today ('what is RSI', 'analyse gold'). Grey, cheap, commoditised.",
      "Right column: the personal questions — 'why do I keep losing', 'which rule do I break most' — each with a LOCK. Locked because there is no record to answer from.",
      "The line at the bottom connects it back: the loop IS the record. Record the loop and the locks open. Click Next on that word.",
    ],
    ask: "Is the real AI opportunity in trading market analysis, or in understanding the individual trader's behaviour?",
    beat: 45,
    accentRole: "tertiary",
    layout: "split",
  },

  /* ═══════════════════════════ ACT III · THE SYSTEM ════════════════��══════════ */
  {
    id: "decision",
    act: "system",
    label: "The loop, built",
    eyebrow: "Act III · The system · the pivot",
    headline: "So we built the loop. Consciously.",
    sub: "The same five steps, each one owned by a system, all inside one window, all writing to one record. Community → Decision Desk → Rules → broker rails → Trading DNA. What a trader does unconsciously in five places, done on purpose in one.",
    say: "So here is what we did. We took the loop every trader runs unconsciously and built a place for it. Community owns the context. Decision Desk owns the thesis and the rules check. Execution runs on the broker's rails — which is exactly where you come in. Trading DNA owns the review. All of it in one window, the Flight Deck, all of it writing to one record. Instead of explaining twenty features, I will walk the nine systems in the order a trader meets them, and for each one I will tell you which problem from Act One it kills.",
    read: [
      "Same five cards as Act II — but now each has a GREEN tick and the name of the system that owns it.",
      "The fourth card, EXECUTION, is AMBER and dashed with the tag 'YOUR RAIL · TradeLocker · not connected yet'. Point at it. Say it plainly. Do not apologise.",
      "The light travelling along the top thread is the record: one line, written at every step.",
      "The footer strip mentions the Marketplace — the sixth thing that lives around the record. We get there in Act IV.",
    ],
    ask: "Does the chain make sense before I show you anything?",
    beat: 50,
    accentRole: "primary",
    layout: "stack",
  },
  {
    id: "systemmap",
    act: "system",
    label: "Nine systems",
    eyebrow: "Act III · The system · the map",
    headline: "Nine systems. One record. Every problem from Act I has an owner.",
    sub: "Flight Deck · Community · Decision Desk · Trading DNA · AI Agent Marketplace · Portfolio · Net Worth · AI Verified Track Record · Social Network. Open any one: what it is, what is inside it, what it replaces, and how it solves the problem.",
    say: "This is the whole platform on one screen, in the order a trader meets it. Flight Deck is the window everything lives in. Community is where the mentor, the room and the gameplan live — that kills the noise and the fakes. Decision Desk is where he says what he thinks before he trades — that kills screenshots. Trading DNA is his rules, his patterns, his mind — that kills 'why do I keep breaking my rules'. The Marketplace is where agents and mentors are sold. Portfolio and Net Worth kill account chaos. The Verified Track Record is the proof layer — KYC, every call stamped and audited. The Social Network is the feed where that proof becomes identity. Nine systems, one record underneath. Everything you see next is one of these nine.",
    read: [
      "Left: a 3×3 grid in the canon order 1–9, Flight Deck in the centre. HOVER or click a card — the DOSSIER on the right switches to that system.",
      "The dossier has four tabs. WHAT: the trader's pain in his own words, what the system is in one breath, the analogy, the Act I problems it KILLS (red chips) and the loop step it OWNS. Stay on this tab while you talk.",
      "INSIDE: the real pages of that system from the product spec, each with a dot — green built, accent demo data, amber planned. Open it only if Owen asks 'what is actually in it?'.",
      "REPLACES: the apps a trader uses for this today and why each fails. HOW: how the system solves it and what it FEEDS. Both are for questions, not for the talk track.",
      "Do Community and Verified Track Record in full; for the other seven, say the WHAT line only. Press N: the presenter drawer prints the exact sentence to say for whichever system is open.",
    ],
    ask: "Looking at the nine — which one would TradeLocker's traders reach for first?",
    beat: 75,
    accentRole: "primary",
    layout: "stack",
  },
  {
    id: "flightdeck",
    act: "system",
    label: "01 Flight Deck",
    eyebrow: "Act III · The system · 01 Flight Deck",
    step: "The window · kills problem 02",
    headline: "One window. The whole loop in it.",
    sub: "The chart in the middle. Community slides in from the left. Execution sits on the right. Ask Archio, live P&L, equity and today's R across the top. The trader never leaves this window, so nothing is lost between steps.",
    say: "This is the Flight Deck — the answer to ten blind tools. TradingView in the centre. From the left, the community slides in: the mentor's live room, the gameplan, the context. On the right, execution: the ticket, with the rules in front of it. Across the top, Archio: what is happening now, equity across every account, today's R, and Ask Archio. The trader never leaves this window. That single fact is why context stops dying.",
    read: [
      "It builds in stages on purpose — wait for it: first the chart, then the LEFT panel slides in (Community), then the RIGHT panel (Execution), then the TOP bar (Archio).",
      "Name each region as it appears. Left = context. Centre = the market. Right = decision + execution. Top = memory and P&L across all accounts.",
      "The thin light running around the frame is the same record line. One window, one record.",
    ],
    beat: 45,
    accentRole: "primary",
    layout: "stack",
  },
  {
    id: "community",
    act: "system",
    label: "02 Community",
    eyebrow: "Act III · The system · 02 Community",
    step: "01 Context · kills problems 01, 04, 06",
    headline: "Swipe from the left. Your mentor, verified, with a memory.",
    sub: "One official room per mentor — KYC'd, with a public record. Every call lands on a timeline tied to the chart. Walk in late, press Catch Me Up, get the last forty minutes in ten seconds. This is where influence enters the record.",
    say: "Context. Instead of twenty Telegrams, one verified room per mentor — that is the answer to the impostors. The AI sits in the room: every call is time-stamped and pinned to the chart. Walk in late, press Catch Me Up, and you get the last forty minutes in ten seconds — that is the answer to the lost live call. And because the mentor is decision context, everything he says becomes part of the trader's record. Skool and Whop sell a room with no memory. This is a room that remembers.",
    read: [
      "The panel is the left drawer of the Flight Deck, opened. Top: the mentor with a green VERIFIED shield — the one real one from the clone wall.",
      "Middle: the session timeline — each dot is a call, tied to a price and a time on the chart.",
      "Bottom: the CATCH ME UP button, now live (green), with the ten-second summary it produced. Point back to Act I: 'this is the button that did not exist'.",
      "The side chips — Circles, Teams, Course — are the Skool/Whop functions living inside the same room.",
    ],
    ask: "Does this feel closer to how traders actually consume information today?",
    beat: 55,
    accentRole: "chartUp",
    layout: "stack",
  },
  {
    id: "gameplan",
    act: "system",
    label: "The Gameplan",
    eyebrow: "Act III · The system · 02 Community · the mentor's gameplan",
    step: "01 Context → 03 Decision · kills problems 01, 06",
    headline: "The mentor writes the week. The trader trades inside it.",
    sub: "Every Sunday the mentor publishes the gameplan: news events, bias per instrument, invalidation levels, and the rules for each day. It lives next to the chart. When the trader breaks it, the record knows.",
    say: "This is the thing every mentor already does in a pinned Discord message that nobody reads twice. Sunday night he writes the week: what news is coming, his bias per instrument with the level where he is wrong, and the rules for each day — no trades fifteen minutes around CPI, half size on Friday, two trades max on FOMC. In Archio that gameplan lives next to the chart, day by day, with a countdown to the next event. And here is the part no pinned message can do: it is connected to the record. When the trader takes a trade at eight thirty-two on CPI day, the system knows he traded through the mentor's rule. The gameplan stops being advice and becomes structure.",
    read: [
      "Top strip: the week, Monday to Friday. CLICK a day — the panel below changes. Click Tuesday (CPI) and Wednesday (FOMC) live; that is the demo.",
      "Left of the panel: NEWS for that day with times and impact bars. Right: the mentor's BIAS per instrument — direction, key level, and 'invalid below/above'.",
      "Bottom row: the RULES FOR TODAY as chips. The red-outlined one on Tuesday — 'no trades 08:15–08:45' — is the rule from the −$800 trade.",
      "The ribbon at the top shows the NEXT EVENT with a live countdown. This is what the trader sees beside his chart at 8:20.",
      "The small 'record' badge: this plan is stamped. Later, adherence is measured against it (Trading DNA slide).",
    ],
    ask: "Do your best mentors already publish something like this — and does it survive past Monday?",
    beat: 70,
    accentRole: "chartUp",
    layout: "stack",
  },
  {
    id: "forecast",
    act: "system",
    label: "03 Decision Desk",
    eyebrow: "Act III · The system · 03 Decision Desk",
    step: "02 Thesis · kills problem 05",
    headline: "Say it before the trade. Stamped.",
    sub: "Every idea becomes a forecast: direction, level, invalidation, time — locked before the outcome exists. Published, tracked, resolved automatically. Nothing can be rewritten later. Mentor and student both build a record.",
    say: "Thesis. The Decision Desk. Before the trade he says what he believes: direction, level, where he is wrong, by when. It gets a time stamp and it locks. The belief now exists before the trade, so nobody can rewrite history afterward. Mentor and student both build a public record from this. That is the end of screenshots as proof. And it is the first half of the review: what he SAID.",
    read: [
      "Left: the forecast card being filled — instrument, direction, level, invalidation, horizon. Then it LOCKS (padlock, time stamp). Point at the time stamp.",
      "Right: the public record it feeds — a list of past forecasts with hit/miss resolved automatically, and the running hit rate.",
      "Say the connection: this card is what the −$800 trader never wrote down.",
    ],
    beat: 45,
    accentRole: "tertiary",
    layout: "split",
  },
  {
    id: "execution",
    act: "system",
    label: "Rules → broker",
    eyebrow: "Act III · The system · 03 Decision Desk → 04 broker rails",
    step: "03 Decision → 04 Execution · your rail",
    headline: "Rules in front of the ticket. The fill on your rails.",
    sub: "Before any order, Archio checks the trader's own rules, the mentor's gameplan, risk and session. Does this trade belong to your plan? The fill itself runs on the broker's rails — TradeLocker — not instead of them.",
    say: "Decision, then execution. The ticket sits beside the chart, but the rules sit in front of the ticket. Not 'can you place the trade' — 'should this decision be happening according to your own rules and today's gameplan'. Size above plan: blocked. Inside the CPI window: blocked. Fourth trade of the day: blocked. Now the honest part: the fill belongs to the execution platform. We do not have a live TradeLocker connection today. That is the piece that is not connected, and it is why this conversation matters to us.",
    read: [
      "Left panel: the RULES CHECK — each of his rules with a tick or a red ✕. Two are red: size 1.5% vs 0.5% planned, and 'inside CPI window'. Those are the exact violations from the walkthrough.",
      "Centre: the ticket, with a big red BLOCKED state. Say: 'the ticket exists, the rule is in front of it'.",
      "Right: the broker rail — an amber dashed box labelled TradeLocker, 'not connected yet'. Say it exactly like that. It is the ask of the whole meeting.",
    ],
    ask: "Do you think putting the rule back in front of the trader before execution could meaningfully change behaviour?",
    beat: 55,
    accentRole: "secondary",
    layout: "split",
  },
  {
    id: "tradingdna",
    act: "system",
    label: "04 Trading DNA",
    eyebrow: "Act III · The system · 04 Trading DNA",
    step: "05 Review · kills the −$800 problem",
    headline: "Why do I keep breaking my own rules? Now it answers.",
    sub: "His rules, his adherence, his patterns, his state under pressure — the Mind Check. Every trade auto-journaled with the rules it kept or broke. Ask 'why did I lose yesterday?' and the answer separates strategy failure from behaviour failure, from his own record.",
    say: "Review. Trading DNA is the trader's own file: his rules, how often he actually follows them, the patterns he repeats, and his state — the Mind Check — when he does. Every trade is journaled automatically with the rules it kept or broke, against the gameplan he was supposed to be inside. So when he asks 'why did I lose yesterday', it does not say gold went against you. It says: three of your four losses were rule breaks, you size up after a loss, you trade through news. And it shows him the number that matters: his rule-following trades made plus two R, his rule-breaking trades lost two point four R. The problem is not the strategy. It is adherence. That is a completely different coaching conversation — and it is the one Owen's traders never get.",
    read: [
      "Top-left: RULES with adherence percentages this week (e.g. 'no size after loss · 40%'). Red bars are the broken ones.",
      "Top-right: PATTERNS the system found — 'sizes up after a loss', 'trades through news'. These come from the record, not from him.",
      "Middle: MIND CHECK — a simple state gauge (calm → tilted) for the last session. Say: 'this is the psychology layer, measured, not guessed'.",
      "Bottom: the question 'Why did I lose yesterday?' and its two numbers: rules kept +2.0R vs rules broken −2.4R. That comparison is the product.",
    ],
    ask: "Does separating strategy failure from trader behaviour feel valuable to you — and to the prop firms?",
    beat: 65,
    accentRole: "primary",
    layout: "stack",
  },
  {
    id: "portfolio",
    act: "system",
    label: "06 Portfolio · 07 Net Worth",
    eyebrow: "Act III · The system · 06 Portfolio · 07 Net Worth",
    step: "Every account · kills problem 07",
    headline: "Every account. One scoreboard. What if BTC drops 30%?",
    sub: "Funded, challenge, personal broker, wallet — one view, one total, one set of alerts. Portfolio holds the positions and the What If scenarios. Net Worth is the number he never had.",
    say: "Account chaos, solved. Portfolio pulls every account into one view: the funded account with its drawdown line, the challenge with its daily-loss line, the personal broker, the wallet. Each with its own rules, all in one place, with one alert when any of them gets close. What If runs the scenario before it happens: BTC drops thirty percent — what happens to me across everything? And Net Worth is the number at the top: what he is actually worth today. The most important number in his financial life, finally existing somewhere.",
    read: [
      "Top: the NET WORTH total — one big number, with today's change. This is the '?' card from Act I, filled in.",
      "Middle: the four accounts as rows — each with its own drawdown/daily-loss bar. The amber bar on the challenge account is 'close to limit'; the alert chip next to it fires before the breach.",
      "Bottom: the WHAT IF strip — 'BTC −30%' with the impact per account. Say: 'he runs the crash before the crash'.",
    ],
    ask: "How much of your traders' money is on other rails you never see?",
    beat: 50,
    accentRole: "chartUp",
    layout: "stack",
  },
  {
    id: "proofrecord",
    act: "system",
    label: "08 Track Record · 09 Social",
    eyebrow: "Act III · The system · 08 AI Verified Track Record · 09 Social Network",
    step: "Proof → identity · kills problems 04, 05",
    headline: "Everyone claims. Here, everything is recorded, verified, proven.",
    sub: "KYC'd identity. Every forecast stamped, every trade journaled, every claim audited by the system — not by the trader. The Verified Track Record is the proof. The Social Network is where that proof becomes identity, and the next trader's reason to follow.",
    say: "The proof layer. Every mentor and every trader is KYC'd — one identity, no clones. Every forecast was stamped before the outcome, every trade was journaled automatically, and the record is audited by the system, not typed by the person. Hit rate, average R, adherence, drawdown — real, public, un-editable. That is the AI Verified Track Record, and it ends the screenshot. Then the Social Network: a feed for money, not for likes. What you post is your verified record. New traders find mentors by proof, not by follower count. And the loop closes: the proof attracts the next person, who joins a room, who builds a record.",
    read: [
      "Left: a public profile card — KYC shield, then the audited numbers: forecasts, hit rate, avg R, adherence, max drawdown. Every number has a small 'verified by system' mark. Point at one.",
      "Between the panels: the arrow 'proof → identity'.",
      "Right: the feed — three posts. Each post carries the poster's verified numbers inline. Say: 'you cannot post a screenshot here; your record posts itself'.",
      "Bottom line: the loop closes — proof brings the next trader into Community. That is the flywheel.",
    ],
    ask: "If every mentor on your platform had an audited public record, what changes for you?",
    beat: 60,
    accentRole: "tertiary",
    layout: "split",
  },

  /* ═══════════════════════════ ACT IV · THE ECONOMY ═══════════════════════════ */
  {
    id: "precedent",
    act: "economy",
    label: "It has been done",
    eyebrow: "Act IV · The economy · the precedent",
    headline: "Every profession that got bundled made the biggest company in its field. Traders never were.",
    sub: "Adobe bundled the creatives. Bloomberg bundled the pros. Shopify bundled the merchants. Steam bundled the gamers. WeChat bundled a country. Each one gathered a scattered profession into one window, one bill — and became the biggest business in it. Retail trading is bigger than all of them, already pays more than all of them, and has never been bundled.",
    say: "This has been done before — five times — just never here. Adobe took Photoshop, Illustrator and Premiere out of separate boxes and put them in one subscription: roughly twenty billion a year. Bloomberg put news, data, chat and execution in one terminal for three hundred thousand professionals: ten billion a year. Shopify gave five million merchants one store, one checkout, one bill. Steam gave a hundred and thirty million gamers one launcher. WeChat gave a country one app. Now look at the bar. Every one of those bundles captures ten or twenty billion a year. Retail traders are a hundred million people who already spend three hundred dollars a month — that is three hundred and sixty billion a year — and it is scattered across seven companies. Zero of it is bundled. TradingView, the closest anyone came, took only the chart and is worth three billion for it. That is the size of this. It is not 'bigger than a trading app'. It is the last big profession left to gather.",
    read: [
      "Top row: SIX cards. Five are the bundlers — Adobe, Bloomberg, Shopify, Steam, WeChat — each with what they bundled, the yearly scale, and the size of their profession. Figures are public, rounded, marked '≈' — say 'roughly'.",
      "The sixth card is dashed and glowing: RETAIL TRADERS · never bundled · ~100M. That empty card is the whole pitch.",
      "The SIZE BAR is to scale. Bloomberg, Shopify, Steam, Adobe are short bars ($8–20B). TradingView is a sliver ($0.3B — the chart only). The last bar runs the full width: $360B scattered · $0 bundled. Point at it and pause.",
      "$360B = 100M traders × $3,600 a year — the bill from Act I. Say that it is an assumption, and that even at a tenth of it this is bigger than Adobe.",
      "Bottom strip: the pattern in three beats — gather the profession → own the window → own the money flow. Every bundler did all three.",
    ],
    ask: "You built the chart-and-execution part of this for brokers. What stopped anyone from bundling the rest?",
    beat: 75,
    accentRole: "amber",
    layout: "stack",
  },
  {
    id: "market",
    act: "economy",
    label: "100M × $99",
    eyebrow: "Act IV · The economy · the floor",
    headline: "100 million traders. $99 a month.",
    sub: "They already pay about $300 for the scattered version. We charge $99 for the connected one. One percent of the market is a billion-dollar subscription business — before a single marketplace dollar.",
    say: "The base. Call it a hundred million active retail traders. Each already pays about three hundred a month for the scattered version — that was Act One. We charge ninety-nine for the connected one: one window, one record, the whole loop. Do the ladder. A hundred thousand subscribers is a hundred and nineteen million a year. One million — one percent of the market — is one point two billion. That is the subscription alone. It is the floor, not the business.",
    read: [
      "Left: the two receipts side by side — today's $300 scattered vs Archio's $99 connected. He saves $200 and gets more.",
      "Right: the LADDER — 10k / 100k / 1M / 10M subscribers with the annual revenue next to each. Point at the 1M row: '1% of the market, $1.2B'.",
      "Every figure is an assumption; the label at the bottom says so. Say it too.",
    ],
    ask: "If a trader already pays three hundred across seven tools, is ninety-nine for one place an easy sell or a hard one?",
    beat: 50,
    accentRole: "chartUp",
    layout: "stack",
  },
  {
    id: "lanes",
    act: "economy",
    label: "Three lanes",
    eyebrow: "Act IV · The economy · how money moves inside",
    headline: "Three ways money moves inside. Each one is a store.",
    sub: "Teach & mentor: the room, the course, the week — Skool, Whop, Discord and Zoom, next to the chart. Build & sell: install the way you think (your clone) and the way you work (your desk, your agents). Refer & earn: a lifetime cut of who you bring. Archio takes a percentage of every one, because every one runs on the rail.",
    say: "How money moves inside. Three lanes, and each one is a storefront — I will open all three. One: Teach and mentor. Everything a mentor sells today across Skool, Whop, Discord and Zoom — the room, the course, the live sessions, the weekly gameplan, signals with a record — sold from one place that sits next to the chart and remembers every call. Two — and this is the new one — Build and sell. A mentor does not only teach. He packages himself. His clone is the way he THINKS: an AI trained on his calls, his rules, his sessions, that answers students at three in the morning in his voice. His desk is the way he WORKS: his Flight Deck layout — which modules, in what order, with what alerts — installed by a student in one click. His agents run his method on the student's own record. Install the way you think. Install the way you work. Nobody has sold that before because nobody had the record to run it on. Three: Refer and earn. Anyone brings the next trader and gets twenty percent for life, tied to a KYC'd identity so there is no fake traffic. Archio takes a percentage of every one of these because every one runs on our rail. We do not sell software. We run the space.",
    read: [
      "Three lane tabs on top: 01 Teach & mentor · 02 Build & sell (tagged NEW · ONLY HERE) · 03 Refer & earn. CLICK each in order. ~25 seconds each.",
      "Each opens a STOREFRONT. First line: what the lane IS, in one sentence. Read it.",
      "Left block, THE PRODUCTS: four product cards with price · who buys · one line. The glowing card is the hero product of that lane (the room / the clone / the lifetime share). Under them, HOW IT WORKS in three numbered steps.",
      "Right block: the SPLIT — two big numbers, green = creator keeps, gold = Archio takes — with the reason under them. Then REPLACES: the struck-through names of who sells this today. Then ONE MONTH · ONE CREATOR — invented, realistic sizes — and POWERED BY: which Act III systems make it possible.",
      "On Build & sell, slow down on the four products: clone = the way you think · desk = the way you work · agents = your method as staff · indicators = the old market, now verified. Say: 'this is the lane nobody else can open, because it runs on the record'.",
    ],
    ask: "From your side, which of these three lanes does TradeLocker's audience already pay for somewhere else — and which have they never been offered?",
    beat: 120,
    accentRole: "amber",
    layout: "stack",
  },
  {
    id: "gmv",
    act: "economy",
    label: "The real number",
    eyebrow: "Act IV · The economy · the marketplace math",
    headline: "Move the $300 inside. Take a percentage of it.",
    sub: "At one million users: $1.19B in subscriptions, plus $3.6B of spend that already exists now flowing through the marketplace. At a 15% take that is another $540M. Software companies sell seats. We run the money flow.",
    say: "Now the real number. The three hundred a month does not disappear. The rooms, the courses, the signals, the agents, the dashboards — that spend moves inside, because the mentor, the store and the chart are finally in one window. At a million users that is three point six billion a year moving through Archio. We take fifteen percent — half the App Store, five times Whop — five hundred and forty million. Add the subscription: one point seven billion a year from one percent of the market. A hundred and forty-four dollars a month per trader, and he still pays less than he pays today. Every number here is an assumption. Tell me which one is wrong.",
    read: [
      "Left: the FLOW — $300/mo per trader enters at the top, splits into SUBSCRIPTION ($99, 100% ours) and MARKETPLACE SPEND (the rest, we take 15%).",
      "Right: the STACK at 1M users — $1.19B subscription + $540M take = $1.73B. The bars are to scale.",
      "The comparison chips under the take rate: App Store 30% · Whop ~3% · Archio 15%. We are the middle. Say why: we do more than Whop (the room has a memory) and less than Apple.",
      "The last line: $144 per trader per month to Archio, and he still pays less than today. That closes it.",
    ],
    ask: "Where would you push back — the take rate, the share of spend that moves inside, or the number of traders?",
    beat: 60,
    accentRole: "amber",
    layout: "stack",
  },
  {
    id: "agents",
    act: "economy",
    label: "05 The marketplace",
    eyebrow: "Act IV · The economy · 05 AI Agent Marketplace · the new wave",
    headline: "One marketplace. Every mentor. Every method.",
    sub: "There is no one way to trade. Gold at the New York open on liquidity sweeps. EUR/USD in London off VWAP. NQ on the opening range. Bitcoin on weekly levels. Oil on the inventory number. Today each of those mentors lives in his own Discord, his own Telegram, his own Whop. Here each one has a storefront: a verified record, a room, a clone that thinks like him, a desk that works like him. Not indicators. Not bots. A person's way of thinking — installed.",
    say: "Now the marketplace itself, and I want to correct a picture people have. This is not a store of tools. It is a store of people. There is no one way to trade — there are thousands of mentors, and every one has an instrument, a session, a method and a way of managing risk. Marcus trades gold at the New York open on liquidity sweeps and goes half size on news. Lena fades EUR/USD in London off VWAP and takes partials at one R. Dev trades the NQ opening range and pyramids winners. Aiko swings Bitcoin off weekly levels, three trades a week. Tomás scalps the S&P off the footprint, same size every time. Sofia trades oil on the Wednesday inventory number, one trade a day. Today every one of them is a separate Discord, a separate Telegram, a separate Whop — a million random rooms with no way to compare them. Here every one of them is a storefront: a verified record, a room, a clone that thinks the way he thinks, a desk that works the way he works. You filter by what you trade and when you trade it, and you install the person. Not an indicator. Not a bot. A way of thinking. That is the new money flow, and nobody else can run it, because it runs on the record.",
    read: [
      "Top: four rows of FILTER chips — Instrument · Session · Method · Management. CLICK one (for example 'London'). The matching mentor lights up, the rest fade. Click it again to clear. Do two or three filters — this is the moment Owen SEES it is a market of people.",
      "Six MENTOR STOREFRONTS. Each card: initials + verified tick · instrument and session in gold · one sentence of HOW he trades · two chips (method, management) · his RECORD in green (calls · hit rate · avg R) · three prices: Room / Clone / Desk · how many traders installed him.",
      "All six are invented, all six are realistic, and all six are DIFFERENT — different instrument, session, method, risk. Say that out loud.",
      "The 24/7 moon on every card: every mentor's clone is awake when he is not.",
      "Bottom strip: 'Not indicators. Not bots. A person's way of thinking and working — installed.' Then the wiring: verified by 08 · sold on 05 · runs on the student's own record in 04. 'A million Discords become one store.'",
    ],
    ask: "How many mentors do you think already sell to TradeLocker's traders across Discord and Telegram today — and would they move for a verified record and a clone?",
    beat: 90,
    accentRole: "tertiary",
    layout: "stack",
  },
  {
    id: "flywheel",
    act: "economy",
    label: "The flywheel",
    eyebrow: "Act IV · The economy · why it is one business",
    headline: "Money moves in a circle. Every hop runs through the record.",
    sub: "A student pays a mentor. The mentor's calls become a verified record. The record becomes his identity in the feed — the next student finds him. The mentor packages himself into a clone and a desk; his students install them. A student refers a friend and earns for life. Archio takes a percentage at every hop. Three lanes, one circle, one rail.",
    say: "Here is why the three lanes are one business and not three products. Follow the circle. A student pays a mentor for the room — Archio takes fifteen percent. The mentor's calls land on the record — free, that is what makes him worth paying. The record becomes his identity in the feed — free, that is how the next student finds him. Now the mentor packages himself: a clone that thinks like him, a desk that works like him — and his students install them — Archio takes fifteen to thirty. The student who installed it refers a friend and earns twenty percent for life — Archio keeps eighty. And the friend is a new student at the top of the circle. Every hop that costs money runs on our rail. Every hop that is free builds the trust that makes the next paid hop happen. The record is in the middle of all of it, and the record lives here. Nobody outside can copy the circle, because they do not have the middle.",
    read: [
      "Left: the RING. Six stations around a dashed circle, a light travelling clockwise. Each station is 'from → to' with a gold chip if Archio takes a cut. The centre says THE RECORD · every hop runs through it.",
      "Right: the same six hops as rows, numbered, with WHAT happens, WHICH system, and the TAKE. Two of them say 'free · builds trust' — point out that the free hops are what make the paid hops possible.",
      "Bottom box is the sentence to land: the record makes the mentor worth paying → the mentor makes the clone worth installing → the student who installs it brings the next student.",
      "If he asks 'why can't Whop do this': Whop has hop one only. It has no record, so it has no hop two, three, four or five.",
    ],
    ask: "Which hop in this circle do you think is the hardest to make real — and which one, once real, makes the rest inevitable?",
    beat: 70,
    accentRole: "amber",
    layout: "stack",
  },
  {
    id: "city",
    act: "economy",
    label: "The city",
    eyebrow: "Act IV · The economy · the new standard",
    headline: "A place where people work.",
    sub: "Adobe made a job called 'creative'. Shopify made a job called 'merchant'. Archio makes seven: mentor, clone operator, builder, analyst, affiliate, community lead, prop partner — each with a start, a daily rhythm, a way to get paid and a place in the stack. Today those jobs exist, scattered and unpaid, across Skool, Whop, Discord, Zoom, X and the broker. Here they are one economy on one rail.",
    say: "This is what we are actually building. Not a tool. A place where people work — an economy with jobs. Click a role and you see the job. A mentor: starts with KYC and a verified record, writes the gameplan on Sunday, teaches on the chart at his session all week, gets paid from the room, the course, his clone and his desk. A clone operator — a job that does not exist anywhere today — keeps a mentor's AI honest, feeds it new sessions, catches drift, and is paid a share of the clone. A builder ships desks and agents that run on the record and is paid on every install. An analyst never teaches — he publishes two forecasts a day, the record compounds, and the record IS his resume: sixty-one percent, plus point eight four R, two hundred and fourteen calls. An affiliate earns for life. A community lead is the paid version of the unpaid Discord mod. A prop firm plugs in and finally sees the decision before the fill. Look at the money-between-roles box: a student pays a mentor, the mentor pays a community lead and buys a builder's desk, the student's friend joins under an affiliate, and Archio takes its percentage at every one of those hops. Today all of this is scattered across eight companies and most of it is unpaid. Here it is one window, one record, one rail — and everyone on it gets paid. Adobe built this for designers. We are building it for the largest financial community on earth.",
    read: [
      "Left: seven JOB tiles. CLICK one — the job opens on the right. Do Mentor, Clone operator (say 'this job does not exist yet') and Analyst. Mention the rest in one breath.",
      "Each job panel: STARTS (how you get in) → EVERY DAY (the actual rhythm of the work) → GETS PAID (green — every source) → STACK (which Act III systems it lives in). Then two boxes: TODAY in red (where this job is scattered/unpaid now) and HERE in green (what changes).",
      "Under the tiles: MONEY BETWEEN ROLES — five real hops in one month with amounts. Point at it: student → mentor → community lead → builder → affiliate. Archio is paid at every hop. That is why it is one economy, not three products.",
      "Bottom strip: eight struck-through names — Skool · Whop · Discord · Zoom · TradingView · MQL5 · X · the broker — crossed by one gold line: 'one window · one record · one rail · everyone gets paid'. That is the closing image of the economy.",
    ],
    ask: "Which of these jobs shows up first — and which one would TradeLocker want to own itself rather than let a partner own?",
    beat: 90,
    accentRole: "primary",
    layout: "stack",
  },

  /* ═══════════════════════════ ACT V · THE APP ═══════════════════════════ */
  {
    id: "honest",
    act: "close",
    label: "Where we are",
    eyebrow: "Act V · The app · no bullshit",
    headline: "Here is exactly where we are.",
    sub: "Real today. Built and running in demo state. Not connected yet. We would rather be straight about this than make the product look farther along than it is.",
    say: "Before the app, straight talk. Real today: accounts, community infrastructure, billing, the AI engine, the Flight Deck. Built and running on scripted data: the Live Room, the Decision Desk, the gameplan, trade review, Trading DNA. Not connected yet: the single durable record across the whole chain, broker execution data, real user history, the marketplace payments. The experiences exist. The pieces exist. The missing bridge is real trader and broker data — which is part of why we are talking to you.",
    read: [
      "Three columns: REAL TODAY (green), BUILT · DEMO STATE (accent), NOT CONNECTED YET (red, dashed). Read one item from each column.",
      "The red column is the ask. Do not soften it. 'Broker execution data' is TradeLocker.",
    ],
    ask: "If you were building this from where we stand today, are we attacking the technical pieces in the right order?",
    beat: 45,
    accentRole: "amber",
    layout: "stack",
  },
  {
    id: "doors",
    act: "close",
    label: "Open the app",
    eyebrow: "Act V · The app",
    headline: "Now let me show you one decision.",
    sub: "Not a tour. One trader, one decision, through the loop: Live Room → Forecast → Rules → Review. Then three questions for you, and I stop talking.",
    say: "Not a tour of nine systems — one trader, one decision. Live Room for the context. Forecast for the thesis, stamped. Rules check against the gameplan. Execution we skip — that is your rail. Then Trading DNA: why did I lose yesterday. After that, three questions for you and then I stop talking.",
    read: [
      "Three doors. Keys 1 / 2 / 3 open them in a new tab: Flight Deck (/dashboard), Live Room (/live-room), Forecast (/forecast).",
      "Open door 2 first (Live Room), then 3, then 1. Keep this deck open in the presenter window.",
      "After the app: ask the three questions below, one at a time, and let the silence sit.",
    ],
    ask: "What are we wrong about? · If you could prove ONE thing in the next 90 days, what would you prove? · A few years out, what should TradeLocker own itself, and where does it make sense for partners to build?",
    beat: 30,
    accentRole: "primary",
    layout: "stack",
  },
]

export const DECK_TOTAL = DECK.length
export const DECK_MINUTES = Math.round(DECK.reduce((s, d) => s + d.beat, 0) / 60)
