# ARCHIOAI / AIPILOT -- COMPLETE PLATFORM TRAINING GUIDE
# FOR NEW TEAM MEMBERS

> Read this entire document from top to bottom before you touch any code.
> This is not a code reference. This is a guide to understanding what this
> platform is, what every screen does, how a trader uses it, and where you
> fit in. By the end, you will understand trading well enough to build
> features that actually make sense for real users.

---

## PART 1: UNDERSTANDING THE WORLD THIS PLATFORM LIVES IN

Before you can build anything useful, you need to understand trading.
Not deeply -- you do not need to become a trader. But you need to understand
why a trader would open this app, what they are trying to accomplish, and
what problems keep them up at night. Everything we build solves one of
those problems.

### What Is Trading?

Trading is buying and selling financial instruments to profit from price
movements. A "financial instrument" is anything with a price that changes:
currencies, stocks, gold, Bitcoin, oil, bonds.

The simplest example: You buy 1 Euro for 1.08 US Dollars. The price goes
up to 1.09. You sell your Euro and pocket the 1 cent difference. Now
multiply that by 100,000 units (a standard "lot" in forex) and that 1 cent
becomes $1,000 profit. That is what traders do, hundreds of times per month.

The catch? Price can also go against you. If it drops to 1.07 and you sell,
you just lost $1,000. Trading is about finding moments where the odds are
in your favor and managing risk so the losses stay small.

### The Markets We Cover

Our platform covers four main markets:

**Forex (Foreign Exchange)** -- The largest financial market in the world.
Traders buy and sell currency pairs. When you see "EUR/USD" it means
"Euro versus US Dollar." The first currency is what you are buying, the
second is what you are paying with. Other common pairs: GBP/JPY (British
Pound vs Japanese Yen), AUD/CAD (Australian Dollar vs Canadian Dollar).
Forex trades 24 hours a day, 5 days a week.

**Crypto** -- Digital currencies like Bitcoin (BTC), Ethereum (ETH), and
Solana (SOL). These trade 24/7 including weekends. They are extremely
volatile -- prices can move 10% in a single day. Crypto pairs are usually
quoted against USD: BTC/USD, ETH/USD.

**Stocks / Indices** -- Shares of companies (Apple, Tesla, Amazon) or
baskets of companies (S&P 500, Nasdaq, Dow Jones). An "index" like the
S&P 500 tracks the average price of 500 large companies. Traders can
trade these without owning the actual shares through instruments called
CFDs (Contracts for Difference).

**Commodities / Metals** -- Physical goods: Gold (XAU/USD), Silver
(XAG/USD), Oil (USOIL), Natural Gas. Gold is especially popular because
it tends to go up when the economy looks bad -- traders use it as a
"safe haven."

### Key Trading Concepts You Will See Everywhere

**Pip** -- The smallest standard price movement. For EUR/USD, 1 pip =
0.0001. If price moves from 1.0800 to 1.0850, that is 50 pips. Traders
measure everything in pips because it normalizes gains/losses across
different instruments.

**Lot Size** -- How much you are trading. 1 standard lot = 100,000 units.
1 mini lot = 10,000 units. 1 micro lot = 1,000 units. Bigger lot =
bigger profit OR bigger loss. This is why risk management is critical.

**Stop Loss (SL)** -- A price level where you automatically exit a losing
trade. If you buy EUR/USD at 1.0850, you might set your stop loss at
1.0820. If price drops to 1.0820, you exit automatically and lose 30 pips.
Without a stop loss, a trader can lose their entire account.

**Take Profit (TP)** -- A price level where you automatically exit a
winning trade. If your target is 1.0900, you set TP there. When price
hits 1.0900, you exit with 50 pips profit.

**Risk-to-Reward Ratio (R:R)** -- The ratio between how much you risk
and how much you aim to gain. If you risk 30 pips (SL) to gain 60 pips
(TP), your R:R is 1:2. Professional traders typically aim for at least
1:2 or 1:3. This means even if you lose half your trades, you still
make money because your winners are bigger than your losers.

**R-Multiple** -- How many "R" a trade made. If you risked $100 (that
is 1R) and made $250 profit, that trade made 2.5R. If you lost $100,
that trade was -1R. Traders track their average R-multiple to measure
performance. Above 1R average = profitable system.

**Win Rate** -- The percentage of trades that are winners. A 55% win rate
means 55 out of 100 trades were profitable. Important: win rate alone
does not determine profitability. A trader with 40% win rate but 1:3 R:R
makes more money than a trader with 70% win rate but 1:0.5 R:R.

**Confluence** -- When multiple independent signals point in the same
direction. Think of it like evidence in a court case. One piece of evidence
is not enough to convict. But if the fingerprints match AND there is video
AND three witnesses -- that is a confluence. In trading: if price is at a
support level AND there is bullish momentum AND the session timing is right
AND the fundamentals support the move -- that is 4 confluences. Our platform
helps traders find and track these. More confluences = higher probability.

**Killzones / Sessions** -- The forex market is open 24 hours, but price
does not move equally throughout the day. There are specific windows when
the big institutions (banks, hedge funds) are active and price makes its
biggest moves. These windows are called "killzones" because they are where
the best trading opportunities "kill it":

- **Asia Session** (roughly 11pm-4am UTC) -- Usually quiet. Price builds
  a range. Smart traders watch this range and plan their London trades
  around it.
- **London Open Killzone** (7am-10am UTC) -- This is where the real
  action begins. London is the world's largest forex center. Price often
  breaks out of the Asian range here. This is where most professional
  traders take their trades.
- **New York Killzone** (1pm-4pm UTC) -- The second wave. New York
  overlaps with London, creating the highest volume period of the day.
  Price can continue the London move or reverse it.
- **London Close** (3pm-4pm UTC) -- A smaller window where price often
  reverses the day's move. Some traders specialize in trading this reversal.

Our platform tracks which session is active and adjusts its AI advice
accordingly. If a trader is looking at charts at 2am during the Asia
session, the AI will say "Wait for London" rather than "Go ahead and trade."

**Order Block** -- A price level where large institutions (banks, hedge
funds) placed big orders. These levels tend to act as support/resistance
because the institution still has interest there. On a chart, it looks
like a candle where price turned sharply. Traders mark these and wait
for price to return to them.

**Fair Value Gap (FVG)** -- A gap in price created when the market moved
too fast. Imagine three candles: the first candle's high is at 1.0800,
the third candle's low is at 1.0810. There is a "gap" between 1.0800
and 1.0810 that price skipped over. Markets tend to come back and "fill"
these gaps before continuing. Traders use FVGs as potential entry points.

**Liquidity** -- In trading, liquidity refers to where stop losses are
clustering. If many traders have their stop loss at 1.0750, there is
"liquidity" at that level. Big institutions often push price to these
levels to trigger the stop losses (called a "liquidity sweep" or "stop
hunt") before reversing. Understanding liquidity helps traders avoid
getting stopped out and instead enter where institutions enter.

**Market Structure** -- The pattern of highs and lows that price makes.
If price is making "higher highs" and "higher lows," the structure is
bullish (uptrend). If price is making "lower highs" and "lower lows,"
the structure is bearish (downtrend). A "break of structure" (BOS)
happens when a key high or low is broken, signaling a potential trend
change.

**Bias** -- A trader's directional opinion for the day. "My bias on
EUR/USD is bullish" means "I believe price will go up today, so I am
only looking for buy opportunities." Having a clear bias prevents a
trader from randomly taking trades in both directions.

### Why Psychology Matters So Much

Here is something that surprises non-traders: the biggest reason traders
fail is not bad analysis. It is bad psychology. A trader can have a
perfect strategy that works 60% of the time, but if they panic and exit
winners too early, revenge-trade after a loss, or double their position
size out of greed -- they will still blow their account.

The most common psychological traps:

**FOMO (Fear Of Missing Out)** -- Seeing price move without you and
jumping in late because you cannot stand "missing" the move. The trader
enters at a bad price, gets a bad risk-to-reward, and usually loses.

**Revenge Trading** -- After a loss, immediately taking another trade
to "make it back." This trade is usually impulsive, poorly analyzed,
and leads to another loss. The cycle repeats until the account is
destroyed.

**Overconfidence** -- After a winning streak, the trader starts taking
larger positions, skipping their checklist, and breaking rules because
they feel invincible. The market humbles them with a big loss.

**Tilt** -- A state of emotional instability (borrowed from poker
terminology) where the trader has lost control. They are making rapid,
emotional decisions instead of calculated ones. Our platform detects
tilt by monitoring trade frequency, position size changes, and
rule violations after losses.

**Overtrading** -- Taking too many trades because the trader is bored,
impatient, or addicted to the action. Quality over quantity is the
golden rule. Professional traders might only take 2-3 trades per week.

THIS IS WHY our platform has an entire Psychology tab. It is not a
gimmick. It is the single most valuable tool on the platform. If we
can show a trader that they have a FOMO pattern and it costs them
$500 per month, that insight alone is worth the subscription.

---

## PART 2: THE PLATFORM EXPERIENCE

Now that you understand the trading world, let us walk through what a
trader experiences when they use our platform, screen by screen.

### How The App Is Organized

When a user opens the app, they see a dark, terminal-style interface.
Think of a Bloomberg Terminal or a cockpit instrument panel. The design
is intentionally dense with information because traders want to see
everything at a glance without clicking through pages.

At the very top center of the screen, there is a small downward arrow.
Hovering this opens the **Navigation Menu** -- a dropdown showing all
the pages the user can visit. This is the main way to move around the
platform. It is designed to be minimal and out of the way because most
of the time, traders stay on one or two pages.

On the right edge of the screen, the user can access the **AI Copilot
Panel** -- a sliding panel that contains three tabs of deep analytics
(Activity, Strategy, Psychology). This is the brain of the platform.

On the left edge, the user can access the **Community Hub** -- a sliding
panel that shows trading communities, chat channels, and social features.
Think of this as Discord built into the trading platform.

### The Navigation Menu

When you hover the arrow at the top, a dropdown appears with these
destinations:

1. **Signal Terminal** -- The main trading page. This is where you look
   at charts, analyze instruments, and identify trading opportunities.
   This is the homepage.

2. **Execution Copilot** -- A dedicated page for executing trades with
   AI assistance. Has the chart, a buy/sell order form, trade journal,
   and social feed all on one page.

3. **Macro Economic** -- A dashboard showing the big picture: economic
   events, central bank decisions, market sentiment, currency strength.
   Traders check this before they start their day to understand the
   "narrative" driving the markets.

4. **Student Collaboration** -- A hub for students learning to trade.
   Shows progress, challenges, and collaboration features.

5. **Community** -- A discovery page for finding and joining trading
   communities/groups. Like a Discord server browser but for traders.

---

## PART 3: PAGE-BY-PAGE WALKTHROUGH

### PAGE 1: THE SIGNAL TERMINAL (Homepage)

This is the main page. It fills the entire screen. Everything a trader
needs to analyze a trading instrument is right here.

**What the user sees when they land on this page:**

At the very top is a dark header bar. On the left side, it says the name
of the instrument they are currently looking at, like "EUR/USD" with
its full name "Euro / US Dollar" next to it. Below the instrument name
are category tabs: Forex, Crypto, Indices, Commodities, Metals, Bonds.
Clicking a category shows all the instruments in that category as small
buttons. The user clicks a button to switch instruments.

On the right side of the header, there is a search icon (magnifying glass)
that opens a full search modal where users can type any instrument name
to find it quickly. Next to search is a live price display showing the
current Bid price (what buyers are willing to pay) and Ask price (what
sellers are asking for), with the spread between them.

Below the header, the entire center of the screen is taken up by a
**TradingView chart**. This is a real interactive chart showing the
actual price history of the selected instrument. The user can:
- Zoom in/out with scroll wheel
- Pan left/right to see historical price
- Switch timeframes (1 minute, 5 minute, 15 minute, 1 hour, 4 hour, daily)
- Draw lines, rectangles, and other tools on the chart
- See candlestick patterns (each candle shows open, high, low, close for
  a time period)

At the very bottom of the screen, floating above the chart, is the
**Confluence Bottom Bar**. This is a horizontal strip showing the
confluences the user has identified for their current analysis. Each
confluence is a small card showing what it is (e.g., "Order Block",
"Fair Value Gap", "Session Alignment") and its strength (weak, moderate,
strong). The user can add, remove, and expand confluences. There are also
quick buttons for PnL tracking, AI Insights, and Analysis tools.

**Below the chart fold (scroll down):** When the user scrolls down past
the terminal, they see the Trade Journal Dashboard and Social Feed:

The **Trade Journal Dashboard** shows the user's trading performance at
a glance. Six stat cards across the top show: Total Trades (how many
trades they have taken), Win Rate (percentage of winning trades), Net P&L
(total profit or loss in dollars), Average R (average R-multiple per
trade), Best Trade (their single best result), and Profit Factor (ratio
of total profit to total loss -- above 1.0 means profitable overall).

Below the stat cards is an **Equity Curve** -- a line chart showing how
the account balance changed over time. A rising curve means the trader
is profitable. A falling curve means they are losing money. Traders
obsess over this chart because it shows the truth about their performance
over time, not just one lucky trade.

Next is a **Calendar Heatmap** -- a grid showing every day of the month,
colored by performance. Green days are profitable, red days are losing
days, dark squares are days with no trades. Traders use this to spot
patterns: "I always lose on Mondays" or "My best days are Wednesdays
during London session." Hovering over a day shows the details.

Below that is a **Session Breakdown** -- horizontal bars showing how the
trader performs during each killzone (Asia, London, New York, London
Close). Some traders discover they only make money during London and
lose everything they made during New York. This visualization makes
that obvious.

At the bottom is a **Trade Log Table** showing every individual trade:
the instrument, direction (BUY or SELL), entry price, exit price, P&L
result, R-multiple achieved, and the date. The user can expand any row
to see notes, the chart screenshot at entry, and their emotional state
during the trade.

Below the journal is the **Social Feed**. This works like a simplified
Twitter/X timeline for traders. At the top is a post composer where the
user can write a text post and optionally attach a chart screenshot, tag
instruments, and categorize the post (Analysis, Journal Entry, Question,
Signal). Below the composer, posts from other traders scroll in a feed.
Each post shows the author's avatar, name, and tier badge (verified
traders get a badge). Trade-related posts show a green/red P&L badge.
Posts can be liked, commented on, and shared. There is also a trending
tags sidebar showing the most discussed instruments and topics.

**Why this page matters:** This is the page traders spend 90% of their
time on. Every pixel of it matters. The chart must load fast. The
confluences must be easy to manage. The journal below must make them
feel informed about their own performance. The social feed must make
them feel connected to a trading community.

---

### PAGE 2: THE AI COPILOT RIGHT PANEL

This is not a separate page -- it is a panel that slides in from the
right edge on any page. But it deserves its own section because it is
the most technically advanced part of the entire platform. It has three
tabs, and each one is a deep analytical system.

**The Header:**
At the top of the panel, you see "Copilot" with a small green pulsing
dot and a "LIVE" badge, indicating the AI is actively monitoring the
user's behavior. Next to the title is the **Persona Simulator** button
-- a dropdown that lets users load different trader profiles to preview
how the analytics would look for different experience levels (more on
this below). There is also a settings gear icon that opens the
Onboarding Questionnaire.

**The Persona Simulator:**
Before understanding the tabs, you need to understand the Persona
Simulator. This is a dropdown in the copilot header that contains
preset trader profiles. When selected, all three tabs (Activity,
Strategy, Psychology) populate with realistic data matching that
trader type. The presets are:

- **Starter** -- A brand new trader with zero trades. Everything is
  empty. This shows what the platform looks like on day one.
- **Beginner** -- 30-100 trades. Low win rate (40-45%). Making common
  mistakes. The Psychology tab shows FOMO patterns and revenge trading.
- **Intermediate** -- 200-500 trades. Improving win rate (50-55%).
  Starting to follow rules consistently. Some bad habits remain.
- **Advanced** -- 500-1000 trades. Good win rate (58-65%). Strong rule
  adherence. Psychology is mostly stable with occasional lapses.
- **Professional** -- 1000+ trades. High win rate (65%+). Institutional-
  level execution. Near-perfect discipline. This is the aspirational
  state every trader wants to reach.
- **Destructive** -- A trader doing everything wrong. High trade
  frequency, no stop losses, revenge trading patterns, FOMO-driven
  entries. This exists so users can see the contrast with Professional.
- **Custom Build** -- Users can manually set trade count, win rate,
  average R, and other parameters to see how the analytics respond
  to any combination of values.

The simulator is invaluable for development because you can instantly
see how any tab looks with different amounts of data, different
performance levels, and different psychological states -- without
needing a real trading account.

---

### TAB 1: ACTIVITY (The Command Center)

Think of this as the cockpit dashboard of a fighter jet. Everything
happening right now is displayed here. The AI watches the trader in
real time and provides moment-to-moment guidance.

**Section 1: Session Context Strip**
A thin horizontal strip at the very top of the tab. It tells the trader
which trading session is currently active (Asia, London, New York, or
London Close), how much time is remaining in that session, and what
"phase" the session is in. Sessions go through phases:

- "Pre-session" -- 30 minutes before the session opens. The AI says
  "Prepare your charts and mark key levels."
- "Opening displacement" -- The first 15-30 minutes when price makes
  its initial move. The AI says "Watch for the initial move direction."
- "Momentum phase" -- The main body of the session. Trends establish.
  The AI says "Follow the established direction."
- "Exhaustion / Fade" -- The session is ending, momentum is dying. The
  AI says "Consider taking profits. Do not open new trades."

The strip changes color based on the session: blue for Asia, green for
London, purple for New York, amber for London Close. A progress bar
fills up as the session progresses.

**Why this matters to the user:** Many traders lose money because they
trade at the wrong time. They enter during the Asia session (when the
market is quiet and choppy) instead of waiting for London (when the
real moves happen). This strip keeps the trader aware of timing at all
times without having to check a clock.

**Section 2: The Directive**
One big, clear instruction from the AI. Not advice -- a DIRECTIVE.
The AI analyzes everything (current session, confluences found, risk
level, psychological state) and reduces it to a single action:

- "STANDBY -- Waiting for London open displacement" (gray, calm)
- "SCOUT -- Conditions developing. Mark your levels." (blue, alert)
- "EXECUTE -- Setup confirmed. Proceed with entry." (green, go)
- "HOLD -- Position is active. Let it work." (amber, patient)
- "EXIT -- Take profit. Session momentum fading." (cyan, decisive)
- "ABORT -- Risk elevated. Close positions." (red, urgent)

Each directive has a supporting explanation paragraph that tells the
trader WHY the AI is giving this instruction.

**Why this matters:** Traders often struggle with decision paralysis.
They see 10 different signals and do not know what to do. The directive
cuts through the noise and gives them ONE clear action.

**Section 3: Order Layer State**
A real-time assessment of the trader's readiness to take a trade. Think
of it like a pre-flight checklist for an airplane. The pilot does not
take off until every item is checked. Similarly, a trader should not
enter a trade until every condition is met.

The Order Layer tracks multiple factors, each with its own completion
percentage:
- **Bias**: Does the trader have a clear directional opinion? (Bullish,
  Bearish, or Undefined)
- **Confluences**: How many signals align? (Target: 3+)
- **Risk**: Is the stop loss and position size properly calculated?
- **Psychology**: Is the trader in a good mental state?
- **Session**: Is this the right time to trade?

An overall "readiness score" is displayed as a percentage ring. Below
70% readiness, the AI recommends waiting.

**Section 4: Intelligence Questions**
The AI asks probing questions designed to make the trader think before
acting. These are not generic -- they are based on the trader's current
setup, history, and behavior patterns:

- "You are looking at EUR/USD on the 15-minute chart. Have you checked
  the 4-hour chart for the higher timeframe structure?"
- "Your last 3 trades on this pair were losses. What is different about
  this setup?"
- "You have not identified a stop loss location yet. Where would this
  trade be invalidated?"
- "The New York session starts in 12 minutes. Are you positioned for
  a potential reversal?"

Questions are color-coded by source: blue for strategy-related, amber
for risk-related, purple for psychology-related.

**Section 5: Event Timeline**
A scrolling vertical feed showing everything that has happened, in
chronological order:

- 07:01 -- "Session changed to London Open Killzone"
- 07:03 -- "User switched to EUR/USD 15-minute chart"
- 07:05 -- "User added confluence: Order Block at 1.0845"
- 07:07 -- "AI detected: Fair Value Gap on H4 aligns with entry zone"
- 07:12 -- "Directive upgraded: SCOUT -> EXECUTE"
- 07:14 -- "User opened position: BUY EUR/USD"

Each event has a timestamp, a colored icon, and a description. This
creates an audit trail of the trader's entire session. They can review
it afterward to understand what happened and learn from it.

---

### TAB 2: STRATEGY (The Strategy Mirror)

If the Activity tab is about "right now," the Strategy tab is about
"over time." It shows the trader a mirror of their own strategy --
how well they follow their own rules, what patterns emerge from their
historical trades, and where they deviate from their plan.

**Section 1: Nerve Center**
A row of key statistics at the top of the tab:
- **Open Scenarios**: How many active analysis scenarios the trader has
- **Open Forecasts**: How many predictions are currently live
- **Active Instruments**: How many different instruments they are trading
- **Discipline Score**: A percentage showing how consistently they follow
  their own rules (more on rules below)
- **Signal Health**: An overall quality indicator -- green (healthy),
  amber (degrading), red (critical)

**Section 2: Rule Commitment Tracker**
This is one of the most powerful features. During onboarding, the trader
commits to specific trading rules. For example:
- "I will only trade during London and New York killzones"
- "I will always use a stop loss"
- "I will never risk more than 2% per trade"
- "I will wait for at least 3 confluences before entering"
- "I will not trade on Fridays after 2pm"

The Rule Tracker shows EACH rule as a card with:
- The rule text
- Adherence percentage (e.g., "78% -- you follow this rule 78% of the
  time")
- Current streak ("14 days without violation")
- Best streak ever ("23 days")
- Total violations count
- Last violation date
- A 7-day mini sparkline chart showing daily compliance
- Impact analysis: what happens when they follow it (avg +1.2R) vs
  when they break it (avg -0.8R)

Rules are categorized by type: Entry Rules, Exit Rules, Risk Rules,
Session Rules, and Mindset Rules. Each category has its own section.

**Why this matters:** Traders often SAY they have rules but do not
actually follow them. The Rule Tracker makes rule-following measurable.
When a trader sees that they make +1.2R on average when they follow
Rule #3 but lose -0.8R when they break it, the math speaks for itself.

**Section 3: Execution DNA**
This visualizes HOW the trader enters their positions:
- A donut chart showing the split between Market orders, Limit orders,
  and Stop orders
- The "Limit Ratio" (what percentage of trades use limit entries)

Why does this matter? Market orders mean the trader clicked "Buy Now"
at whatever price the market is currently at. This is often impulsive.
Limit orders mean the trader set a specific price and waited for the
market to come to them. This is disciplined. Professional traders
predominantly use limit orders. If the Execution DNA shows mostly
market orders, the AI can say "You are being impulsive. Pre-plan your
entries with limit orders."

**Section 4: Timeframe Usage**
A bar chart showing which chart timeframes the trader looks at most
(1-minute, 5-minute, 15-minute, 1-hour, 4-hour, daily). If the trader
spends 90% of their time on the 1-minute chart, they are probably
overanalyzing and getting whipsawed by noise. If they spend most time
on 4-hour and daily, they are taking a higher-level, calmer approach.

**Section 5: Instrument Focus**
Bar chart showing which instruments the trader trades most. A common
mistake is spreading attention across too many instruments. Professional
traders usually specialize in 2-4 pairs. If the chart shows 15
instruments, the AI can recommend narrowing focus.

**Section 6: Top Models**
Which trading setups/patterns the trader uses most. Examples: "Order
Block Rejection," "Fair Value Gap Fill," "Break of Structure," "Session
Sweep." This shows if the trader has a consistent methodology or if
they are randomly trying different approaches.

---

### TAB 3: PSYCHOLOGY (The Neural Cortex)

This is the crown jewel. No other trading platform does this. It is
literally an MRI of the trader's mind -- tracking emotions, detecting
behavioral patterns, and warning about psychological dangers before
they cause financial damage.

**Section 1: Neural Cortex Header**
A summary of the trader's psychological state:
- **Composite Score** (0-100): An overall mental health rating for
  trading. Above 80 = healthy. 60-80 = some concerns. Below 60 = the
  trader should probably step away from the screen.
- **Current State**: A single word describing the emotional state right
  now: Focused, Calm, Anxious, Frustrated, Tilted, Euphoric, Fatigued.
- **Stability**: How consistent the mental state is. High stability
  means the trader stays calm through wins and losses. Low stability
  means wild emotional swings.
- **Active Alerts**: Warning badges for active psychological risks.

**Section 2: Emotional Frequency Map**
A visual heatmap showing which emotions the trader experiences most
frequently while trading. Each emotion has a color, intensity, and
frequency:

Negative emotions tracked:
- **FOMO** (Fear Of Missing Out) -- Entered late because price was
  moving without them
- **Revenge** -- Took an impulsive trade immediately after a loss
- **Overconfidence** -- Increased risk after a winning streak
- **Fear** -- Hesitated to enter a valid setup because of past losses
- **Impatience** -- Entered before the setup was complete
- **Greed** -- Moved take-profit further away, turning winners into losers

Positive emotions tracked:
- **Patience** -- Waited for the setup to fully develop before entering
- **Discipline** -- Followed all rules even when it was tempting not to
- **Acceptance** -- Took a loss calmly without emotional reaction
- **Confidence** -- Entered with conviction on a well-analyzed setup

The heatmap reveals patterns. A trader might discover that FOMO spikes
every Monday morning (because they see weekend price moves they missed)
and revenge trading spikes on Fridays (because they want to end the
week positive). These patterns are invisible without tracking.

**Section 3: Behavioral Patterns**
The AI identifies repeating behavior cycles:
- "After 2 consecutive losses, you increase position size by 40% on
  average. This revenge pattern has cost you $2,300 over 3 months."
- "Your best trades happen between 8am-10am London time. Your worst
  trades happen after 3pm. Consider stopping after New York lunch."
- "When your composite score drops below 60, your next trade has a
  28% win rate (vs your normal 57%). The AI recommends stepping away."

Each pattern shows:
- Description of the behavior
- How often it occurs (frequency)
- The financial impact (how much it costs or earns)
- A suggested fix

**Section 4: Tilt Detection**
Real-time monitoring for "tilt" (emotional breakdown):
- Tracks consecutive losses
- Watches for increasing trade frequency after losses (revenge pattern)
- Monitors position size changes after losses (doubling down)
- Checks if the trader is breaking their own rules

Warning levels:
- **None** (green) -- Everything is normal
- **Mild** (yellow) -- Some concerning signals. "Take a 15-minute break."
- **Moderate** (amber) -- Clear emotional trading detected. "Close your
  charts. Take an hour break."
- **Severe** (red) -- Full tilt. "Stop trading for the day. Seriously."

**Section 5: Cognitive Load**
How much mental strain the trader is under:
- Too many open positions at once?
- Watching too many instruments simultaneously?
- Made too many decisions in a short time window?
- Trading during a normally low-energy time (late at night)?

When cognitive load is high, decision quality drops. The AI recommends
reducing complexity: close some positions, narrow the watchlist, take
a walk.

**Section 6: Journal Prompts**
Personalized reflection questions generated based on the trader's
recent behavior:
- "Your last trade broke Rule #4 (session timing). What triggered you
  to trade outside your killzone?"
- "You held your winner for only 12 pips but your plan was 30 pips.
  What made you exit early?"
- "You had 3 winning trades this morning then took a loss on an
  unplanned trade. What changed in your mindset?"

These prompts are for the trader to answer in their journal. The act
of writing down the answers forces self-reflection and builds
self-awareness -- the single most important trait for long-term
trading success.

**Section 7: Brain Visualization**
An animated visual showing a stylized brain with different regions lit
up based on the trader's psychological state. When fear is active, the
amygdala region glows red. When discipline is strong, the prefrontal
cortex glows blue. When the trader is in "flow state," everything
glows green harmoniously. This is a metaphor, not medical science --
but it gives a powerful visual representation of mental state that
traders find incredibly engaging.

---

## PART 4: OTHER PAGES

### Macro Economic Intelligence
A dashboard for understanding the big picture. Shows economic calendar
(upcoming events like Federal Reserve meetings, GDP releases, employment
reports), currency strength comparisons, central bank interest rate
decisions, and live news headlines with AI analysis. Traders check this
page at the start of each day to understand what is driving the markets.

### Forecast Engine
A tool for creating structured trading predictions. The user selects an
instrument, direction (bullish or bearish), entry price, stop loss, and
take profit. They add their confluences (the reasons behind the trade).
The AI grades the forecast quality based on confluence strength, risk-
to-reward ratio, and historical accuracy. Forecasts can be shared with
community members or kept private.

### Mentor Forecast Engine
A special version of the Forecast Engine for experienced traders who
teach others. Mentors can create forecasts with additional teaching
annotations explaining their thought process. They can control who
sees the forecast (everyone, only their group, only paid subscribers).
Students can follow mentor forecasts and compare their own analysis.

### Nexus Mind Map
A visual mind map showing interconnected analysis concepts. Nodes
represent confluences, instruments, timeframes, and trading models.
Edges show relationships between them. The AI synthesizes insights
from the graph. This is a visual thinking tool for traders who want
to see how all their analysis pieces connect.

### Student Hub
A dashboard for traders who are still learning. Shows their progress
through educational content, active challenges, collaboration features
with other students, and quick links to tools they need.

### Communities Discovery
A page for finding and joining trading communities. Like browsing
Discord servers but for trading groups. Shows community cards with
name, description, member count, mentors, pricing, and asset classes.
Has search and filters. Clicking a community opens a preview with
full details before joining.

### Community Group Pages
When inside a community, the user sees a full social experience:
a post feed, shared forecasts, confluence discussions, member list,
group rules, and settings. Mentors can post analysis, host live
sessions, and share their trading plans.

### Forecast Share Designer
A tool for creating beautiful visual cards from forecasts to share on
social media. Shows the instrument, direction, entry/exit levels, P&L
result, and the trader's branding.

### Trade History
Currently a placeholder. Will eventually show a complete history of all
trades with calendar view, performance analytics, and journal entries.

---

## PART 5: WHAT IS BUILT VS WHAT NEEDS WORK

### Fully Built and Production Quality (Do Not Touch):
- The entire Copilot Right Rail (Activity, Strategy, Psychology tabs)
- The Persona Simulator with all presets and custom builder
- The Onboarding Questionnaire (5 phases)
- The Signal Terminal header and chart
- The Confluence Bottom Bar
- The floating navigation system
- The login page

### Built But Needs Design/Polish:
- Communities discovery page
- Community group detail pages and all sub-components
- Community left drawer (FloatingCommunityHub)
- Student Hub dashboard
- Forecast Share Card
- Social Feed
- Trade Journal Dashboard
- Nexus Mind Map

### Not Built Yet (Placeholder or Empty):
- Trade History page
- Profile pages (edit, password, connected accounts)
- Settings pages (notifications, security)
- Billing pages (upgrade, downgrade, payment)
- Admin pages (user management, content moderation)
- Marketing pages (about, pricing, FAQ, blog)
- Legal pages (terms, privacy, cookies)
- Support pages (ticket system, status)

All 99 of these empty pages exist as templates in the `app-boilerplate`
folder. They need to be moved into the main app and redesigned.

---

## PART 6: WHO DOES WHAT

### You (Platform Owner) -- Core Trading Engine
You handle everything that requires deep understanding of trading
mechanics, AI systems, and platform architecture. This includes the
three copilot tabs (Activity, Strategy, Psychology), the Signal Terminal
chart analysis, the Forecast Engine, the Confluence system, the Market
Intelligence dashboard, the Persona Simulator, and all AI/copilot logic.
Nobody else touches these.

### Team Member A -- Community and Social
You own everything related to communities, groups, social features, and
sharing. This is roughly 35 components and 3 routes.

Your mission: Make the community system feel as polished and detailed as
the copilot tabs. Right now, the community pages are basic. They need to
be rebuilt with the same level of care. Specifically:

1. Redesign the communities discovery page. The search should feel
   powerful. The community cards should show rich, useful information
   at a glance. The filters should let users narrow results by asset
   class, pricing, trading style, and rating.

2. Redesign every community card. Each card should show the community
   name, avatar, description preview, mentor photos, member count with
   online indicator, asset class badges, pricing, star rating, and
   whether a live session is happening now.

3. Build a community preview drawer. When you click a community card,
   a panel slides in showing full details: about section, mentor bios
   with ratings and specialties, pricing plans with feature comparison,
   upcoming sessions, recent activity, and a join button.

4. Redesign the community group pages. The header, post feed, member
   list, forecast sharing room, and settings pages all need polish.

5. Redesign the left-side community drawer. Server icons, channel list,
   and chat area need to match the quality of the copilot panel.

6. Build the forecast share card designer with social media-ready
   templates.

7. Build the student collaboration hub features: study groups, shared
   analysis, peer review system.

8. Build the premium leaderboard showing top traders ranked by
   performance with badges and streaks.

### Team Member B -- Platform Infrastructure
You own everything that is NOT trading-specific: authentication pages,
user profiles, settings, billing, admin dashboard, marketing pages,
legal pages, and support system. This is roughly 99 boilerplate pages
plus the student hub and trade history UI.

Your mission: Move boilerplate pages from `app-boilerplate/` into the
main `app/` folder and redesign every single one to match the platform
aesthetic. Right now they are default templates. They need to look like
they belong in a professional trading terminal.

1. Auth pages: Login (redesign the current basic version), Register,
   Forgot Password, Reset Password, Verify Email, Two-Factor Auth.

2. Profile pages: User profile view with trading stats, Edit profile
   form, Change password, Connected accounts (Google, Discord, etc.).

3. Settings pages: App settings (theme, language, timezone), Notification
   preferences, Security settings (2FA, active sessions).

4. Billing pages: Current plan overview, Upgrade with tier comparison,
   Downgrade, Cancel, Payment history, Credit card management.

5. Trade History page: Build the full UI with calendar view, trade log,
   stats cards, and filters. Use mock data -- the real data layer will
   be connected later by the platform owner.

6. Admin pages: Dashboard with platform stats, User management table,
   Content moderation queue, Report handling, Subscription management.

7. Student Hub dashboard: Progress cards, challenge list, activity feed,
   quick links to learning tools.

8. Marketing pages: About (platform story), Pricing (tier comparison),
   FAQ (accordion), Contact form, Blog index and post pages.

9. Legal pages: Terms of Service, Privacy Policy, Cookie Policy.

10. Utility pages: Support center, Platform status, Usage statistics,
    Third-party integrations, API documentation.

---

## PART 7: DESIGN RULES

Every page and component on this platform MUST follow these design rules.
There are no exceptions. If something you build does not follow these
rules, it will be sent back for revision.

### The Feeling
The platform should feel like a Bloomberg Terminal crossed with a
military command center. Dense with information but never chaotic.
Every element has a purpose. Every color has a meaning. There is no
decoration for decoration's sake.

### Colors
The background is always very dark -- almost black but with a slight
blue tint. Cards sit on top of the background with extremely subtle
transparency. Borders are nearly invisible -- just enough to separate
elements without creating visual noise.

- Main background: Very dark blue-black
- Card surfaces: Extremely subtle white transparency (2-3% opacity)
- Borders: White at 4-6% opacity -- barely visible
- Primary text: White at 90% opacity
- Secondary text: White at 50% opacity
- Tertiary/label text: White at 25-30% opacity
- Success/bullish: Emerald green
- Information/neutral: Cyan blue
- Warning/caution: Amber orange
- Danger/bearish: Red
- NEVER use white backgrounds anywhere
- NEVER use bright solid color backgrounds
- NEVER use purple as a primary accent

### Typography
The platform uses two font styles:

**Monospace** -- Used for numbers, statistics, labels, section headers,
and anything "technical." This gives the terminal feel. Section labels
are 9px, monospace, uppercase, with wide letter-spacing, and at 30%
white opacity. Statistics and values are 13px, monospace, bold, at 90%
white opacity.

**Sans-serif** -- Used for descriptions, body text, explanations, and
anything the user reads in sentences. Body text is 11px at 60% white
opacity.

The hierarchy from smallest to largest:
- 7px: Tiny badges and micro-labels
- 9px: Section labels (uppercase, tracked out, faded)
- 11px: Body text and descriptions
- 13px: Values, numbers, and statistics
- 16px: Sub-headings
- 20px+: Page titles (rarely used -- most content is dense)

### Spacing
Everything is compact but not cramped. The golden rules:
- Card internal padding: 12px (Tailwind: p-3)
- Gap between elements inside a card: 8px (gap-2)
- Gap between cards: 8-12px (gap-2 or gap-3)
- Between major sections: 16-24px (space-y-4 or space-y-6)
- Section labels have 8-12px margin below them

### Animations
Use subtle entrance animations. Elements should fade in and slide up
slightly when they appear. Never use bouncy or flashy animations.
- Fade in: opacity 0 to 1
- Slide up: translate Y from 6px to 0
- Duration: 300ms
- Easing: ease-out
- Use framer-motion for all animations

### Visual Indicators
- Accent-edge sections: A thin 2px colored bar on the left edge of a
  section (using border-left) to show the section's category/status
- Pulsing dots: Small circles with a pulse animation to indicate
  "live" or "active" status
- Progress rings: Circular SVG progress indicators for completion
  percentages
- Sparkline charts: Tiny inline charts (7-day trends) embedded in cards

### Layout
- Use flexbox for nearly everything
- Use CSS Grid only for card grids (2 or 3 columns)
- Full-width sections stack vertically
- Never use floats or absolute positioning for layout
- Cards in discovery pages: 2-column grid
- Stats cards: Responsive grid that goes from 2 to 3 to 6 columns

---

## PART 8: HOW TO KNOW IF YOUR WORK IS GOOD ENOUGH

Look at the Strategy tab or the Psychology tab in the copilot panel.
Study the level of detail. Notice how:
- Every number is precisely formatted
- Every section has a clear label
- Every color choice conveys meaning (green = good, red = bad, amber = warning)
- Every piece of information answers a question the user has
- There is no wasted space but nothing feels cramped
- The animations are subtle but noticeable
- Hovering reveals additional detail without cluttering the default view

Your work should match this level. Not 80% of it. 100% of it.

If you build a community card and it has a white background with big
text and rounded corners with a drop shadow -- that is wrong. It should
have a dark surface, monospace labels, subtle borders, accent-edge
indicators, and compact typography that matches everything else on
the platform.

The single best way to check your work: put your component side by side
with the Psychology tab. Do they look like they belong in the same
application? If yes, ship it. If no, keep iterating.

---

## END OF TRAINING GUIDE

When you finish a task, tell the platform owner what you built, what
files you changed, and include a screenshot. The platform owner will
review and provide feedback. Do not move on to the next task until
the current one is approved.

Welcome to the team.
