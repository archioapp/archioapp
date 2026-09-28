# ARCHIO — THE NINE SURFACES
## The Complete Design & Animation Handoff Document
### Landing Page Feature Presentation — Master Breakdown

**Version 1.0 — July 2026 — For the QClay design team**

---

# PART 0 — HOW TO READ THIS DOCUMENT

This document specifies, for each of the nine ARCHIO features, in the locked presentation order:

1. **The psychological role** — what the visitor must FEEL at this point of the page, and why this feature sits at this position in the sequence.
2. **The full scenario bank** — EVERY before/after scenario the feature contains (not just one). Each scenario is written as: the pain (before), the resolution (after), and the emotional mechanism it triggers.
3. **The hero scenario** — which ONE scenario becomes the full-screen cinematic transformation, and why that one wins over the others.
4. **The scene-by-scene animation script** — the exact sequence, camera movement, timing, motion behavior, and copy for the feature's expanded story. Written in the same language as your existing chapter documents (Idea Description / Animation).
5. **The micro-interaction spec** — hovers, cursors, transitions, sounds of motion (visual rhythm), that make the feature feel alive before it is even clicked.
6. **The copy bank** — every headline, sub-line, and one-liner, ready to place.

## THE ONE LAW THAT GOVERNS EVERYTHING

**One screen = one transformation.** The human brain cannot hold two before/afters simultaneously. When a feature has six scenarios (they all do), the presentation is:

- ONE scenario becomes the HERO — the full cinematic before → transformation → after arc.
- The remaining scenarios become the **PROOF STACK** — a rhythmic sequence of short, one-breath before/after pairs that fire AFTER the hero has done the emotional work. Each proof-stack item is one line of pain, one line of resolution, one small visual. Three seconds each. They land like punches because the hero already opened the wound.

This is the answer to "how do I show many before/afters without chaos": **the hero converts the heart, the proof stack converts the head.** The visitor decides emotionally during the hero, then rationalizes the decision during the stack. This is the classic two-system model of decision making (System 1 feels, System 2 justifies) — your page must feed both, in that order, never mixed.

## THE GLOBAL ANIMATION GRAMMAR

Every feature story uses the same 6-scene skeleton (matching your existing chapter template):

| Scene | Name | Duration (scroll-heights) | Job |
|---|---|---|---|
| A | THE QUESTION | 0.75 | The card's question, alone, huge. Silence. |
| B | THE BEFORE | 1.0 | The hero scenario's pain, dramatized |
| C | THE TRANSFORMATION | 0.75 | Chaos physically reorganizes into order |
| D | THE AFTER | 1.0 | The feature working. Real UI. Interactive. |
| E | THE PROOF STACK | 1.25 | All remaining scenarios, rapid-fire pairs |
| F | THE DOOR | 0.5 | One number. One CTA. One way back. |

**Motion identity per phase (this is critical — motion IS the storytelling):**

- **BEFORE motion:** scattered, non-synchronized, drifting. Elements move on independent clocks. Slight jitter. Nothing aligns. The viewer's eye can never rest — that unease IS the message.
- **TRANSFORMATION motion:** convergence. Everything that was drifting gets caught by a single force (the light beam / the memory core) and pulled into alignment. Easing: slow start, confident middle, gentle settle (cubic-bezier(0.16, 1, 0.3, 1)). This is the most emotionally important motion on the entire page — it is the product promise expressed physically: *fragmentation becomes order.*
- **AFTER motion:** synchronized, calm, breathing. All elements share one rhythm (a 4-second subtle scale/glow cycle, like slow breathing). Alignment to a grid. Generous spacing. The eye rests. Calm = competence.
- **PROOF STACK motion:** metronomic. Each pair slides in on the same beat, same duration, same easing. Rhythm creates the perception of inevitability — "and this, and this, and this" — the drumbeat of an unstoppable product.

## THE PSYCHOLOGY SPINE OF THE ORDER (why 1→9 is this order)

The nine features are ordered as the trader's life story, and each feature's closing emotion is the opening emotion of the next:

1. **Flight Deck** ends with "this place knows me" → creates the question "but who teaches me?"
2. **Community** ends with "I found my people" → creates the question "but can I trust them?" *(partially answered here, fully answered in 8)*
3. **Decision Desk** ends with "my decisions have a home" → creates "but the problem is me, not my desk"
4. **Trading DNA** ends with "it knows my patterns" → creates "I want more minds on my side"
5. **AI Agent Marketplace** ends with "I have a team now" → creates "so what do I actually own?"
6. **Portfolio** ends with "I can see and stress-test my holdings" → creates "but what about my whole life?"
7. **Net Worth** ends with "I see my complete picture" → creates "now I want everything I do to COUNT"
8. **AI Verified Track Record** ends with "everything I do is provable" → creates "I want to show the world"
9. **Social Network** ends with "my record IS my identity" → and its final image loops back to a new trader discovering a verified mentor — which is scene 2. **The circle closes on screen.** Tell the designers: the last frame of feature 9 must visually rhyme with the first frame of feature 2. Visitors won't consciously notice; their gut will.

---

# FEATURE 1 — FLIGHT DECK
## "One place that actually knows me."

### 1.1 The Psychological Role

Flight Deck opens the sequence because it is the container of everything else — but psychologically its job is different from the other eight: it must convert the visitor's relationship with software from **"I operate tools"** to **"something here knows me."** Every trader has operated a hundred tools. None has ever been *known* by one. The moment a visitor believes a piece of software accumulates understanding of them specifically, the entire rest of the page becomes believable. This is why Flight Deck cannot lead with features — it must lead with MEMORY.

The visitor arriving at this card is still a skeptic. He has seen "AI-powered dashboard" a thousand times. The one claim he has never seen proven: *it remembers.* So everything in this story is engineered to prove memory.

### 1.2 The Full Scenario Bank

**Scenario A — The Nine Windows (fragmentation).**
BEFORE: TradingView for charts. Discord for the mentor. Telegram for signals. Notion for the journal he abandoned in March. X for news. The broker app. A spreadsheet for performance. YouTube for learning. ChatGPT for questions — which knows nothing about him. Nine windows; the only integration between them is the trader's own exhausted attention.
AFTER: One deck. All nine jobs, one memory underneath.
MECHANISM: recognition — every single trader lives this exact desktop. Show it accurately and the visitor thinks "they've seen my screen."

**Scenario B — The Goldfish AI (memoryless assistants).**
BEFORE: He asks ChatGPT "should I be worried about my EUR/USD position?" — it answers generically, because it doesn't know he HAS a EUR/USD position, or that his mentor flagged dollar strength yesterday, or that he broke his risk rule on the last three trades.
AFTER: He asks Archio the same question. The answer references HIS position size, HIS mentor's call from yesterday's live room, HIS current risk state. Same question — but this answer could not have been given to anyone else on earth.
MECHANISM: the "only for me" effect — personalization is believed only when the output is impossible to generate for someone else.

**Scenario C — The Morning Chaos (the ritual).**
BEFORE: he wakes up, and reconstructing the state of the world takes 45 minutes across six apps: what happened overnight, what did the mentor say, what's on the calendar, where are his positions.
AFTER: MORNING BRIEF — one screen, generated for him: overnight moves on HIS pairs, HIS mentor's overnight activity, HIS calendar risks, HIS open exposure. 45 minutes becomes 90 seconds, every day.
MECHANISM: quantified time salvation — the most concrete promise on the page. Time is the only resource traders universally admit losing.

**Scenario D — The Amnesiac Workspace (context evaporation).**
BEFORE: every day starts from zero. Yesterday's research, the levels he marked, the idea he half-formed at midnight — gone, scattered, unfindable.
AFTER: the deck opens exactly where his thinking ended. Yesterday's context is today's starting point. Work compounds instead of evaporating.
MECHANISM: loss reframing — he never counted "lost context" as a loss until you show it.

**Scenario E — The Adapting Room (living workspace).**
BEFORE: his dashboard looks identical during NFP release and during a dead Sunday. Static tools don't know the difference.
AFTER: the deck reshapes: on event days risk widgets move to the center; after a losing streak the Mind Check panel surfaces; during his mentor's live session, the room becomes the room. The workspace has a pulse.
MECHANISM: aliveness — motion tied to MEANING (not decoration) reads as intelligence.

### 1.3 The Hero Scenario

**Scenario B — The Goldfish AI.** Not A (fragmentation) — because your designers already dramatize fragmentation in chapters 00–02 of the film; repeating it here wastes the card. The Goldfish is the sharpest available contrast: *same question, two answers — one generic, one that knows you.* It demonstrates memory in a single split screen, needs no explanation, and is instantly testable by the visitor in the live demo. A and C become the top of the proof stack.

### 1.4 The Animation Script

**SCENE A — THE QUESTION (0.75 heights)**
The 3×3 grid card expands: card borders fly outward past the viewport edges, card content cross-fades into a black field. The question sets alone in the center, serif italic, huge: *"One place that actually knows me."* Below it, small, mono, dim: [ ‧ SURFACE 01 · FLIGHT DECK ‧ ]. No other elements. 700ms of stillness before scroll unlocks — the pause forces the reading.

**SCENE B — THE BEFORE (1.0 heights)**
A single chat input materializes, center. Typed live, character by character (40ms/char): *"Should I be worried about my EUR/USD position?"* The message sends — and the screen SPLITS vertically with a hard line. LEFT side, labeled in mono caps ANY AI: a generic answer types out — visibly generic, hedging, bulleted boilerplate ("EUR/USD can be affected by many factors…"). As it types, the left side desaturates toward gray, and the text lines begin to drift apart letter-spacing-wise — the visual language of emptiness. The left answer ends with a cursor blinking on: *"Is there anything else I can help with?"* — the most hollow sentence in software.

**SCENE C — THE TRANSFORMATION (0.75 heights)**
The right half, labeled ARCHIO, was dark. Now: from the edges of the viewport, small glowing fragments fly INTO the right panel — each one briefly legible as it passes: a journal line ("broke risk rule — 2nd time"), a mentor quote ("watch dollar strength into FOMC"), a position chip ("EUR/USD −0.8% · 2.1 lots"), a calendar chip ("FOMC 14:00"). They are the trader's LIFE converging into the answer. They spiral into a compact core that pulses once — the memory heartbeat. This is the most important 2 seconds of the feature: **context physically arriving.**

**SCENE D — THE AFTER (1.0 heights)**
The right panel answers — and every clause that uses personal context gets a subtle underline-glow as it types, with a hair-thin line connecting it to the fragment that powered it: *"Your 2.1 lot position (→position chip) is 40 pips from the level Marcus flagged yesterday (→mentor quote). Given you've hit your weekly risk limit (→journal line) and FOMC is at 14:00 (→calendar chip), consider…"* The left panel, still gray, quietly scrolls itself away — dismissed. Interactive beat: the visitor can click one of three preset questions ("What matters for me today?" / "How am I trading this week?" / "What did I miss?") and watch the fragments re-converge for a different answer. **Touched software converts; watched software entertains.**

**SCENE E — THE PROOF STACK (1.25 heights)**
Metronomic pairs, each sliding in on the beat:
1. *Nine windows every morning* → *One deck* (the nine-window desktop collapses into one frame)
2. *45 minutes to reconstruct your world* → *Morning Brief: 90 seconds* (a clock spins down)
3. *Yesterday's thinking: lost* → *Opens where your mind left off* (a workspace fades in mid-thought)
4. *Same dashboard on NFP day and dead Sunday* → *The room reshapes to the moment* (widgets slide, risk panel enlarges)

**SCENE F — THE DOOR (0.5 heights)**
One real number, counting up: **"9 apps → 1"** and beneath it **"~3 hours returned to you, weekly."** Two CTAs: [ ENTER THE DECK ] and a dim ← back to the map. Nothing else.

### 1.5 Micro-interactions

- Card at rest (in grid): a faint slow radar-sweep of light crosses the card every 7s — the deck is "on" even before you touch it.
- Card hover: the question line types itself in real time (it was static before hover) — the card starts *thinking* when you approach.
- Cursor inside the story: default cursor everywhere EXCEPT interactive demo elements, where it becomes a small glowing ring — teaching the visitor what is touchable without a single tooltip.

### 1.6 Copy Bank

- Header: **One place that actually knows me.**
- Alt headers: "The first workspace with a memory." / "Your tools finally know each other."
- Scene B caption: "Every AI you've used has amnesia."
- Scene D caption: "This answer exists for exactly one person."
- Proof stack closer: "Memory is the feature. Everything else is furniture."
- Door: "9 apps → 1. Three hours a week, returned."

---

# FEATURE 2 — COMMUNITY
## "My mentor went live. I missed everything."

### 2.1 The Psychological Role

Community is second because people join platforms for people — tools retain them, people recruit them. The visitor has just been shown a workspace that knows him (Feature 1); his immediate unconscious objection is "but I still need someone to learn FROM." Community answers it. The psychological transformation: from **"trading education means scrolling a chaotic Discord run by someone who might be fake"** to **"there are real rooms, run by verified humans, and the knowledge doesn't evaporate."**

Two wounds live here, and BOTH must appear: the **fear of missing out on live knowledge** (sessions happen when you're asleep/working) and the **fear of fakes** (is this mentor even real?). The fake-mentor wound is opened here and fully healed in Feature 8 — deliberately. Tell the designers: Community shows the KYC badge as an artifact; Feature 8 shows the machinery that mints it. Foreshadowing creates narrative hunger across the page.

### 2.2 The Full Scenario Bank

**Scenario A — The Missed Session (Catch Me Up).**
BEFORE: mentor went live at 6am his time. By the time he wakes, there are 2 hours of recording and 400 Discord messages. The one key call — a EUR/USD level with reasoning — is buried at minute 47. He scrolls, gives up, trades without it, loses.
AFTER: he enters the room at any hour, presses **CATCH ME UP** — the session compresses into: the thesis, the 3 calls made (with timestamps), what changed since, and what's still active. Two hours in thirty seconds. Knowledge no longer decays.
MECHANISM: FOMO resolution — the single most acute daily pain of every trading-community member on earth.

**Scenario B — The Clone Army (KYC identity).**
BEFORE: the same "mentor" exists five times: @MarcusFX, @MarcusFX_Real, @MarcusFX_Backup, @TheRealMarcus, @MarcusFXOfficial. Three are scammers who DM students "continue our lesson privately" and disappear with $2,000. The real Marcus spends half his energy telling students which account is him.
AFTER: KYC verification locks ONE name and ONE username to ONE passport-verified human. When Marcus verifies, the system permanently binds his identity — the four impostors' accounts can never claim his name, his likeness, or his students. A verified profile shows: legal-identity-checked badge, one immutable username, scam-pattern screening (fake YouTube/Discord cross-checks).
MECHANISM: the vaccination effect — showing the SCAM first, then the lock. Every trader has either been burned or knows someone who was; naming the exact scam pattern ("continue privately on Telegram") proves you know the enemy intimately.

**Scenario C — The Blind Date Problem (community discovery).**
BEFORE: choosing a community is gambling: pay $50–200/month, discover after three weeks that the style is scalping when you're a swing trader, the timezone is wrong, the "mentorship" is a dead chat.
AFTER: the Discovery Engine profiles communities on 21 dimensions (style, session hours, activity heat, mentor verification level, student results) and matches him — with a side-by-side comparison view before any money moves ("the switch decision, with data, not FOMO").
MECHANISM: pre-purchase certainty — turning a leap of faith into an informed choice.

**Scenario D — The Question in the Void (Mentor AI in rooms).**
BEFORE: he has a question at 3am. The mentor is asleep. He posts in Discord; it scrolls away unanswered forever.
AFTER: every room has its mentor's AI — trained on that mentor's actual sessions and calls — answering in the mentor's framework at any hour, clearly labeled as AI. The mentor wakes to a digest of what his AI answered, corrects anything — corrections improve the AI.
MECHANISM: infinite availability of a finite human — the impossible thing made plausible by the memory architecture already established in Feature 1.

**Scenario E — The Live Room Itself (presence).**
BEFORE: "live trading" means a laggy screenshare where the mentor mumbles over an unreadable chart and calls vanish into chat scroll.
AFTER: structured live rooms: the mentor's chart is native (not a video), every call he makes becomes a structured object (pinned, timestamped, linked to HIS verified record — foreshadowing Feature 8 again), students' journals can subscribe to the call with one tap.
MECHANISM: professionalization — the visual difference between a stream and an operating room.

### 2.3 The Hero Scenario

**Scenario A — Catch Me Up.** The missed session is universal, daily, and demonstrably solvable in ONE interaction (a button press → a compression animation). Scenario B (KYC/clone army) is emotionally stronger but is the OPENING of the proof stack rather than the hero — because its full payoff belongs to Feature 8, and making it the hero here would steal the record chapter's thunder. B leads the proof stack with its own mini-dramatization (see below) — it gets more screen time than any other stack item on the page. This is the "double-wound" structure unique to this feature.

### 2.4 The Animation Script

**SCENE A — THE QUESTION (0.75)**
Card expands. Black. The question: *"My mentor went live. I missed everything."* Beneath: [ ‧ SURFACE 02 · COMMUNITY ‧ ]

**SCENE B — THE BEFORE (1.0)**
A phone-shaped frame center-screen (this pain lives on the phone — render it there; the visitor's muscle memory does the rest). A Discord-like scroll of 400 messages BLURS past at inhuman speed — readable words flick by: "huge call", "did you catch that?", "he said WHAT level?", "scroll up", "it was 2 hours ago bro". The scroll accelerates. Around the phone, the room darkens; a clock in the corner spins from 06:00 to 20:00. The scroll never stops — the message: *this river cannot be drunk.* Final beat: the phone locks, screen black, one reflection visible in it — the trader's silhouette. (Directly reuses the reflective silhouette language from your chapter 02.)

**SCENE C — THE TRANSFORMATION (0.75)**
One button rises out of the black phone screen, glowing: **CATCH ME UP**. The cursor (or a touch ripple) presses it. The 400 blurred messages EXPLODE upward out of the phone into 3D space — hundreds of message-shards hanging frozen in a cloud — then the beam of light (your loader's beam — same asset, same meaning) sweeps through the cloud ONCE, and the shards collapse into four clean glowing cards. Chaos → compression, in one sweep. Note for the team: shard collapse should be MAGNETIC (shards accelerate toward their card) not fade-based — the knowledge is being CAUGHT, not summarized away.

**SCENE D — THE AFTER (1.0)**
The four cards arrange into the Catch Me Up layout, each typing its content:
1. **THE THESIS** — "Dollar strength into FOMC; DXY above 105.4 invalidates."
2. **CALLS MADE** — three structured call rows with timestamps and a LIVE/CLOSED state chip.
3. **WHAT CHANGED SINCE** — "EUR/USD hit the first level +40 pips; call #2 still active."
4. **WHAT'S ACTIVE NOW** — the still-live setup, with a "follow in my journal" tap.
Caption fades in beneath: *"Two hours. Thirty seconds. Nothing lost."* Interactive beat: the visitor can press CATCH ME UP themselves on a second, different mock session — replaying the collapse with different content. Same button, different knowledge — proving it's a SYSTEM, not a scripted demo.

**SCENE E — THE PROOF STACK (1.5 — extended, this feature earns it)**
Item 1 gets the mini-dramatization (KYC — the Clone Army): five identical avatar cards slide in, labeled @MarcusFX, @MarcusFX_Real, @TheRealMarcus, @MarcusFX_Backup, @MarcusFXOfficial. They shuffle positions — the eye cannot track which is real (a literal shell game — let it run 1.5 seconds so the visitor FEELS the impossibility). Then a vertical light-scan passes across all five: four cards burn away edge-first (not fade — burn; scams deserve violence in the motion language), one card receives the verification seal stamping DOWN onto it (a physical 3D press, 200ms, with a 2px screen shake on impact — the heaviest single motion on the entire page; weight = permanence). The surviving card expands one beat to show: legal name lock, single immutable username, "identity verified via passport + scam-pattern screening." One line beneath: *"One human. One name. Forever."*
Then the metronome resumes for the remaining pairs:
2. *Paying $99/month to find out a community is wrong for you* → *21-dimension match before a dollar moves* (a radial fit-scan draws)
3. *Question at 3am, answered never* → *The mentor's AI answers in his framework, at any hour* (a chat bubble lights in the dark)
4. *Calls vanish into chat scroll* → *Every call is an object: pinned, timestamped, on the record* (a message crystallizes into a structured card)

**SCENE F — THE DOOR (0.5)**
Number: **"0 sessions lost. Ever."** CTAs: [ FIND YOUR ROOM ] · ← back to the map.

### 2.5 Micro-interactions

- Card at rest: a tiny green "LIVE" dot pulses on the card — there is always a room live somewhere.
- Card hover: faint ambient room-murmur visual (soft overlapping translucent message bubbles rising) — community = human presence.
- The verification seal from scene E reappears as a persistent 12px badge next to every mentor name in ALL subsequent features — continuity of trust artifacts across the page. Tell the designers to build it as a component, not a flattened asset.

### 2.6 Copy Bank

- Header: **My mentor went live. I missed everything.**
- Alt: "The room remembers, even when you can't be there."
- Scene C button: CATCH ME UP (always all-caps, always the same glow — this is a brand asset now)
- KYC stack line: "One human. One name. Forever."
- Discovery line: "Know before you pay."
- Door: "0 sessions lost. Ever."

---

# FEATURE 3 — DECISION DESK
## "I made 6 trades today. I couldn't tell you why."

### 3.1 The Psychological Role

The visitor now has a home (1) and people (2). Feature 3 turns the page from RECEIVING to ACTING — his own decisions. The deep wound here is not losing money; it is **decision amnesia**: the inability to reconstruct WHY any trade happened. Every retail trader carries the private shame of trading on vapor — a tweet, a feeling, a candle shape — and having no record of the reasoning because there was no reasoning. The Decision Desk's promise: **every decision gets a birth certificate.** Market read → forecast → decision check → execution → journal, as ONE connected chain, automatically.

Psychologically this feature must be presented as RELIEF, not discipline. Traders know they should journal — guilt is the incumbent. If the story smells like homework, it dies. The magic word is *automatically*: the chain assembles itself as a byproduct of trading, not as an extra chore.

### 3.2 The Full Scenario Bank

**Scenario A — The Vapor Trade (decision amnesia).**
BEFORE: Friday night. Six trades this week, four losers. He tries to remember why he entered the third one. Nothing. There is no record. The lesson each loss should have taught: unlearnable, because the reasoning was never captured.
AFTER: every trade on the desk shows its full ancestry: the market read that started it, the forecast he published, the rule check at entry, the journal line at exit. "Why did I take this?" has an answer, forever, for every trade.
MECHANISM: shame → relief. The confession headline does the recognition work.

**Scenario B — The Scattered Chain (four tools, zero connections).**
BEFORE: news on X. Chart in TradingView. The trade idea in his head. The journal in Notion — last entry March 14th. Four locations; the causal chain between them exists only in his memory, which is to say: nowhere.
AFTER: one desk where the chain is physical: cards connected by drawn lines — Intelligence → Forecast → Decision → Journal. Touch any trade, see its whole lineage light up.
MECHANISM: visible causality — the chain made literal is the product's entire argument in one image.

**Scenario C — The Forecast That Never Was (predicting in hindsight).**
BEFORE: "I knew that would happen" — said after every move, verifiable never. He genuinely can't tell whether his reads are good because they're never written down BEFORE the outcome.
AFTER: forecasts are published before the move, locked with a timestamp, scored after. He learns — for the first time with actual data — whether his directional reads have edge. (Quiet foreshadowing of Feature 8: the lock icon on the forecast is the same lock that powers the Track Record.)
MECHANISM: self-knowledge as a product — this scenario sells the desk to the trader's EGO ("find out if you're actually good").

**Scenario D — The Auto-Journal (the chore that does itself).**
BEFORE: every journaling method dies within three weeks — because after a losing trade, the last thing a human wants is to write an essay about it.
AFTER: the journal entry assembles itself from the chain: entry context, forecast, rule state, exit, P&L — pre-filled; he adds one optional sentence of feeling. Trade Review then reads the WEEK and finds patterns: "your Tuesday losses share one setup type."
MECHANISM: zero-willpower systems — the only systems that survive contact with a losing streak.

**Scenario E — The Signal Firehose (curated vs. raw).**
BEFORE: signals arrive as raw Telegram spam — "GOLD BUY NOW 🚀" — sourceless, contextless, unaccountable.
AFTER: signals on the desk arrive as structured objects from verified sources (the badge from Feature 2 appears here), each with reasoning attached and its author's live hit rate — and one tap converts a signal into HIS forecast, into HIS chain.
MECHANISM: the desk as a filter — the same information, made accountable.

### 3.3 The Hero Scenario

**Scenario A/B fused — The Vapor Trade told through the Scattered Chain.** The hero shows a trade being taken across four disconnected tools, then the same trade taken ON the desk with the chain assembling live. A is the emotion, B is the visual — they are one story. C (locked forecasts) leads the proof stack because its lock icon is the page's most important foreshadowing object.

### 3.4 The Animation Script

**SCENE A — THE QUESTION (0.75)**
*"I made 6 trades today. I couldn't tell you why."* — the only header on the page written as a confession. Confessions in first person are read in the reader's inner voice — which means the visitor confesses it to himself. [ ‧ SURFACE 03 · DECISION DESK ‧ ]

**SCENE B — THE BEFORE (1.0)**
Four floating app-frames drift in dark space at four corners: a tweet ("dollar looking weak?? 👀"), a candlestick chart, a Telegram signal ("EU LONG NOW"), an empty Notion page titled "Trading Journal" with "Last edited: March 14". Between them, a faint dotted line tries to draw itself — connecting tweet → chart — and DISSOLVES halfway. It tries again, chart → journal — dissolves. The connections physically cannot form. Then a trade-execution chime visual (a fill notification: "FILLED: EUR/USD LONG 2.0") appears in the CENTER, connected to NOTHING — a decision born of nothing, recorded nowhere. It fades to a small gray tombstone chip: "Trade #4 — reason unknown." Three more tombstones appear beside it. This is the graveyard of vapor trades.

**SCENE C — THE TRANSFORMATION (0.75)**
The four app-frames are seized by the convergence force — they fly to the center and RESHAPE (not shrink: reshape, morphing aspect ratio mid-flight) into four column-cards of one desk: INTELLIGENCE · FORECAST · DECISION · JOURNAL. As they lock into place, the dotted line that kept failing in Scene B draws again — and this time it COMPLETES, left to right, a confident stroke of light passing through all four columns. The completed line pulses once. The chain exists. (Timing note: the line completion should take exactly as long as the failed attempts in scene B — the same gesture, finally succeeding. Repetition-with-resolution is the oldest trick in visual storytelling; use it.)

**SCENE D — THE AFTER (1.0)**
The desk live: a market-intelligence card streams a headline; the visitor watches a forecast being typed into the FORECAST column ("EUR/USD → 1.0950 by Friday; invalid above 1.0870"), a lock icon closes on it with a soft click-flash and a timestamp; the DECISION column runs its check (three green rule rows); execution fires; and the JOURNAL column writes ITSELF — the entry assembling line by line from the chain's data, visibly pulling each line from the column to its left. Interactive beat: the visitor can hover any trade in a mini trade-list below — the full chain for that trade lights up left-to-right. Six trades, six chains, six answers to "why."

**SCENE E — THE PROOF STACK (1.25)**
1. *"I knew it would happen" — said after, provable never* → *Forecast locked BEFORE. Scored after.* (the lock icon stamps a forecast; a score chip flips from PENDING to HIT +40)
2. *Journal, abandoned March 14th* → *The journal writes itself; you add one sentence* (an entry auto-assembles)
3. *"GOLD BUY NOW 🚀" from an anonymous channel* → *Signals with a face, a record, a reason* (a raw spam message crystallizes into a structured card carrying a verified badge + hit rate)
4. *Six trades, zero lessons* → *Trade Review finds your pattern: "Tuesday losses share one setup"* (a calendar heat-map highlights Tuesdays)

**SCENE F — THE DOOR (0.5)**
Number: **"Every trade, a reason. Forever."** CTAs: [ OPEN THE DESK ] · ← back.

### 3.5 Micro-interactions

- Card at rest: the four-column chain drawn as a faint diagram; the connecting line slowly draws and completes on a 6s loop — the card is quietly demonstrating its thesis to peripheral vision.
- Hover: one tombstone chip ("reason unknown") flips to a lit chain chip ("reason: attached") — the entire feature in a 300ms flip.
- The lock icon (forecast lock) must be built as a shared component with Feature 8's record lock — SAME asset, because it IS the same mechanism. When the visitor reaches Feature 8 and sees the lock again, the trust architecture snaps together retroactively.

### 3.6 Copy Bank

- Header: **I made 6 trades today. I couldn't tell you why.**
- Alt: "Every decision deserves a birth certificate."
- Scene B caption: "The graveyard of vapor trades."
- Scene C caption: "The chain, finally connected."
- Auto-journal line: "The journal that survives losing streaks — because it writes itself."
- Door: "Every trade, a reason. Forever."

---

# FEATURE 4 — TRADING DNA
## "Why do I keep breaking my own rules?"

### 4.1 The Psychological Role

Feature 3 gave decisions a home. Feature 4 delivers the hardest truth on the page: **the problem was never the chart — it's the person holding the mouse.** This is the most intimate feature and must be handled with a different emotional temperature: the previous three stories dramatize EXTERNAL chaos (windows, Discords, scattered tools); Trading DNA dramatizes INTERNAL chaos. The designers should feel the shift: fewer elements, closer camera, slower motion, darker field. This chapter is a mirror, not a screen.

The unique claim — the one no competitor makes: every product asks *"is this trade valid?"* Trading DNA also asks *"are YOU valid right now?"* Rules + psychology, fused. The visitor should leave this story feeling simultaneously exposed and protected — the product saw his worst pattern AND stood between him and it.

Critical tone warning for the design team: this feature can NEVER shame. Every "before" here must be staged with compassion — the enemy is the pattern, never the person. One wrong copy line ("stop being undisciplined") kills the whole chapter. The product is a bodyguard, not a headmaster.

### 4.2 The Full Scenario Bank

**Scenario A — The Revenge Spiral (Mind Check).**
BEFORE: 10:42am — loss. 10:51 — bigger position, loss. 11:07 — doubled again, "to get it back." The sticky note on his monitor says "MAX 2 TRADES/DAY." It watched all three, powerless. Everyone knows this spiral; nobody's tooling has ever interrupted it.
AFTER: at trade three's entry, the DNA layer intercepts: *"Setup: valid. You: 2 losses in 25 minutes, position size climbing 2.4× — this matches your revenge pattern (7 prior episodes, avg damage −4.2R). Suggested: 30-minute cooldown, or half size."* It cannot force him — it makes the pattern VISIBLE at the exact moment of temptation. The spiral needs invisibility to work; DNA removes it.
MECHANISM: interruption at the moment of maximum vulnerability — the single most valuable intervention in retail trading, and the emotional core of the whole platform.

**Scenario B — The Rules That Live Nowhere (rules engine).**
BEFORE: his rules exist in three places: a note app ("never trade first 15 min after open"), memory ("max 1% risk"), and aspiration ("journal every trade"). None connected to the button that places trades.
AFTER: rules live IN the desk — every entry passes through them: green (allowed), yellow (allowed with warning), red (blocked-by-default, override requires typing a reason — which lands in the journal and in his DNA profile). Friction, applied surgically, exactly where impulsivity lives.
MECHANISM: the "typed reason" is behavioral-economics gold — forcing System 2 to co-sign what System 1 wants.

**Scenario C — The Stranger in the Mirror (the DNA profile).**
BEFORE: ask him "when do you trade worst?" — he shrugs. His broker knows (all the data exists!) but shows him only a P&L line.
AFTER: the DNA profile, distilled from his actual history: best session (London open), worst day (Tuesday), death setup (breakout chasing after 2pm), edge setup (pullback longs in trend, 68% over 40 trades), tilt signature (position sizes climb within 30 min of a loss). Who he is, in data.
MECHANISM: the horoscope effect made honest — humans are irresistibly drawn to descriptions of themselves; here the description is computed, not flattering.

**Scenario D — The Same Mistake, Rediscovered Monthly (pattern memory).**
BEFORE: he "discovers" that he overtrades Fridays — for the fourth time this year. Each discovery is lost because insight without storage decays in days.
AFTER: patterns persist and ESCALATE: the third Friday-overtrade triggers a standing Friday rule suggestion. Insights become guardrails automatically.
MECHANISM: compounding self-knowledge — mistakes finally have a memory.

**Scenario E — The Green Day Trap (state awareness beyond losing).**
BEFORE: everyone guards against tilt after losses. Nobody guards against euphoria after WINS — the oversized "I'm unstoppable" trade that gives back the week.
AFTER: Mind Check reads hot streaks too: *"3 wins today — historically your sizing discipline degrades after 3 consecutive wins (avg giveback −2.1R). Consider locking the day."*
MECHANISM: the surprise flank — protecting against SUCCESS is the detail that makes the whole system feel genuinely intelligent rather than naggy.

### 4.3 The Hero Scenario

**Scenario A — The Revenge Spiral.** No contest. It is the most universally lived, most emotionally loaded, and most dramatically stageable scenario on the entire landing page — a countdown-clock narrative with a rescue at the climax. C (the DNA profile) opens the proof stack as the "mirror reveal." E (green day trap) closes it as the surprise.

### 4.4 The Animation Script

**SCENE A — THE QUESTION (0.75)**
*"Why do I keep breaking my own rules?"* — set SMALLER than other chapters' questions, in the italic serif, off-center-left, with enormous negative space. Intimacy is staged through restraint. [ ‧ SURFACE 04 · TRADING DNA ‧ ]

**SCENE B — THE BEFORE (1.25 — extended; this drama earns it)**
A timestamp types in the corner: **10:42**. A position row appears: EUR/USD LONG 1.0 → it flashes red: **−1.0R**. The screen pulse-dims once (a blink).
**10:51.** New row, LONG **2.0** — the size number visibly LARGER in type scale. Red: **−2.0R**. The background has warmed one degree toward red; the ambient particle drift (idle since scene A) accelerates 15%.
**11:07.** New row assembling: LONG **4.0** — the size glyph now uncomfortably large, the whole frame subtly vibrating (1px shake at 8Hz — sub-perceptual stress). In the corner, small and devastating: a sticky-note graphic, handwriting font: *"max 2 trades/day"* — it flutters, detaches, and falls off-screen. The entry button begins to depress—
**FREEZE.** Everything stops mid-frame. 400ms of absolute stillness. (The freeze is the intervention — time itself is what the product gives back.)

**SCENE C — THE TRANSFORMATION (0.75)**
From the frozen frame's center, a calm concentric ripple expands (the exact visual opposite of the accelerating chaos: slow, circular, symmetric). The frozen scene desaturates and recedes 20% into depth. Over it, a clean panel materializes — the MIND CHECK card: *"Setup: valid. ✓ / You: revenge pattern detected — 2 losses in 25 min, sizing ×4. / This pattern has cost you −4.2R on average, 7 times. / → 30-minute cooldown · → Half size · → Proceed (tell me why)."* The three options are BUTTONS. The cursor hovers "Proceed" — a text field unfolds: "type your reason." The cursor retreats, and chooses **cooldown**. The frozen chaos scene behind exhales — literally: a slow scale-down settle, the red tint draining.

**SCENE D — THE AFTER (1.0)**
The DNA profile unfolds — staged as a specimen card, clinical and beautiful: a central identity glyph (an abstract double-helix made of his trade history — the feature's namesake made visual; build it as a living generative asset, strands = winning/losing streaks) surrounded by orbital stat chips: BEST SESSION: London open · WORST DAY: Tuesday · EDGE: pullback longs 68% (40 trades) · DEATH SETUP: late-day breakout chases · TILT SIGNATURE: size climbs within 30min of loss. Interactive beat: hovering each chip highlights the corresponding strand segments in the helix — his data, his shape. Caption: *"This is what the market has been trying to tell you about yourself."*

**SCENE E — THE PROOF STACK (1.25)**
1. *Rules on a sticky note, powerless* → *Rules in the pipeline: green / yellow / red, override = typed reason* (the sticky note from scene B returns — and slides INTO the desk, becoming a rule row; callbacks reward attention)
2. *"When do I trade worst?" — shrug* → *Your answer, computed: Tuesdays, after 2pm, chasing breakouts* (three chips stamp in sequence)
3. *Rediscovering the same flaw every month* → *Patterns remember — and become guardrails on the 3rd occurrence* (a pattern chip evolves into a rule chip)
4. *Nobody guards a winning streak* → *"3 wins today — your sizing discipline historically degrades. Lock the day?"* (a GREEN-tinted warning — the color inversion is the punchline: danger wearing the color of success)

**SCENE F — THE DOOR (0.5)**
Number: **"−4.2R. The average cost of the spiral it interrupts."** CTAs: [ SEE YOUR DNA ] · ← back.

### 4.5 Micro-interactions

- Card at rest: the DNA helix rotates extremely slowly (60s/rev) — patient, alive.
- Card hover: one strand of the helix briefly glows red then resolves to gold — a flaw becoming an edge, the feature's thesis in half a second.
- Global rule for this chapter: NO bounce easings anywhere. Bounce = playful; this room is a consultation. Ease-out only, longer durations (500–700ms vs the page's default 350ms).

### 4.6 Copy Bank

- Header: **Why do I keep breaking my own rules?**
- Alt: "The market isn't your enemy. Your Tuesday is."
- Mind Check card title: "Setup: valid. You: not right now."
- Profile caption: "What the market has been trying to tell you about yourself."
- Green-day line: "Danger sometimes wears green."
- Door: "It can't force you. It makes sure you can't not-know."

---

# FEATURE 5 — AI AGENT MARKETPLACE
## "An analyst, a risk manager, a coach — all AI."

### 5.1 The Psychological Role

After the intensity of Trading DNA, the page needs an ASCENT — feature 5 is deliberately the most aspirational, most energetic chapter: from "I am protected" to **"I am STAFFED."** The reference emotion: the moment in every heist film when the crew is assembled. The visitor has always been alone — a fund has a macro analyst, a risk officer, a psychologist, an execution desk; he has tabs. The marketplace's promise: the org chart of a fund, installable like apps.

Psychological pitfall to avoid: "AI agents" triggers skepticism (everyone has seen useless GPT wrappers). The antidote is SPECIFICITY — every agent shown must have: a narrow domain, a named data source it reads, and a visible work product. Generic "AI assistant" imagery is banned from this chapter. And the crown jewel — **Mentor AI** — is the agent that could not exist anywhere else, because it is trained on the verified session history of a real, KYC'd mentor from Feature 2. The marketplace's credibility rides on that bridge.

### 5.2 The Full Scenario Bank

**Scenario A — The 3AM Question (always-on expertise).**
BEFORE: Sunday 3am, Asia session moving, a DXY question with real money on the line. Mentor asleep. Google returns 2019 blogspam. ChatGPT gives a hedged essay that knows nothing of his position.
AFTER: he asks the same Ask bar — the DXY specialist agent answers (reads: Fed calendar, rates futures, DXY structure, HIS open exposure), in his mentor's framework if he prefers, with the reasoning shown.
MECHANISM: abandonment → cover. The 3am loneliness of retail trading is real and raw.

**Scenario B — The Mentor Who Sleeps (Mentor AI).**
BEFORE: his mentor is one human with 300 students. Question answered: maybe, in 2 days, if it survives the Discord scroll.
AFTER: Mentor AI — trained on THAT mentor's actual sessions, calls, and frameworks. Ask "what would Marcus think of this setup?" and receive the answer in Marcus's method, clearly labeled AI, with links to the source sessions where Marcus taught exactly this. Marcus reviews digests; corrections retrain it. The mentor becomes a curriculum with a pulse.
MECHANISM: impossible access made plausible — the payoff of Feature 2's whole architecture.

**Scenario C — The One-Man Fund (the team assembled).**
BEFORE: he IS the analyst, the risk manager, the psychologist, the journalist, the execution desk — a five-person job performed by one tired person, badly.
AFTER: the installed crew works in parallel: overnight, the news agent digested the tape; the risk agent flagged his correlated exposure; the journal agent drafted yesterday's entries; the psychology agent noticed his sizing creep. He wakes to their combined morning report.
MECHANISM: the fantasy of delegation — the deepest luxury for anyone who does everything alone.

**Scenario D — The Trust Problem (permissions & provenance).**
BEFORE: "install an AI" = black box; what does it see, what does it do to my account?
AFTER: every agent's card is a contract: WHAT IT READS (explicit scopes: your journal ✓, your positions ✓, your Net Worth ✗), WHAT IT CAN DO (suggest only / draft / act-with-confirm), WHO BUILT IT (a verified builder — the Feature 2 badge again), and its live performance rating from actual users.
MECHANISM: legibility = trust. The permissions card is what separates a marketplace from a toy store.

**Scenario E — The Agent That Fits YOU (DNA-matched hiring).**
BEFORE: everyone gets the same generic tools regardless of how they actually trade.
AFTER: the marketplace reads his Trading DNA (Feature 4 bridge): "You lose most on breakout chases after 2pm → the Setup Discipline agent has cut that pattern 40% for traders with your profile." Agents are recommended like medicine, not merchandise.
MECHANISM: personal prescription — and a structural demonstration that the nine features feed each other.

### 5.3 The Hero Scenario

**Scenario C — The One-Man Fund** — staged THROUGH scenario B. The hero arc: alone at the desk → the crew assembles one by one around him → Mentor AI arrives last as the emotional crescendo. A (3am) opens the proof stack; D (permissions) must appear early in the stack to disarm skepticism before it forms.

### 5.4 The Animation Script

**SCENE A — THE QUESTION (0.75)**
*"An analyst, a risk manager, a coach — all AI."* [ ‧ SURFACE 05 · AI AGENT MARKETPLACE ‧ ]

**SCENE B — THE BEFORE (1.0)**
The trader's silhouette at a desk, center — small in the frame, dwarfed by dark space (loneliness staged through scale — inverted from chapter 01's crowding; this time the emptiness is the antagonist). Around him, five job titles fade in as ghosted, hollow-outline name plates orbiting empty chairs: MACRO ANALYST · RISK OFFICER · PSYCHOLOGIST · JOURNALIST · EXECUTION DESK. Each plate flickers and stamps **UNFILLED**. A clock reads 3:04 AM. A question mark rises from the silhouette and dissolves unanswered into the dark.

**SCENE C — THE TRANSFORMATION (0.75)**
One by one — on an accelerating beat (800ms gap, then 600, 450, 350, 250 — assembly gathering momentum) — the empty plates IGNITE: each hollow outline fills with a distinct agent glyph and a colored signature aura (each agent gets ONE hue from an approved set; the crew reads as an ensemble of individuals, not clones). Each ignition emits one line of work product immediately: the risk agent's plate ignites and instantly prints "⚠ EUR exposure ×3 across positions"; the news agent prints "overnight: BOJ intervention chatter". They don't just arrive — they arrive WORKING. Last: a sixth plate descends center-stage, larger, bearing the verified badge from Feature 2: **MENTOR AI — trained on 214 live sessions of [Marcus ✓]**. Its ignition is the scene's peak flare.

**SCENE D — THE AFTER (1.0)**
The combined MORNING REPORT assembles — one document, six signatures: each paragraph typed in with its agent's glyph and hue in the margin (the visual grammar: many minds, one desk). Interactive beat: a mock Ask bar where the visitor picks a question ("What would Marcus say about this GBP setup?" / "Where is my hidden risk?" / "What did overnight change?") and watches the RIGHT agent light up and answer — routing made visible. Caption: *"You didn't get a chatbot. You got a staff."*

**SCENE E — THE PROOF STACK (1.25)**
1. *3am question, market moving, nobody awake* → *The specialist answers in 4 seconds — with its sources shown* (a chat bubble lights in darkness; source chips fan out beneath the answer)
2. *"What does this AI even see?"* → *Every agent is a contract: reads THIS, does THIS, built by [✓], rated 4.8 by 1,213 traders* (an agent card flips to its permissions face — scopes stamping ✓/✗ line by line)
3. *One mentor, 300 students, 2-day answer queue* → *His AI answers in his framework — and he reviews the digests* (Mentor AI bubble answers; a small "reviewed by Marcus ✓" receipt lands on it)
4. *Same generic tools for every trader* → *"Your DNA shows late-day breakout losses — this agent cut that 40% for traders like you"* (the Feature 4 helix cameos, one strand lights, an agent card slides in matched to it)

**SCENE F — THE DOOR (0.5)**
Number: **"5 roles filled. 1 desk."** CTAs: [ BUILD YOUR CREW ] · ← back.

### 5.5 Micro-interactions

- Card at rest: five tiny agent glyphs orbit the card's icon slowly — a crew in idle formation.
- Card hover: the glyphs snap from loose orbit into tight formation around the cursor position — the crew reports to YOU.
- Agent hue discipline: each agent's signature hue appears ONLY in its glyph and margin markers — never as full backgrounds (protects the page's 3-5 color law; the hues are accents at ≤10% coverage).

### 5.6 Copy Bank

- Header: **An analyst, a risk manager, a coach — all AI.**
- Alt: "Funds have a staff. Now you do."
- Mentor AI plate: "Trained on 214 live sessions. Reviewed by the human it learned from."
- Permissions line: "Every agent is a contract, not a black box."
- DNA-match line: "Hired like medicine, not merchandise."
- Door: "5 roles filled. 1 desk."

---

# FEATURE 6 — PORTFOLIO
## "What happens to me if BTC drops 30% tonight?"

### 6.1 The Psychological Role

Features 1–5 built the trader's MIND (workspace, people, decisions, self-knowledge, staff). Feature 6 pivots to his MONEY — and it must open with fear, because that is the honest emotion of every leveraged holder at 2am. The specific terror this feature owns: **you do not actually know what you hold, and you have never seen what a crash does to it — until the crash shows you.** The two product pillars: real connectivity (wallet connect + Hyperliquid integration — LIVE positions, not manual entry) and the **What If engine** — rehearsing the disaster before it happens.

Psychologically, What If sells because it converts anxiety into agency. Anxiety is diffuse ("crypto could crash…"); a scenario table is specific ("−30% costs you $18,400, concentrated in these two positions, here are three actions"). Specific fear is survivable fear. The visitor should end this chapter breathing SLOWER than he started it — measure the chapter against that.

### 6.2 The Full Scenario Bank

**Scenario A — The Storm Rehearsal (What If).**
BEFORE: BTC wobbles at 2am. He does frantic mental math across five venues, gets it wrong, panic-sells the wrong thing (the illiquid position instead of the levered one).
AFTER: he types "BTC −30%?" — the engine replays it against his ACTUAL holdings: per-position impact, total damage, liquidation proximities, correlation cascade (his SOL and his miners fall WITH BTC), and three ranked actions. The storm, rehearsed in a sunny room.
MECHANISM: fear → dress rehearsal. Rehearsed disasters lose their power.

**Scenario B — The Scattered Treasury (unified holdings via wallet + Hyperliquid).**
BEFORE: spot on two exchanges, a MetaMask he half-remembers, perps on Hyperliquid, some stables lending somewhere. "What do I own?" requires twenty minutes and four logins — so he never asks.
AFTER: connect wallet, connect Hyperliquid, connect exchanges (read-only) — one live table: everything, priced, weighted, updating. The perps positions stream in with their real leverage and liquidation prices. One glance = whole truth.
MECHANISM: the relief of assembly — the same convergence promise as Feature 1, applied to money.

**Scenario C — The Concentration Illusion (hidden overlap).**
BEFORE: he "feels diversified" — BTC, ETH, SOL, a miner stock, an exchange token. Feels like five bets.
AFTER: the correlation lens colors them by behavior: all five glow the same hue — 87% correlated. He holds ONE bet, five times, with five different names.
MECHANISM: the reveal — diversification is the most common self-deception in retail portfolios; showing it visually is a gut-punch no table achieves.

**Scenario D — The Forecast-Portfolio Bridge (community intelligence on YOUR holdings).**
BEFORE: his mentor published a SOL forecast yesterday; he holds SOL; those two facts never meet.
AFTER: verified forecasts from his Community (badge again) attach to his positions: the SOL row carries "2 active forecasts from mentors you follow — 1 bullish (▲ hit rate 71%), 1 cautious." His portfolio becomes a surface where the platform's intelligence lands.
MECHANISM: cross-feature magic — position data + verified human insight, only possible HERE.

**Scenario E — The Liquidation Sleepwalk (perps risk awareness).**
BEFORE: his Hyperliquid perp sits 9% from liquidation; he finds out when the notification is a funeral.
AFTER: liquidation proximity is a first-class column with escalating states; What If integrates it ("BTC −12% liquidates this position — before your −30% scenario even matures").
MECHANISM: the near-miss made visible — every perps trader has a liquidation scar; this row is for them.

### 6.3 The Hero Scenario

**Scenario A — The Storm Rehearsal**, entered THROUGH a compressed B (the connect moment is the hero's first act — watching real positions stream in from a wallet + Hyperliquid is itself a spectacle). C (the correlation reveal) is the proof stack's opener and its strongest item — arguably the most shareable single visual on the whole page.

### 6.4 The Animation Script

**SCENE A — THE QUESTION (0.75)**
*"What happens to me if BTC drops 30% tonight?"* — and uniquely for this chapter, the word "tonight" carries a faint red shimmer. Fear has a time of day. [ ‧ SURFACE 06 · PORTFOLIO ‧ ]

**SCENE B — THE BEFORE (1.0)**
2:07 AM on a phone screen: a BTC price cell flashing red −8.2%. Around it, five app icons scatter across the dark (two exchanges, MetaMask, Hyperliquid, a spreadsheet). Frantic sequence, staged as quick cuts: login screen → 2FA wheel spinning → wrong password shake → a spreadsheet with #REF! errors → a hand-drawn calculation on a napkin graphic that trails off into "???". The math never completes. A sell button gets hit on the WRONG app — a small position, the liquid one untouched. Caption, quiet: *"He sold the wrong thing. The math was never possible at 2am."*

**SCENE C — THE TRANSFORMATION (0.75)**
Daylight logic replaces night panic: a WALLET CONNECT ritual staged with ceremony — a wallet glyph and the ARCHIO core extend light-threads toward each other and CLASP (a handshake of light, 400ms, satisfying click-settle). Then Hyperliquid's connection: a stream of position rows physically FLOWS from a Hyperliquid-marked port into the table, each row landing with its real leverage chip and liquidation price. Then the exchanges. The scattered five app icons from scene B are pulled in and dissolve into rows. One table now holds everything — live, breathing (cells subtly tick with price updates). The treasury, assembled.

**SCENE D — THE AFTER (1.25 — extended for the What If run)**
The What If bar rises: the visitor (interactive) picks a scenario chip: [ BTC −30% ] [ FED +50bps ] [ SOL −50% ] [ DXY +3% ]. On selection: the table performs the CASCADE — a red wave sweeps left-to-right through the rows in correlation order (BTC first, then its correlated children in sequence — the visitor literally WATCHES contagion propagate, row by row, 90ms apart). Damage counters roll to their final states: per-position impact, TOTAL: −$18,400, two liquidation flags igniting. Then — the turn — three ACTION cards rise from beneath the wreckage: "Trim levered SOL −40% → total damage falls to −$11,100" / "Hedge via…" / "Set alert at…". Selecting one (interactive) re-runs the wave: visibly smaller. Caption: *"The storm, rehearsed. The damage, negotiable."*

**SCENE E — THE PROOF STACK (1.25)**
1. *"I'm diversified — five different assets"* → *The lens: all five glow one color. One bet, five names, 87% correlated* (five distinct chips drift together and tint to a single hue — hold the reveal a full beat; it's the page's best gut-punch)
2. *Four logins to answer "what do I own?"* → *One living table: wallet + Hyperliquid + exchanges, read-only, real-time* (the clasp-handshake replays in miniature)
3. *Liquidation discovered by funeral notification* → *Proximity is a column. "−12% liquidates this" is knowable NOW* (a liquidation bar fills toward a threshold, then an alert chip catches it early)
4. *Mentor's SOL forecast and your SOL bags, never meeting* → *Verified forecasts land ON your positions* (a forecast card with ✓ badge docks onto a position row)

**SCENE F — THE DOOR (0.5)**
Number: **"−$18,400 → −$11,100. The rehearsal paid."** CTAs: [ CONNECT & RUN YOUR FIRST WHAT IF ] · ← back.

### 6.5 Micro-interactions

- Card at rest: a miniature red cascade sweeps a tiny 5-row table every 8s, then resolves green — the What If loop as an idle animation.
- Card hover: the question's "30%" counts to a random new number (25%, 40%, 12%) — every disaster is askable.
- The cascade wave is this chapter's signature motion: build it once, parametrized by scenario — the live product should ship the SAME animation (landing page as product rehearsal — visitors who signed up will recognize the wave; recognition = continuity = trust).

### 6.6 Copy Bank

- Header: **What happens to me if BTC drops 30% tonight?**
- Alt: "Rehearse the storm in a sunny room."
- Connect line: "Your wallet. Your Hyperliquid. Read-only. One table."
- Correlation reveal: "One bet, five names."
- Action caption: "The damage is negotiable — before, not after."
- Door: "The rehearsal paid."

---

# FEATURE 7 — NET WORTH
## "I trade every day. I still don't know what I'm worth."

### 7.1 The Psychological Role

Portfolio (6) answered "what do my POSITIONS do in a storm?" — Net Worth zooms all the way out: **the whole life.** Trading account, savings, crypto wallets, the credit card debt he doesn't look at, the salary paid partly in crypto. This is the most ADULT chapter on the page — its emotional register is not fear or ambition but the quiet dread of financial self-ignorance, and its resolution is not excitement but PEACE. Design temperature: the calmest chapter of the nine. Slowest motion, widest spacing, most stillness. After the Portfolio storm, this is the harbor.

Two psychological payloads carry it: the **single number** (a human seeing their true net worth for the first time is a genuine life moment — many people have literally never seen it) and the **Exposure Map** — the revelation that his job, his savings, his portfolio, and his side income are secretly ONE correlated bet. The Exposure Map is the intellectual peak of the whole page: it applies Feature 6's correlation lens to an entire LIFE.

### 7.2 The Full Scenario Bank

**Scenario A — The Number That Doesn't Exist (unified worth).**
BEFORE: assets in seven places, debt in two, and the honest answer to "what are you worth?" is a shrug with anxiety attached. He feels rich on green days and broke on red days — mood, not math.
AFTER: one screen, one number — TOTAL — decomposed beneath into liquid / invested / illiquid / debt. The number updates live. Mood is replaced by math.
MECHANISM: the first-time-seen moment — a genuine threshold experience the design must honor with ceremony.

**Scenario B — The Hidden Monolith (Exposure Map).**
BEFORE: he holds BTC, a BTC ETF in his retirement account, MSTR stock, works at a crypto company (salary + equity), and his emergency fund is 40% stables. He believes he has a diversified life.
AFTER: the Exposure Map colors his ENTIRE life by underlying driver: 78% of his existence — salary, equity, savings, portfolio — glows the same color: crypto beta. One bear market hits his income, his savings, his investments, and his job security SIMULTANEOUSLY. Now he can actually fix it.
MECHANISM: the life-level reveal — the most consequential single insight the platform offers anyone.

**Scenario C — The Runway (survival math).**
BEFORE: "could I survive six months without income?" — he has never done the math because he's afraid of the answer.
AFTER: RUNWAY: "14 months at current burn. 9 if the market drops 30% (linked to Feature 6's What If)." The scariest question, answered in a chip.
MECHANISM: dread → number. Numbers end dread, even when they're bad — especially when they're bad.

**Scenario D — The Debt Blind Spot (the whole truth).**
BEFORE: his mental net worth conveniently omits the card balance and the loan — self-deception by omission.
AFTER: debt is a first-class column, netted against assets, with its cost visible ("this balance costs you $340/month — more than your average weekly trading profit"). Honest accounting, gently delivered.
MECHANISM: the gentle confrontation — the system states, never scolds.

**Scenario E — Trading in Proportion (context for the whole platform).**
BEFORE: a −$2,000 week feels like dying; he can't place it against his life.
AFTER: trading P&L rendered as a proportion of net worth: "this week: −1.1% of your total." Perspective as a feature — and it feeds BACK into Trading DNA's Mind Check ("your sizing is 4× your stated risk tolerance relative to net worth").
MECHANISM: proportion is emotional regulation — the platform literally calms its user with arithmetic.

### 7.3 The Hero Scenario

**Scenario B — The Hidden Monolith (Exposure Map).** Scenario A (the single number) is the hero's OPENING BEAT — the number assembles first, delivers its moment, and THEN the map colorizes it into the reveal. A alone is a balance app (commodity); B is a revelation no consumer product delivers. C (runway) opens the proof stack.

### 7.4 The Animation Script

**SCENE A — THE QUESTION (0.75)**
*"I trade every day. I still don't know what I'm worth."* [ ‧ SURFACE 07 · NET WORTH ‧ ]

**SCENE B — THE BEFORE (1.0)**
Seven account tiles scattered in dark space, each showing only a fragment: "Chase ••••4821: $—", "MetaMask: 3.2 ETH", "Retirement: locked until 2049", "Visa: −$4,2…". Between them, a calculator graphic attempts addition — its display fills with mixed units ("$12,400 + 3.2 ETH + ??? − $4,2…") and outputs: **"?"**. The tiles drift slowly APART (entropy — the un-assembled life). A mirror-dim silhouette watches. Caption: *"The most important number in his life has never been computed."*

**SCENE C — THE TRANSFORMATION (0.75)**
The convergence force catches the seven tiles — they fly to center and stack into a single column, each SNAPPING into place with an accountant's decisiveness (crisp 120ms settles, no wobble — this chapter's motion is precise, not dramatic). As each docks, its fragment-value normalizes to dollars and ADDS to a large central counter that rolls upward. Debt tiles dock LAST and the counter visibly SUBTRACTS — the number dips (honesty staged in motion; do not hide the dip, it is the trust moment) — then settles on the final figure. A thin gold rule draws beneath it. THE NUMBER, for the first time. Hold 900ms of total stillness.

**SCENE D — THE AFTER (1.25 — extended for the map reveal)**
The number decomposes downward into four clean bands: LIQUID · INVESTED · ILLIQUID · DEBT. Then the caption: *"Now — what is it MADE of?"* — and the EXPOSURE MAP colorizes: every band's segments tint by underlying driver, and 78% of the entire structure slowly tints to ONE hue. Labels fade in on the monolith: salary (crypto company) · equity comp · BTC · BTC ETF · MSTR · stables. One line, typed: *"You are one trade. You just didn't know it."* Then agency: an interactive slider ("shift 15% to uncorrelated") re-colors the map live, the monolith visibly shrinking to 55%. RUNWAY chip and proportion chips dock at the bottom.

**SCENE E — THE PROOF STACK (1.25)**
1. *"Could I survive 6 months?" — never dared compute* → *Runway: 14 months. 9 in a −30% world.* (a horizontal runway bar draws, then a storm-variant draws beneath it)
2. *Mental net worth, conveniently debt-free* → *Debt netted, its cost visible: "$340/month — more than your weekly edge"* (a debt row docks; its monthly-cost chip pulses once)
3. *−$2,000 week = existential crisis* → *"This week: −1.1% of you."* (a huge red −$2,000 scales down into a small calm chip)
4. *Your sizing vs your LIFE: never connected* → *DNA reads Net Worth: "position size = 4× your real risk tolerance"* (the Feature 4 helix cameos again, one strand tinting to match the monolith hue — three features shaking hands in one image)

**SCENE F — THE DOOR (0.5)**
Number: **"One number. Finally."** CTAs: [ COMPUTE YOURS ] · ← back.

### 7.5 Micro-interactions

- Card at rest: a counter on the card slowly rolls through digits, never settling — the uncomputed number, itching.
- Card hover: the digits SNAP to a crisp figure — computation as the hover reward.
- The Exposure Map hue must be reused from Feature 6's correlation lens (SAME hue = same concept, page-wide vocabulary consistency).

### 7.6 Copy Bank

- Header: **I trade every day. I still don't know what I'm worth.**
- Alt: "The most important number you've never seen."
- Monolith line: "You are one trade. You just didn't know it."
- Runway: "The scariest question, answered in a chip."
- Proportion: "−$2,000 feels like dying. It's −1.1% of you."
- Door: "One number. Finally."

---

# FEATURE 8 — AI VERIFIED TRACK RECORD
## "Everyone claims. Here, everything is recorded, verified, and proven."

### 8.1 The Psychological Role

This is the KEYSTONE chapter — the one the platform is named for, and deliberately placed at 8, not earlier: by now the visitor has seen forecasts locked (3), identities verified (2), and everything remembered (1). Feature 8 reveals that all of it was quietly building toward one thing: **a record that cannot lie.** The design brief in one sentence: this chapter should feel like walking into the VAULT of the platform — where everything that happened is kept, sealed, and provable.

The wound is industry-wide and personal: an entire education economy runs on unverifiable claims — rented Lamborghinis, cropped screenshots, "94% win rate" with no receipts. Every visitor has paid a tax to a fraud, in money or in hope. The promise: on ARCHIO, claims are structurally impossible — not policed, IMPOSSIBLE. Forecasts lock before outcomes. Identity is KYC-bound (the seal from Feature 2). Results are scored by AI, not self-reported. Records are append-only — even the owner cannot edit history. Security and KYC live here as first-class content, per the platform's canon: everything recorded, everything provided, security, KYC.

Tone: this chapter is JUSTICE. The before should make the visitor angry (carefully — anger at the industry, channeled); the after should feel like a courtroom where the evidence finally speaks.

### 8.2 The Full Scenario Bank

**Scenario A — The Lamborghini Problem (unverifiable gurus).**
BEFORE: an account with 400K followers posts a P&L screenshot (croppable, photoshoppable, demo-account-able) over a rented supercar. $199/month. Three months later: he was trading a demo. There was no way to know. There is NEVER a way to know.
AFTER: on ARCHIO, "show me your record" is a LINK: every forecast timestamped before its outcome, every result AI-scored, hit rate computed — not claimed. The question that ends every fraud: "why isn't your record on here?"
MECHANISM: the industry's rage-wound. Every burned student converts on this screen.

**Scenario B — The Cropped Screenshot (self-reporting).**
BEFORE: even honest traders self-report selectively — winners screenshotted, losers forgotten. Everyone's public history is a highlight reel; nobody's is a record.
AFTER: the record is append-only and complete BY CONSTRUCTION: a forecast, once locked, lands in the record whether it hits or misses. The owner cannot delete a miss. Completeness is not a policy — it's physics.
MECHANISM: "even the owner can't edit it" — the single most trust-generating sentence on the page.

**Scenario C — The Identity Under the Record (KYC + security).**
BEFORE: a track record attached to an anonymous handle is worthless — burn the account, start fresh, scam again.
AFTER: every record is bound to ONE KYC-verified human (the Feature 2 seal, now shown from its serious side): passport-verified, scam-pattern-screened, one identity forever. Data encrypted, access permissioned by the trader (public / followers / private), read-only connections throughout. The record is a legal-grade artifact.
MECHANISM: closing Feature 2's open loop — the badge the visitor has seen on every mentor since chapter 2 finally shows its machinery.

**Scenario D — The AI Auditor (how scoring works).**
BEFORE: "verified by whom, exactly?" — every prior "verification" service is a paid rubber stamp.
AFTER: the AI auditor is shown WORKING: it reads the locked forecast ("EUR/USD → 1.0950 by Friday, invalid above 1.0870"), reads the market data that followed, and rules: HIT +42 pips / MISS / INVALIDATED — with its reasoning line visible. No human grading, no payment for grades, no appeal to vanity.
MECHANISM: showing the referee's eyes — audit as a live process, not a badge.

**Scenario E — Reputation as Currency (what the record UNLOCKS).**
BEFORE: reputation in this industry = follower count, i.e., marketing budget.
AFTER: the record IS the reputation: mentors ranked by audited consistency (never engagement), students choose rooms by verified hit rates, and a young unknown trader with a real 68% record outranks a 400K-follower phantom. Merit, made liquid. (This is the bridge INTO Feature 9 — the record becomes social capital.)
MECHANISM: the meritocracy fantasy — every skilled-but-unknown trader's deepest wish.

### 8.3 The Hero Scenario

**Scenario A entered through D** — the guru's unverifiable claim, contrasted against the AI auditor scoring a real forecast live. The hero must show the MACHINE working (lock → outcome → AI verdict → record update) because the machinery is the argument. B ("even the owner can't edit it") is the proof stack's opener and the page's single strongest trust line. C (KYC/security) gets the stack's extended slot — per the canon, security and KYC are first-class content here.

### 8.4 The Animation Script

**SCENE A — THE QUESTION (0.75)**
*"Everyone claims. Here, everything is recorded, verified, and proven."* — the only header that is a STATEMENT, not a question or confession. By feature 8 the page has earned declarative confidence. [ ‧ SURFACE 08 · AI VERIFIED TRACK RECORD ‧ ]

**SCENE B — THE BEFORE (1.0)**
A social-media post assembles: supercar photo, a P&L screenshot ("+$847,203"), the caption "DM me to learn 🚀", follower count rolling to 400K. As the visitor scrolls, the FORENSIC LIGHT (a cold, clinical scan-beam — new asset, this chapter only) passes over the post: under it, the screenshot's crop-marks become visible, the P&L's font mismatches flag, the account's join date ("3 months ago") surfaces, and the car watermark resolves: "RENTAL — Miami Exotics." The post degrades into its evidence. Then the devastating beat: a counter beneath — "students paying $199/month: 2,847" — and a receipt-stack visual piling up. Caption: *"There was never a way to check. That was the business model."*

**SCENE C — THE TRANSFORMATION (0.75)**
Hard cut to the machine: a real forecast card (recognizable from Feature 3 — same component) slides center. The LOCK closes on it — same lock asset as Feature 3, now full-screen scale, its click-flash the chapter's opening thunder. A timestamp burns in: "LOCKED · TUE 09:14:02 UTC — before outcome." Time passes (a price-line draws across the background, days compressing to seconds). The AI AUDITOR wakes: a scanning presence reads the locked card, reads the price line, and its reasoning types in a margin: "target 1.0950 reached Thursday 14:20 → within window → HIT +42 pips." The verdict STAMPS onto the card (the Feature 2 seal-press motion, reused — same weight, same 2px shake). The card then FLIES into a wall — 

**SCENE D — THE AFTER (1.25 — extended)**
— and the wall is revealed: THE RECORD. A monumental append-only ledger receding into depth — hundreds of sealed forecast cards in strict chronological rows, hits glowing warm, misses glowing cool, NONE missing, NONE editable. Above it, the identity plate: [Marcus Chen ✓ KYC] · 214 forecasts · 68% hit rate · auditor: ARCHIO AI · record: append-only. Interactive beat: the visitor scrubs a timeline slider — the wall scrolls through months; hovering any card flips it to show its lock timestamp + the AI's reasoning line. One card is conspicuously a MISS — hovering it shows it graded with the same dispassion. (Show a miss prominently. A perfect record reads fake; an honest one converts.) Closing line types: *"Even he can't edit this. That's the point."*

**SCENE E — THE PROOF STACK (1.5 — extended, keystone chapter)**
1. *Highlight-reel histories, losers deleted* → *Append-only. The owner cannot delete a miss.* (a cursor tries to drag a miss-card off the wall — the card refuses, snaps back, flashes its seal)
2. **THE SECURITY & KYC MINI-DRAMATIZATION (extended slot):** *An anonymous handle burns its record and starts fresh* → the Feature 2 shell game CALLBACK plays at miniature scale, then: one identity plate, passport-glyph verifying, binding to the record wall with a drawn chain-of-light; beneath it three permission states cycle (PUBLIC / FOLLOWERS / PRIVATE) showing the trader controls visibility, and a read-only + encryption chip row stamps in. Line: *"One human. One record. His to show — never to edit."*
3. *"Verified" by services that sell verification* → *The auditor is an AI with its reasoning shown — ungrateful, unbribable* (an auditor reasoning-line types beside a verdict)
4. *Reputation = follower count* → *A 22-year-old with a real 68% outranks a 400K phantom* (two profile cards: the phantom's follower count deflates as its record shows EMPTY; the unknown's record wall glows behind them)

**SCENE F — THE DOOR (0.5)**
Number: **"214 forecasts. 0 edits. 1 human."** CTAs: [ START YOUR RECORD ] · ← back.

### 8.5 Micro-interactions

- Card at rest: a tiny lock closes and a card docks into a miniature wall, every 6s — the record, always growing.
- Card hover: the card's seal glints with the forensic-light sweep — scrutiny as an aesthetic.
- The record wall must be built as a real component — it reappears in Feature 9 (behind profiles) and should ship in the product identically. This is the platform's most sacred visual: version it, protect it, never let a marketing variant diverge from the product's.

### 8.6 Copy Bank

- Header: **Everyone claims. Here, everything is recorded, verified, and proven.**
- Alt: "The end of 'trust me.'"
- Lock line: "Locked before the outcome. Scored by a machine that can't be flattered."
- Append-only line: "Even he can't edit this. That's the point."
- KYC line: "One human. One record. His to show — never to edit."
- Door: "214 forecasts. 0 edits. 1 human."

---

# FEATURE 9 — SOCIAL NETWORK
## "A feed for money — not for likes."

### 9.1 The Psychological Role

The finale. Everything converges here: the verified identity (2, 8), the locked forecasts (3), the living charts, the record wall — and the page's last psychological move is to flip the visitor's role: for eight chapters he has been a CONSUMER of the platform's order; feature 9 shows him as a CITIZEN of it — posting, being measured, mattering. The closing emotion of the entire film: *"my work here would COUNT."*

The wound: financial social media is an outrage casino — engagement-ranked noise, anonymous confidence, screenshots of wins, algorithmic rage. The resolution is NOT "a nicer Twitter" — it is a feed where **every voice carries its receipts**: the hit rate sits beside the handle, charts in posts are alive, discussions can be compressed (Catch Me Up's sibling), and the ranking currency is audited consistency, not likes. And the structural finale: the LOOP — your record (8) becomes your gravity here (9), which attracts the next trader's search (2). The page ends by showing its own flywheel turning.

### 9.2 The Full Scenario Bank

**Scenario A — The Receipts Feed (verified voices).**
BEFORE: an anonymous account screams "EUR/USD TO 1.12, GUARANTEED" — 40K likes. Another posts careful analysis — 12 likes. The feed rewards volume, not accuracy; the visitor cannot tell noise from signal, ever.
AFTER: every post carries its author's live plate: [handle ✓ · 61% on 130 forecasts]. The screamer's plate reads [unverified · no record]. The same feed, made legible — signal and noise, labeled at last.
MECHANISM: instant legibility — the feed equivalent of nutrition labels.

**Scenario B — The Living Chart (posts you can trade from).**
BEFORE: a chart in a post is a dead pixel screenshot — to act on it you rebuild it manually in another app.
AFTER: charts in posts are ALIVE: open it, scrub it, and one tap converts the author's setup into YOUR forecast on YOUR Decision Desk — with attribution ("built from @marcus's post") flowing into both records.
MECHANISM: the feed as a working surface — content that becomes action without leaving the page.

**Scenario C — The Thread Compressor (discussion synthesis).**
BEFORE: a great question spawns 300 replies; the wisdom is in there, unfindable, drowned by reply-guys.
AFTER: SUMMARIZE DISCUSSION — the thread compresses into: consensus view, strongest dissent (with the dissenter's hit rate — dissent from a 71% record MATTERS), and open questions. Catch Me Up's DNA, applied to text.
MECHANISM: the pattern the visitor already loves (Feature 2), returning in a new home — vocabulary payoff.

**Scenario D — The Verified Company (institutions on the record).**
BEFORE: company/fund accounts post marketing; their claims are as unverifiable as the gurus'.
AFTER: companies hold verified profiles with their OWN records — a prop firm's payout claims audited, a signal service's actual performance on the wall behind their posts. Institutions submit to the same physics as individuals.
MECHANISM: no one above the law — the record's universality is its majesty.

**Scenario E — The Flywheel (the loop made visible).**
BEFORE: on legacy platforms, years of posting builds… followers of an anonymous mask, transferable nowhere.
AFTER: every forecast, call, and verified interaction compounds ONE portable identity: his record wall stands behind his profile; students find him the way HE found his mentor in chapter 2. The last shot of the page: a new trader's cursor hovering HIS profile.
MECHANISM: the mirror-flip — the visitor sees himself on the OTHER side of the page he's been scrolling.

### 9.3 The Hero Scenario

**Scenario A — The Receipts Feed**, with E (the flywheel) as the FINALE BEAT after the proof stack — unique to this chapter, because E is the closing shot of the entire nine-feature film, not a mere scenario. B (living charts) leads the stack as the "touch it" demo.

### 9.4 The Animation Script

**SCENE A — THE QUESTION (0.75)**
*"A feed for money — not for likes."* [ ‧ SURFACE 09 · SOCIAL NETWORK ‧ ]

**SCENE B — THE BEFORE (1.0)**
An infinite doom-scroll, staged as a vertical torrent: posts blur past — "GUARANTEED 🚀🚀", a lambo, "if you're not in THIS coin you hate money", rage-quote-tweets, a genuinely thoughtful analysis post flashing by UNDER-lit and instantly buried. Like-counters spin like slot machines (the casino is the metaphor — let the counters LOOK like slots for 2 beats). The scroll accelerates until posts are pure noise-streaks. A heartbeat-thud visual pulse syncs to the notification badges. Caption: *"Ranked by outrage. Powered by anonymity. Costing you money."*

**SCENE C — THE TRANSFORMATION (0.75)**
The torrent FREEZES mid-scroll. The forensic light from Feature 8 (asset reuse — the page's instruments are recurring characters now) sweeps DOWN the frozen feed once: every post's author resolves to a plate — ✓ plates with hit rates igniting warm; [no record] plates dimming to gray and physically SINKING back in depth (not deleted — DEPRIORITIZED; the honest mechanic, honestly staged). The feed re-sorts itself in one graceful cascade: receipts rise, noise recedes. The slot-machine like-counters flip into small consistency scores.

**SCENE D — THE AFTER (1.0)**
The living feed: a post from [chen_fx ✓ 61% · 130] with an EMBEDDED LIVE CHART — the visitor (interactive) scrubs the chart inside the post, hovers the author's plate (a mini record-wall tooltip: Feature 8's component at card scale), and taps "→ MAKE THIS MY FORECAST": the setup card flies OFF the feed toward a Decision Desk dock at screen edge, leaving an attribution thread ("built from @chen_fx"). A reply-thread beneath shows SUMMARIZE DISCUSSION compressing 300 replies into consensus / dissent (with the dissenter's 71% plate glowing — accuracy gives dissent weight) / open questions.

**SCENE E — THE PROOF STACK (1.0)**
1. *Charts as dead screenshots* → *Charts you can scrub, and claim into your own Desk* (the fly-off-to-desk replays in miniature)
2. *300 replies, wisdom drowned* → *Consensus · weighted dissent · open questions, in one press* (a thread accordion-collapses into three clean cards)
3. *Company accounts posting unverifiable marketing* → *Institutions on the record: a prop firm's payout claims, audited, on the wall behind their posts* (a company profile with the record wall behind it — Feature 8's component again)
4. *Years of posting builds… an anonymous mask* → *Every interaction compounds one portable, verified identity* (scattered post-glyphs stream INTO a profile plate, its record wall growing behind it)

**SCENE F — THE FINALE (1.0 — replaces the standard Door; this is the page's closing shot)**
The camera pulls back from the visitor's own (mock) profile — record wall glowing behind it, plate reading [you ✓ · your record begins today] — and keeps pulling back until the profile becomes one card in the 3×3 grid... which is the SAME 3×3 grid the visitor started at, now seen from the other side: and a NEW cursor (not the visitor's — a stranger's, entering from screen-left exactly as the visitor's once did) drifts across the grid and hovers... the visitor's profile. Hold. One line types, the last of the film: *"Someone is about to find you the way you found this page."* Then the door: [ BEGIN YOUR RECORD ] · beneath it, dimmer: [ ← the map ].
(Design note: this finale is the emotional signature of the whole site. Storyboard it FIRST, build it LAST, cut it never.)

### 9.5 Micro-interactions

- Card at rest: a miniature feed slow-scrolls on the card; every few seconds one post's ✓ plate glints.
- Card hover: the mini-feed re-sorts — receipts rising — the whole chapter in 400ms.
- The stranger-cursor in the finale must move with HUMAN easing (slight overshoot, micro-corrections, a hesitation before the hover) — an obviously scripted cursor kills the moment. Motion-capture a real hand on a real trackpad if needed.

### 9.6 Copy Bank

- Header: **A feed for money — not for likes.**
- Alt: "Where accuracy outranks volume."
- Sort line: "Receipts rise. Noise recedes."
- Dissent line: "Disagreement from a 71% record is worth hearing."
- Finale: "Someone is about to find you the way you found this page."
- Door: "Begin your record."

---

# PART 10 — THE GLOBAL HANDOFF SHEET (print this page)

## The Ten Commandments of the Nine Surfaces

1. **One screen, one transformation.** The hero converts the heart; the proof stack converts the head. Never two before/afters in one viewport.
2. **The 6-scene skeleton is law**: Question → Before → Transformation → After → Proof Stack → Door. Only Feature 9 amends it (Finale replaces Door).
3. **Motion IS meaning**: Before = scattered/desynchronized · Transformation = convergence (cubic-bezier(0.16,1,0.3,1)) · After = synchronized breathing · Stack = metronomic beat.
4. **Shared assets are sacred**: the LOCK (3→8), the SEAL (2→8→9), the RECORD WALL (8→9), the FORENSIC LIGHT (8→9), the HELIX (4→5→7), the correlation HUE (6→7), the convergence BEAM (loader→1→2). Build once, reuse exactly — the page's trust architecture depends on visual vocabulary staying consistent.
5. **Every After scene has at least one touchable element.** Watched software entertains; touched software converts.
6. **Show a miss.** (8's record wall, 4's profile flaws, 7's debt dip.) Perfection reads fake; audited imperfection reads TRUE.
7. **No shame, ever.** The enemy is always the pattern/industry/fragmentation — never the visitor. Copy that scolds is copy that's cut.
8. **The questions are first-person confessions** (except 8, the lone statement — earned declarative confidence at the keystone).
9. **Real numbers only**, small and honest: "−4.2R average", "214 forecasts", "0 edits". Invented big numbers destroy the skeptic; small true ones convert him.
10. **The last frame of 9 rhymes with the first frame of 2.** The flywheel must be VISIBLE. The page is a loop because the product is a loop.

## Per-feature emotional temperature map (for art direction)

| # | Feature | Before-emotion | After-emotion | Motion temperature |
|---|---|---|---|---|
| 1 | Flight Deck | scattered exhaustion | being KNOWN | medium, converging |
| 2 | Community | FOMO + fraud fear | belonging, safety | warm, human, lively |
| 3 | Decision Desk | shame (vapor trades) | relief, clarity | precise, mechanical |
| 4 | Trading DNA | self-betrayal | seen + protected | slow, intimate, close |
| 5 | AI Marketplace | loneliness at 3am | staffed, powerful | energetic, ascending |
| 6 | Portfolio | 2am panic | rehearsed, ready | storm then calm |
| 7 | Net Worth | adult dread | peace, proportion | stillest of all nine |
| 8 | Track Record | industry rage | justice, permanence | monumental, heavy |
| 9 | Social Network | noise fatigue | mattering, legacy | flowing, then the pull-back |

## The build order recommendation

Ship the stories in this order (matching MVP reality): **1 Flight Deck → 3 Decision Desk → 2 Community → 8 Track Record** get full interactive stories at launch (these four are real product today). Features 4, 5, 6, 7, 9 launch with Question + Before + Transformation + a static After frame + waitlist door ("IN ORBIT — arriving") — full stories added as each ships. A beautiful story ending in vapor kills trust; a visible roadmap builds it.

*— End of document. Version 1.0, July 2026. The canon lives in the ARCHIO MVP Verdict; this document is its cinematic expansion.*
