/* ────────────────────────────────────────────────────────────────────────
   COMMUNITIES SOURCE OF TRUTH
   Vantary Universal Template Engine · Phase 2 · Communities Migration

   Locks every datum from the legacy /communities surface — the 21-node
   discovery vocabulary (components/communities/discovery-dimensions.ts),
   the 8 mock communities served by app/api/communities/route.ts, and the
   stat triplets + asset-share breakdowns visible in the production
   screenshots (Scalp Velocity 74% · 2.4R · 67 sigs/wk, etc.).

   Every Communities flight-deck template imports from THIS module only.
   No template reaches into components/communities/* or app/api/* directly.
   ──────────────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────────────
   1.  DISCOVERY DIMENSIONS — 21 nodes across 3 rings
        Verbatim copy from components/communities/discovery-dimensions.ts.
        Every meaning / whyItMatters / surfaces / traderType string is
        preserved character-for-character so the radial template can
        teach the same lessons the original taught.
   ──────────────────────────────────────────────────────────────────── */

export interface CommunityDimension {
  /** Stable identifier — used for filter mapping, ARIA, and route ids. */
  readonly id: string
  /** Long label — e.g. "AI-Powered Mentorship". */
  readonly label: string
  /** Short orbit label — e.g. "AI Models". */
  readonly short: string
  /** What this dimension means (full prose). */
  readonly meaning: string
  /** Why it matters to a trader (full prose). */
  readonly whyItMatters: string
  /** What kind of communities this surfaces. */
  readonly surfaces: string
  /** What kind of trader benefits. */
  readonly traderType: string
  /** Which API filter param this maps to. */
  readonly filterKey: string
  /** Filter value — bool or string union from the API. */
  readonly filterValue: string | boolean
  /** Ring assignment. 0 = inner (platform), 1 = middle (support), 2 = outer (style). */
  readonly ring: 0 | 1 | 2
}

/* ── Ring 0 · Platform Intelligence (innermost) ── */
const RING_0: readonly CommunityDimension[] = [
  {
    id: "ai-models",
    label: "AI-Powered Mentorship",
    short: "AI Models",
    meaning:
      "Communities where mentors have their own AI-trained system so students get support 24/7 even when the mentor is offline.",
    whyItMatters:
      "You never stop learning. The mentor's knowledge is captured in an AI model that answers your questions, reviews your ideas, and guides you around the clock.",
    surfaces:
      "Premium communities with Archio AI integration — mentor knowledge extended through artificial intelligence.",
    traderType:
      "Self-directed learners who want continuous support without waiting for the next live session.",
    filterKey: "has_ai",
    filterValue: true,
    ring: 0,
  },
  {
    id: "live-calls",
    label: "Live Trading Calls",
    short: "Live Calls",
    meaning:
      "Communities with recurring real-time analysis, live execution rooms, market breakdowns, or mentor-led trading sessions.",
    whyItMatters:
      "Nothing accelerates learning like watching a mentor think through live markets. Real-time calls build pattern recognition, decision speed, and confidence.",
    surfaces:
      "Communities with scheduled live sessions — daily analysis, execution rooms, or weekly deep dives.",
    traderType:
      "Traders who learn best through observation and real-time interaction with experienced mentors.",
    filterKey: "has_live_calls",
    filterValue: true,
    ring: 0,
  },
  {
    id: "mentor-dashboard",
    label: "Mentor Dashboard Tools",
    short: "Dashboards",
    meaning:
      "Communities with built-in analytics, trade tracking, and performance monitoring tools available to members.",
    whyItMatters:
      "A community with dashboards takes your growth seriously. Track progress, review performance, and see exactly where you need to improve.",
    surfaces:
      "Structured communities with professional tooling — analytics, journals, and progress tracking.",
    traderType:
      "Data-driven traders who want measurable improvement and structured feedback.",
    filterKey: "has_mentor_dashboard",
    filterValue: true,
    ring: 0,
  },
  {
    id: "verified",
    label: "Verified Mentors",
    short: "Verified",
    meaning:
      "Communities led by mentors verified through the Archio vetting process — track record, teaching quality, and community health confirmed.",
    whyItMatters:
      "Trust is everything. Verified status means the mentor has demonstrated real competence, not just marketing skill.",
    surfaces:
      "Communities with mentors who have passed verification — proven track records and teaching standards.",
    traderType:
      "Traders who want certainty about mentor quality before investing their time and money.",
    filterKey: "verified",
    filterValue: true,
    ring: 0,
  },
] as const

/* ── Ring 1 · Support Structure (middle) ── */
const RING_1: readonly CommunityDimension[] = [
  {
    id: "direct-mentor",
    label: "Direct Mentor Access",
    short: "Mentor Access",
    meaning:
      "Smaller or more premium environments where students get closer communication, more direct review, and tighter feedback loops.",
    whyItMatters:
      "Personalized feedback dramatically speeds up improvement. Direct access means your specific questions get real answers from someone who understands your trading.",
    surfaces:
      "Premium, smaller communities with high mentor-to-student ratios and active engagement.",
    traderType:
      "Serious traders willing to invest in closer mentorship rather than mass content consumption.",
    filterKey: "visibility",
    filterValue: "paid",
    ring: 1,
  },
  {
    id: "beginner-safe",
    label: "Beginner Guided Learning",
    short: "Beginner Safe",
    meaning:
      "Welcoming environments with structured curricula, patient mentors, and safe spaces for questions from day-one traders.",
    whyItMatters:
      "Starting out is overwhelming. A beginner-safe room protects you from information overload, signal confusion, and premature complexity.",
    surfaces:
      "Educational communities with step-by-step programs, patient mentors, and beginner-friendly atmospheres.",
    traderType:
      "New traders in their first 3-12 months who need structure, patience, and clear learning paths.",
    filterKey: "beginner_friendly",
    filterValue: true,
    ring: 1,
  },
  {
    id: "accountability",
    label: "Disciplined Accountability",
    short: "Accountability",
    meaning:
      "Rooms built around routine, check-ins, rule-following, journaling, and trader consistency.",
    whyItMatters:
      "Trading success is 80% discipline. An accountability community keeps you honest, tracks your habits, and makes consistency social.",
    surfaces:
      "Communities focused on journaling, daily check-ins, rule systems, and peer accountability.",
    traderType:
      "Traders who know their edge but struggle with execution discipline and emotional consistency.",
    filterKey: "trading_style",
    filterValue: "mixed",
    ring: 1,
  },
  {
    id: "peer-energy",
    label: "Active Peer Community",
    short: "Peer Energy",
    meaning:
      "Large, vibrant ecosystems with high daily activity, active chat rooms, and strong member-to-member interaction.",
    whyItMatters:
      "Trading alone is isolating. An active community provides energy, ideas, debate, and the social pressure to show up every day.",
    surfaces:
      "High-activity communities with strong member engagement, active chat, and collaborative culture.",
    traderType:
      "Social traders who thrive on community energy and want to trade alongside others.",
    filterKey: "sort_by",
    filterValue: "activity",
    ring: 1,
  },
  {
    id: "small-tribe",
    label: "Small Serious Tribe",
    short: "Small Tribe",
    meaning:
      "Intentionally limited communities where quality of interaction matters more than volume of members.",
    whyItMatters:
      "Smaller rooms mean more attention, less noise, and deeper relationships. Every member matters.",
    surfaces:
      "Communities with member caps, selective entry, or premium pricing that limits size intentionally.",
    traderType:
      "Traders who prefer depth over breadth and want a tight-knit group of serious peers.",
    filterKey: "sort_by",
    filterValue: "members",
    ring: 1,
  },
  {
    id: "trading-psychology",
    label: "Trading Psychology",
    short: "Psychology",
    meaning:
      "Rooms that put discipline, mindset, and emotional regulation at the centre of trader development.",
    whyItMatters:
      "Most traders fail not from lack of edge but from lack of self-control. A psychology-first room treats the operator as the system.",
    surfaces:
      "Communities with structured psychology curricula, performance journals, and mindset coaching.",
    traderType:
      "Traders who already have a strategy but bleed P&L through self-sabotage and want structural support.",
    filterKey: "trading_style",
    filterValue: "mixed",
    ring: 1,
  },
] as const

/* ── Ring 2 · Market & Style (outermost) ── */
const RING_2: readonly CommunityDimension[] = [
  {
    id: "scalping",
    label: "Fast Scalping Environment",
    short: "Scalping",
    meaning:
      "High-intensity rooms designed for rapid execution, tape reading, and short-duration trades.",
    whyItMatters:
      "Scalping requires a specific energy and real-time information flow that only a dedicated scalping room provides.",
    surfaces:
      "Communities specializing in sub-15-minute trades, order flow, and high-frequency analysis.",
    traderType:
      "Fast-twitch traders who thrive in high-speed environments with quick feedback loops.",
    filterKey: "trading_style",
    filterValue: "scalping",
    ring: 2,
  },
  {
    id: "day-trading",
    label: "Day Trading Focus",
    short: "Day Trading",
    meaning:
      "Communities built around intraday analysis, session-based execution, and closing positions before market close.",
    whyItMatters:
      "Day trading demands a daily rhythm — pre-market analysis, session execution, and post-market review. The right room keeps this rhythm alive.",
    surfaces:
      "Communities with daily pre-market calls, session recaps, and intraday strategy discussions.",
    traderType:
      "Active intraday traders who want structured daily workflows and session-based community activity.",
    filterKey: "trading_style",
    filterValue: "day_trading",
    ring: 2,
  },
  {
    id: "swing",
    label: "Swing & Position Trading",
    short: "Swing",
    meaning:
      "Patient communities focused on multi-day to multi-week positions, macro analysis, and deeper research.",
    whyItMatters:
      "Swing trading requires patience and conviction. The right community provides deep research, macro context, and the confidence to hold positions.",
    surfaces:
      "Research-focused communities with weekly analysis, macro commentary, and longer-horizon strategies.",
    traderType:
      "Patient traders who think in days to weeks, prefer research over speed, and value macro context.",
    filterKey: "trading_style",
    filterValue: "swing",
    ring: 2,
  },
  {
    id: "forex",
    label: "Forex Precision",
    short: "Forex",
    meaning:
      "Communities specializing in currency markets — major pairs, correlations, central bank analysis, and session-specific strategies.",
    whyItMatters:
      "Forex is the most liquid and session-dependent market. Specialized rooms understand the nuances that general trading communities miss.",
    surfaces:
      "Communities focused on currency pairs, session trading, and institutional forex concepts.",
    traderType:
      "Forex specialists who want deep knowledge of currency dynamics, not surface-level chart patterns.",
    filterKey: "asset_class",
    filterValue: "forex",
    ring: 2,
  },
  {
    id: "crypto",
    label: "Crypto Native Rooms",
    short: "Crypto",
    meaning:
      "Communities built for the 24/7 digital asset ecosystem — altcoins, DeFi, on-chain analysis, and exchange-specific strategies.",
    whyItMatters:
      "Crypto never sleeps. Native crypto rooms understand on-chain data, exchange dynamics, and the unique risk profiles of digital assets.",
    surfaces:
      "Communities focused on crypto markets, DeFi, and digital asset trading strategies.",
    traderType:
      "Crypto traders who want communities operating on crypto time — 24/7, exchange-native, and DeFi-aware.",
    filterKey: "asset_class",
    filterValue: "crypto",
    ring: 2,
  },
  {
    id: "stocks",
    label: "Equities & Options",
    short: "Stocks",
    meaning:
      "Communities focused on US equities, options flow, earnings plays, and equity market structure.",
    whyItMatters:
      "The equity market has unique dynamics — options flow, earnings cycles, and pre-market activity. Specialized rooms cover these deeply.",
    surfaces:
      "Communities with options analysis, earnings calendars, and equity-specific strategies.",
    traderType:
      "Traders focused on stocks and options who want pre-market analysis and flow interpretation.",
    filterKey: "asset_class",
    filterValue: "stocks",
    ring: 2,
  },
  {
    id: "london-session",
    label: "London Session Focus",
    short: "London",
    meaning:
      "Communities structured around the London trading session — the highest-volume forex and futures session of the day.",
    whyItMatters:
      "London is where institutional volume concentrates. Session-specific rooms align their entire rhythm to this critical window.",
    surfaces:
      "Communities with London session timing, institutional analysis, and session-specific strategies.",
    traderType:
      "Traders in European time zones or anyone who wants to specialize in the most liquid trading session.",
    filterKey: "session_focus",
    filterValue: "london",
    ring: 2,
  },
  {
    id: "risk-management",
    label: "Risk Management Focus",
    short: "Risk Mgmt",
    meaning:
      "Communities that emphasize position sizing, risk-reward ratios, drawdown limits, and capital preservation.",
    whyItMatters:
      "Risk management separates surviving traders from blown accounts. These communities drill discipline into every trade decision.",
    surfaces:
      "Communities with strict risk rules, position sizing tools, and loss prevention frameworks.",
    traderType:
      "Traders who understand that protecting capital is more important than maximizing gains.",
    filterKey: "risk_focused",
    filterValue: true,
    ring: 2,
  },
  {
    id: "signal-service",
    label: "Trade Signals & Alerts",
    short: "Signals",
    meaning:
      "Communities providing real-time trade alerts, entry/exit signals, and ready-to-execute ideas.",
    whyItMatters:
      "Signals give you actionable trade ideas while you learn. The best signal rooms also teach the reasoning behind each call.",
    surfaces:
      "Communities with signal channels, alert bots, and structured trade idea sharing.",
    traderType:
      "Traders who want actionable ideas delivered alongside educational context.",
    filterKey: "has_signals",
    filterValue: true,
    ring: 2,
  },
  {
    id: "prop-firm",
    label: "Prop Firm Preparation",
    short: "Prop Firm",
    meaning:
      "Communities specifically training traders to pass prop firm challenges and manage funded accounts.",
    whyItMatters:
      "Prop firm challenges have specific rules and psychology. These communities understand exactly what it takes to pass and stay funded.",
    surfaces:
      "Communities partnered with or focused on FTMO, True Forex Funds, and other prop firm challenges.",
    traderType:
      "Traders pursuing funded accounts who need challenge-specific strategies and risk frameworks.",
    filterKey: "prop_firm",
    filterValue: true,
    ring: 2,
  },
  {
    id: "research-analysis",
    label: "Research & Analysis",
    short: "Research",
    meaning:
      "Communities oriented around deep research — fundamental, macro, on-chain, sector — over rapid trade ideas.",
    whyItMatters:
      "Quality of conviction comes from quality of preparation. Research-first rooms build durable mental models, not disposable trade tips.",
    surfaces:
      "Long-form-first communities with weekly briefs, macro write-ups, and intermarket commentary.",
    traderType:
      "Analysts and swing traders who value depth of thinking over volume of activity.",
    filterKey: "trading_style",
    filterValue: "swing",
    ring: 2,
  },
] as const

/** Combined dimensions ordered by ring. */
export const COMMUNITY_DIMENSIONS: readonly CommunityDimension[] = [
  ...RING_0,
  ...RING_1,
  ...RING_2,
] as const

/** Dimensions grouped by ring. */
export const COMMUNITY_DIMENSIONS_BY_RING: Readonly<{
  0: readonly CommunityDimension[]
  1: readonly CommunityDimension[]
  2: readonly CommunityDimension[]
}> = {
  0: RING_0,
  1: RING_1,
  2: RING_2,
} as const

/** Ring titles — uppercase eyebrows used inside the radial template. */
export const RING_TITLES: Readonly<{
  0: string
  1: string
  2: string
}> = {
  0: "PLATFORM INTELLIGENCE",
  1: "SUPPORT STRUCTURE",
  2: "MARKET & STYLE",
} as const

/* ────────────────────────────────────────────────────────────────────
   2.  MOCK COMMUNITIES — verbatim from app/api/communities/route.ts
        plus stat triplets + asset-share presets read from the
        production screenshots.
   ──────────────────────────────────────────────────────────────────── */

export type AssetClass = "forex" | "crypto" | "stocks" | "futures" | "mixed"
export type TradingStyle = "scalping" | "day_trading" | "swing" | "mixed"
export type SessionFocus = "london" | "new_york" | "asia" | "multi_session"
export type Visibility = "paid" | "public"

export interface CommunityMentor {
  readonly id: string
  readonly displayName: string
  readonly title: string
  readonly verified: boolean
  /** 0–5 star rating. */
  readonly rating: number
  readonly totalStudents: number
  readonly isLead: boolean
  readonly yearsExperience: number
  readonly specialties: readonly string[]
}

export interface AssetShare {
  /** Display label — e.g. "BTC/USD". */
  readonly symbol: string
  /** 0–100 percentage. */
  readonly share: number
}

export interface Community {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly tagline: string
  readonly description: string
  readonly assetClass: AssetClass
  readonly tradingStyle: TradingStyle
  readonly sessionFocus: SessionFocus
  readonly visibility: Visibility
  readonly hasArchioAi: boolean
  readonly aiModelsDescription?: string
  readonly hasLiveCalls: boolean
  readonly hasMentorDashboard: boolean
  readonly verified: boolean
  readonly beginnerFriendly: boolean
  readonly membersCount: number
  readonly activeMembers: number
  /** 0–100 weekly activity score. */
  readonly weeklyActivity: number
  readonly postsPerWeek: number
  readonly isLiveNow: boolean
  readonly liveSessionTitle?: string
  readonly liveAttendeeCount?: number
  readonly tags: readonly string[]
  /** 7-entry array, Mon → Sun, 0–100 activity per day. */
  readonly weeklyHeatmap: readonly [number, number, number, number, number, number, number]
  readonly whoIsFor: string
  readonly whoIsNotFor: string
  readonly mentors: readonly CommunityMentor[]
  /* ── Screenshot-derived fields ─────────────────────────────────── */
  /** Win-rate percent. */
  readonly winRate: number
  /** Average risk-reward ratio. */
  readonly avgRR: number
  /** Signals fired per week. */
  readonly signalsPerWeek: number
  /** 4-row asset breakdown for the share row. */
  readonly assetShares: readonly [AssetShare, AssetShare, AssetShare, AssetShare]
  /** Region stamp shown next to the health bar. */
  readonly regionStamp: string
  /** Growth chip — e.g. "+22%". */
  readonly growthChip: string
}

/** All 8 mock communities. Order matches the production screenshots
 *  (Scalp Velocity, London Precision Lab, Wall Street Edge, Tokyo Flow,
 *   Foundation Academy, Neural Trading Lab, then the two not in the
 *   screenshots). */
export const MOCK_COMMUNITIES: readonly Community[] = [
  /* ── Scalp Velocity ── */
  {
    id: "a2-scalp",
    slug: "scalp-velocity",
    name: "Scalp Velocity",
    tagline: "Ultra-fast crypto scalping with real-time execution breakdowns",
    description:
      "High-intensity crypto scalping community running 24/7 across all major exchanges.",
    assetClass: "crypto",
    tradingStyle: "scalping",
    sessionFocus: "multi_session",
    visibility: "paid",
    hasArchioAi: true,
    aiModelsDescription:
      "The Scalp Velocity AI analyzes live order book data and provides real-time commentary on volume clusters, absorption patterns, and potential scalp zones.",
    hasLiveCalls: true,
    hasMentorDashboard: true,
    verified: true,
    beginnerFriendly: false,
    membersCount: 312,
    activeMembers: 203,
    weeklyActivity: 94,
    postsPerWeek: 67,
    isLiveNow: false,
    tags: ["crypto", "scalping", "high-frequency", "risk-management"],
    weeklyHeatmap: [90, 88, 95, 92, 89, 85, 72],
    whoIsFor: "Experienced traders comfortable with fast execution.",
    whoIsNotFor: "Swing traders or those who cannot handle rapid decision-making.",
    mentors: [
      {
        id: "m3",
        displayName: "Alex Mercer",
        title: "Chief Scalp Operator",
        verified: true,
        rating: 4.85,
        totalStudents: 520,
        isLead: true,
        yearsExperience: 7,
        specialties: ["Tape Reading", "Volume Profile", "Order Book"],
      },
    ],
    winRate: 74,
    avgRR: 2.4,
    signalsPerWeek: 67,
    assetShares: [
      { symbol: "BTC/USD", share: 40 },
      { symbol: "ETH/USD", share: 30 },
      { symbol: "SOL/USD", share: 18 },
      { symbol: "XRP/USD", share: 12 },
    ],
    regionStamp: "Multi",
    growthChip: "+22%",
  },

  /* ── London Precision Lab ── */
  {
    id: "a1-london",
    slug: "london-precision-lab",
    name: "London Precision Lab",
    tagline: "Institutional-grade London session execution with AI mentor intelligence",
    description:
      "Elite London session forex community focused on institutional order flow and precision entries. Our custom Archio AI model is trained on 3 years of live call recordings and proprietary supply & demand frameworks.",
    assetClass: "forex",
    tradingStyle: "day_trading",
    sessionFocus: "london",
    visibility: "paid",
    hasArchioAi: true,
    aiModelsDescription:
      "Our AI model is trained on 3+ years of live call recordings, strategy breakdowns, and trade reviews. It can explain setups, review your trade ideas, and provide 24/7 mentorship support in the mentor's voice and methodology.",
    hasLiveCalls: true,
    hasMentorDashboard: true,
    verified: true,
    beginnerFriendly: false,
    membersCount: 156,
    activeMembers: 89,
    weeklyActivity: 87,
    postsPerWeek: 34,
    isLiveNow: true,
    liveSessionTitle: "London Session Live Analysis - GBP/USD & EUR/USD",
    liveAttendeeCount: 34,
    tags: ["forex", "london", "order-flow", "institutional", "precision"],
    weeklyHeatmap: [78, 92, 88, 95, 82, 30, 15],
    whoIsFor:
      "Traders with 6+ months experience who want to specialize in London session forex.",
    whoIsNotFor: "Complete beginners or traders looking for signals only.",
    mentors: [
      {
        id: "m1",
        displayName: "Marcus Webb",
        title: "Head London Analyst",
        verified: true,
        rating: 4.92,
        totalStudents: 340,
        isLead: true,
        yearsExperience: 12,
        specialties: ["Order Flow", "Supply & Demand", "Institutional"],
      },
      {
        id: "m2",
        displayName: "Sarah Chen",
        title: "Senior Forex Strategist",
        verified: true,
        rating: 4.78,
        totalStudents: 180,
        isLead: false,
        yearsExperience: 8,
        specialties: ["Macro Analysis", "Correlations"],
      },
    ],
    winRate: 78,
    avgRR: 1.8,
    signalsPerWeek: 34,
    assetShares: [
      { symbol: "EUR/USD", share: 34 },
      { symbol: "GBP/JPY", share: 28 },
      { symbol: "XAU/USD", share: 22 },
      { symbol: "USD/JPY", share: 16 },
    ],
    regionStamp: "London",
    growthChip: "+23%",
  },

  /* ── Wall Street Edge ── */
  {
    id: "a5-wallst",
    slug: "wall-street-edge",
    name: "Wall Street Edge",
    tagline:
      "Institutional-grade US equities and options analysis with live pre-market calls",
    description:
      "Professional New York session community focused on US equities and options flow.",
    assetClass: "stocks",
    tradingStyle: "day_trading",
    sessionFocus: "new_york",
    visibility: "paid",
    hasArchioAi: false,
    hasLiveCalls: true,
    hasMentorDashboard: true,
    verified: true,
    beginnerFriendly: false,
    membersCount: 124,
    activeMembers: 67,
    weeklyActivity: 81,
    postsPerWeek: 29,
    isLiveNow: true,
    liveSessionTitle: "Pre-Market Analysis - SPY, NVDA, TSLA Focus",
    liveAttendeeCount: 28,
    tags: ["stocks", "options", "new-york", "equities", "flow"],
    weeklyHeatmap: [85, 88, 82, 90, 87, 25, 10],
    whoIsFor: "Traders focused on US equities and options who want pre-market analysis.",
    whoIsNotFor: "Forex-only or crypto-only traders.",
    mentors: [
      {
        id: "m7",
        displayName: "Michael Torres",
        title: "Options Flow Specialist",
        verified: true,
        rating: 4.87,
        totalStudents: 124,
        isLead: true,
        yearsExperience: 14,
        specialties: ["Options Flow", "Market Structure", "Pre-Market"],
      },
    ],
    winRate: 66,
    avgRR: 1.6,
    signalsPerWeek: 29,
    assetShares: [
      { symbol: "SPY", share: 32 },
      { symbol: "AAPL", share: 24 },
      { symbol: "TSLA", share: 24 },
      { symbol: "NVDA", share: 20 },
    ],
    regionStamp: "New York",
    growthChip: "+20%",
  },

  /* ── Tokyo Flow ── */
  {
    id: "a7-tokyo",
    slug: "tokyo-flow",
    name: "Tokyo Flow",
    tagline: "The only serious Asia session trading community on the platform",
    description:
      "Asia session specialist community for futures and forex covering Nikkei, gold, yen pairs, and Asian market microstructure.",
    assetClass: "futures",
    tradingStyle: "day_trading",
    sessionFocus: "asia",
    visibility: "paid",
    hasArchioAi: true,
    aiModelsDescription:
      "Our AI understands Asian market structure, BOJ policy nuances, and yen correlation patterns.",
    hasLiveCalls: true,
    hasMentorDashboard: true,
    verified: true,
    beginnerFriendly: false,
    membersCount: 98,
    activeMembers: 54,
    weeklyActivity: 73,
    postsPerWeek: 21,
    isLiveNow: false,
    tags: ["asia", "futures", "tokyo", "gold", "yen"],
    weeklyHeatmap: [82, 78, 85, 80, 76, 45, 30],
    whoIsFor:
      "Traders in Asian time zones or those wanting exposure to Tokyo/Sydney sessions.",
    whoIsNotFor: "Traders exclusively focused on London or NY sessions.",
    mentors: [
      {
        id: "m8",
        displayName: "Kenji Tanaka",
        title: "Asia Session Lead",
        verified: true,
        rating: 4.83,
        totalStudents: 98,
        isLead: true,
        yearsExperience: 10,
        specialties: ["Asia Session", "Yen Pairs", "Nikkei", "Gold"],
      },
    ],
    winRate: 80,
    avgRR: 2.0,
    signalsPerWeek: 21,
    assetShares: [
      { symbol: "ES", share: 38 },
      { symbol: "NQ", share: 30 },
      { symbol: "CL", share: 18 },
      { symbol: "GC", share: 14 },
    ],
    regionStamp: "Tokyo",
    growthChip: "+24%",
  },

  /* ── Foundation Academy ── */
  {
    id: "a3-foundation",
    slug: "foundation-academy",
    name: "Foundation Academy",
    tagline:
      "Your first 90 days in trading, guided by mentors who care about your success",
    description:
      "The most supportive beginner trading community on the platform. Structured 12-week curriculum covering price action, risk management, psychology, and your first live trades.",
    assetClass: "mixed",
    tradingStyle: "mixed",
    sessionFocus: "multi_session",
    visibility: "public",
    hasArchioAi: false,
    hasLiveCalls: true,
    hasMentorDashboard: true,
    verified: true,
    beginnerFriendly: true,
    membersCount: 534,
    activeMembers: 145,
    weeklyActivity: 72,
    postsPerWeek: 23,
    isLiveNow: false,
    tags: ["education", "beginner", "curriculum", "price-action", "psychology"],
    weeklyHeatmap: [65, 72, 78, 82, 75, 40, 28],
    whoIsFor:
      "Complete beginners who want a structured, safe environment to learn trading from zero.",
    whoIsNotFor: "Experienced traders looking for advanced strategies.",
    mentors: [
      {
        id: "m4",
        displayName: "Dr. Emily Foster",
        title: "Head of Education",
        verified: true,
        rating: 4.96,
        totalStudents: 534,
        isLead: true,
        yearsExperience: 15,
        specialties: ["Price Action", "Psychology", "Risk Management"],
      },
      {
        id: "m5",
        displayName: "James Rivera",
        title: "Beginner Coach",
        verified: true,
        rating: 4.88,
        totalStudents: 280,
        isLead: false,
        yearsExperience: 5,
        specialties: ["Beginner Education", "Chart Basics"],
      },
    ],
    winRate: 76,
    avgRR: 2.1,
    signalsPerWeek: 23,
    assetShares: [
      { symbol: "BTC/USD", share: 30 },
      { symbol: "EUR/USD", share: 28 },
      { symbol: "SPY", share: 24 },
      { symbol: "GBP/JPY", share: 18 },
    ],
    regionStamp: "Multi",
    growthChip: "+23%",
  },

  /* ── Neural Trading Lab ── */
  {
    id: "a8-neural",
    slug: "neural-trading-lab",
    name: "Neural Trading Lab",
    tagline:
      "Where traders and AI engineers build the future of intelligent trading systems",
    description:
      "Experimental community at the intersection of AI and trading. Building, testing, and deploying custom trading AI models.",
    assetClass: "mixed",
    tradingStyle: "mixed",
    sessionFocus: "multi_session",
    visibility: "paid",
    hasArchioAi: true,
    aiModelsDescription:
      "Multiple AI models including a market regime classifier, sentiment analyzer, and custom backtesting AI.",
    hasLiveCalls: true,
    hasMentorDashboard: true,
    verified: true,
    beginnerFriendly: false,
    membersCount: 64,
    activeMembers: 37,
    weeklyActivity: 69,
    postsPerWeek: 15,
    isLiveNow: false,
    tags: ["ai", "quantitative", "machine-learning", "backtesting", "experimental"],
    weeklyHeatmap: [55, 60, 68, 72, 65, 40, 25],
    whoIsFor:
      "Traders with programming skills interested in quantitative and AI-driven approaches.",
    whoIsNotFor: "Traders looking for manual chart-based strategies.",
    mentors: [
      {
        id: "m9",
        displayName: "Dr. Priya Sharma",
        title: "Quant Research Lead",
        verified: true,
        rating: 4.79,
        totalStudents: 64,
        isLead: true,
        yearsExperience: 9,
        specialties: ["Machine Learning", "Backtesting", "Python", "Quant"],
      },
    ],
    winRate: 66,
    avgRR: 1.6,
    signalsPerWeek: 15,
    assetShares: [
      { symbol: "BTC/USD", share: 30 },
      { symbol: "EUR/USD", share: 28 },
      { symbol: "SPY", share: 24 },
      { symbol: "GBP/JPY", share: 18 },
    ],
    regionStamp: "Multi",
    growthChip: "+20%",
  },

  /* ── Macro Swing Collective ── */
  {
    id: "a4-macro",
    slug: "macro-swing-collective",
    name: "Macro Swing Collective",
    tagline: "Macro-driven swing trading for patient, disciplined traders",
    description:
      "Patient, macro-driven swing trading community for serious traders. Weekly deep-dive sessions analyzing global macro events, intermarket correlations, and multi-week position management.",
    assetClass: "forex",
    tradingStyle: "swing",
    sessionFocus: "multi_session",
    visibility: "paid",
    hasArchioAi: true,
    aiModelsDescription:
      "Our macro AI model tracks 200+ economic indicators, central bank communications, and geopolitical events to provide context-aware analysis of your swing trade ideas.",
    hasLiveCalls: true,
    hasMentorDashboard: true,
    verified: true,
    beginnerFriendly: false,
    membersCount: 87,
    activeMembers: 42,
    weeklyActivity: 65,
    postsPerWeek: 12,
    isLiveNow: false,
    tags: ["swing", "macro", "commodities", "forex", "intermarket"],
    weeklyHeatmap: [45, 50, 55, 48, 52, 35, 20],
    whoIsFor: "Intermediate to advanced traders who think in weekly and monthly timeframes.",
    whoIsNotFor: "Scalpers, day traders who can't hold positions overnight.",
    mentors: [
      {
        id: "m6",
        displayName: "Robert Blackwell",
        title: "Macro Strategist",
        verified: true,
        rating: 4.91,
        totalStudents: 87,
        isLead: true,
        yearsExperience: 18,
        specialties: ["Macro Economics", "Central Banks", "Intermarket"],
      },
    ],
    winRate: 71,
    avgRR: 3.2,
    signalsPerWeek: 12,
    assetShares: [
      { symbol: "EUR/USD", share: 28 },
      { symbol: "USD/JPY", share: 24 },
      { symbol: "AUD/USD", share: 24 },
      { symbol: "XAU/USD", share: 24 },
    ],
    regionStamp: "Multi",
    growthChip: "+18%",
  },

  /* ── Discipline Circle ── */
  {
    id: "a6-discipline",
    slug: "discipline-circle",
    name: "Discipline Circle",
    tagline: "Maximum 50 traders. Maximum accountability. Zero noise.",
    description:
      "Small, serious trading accountability circle. No signals, no hype. Daily journal sharing, weekly peer reviews, and monthly performance retrospectives.",
    assetClass: "mixed",
    tradingStyle: "mixed",
    sessionFocus: "multi_session",
    visibility: "public",
    hasArchioAi: false,
    hasLiveCalls: false,
    hasMentorDashboard: false,
    verified: true,
    beginnerFriendly: true,
    membersCount: 47,
    activeMembers: 38,
    weeklyActivity: 58,
    postsPerWeek: 18,
    isLiveNow: false,
    tags: ["accountability", "journal", "discipline", "mindset", "peer"],
    weeklyHeatmap: [70, 75, 72, 78, 74, 55, 45],
    whoIsFor: "Traders at any level serious about building discipline and consistency.",
    whoIsNotFor: "Traders looking for signals, tips, or quick wins.",
    mentors: [],
    winRate: 68,
    avgRR: 2.2,
    signalsPerWeek: 0,
    assetShares: [
      { symbol: "BTC/USD", share: 25 },
      { symbol: "EUR/USD", share: 25 },
      { symbol: "SPY", share: 25 },
      { symbol: "NQ", share: 25 },
    ],
    regionStamp: "Multi",
    growthChip: "+15%",
  },
] as const

/* ────────────────────────────────────────────────────────────────────
   3.  COMMUNITY MICROCOPY — every Vantary-grade label, eyebrow, status
        pill, and CTA.  Imported by the templates instead of inlining
        strings, so a future copy edit touches only this file.
   ──────────────────────────────────────────────────────────────────── */

export const COMMUNITY_PILL_LABELS = {
  aiModel: "AI MODEL",
  liveCalls: "LIVE CALLS",
  dashboard: "DASHBOARD",
  verified: "VERIFIED",
  beginnerFriendly: "BEGINNER",
  session: "SESSION",
  style: "STYLE",
  asset: "ASSET",
  visibility: "TIER",
} as const

export const COMMUNITY_PILL_VALUES = {
  aiModelOn: "Archio AI",
  aiModelOff: "Standard",
  liveCallsOn: "Available",
  liveCallsLive: "Live Now",
  liveCallsOff: "Recorded",
  dashboardOn: "Analytics",
  dashboardOff: "Basic",
  verifiedOn: "Trusted",
  verifiedOff: "Pending",
  beginnerOn: "Friendly",
  beginnerOff: "Advanced",
  visibilityPaid: "Paid",
  visibilityPublic: "Public",
} as const

export const COMMUNITY_STATUS_LABELS = {
  liveNow: "LIVE NOW",
  liveAttendees: "ATTENDEES",
  weeklyActivity: "WEEKLY ACTIVITY",
  membersCount: "MEMBERS",
  activeMembers: "ACTIVE",
  postsPerWeek: "POSTS / WEEK",
  winRate: "WIN RATE",
  avgRR: "AVG R:R",
  signalsPerWeek: "SIGNALS / WK",
} as const

export const COMMUNITY_HEADLINES = {
  discoverEyebrow: "VANTARY · DISCOVERY",
  discoverHeadline: "Find your perfect ecosystem.",
  discoverPrelude:
    "Hover a node to teach. Click to refine. Your active filters trace a constellation through the centre — the matching ecosystems land in the resolver below.",
  discoverPromptPlaceholder:
    "Describe your ideal community, or click nodes to filter.",
  atlasEyebrow: "VANTARY · ATLAS",
  atlasHeadline: "Every ecosystem, ranked.",
  atlasPrelude:
    "The full Communities atlas. Filter the rail, sort by activity or members, drill into any card to open its profile in this same slot.",
  profileEyebrow: "VANTARY · PROFILE",
  profileHeadline: "Inside the ecosystem.",
  profilePrelude:
    "The full mentor manifest, the weekly heatmap, who this ecosystem serves and who it does not — preserved verbatim from the source brief.",
} as const

export const COMMUNITY_DRILL_FORWARD = {
  fromDiscover: [
    { id: "open-atlas", label: "Open atlas with these filters", routeId: "C-ATL-01" },
    { id: "save-preset", label: "Save filter preset", routeId: "C-DSC-02" },
    { id: "compare-top-3", label: "Compare top 3 matches", routeId: "C-CMP-01" },
    { id: "export-brief", label: "Export discovery brief", routeId: "C-DSC-03" },
  ],
  fromAtlas: [
    { id: "save-filter-set", label: "Save filter set", routeId: "C-ATL-02" },
    { id: "compare-top-3", label: "Compare top 3", routeId: "C-CMP-01" },
    { id: "send-mentor-hall", label: "Send to Mentor Hall", routeId: "C-ATL-03" },
    { id: "pin-top-1", label: "Pin top match", routeId: "C-ATL-04" },
  ],
  fromProfile: [
    { id: "join-community", label: "Join community", routeId: "C-PRF-01" },
    { id: "save-to-atlas", label: "Save to atlas", routeId: "C-PRF-02" },
    { id: "compare-current", label: "Compare to my current", routeId: "C-CMP-02" },
    { id: "open-mentors", label: "Open mentor manifest", routeId: "C-PRF-03" },
    { id: "subscribe-calls", label: "Subscribe to live calls", routeId: "C-PRF-04" },
  ],
} as const

/* ────────────────────────────────────────────────────────────────────
   4.  ASSET-CLASS WATERMARK — large dashed-mono lettering shown across
        the top of every card.
   ──────────────────────────────────────────────────────────────────── */

export const ASSET_WATERMARK_LABEL: Readonly<Record<AssetClass, string>> = {
  crypto: "CRYPTO",
  forex: "FOREX",
  stocks: "STOCKS",
  futures: "FUTURES",
  mixed: "MIXED",
} as const

/* ────────────────────────────────────────────────────────────────────
   5.  DAY KEYS — used by the weekly heatmap labels.
   ──────────────────────────────────────────────────────────────────── */

export const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const

/* ────────────────────────────────────────────────────────────────────
   6.  LOOKUPS — convenience getters used by the templates.
   ──────────────────────────────────────────────────────────────────── */

const COMMUNITY_BY_ID = new Map<string, Community>(
  MOCK_COMMUNITIES.map((c) => [c.id, c]),
)
const COMMUNITY_BY_SLUG = new Map<string, Community>(
  MOCK_COMMUNITIES.map((c) => [c.slug, c]),
)
const DIMENSION_BY_ID = new Map<string, CommunityDimension>(
  COMMUNITY_DIMENSIONS.map((d) => [d.id, d]),
)

export function findCommunityById(id: string): Community | null {
  return COMMUNITY_BY_ID.get(id) ?? null
}
export function findCommunityBySlug(slug: string): Community | null {
  return COMMUNITY_BY_SLUG.get(slug) ?? null
}
export function findDimensionById(id: string): CommunityDimension | null {
  return DIMENSION_BY_ID.get(id) ?? null
}

/* ────────────────────────────────────────────────────────────────────
   7.  FILTERING — pure function used by atlas + radial.
   ──────────────────────────────────────────────────────────────────── */

export interface CommunityFilters {
  readonly search?: string
  readonly assetClass?: AssetClass | ""
  readonly tradingStyle?: TradingStyle | ""
  readonly sessionFocus?: SessionFocus | ""
  readonly visibility?: Visibility | ""
  readonly hasArchioAi?: boolean
  readonly hasLiveCalls?: boolean
  readonly verified?: boolean
  readonly beginnerFriendly?: boolean
  readonly hasMentorDashboard?: boolean
  readonly liveNowOnly?: boolean
  readonly sortBy?: "activity" | "members" | "rating" | "newest"
}

export function filterCommunities(
  filters: CommunityFilters,
): readonly Community[] {
  let result: Community[] = [...MOCK_COMMUNITIES]
  if (filters.search) {
    const s = filters.search.toLowerCase()
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.description.toLowerCase().includes(s) ||
        c.tagline.toLowerCase().includes(s) ||
        c.tags.some((t) => t.toLowerCase().includes(s)),
    )
  }
  if (filters.assetClass) result = result.filter((c) => c.assetClass === filters.assetClass)
  if (filters.tradingStyle) result = result.filter((c) => c.tradingStyle === filters.tradingStyle)
  if (filters.sessionFocus) result = result.filter((c) => c.sessionFocus === filters.sessionFocus)
  if (filters.visibility) result = result.filter((c) => c.visibility === filters.visibility)
  if (filters.hasArchioAi) result = result.filter((c) => c.hasArchioAi)
  if (filters.hasLiveCalls) result = result.filter((c) => c.hasLiveCalls)
  if (filters.verified) result = result.filter((c) => c.verified)
  if (filters.beginnerFriendly) result = result.filter((c) => c.beginnerFriendly)
  if (filters.hasMentorDashboard) result = result.filter((c) => c.hasMentorDashboard)
  if (filters.liveNowOnly) result = result.filter((c) => c.isLiveNow)

  switch (filters.sortBy) {
    case "members":
      result.sort((a, b) => b.membersCount - a.membersCount)
      break
    case "rating":
      result.sort((a, b) => Number(b.verified) - Number(a.verified))
      break
    case "newest":
      result.reverse()
      break
    case "activity":
    default:
      result.sort((a, b) => b.weeklyActivity - a.weeklyActivity)
      break
  }
  return result
}

/* ────────────────────────────────────────────────────────────────────
   8.  DIMENSION → FILTER MAPPING — used when a radial node is clicked.
   ──────────────────────────────────────────────────────────────────── */

export function applyDimensionToFilters(
  base: CommunityFilters,
  dim: CommunityDimension,
  on: boolean,
): CommunityFilters {
  const next: { -readonly [K in keyof CommunityFilters]: CommunityFilters[K] } = {
    ...base,
  }
  switch (dim.filterKey) {
    case "asset_class":
      next.assetClass = on ? (dim.filterValue as AssetClass) : ""
      break
    case "trading_style":
      next.tradingStyle = on ? (dim.filterValue as TradingStyle) : ""
      break
    case "session_focus":
      next.sessionFocus = on ? (dim.filterValue as SessionFocus) : ""
      break
    case "visibility":
      next.visibility = on ? (dim.filterValue as Visibility) : ""
      break
    case "has_ai":
      next.hasArchioAi = on
      break
    case "has_live_calls":
      next.hasLiveCalls = on
      break
    case "verified":
      next.verified = on
      break
    case "beginner_friendly":
      next.beginnerFriendly = on
      break
    case "has_mentor_dashboard":
      next.hasMentorDashboard = on
      break
    case "sort_by":
      next.sortBy = on
        ? (dim.filterValue as "activity" | "members" | "rating" | "newest")
        : "activity"
      break
    default:
      break
  }
  return next
}
