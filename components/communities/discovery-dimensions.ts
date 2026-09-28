/**
 * Discovery Dimensions -- The intelligent filter vocabulary of the Community Discovery Engine.
 *
 * Each dimension represents a meaningful aspect of what traders actually look for
 * in a trading community. These are not generic tags -- they are the product
 * differentiators and support-structure descriptors that define the ArchioAI ecosystem.
 *
 * The orbit system renders these as interactive nodes around the Discovery Core.
 * Hovering teaches. Clicking refines. Together they build the user's ideal community profile.
 */

export interface DiscoveryDimension {
  id: string
  label: string
  /** Short orbit-node label (max ~18 chars) */
  short: string
  /** What this dimension means */
  meaning: string
  /** Why it matters to a trader */
  whyItMatters: string
  /** What kind of communities this surfaces */
  surfaces: string
  /** What kind of trader benefits */
  traderType: string
  /** The accent color from the MTF theme palette */
  accentRgb: string
  /** Which API filter params this maps to */
  filterKey: string
  filterValue: string | boolean
  /** Ring: 0=inner (platform differentiators), 1=middle (support style), 2=outer (market/style) */
  ring: 0 | 1 | 2
  /** Icon glyph character */
  icon: string
}

/* ── RING 0: Platform Differentiators (innermost -- what makes ArchioAI unique) ── */
const RING_0: DiscoveryDimension[] = [
  {
    id: "ai-models", label: "AI-Powered Mentorship", short: "AI Models",
    meaning: "Communities where mentors have their own AI-trained system so students get support 24/7 even when the mentor is offline.",
    whyItMatters: "You never stop learning. The mentor's knowledge is captured in an AI model that answers your questions, reviews your ideas, and guides you around the clock.",
    surfaces: "Premium communities with Archio AI integration -- mentor knowledge extended through artificial intelligence.",
    traderType: "Self-directed learners who want continuous support without waiting for the next live session.",
    accentRgb: "217,176,96", filterKey: "has_ai", filterValue: true, ring: 0, icon: "b",
  },
  {
    id: "live-calls", label: "Live Trading Calls", short: "Live Calls",
    meaning: "Communities with recurring real-time analysis, live execution rooms, market breakdowns, or mentor-led trading sessions.",
    whyItMatters: "Nothing accelerates learning like watching a mentor think through live markets. Real-time calls build pattern recognition, decision speed, and confidence.",
    surfaces: "Communities with scheduled live sessions -- daily analysis, execution rooms, or weekly deep dives.",
    traderType: "Traders who learn best through observation and real-time interaction with experienced mentors.",
    accentRgb: "210,105,95", filterKey: "has_live_calls", filterValue: true, ring: 0, icon: "k",
  },
  {
    id: "mentor-dashboard", label: "Mentor Dashboard Tools", short: "Dashboards",
    meaning: "Communities with built-in analytics, trade tracking, and performance monitoring tools available to members.",
    whyItMatters: "A community with dashboards takes your growth seriously. Track progress, review performance, and see exactly where you need to improve.",
    surfaces: "Structured communities with professional tooling -- analytics, journals, and progress tracking.",
    traderType: "Data-driven traders who want measurable improvement and structured feedback.",
    accentRgb: "130,170,220", filterKey: "has_mentor_dashboard", filterValue: true, ring: 0, icon: "g",
  },
  {
    id: "verified", label: "Verified Mentors", short: "Verified",
    meaning: "Communities led by mentors verified through the Archio vetting process -- track record, teaching quality, and community health confirmed.",
    whyItMatters: "Trust is everything. Verified status means the mentor has demonstrated real competence, not just marketing skill.",
    surfaces: "Communities with mentors who have passed verification -- proven track records and teaching standards.",
    traderType: "Traders who want certainty about mentor quality before investing their time and money.",
    accentRgb: "94,186,156", filterKey: "verified", filterValue: true, ring: 0, icon: "l",
  },
]

/* ── RING 1: Support Structure (what kind of environment do you need?) ── */
const RING_1: DiscoveryDimension[] = [
  {
    id: "direct-mentor", label: "Direct Mentor Access", short: "Mentor Access",
    meaning: "Smaller or more premium environments where students get closer communication, more direct review, and tighter feedback loops.",
    whyItMatters: "Personalized feedback dramatically speeds up improvement. Direct access means your specific questions get real answers from someone who understands your trading.",
    surfaces: "Premium, smaller communities with high mentor-to-student ratios and active engagement.",
    traderType: "Serious traders willing to invest in closer mentorship rather than mass content consumption.",
    accentRgb: "217,176,96", filterKey: "visibility", filterValue: "paid", ring: 1, icon: "p",
  },
  {
    id: "beginner-safe", label: "Beginner Guided Learning", short: "Beginner Safe",
    meaning: "Welcoming environments with structured curricula, patient mentors, and safe spaces for questions from day-one traders.",
    whyItMatters: "Starting out is overwhelming. A beginner-safe room protects you from information overload, signal confusion, and premature complexity.",
    surfaces: "Educational communities with step-by-step programs, patient mentors, and beginner-friendly atmospheres.",
    traderType: "New traders in their first 3-12 months who need structure, patience, and clear learning paths.",
    accentRgb: "120,190,200", filterKey: "beginner_friendly", filterValue: true, ring: 1, icon: "e",
  },
  {
    id: "accountability", label: "Disciplined Accountability", short: "Accountability",
    meaning: "Rooms built around routine, check-ins, rule-following, journaling, and trader consistency.",
    whyItMatters: "Trading success is 80% discipline. An accountability community keeps you honest, tracks your habits, and makes consistency social.",
    surfaces: "Communities focused on journaling, daily check-ins, rule systems, and peer accountability.",
    traderType: "Traders who know their edge but struggle with execution discipline and emotional consistency.",
    accentRgb: "200,120,140", filterKey: "trading_style", filterValue: "mixed", ring: 1, icon: "t",
  },
  {
    id: "peer-energy", label: "Active Peer Community", short: "Peer Energy",
    meaning: "Large, vibrant ecosystems with high daily activity, active chat rooms, and strong member-to-member interaction.",
    whyItMatters: "Trading alone is isolating. An active community provides energy, ideas, debate, and the social pressure to show up every day.",
    surfaces: "High-activity communities with strong member engagement, active chat, and collaborative culture.",
    traderType: "Social traders who thrive on community energy and want to trade alongside others.",
    accentRgb: "160,140,210", filterKey: "sort_by", filterValue: "activity", ring: 1, icon: "u",
  },
  {
    id: "small-tribe", label: "Small Serious Tribe", short: "Small Tribe",
    meaning: "Intentionally limited communities where quality of interaction matters more than volume of members.",
    whyItMatters: "Smaller rooms mean more attention, less noise, and deeper relationships. Every member matters.",
    surfaces: "Communities with member caps, selective entry, or premium pricing that limits size intentionally.",
    traderType: "Traders who prefer depth over breadth and want a tight-knit group of serious peers.",
    accentRgb: "200,170,110", filterKey: "sort_by", filterValue: "members", ring: 1, icon: "r",
  },
]

/* ── RING 2: Market & Style Focus (more specific filters) ── */
const RING_2: DiscoveryDimension[] = [
  {
    id: "scalping", label: "Fast Scalping Environment", short: "Scalping",
    meaning: "High-intensity rooms designed for rapid execution, tape reading, and short-duration trades.",
    whyItMatters: "Scalping requires a specific energy and real-time information flow that only a dedicated scalping room provides.",
    surfaces: "Communities specializing in sub-15-minute trades, order flow, and high-frequency analysis.",
    traderType: "Fast-twitch traders who thrive in high-speed environments with quick feedback loops.",
    accentRgb: "210,105,95", filterKey: "trading_style", filterValue: "scalping", ring: 2, icon: "z",
  },
  {
    id: "day-trading", label: "Day Trading Focus", short: "Day Trading",
    meaning: "Communities built around intraday analysis, session-based execution, and closing positions before market close.",
    whyItMatters: "Day trading demands a daily rhythm -- pre-market analysis, session execution, and post-market review. The right room keeps this rhythm alive.",
    surfaces: "Communities with daily pre-market calls, session recaps, and intraday strategy discussions.",
    traderType: "Active intraday traders who want structured daily workflows and session-based community activity.",
    accentRgb: "130,170,220", filterKey: "trading_style", filterValue: "day_trading", ring: 2, icon: "d",
  },
  {
    id: "swing", label: "Swing & Position Trading", short: "Swing",
    meaning: "Patient communities focused on multi-day to multi-week positions, macro analysis, and deeper research.",
    whyItMatters: "Swing trading requires patience and conviction. The right community provides deep research, macro context, and the confidence to hold positions.",
    surfaces: "Research-focused communities with weekly analysis, macro commentary, and longer-horizon strategies.",
    traderType: "Patient traders who think in days to weeks, prefer research over speed, and value macro context.",
    accentRgb: "200,170,110", filterKey: "trading_style", filterValue: "swing", ring: 2, icon: "s",
  },
  {
    id: "forex", label: "Forex Precision", short: "Forex",
    meaning: "Communities specializing in currency markets -- major pairs, correlations, central bank analysis, and session-specific strategies.",
    whyItMatters: "Forex is the most liquid and session-dependent market. Specialized rooms understand the nuances that general trading communities miss.",
    surfaces: "Communities focused on currency pairs, session trading, and institutional forex concepts.",
    traderType: "Forex specialists who want deep knowledge of currency dynamics, not surface-level chart patterns.",
    accentRgb: "94,186,156", filterKey: "asset_class", filterValue: "forex", ring: 2, icon: "f",
  },
  {
    id: "crypto", label: "Crypto Native Rooms", short: "Crypto",
    meaning: "Communities built for the 24/7 digital asset ecosystem -- altcoins, DeFi, on-chain analysis, and exchange-specific strategies.",
    whyItMatters: "Crypto never sleeps. Native crypto rooms understand on-chain data, exchange dynamics, and the unique risk profiles of digital assets.",
    surfaces: "Communities focused on crypto markets, DeFi, and digital asset trading strategies.",
    traderType: "Crypto traders who want communities operating on crypto time -- 24/7, exchange-native, and DeFi-aware.",
    accentRgb: "160,140,210", filterKey: "asset_class", filterValue: "crypto", ring: 2, icon: "c",
  },
  {
    id: "stocks", label: "Equities & Options", short: "Stocks",
    meaning: "Communities focused on US equities, options flow, earnings plays, and equity market structure.",
    whyItMatters: "The equity market has unique dynamics -- options flow, earnings cycles, and pre-market activity. Specialized rooms cover these deeply.",
    surfaces: "Communities with options analysis, earnings calendars, and equity-specific strategies.",
    traderType: "Traders focused on stocks and options who want pre-market analysis and flow interpretation.",
    accentRgb: "130,170,220", filterKey: "asset_class", filterValue: "stocks", ring: 2, icon: "q",
  },
  {
    id: "london-session", label: "London Session Focus", short: "London",
    meaning: "Communities structured around the London trading session -- the highest-volume forex and futures session of the day.",
    whyItMatters: "London is where institutional volume concentrates. Session-specific rooms align their entire rhythm to this critical window.",
    surfaces: "Communities with London session timing, institutional analysis, and session-specific strategies.",
    traderType: "Traders in European time zones or anyone who wants to specialize in the most liquid trading session.",
    accentRgb: "120,190,200", filterKey: "session_focus", filterValue: "london", ring: 2, icon: "L",
  },
  {
    id: "risk-management", label: "Risk Management Focus", short: "Risk Mgmt",
    meaning: "Communities that emphasize position sizing, risk-reward ratios, drawdown limits, and capital preservation.",
    whyItMatters: "Risk management separates surviving traders from blown accounts. These communities drill discipline into every trade decision.",
    surfaces: "Communities with strict risk rules, position sizing tools, and loss prevention frameworks.",
    traderType: "Traders who understand that protecting capital is more important than maximizing gains.",
    accentRgb: "210,105,95", filterKey: "risk_focused", filterValue: true, ring: 2, icon: "R",
  },
  {
    id: "signal-service", label: "Trade Signals & Alerts", short: "Signals",
    meaning: "Communities providing real-time trade alerts, entry/exit signals, and ready-to-execute ideas.",
    whyItMatters: "Signals give you actionable trade ideas while you learn. The best signal rooms also teach the reasoning behind each call.",
    surfaces: "Communities with signal channels, alert bots, and structured trade idea sharing.",
    traderType: "Traders who want actionable ideas delivered alongside educational context.",
    accentRgb: "130,170,220", filterKey: "has_signals", filterValue: true, ring: 2, icon: "S",
  },
  {
    id: "prop-firm", label: "Prop Firm Preparation", short: "Prop Firm",
    meaning: "Communities specifically training traders to pass prop firm challenges and manage funded accounts.",
    whyItMatters: "Prop firm challenges have specific rules and psychology. These communities understand exactly what it takes to pass and stay funded.",
    surfaces: "Communities partnered with or focused on FTMO, True Forex Funds, and other prop firm challenges.",
    traderType: "Traders pursuing funded accounts who need challenge-specific strategies and risk frameworks.",
    accentRgb: "200,170,110", filterKey: "prop_firm", filterValue: true, ring: 2, icon: "P",
  },
]

/** All dimensions ordered by ring */
export const ALL_DIMENSIONS: DiscoveryDimension[] = [...RING_0, ...RING_1, ...RING_2]

/** Dimensions by ring */
export const DIMENSIONS_BY_RING = {
  0: RING_0,
  1: RING_1,
  2: RING_2,
} as const

/** Ring labels */
export const RING_LABELS = {
  0: "Platform Intelligence",
  1: "Support Structure",
  2: "Market & Style",
} as const
